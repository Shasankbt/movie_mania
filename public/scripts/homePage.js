// including movieCardTemplate from template.js ( in home.ejs )
// function : fetches the data from movie.json, appends to grid in home.ejs
//            using the movieCardTemplate in decreasing imdb Rating

import * as template from "/scripts/template.js"
// console.log(template.movieCardTemplate)
// setTimeout( () => {
//     console.log(template.movieCardTemplate)
// }, 1000)
// const cardTemplate = template.movieCardTemplate
const movieGrid = document.querySelector(".movie-grid")

fetch("movie.json")
    .then(res => res.json())
    .then(data => {
        data.sort((a,b) => b.imdbRating - a.imdbRating);
        data.forEach(movie =>{
            movieGrid.appendChild(template.createMovieTemplateCard(movie)); 
        })  
    })