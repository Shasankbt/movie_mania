export function renderCastAndCrew(data){
    const director = document.getElementById("director-id");
    const writers = document.getElementById("writers-id");
    const castList = document.getElementById("cast-list-id");

    
    data.Director.forEach(each_director => {
        director.innerHTML += '<span style="font-weight: 500;">' + each_director + '</span>, ';
    })
    director.innerHTML = director.innerHTML.slice(0,-2);
    director.querySelectorAll("span").forEach(each_director => {
        each_director.addEventListener("click" ,() => window.open("https://en.wikipedia.org/wiki/" + each_director.innerHTML, "_blank"))
        // link to wikipedia page
    })

    if(data.Writers !== undefined && data.Writers !== null && data.Writers.length ==0){
        data.Writers.forEach(each_writer => {
            writers.innerHTML += '<span style="font-weight: 500;">' + each_writer + '</span>, ';
        })
        writers.innerHTML = writers.innerHTML.slice(0,-2);
        writers.querySelectorAll("span").forEach(each_writer => {
            each_writer.addEventListener("click" ,() => window.open("https://en.wikipedia.org/wiki/" + each_writer.innerHTML, "_blank"))  // link to wikipedia page
        })
    }
    else{
        writers.parentNode.style.display = "none"
    }

    for(const key in data.Actors){
        const element = document.createElement('li');
        element.innerHTML = key + "<br><span style='font-weight : 500 ; opacity : 0.6 ; font-style : italic'> as " + data.Actors[key] + "</span>"
        element.addEventListener("click" ,() => {
            window.open("https://en.wikipedia.org/wiki/" + element.innerHTML.split("<")[0],  "_blank");
        })  // link to wikipedia page
        castList.appendChild(element)
    }
}