// Chrome namespace
if (!('browser' in globalThis)) {
    globalThis.browser = globalThis.chrome;
  }


const CHECKBOX = document.getElementById("hide-durations");


function handle_checkbox_event(event) {
    let gettingHideDurations = browser.storage.local.get({ "hideDurations": false });
    let settingHideDurations = gettingHideDurations.then(
        (result) => {
            let checked = !Object.values(result)[0];  // flip bool
            return browser.storage.local.set({ "hideDurations": checked });
        }, 
        (error) => console.log(error)
    );
    settingHideDurations.then(() => {}, (error) => console.log(error));
}

function initialize_checkbox(checkbox) {
    let gettingHideDurations = browser.storage.local.get({ "hideDurations": false });
    gettingHideDurations.then(
        (result) => {
            if (Object.values(result)[0]) {
                checkbox.setAttribute("checked", "checked");
            }
        }, 
        (error) => console.log(error)
    );
}

initialize_checkbox(CHECKBOX);
CHECKBOX.addEventListener("change", handle_checkbox_event);
