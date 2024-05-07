function getPosterUrl(movieId, movies, img_dir) {
    const localPosterUrl = `/${img_dir}/${movieId}.jpg`;
  
    return fetch(localPosterUrl)
      .then(response => {
        if (response.ok) {
          return localPosterUrl; // Image found locally
        } else {
          throw new Error("Local image not found");
        }
      })
      .catch(error => {
        console.warn(`Unable to get poster locally for movie ${movieId}: ${error}`);
        // Try fetching the poster online
        const onlinePosterUrl = movies[movieId]?.Poster;
        if (onlinePosterUrl) {
          return onlinePosterUrl;
        } else {
          console.warn(`Poster URL not available for movie ${movieId}`);
          return ""; // or any default image URL
        }
      });
  }
    

document.addEventListener("DOMContentLoaded", () => {

    const awardsPopup = document.querySelector(".awards-popup")
    const popupBackdrop = document.querySelector(".backdrop")
    popupBackdrop.style.transition = "0.5s"
    awardsPopup.style.transition = "0.5s"

    function showAwardsPopup(year, lib, movies){
        // opening animation : 
        popupBackdrop.style.display = "block";  
        awardsPopup.style.display = "block"        
        setTimeout(()=>{
            popupBackdrop.style.backdropFilter = "blur(10px)"
            awardsPopup.style.top = "4rem"
        }, 50)
        
        // rendering the awards for the year
        const movieAwardTemplateLeft = document.querySelector("[movie-awards-container-left-template]")
        const movieAwardTemplateRight = document.querySelector("[movie-awards-container-right-template]")
        const listContainer = document.querySelector(".awards-popup")

        listContainer.innerHTML = ""
        
        let count = 1
        for(let id in lib[year]){
            let card;
            if(count % 2 == 1){
                card = movieAwardTemplateLeft.content.cloneNode(true).children[0]
            }
            else{
                card = movieAwardTemplateRight.content.cloneNode(true).children[0]
            }
            count += 1
            
            
            card.querySelector("[movie-title]").innerHTML = movies[id]["Title"]
            getPosterUrl(id, movies, "images_highres")
                .then(finalPosterUrl => {
                    card.querySelector("img").src = finalPosterUrl;
                    card.querySelector(".movie-awards-backdrop").style.backgroundImage = "url(" + finalPosterUrl + ")"
                });
            const awardsPlaceholder = card.querySelector(".award-titles")
            lib[year][id].forEach(award =>{
                const para = document.createElement("p")
                para.innerHTML = award
                awardsPlaceholder.appendChild(para)
            })

            card.addEventListener("click" , ()=>{
                window.location.href = "/id=" + movies[id]["Title"]
            })
    
            listContainer.appendChild(card)
        }
    }

    fetch("oscar_lib.json")
        .then(data => data.json())
        .then(lib => {
            const template = document.querySelector("[year-awards-card-template]")
            const destination = document.querySelector(".card-grid")

            fetch("oscar_movies.json")
                .then(movieData => movieData.json())
                .then(movies => {

                    for(let year in lib){
                        const card = template.content.cloneNode(true).children[0]
                        const awards = lib[year]

                        // sorting the movies based on number of awards
                        const awardCounts = {};
                        for (const movie in awards) {
                          awardCounts[movie] = awards[movie].length;
                        }
                        const sortedMovies = Object.keys(awardCounts).sort((a, b) => awardCounts[b] - awardCounts[a]);
                        
                        card.querySelector(".year-awards-card-title").innerHTML = "<p>" + year + "</p>"
                        const images = card.querySelectorAll("img")
                        for(let i = 0; i<4 ; i++){
                            const movieId = sortedMovies[i]
                            getPosterUrl(movieId, movies, "images_lowres")
                                .then(finalPosterUrl => {
                                    images[i].src = finalPosterUrl;
                                });
                        }

                        card.addEventListener("click", ()=>{
                            showAwardsPopup(year, lib, movies)
                        })

                        destination.appendChild(card)
                    }

                    
                })

            
        })

    popupBackdrop.addEventListener('click' , ()=>{
        popupBackdrop.style.backdropFilter = "blur(0px)"
        awardsPopup.style.top = "100%"
        setTimeout(() => {
            popupBackdrop.style.display = "none";  
            awardsPopup.style.display = "none"  
        }, 500);
        
        
    })
})