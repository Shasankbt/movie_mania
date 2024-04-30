// function : each button on the sidebar navigation has data of id 
//            when clicked, calculates the scroll distance from current positon and scrolls 
//            calculating all scroll distance to color the present section


document.addEventListener("DOMContentLoaded", ()=>{
        document.querySelectorAll(".nav-button").forEach(button =>{
            button.addEventListener("click" ,() => {
                const location = button.getAttribute("data-location")
                const relativeScrollLength = document.querySelector(location).getBoundingClientRect().top;
                const offsetUp = -108
                window.scroll({
                    top : window.scrollY + relativeScrollLength + offsetUp,
                    behavior : "smooth"
                })
            })
        })

        // highliting when loaded

        found = false
        document.querySelectorAll(".nav-button").forEach(button =>{
            const location = button.getAttribute("data-location")
            const relativeScrollLength = document.querySelector(location).getBoundingClientRect().top;
            if(relativeScrollLength >= 0 && !found){
                button.style.color = "rgb(220, 177, 149)"
                found = true;
            }

            
            button.addEventListener("mouseover", () => {
                if(button.style.color != "rgb(220, 177, 149)")
                    button.style.color = "rgb(221, 202, 190)"
            })
            button.addEventListener("mouseout", () => {
                if(button.style.color !== "rgb(220, 177, 149)")
                    button.style.color = "white"
            })
            // else{
            //     button.style.color = "white"
            // }
        })

        // highlighing when scrolled
        document.addEventListener("scroll", () => {
            found = false
            document.querySelectorAll(".nav-button").forEach(button =>{
                const location = button.getAttribute("data-location")
                const relativeScrollLength = document.querySelector(location).getBoundingClientRect().top;
                if(relativeScrollLength >= 0 && !found){
                    button.style.color = "rgb(220, 177, 149)"
                    found = true;
                }
                else{
                    button.style.color = "white"
                }
            })
        })
})

