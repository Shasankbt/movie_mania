export function getMoviePageAddress(input){
    return "/movie/" + input
}

export function getSeriesPageAddress(input){
    return "/series/" + input
}

export function getFileLocation(input){
    if(input == "movies") return "/organisedData/movies.json"
    if(input == "movies-short") return "/organisedData/movies_short.json"
    if(input == "titles") return "/organisedData/titles.json"
    if(input == "series") return "/organisedData/series.json"
    if(input == "series-short") return "/organisedData/series_short.json"
    if(input == "episodes") return "/organisedData/episodes.json"
}


