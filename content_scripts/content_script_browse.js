// This file handles hiding the duration indicators for the matches
// that you can watch in the video archive (wst.tv/videos/browse).


// Chrome namespace
if (!('browser' in globalThis)) {
    globalThis.browser = globalThis.chrome;
  }


// Hide the durations.
function hide_durations() {
    // On video thumbnails.
    let durations = document.querySelectorAll(".article-card__duration");
    for (let dur of durations) {
        dur.remove();
    }

    // On video info below the video being watched.
    let vid_duration = document.querySelector(".viewer-container__duration");
    if (vid_duration) {
        vid_duration.remove();
    }
}


// Hide duration info on the video being watched.
function hide_video_controls() {
    // Only want it on non-live videos.
    let path = document.location.pathname;
    if (!path.includes("live")) {
        let vid_progress_control = document.querySelector(".vjs-progress-control");
        let vid_remaining_time = document.querySelector(".vjs-remaining-time");
        if (vid_progress_control) {
            vid_progress_control.remove();
        }
        if (vid_remaining_time) {
            vid_remaining_time.remove();
        }
    }
}


// Keyboard arrows-based seeking.
function seek(event) {
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        let delta = event.shiftKey ? 300 : 10;  // Might tweak the 300s.
        if (event.key == "ArrowLeft") {
            delta = -1 * delta;
        }
        let video = document.querySelector("video");
        let current_time = video.currentTime;
        let new_current_time = current_time + delta;
        if (new_current_time < 0) {
            new_current_time = 0;
        } else if (new_current_time > video.duration) {
            new_current_time = current_time;
        }
        video.currentTime = new_current_time;
    }
}

function toggle_pause_play(event) {
    if (event.key == " ") {
        event.preventDefault();  // Prevents scrolling.
        let video = document.querySelector("video");
        // video.paused ? video.play() : video.pause();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}


// Setup keyboard video seeking.
function setup_keyboard_seek() {
    let video = document.querySelector("video")
    if (video) {
        video.addEventListener('play', (event) => video.focus());
        video.addEventListener('pause', (event) => video.focus());
        video.addEventListener('keydown', seek);
        video.addEventListener('keydown', toggle_pause_play);
    }
}


// Setup an observer on DOM element 'body'.
//
// This fn gets called a decent number of times (10+) per navigation,
// but doesn't seem to affect performance.
function setup_observer(hideDurationsBool) {
    // This fn is called prior to the DOM finishing loading;
    // If you debug here, you'll see that the components of interest aren't
    // yet there, so we listen for childList change, which will detect
    // the addition of all those match tiles.
    let targetNode = document.querySelector("body");
    if (targetNode) {
        let main_observer = new MutationObserver((mutationList, observer) => {
            if (hideDurationsBool) {
                hide_durations();
                hide_video_controls();
            }

            setup_keyboard_seek();
        });
        main_observer.observe(targetNode, { childList: true, subtree: true });    
    } else {
        setTimeout(setup_observer, 100);
    }

    // I think unnecessary.
    if (hideDurationsBool) {
        hide_durations();
        hide_video_controls();
    }
}


function main(hideDurationsBool) {
    setup_observer(hideDurationsBool);

    // Hide initial populations.
    if (hideDurationsBool) {
        hide_durations();
        hide_video_controls();
    }
}


const gettingHideDurations = browser.storage.local.get({ "hideDurations": false });
gettingHideDurations.then(
    (result) => main(Object.values(result)[0]), 
    (error) => console.log(error)
);