
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
let movieCardTemplate = document.createElement("template")
movieCardTemplate.innerHTML = movieCardTemplateString

window.movieCardSearchTemplateString = `
    <div class="movie-card-search">
        <div class="image-box"><img src="image.jpg" style="height: 100%;" poster></div>
        <p style="padding-left: 1rem; margin-top: 0.25rem; font-size: 1.1rem; font-weight: 600; opacity: 0.9; max-width: 25rem; overflow: hidden;" title></p>
    </div>
`;
let movieCardSearchTemplate = document.createElement("template");
movieCardSearchTemplate.innerHTML = movieCardSearchTemplateString;



function createMovieTemplateCard(cardTemplate, movie){
    const movieCard = cardTemplate.content.cloneNode(true).children[0]

    const poster = movieCard.querySelector("[poster]");
    const title = movieCard.querySelector("[title]");
    const moreInfo = movieCard.querySelector("[more-info]");
    
    movieCard.setAttribute("data-target", "/id=" + movie.Title)
    //poster.src = "images/" + movie.imdbID + ".jpg";
    poster.src = movie.Poster
    title.innerHTML = movie.Title;
    moreInfo.innerHTML = movie.Year + " &#x2022; " + "IMDB : " + movie.imdbRating;

    movieCard.addEventListener("click",() =>{
        window.location.href = movieCard.getAttribute('data-target');
    })

    return movieCard
}






//const movieCardTemplate = document.createRange().createContextualFragment(movieCardTemplateString);



//console.log(movieCardTemplate)
