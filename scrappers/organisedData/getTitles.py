import json

# Load movies and series data
with open("movies.json") as file:
    allMovies = json.load(file)

with open("series.json") as file:
    allSeries = json.load(file)

# Merge dictionaries and create a new map of titles to IMDb IDs
titles_map = {value["Title"]: key for key, value in {**allMovies, **allSeries}.items()}

with open("titles.json", "w") as file:
    file.write(json.dumps(titles_map))