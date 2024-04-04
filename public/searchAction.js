const searchInput = document.querySelector(".search-input")
const searchOutput = document.querySelector("#search-output-id")
const searchBarDiv = document.querySelector(".search-bar-div")
const movieCardSearchTemplate = document.querySelector("[movie-card-search-template]")

let movies = null


function displayResults(input){
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

        if(searchOutput.children.length == 0){
            const para = document.createElement('p')
            para.innerHTML = " no movie found "
            searchOutput.appendChild(para)
        }
        searchOutput.lastChild.style.borderBottomRightRadius = "1rem";
        searchOutput.lastChild.style.borderBottomLeftRadius = "1rem";

        searchInput.style.borderBottomRightRadius = "0rem";
        searchInput.style.borderBottomLeftRadius = "0rem";
    }
    else{
        searchInput.style.borderBottomRightRadius = "1rem";
        searchInput.style.borderBottomLeftRadius = "1rem";
    }
}

// export cannot be inside a event listener 
// when user clicks away from search results to escape
export function removeResults(){
    for (let i = searchOutput.children.length - 1; i >= 0; i--) {
        const child = searchOutput.children[i];
            searchOutput.removeChild(child);        
    }
    searchInput.style.borderBottomRightRadius = "1rem";
    searchInput.style.borderBottomLeftRadius = "1rem";
}

// searching movies in the file and saving 
fetch('top100.json')
    .then(res => res.json())
    .then(data => {movies = data})

// shows results in the event of input
searchBarDiv.addEventListener("input" , e=>{
    const input = e.target.value;
    displayResults(input)
    // to remove the previous cards for the fresh ones 
})

