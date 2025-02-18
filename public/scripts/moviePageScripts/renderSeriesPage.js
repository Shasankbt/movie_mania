

function getPosterUrl(movie_object, img_dir) {
    const movieId = movie_object["imdbID"]
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
        const onlinePosterUrl = movie_object?.Poster;
        if (onlinePosterUrl) {
          return onlinePosterUrl;
        } else {
          console.warn(`Poster URL not available for movie ${movieId}`);
          return ""; // or any default image URL
        }
      });
  }


export function renderPage(data) {
    console.log(data)
    document.getElementById('title-id').innerHTML = data.Title;

    const info = document.querySelector('.info');
    const yearAndRuntime = document.createElement('p');
    const genre = document.createElement('p');
    const reviews = document.createElement('p');
    const rating = document.createElement('p');

    yearAndRuntime.innerHTML = data.Year + " &#x2022; " + data.Runtime;
    genre.innerHTML = data.Genre;
    reviews.innerHTML = "IMDb rating : " + data.imdbRating + "<br>" + "FilmCritic score : <span id='internal-rating'></span>";
    rating.innerHTML = "Rating : " + data.Rated;

    info.appendChild(yearAndRuntime);
    info.appendChild(genre);
    info.appendChild(reviews);
    info.appendChild(rating);

    document.querySelector(".quote").innerHTML = '"' + data.Quotes[0] + '"'

    const director = document.getElementById("director-id");
    const stars = document.getElementById("writers-id");
    const castList = document.getElementById("cast-list-id");

    const poster = document.getElementById('movie-poster-id');
    const backdrop = document.querySelector('.backdrop-image');

    getPosterUrl(data, "images_highres")
      .then(finalPosterUrl => {
        poster.src = finalPosterUrl;
        backdrop.style.backgroundImage = "url(" + finalPosterUrl + ")"
      });

    
    //   })

    console.log("rendered")









    data.Director.forEach(each_director => {
      director.innerHTML += '<span style="font-weight: 500;">' + each_director + '</span>, ';
    })
    director.innerHTML = director.innerHTML.slice(0, -2);
    director.querySelectorAll("span").forEach(each_director => {
      each_director.addEventListener("click", () => window.open("https://en.wikipedia.org/wiki/" + each_director.innerHTML, "_blank"))
      // link to wikipedia page
    })

    if(data.Stars !== undefined && data.Stars != null && data.Stars.length == 0){
        data.Stars.forEach(each_star => {
            stars.innerHTML += '<span style="font-weight: 500;">' + each_star + '</span>, ';
        })
          stars.innerHTML = stars.innerHTML.slice(0, -2);
          stars.querySelectorAll("span").forEach(each_star => {
            each_star.addEventListener("click", () => window.open("https://en.wikipedia.org/wiki/" + each_star.innerHTML, "_blank"))  // link to wikipedia page
          })   
    }
    else{
        stars.parentNode.style.display = "none"
    }
    

    for (const key in data.Actors) {
      const element = document.createElement('li');
      element.innerHTML = key + "<br><span style='font-weight : 500 ; opacity : 0.6 ; font-style : italic'> as " + data.Actors[key] + "</span>"
      element.addEventListener("click", () => {
        window.open("https://en.wikipedia.org/wiki/" + element.innerHTML.split("<")[0], "_blank");
      })  // link to wikipedia page
      castList.appendChild(element)
    }

    const plot = document.getElementById('plot-content-id');
    plot.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + data.plot.split("—")[0] + "<span style='font-weight : 500 ; opacity : 0.3 ; font-style : italic'> &nbsp;&nbsp;&nbsp;&nbsp;~" + data.plot.split("—")[1] + "</span>"


}
