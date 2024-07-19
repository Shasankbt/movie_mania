
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




export function renderPage(data, parent_series) {


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
    document.getElementById("parent-series-link").innerHTML = `<span style="font-weight: lighter; opacity: 0.8;">Season ${data["Episode-details"]["Season"]} • Episode ${data["Episode-details"]["Episode"]} </span> of <span id="parent-series-title">${parent_series["Title"]} <i class="fa-solid fa-angle-up"></i></span>`
    document.getElementById("parent-series-title").addEventListener("click", ()=>{
        window.location.href = `/series/${parent_series["imdbID"]}`
    })
    info.appendChild(yearAndRuntime);
    info.appendChild(genre);
    info.appendChild(reviews);
    info.appendChild(rating);

    if(data.Quotes.length !== 0)
        document.querySelector(".quote").innerHTML = '"' + data.Quotes[0] + '"'

    const director = document.getElementById("director-id");
    const castList = document.getElementById("cast-list-id");

    const poster = document.getElementById('movie-poster-id');
    const backdrop = document.querySelector('.backdrop-image');

    getPosterUrl(data, "images_highres")
        .then(finalPosterUrl => {
            poster.src = finalPosterUrl;
            backdrop.style.backgroundImage = "url(" + finalPosterUrl + ")"
        });

    data.Director.forEach(each_director => {
      director.innerHTML += '<span style="font-weight: 500;">' + each_director + '</span>, ';
    })
    director.innerHTML = director.innerHTML.slice(0, -2);
    director.querySelectorAll("span").forEach(each_director => {
      each_director.addEventListener("click", () => window.open("https://en.wikipedia.org/wiki/" + each_director.innerHTML, "_blank"))
      // link to wikipedia page
    })

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
