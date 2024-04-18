document.addEventListener("DOMContentLoaded", ()=>{
    console.log(document.querySelectorAll(".nav-button"))
        document.querySelectorAll(".nav-button").forEach(button =>{
            console.log(button)
            button.addEventListener("click" ,() => {
                const location = button.getAttribute("data-location")
                const relativeScrollLength = document.querySelector(location).getBoundingClientRect().top;
                const offsetUp = -108
                window.scroll({
                    top : window.scrollY + relativeScrollLength + offsetUp,
                    behavior : "smooth"
                })
            })
            console.log("added")
        })

        document.addEventListener("scroll", () => {
            found = false
            document.querySelectorAll(".nav-button").forEach(button =>{
                const location = button.getAttribute("data-location")
                const relativeScrollLength = document.querySelector(location).getBoundingClientRect().top;
                if(relativeScrollLength >= 0 && !found){
                    console.log(button.innerHTML)
                    button.style.color = "rgb(220, 177, 149)"
                    found = true;
                }
                else{
                    button.style.color = "white"
                }
            })
        })
})

