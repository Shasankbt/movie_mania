// GetMovieObject is a function in a seperate file which is included in the html
// making it common with this js and renderMoviePage.js

// ______________________
// include : template.js
// from : ; moviepage.ejs

import * as template from "/scripts/template.js"

export function renderSimilarMovies(data){
    const destination = document.querySelector(".related-movies-grid");
    data.forEach(movie =>{
        destination.appendChild(template.createMovieTemplateCard(movie)); 
    })
}