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
        // I might be able to chain these .shadowRoot, .qS, and .remove calls if mux-player has
        // media-time-range and mxp-time-display as components (vs loaded in
        // dynamically), but unsure how to verify.
        let video_container = document.querySelector("mux-player");
        if (video_container !== null) {
            let controls_container = video_container.shadowRoot.querySelector("media-theme-mux");
            if (controls_container !== null) {
                let vid_progress_control = controls_container.shadowRoot.querySelector("media-time-range");
                let vid_remaining_time = controls_container.shadowRoot.querySelector("mxp-time-display");
                if (vid_progress_control) {
                    vid_progress_control.remove();
                }
                if (vid_remaining_time) {
                    vid_remaining_time.remove();
                }
            }
        }
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