function decodeEntities(encodedString) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
}

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

    list_parsed = JSON.parse(decodeEntities(list))
    if( list_parsed == {}) return {}

    weight_dict = {}
    filtered_movies = allMovies.filter(movie => list_parsed[movie.Title] !== undefined)

    filtered_movies.forEach(movie =>{
        rating = parseInt(list_parsed[movie.Title])
        movie["Genre"].forEach(genre =>{
            if(weight_dict[genre] === undefined) weight_dict[genre] =   [rating- (fullRating/2)]
            else weight_dict[genre].push(rating-(fullRating/2))
        })
    })
    console.log(list_parsed)
    console.log(weight_dict)
    return weight_dict
}

function render(list){
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
            allMovies = allMovies.filter(movie => getMovieWeight(weight_dict,movie) > 0).slice(0,recommendationsCount)
            allMovies.forEach(movie => movieGrid.appendChild(createMovieTemplateCard(cardTemplate, movie)))  
        })

    
}