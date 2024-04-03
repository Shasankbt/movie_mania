const searchInput = document.querySelector(".search-input")
const searchOutput = document.querySelector("#search-output-id")
const searchBarDiv = document.querySelector(".search-bar-div")
const movieCardSearchTemplate = document.querySelector("[movie-card-search-template]")

console.log(movieCardSearchTemplate)

let movies = null
fetch('top100.json')
    .then(res => res.json())
    .then(data => {movies = data})

searchBarDiv.addEventListener("input" , e=>{
    const input = e.target.value;

    // to remove the previous cards for the fresh ones 
    for (let i = searchOutput.children.length - 1; i >= 0; i--) {
        const child = searchOutput.children[i];
            searchOutput.removeChild(child);        
    }
    if(input != ""){
        movies.forEach(movie => {
            if(movie.Title.toLowerCase().includes(input.toLowerCase())){
                const card = movieCardSearchTemplate.content.cloneNode(true).children[0];
                
                const poster = card.querySelector('[poster]')
                const title = card.querySelector('[title]')

                poster.src = "images/" + movie.imdbID + ".jpg";
                title.innerHTML = movie.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + movie.Year + "</span>";

                card.addEventListener("click" , () => {
                    window.location.href = "/id=" + movie.Title;
                })

                searchOutput.appendChild(card)
            }
            
        })
        searchOutput.lastChild.style.borderBottomRightRadius = "1rem";
        searchOutput.lastChild.style.borderBottomLeftRadius = "1rem";

        // searchInput.style.borderBottomRightRadius = "0rem";
        // searchInput.style.borderBottomLeftRadius = "0rem";
        // searchBarDiv.style.height = "10rem";
    }
    else{
        // searchBarDiv.style.height = "2rem";
        // searchInput.style.borderRadius = "1rem";
    }
})