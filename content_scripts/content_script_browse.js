// This file handles hiding the duration indicators for the matches
// that you can watch in the video archive (wst.tv/videos/browse).


// Hide the durations.
function hide_durations() {
    let durations = document.querySelectorAll(".article-card__duration")
    for (let dur of durations) {
        dur.remove();
    }
}


// Setup an observer on DOM element 'main' if on the path '/videos/browse'.
function setup_main_observer() {
    let maybe_browse_str = document.location.pathname.split('/').pop();
    if (maybe_browse_str == "browse") {
        // This fn is called prior to the DOM finishing loading;
        // If you debug here, you'll see that the components of interest aren't
        // yet there, so we listen for childList change, which will detect
        // the addition of all those match tiles.
        let targetNode = document.querySelector("main");
        let main_observer = new MutationObserver((mutationList, observer) => {
            hide_durations();
        });
        main_observer.observe(targetNode, { childList: true, subtree: true });
        // Call for good measure. Precludes race condition issues.
        hide_durations();
    }
}


function main() {
    // hide initial population
    hide_durations();

    // Watch for URL path changes (interested in wst.tv/videos/browse)
    let oldHref = document.location.href;
    let body = document.querySelector('body');
    let href_observer = new MutationObserver((mutationList, observer) => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        setup_main_observer();
      }
    });
    href_observer.observe(body, { childList: true, subtree: true });

    // hide all new ones that arise after user clicks "Load more"
    setup_main_observer();
}


main()