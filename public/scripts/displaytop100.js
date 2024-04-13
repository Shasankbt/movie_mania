const cardTemplate = document.querySelector("[movie-card-template]");
const movieGrid = document.querySelector(".movie-grid")

fetch("top100.json")
    .then(res => res.json())
    .then(data => {

        data.sort((a,b) => b.imdbRating - a.imdbRating);
        data.forEach(movie =>{
            const movieCard = cardTemplate.content.cloneNode(true).children[0]

            const poster = movieCard.querySelector("[poster]");
            const title = movieCard.querySelector("[title]");
            const moreInfo = movieCard.querySelector("[more-info]");
            
            movieCard.setAttribute("data-target", "/id=" + movie.Title)
            poster.src = "images/" + movie.imdbID + ".jpg";
            title.innerHTML = movie.Title;
            moreInfo.innerHTML = movie.Year + " &#x2022; " + "IMDB : " + movie.imdbRating;

            movieCard.addEventListener("click",() =>{
                console.log("here")
                window.location.href = movieCard.getAttribute('data-target');
            })

            movieGrid.appendChild(movieCard); 

        })  
    })