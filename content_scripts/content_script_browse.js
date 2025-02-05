// This file handles hiding the duration indicators for the matches
// that you can watch in the video archive (wst.tv/videos/browse).


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
    let vid_progress_control = document.querySelector(".vjs-progress-control");
    let vid_remaining_time = document.querySelector(".vjs-remaining-time");
    if (vid_progress_control) {
        vid_progress_control.remove();
    }
    if (vid_remaining_time) {
        vid_remaining_time.remove();
    }
}


// Setup an observer on DOM element 'body'.
//
// This fn gets called a decent number of times (10+) per navigation,
// but doesn't seem to affect performance.
function setup_observer() {
    // This fn is called prior to the DOM finishing loading;
    // If you debug here, you'll see that the components of interest aren't
    // yet there, so we listen for childList change, which will detect
    // the addition of all those match tiles.
    let targetNode = document.querySelector("body");
    if (targetNode) {
        let main_observer = new MutationObserver((mutationList, observer) => {
            hide_durations();
            hide_video_controls();
        });
        main_observer.observe(targetNode, { childList: true, subtree: true });    
    } else {
        setTimeout(setup_observer, 100);
    }

    // I think unnecessary.
    hide_durations();
    hide_video_controls();
}


function main() {
    // Hide anything that populates after this fn runs.
    setup_observer();

    // Hide initial populations.
    hide_durations();
    hide_video_controls();
}


main()