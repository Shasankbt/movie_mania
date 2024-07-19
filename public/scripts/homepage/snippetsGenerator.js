document.addEventListener("DOMContentLoaded", ()=>{
    const snippetsContainer = document.querySelector(".snippets-container")
    const videoElement = snippetsContainer.querySelector("video")
    const snippetTitleBox = snippetsContainer.querySelector(".title-box")
    const loadingProgress = snippetsContainer.querySelector("progress")
    const snippetDetails = snippetsContainer.querySelector(".snippet-details")
    let current_snippet_idx = 0


    function fetchSnippetAddress(){
        return new Promise((resolve, reject) => {
            fetch("/snippets.json")
                .then(response => response.json())
                .then(data => resolve(data))
        })
    }
    
    // video fetcher function
    let currentFetchController;
    function fetchVideo(url){
        if (currentFetchController) {
            currentFetchController.abort();
        }
        currentFetchController = new AbortController();
        const signal = currentFetchController.signal;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    loadingProgress.value = percentComplete;
                    // loadingText.innerText = `Loading... ${Math.round(percentComplete)}%`;
                }
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(URL.createObjectURL(xhr.response));
                } else {
                    reject(new Error(`Failed to load video: ${xhr.statusText}`));
                }
            };
            xhr.onabort = () => {
                console.warn('Fetch aborted');
                resolve(null); 
            };
            signal.addEventListener('abort', () => {
                xhr.abort();
            });
            xhr.send();
        });
    }

    // load to screen with transitions
    async function loadVideo(snippet_address, current_snippet_idx){
        return new Promise((resolve, reject) => {
            // transition from video tab to loading screen
            videoElement.style.opacity = "0"
            videoElement.style.transition = "opacity 0.5s ease"
            loadingProgress.style.opacity = "0"
            loadingProgress.style.transition = "opacity 0.5s ease"
            loadingProgress.value = 0;
            loadingProgress.style.opacity = "1"

            //update title
            snippetTitleBox.querySelector(".title").innerHTML = snippet_address[current_snippet_idx].title
            snippetTitleBox.querySelector(".subtitle").innerHTML = snippet_address[current_snippet_idx].subtitle

            // to simulate load
            setTimeout(async ()=>{
                if(snippet_address[current_snippet_idx].videoBlob === undefined){
                    snippet_address[current_snippet_idx].videoBlob = await fetchVideo(snippet_address[current_snippet_idx].address)
                }
                videoElement.src = snippet_address[current_snippet_idx].videoBlob

                //transition back
                loadingProgress.style.opacity = "0"
                videoElement.style.opacity = '1' 
                console.log("video loaded sucessfully")
                resolve(null)
            }, 200)
        })
        
    }

    function addSnippetControls(current_snippet_idx, snippet_address){
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= -50 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight + 100 || document.documentElement.clientHeight + 100 ) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };
        function controlsFeedback(type){
            const feedbackDiv = snippetsContainer.querySelector(".snippet-controls-feedback")
            feedbackDiv.style.transition = 'opacity 0s ease'
            feedbackDiv.style.opacity = "1"

            switch(type){
                case "pause":
                    feedbackDiv.innerHTML = '<i class="fa-solid fa-play"></i>'
                    break;
                case "play":
                    feedbackDiv.innerHTML = '<i class="fa-solid fa-pause"></i>'
                    break;
                case "mute":
                    feedbackDiv.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
                    break;
                case "unmute":
                    feedbackDiv.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
                    break;
                case "forward10":
                    feedbackDiv.innerHTML = '  10<i class="fa-solid fa-angles-right"></i>'
                    break;
                case "backward10":
                    feedbackDiv.innerHTML = '  <i class="fa-solid fa-angles-left"></i>10  '
                    break;    

            }
            setTimeout(()=>{
                feedbackDiv.style.transition = 'opacity 1s ease'
                feedbackDiv.style.opacity = "0"
            }, 50)
            
        }
        function addPlayButtonControls(videoElement, playButton){
            let playing = false
            let autoplay = true

            function togglePlayPause(){
                if (playing === false) {
                    videoElement.play()
                    autoplay = true
                    playing = true
                    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
                    controlsFeedback("play")
                } else {
                    videoElement.pause()
                    autoplay = false
                    playing = false
                    playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
                    controlsFeedback("pause")
                }
                
            }
            // Function to check videoElement visibility and autoplay
            const videoAutoplay = () => {
                const rect = videoElement.getBoundingClientRect();
                const isVisible = isInViewport(videoElement)
        
                if (isVisible && autoplay) {
                    videoElement.play()
                    playing = true
                    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
                } else {
                    videoElement.pause()
                    playing = false
                    playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
                }
            };

            videoAutoplay();
            window.addEventListener('scroll', videoAutoplay);
            window.addEventListener('resize', videoAutoplay);
        
            // Event listeners for play and pause buttons
            playButton.addEventListener('click', () => {
                togglePlayPause()
            });
            document.addEventListener('keydown', (e)=>{
                if(e.code === "Space" && isInViewport(videoElement))
                    togglePlayPause()
            })
        }
        function addMuteUnmuteControls(videoElement, muteUnmuteButton){
            let muted = true
            function toggleMuteUnmute(){
                muted = ! muted
                videoElement.muted = muted
                if(muted){
                    muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
                    controlsFeedback("mute")
                }
                else{
                    muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
                    controlsFeedback("unmute")
                }
            }
            muteUnmuteButton.addEventListener("click",toggleMuteUnmute)
            document.addEventListener('keydown', (e)=>{
                if(e.code === "KeyM" && isInViewport(videoElement))
                    toggleMuteUnmute()
            })
            
        }
        function addSnippetTimelineProgress(snippetProgressDiv, videoElement){
            function formatTime(seconds) {
                if(seconds == NaN)
                    console.log("something wrong with the currentTime of video")

                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }
            videoElement.addEventListener('timeupdate', () => {
                const percentage = (videoElement.currentTime / videoElement.duration) * 100;
                snippetProgressDiv.querySelector(".progress-indicator").style.width = percentage + '%';
                snippetProgressDiv.querySelector("#time-stamp").innerHTML = '- ' + formatTime( parseInt( videoElement.duration - videoElement.currentTime ) )
        
            });
            snippetProgressDiv.addEventListener('click', (e) => {
                const rect = snippetProgressDiv.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const newTime = (offsetX / snippetProgressDiv.clientWidth) * videoElement.duration;
                videoElement.currentTime = newTime;
                snippetProgressDiv.querySelector("#time-stamp").innerHTML = ' - ' + formatTime( parseInt( videoElement.duration - videoElement.currentTime ) )
            });
            console.log("added time controls on left and right ")
            document.addEventListener('keydown', (e)=>{
                if(e.code === "ArrowLeft" && isInViewport(videoElement)){
                    videoElement.currentTime -= 10
                    controlsFeedback("backward10")
                } else if(e.code === "ArrowRight" && isInViewport(videoElement)){
                   videoElement.currentTime += 10
                   controlsFeedback("forward10")
                }
            })
        }
        function addFullScreenControls(videoElement, fullscreenButton){
            fullscreenButton.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (snippetsContainer.requestFullscreen) {
                        snippetsContainer.requestFullscreen();
                    } else if (snippetsContainer.mozRequestFullScreen) { // Firefox
                        snippetsContainer.mozRequestFullScreen();
                    } else if (snippetsContainer.webkitRequestFullscreen) { // Chrome, Safari, Opera
                        snippetsContainer.webkitRequestFullscreen();
                    } else if (snippetsContainer.msRequestFullscreen) { // IE/Edge
                        snippetsContainer.msRequestFullscreen();
                    }
                    videoElement.style.transform = "translate(0, -50%)"
                    videoElement.style.borderRadius = "0rem"
                    videoElement.play()
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) { // Firefox
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { // IE/Edge
                        document.msExitFullscreen();
                    }
                    videoElement.style.transform = "translate(0, 0%)"
                    videoElement.style.borderRadius = "1rem"
                }
                document.addEventListener('fullscreenchange', () => {
                    if (!document.fullscreenElement) {
                        videoElement.style.transform = "translate(0, 0%)";
                        videoElement.style.borderRadius = "1rem"
                    }
                });
            });
        }
        function addNextPrevButtonControls(prevButton,nextButton){
            function loadNext(){
                current_snippet_idx += 1
                if(current_snippet_idx >= snippet_address.length)
                    current_snippet_idx = 0
                loadVideo(snippet_address, current_snippet_idx)
            }
            function loadPrev(){
                current_snippet_idx -= 1
                if(current_snippet_idx <= 0)
                    current_snippet_idx = 0
                loadVideo(snippet_address, current_snippet_idx)
            }
            nextButton.addEventListener("click", loadNext)
            prevButton.addEventListener("click", loadPrev)
        }

        const snippetControls = snippetsContainer.querySelector(".snippet-controls")
        const snippetProgressDiv = snippetsContainer.querySelector(".snippet-progress")

        const playButton = snippetControls.querySelector('#play-and-pause');
        const muteUnmuteButton = snippetControls.querySelector("#mute-and-unmute")
        const fullscreenButton = snippetControls.querySelector("#fullscreen")
        const nextButton = snippetControls.querySelector("#next")
        const prevButton = snippetControls.querySelector("#prev")

        addPlayButtonControls(videoElement, playButton)
        addMuteUnmuteControls(videoElement, muteUnmuteButton)
        addSnippetTimelineProgress(snippetProgressDiv, videoElement)
        addFullScreenControls(videoElement, fullscreenButton)
        addNextPrevButtonControls(prevButton, nextButton) 
        
        console.log("added controls for snippets")
    };

    async function main(snippet_address){
        console.log(snippet_address)
        await loadVideo(snippet_address, current_snippet_idx)
        addSnippetControls(current_snippet_idx, snippet_address)


        let snippetDetailsTimeoutId;
        videoElement.addEventListener('mousemove', ()=> {
    
            clearTimeout(snippetDetailsTimeoutId);
            snippetDetails.style.transition = 'opacity 0s ease'
            snippetDetails.style.opacity = '1';
    
            snippetDetailsTimeoutId = setTimeout(() => {
                snippetDetails.style.transition = 'opacity 0.5s ease'
                snippetDetails.style.opacity = '0';
    
            }, 5000);
        });
    }

    fetchSnippetAddress()
        .then(snippet_address => {
            main(snippet_address)
        })

})