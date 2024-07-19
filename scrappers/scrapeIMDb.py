from imdbFunctions import getDataFromImdbID
from imdbFunctions import getBSfromURL
import json
import time


from concurrent.futures import ThreadPoolExecutor

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

def cleanup(newData):
    print('Program exiting gracefully...')
    with open("unseperatedData.json", "w") as file:
        file.write(json.dumps(movieData))

def writeDatafromList(imdbID, newData, task_idx, total_tasks):
    print(f"{Colors.BLUE}starting ({task_idx}/{total_tasks}) : {imdbID}{Colors.RESET}")
    start_time = time.time()
    try:
        newData[imdbID] = getDataFromImdbID(imdbID)
        print(f"{Colors.GREEN}({task_idx})/({total_tasks}) : Scrapped successfully for {imdbID}{Colors.RESET}")

    except Exception as e:
        print(f"{Colors.RED}an error {e} as occured for {imdbID}{Colors.RESET}")

    print(f"completed in {time.time()-start_time} sec")
    print("-------------------------------------------------------")


if __name__ == "__main__":
    with open("data-filtered.txt") as file:
        imdbID_list_input = file.read().splitlines()

    movieData = load_json("organisedData/movies.json")
    seriesData = load_json("organisedData/series.json")
    episodeData = load_json("organisedData/episodes.json")  # Assuming the correct file name

    # Extract IMDb IDs from the JSON data
    imdbID_list_extracted = set(movieData.keys()) | set(seriesData.keys()) | set(episodeData.keys())

    # Calculate the difference between the input list and the extracted list
    req_imdbID = imdbID_list_input - imdbID_list_extracted
    total_tasks = len(req_imdbID)
    newData = {}

    threadCount = 8
    pool = ThreadPoolExecutor(threadCount)
    tasks = []
    current_task = 0

    try:
        for imdbID in req_imdbID:
            current_task += 1
            tasks.append( pool.submit(writeDatafromList,imdbID, newData, current_task, req_imdbID ) )

        pool.shutdown(wait=True)
        cleanup(newData)

    except KeyboardInterrupt:
        cleanup(newData)
    except Exception as e:
        print(f"Unexpected error: {e}")
        cleanup(newData)













        # movieObjectArray = []
    # # top 100 movies : --------------------------------------------------------------------------------
    # top100moviesBox = getBSfromURL("https://www.imdb.com/search/title/?groups=top_100&count=100&sort=user_rating,desc")

    # # top 250 movies : ---------------------------------------------------------------------------------
    # top100moviesBox = getBSfromURL("https://www.imdb.com/chart/top/")
    # total_movies_len = len(top100moviesBox.find_all("a", class_="ipc-title-link-wrapper"))

    # for position, link in enumerate(top100moviesBox.find_all("a", class_="ipc-title-link-wrapper"), start=1):
    #     print(position, "/", total_movies_len, end=" ")
    #     imdbID = link.get("href").split("/")[-2]
    #     movieObjectArray.append(getDataFromImdbID(imdbID))

    # json_string = json.dumps(movieObjectArray)

    # with open("top250movies.json", "w") as json_file:
    #     json_file.write(json_string)