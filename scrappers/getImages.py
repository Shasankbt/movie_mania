import requests
import os
import json
from PIL import Image

def resize_image(input_path, output_path, width):
    with Image.open(input_path) as img:
        # Calculate height to maintain aspect ratio
        aspect_ratio = img.width / img.height
        height = int(width / aspect_ratio)
        
        img_resized = img.resize((width, height), Image.LANCZOS )
        img_resized.save(output_path)

def download_images(source_json):
    images_dir = "images_highres"
    compressed_images_dir = "images_lowres"
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
    if not os.path.exists(compressed_images_dir):
        os.makedirs(compressed_images_dir)

    with open(source_json) as file:
        moviesObj = json.loads(file.read())

    length = len(moviesObj)
    for idx, id in enumerate(moviesObj):
        print(f"{idx+1}/{length}", end=" : ")
        movie = moviesObj[id]
        try:
            url = movie["Poster"]
            response = requests.get(url)
            highres_image = os.path.join(images_dir, f"{id}.jpg")
            lowres_image = os.path.join(compressed_images_dir, f"{id}.jpg")
            with open(highres_image, "wb") as image:
                image.write(response.content)
            
            resize_image(highres_image, lowres_image, 200)
            
            print(f"sucessfully downloaded {id}.jpg")
        except Exception as e:
            print(f"unable to donwload image of id {id} due to {e}")


download_images("all_movies.json")