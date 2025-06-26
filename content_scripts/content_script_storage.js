// Methods for storing/retrieving the times in videos
// where you left off watching.


// Chrome namespace
if (!('browser' in globalThis)) {
    globalThis.browser = globalThis.chrome;
  }


// GLOBALS
let CURRENT_VIDEO_ID = "";


/**
 * Pointless error handler
 * 
 * @param {string} error 
 */
function onError(error) {
    console.log(error);
  }

/**
 * Update the time for the video on local storage.
 * 
 * @param {HTMLMediaElement} video Video HTML Element.
 * @param {string} video_id Video ID taken from URL's path.
 */
function update_stored_time(video, video_id) {
    let settingTime = browser.storage.local.set({ [video_id]: video.currentTime });
    settingTime.then(() => {}, onError);
}


/**
 * Sets the video to where you left off.
 * 
 * @param {Object.<string, number>} result The video ID and stored currentTime.
 */
function seek_to_last_saved_time(result) {
    // NB This call presumes its caller has verified the existence of mux-player.
    // If `querySelector("mux-player")` returns `null`, there will be an error.
    let video = document.querySelector("mux-player").shadowRoot.querySelector("mux-video").shadowRoot.querySelector("video");
    video.currentTime = Object.values(result)[0];
}


/**
 * (Initializes or (retrieves and seeks)) and tracks videos' time storage.
 */
function handle_time_storage() {
    // I feel like there's some sort of timing-based error lurking, but
    // it seems to work fine in practice. If I do hit an error, maybe put it
    // in a 'body' MO callback.
    let video_container = document.querySelector("mux-player");
    let path = document.location.pathname;
    let path_parts = path.split('/');
    if ((video_container !== null) && path.startsWith("/videos") && (path_parts.length === 3)) {
        let video = video_container.shadowRoot.querySelector("mux-video").shadowRoot.querySelector("video");
        let video_id = path_parts[2];   // `path_parts` should be ["", "videos", {video ID}]
        if (CURRENT_VIDEO_ID === video_id) {
            update_stored_time(video, video_id);
        } else {
            CURRENT_VIDEO_ID = video_id;
            const gettingVidTime = browser.storage.local.get({ [video_id]: 0 });
            gettingVidTime.then(seek_to_last_saved_time, onError);
        }
    } else {
        // This hedges against nav from then back to the same vid
        CURRENT_VIDEO_ID = "";
    }
}


window.setInterval(handle_time_storage, 1000);