import { getPosterUrl } from "../../template.js";

export function renderOverview(data){
    document.getElementById('title-id').innerHTML = data.Title;

    const info = document.querySelector('.info');
    const yearAndRuntime = document.createElement('p');
    const genre = document.createElement('p');
    const reviews = document.createElement('p');
    const rating = document.createElement('p');

    yearAndRuntime.innerHTML = data.Year + " &#x2022; " + data.Runtime;
    genre.innerHTML = data.Genre;
    reviews.innerHTML = "IMDb rating : " + data.imdbRating + "<br>"  + "FilmCritic score : <span id='internal-rating'></span>";
    rating.innerHTML = "Rating : " +  data.Rated;
    
    info.appendChild(yearAndRuntime);
    info.appendChild(genre);
    info.appendChild(reviews);
    info.appendChild(rating);

    if(data.Quotes !== undefined || data.Quotes == [])
    document.querySelector(".quote").innerHTML = '"' + data.Quotes[0] + '"'

    const poster = document.getElementById('movie-poster-id');
    const backdrop = document.querySelector('.backdrop-image');

    getPosterUrl(data,  "images_highres")
        .then(finalPosterUrl => {
            poster.src = finalPosterUrl;
            backdrop.style.backgroundImage = "url(" + finalPosterUrl + ")"
        });
}