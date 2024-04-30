import requests
import os
import json

def download_images():
    images_dir = "images"
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)

    with open("movie.json") as file:
        moviesObj = json.loads(file.read())

    for movie in moviesObj:
        try:
            url = movie["Poster"]
            response = requests.get(url)
            filename = os.path.join(images_dir, f"{movie['imdbID']}.jpg")

            with open(filename, "wb") as image:
                image.write(response.content)
            
            print(f"sucessfully downloaded {movie['imdbID']}.jpg")
        except Exception as e:
            print(f"unable to donwload image of id {movie['imdbID']} due to {e}")


download_images()