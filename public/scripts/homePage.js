// including movieCardTemplate from template.js ( in home.ejs )
// function : fetches the data from movie.json, appends to grid in home.ejs
//            using the movieCardTemplate in decreasing imdb Rating

const cardTemplate = movieCardTemplate
const movieGrid = document.querySelector(".movie-grid")

fetch("movie.json")
    .then(res => res.json())
    .then(data => {
        data.sort((a,b) => b.imdbRating - a.imdbRating);
        data.forEach(movie =>{
            const movieCard = cardTemplate.content.cloneNode(true).children[0]

            const poster = movieCard.querySelector("[poster]");
            const title = movieCard.querySelector("[title]");
            const moreInfo = movieCard.querySelector("[more-info]");
            
            movieCard.setAttribute("data-target", "/id=" + movie.Title)
            try { poster.src = "images/" + movie.imdbID + ".jpg" }  // local image pull
            catch (error) {
                console.error('Error setting poster src:', error);
                poster.src = movie.Poster;                          // online image pull
            }
            title.innerHTML = movie.Title;
            moreInfo.innerHTML = movie.Year + " &#x2022; " + "IMDB : " + movie.imdbRating;

            movieCard.addEventListener("click",() =>{
                console.log("here")
                window.location.href = movieCard.getAttribute('data-target');
            })

            movieGrid.appendChild(movieCard); 
        })  
    })