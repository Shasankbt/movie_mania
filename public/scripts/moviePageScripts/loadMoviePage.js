import { renderOverview } from "./render/renderOverview.js";
import { renderCastAndCrew } from "./render/renderCastAndCrew.js";
import { renderPlot } from "./render/renderPlot.js";
import { renderReviews } from "./render/renderReviews.js";
import { renderSimilarMovies } from "./render/renderSimilarMovies.js";

import { showReviews , reviewInputSection , addExternalReviews } from "./renderReviewSection.js"
// import { displaySimilar } from './displaySimilar.js';

const sections =  {
    overview: {
        title: 'overview',  
        class: 'overview',
        required_onload: true,
        required_onfocus: false,
        render_function: renderOverview
    },
    castAndCrew: {
        title: 'castAndCrew',
        class: 'cast-and-crew',
        required_onload: true,
        required_onfocus: false,
        render_function: renderCastAndCrew
    },
    plot: {
        title: 'plot',
        class: 'plot',
        required_onload: true,
        required_onfocus: false,
        render_function: renderPlot
    },
    userReviews: {
        title: 'userReviews',
        class: '.reviews',
        required_onload: false,
        required_onfocus: true,
        render_function: renderReviews,
        fetch_location: '/getUserReviews',
        fetch_body: {
            id: null
        }
    },
    externalReviews: {
        title: 'externalReviews',
        class: '.external-reviews',
        required_onload: false,
        required_onfocus: true,
        fetch_location: '/getExternalReviews',
        render_function: addExternalReviews,
        fetch_body: {
            id: null
        }
    },
    similarMovies: {
        title: 'similarMovies',
        class: '.related-movies',
        required_onload: false,
        required_onfocus: true,
        render_function: renderSimilarMovies,
        fetch_location: '/getSimilarMovies',
        fetch_body: {
            id: null,
            recommendationCount: 10,
            type: "movie"
        }
    }
}

export const userState = {
    userName: "Guest"
};

export function loadMoviePage(movieData, userData) {
    Object.values(sections).forEach(section => {
        section.item = document.querySelector(section.class);
    });

    sections.userReviews.fetch_body.id = movieData.imdbID;
    sections.externalReviews.fetch_body.id = movieData.imdbID;
    sections.similarMovies.fetch_body.id = movieData.imdbID;
    userState.userName = userData.userName;

    Object.values(sections).forEach(section => {
        if(section.required_onload){
            section.render_function(movieData);  
        } 
        else if(section.required_onfocus){
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {  // If section is at least 1% visible
                        console.log("Fetching data for ", section.title, section, section.fetch_body);
                        
                        fetch(section.fetch_location, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(section.fetch_body)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Fetched data for ", section.title, data);
                            section.render_function(data);
                        });
        
                        observer.unobserve(section.item); // Ensure it's only called once
                    }
                });
            }, { threshold: 0.01 });  // Trigger when at least 1% of section is visible
        
            observer.observe(section.item);
        }
    })
}
