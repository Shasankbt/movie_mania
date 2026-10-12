from concurrent.futures import ThreadPoolExecutor
from utils import load_json, cleanup, Colors
import json, time
from imdbFunctions import getDataFromImdbID


def writeDatafromList(imdbID, newData, task_idx, total_tasks):
    print(f"{Colors.BLUE}starting ({task_idx}/{total_tasks}) : {imdbID}{Colors.RESET}")
    start_time = time.time()
    try:
        newData[imdbID] = getDataFromImdbID(imdbID, print_feedback=False)
        print(f"{Colors.GREEN}({task_idx})/({total_tasks}) : Scrapped successfully for {imdbID}{Colors.RESET}")

    except Exception as e:
        print(f"{Colors.RED}an error {e} as occured for {imdbID}{Colors.RESET}")

    print(f"completed in {time.time()-start_time} sec")
    print("-------------------------------------------------------")

def scrapeData(imdbID_list_input: set, imdbID_list_extracted: set, movieData, movieDataFile, num_threads: int):

    req_imdbID = imdbID_list_input - imdbID_list_extracted
    total_tasks = len(req_imdbID)
    print(f"{Colors.ORANGE}Total tasks: {total_tasks}{Colors.RESET}")
    newData = movieData.copy()

    threadCount = num_threads
    pool = ThreadPoolExecutor(threadCount)
    tasks = []
    current_task = 0

    try:
        for imdbID in req_imdbID:
            current_task += 1
            tasks.append( pool.submit(writeDatafromList,imdbID, newData, current_task, total_tasks ) )

        pool.shutdown(wait=True)
        print(f"{Colors.GREEN}All tasks completed!{Colors.RESET}")
        cleanup(newData, movieDataFile)

    except KeyboardInterrupt:
        print(f"{Colors.RED}KeyboardInterrupt detected!{Colors.RESET}")
        pool.shutdown(wait=True, cancel_futures=True)
        cleanup(newData, movieDataFile)
    except Exception as e:

        print(f"Unexpected error: {e}")
        cleanup(newData, movieDataFile)
