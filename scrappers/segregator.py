import json
import re
from imdbFunctions import getBSfromURL, getDataFromImdbID
import time
import traceback

import threading 
from concurrent.futures import ThreadPoolExecutor


class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    RESET = '\033[0m'
    ORANGE = '\033[38;5;208m'
    BLUE = '\033[94m'
    PINK = '\033[95m' 
    YELLOW = '\033[93m'
    GREY = '\033[90m'



def appendEpisodeIDs(imdbID,series_object, total_imdbID_list, local_task_idx, total_tasks):
    
    print(f"{Colors.GREY}starting ({local_task_idx}/{total_tasks}) : {imdbID}{Colors.RESET}")
    episode_ids= {}
    start_time = time.time()
    try:
        episodes_page = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/episodes/") 
        seasons_count = len(episodes_page.find("ul", class_="ipc-tabs ipc-tabs--base ipc-tabs--align-left", attrs={"role" : "tablist"}).find_all("a"))
        for season_idx in range( 1, seasons_count + 1):
            temp_obj = {}
            try:
                episodes_page = getBSfromURL("https://www.imdb.com/title/" + imdbID + f"/episodes/?season={season_idx}")
                episode_sections = episodes_page.find_all("div", class_="sc-ccd6e31b-1 fabWnN") 

                for idx , section in enumerate(episode_sections):
                    episode_idx = idx + 1
                    try:
                        ep_id = section.find("a").get("href").split("/")[2]
                        temp_obj[f"episode-{episode_idx}"] = ep_id
                        if ep_id not in total_imdbID_list: 
                            total_imdbID_list.append(ep_id)
                    except Exception as e:
                        print(f"{Colors.ORANGE}---- ---- unable to get Episode id for S{season_idx} E{episode_idx} for {imdbID} due to {e} at {traceback.extract_tb(e.__traceback__)[0][1]}{Colors.RESET}")
    
            except Exception as e:
                print(f"{Colors.ORANGE}---- unable to get Season-{season_idx} for {imdbID} due to {e} at {traceback.extract_tb(e.__traceback__)[0][1]}{Colors.RESET}")

            episode_ids[f"season-{season_idx}"] = temp_obj

            
        print(f"{Colors.GREEN}({local_task_idx})/({total_tasks}) : Episode id's added successfully for {imdbID}{Colors.RESET}")
    except Exception as e:
        print(series_object)
        print(f"{Colors.RED}({local_task_idx}/{total_tasks}) : unable to add Episode id's for {imdbID} due to {e} at {traceback.extract_tb(e.__traceback__)[0][1]}{Colors.RESET}")

    print(f"executed in {time.time()-start_time} seconds")

    series_object["Episodes"] = episode_ids
    print("-------------------------------------------------------------")

def sufficientData(episode_object):
    if episode_object == None:
        return False
    if "Title" not in episode_object:
        return False
    # if "imdbRating" not in episode_object:
    #     return False
    # if "Released" not in episode_object:
    #     return False
    return True


def getEpisodes(series_object, total_imdbID_list, episodeData, local_task_idx, total_tasks):
    parent_imdbID = series_object["imdbID"]
    print(f"{Colors.BLUE}starting ({local_task_idx}/{total_tasks}) : {parent_imdbID}{Colors.RESET} : {len(series_object['Episodes'])} season(s)")
    start_time = time.time()
    # ------------------------------------------- exec block ----------------------------------------------
    try:
        for season_idx , season_key in enumerate(series_object["Episodes"]):
            season_obj = series_object["Episodes"][season_key]
            for episode_idx,episode in enumerate(season_obj):
                episode_id = season_obj[episode]
                episode_details = {
                    "Parent-series" : parent_imdbID,
                    "Season" : f"{season_idx + 1}",
                    "Episode" : f"{episode_idx + 1}"
                }
                try:
                    if episode_id not in episodeData or not sufficientData(episodeData[episode_id]):
                        time.sleep(1)
                        episodeData[episode_id] = getDataFromImdbID(episode_id, print_feedback=False , item_type="episode", episode_details = episode_details)
                    if episode_id not in total_imdbID_list:
                        total_imdbID_list.append(episode_id)

                    if "Title" not in episodeData[episode_id]:
                        print(f"{Colors.PINK} Unable to get ep:{episode_id} for series:{parent_imdbID}. Waiting for 30 seconds{Colors.RESET}")
                        time.sleep(30)
                except Exception as e:
                    print(f"{Colors.ORANGE}---- unable to get Episode for S{season_idx} E{episode_idx} for {parent_imdbID} due to {e} at {traceback.extract_tb(e.__traceback__)[0][1]}{Colors.RESET}")

                
        print(f"{Colors.GREEN}({local_task_idx})/({total_tasks}) : Scrapped successfully for {parent_imdbID}{Colors.RESET}")
    except Exception as e:
        print(f"{Colors.RED}({local_task_idx}/{total_tasks}) : unable to get the Episodes for {parent_imdbID} due to {e} at {traceback.extract_tb(e.__traceback__)[0][1]}{Colors.RESET}")
    # ------------------------------------------------------------------------------------------------------
    print(f"completed in {time.time()-start_time} sec")
    print("---------------------------------------------------")


