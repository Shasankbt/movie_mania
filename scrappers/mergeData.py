import json

movieData = {}

with open("top_250_movies.json") as file:
    movieData.update( json.loads(file.read()) )

with open("oscar_movies.json") as file:
    movieData.update( json.loads(file.read()) )

with open("all_movies.json", 'w') as file:
    file.write(json.dumps(movieData))