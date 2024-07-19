import * as template from "/scripts/template.js"

const searchInput = document.querySelector(".search-input")
const searchOutput = document.querySelector("#search-output-id")

let addn_wt = 2.25, subs_wt = 16, del_wt = 14 ,outer_addn_wt = 0.35;

let editDistLimit = 75
let maxResults = 40

function extractAlphanumeric(inputStr) {
    return inputStr.replace(/[^a-zA-Z0-9]/g, '');
}

function getEditDist(str1, str2) {
    str1 = extractAlphanumeric(str1.toLowerCase());
    str2 = extractAlphanumeric(str2.toLowerCase());

    if (str1.length >= 5 &&  str2.includes(str1)) {
        console.log(str2)
        return Math.round(0.15 * (str2.length - str1.length));
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



export function displayResults(user_search_input, titles, movies, series){

    // to remove the previous cards for the fresh ones 
    for (let i = searchOutput.children.length - 1; i >= 0; i--) {
        const child = searchOutput.children[i];
            searchOutput.removeChild(child);        
    }
    let results_count = 0
    if(user_search_input != ""){
        let distArray = [];
        console.log(titles)
        for(let [title, imdbID] of titles){
            const edit_dist = getEditDist(user_search_input, title)
            if(edit_dist <= editDistLimit){
                distArray.push([imdbID, edit_dist])
                results_count += 1
            }
        }
        distArray.sort((a, b) => a[1] - b[1]);

        // let editDists = Object.values(movies).map((movie, idx) => [getEditDist(input, movie.Title), idx]);
        // let filteredIndices = editDists.filter(tuple => tuple[0] < editDistLimit);
        // let sortedIndices = filteredIndices.sort((a, b) => a[0] - b[0]).map(tuple => tuple[1]);

        distArray.slice(0, maxResults).forEach( item => {
            console.log(getEditDist("all quite on the western front","All Quiet on the Western Front"))
            let search_result = null
            if(item[0] in movies)
                search_result = movies[item[0]]
            else if(item[0] in series)
                search_result = series[item[0]]
        
            searchOutput.appendChild(template.createMovieSearchCard(search_result))
        })

        if(searchOutput.children.length == 0){
            const para = document.createElement('p')
            para.innerHTML = "no Search Results found"
            para.setAttribute("id", "no-search-match-id")
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

