import * as routes from "/scripts/routesManager.js"

// Define the template globally
window.movieCardTemplateString = `
    <div class="movie-card" data-target="">
        <div class="image-box"><img style="height: 100%;" poster></div>
        <div class="info-box">
            <p class="title" title></p>
            <p class="more-info" more-info></p>
        </div>
    </div>
`;
export let movieCardTemplate = document.createElement("template")
movieCardTemplate.innerHTML = movieCardTemplateString

window.movieCardSearchTemplateString = `
    <div class="movie-card-search">
        <div class="image-box"><img src="image.jpg" style="height: 100%;" poster></div>
        <p style="padding-left: 1rem; margin-top: 0.25rem; font-size: 1.1rem; font-weight: 600; opacity: 0.9; max-width: 25rem; overflow: hidden;" title></p>
    </div>
`;
export let movieCardSearchTemplate = document.createElement("template");
movieCardSearchTemplate.innerHTML = movieCardSearchTemplateString;

function getPosterUrl(movieId, movie, img_dir) {
    const localPosterUrl = `/${img_dir}/${movieId}.jpg`;
  
    return fetch(localPosterUrl)
      .then(response => {
        if (response.ok) {
          return localPosterUrl; // Image found locally
        } else {
          throw new Error("Local image not found");
        }
      })
      .catch(error => {
        console.warn(`Unable to get poster locally for movie ${movieId}: ${error}`);
        // Try fetching the poster online
        const onlinePosterUrl = movie["imdbID"]?.Poster;
        if (onlinePosterUrl) {
          return onlinePosterUrl;
        } else {
          console.warn(`Poster URL not available for movie ${movieId}`);
          return ""; // or any default image URL
        }
      });
  }


export function createMovieTemplateCard(movie){
    const movieCard = movieCardTemplate.content.cloneNode(true).children[0]

    const poster = movieCard.querySelector("[poster]");
    const title = movieCard.querySelector("[title]");
    const moreInfo = movieCard.querySelector("[more-info]");
    
    movieCard.setAttribute("data-target",routes.getMoviePageAddress(movie["imdbID"]))
    getPosterUrl(movie["imdbID"], movie, "images_highres")
        .then(finalPosterUrl => {poster.src = finalPosterUrl;});
    title.innerHTML = movie.Title;
    moreInfo.innerHTML = movie.Year + " &#x2022; " + "IMDB : " + movie.imdbRating;

    movieCard.addEventListener("click",() =>{
        window.location.href = movieCard.getAttribute('data-target');
    })

    return movieCard
}

export function createMovieSearchCard(movie){
    // here the argument is an object parsed from json
    const card = movieCardSearchTemplate.content.cloneNode(true).children[0];
                
    const poster = card.querySelector('[poster]')
    const title = card.querySelector('[title]')

    //poster.src = movie.Poster;
    poster.src = "images_lowres/" + movie.imdbID + ".jpg"
    title.innerHTML = movie.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + movie.Year + "</span>";

    card.addEventListener("click" , () => {
        window.location.href = routes.getMoviePageAddress(movie['imdbID']);
    })

    return card
}






//const movieCardTemplate = document.createRange().createContextualFragment(movieCardTemplateString);



//console.log(movieCardTemplate)
