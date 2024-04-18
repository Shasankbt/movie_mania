function showReviews(userName , reviewObject){
    const reviewsDiv = document.querySelector(".reviews")
    const reviewsGrid = document.querySelector(".review-grid")
    const reviewCardTemplate = document.querySelector("[review-card-template]")
    const newReviewButton = document.querySelector(".new-review-button")
    const userReviewStat = document.getElementById("user-review-stat")
    
    if(userName in reviewObject){
        console.log("already reviewed")
        userReviewStat.innerHTML = "You have already Reviewed to this movie, rewrite here"
        const card  =reviewCardTemplate.content.cloneNode(true).children[0]
        
        card.querySelector("[reviewer-name]").innerHTML = userName
        card.querySelector("[rating]").innerHTML = reviewObject[userName]["rating"] + "/5"
        card.querySelector("[review]").innerHTML = reviewObject[userName]["review"]

        reviewsDiv.insertBefore(card, userReviewStat)
    }
    else{
        userReviewStat.innerHTML = "You havent reviewed this movie yet, write yours here"
    }

    for(reviewer in reviewObject){
        if(reviewer != userName){
            const card  =reviewCardTemplate.content.cloneNode(true).children[0]
        
            card.querySelector("[reviewer-name]").innerHTML = "~ " + reviewer
            card.querySelector("[rating]").innerHTML = reviewObject[reviewer]["rating"] + "/5"
            card.querySelector("[review]").innerHTML = reviewObject[reviewer]["review"]

            reviewsGrid.appendChild(card)
        }
    }
    if(Object.keys(reviewObject).length === +(userName in reviewObject)){
        console.log("no reviews yet")
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