function createCard(cardTemplate, movie){
    const movieCard = cardTemplate.content.cloneNode(true).children[0]

    const poster = movieCard.querySelector("[poster]");
    const title = movieCard.querySelector("[title]");
    const moreInfo = movieCard.querySelector("[more-info]");
    
    movieCard.setAttribute("data-target", "/id=" + movie.Title)
    //poster.src = "images/" + movie.imdbID + ".jpg";
    console.log(movie.Title)
    poster.src = movie.Poster
    title.innerHTML = movie.Title;
    moreInfo.innerHTML = movie.Year + " &#x2022; " + "IMDB : " + movie.imdbRating;

    movieCard.addEventListener("click",() =>{
        console.log("here")
        window.location.href = movieCard.getAttribute('data-target');
    })

    return movieCard
}

function getGenreDist(movie1, movie2){
    const commonGenres = movie1.Genre.filter(element => movie2.Genre.includes(element))
    return commonGenres.length
}

function getMovieObject(movieName){
    console.log(movieName)
    const apiKey = "cc454ece"
    const url = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

    let movieFromLocal = true;

    // try getting from the local data
    return fetch('movie.json')
        .then(res => res.json())
        .then(data => {
            let movieObject  = null;
            data.forEach(movie =>{
                if(movie.Title === movieName) {
                    movieObject = movie;
                    console.log("from Local");
                }
            })
            return movieObject; // if not found, returns false
        })
        .then(movieObject =>{
            if(movieObject === null){
                movieFromLocal = false;
                console.log("from internet");   // from api

                // ** use 'return fetch' to make the script wait for fetch to return
                return fetch(url)           
                    .then(res => res.json())
            }
            else return movieObject            
        })
}



function displaySimilarMovies(currentMovieName){
    const recommendationCount = 10


    console.log(currentMovieName)
    getMovieObject(currentMovieName).then(currentMovie => {

    

    console.log(currentMovie)
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
                    console.log(getGenreDist(movie, currentMovie))
                    destination.appendChild(createCard(cardTemplate , movie)); 
                }
            })  
        })

    })
}