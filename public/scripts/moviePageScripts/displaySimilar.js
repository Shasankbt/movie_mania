// GetMovieObject is a function in a seperate file which is included in the html
// making it common with this js and renderMoviePage.js


function createCard(cardTemplate, movie){
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

function getGenreDist(movie1, movie2){
    const commonGenres = movie1.Genre.filter(element => movie2.Genre.includes(element))
    return commonGenres.length
}


function displaySimilarMovies(currentMovieName){
    const recommendationCount = 10

    getMovieObject(currentMovieName).then(currentMovie => {
    // * refer to the comments above
    
    const cardTemplate = document.querySelector("[movie-card-template]");
    const destination = document.querySelector(".similar-movies")

    fetch("movie.json")
        .then(res => res.json())
        .then(data => {

            data.sort((a,b) => b.imdbRating - a.imdbRating)
            data.sort((a,b) => getGenreDist(b,currentMovie) - getGenreDist(a,currentMovie))
            data = data.slice(0, recommendationCount + 1) // +1 for compensating the current movie itself
            data.forEach(movie =>{
                if(movie.Title !== currentMovie.Title){
                    destination.appendChild(createCard(cardTemplate , movie)); 
                }
            })  
        })

    })
}