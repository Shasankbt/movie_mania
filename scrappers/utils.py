import json

def load_json(filename):
    with open(filename) as file:
        return json.load(file)

class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    RESET = '\033[0m'
    ORANGE = '\033[38;5;208m'
    BLUE = '\033[94m'
    PINK = '\033[95m' 
    YELLOW = '\033[93m'
    GREY = '\033[90m'

def cleanup(data, filename):
    print('Program exiting gracefully...')
    with open(filename, "w") as file:
        file.write(json.dumps(data))


def getShortFormatData(inputData):

    dataShort = {}
    for key in inputData:
        movie = inputData[key]
        if movie is not None:
            dataShort[key] = {
                "Title" : movie["Title"],
                "Year" : movie["Year"],
                "imdbRating" : movie["imdbRating"],
                "Poster" : movie["Poster"],
                "imdbID" : movie["imdbID"]
            }

    return dataShort