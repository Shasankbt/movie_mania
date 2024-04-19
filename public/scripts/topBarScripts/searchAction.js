const searchInput = document.querySelector(".search-input")
const searchOutput = document.querySelector("#search-output-id")
console.log(movieCardSearchTemplate)
//const movieCardSearchTemplate = document.querySelector("[movie-card-search-template]")
//const movieCardSearchTemplate = movieCardSearchTemplate
let addn_wt = 2, subs_wt = 16, del_wt = 14;
let editDistLimit = 50
// let movies = null
function getEditDist(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1.includes(str2)) {
        return Math.round(0.5 * (str2.length - str1.length));
    }    

    let matrix = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) {
        matrix[i][0] = i * del_wt;
    }

    for (let j = 0; j <= str2.length; j++) {
        matrix[0][j] = j * addn_wt;
    }

    for (let i = 0; i < str1.length; i++) {
        for (let j = 0; j < str2.length; j++) {
            matrix[i+1][j+1] = Math.min(
                matrix[i][j+1] + del_wt,
                matrix[i+1][j] + addn_wt,
                matrix[i][j] + subs_wt * (str1[i] !== str2[j] ? 1 : 0)
            );
        }
    }

    return matrix[str1.length][str2.length];
}

function createMovieSearchCard(movie){
    // here the argument is an object parsed from json
    const card = movieCardSearchTemplate.content.cloneNode(true).children[0];
                
    const poster = card.querySelector('[poster]')
    const title = card.querySelector('[title]')

    //poster.src = movie.Poster;
    poster.src = "images/" + movie.imdbID + ".jpg"
    console.log("images/" + movie.imdbID + ".jpg")
    title.innerHTML = movie.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + movie.Year + "</span>";

    card.addEventListener("click" , () => {
        window.location.href = "/id=" + movie.Title;
    })

    return card
}

export function displayResults(input, movies){

    // to remove the previous cards for the fresh ones 
    for (let i = searchOutput.children.length - 1; i >= 0; i--) {
        const child = searchOutput.children[i];
            searchOutput.removeChild(child);        
    }

    if(input != ""){
        let editDists = movies.map((movie, idx) => [getEditDist(input, movie.Title), idx]);

        let filteredIndices = editDists.filter(tuple => tuple[0] < editDistLimit);

        let sortedIndices = filteredIndices.sort((a, b) => a[0] - b[0]).map(tuple => tuple[1]);

        for (let idx of sortedIndices) {
            console.log(editDists[idx][0], movies[idx]);
            searchOutput.appendChild(createMovieSearchCard(movies[idx]))
        }

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



