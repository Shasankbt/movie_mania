import time
import requests
from bs4 import BeautifulSoup
import json 
import traceback

from scrapeIMDb import getIMDbData

import re

def extract_alphanumeric(input_str):
    # Using regular expression to find alphanumeric characters
    return re.sub(r'[^a-zA-Z0-9]', '', input_str)

def titlesMatch(str1, str2):
    return (extract_alphanumeric(str1.lower()) == extract_alphanumeric(str2.lower()))



def getBSfromURL(url):
    response = requests.get(url, headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
    })
    return BeautifulSoup(response.content, "html.parser")


def getOscarsData(year):
    data = getBSfromURL("https://oscars.org/oscars/ceremonies/" + str(year))

    oscarsHtml =  data.find("div", class_="field field--name-field-award-categories field--type-entity-reference-revisions field--label-hidden field__items")

    oscarsData = {}
    for award in oscarsHtml.find_all("div", class_="paragraph paragraph--type--award-category paragraph--view-mode--default"):

        try : 
            awardType = award.find("div", class_="field field--name-field-award-category-oscars field--type-entity-reference field--label-hidden field__item").text
            
            winner = award.find("div", class_="paragraph paragraph--type--award-honoree paragraph--view-mode--oscars")
            winnerFilm = winner.find("div", class_="field field--name-field-award-film field--type-entity-reference field--label-hidden field__item").text
            
            if awardType == "Music (Original Song)":
                subtext = award.find("div", class_="field field--name-field-award-entities field--type-entity-reference field--label-hidden field__items").text
                if ";" in subtext and "from" in subtext.lower():
                    winnerFilm = subtext[ subtext.lower().find("from") + 5 : subtext.find(";")] # winnerFilm.text[5:].split(";")[0]

            if awardType == "International Feature Film":
                winnerFilm = award.find("div", class_="field field--name-field-award-entities field--type-entity-reference field--label-hidden field__items")
                winnerFilm = winnerFilm.text
                

            
            imdbID = ""

            search_results = getBSfromURL("https://www.imdb.com/find/?q=" + winnerFilm).find_all("li", class_="ipc-metadata-list-summary-item ipc-metadata-list-summary-item--click find-result-item find-title-result")
            for search_res in search_results:
                result_title = search_res.find("a" ,  class_="ipc-metadata-list-summary-item__t").text
                result_release_year = search_res.find("ul").text[:4]
                if titlesMatch(result_title , winnerFilm) and int(result_release_year) <= year:
                    imdbID = search_res.find("a" ,  class_="ipc-metadata-list-summary-item__t").get("href").split("/")[-2]
                    break

            
            print(f"award : {awardType} ; movie name : {winnerFilm} ; search result id : {imdbID}")

            if imdbID == "":
                raise ValueError("unable to get the imdbID")
            if imdbID not in oscarsData:
                oscarsData[imdbID] = []

            oscarsData[imdbID].append(awardType)
        except Exception as e:
            print(f"unable to get due to --{e}-- in line ~{traceback.extract_tb(e.__traceback__)[0][1]}~")
        
        

        

    return oscarsData

with open("oscar_lib.json") as file:
    oscars_data = json.loads(file.read())

with open("oscar_movies.json") as file:
    movie_data = json.loads(file.read())

# data = getOscarsData(2023)

# print(data)
# print(getOscarsData(2015))
for year in range(2005,2025):
    print(f"--------------------------{year}------------------------")
    data = getOscarsData(year)
    # print(data)
    oscars_data[year] = data
    print("---- scrapping data ----")
    for key in data:
        if key not in movie_data:
            movie_data[key] = getIMDbData(key)


with open("oscar_lib.json", "w") as file:
    file.write(json.dumps(oscars_data))

with open("oscar_movies.json", "w") as file:
    file.write(json.dumps(movie_data))


# print(oscars_data)
# print(movie_data)