def saveData(movieData, seriesData, episodeData):
    with open("organisedData/movies.json", "w") as file:
        file.write(json.dumps(movieData))

    with open("organisedData/series.json", "w") as file:
        file.write(json.dumps(seriesData))

    with open("organisedData/episodes.json", "w") as file:
        if len(episodeData) >= 0:
            file.write(json.dumps(episodeData))

    with open("id-new.txt", "w") as file:
        file.write(total_imdbID_list)


# Reading the data
with open("all_full_movies.json") as file:
    fullData = json.loads(file.read()) 

with open("data-filtered.txt") as file:
    total_imdbID_list = file.read().splitlines()

with open("organisedData/movies.json") as file:
    movieData = json.loads(file.read())

with open("organisedData/series.json") as file:
    seriesData = json.loads(file.read())

with open("organisedData/episodes.json") as file:
    episodeData = json.loads(file.read())


# data = ["TV Series", None, "TV Mini Series", "Video", "Video Game", "TV Movie", "TV Special"]

# # ------------------------------ BASIC SEGRIGATION ----------------------------------
# for imdbID in fullData:
#     if fullData[imdbID] == None:
#         continue

#     item_type = fullData[imdbID]["Year"]
#     if item_type == None : 
#         continue


#     if len(item_type) == 4:
#         movieData[imdbID] = fullData[imdbID]

#     if (item_type == "TV Series" or item_type == "TV Mini Series") and imdbID not in seriesData:
#         # correcting
#         series_object = fullData[imdbID]
#         series_object["Type"] = series_object["Year"]
#         series_object["Year"] = series_object["Rated"]
#         series_object["Rated"] = series_object["Runtime"]
#         # adding into seperated dict, if not present 
#         seriesData[imdbID] = fullData[imdbID]

# print(len(movieData))
# print(len(seriesData))
# print(len(episodeData))

# # print("waiting for 10s ...")
# # time.sleep(10)

# ------------------------------------ GETTING EPISODES ID ------------------------------------
# max_threads = 20  # Adjust based on system capabilities and workload
# progress = {'completed': 0, 'total': len(seriesData)}

# def episodeDataComplete(series_object):
#     if "Episodes" not in series_object:
#         return False
#     for season in series_object["Episodes"]:
#         if series_object["Episodes"][season] == {}:
#             return False
#     return True

# total_tasks = len([imdbID for imdbID in seriesData if not episodeDataComplete(seriesData[imdbID]) ])
# current_task = 0 

# print(len([imdbID for imdbID in seriesData if not episodeDataComplete(seriesData[imdbID]) ]))


# try:
#     pool = ThreadPoolExecutor(8)
#     tasks = []
#     for imdbID in seriesData:
#         if not episodeDataComplete(seriesData[imdbID]):
#             current_task += 1
#             tasks.append(pool.submit(appendEpisodeIDs, imdbID, seriesData[imdbID], total_imdbID_list,current_task, total_tasks))
#             #seriesData[imdbID]["Episodes"] = getEpisodes(imdbID, total_imdbID_list, episodeData)

#     pool.shutdown(wait=True)

#     saveData(movieData, seriesData, episodeData)
# except KeyboardInterrupt:
#     print("exited gracefully ! ")
#     saveData(movieData, seriesData, episodeData)

# -------------------------------------- GETTING EPISODES DATA --------------------------------------

total_tasks = len(seriesData)
current_task = 0 

try:
    pool = ThreadPoolExecutor(8)
    tasks = []
    for imdbID in seriesData:
            current_task += 1
            tasks.append(pool.submit(getEpisodes,seriesData[imdbID], total_imdbID_list, episodeData ,current_task, total_tasks))
            

    pool.shutdown(wait=True)

    saveData(movieData, seriesData, episodeData)
except KeyboardInterrupt:
    print("exited gracefully ! ")
    saveData(movieData, seriesData, episodeData)
