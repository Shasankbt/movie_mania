import json

with open("top_250_movies.json") as file:
    movieDataArr = json.loads(file.read())

movieDict = {}

for movieObject in movieDataArr:
    movieDict[movieObject["imdbID"]] = movieObject

with open("movies.json", "w") as file:
    file.write(json.dumps(movieDict))