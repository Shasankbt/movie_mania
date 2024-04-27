function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function getMovieWeight(weight_dict, movieObj){
    genres = movieObj.Genre
    tot_weight = 0
    genres.forEach(genre=>{
        if(weight_dict[genre] !== undefined){
            tot_weight += sumArray(weight_dict[genre])/weight_dict[genre].length
            
        }
    })
    return tot_weight
}

const fullRating = 5

function getWeightDict(list, allMovies){

    // list_parsed = JSON.parse(list)
    if( list == {}) return {}

    weight_dict = {}
    filtered_movies = allMovies.filter(movie => list[movie.Title] !== undefined)

    filtered_movies.forEach(movie =>{
        rating = parseInt(list[movie.Title])
        movie["Genre"].forEach(genre =>{
            if(weight_dict[genre] === undefined) weight_dict[genre] =   [rating- (fullRating/2)]
            else weight_dict[genre].push(rating-(fullRating/2))
        })
    })
    console.log(list)
    console.log(weight_dict)
    return weight_dict
}

function getSuggestions(list){
    const recommendationsCount = 15
    const cardTemplate = movieCardTemplate;
    const movieGrid = document.querySelector(".movie-grid")

    fetch("movie.json")
        .then(res => res.json())
        .then(allMovies => {
            weight_dict =  getWeightDict(list,allMovies)
            allMovies.sort((a,b) => getMovieWeight(weight_dict, b) - getMovieWeight(weight_dict, a));
            
            allMovies.forEach(movie =>{
                console.log(getMovieWeight(weight_dict, movie))
            })
            unwatchedMovies = allMovies.filter(movie => list[movie.Title] === undefined)
            favorableSuggestions = unwatchedMovies.filter(movie => getMovieWeight(weight_dict,movie) > 0).slice(0,recommendationsCount)
            favorableSuggestions.forEach(movie => movieGrid.appendChild(createMovieTemplateCard(cardTemplate, movie)))  
        })

    
}