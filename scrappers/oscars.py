import time
import requests
from bs4 import BeautifulSoup
import json 

from scrapeIMDb import getJsonData

def getBSfromURL(url):
    response = requests.get(url, headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
    })
    return BeautifulSoup(response.content, "html.parser")

# def getMovieDataFromIMDb(imdbID):
#     movie = {}

#     #   ----------------------- pages ----------------------
#     mainpage = getBSfromURL("https://www.imdb.com/title/" + imdbID)
#     plotSummaryPage = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/plotsummary")
#     taglinePage = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/taglines")

#     imagesSiteUrl = "https://www.imdb.com/" + mainpage.find("a", class_="ipc-lockup-overlay ipc-focusable").get("href")
#     imageSoup = getBSfromURL(imagesSiteUrl)
#     movie["Poster"] = imageSoup.find("img", class_="sc-7c0a9e7c-0 eWmrns").get("src")

#     movie["Title"] = mainpage.find("span" , class_ ="hero__primary-text").text
#     movie["Released"] = mainpage.find("div", class_="sc-f65f65be-0 bBlII", attrs={"data-testid" : "title-details-section"}).find("ul", class_ = "ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--inline ipc-metadata-list-item__list-content base").text
#     movie["imdbRating"] = mainpage.find("div", class_ = "sc-bde20123-2 cdQqzc").find("span").text
#     movie["metacritic"] = mainpage.find("span", class_= "sc-b0901df4-0 bcQdDJ metacritic-score-box").text
#     movie["Genre"] = [x.text for x in mainpage.find("div" , class_ = "ipc-chip-list__scroller").find_all("a")]
#     movie["imdbID"] = imdbID

#     #   YEAR , RATED , RUNTIME
#     tempVar = mainpage.find("ul", class_ ="ipc-inline-list ipc-inline-list--show-dividers sc-d8941411-2 cdJsTz baseAlt").find_all("li")
#     try:
#         movie["Year"] = tempVar[0].text
#         movie["Rated"] =tempVar[1].text
#         movie["Runtime"] = tempVar[2].text
#     except IndexError:
#         movie["Year"] = None
#         movie["Rated"] =None
#         movie["Runtime"] =None
    

#     #   PLOT SUMMARY : 
#     try:
#         movie["plot"] = plotSummaryPage.find_all("li" , class_ ="ipc-metadata-list__item")[1].text
#     except IndexError:
#         movie["plot"] = plotSummaryPage.find("li" , class_ ="ipc-metadata-list__item").text

#     #   QUOTES :
#     try:
#         movie["Quotes"] = [x.text for x in taglinePage.find("ul", class_= "ipc-metadata-list ipc-metadata-list--dividers-between sc-d1777989-0 FVBoi meta-data-list-full ipc-metadata-list--base").find_all("li")]
#     except IndexError:
#         movie["Quotes"] = []
#     except AttributeError:
#         movie["Quotes"] = []

    
#     cast = mainpage.find_all("div", class_ = "sc-bfec09a1-7 gWwKlt")
#     # castDict = {}
#     # for actor in cast:
#     #     castDict[actor.find("a").text] = actor.find("div").text
#     movie["Actors"] = { actor.find("a").text : actor.find("div").text for actor in cast}

#     tempVar = mainpage.find("ul", class_ = "ipc-metadata-list ipc-metadata-list--dividers-all title-pc-list ipc-metadata-list--baseAlt", attrs={"role" : "presentation"}).find_all("div", class_="ipc-metadata-list-item__content-container")
#     # the ul contains li which contains one div each, for director(s) and writer(s)
#     movie["Director"] = [x.text for x in tempVar[0].find_all("li")]
#     movie["Writers"] = [x.text for x in tempVar[1].find_all("li")]

#     #print(movie)
#     for key, value in movie.items():
#         print(f'{key}: {value}')




def getOscarsData(year):
    data = getBSfromURL("https://oscars.org/oscars/ceremonies/" + str(year))

    oscarsHtml =  data.find("div", class_="field field--name-field-award-categories field--type-entity-reference-revisions field--label-hidden field__items")

    oscarsData = {}
    for award in oscarsHtml.find_all("div", class_="paragraph paragraph--type--award-category paragraph--view-mode--default"):
        awardType = award.find("div", class_="field field--name-field-award-category-oscars field--type-entity-reference field--label-hidden field__item").text
        
        winner = award.find("div", class_="paragraph paragraph--type--award-honoree paragraph--view-mode--oscars")
        winnerFilm = winner.find("div", class_="field field--name-field-award-film field--type-entity-reference field--label-hidden field__item").text
        
        if awardType == "Music (Original Song)":
            winnerFilm = award.find("div", class_="field field--name-field-award-entities field--type-entity-reference field--label-hidden field__items")
            winnerFilm = winnerFilm.text[5:].split(";")[0]

        if awardType == "International Feature Film":
            winnerFilm = award.find("div", class_="field field--name-field-award-entities field--type-entity-reference field--label-hidden field__items")
            winnerFilm = winnerFilm.text

        a_tag = getBSfromURL("https://www.imdb.com/find/?q=" + winnerFilm).find("li", class_="ipc-metadata-list-summary-item ipc-metadata-list-summary-item--click find-result-item find-title-result").find("a", class_="ipc-metadata-list-summary-item__t")
        imdbID = a_tag.get("href").split("/")[-2] 
        

        if imdbID not in oscarsData:
            oscarsData[imdbID] = []

        oscarsData[imdbID].append(awardType)

    return oscarsData


oscars_data = {}
movie_data = {}

# data = getOscarsData(2023)

# print(data)

for year in range(2022,2023):
    print(f"--------------------------{year}------------------------")
    data = getOscarsData(year)
    oscars_data[year] = data
    for key in data:
        movie_data[key] = getJsonData(key)

print(oscars_data)
print(movie_data)