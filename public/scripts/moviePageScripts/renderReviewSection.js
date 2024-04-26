function createReviewCard(reviewer , rating , review){
    const reviewCardTemplate = document.querySelector("[review-card-template]")
    const card  =reviewCardTemplate.content.cloneNode(true).children[0]
    card.querySelector("[reviewer-name]").innerHTML = reviewer
    card.querySelector("[rating]").innerHTML = rating
    card.querySelector("[review]").innerHTML = review
    return card
}



function showReviews(userName , reviewObject){
    const reviewsDiv = document.querySelector(".reviews").querySelector(".contents")
    const reviewsGrid = document.querySelector(".review-grid")
    const newReviewButton = document.querySelector(".new-review-button")
    const userReviewStat = document.getElementById("user-review-stat")
    
    if(userName in reviewObject){
        console.log("already reviewed")
        userReviewStat.innerHTML = "You have already Reviewed to this movie, rewrite here"

        reviewsDiv.insertBefore(createReviewCard(
            userName , reviewObject[userName]["rating"] + "/5" , reviewObject[userName]["review"]
        ), userReviewStat)
    }
    else{
        newReviewButton.innerHTML = "give Your thoughts on the movie"
        // userReviewStat.style.display= "inline-block"
        // userReviewStat.innerHTML = "You havent reviewed this movie yet, write yours here"
    }

    for(reviewer in reviewObject){
        if(reviewer != userName)
            reviewsGrid.appendChild(createReviewCard(
                "~ " + reviewer , reviewObject[reviewer]["rating"] + "/5" , reviewObject[reviewer]["review"]
            ))
    }
    if(Object.keys(reviewObject).length === +(userName in reviewObject)){
        console.log("no reviews yet")
        document.getElementById("otherusers-review-stat").style.display = "block"
        document.getElementById("otherusers-review-stat").innerHTML = "seems no one else has reviewd ; )"
    }
}

function displayNewReviewForm(userName, movieName){
    
    const newReviewButton = document.querySelector(".new-review-button")
    const newReviewForm = document.querySelector(".new-review-form")

    newReviewButton.addEventListener("click", ()=>{
        // if(userName === "Guest"){
        //     window.alert("login to write a review")
        //     return
        // }
        if(newReviewForm.style.display === "none"){
            newReviewForm.style.display = "block"
            newReviewButton.innerHTML = "cancel"
        }
        else{
            newReviewForm.style.display = "none"
            newReviewButton.innerHTML = "write a review"
        }
    })
}


function addExternalReviews(externalReviews){
    const featuredReviewPlaceholder = document.querySelector(".featured-review")
    const featuredReview = externalReviews["featured"]
    const reviewCardTemplate = document.querySelector("[review-card-template]")

    const card  =reviewCardTemplate.content.cloneNode(true).children[0]
    card.querySelector("[reviewer-name]").innerHTML = "~ " + featuredReview["reviewer"]
    card.querySelector("[rating]").innerHTML = featuredReview["tagline"]
    card.querySelector("[review]").innerHTML = featuredReview["review"]

    featuredReviewPlaceholder.appendChild(card)


    const externalReviewGrid = document.querySelector(".external-review-grid")
    
    externalReviews["positive"].concat(externalReviews["mixed"]).concat(externalReviews["negative"]).forEach(review =>{
        const card  =reviewCardTemplate.content.cloneNode(true).children[0]
        card.querySelector("[reviewer-name]").innerHTML = "~ " + review["reviewer"]
        card.querySelector("[rating]").innerHTML = review["score"]
        card.querySelector("[review]").innerHTML = review["review"]

        externalReviewGrid.appendChild(card)
 
    })


}



document.addEventListener("DOMContentLoaded", () => {
    const toggleButtonff = document.querySelector(".toggle-filter")

    function conditionFunc1(filterValue, review){
        return (filterValue === review.querySelector("[rating]").innerHTML.charAt(0))
    }

    function conditionFunc2(filterValue, review){
        score = review.querySelector("[rating]").innerHTML
        if(filterValue === "positive") return (score > 60)
        else if(filterValue === "mixed") return (score > 30 && score <= 60)
        else return (score <= 30 )
    }

    function addFilterFunction(filterSection , allReviews, condition){
        const toggleButton = filterSection.querySelector(".toggle-filter")
        function manageFilter(){
            found = false
            // allReviews = document.querySelector(".review-grid").children
            

            
            for(const review of allReviews){review.style.display = "none"}
            
            console.log(toggleButton.querySelectorAll(".filter-button"))

            filterSection.querySelectorAll(".filter-button").forEach(button => {
                if(button.classList.contains("enabled")){
                    const filterValue = button.getAttribute("data-filter-value") // button.getAttribute("data-filter-value")
                    toggleButton.classList.add("enabled") ; found = true
                    for(review of allReviews)
                        // if(button.innerHTML === review.querySelector("[rating]").innerHTML.charAt(0))
                        if(condition(filterValue,review))
                            review.style.display = "block"
                        
                    
                }
            })
            
            console.log(found)
            if(! found){
                toggleButton.classList.remove("enabled")
                for(review of allReviews){review.style.display = "block"}
            }
        }
    
        filterSection.querySelectorAll(".filter-button").forEach(button =>{
            button.addEventListener("click" , ()=>{
                button.classList.toggle("enabled")
                manageFilter()
            })    
        })
    
        
        toggleButton.addEventListener("click", (event)=>{
            toggleButton.classList.toggle("enabled")
            if(toggleButton.classList.contains("enabled")){
                console.log("enabled")
                filterSection.querySelectorAll(".filter-button").forEach(button => button.classList.add("enabled"))
            }
            else
                filterSection.querySelectorAll(".filter-button").forEach(button => button.classList.remove("enabled"))
    
            manageFilter()
        })
    }

    addFilterFunction(document.querySelectorAll(".filter-section")[0] ,document.querySelector(".review-grid").children, conditionFunc1)
    addFilterFunction(document.querySelectorAll(".filter-section")[1] ,document.querySelector(".external-review-grid").children, conditionFunc2)

    // function manageFilter(){
    //     found = false
    //     allReviews = document.querySelector(".review-grid").children

        
    //     for(review of allReviews){review.style.display = "none"}
        

    //     document.querySelectorAll(".filter-button").forEach(button => {
    //         if(button.classList.contains("enabled")){

    //             toggleButton.classList.add("enabled") ; found = true
    //             for(review of allReviews)
    //                 if(button.innerHTML === review.querySelector("[rating]").innerHTML.charAt(0))
    //                     review.style.display = "block"
                    
                
    //         }
    //     })

    //     if(! found){
    //         toggleButton.classList.remove("enabled")
    //         for(review of allReviews){review.style.display = "block"}
    //     }
    // }

    // document.querySelectorAll(".filter-button").forEach(button =>{
    //     button.addEventListener("click" , ()=>{
    //         button.classList.toggle("enabled")
    //         manageFilter()
    //     })    
    // })

    
    // toggleButton.addEventListener("click", (event)=>{
    //     toggleButton.classList.toggle("enabled")
    //     if(toggleButton.classList.contains("enabled"))
    //         document.querySelectorAll(".filter-button").forEach(button => button.classList.add("enabled"))
    //     else
    //         document.querySelectorAll(".filter-button").forEach(button => button.classList.remove("enabled"))

    //     manageFilter()
    // })


    

})

