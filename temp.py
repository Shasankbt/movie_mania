import json

with open("user.json") as file:
    in_array = json.load(file) 
    out_dict = {}

    print(in_array)

    for user in in_array:
        if "moviesReviewed" not in user:
            user["moviesReviewed"] = {}
        out_dict[user["name"]] = {
            "password" : user["password"],
            "moviesReviewed" : user["moviesReviewed"]
        }

with open("user.json" , "w") as file:
    file.write(json.dumps(out_dict))
