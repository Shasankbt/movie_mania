document.addEventListener("DOMContentLoaded", ()=>{
    const snippetsContainer = document.querySelector(".snippets-container")
    const videoElement = snippetsContainer.querySelector("video")
    const snippetTitleBox = snippetsContainer.querySelector(".title-box")
    const loadingProgress = snippetsContainer.querySelector("progress")
    const snippetDetails = snippetsContainer.querySelector(".snippet-details")
    let current_snippet_idx = 0


    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -50 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight + 100 || document.documentElement.clientHeight + 100 ) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    function formatTime(seconds) {
        if(seconds == NaN)
            console.log("something wrong with the currentTime of video")

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    class Snippet{

        constructor(videoElement){

            this.playing = false
            this.autoplay = true
            this.muted = true
            this.loading = true

            this.videoElement = videoElement
            this.snippetControls = snippetsContainer.querySelector(".snippet-controls")
            this.snippetTimelineDiv = snippetsContainer.querySelector(".snippet-progress")
            this.feedbackDiv = snippetsContainer.querySelector(".snippet-controls-feedback")
            this.loadingProgress = snippetsContainer.querySelector("progress")

            this.playButton = this.snippetControls.querySelector('#play-and-pause')
            this.muteUnmuteButton = this.snippetControls.querySelector("#mute-and-unmute")
            this.fullscreenButton = this.snippetControls.querySelector("#fullscreen")
            this.nextButton = this.snippetControls.querySelector("#next")
            this.prevButton = this.snippetControls.querySelector("#prev")

            const buttons = [
                this.playButton,
                this.muteUnmuteButton,
                this.fullscreenButton,
                this.nextButton,
                this.prevButton
            ];
            
            buttons.forEach(button => {
                button.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') e.preventDefault()
                });
            });

            // manage video autoplay
            
            this.videoAutoplay();
            window.addEventListener('scroll', this.videoAutoplay);
            window.addEventListener('resize', this.videoAutoplay);

            // update the time continously
            this.videoElement.addEventListener('timeupdate', () => {
                const percentage = (this.videoElement.currentTime / this.videoElement.duration) * 100;
                this.snippetTimelineDiv.querySelector(".progress-indicator").style.width = percentage + '%';
                this.snippetTimelineDiv.querySelector("#time-stamp").innerHTML = '- ' + formatTime( parseInt( this.videoElement.duration - this.videoElement.currentTime ) )
        
            });
            /// feature to click on timescale to scrub
            this.snippetTimelineDiv.addEventListener('click', (e) => {
                const rect = this.snippetTimelineDiv.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const newTime = (offsetX / this.snippetTimelineDiv.clientWidth) * this.videoElement.duration;
                this.videoElement.currentTime = newTime;
                this.snippetTimelineDiv.querySelector("#time-stamp").innerHTML = ' - ' + formatTime( parseInt( this.videoElement.duration - this.videoElement.currentTime ) )
            });
           
            
    
            this.playButton.addEventListener('click',() => { this.togglePlayPause()})
            this.muteUnmuteButton.addEventListener("click",() => {this.toggleMuteUnmute()} )
            this.fullscreenButton.addEventListener('click', ()=>{
                if (!document.fullscreenElement)    { this.enterFullScreen() }
                else                                { this.exitFullScreen() }
                document.addEventListener('fullscreenchange', () => {
                    if (!document.fullscreenElement) {
                        this.videoElement.style.transform = "translate(0, 0%)";
                        this.videoElement.style.borderRadius = "1rem"
                    }
                });
            } )
            document.addEventListener('keydown', (e)=>{
                if(e.code === "Space" && isInViewport(this.videoElement)){   // control play-pause
                    this.togglePlayPause()
                } else if(e.code === "KeyM" && isInViewport(videoElement)){    // control mute-unmute
                    this.toggleMuteUnmute()
                } else if(e.code === "ArrowLeft" && isInViewport(this.videoElement)){
                    this.videoElement.currentTime -= 10
                    controlsFeedback("backward10")
                } else if(e.code === "ArrowRight" && isInViewport(this.videoElement)){
                    this.videoElement.currentTime += 10
                    controlsFeedback("forward10")
                }
            })
            
            console.log("added controls for snippets")
        }
        videoAutoplay(){
            if(this.loading)
                return
            // const rect = videoElement.getBoundingClientRect();
            const isVisible = isInViewport(this.videoElement)
    
            if (isVisible && this.autoplay) {
                console.log("autoplay play input")
                this.videoElement.play()
                this.playing = true
                this.playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
            } else {
                videoElement.pause()
                this.playing = false
                this.playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
            }
        };
        displayControlsFeedback(type){
            this.feedbackDiv.style.transition = 'opacity 0s ease'
            this.feedbackDiv.style.opacity = "1"

            switch(type){
                case "pause":
                    this.feedbackDiv.innerHTML = '<i class="fa-solid fa-play"></i>'
                    break;
                case "play":
                    this.feedbackDiv.innerHTML = '<i class="fa-solid fa-pause"></i>'
                    break;
                case "mute":
                    this.feedbackDiv.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
                    break;
                case "unmute":
                    this.feedbackDiv.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
                    break;
                case "forward10":
                    this.feedbackDiv.innerHTML = '  10<i class="fa-solid fa-angles-right"></i>'
                    break;
                case "backward10":
                    this.feedbackDiv.innerHTML = '  <i class="fa-solid fa-angles-left"></i>10  '
                    break;    

            }
            setTimeout(()=>{
                this.feedbackDiv.style.transition = 'opacity 1s ease'
                this.feedbackDiv.style.opacity = "0"
            }, 50)
            
        }
        togglePlayPause(){
            if (this.playing === false) {this.playVieo() }
            else                        {this.pauseVideo() }
        }
        toggleMuteUnmute(){
            if(this.muted)  { this.unmuteVideo() }
            else            { this.muteVideo() }
        }
        playVieo(){
            this.videoElement.play()
            this.autoplay = true
            this.playing = true
            this.playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
            this.displayControlsFeedback("play")
        }
        pauseVideo(){
            this.videoElement.pause()
            this.autoplay = false
            this.playing = false
            this.playButton.innerHTML = '<i class="fa-solid fa-play"></i>'
            this.displayControlsFeedback("pause")
        }
        muteVideo(){
            this.muted = true
            this.videoElement.muted = true
            this.muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
            this.displayControlsFeedback("mute")
        }
        unmuteVideo(){
            this.muted = false
            this.videoElement.muted = false
            this.muteUnmuteButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
            this. displayControlsFeedback("unmute")
        }
        enterFullScreen(){
            if (snippetsContainer.requestFullscreen) {
                snippetsContainer.requestFullscreen();
            } else if (snippetsContainer.mozRequestFullScreen) { // Firefox
                snippetsContainer.mozRequestFullScreen();
            } else if (snippetsContainer.webkitRequestFullscreen) { // Chrome, Safari, Opera
                snippetsContainer.webkitRequestFullscreen();
            } else if (snippetsContainer.msRequestFullscreen) { // IE/Edge
                snippetsContainer.msRequestFullscreen();
            }
            this.videoElement.style.transform = "translate(0, -50%)"
            this.videoElement.style.borderRadius = "0rem"
            this.videoElement.play()
        }
        exitFullScreen(){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            this.videoElement.style.transform = "translate(0, 0%)"
            this.videoElement.style.borderRadius = "1rem"
        }

        showLoadingScreen(){
            this.videoElement.style.opacity = "0"
            this.videoElement.style.transition = "opacity 0.5s ease"
            this.loadingProgress.style.opacity = "0"
            this.loadingProgress.style.transition = "opacity 0.5s ease"
            this.loadingProgress.value = 0;
            this.loadingProgress.style.opacity = "1"
        }
        hideLoadingScreen(){
            this.loadingProgress.style.opacity = "0"
            this.videoElement.style.opacity = '1' 
        }
        refresh(){
            this.loading = false 
            
            this.videoAutoplay()
        }
    }


    async function MAIN(snippet_address){
        const snippet = new Snippet(videoElement)
        await loadVideo(snippet_address, current_snippet_idx, snippet)

        let snippetDetailsTimeoutId;
        snippet.nextButton.addEventListener("click", ()=>{
            current_snippet_idx += 1
            if(current_snippet_idx >= snippet_address.length)
                current_snippet_idx = 0
            loadVideo(snippet_address, current_snippet_idx, snippet)
        })
        snippet.prevButton.addEventListener("click", ()=>{
            current_snippet_idx -= 1
            if(current_snippet_idx <= 0)
                current_snippet_idx = 0
            loadVideo(snippet_address, current_snippet_idx, snippet)
        })
        snippet.videoElement.addEventListener('mousemove', ()=> {
    
            clearTimeout(snippetDetailsTimeoutId);
            snippetDetails.style.transition = 'opacity 0s ease'
            snippetDetails.style.opacity = '1';
    
            snippetDetailsTimeoutId = setTimeout(() => {
                snippetDetails.style.transition = 'opacity 0.5s ease'
                snippetDetails.style.opacity = '0';
    
            }, 5000);
        });

    }

    
    
    // video fetcher function
    let currentFetchController;
    function fetchVideo(filename){

        if (currentFetchController) { currentFetchController.abort(); }
        currentFetchController = new AbortController();
        const signal = currentFetchController.signal;

        const url = `/snippets/${filename}`;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
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
                    resolve({ success: true, url: URL.createObjectURL(xhr.response) });
                } else {
                    reject(new Error(`Failed to load video: ${xhr.statusText}`));
                }
            };
            xhr.onabort = () => {
                console.warn('Fetch aborted');
                resolve({ success: false, url: null }); 
            };
            signal.addEventListener('abort', () => {
                xhr.abort();
            });
            xhr.send();
        });
    }

    // load to screen with transitions
    async function loadVideo(snippet_address, current_snippet_idx, snippetObject){
        return new Promise((resolve, reject) => {
  
            //update title
            snippetTitleBox.querySelector(".title").innerHTML = snippet_address[current_snippet_idx].title
            snippetTitleBox.querySelector(".subtitle").innerHTML = snippet_address[current_snippet_idx].subtitle

            // to simulate load
            setTimeout(async ()=>{
                if(snippet_address[current_snippet_idx].videoBlob === undefined){
                    snippetObject.loading = true
                    snippetObject.showLoadingScreen()
                    const data  = await fetchVideo(snippet_address[current_snippet_idx].file)
                    if(data.success){
                        snippetObject.loading = false
                        snippet_address[current_snippet_idx].videoBlob = data.url

                        snippetObject.hideLoadingScreen()
                        
                        console.log("video loaded sucessfully")
                    }
                    
                }   
                snippetObject.videoElement.src = snippet_address[current_snippet_idx].videoBlob
                snippetObject.refresh()            
                resolve(null)
            }, 200)
        })
        
    }
    function fetchSnippetAddress(){
        return new Promise((resolve, reject) => {
            fetch("/snippet_address", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON
            })
                .then(response => response.json())
                .then(data => resolve(data))
        })
    }
    fetchSnippetAddress()
        .then(snippet_address => {
            console.log(snippet_address)
            MAIN(snippet_address)
        })

})