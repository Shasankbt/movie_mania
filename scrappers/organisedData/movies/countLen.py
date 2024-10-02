import json
from tqdm import tqdm
log_file = "data_log.json"

def getCount(film_type):
    print(film_type, "data")
    with open(film_type + ".json") as file:
        data = json.loads(file.read())

    with open(film_type + ".txt") as file:
        imdbID_list = file.read().splitlines()

    proper_total = 0
    without_title = []
    without_release_date = []
    without_imdbRating = []
    without_poster = []
    not_in_list = []

    for imdbID, obj in tqdm(data.items(), desc="Processing"):
        if imdbID not in imdbID_list:
            not_in_list += 1

        if obj != None:
            proper_total += 1

        if not obj.get("Title"):
            without_title.append(imdbID)
        if not obj.get("Released"):
            without_release_date.append(imdbID)
        if not obj.get("imdbRating"):
            without_imdbRating.append(imdbID)
        if not obj.get("Quotes"):
            without_poster.append(imdbID)

    print("proper data :", proper_total)
    print("no title :", len(without_title))
    print("no release date :", len(without_release_date))
    print("no imdbRating :", len(without_imdbRating))
    print("no quotes :", len(without_poster))
    print("not in imdbID list: ", len(not_in_list))

    return {
        "no-title :": without_title,
        "no-release-date":without_release_date,
        "no-imdbRating:": without_imdbRating,
        "no quotes :": without_poster,
        "not in imdbID list: ": not_in_list
    }

with open(log_file, "w") as file:
    log = {}
    log["movies"] = getCount("movies")
    log["series"] = getCount("series")
    log["episodes"] =getCount("episodes")
    file.write(json.dumps(log))
