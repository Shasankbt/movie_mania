import json 
import traceback

from imdbFunctions import getDataFromImdbID
from imdbFunctions import getIDbyName
from imdbFunctions import getBSfromURL


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
                

            
            imdbID = getIDbyName(winnerFilm, year)          
            
            print(f"award : {awardType} ; movie name : {winnerFilm} ; search result id : {imdbID}")

            if imdbID == "":
                imdbID = getIDbyName(winnerFilm + " " + str(year), year, False)
                print(f"id found in loose search; id : {imdbID}")
                if imdbID == "":
                    raise ValueError("EMPTY ID")
            if imdbID not in oscarsData:
                oscarsData[imdbID] = []

            oscarsData[imdbID].append(awardType)
        except Exception as e:
            print(f"unable to get due to --{e}-- in line -~{traceback.extract_tb(e.__traceback__)[0][1]}-")
        
        

        

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
            movie_data[key] = getDataFromImdbID(key)


with open("oscar_lib.json", "w") as file:
    file.write(json.dumps(oscars_data))

with open("oscar_movies.json", "w") as file:
    file.write(json.dumps(movie_data))

