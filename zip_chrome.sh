#!/bin/bash

# rename the previous zipped package
[[ -f ../WSTPlayEnhancer_chrome.zip ]] && mv ../WSTPlayEnhancer_chrome.zip ../WSTPlayEnhancer_chrome_old.zip

# get the right manifest
cp manifests/manifest_chrome.json manifest.json

# package for submission
zip -r ../WSTPlayEnhancer_chrome.zip * -x "*.git*" "README*" "LICENSE" "*.DS_Store*" "*.paint*" "*.sh" "manifests/*" "PRIVACYPOLICY"

# reset the manifest to the Firefox version, which works on Chrome for dev
cp manifests/manifest_firefox.json manifest.json