import json 

with open("all_full_movies_extra.json") as file:
    extraData = json.loads(file.read())

with open("movies/movies.txt") as file:
    movie_list= file.read().splitlines()

with open("series/series.txt") as file:
    series_list = file.read().splitlines()

movies_extra = {}
series_extra = {}

extras_count = 0

for imdbID, data in extraData.items():
    if imdbID in movie_list:
        movies_extra[imdbID] = data
    elif imdbID in series_list:
        series_extra[imdbID] = data
    else:
        extras_count += 1


print(len(movies_extra), len(series_extra), extras_count)

with open("movies/movies_extra.json", "w") as file:
    file.write(json.dumps(movies_extra))
with open("series/series_extra.json", "w") as file:
    file.write(json.dumps(series_extra))