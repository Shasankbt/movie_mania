import json

def arrayToObject(input_file, output_file):
    with open(input_file) as file:
        movieDataArr = json.loads(file.read())

    movieDict = {}

    for movieObject in movieDataArr:
        movieDict[movieObject["imdbID"]] = movieObject

    with open(output_file, "w") as file:
        file.write(json.dumps(movieDict))