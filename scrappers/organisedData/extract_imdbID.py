import json

# Initialize counters outside the function
not_in_total = 0
in_total = 0

def getImdbID(filename, total_imdbID_list):
    global in_total, not_in_total  # Use global keyword to modify the counters

    with open(filename) as file:
        imdbID_list = [imdbID for imdbID in json.load(file)]  # Use json.load instead of json.loads

    dest_file = filename.split(".")[0] + ".txt"
    print(f"extracting from {filename} to {dest_file}")

    with open(dest_file, "w") as file:
        for item in imdbID_list:
            if item in total_imdbID_list:
                in_total += 1
            else:
                not_in_total += 1
            file.write(f"{item}\n")

# Read the total IMDb IDs once and pass them to the function
with open("total.txt") as file:
    total_imdbID_list = file.read().splitlines()

# Call the function with the total_imdbID_list as an argument
getImdbID("movies.json", total_imdbID_list)
getImdbID("series.json", total_imdbID_list)
getImdbID("episodes.json", total_imdbID_list)

# Print the results
print(in_total, not_in_total)
