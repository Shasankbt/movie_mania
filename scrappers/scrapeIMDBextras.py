# from imdbFunctions import getDataFromImdbID
from imdbFunctions import getBSfromURL
from bs4 import BeautifulSoup
import json
from urllib.parse import urlencode
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import threading
import sys
import logging

class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    RESET = '\033[0m'
    ORANGE = '\033[38;5;208m'
    BLUE = '\033[94m'
    PINK = '\033[95m'  # Light pink
    YELLOW = '\033[93m'

thread_colors = {
    "1" : Colors.PINK,
    "2" : Colors.BLUE,
    "3" : Colors.YELLOW

}

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

def signal_handler(sig, frame):
    cleanup()
    sys.exit(0)

def cleanup():
    print('You pressed Ctrl+C! Exiting gracefully...')
    with open("all_full_movies_extra.json", "w") as file:
        file.write(json.dumps(movieData))

def getIMDBextras(imdbID_list, movie_data, thread_index):
    driver = webdriver.Chrome(service=Service("./chromedriver"))

    length = len(imdbID_list)
    for idx, imdbID in enumerate(imdbID_list):
        if imdbID not in movie_data:
            obj = {
                "movie-platform" : "",
                "movie-url" : "",
                "trivia" : "",
                "goofs" : "",
                "quotes" : []
            }
            start_time = time.time()
            try:
                
                driver.get("https://www.imdb.com/title/" + imdbID)
                time.sleep(3)
                mainpage = BeautifulSoup(driver.page_source, "html.parser")

                watch_sec = mainpage.find("div",class_="ipc-sub-grid-item ipc-sub-grid-item--span-2 sc-ca09d136-0 hlUZZv ipc-shoveler__item")
                try:
                    obj["movie-platform"] = watch_sec.find("img").get("src")
                except AttributeError:
                    logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.ORANGE}{idx+1}/{length} : {imdbID} ---- unable to get movie platform{Colors.RESET}")

                try:
                    obj["movie-url"] = watch_sec.find("a").get("href")
                except AttributeError:
                    logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.ORANGE}{idx+1}/{length} : {imdbID} ---- unable to get movie-url{Colors.RESET}")

                did_you_know_sec = mainpage.find("section", class_="ipc-page-section ipc-page-section--base celwidget", attrs={"data-testid" :"DidYouKnow"})
                try:
                    subparts = did_you_know_sec.find_all("div", class_="ipc-list-card--border-line ipc-list-card--tp-none ipc-list-card--bp-none ipc-list-card sc-3026fe52-1 guJwyD ipc-list-card--base")
                    obj["trivia"] = subparts[0].find("div").text
                    obj["goofs"] = subparts[1].find("div").text
                    for quote in subparts[2].find("div").find_all("p"):
                        obj["quotes"].append(quote.text)
                except IndexError:
                    logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.ORANGE}{idx+1}/{length} : {imdbID} ---- unable to get some parts of 'do you know' section{Colors.RESET}")
                except AttributeError:
                    logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.ORANGE}{idx+1}/{length} : {imdbID} ---- unable to get 'do you know' section entirely{Colors.RESET}")


                logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.GREEN}{idx+1}/{length} : {imdbID} DONE sucessfully {Colors.RESET} ; exec time: {time.time() - start_time}")
            except Exception as e:
                logging.info(f"{thread_colors[thread_index]}Thread-{thread_index} - {Colors.RED}{idx+1}/{length} : {imdbID} unable to get due to {e} for {imdbID}{Colors.RESET} ; exec time: {time.time() - start_time}")
                      
            movie_data[imdbID] = obj
    driver.quit()


with open("data-filtered.txt") as file:
    imdbID_list = file.read().splitlines()
    imdbID_list = imdbID_list

with open("all_full_movies_extra.json") as file:
    movieData = json.loads(file.read())

thread_count = 3
threads = []
chunk_size = len(imdbID_list) // thread_count



try:
    for i in range(thread_count):
        start_idx = i * chunk_size
        end_idx = (i + 1) * chunk_size if i < thread_count - 1 else len(imdbID_list)
        thread = threading.Thread(target=getIMDBextras, args=(imdbID_list[start_idx:end_idx], movieData, f"{i+1}"))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    with open("all_full_movies_extra.json", "w") as file:
        file.write(json.dumps(movieData))
except KeyboardInterrupt:
    cleanup()
except Exception as e:
    print(f"Unexpected error: {e}")
    cleanup()