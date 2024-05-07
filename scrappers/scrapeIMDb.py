from imdbFunctions import getDataFromImdbID
from imdbFunctions import getBSfromURL
import json
from urllib.parse import urlencode




if __name__ == "__main__":
    movieObjectArray = []
    # # top 100 movies :
    # top100moviesBox = getBSfromURL("https://www.imdb.com/search/title/?groups=top_100&count=100&sort=user_rating,desc")

    # top 250 movies :
    top100moviesBox = getBSfromURL("https://www.imdb.com/chart/top/")
    total_movies_len = len(top100moviesBox.find_all("a", class_="ipc-title-link-wrapper"))

    for position, link in enumerate(top100moviesBox.find_all("a", class_="ipc-title-link-wrapper"), start=1):
        print(position, "/", total_movies_len, end=" ")
        imdbID = link.get("href").split("/")[-2]
        movieObjectArray.append(getDataFromImdbID(imdbID))

    json_string = json.dumps(movieObjectArray)

    with open("top250movies.json", "w") as json_file:
        json_file.write(json_string)
    
    
