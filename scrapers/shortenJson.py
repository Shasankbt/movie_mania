import json

with open("movie.json") as file:
    allMovies = json.loads(file.read())

movieShort = [{
        "Title" : movie["Title"],
        "Year" : movie["Year"],
        "imdbRating" : movie["imdbRating"],
        "Poster" : movie["Poster"],
        "imdbID" : movie["imdbID"]
    } for movie in allMovies
]
with open("movieShort.json", "w") as file:
    file.write(json.dumps(movieShort))
