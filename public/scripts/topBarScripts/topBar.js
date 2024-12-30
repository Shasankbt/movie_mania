import * as sf from "./searchAction.js"
import * as uf from "./userActions.js"
import { getFileLocation } from "/scripts/routesManager.js"


let titles_map = null
let movies = null
let series = null
const searchBarDiv = document.querySelector(".search-bar-div")

fetch("/shortData/titles", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({})
})
    .then(res => res.json())
    .then(data => {titles_map = new Map(Object.entries(data))})

fetch("/shortData/movies-short", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({})
})
    .then(res => res.json())
    .then(data => {movies = data})

fetch("/shortData/series-short", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({})
})
    .then(res => res.json())
    .then(data => {series = data})

console.log("titles_map: ", titles_map)

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
        sf.displayResults(e.target.value, titles_map, movies, series)
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
