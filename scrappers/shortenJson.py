import json

def shortenDataNew(input_file,output_file):
    with open(input_file) as file:
        allMovies = json.loads(file.read())

    movieShort = {}
    for key in allMovies:
        movie = allMovies[key]
        if movie is not None:
            movieShort[key] = {
                "Title" : movie["Title"],
                "Year" : movie["Year"],
                "imdbRating" : movie["imdbRating"],
                "Poster" : movie["Poster"],
                "imdbID" : movie["imdbID"]
            }
    with open(output_file, "w") as file:
        file.write(json.dumps(movieShort))

shortenDataNew("all_movies.json", "all_movies_short.json")