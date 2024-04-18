function getMovieObject(movieName){
    const apiKey = "cc454ece"
    const url = `https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`;

    let movieFromLocal = true;

    // try getting from the local data
    return fetch('movie.json')
        .then(res => res.json())
        .then(data => {
            let movieObject  = null;
            data.forEach(movie =>{
                if(movie.Title === movieName) {
                    movieObject = movie;
                }
            })
            return movieObject; // if not found, returns false
        })
        .then(movieObject =>{
            if(movieObject === null){
                movieFromLocal = false;
                console.log("movie data from api");   // from api

                // ** use 'return fetch' to make the script wait for fetch to return
                
                return fetch(url)           
                    .then(res => res.json())
            }
            
            else {
                console.log("movie data from local database")
                return movieObject   
            }         
        })
}

