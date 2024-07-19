// including movieCardTemplate from template.js ( in home.ejs )
// function : fetches the data from movie.json, appends to grid in home.ejs
//            using the movieCardTemplate in decreasing imdb Rating

import * as template from "/scripts/template.js"

export function displayRecentReleases(recentMovies){
    const recentReleasesBox = document.querySelector(".recent-releases-box")
    recentMovies.forEach(movie=>{
        recentReleasesBox.appendChild(template.createMovieTemplateCard(movie));
    })
}

// export function addSnippetControls(snippetsContainer, video, snippetDetails){
//     const playButton = snippetDetails.querySelector('#play-and-pause');
//     const muteUnmuteButton = snippetDetails.querySelector("#mute-and-unmute")
//     const next = snippetDetails.querySelector('next');
//     const prev = snippetDetails.querySelector('prev')

//     let playing = false
//     let autoplay = true
//     let muted = true

//     function togglePlayPause(){
//         if (playing === false) {
//             video.play()
//             autoplay = true
//             playing = true
//             playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
//         } else {
//             video.pause()
//             autoplay = false
//             playing = false
//             playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
//         }
        
//     }
//     // Function to check video visibility
//     const checkVideoVisibility = () => {
//         const rect = video.getBoundingClientRect();
//         const isVisible = (
//             rect.top >= 0 &&
//             rect.left >= 0 &&
//             rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//             rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//         );

//         if (isVisible && autoplay) {
//             video.play()
//             playing = true
//             playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
//         } else {
//             video.pause()
//             playing = false
//             playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
//         }
//     };

    
//     // Event listeners for play and pause buttons
//     playButton.addEventListener('click', () => {
//         togglePlayPause()
//     });

//     muteUnmuteButton.addEventListener("click",() => {
//         muted = ! muted 
//         video.muted = muted
//         if(muted)
//             muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
//         else 
//             muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
//     })
//     // Initial check
//     checkVideoVisibility();
//     window.addEventListener('scroll', checkVideoVisibility);
//     window.addEventListener('resize', checkVideoVisibility);

//     function formatTime(seconds) {
//         if(seconds == NaN){
//             console.log("hi")
//         }
//         const min = Math.floor(seconds / 60);
//         const sec = Math.floor(seconds % 60);
//         return `${min}:${sec < 10 ? '0' : ''}${sec}`;
//     }
//     const snippetProgressDiv = snippetDetails.querySelector(".snippet-progress")
//     video.addEventListener('timeupdate', () => {
//         const percentage = (video.currentTime / video.duration) * 100;
//         snippetProgressDiv.querySelector(".progress-indicator").style.width = percentage + '%';
//         snippetProgressDiv.querySelector("#time-stamp").innerHTML = '- ' + formatTime( parseInt( video.duration - video.currentTime ) )

//     });
//     snippetProgressDiv.addEventListener('click', (e) => {
//         const rect = snippetProgressDiv.getBoundingClientRect();
//         const offsetX = e.clientX - rect.left;
//         const newTime = (offsetX / snippetProgressDiv.clientWidth) * video.duration;
//         video.currentTime = newTime;
//         snippetProgressDiv.querySelector("#time-stamp").innerHTML = ' - ' + formatTime( parseInt( video.duration - video.currentTime ) )
//     });

//     let snippetDetailsTimeoutId;
//     video.addEventListener('mousemove', ()=> {

//         clearTimeout(snippetDetailsTimeoutId);
//         snippetDetails.style.transition = 'opacity 0s ease'
//         snippetDetails.style.opacity = '1';

//         snippetDetailsTimeoutId = setTimeout(() => {
//             snippetDetails.style.transition = 'opacity 0.5s ease'
//             snippetDetails.style.opacity = '0';

//         }, 5000);
//     });

//     const fullscreenButton = snippetDetails.querySelector("#fullscreen")
//     fullscreenButton.addEventListener('click', () => {
//         if (!document.fullscreenElement) {
//             if (snippetsContainer.requestFullscreen) {
//                 snippetsContainer.requestFullscreen();
//             } else if (snippetsContainer.mozRequestFullScreen) { // Firefox
//                 snippetsContainer.mozRequestFullScreen();
//             } else if (snippetsContainer.webkitRequestFullscreen) { // Chrome, Safari, Opera
//                 snippetsContainer.webkitRequestFullscreen();
//             } else if (snippetsContainer.msRequestFullscreen) { // IE/Edge
//                 snippetsContainer.msRequestFullscreen();
//             }
//             video.style.transform = "translate(0, -50%)"
//             video.style.borderRadius = "0rem"
//             video.play()
//         } else {
//             if (document.exitFullscreen) {
//                 document.exitFullscreen();
//             } else if (document.mozCancelFullScreen) { // Firefox
//                 document.mozCancelFullScreen();
//             } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
//                 document.webkitExitFullscreen();
//             } else if (document.msExitFullscreen) { // IE/Edge
//                 document.msExitFullscreen();
//             }
//             video.style.transform = "translate(0, 0%)"
//             video.style.borderRadius = "1rem"
//         }
//         document.addEventListener('fullscreenchange', () => {
//             if (!document.fullscreenElement) {
//                 video.style.transform = "translate(0, 0%)";
//                 video.style.borderRadius = "1rem"
//             }
//         });
//     });
    
// };

function fetchVideo(url){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(URL.createObjectURL(xhr.response));
            } else {
                reject(new Error(`Failed to load video: ${xhr.statusText}`));
            }
        };
        xhr.send();
    });
}
