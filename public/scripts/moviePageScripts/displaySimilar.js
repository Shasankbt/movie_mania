// GetMovieObject is a function in a seperate file which is included in the html
// making it common with this js and renderMoviePage.js

// ______________________
// include : template.js
// from : ; moviepage.ejs



function getGenreDist(movie1, movie2){
    const commonGenres = movie1.Genre.filter(element => movie2.Genre.includes(element))
    return commonGenres.length
}

function displaySimilarMovies(currentMovieName){
    const recommendationCount = 10

    getMovieObject(currentMovieName).then(currentMovie => {
    // * refer to the comments above
    
    const cardTemplate = movieCardTemplate; // from template.js
    //const cardTemplate = document.querySelector("[movie-card-template]");
    const destination = document.querySelector(".similar-movies")

    fetch("movie.json")
        .then(res => res.json())
        .then(data => {

            data.sort((a,b) => b.imdbRating - a.imdbRating)
            data.sort((a,b) => getGenreDist(b,currentMovie) - getGenreDist(a,currentMovie))
            data = data.slice(0, recommendationCount + 1) // +1 for compensating the current movie itself
            data.forEach(movie =>{
                if(movie.Title !== currentMovie.Title){
                    destination.appendChild(createMovieTemplateCard(cardTemplate , movie)); 
                }
            })  
        })

    })
}