#!/bin/bash

# rename the previous zipped package
[[ -f ../WSTPlayEnhancer_firefox.zip ]] && mv ../WSTPlayEnhancer_firefox.zip ../WSTPlayEnhancer_firefox_old.zip

# get the right manifest
cp manifests/manifest_firefox.json manifest.json

# package for submission
zip -r ../WSTPlayEnhancer_firefox.zip * -x "*.git*" "README*" "LICENSE" "*.DS_Store*" "*.paint*" "*.sh" "manifests/*" "PRIVACYPOLICY"