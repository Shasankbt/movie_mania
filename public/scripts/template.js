import * as routes from "/scripts/routesManager.js"

// Define the template globally
window.movieCardTemplateString = `
    <div class="movie-card" data-target="">
        <div class="image-box"><img style="height: 100%;" poster></div>
        <div class="info-box">
            <p class="title" title></p>
            <p class="more-info" more-info></p>
        </div>
    </div>
`;
export let movieCardTemplate = document.createElement("template")
movieCardTemplate.innerHTML = movieCardTemplateString

window.movieCardSearchTemplateString = `
    <div class="movie-card-search">
        <div class="image-box"><img src="image.jpg" style="height: 100%;" poster></div>
        <p style="padding-left: 1rem; margin-top: 0.25rem; font-size: 1.1rem; font-weight: 600; opacity: 0.9; max-width: 25rem; overflow: hidden;" title></p>
    </div>
`;
export let movieCardSearchTemplate = document.createElement("template");
movieCardSearchTemplate.innerHTML = movieCardSearchTemplateString;

export function getPosterUrl(movie_object, img_dir) {
    // this is a temp fix 
    // const image_type = img_dir.split("_")[1]
    // const movieId =  movie_object["imdbID"]

    // return fetch(img_dir)
    //   .then(response => {
    //     if (response.ok) {
    //       return localPosterUrl; // Image found locally
    //     } else {
    //       throw new Error("Local image not found");
    //     }
    //   })
    //   .catch(error => {
    //     console.warn(`Unable to get poster locally for movie ${movieId}: ${error}`);
    //     // Try fetching the poster online
    //     const onlinePosterUrl =  movie_object?.Poster;
    //     if (onlinePosterUrl) {
    //       return onlinePosterUrl;
    //     } else {
    //       console.warn(`Poster URL not available for movie ${movieId}`);
    //       return ""; // or any default image URL
    //     }
    //   });

    return new Promise((resolve) => {
        const url = "/" + img_dir.replace("_", "-") + "/" + movie_object["imdbID"] + ".jpg";
        fetch(url, { method: "HEAD" })
        .then(response => {
            if (response.ok) {
                resolve(url);  // Return the local image URL
            } else {
                // fetch("/images/download", {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         id: movie_object.imdbID,
                //         onlineUrl : movie_object["Poster"]
                //     })
                // })
                resolve(movie_object["Poster"]);  // Return the online poster URL
            }
        })
        .catch(() => {
            resolve("/images/default.jpg"); // Default fallback in case of fetch failure
        });
    });
}


export function createMovieTemplateCard(item){
    const movieCard = movieCardTemplate.content.cloneNode(true).children[0]

    const poster = movieCard.querySelector("[poster]");
    const title = movieCard.querySelector("[title]");
    const moreInfo = movieCard.querySelector("[more-info]");

    if("Type" in item && (item["Type"] == "TV Series"  || item["Type"] == "TV Mini Series")){
        movieCard.setAttribute("data-target",routes.getSeriesPageAddress(item["imdbID"]))
      }
      
      else{
            movieCard.setAttribute("data-target",routes.getMoviePageAddress(item["imdbID"]))
        }
      


    getPosterUrl(item,"images_highres")
        .then(finalPosterUrl => {poster.src = finalPosterUrl;});
    title.innerHTML = item.Title;
    moreInfo.innerHTML = item.Year + " &#x2022; " + "IMDB : " + item.imdbRating;

    movieCard.addEventListener("click",() =>{
        window.location.href = movieCard.getAttribute('data-target');
    })

    return movieCard
}

export function createMovieSearchCard(item){
    // here the argument is an object parsed from json
    const card = movieCardSearchTemplate.content.cloneNode(true).children[0];
                
    const poster = card.querySelector('[poster]')
    const title = card.querySelector('[title]')

    //poster.src = movie.Poster;
    getPosterUrl(item, "images_lowres")
      .then(finalImageUrl => {
        poster.src = finalImageUrl
      })

    if("Type" in item && item["Type"] == "TV Series"){
      title.innerHTML = item.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + item.Year + " &#x2022; TV-series" + "</span>";
      card.addEventListener("click" , () => {
          window.location.href = routes.getSeriesPageAddress(item['imdbID']);
      })
    }
    else if("Type" in item && item["Type"] == "TV Mini Series"){
        title.innerHTML = item.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + item.Year + " &#x2022; TV mini series" + "</span>";
        card.addEventListener("click" , () => {
            window.location.href = routes.getSeriesPageAddress(item['imdbID']);
        })

    }
    else{
      title.innerHTML = item.Title + "<br><span style='opacity : 0.5; font-weight : 500 ; font-size : 1rem;'>" + item.Year + "</span>";
      card.addEventListener("click" , () => {
          window.location.href = routes.getMoviePageAddress(item['imdbID']);
      })
    }



    

    return card
}






//const movieCardTemplate = document.createRange().createContextualFragment(movieCardTemplateString);



//console.log(movieCardTemplate)
