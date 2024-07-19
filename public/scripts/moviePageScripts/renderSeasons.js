const seasonsAndEpisodes = document.querySelector(".seasons-and-episodes")
  
function setActive(season_header) {
    for (let all_headers of season_header.parentNode.children) 
        all_headers.classList.remove("active");
    season_header.classList.add("active")
}



function convertToMinutes(timeStr) {
    let hours = 0;
    let minutes = 0;
    if(timeStr.includes("h"))
        hours = parseInt(timeStr.split("h")[0])
    if(timeStr.includes("m"))
        minutes = parseInt(timeStr.split("m")[0])
    
    return hours * 60 + minutes;
    
  }
  function convertToHoursAndMinutes(totalMinutes) {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  

  
function showSeasonDetails(parent_imdbID, season_header, season_name, season_contents, episodeData) {
    const season_name_short = "S" + season_name.split("-")[1]
  
    const seasonDetails = document.querySelector(".season-details")
    const episodeDetailsTemplate = document.querySelector("[episode-details-template]")
  
  
    for (let i = seasonDetails.children.length - 1; i > 0; i--) {
      seasonDetails.removeChild(seasonDetails.children[i]);
    }
    setActive(season_header)

    let total_rating = 0
    let total_runtime = 0
    let rating_count = 0
    // here the counts are individual keeping in mind that some keys can be missing in 
    // the episode object 

    for (let [episode_name, episode_id] of Object.entries(season_contents)) {
        const episode_obj = episodeData[episode_id]

        const episode_name_short = "E" + episode_name.split("-")[1]
    
        let card = episodeDetailsTemplate.content.cloneNode(true).children[0]
        card.querySelector("[episode-index-and-title]").innerHTML = `<span class="extra-contents">${season_name_short} • ${episode_name_short} • </span>${episode_obj["Title"]}`
    
        let string = ''
        if(episode_obj["Released"] !== undefined)
            string += `<span class="extra-contents">${episode_obj["Released"].split("(")[0]} • </span>`
        if(episode_obj["imdbRating"] !== undefined)
            total_rating += parseFloat(episode_obj["imdbRating"]) ; rating_count += 1
            string += `${episode_obj["imdbRating"]}/10</p>`
        if(episode_obj["Runtime"] !== undefined)
            total_runtime += convertToMinutes(episode_obj["Runtime"])
    
        card.querySelector("button").addEventListener("click", ()=>{
            window.location.href = `/series/${parent_imdbID}/episode/${episode_obj["imdbID"]}`
        })
        card.querySelector("[episode-release-and-rating]").innerHTML = string
        seasonDetails.appendChild(card)
    }

    console.log("avg rating", total_rating/rating_count)
    console.log("avg_time", total_runtime)

    const topSectionContents = document.querySelector(".top-section").querySelectorAll("p")
    topSectionContents[0].innerHTML = `Watchtime: ${convertToHoursAndMinutes(total_runtime)}`
    topSectionContents[1].innerHTML = `${season_name} • ${Object.entries(season_contents).length} Episodes`
    topSectionContents[2].innerHTML = `<span class="extra-contents">avg. rating:</span> ${(total_rating/rating_count).toFixed(2)}/10`
    console.log(topSectionContents[2])
    seasonDetails.querySelector(".close-details").addEventListener("click", () => {
      season_header.classList.remove("active")
      seasonsAndEpisodes.classList.add("full-view")
      seasonsAndEpisodes.classList.remove("side-view")
    })
  
  }

export function renderSeasons(episodes, parent_imdbID, episodeData){
    console.log(episodeData)
    const seasonHeadersContainer = document.querySelector(".season-headers-container")
    const seasonHeaderTemplate = document.querySelector("[season-header-template]")

    for (let [season_name, season_contents] of Object.entries(episodes)) {
        let card = seasonHeaderTemplate.content.cloneNode(true).children[0]
        card.querySelector("[season]").innerHTML = season_name
        console.log(season_contents)
        card.querySelector("[episode-count]").innerHTML = Object.keys(season_contents).length + " Episodes"
        card.querySelector("button").addEventListener("click", () => {
            seasonsAndEpisodes.classList.add("side-view")
            seasonsAndEpisodes.classList.remove("full-view")
            showSeasonDetails(parent_imdbID, card, season_name, season_contents, episodeData)
        })
        seasonHeadersContainer.appendChild(card)
    }
}   
