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
                element.innerHTML = key + "\t <span style='font-weight : 100 ; opacity : 0.6 ; font-style : italic'> as </span>" + data.Actors[key]
                castList.appendChild(element)
            }

            const plot = document.getElementById('plot-content-id');
            plot.innerHTML = data.plot

        })
}
