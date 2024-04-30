import * as sf from "./searchAction.js"
import * as uf from "./userActions.js"


let movies = null
const searchBarDiv = document.querySelector(".search-bar-div")

fetch('movieShort.json')
    .then(res => res.json())
    .then(data => {movies = data})

document.addEventListener("DOMContentLoaded", () =>{
    // navigating through webpages
    const children = document.querySelector(".page-navigation-div").children
    for (let i = 0; i < children.length; i++) {
        const button = children[i];
        button.addEventListener("click" ,() =>{
            window.location.href = button.getAttribute("data-href")
        })
    }
    
    // shows results in the event of input
    searchBarDiv.addEventListener("input" , e=>{
        sf.displayResults(e.target.value, movies)
    })

    // user details and login/logout part 
    document.body.addEventListener("click", (event) =>{
        const userButton = document.querySelector(".user-button");
        const userDetailsDiv = document.querySelector(".user-details")
        if(event.target != userDetailsDiv && event.target != userButton && !userDetailsDiv.contains(event.target))
            uf.closeUserDetails()
    
        const searchBarDiv = document.querySelector(".search-bar-div")
        if(event.target != searchBarDiv)
            sf.removeResults()
    })
})
