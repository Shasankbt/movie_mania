// GetMovieObject is a function in a seperate file which is included in the html
// making it common with this js and renderMoviePage.js

// ______________________
// include : template.js
// from : ; moviepage.ejs

import * as template from "/scripts/template.js"

function getMovieObjectByName(movieName){
    return fetch('movie.json')
        .then(res => res.json())
        .then(data => {
            let movieObject  = null;
            data.forEach(movie =>{ if(movie.Title === movieName) movieObject = movie; })
            return movieObject;
        })
}


function getGenreDist(movie1, movie2){
    if(movie1 === null || movie2 === null) return 0
    const commonGenres = movie1.Genre.filter(element => movie2.Genre.includes(element))
    return commonGenres.length
}

export function displaySimilarMovies(currentMovieName){
    const recommendationCount = 10

    getMovieObjectByName(currentMovieName).then(currentMovie => {
    // * refer to the comments above
    
    //const cardTemplate = document.querySelector("[movie-card-template]");
    const destination = document.querySelector(".related-movies-gird")

    fetch("all_movies.json")
        .then(res => res.json())
        .then(data => {
            data = Object.values(data).filter(movie => (movie !== null))
            data.sort((a,b) => b.imdbRating - a.imdbRating)
            data.sort((a,b) => getGenreDist(b,currentMovie) - getGenreDist(a,currentMovie))
            data = data.slice(0, recommendationCount + 1) // +1 for compensating the current movie itself
            data.forEach(movie =>{
                if(movie.Title !== currentMovieName){
                    destination.appendChild(template.createMovieTemplateCard(movie)); 
                }
            })  
        })

    })
}