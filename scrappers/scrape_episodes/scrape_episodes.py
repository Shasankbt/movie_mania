import sys
import os

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from utils import load_json
from multithread_scrape import scrapeData

MOVIE_DATA_FILE = "episodes.json"
NUM_THREADS = 8


if __name__ == "__main__":
    with open("episodes.txt") as file:
        imdbID_list_input = file.read().splitlines()

    movieData = load_json(MOVIE_DATA_FILE)

    imdbID_list_extracted = set(movieData.keys())

    scrapeData(
        imdbID_list_input = set(imdbID_list_input),
        imdbID_list_extracted = imdbID_list_extracted,
        movieData = movieData,
        movieDataFile = MOVIE_DATA_FILE,
        num_threads = NUM_THREADS
    )



