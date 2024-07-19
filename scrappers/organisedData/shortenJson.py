import json

def shortenData(input_file,output_file):
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
                "Genre" : movie["Genre"],
                "Poster" : movie["Poster"],
                "imdbID" : movie["imdbID"],
            }
            if "Type" in movie:
                movieShort[key]["Type"] = movie["Type"]
            else:
                movieShort[key]["Type"] = "Movie"

    with open(output_file, "w") as file:
        file.write(json.dumps(movieShort))

shortenData("series.json", "series_short.json")
shortenData("movies.json", "movies_short.json")

