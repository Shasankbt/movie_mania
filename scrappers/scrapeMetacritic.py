from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
from bs4 import BeautifulSoup
import json
import requests 

s = Service("./chromedriver")
driver = webdriver.Chrome(service=s)

def getBSfromURL(url):
    response = requests.get(url, headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
    })
    return BeautifulSoup(response.content, "html.parser")



def getReviews(imdbID):
    featured_review = {
        "tagline" : "",
        "reviewer" : "",
        "review" : ""
    }

    mainpage = getBSfromURL("https://www.imdb.com/title/" + imdbID)
    featuredReviewBoxFromWeb = mainpage.find("div", class_="sc-f65f65be-0 bBlII")
    featured_review["tagline"] = featuredReviewBoxFromWeb.find("div", class_="sc-27d2f80b-0 byaXLe").text
    featured_review["reviewer"] = featuredReviewBoxFromWeb.find("div" ,class_="sc-bb68c52e-0 dsJate").text
    featured_review["review"] = featuredReviewBoxFromWeb.find("div", class_="ipc-html-content-inner-div").text
    print(featured_review)

    driver.get("https://www.imdb.com/title/" + imdbID + "/criticreviews")
    time.sleep(5)
    temp_soup = BeautifulSoup(driver.page_source, "html.parser")

    link_tag = temp_soup.find("li",class_="ipc-metadata-list__item ipc-metadata-list-item--link", attrs={"data-testid" : "metacritic-link"}).find("a")

    #link_tag = getBSfromURL("https://www.imdb.com/title/" + imdbID + "/criticreviews").find("li",class_="ipc-metadata-list__item ipc-metadata-list-item--link", attrs={"data-testid" : "metacritic-link"}).find("a")
    url = link_tag.get("href").split("?")[0]

    critic_reviews = {
        "score" : "",
        "positive" : [],
        "mixed" : [],
        "negative" : []
    }
    driver.get(url + "/critic-reviews/")
    time.sleep(5)   # MetaCritic loading buffer time

    source_code = driver.page_source
    critic_soup = BeautifulSoup(source_code, "html.parser")

    critic_reviews["score"] = critic_soup.find("div", class_= "c-siteReviewScore u-flexbox-column u-flexbox-alignCenter u-flexbox-justifyCenter g-text-bold c-siteReviewScore_green g-color-gray90 c-siteReviewScore_large" ).text
    list = critic_soup.find("div", class_= "c-pageProductReviews_row g-outer-spacing-bottom-xxlarge")
    
    for review_box in list.find_all("div", class_="c-siteReview g-bg-gray10 u-grid g-outer-spacing-bottom-large"):
        review = {}
        review["score"] = review_box.find("div", class_="c-siteReviewHeader_reviewScore").text
        review["reviewer"] = review_box.find("div", class_="c-siteReviewHeader_publisherLogo").text.strip()
        review["review"] = review_box.find("div", class_="c-siteReview_quote g-outer-spacing-bottom-small").text
        if int(review["score"]) > 60:
            critic_reviews["positive"].append(review)
        elif int(review["score"]) > 30:
            critic_reviews["mixed"].append(review)
        else:
            critic_reviews["negative"].append(review)

    user_reviews = {
        "score" : "",
        "positive" : [],
        "mixed" : [],
        "negative" : []
    }
    driver.get(url + "/user-reviews/")
    time.sleep(5)   # MetaCritic loading buffer time

    source_code = driver.page_source
    soup = BeautifulSoup(source_code, "html.parser")
    user_reviews["score"] = soup.find("div",class_="c-siteReviewScore u-flexbox-column u-flexbox-alignCenter u-flexbox-justifyCenter g-text-bold c-siteReviewScore_green c-siteReviewScore_user g-color-gray90 c-siteReviewScore_large" ).text
    list = soup.find("div", class_= "c-pageProductReviews_row g-outer-spacing-bottom-xxlarge")
    
    for review_box in list.find_all("div", class_="c-siteReview g-bg-gray10 u-grid g-outer-spacing-bottom-large"):
        review = {}
        review["score"] = review_box.find("div", class_="c-siteReviewHeader_reviewScore").text
        review["reviewer"] = review_box.find("a", class_="c-siteReviewHeader_username g-text-bold g-color-gray90").text.strip()
        review["review"] = review_box.find("div", class_="c-siteReview_quote g-outer-spacing-bottom-small").text

        spoiler_alert = "SPOILER ALERT: This review contains spoilers."
        if spoiler_alert in review["review"]:
            continue
        # user_reviews.append(review)
        if int(review["score"]) > 6:
            user_reviews["positive"].append(review)
        elif int(review["score"]) > 3:
            user_reviews["mixed"].append(review)
        else:
            user_reviews["negative"].append(review)

    # print(user_reviews)
    time.sleep(2)
    

    return {
        "featured-review" : featured_review,
        "critic-reviews" : critic_reviews,
        "user-reviews" : user_reviews
    }



with open("movieShort.json") as file:
    movieData = json.loads(file.read())

movieReviews = {}
for movie in movieData:
    print(movie["Title"] , end=" : ")
    try:
        movieReviews[movie["Title"]] = getReviews(movie["imdbID"])
        print("done sucessfully")
        print(json.dumps(movieReviews[movie["Title"]]))
    except Exception as e:
        print(f"an error {e} has occured with the movie {movie['Title']}")
    print("--------------------------------------------------------------")

with open("metacriticReviews.json", "w") as file:
    file.write(json.dumps(movieReviews))

driver.quit()
        
    