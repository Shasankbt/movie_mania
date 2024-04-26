function renderPage( userName, movieName){
    getMovieObject(movieName).then(data => {
            console.log(data)
            document.getElementById('title-id').innerHTML = data.Title;

            const info = document.querySelector('.info');
            const yearAndRuntime = document.createElement('p');
            const genre = document.createElement('p');
            const reviews = document.createElement('p');
            const rating = document.createElement('p');

            yearAndRuntime.innerHTML = data.Year + " &#x2022; " + data.Runtime;
            genre.innerHTML = data.Genre;
            reviews.innerHTML = "IMDb rating : " + data.imdbRating + "<br>"  + "MetaScore : " + data.Metascore;
            rating.innerHTML = "Rating : " +  data.Rated;
            
            info.appendChild(yearAndRuntime);
            info.appendChild(genre);
            info.appendChild(reviews);
            info.appendChild(rating);

            document.querySelector(".quote").innerHTML = '"' + data.Quotes[0] + '"'

            const director = document.getElementById("director-id");
            const castList = document.getElementById("cast-list-id");

            const poster = document.getElementById('movie-poster-id');
            const backdrop = document.querySelector('.backdrop-image');

            poster.src = "images/" + data.imdbID + ".jpg"
            backdrop.style.backgroundImage = "url(" + data.Poster + ")"
            
            director.innerHTML = 'Director : ' + '<span style="font-weight: 500;">' + data.Director + '</span>';

            for(const key in data.Actors){
                const element = document.createElement('li');
                element.innerHTML = key + "<br><span style='font-weight : 500 ; opacity : 0.6 ; font-style : italic'> as " + data.Actors[key] + "</span>"
                element.addEventListener("click" , () => {
                    window.open("https://en.wikipedia.org/wiki/" + element.innerHTML.split("<")[0],  "_blank");
                })
                castList.appendChild(element)
            }

            const plot = document.getElementById('plot-content-id');
            plot.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + data.plot.split("—")[0] + "<span style='font-weight : 500 ; opacity : 0.3 ; font-style : italic'> &nbsp;&nbsp;&nbsp;&nbsp;~" + data.plot.split("—")[1] + "</span>"

        })
}
