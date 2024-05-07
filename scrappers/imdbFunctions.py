import requests
from bs4 import BeautifulSoup
import traceback
import re

def getBSfromURL(url):
    response = requests.get(url, headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
    })
    return BeautifulSoup(response.content, "html.parser")

def getDataFromImdbID(imdbID):
    print(imdbID, end=" : ")
    try:
        
        movie = {}

        #   ----------------------- pages ----------------------
        mainpage = getBSfromURL("https://www.imdb.com/title/" + imdbID)
        plotSummaryPage = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/plotsummary")
        taglinePage = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/taglines")

        imagesSiteUrl = "https://www.imdb.com/" + mainpage.find("a", class_="ipc-lockup-overlay ipc-focusable").get("href")
        imageSoup = getBSfromURL(imagesSiteUrl)
        try:
            movie["Poster"] = imageSoup.find("img", class_="sc-7c0a9e7c-0 eWmrns").get("src")
        except AttributeError:
            movie["Poster"] = imageSoup.find("div", class_="sc-7c0a9e7c-3 cISuCS").find("img").get("src")

        movie["Title"] = mainpage.find("span" , class_ ="hero__primary-text").text
        movie["Released"] = mainpage.find("div", class_="sc-f65f65be-0 bBlII", attrs={"data-testid" : "title-details-section"}).find("ul", class_ = "ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--inline ipc-metadata-list-item__list-content base").text
        movie["imdbRating"] = mainpage.find("div", class_ = "sc-bde20123-2 cdQqzc").find("span").text
        movie["Genre"] = [x.text for x in mainpage.find("div" , class_ = "ipc-chip-list__scroller").find_all("a")]
        movie["imdbID"] = imdbID

        #   YEAR , RATED , RUNTIME
        print(movie["Title"])
        tempVar = mainpage.find("ul", class_ ="ipc-inline-list ipc-inline-list--show-dividers sc-d8941411-2 cdJsTz baseAlt").find_all("li")
        try:
            movie["Year"] = tempVar[0].text
            movie["Rated"] =tempVar[1].text
            movie["Runtime"] = tempVar[2].text
        except IndexError:
            movie["Year"] = None
            movie["Rated"] =None
            movie["Runtime"] =None
        

        #   PLOT SUMMARY : 
        try:
            movie["plot"] = plotSummaryPage.find_all("li" , class_ ="ipc-metadata-list__item")[1].text
        except IndexError:
            movie["plot"] = plotSummaryPage.find("li" , class_ ="ipc-metadata-list__item").text
        except AttributeError:
            movie["plot"] = ""

        #   QUOTES :
        try:
            movie["Quotes"] = [x.text for x in taglinePage.find("ul", class_= "ipc-metadata-list ipc-metadata-list--dividers-between sc-d1777989-0 FVBoi meta-data-list-full ipc-metadata-list--base").find_all("li")]
        except IndexError:
            movie["Quotes"] = []
        except AttributeError:
            movie["Quotes"] = []

        
        cast = mainpage.find_all("div", class_ = "sc-bfec09a1-7 gWwKlt")
        movie["Actors"] = {}
        for actor in cast:
            try:
                movie["Actors"][actor.find("a").text] = actor.find("div").text 
            except Exception as e:
                print(f"unable to get the cast due to {e}")

        tempVar = mainpage.find("ul", class_ = "ipc-metadata-list ipc-metadata-list--dividers-all title-pc-list ipc-metadata-list--baseAlt", attrs={"role" : "presentation"}).find_all("div", class_="ipc-metadata-list-item__content-container")
        # the ul contains li which contains one div each, for director(s) and writer(s)
        movie["Director"] = [x.text for x in tempVar[0].find_all("li")]
        try:
            movie["Writers"] = [x.text for x in tempVar[1].find_all("li")]
        except:
            movie["Writers"] = None

        print("scrapped sucessfully")
        return movie

    except Exception as e:
        print(f"unable to get movie due to --{e}--  on line {traceback.extract_tb(e.__traceback__)[0][1]}")

def extract_alphanumeric(input_str):
    # Using regular expression to find alphanumeric characters
    return re.sub(r'[^a-zA-Z0-9]', '', input_str)

def titlesMatch(str1, str2):
    return (extract_alphanumeric(str1.lower()) == extract_alphanumeric(str2.lower()))


def getIDbyName(title, year, strict = True):
    imdbID = ""
    search_results = getBSfromURL("https://www.imdb.com/find/?q=" + title).find_all("li", class_="ipc-metadata-list-summary-item ipc-metadata-list-summary-item--click find-result-item find-title-result")

    for search_res in search_results:

        result_title = search_res.find("a" ,  class_="ipc-metadata-list-summary-item__t").text
        result_release_year = search_res.find("ul").text[:4]
        if titlesMatch(result_title , title) and int(result_release_year) <= year and strict:
            imdbID = search_res.find("a" ,  class_="ipc-metadata-list-summary-item__t").get("href").split("/")[-2]
            return imdbID
        if not strict and int(result_release_year) <= year:
            imdbID = search_res.find("a" ,  class_="ipc-metadata-list-summary-item__t").get("href").split("/")[-2]
            return imdbID
    return imdbID
