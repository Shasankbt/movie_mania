import json

with open("metacriticReviews.json") as file:
    data = json.loads(file.read())


print(len(data))


