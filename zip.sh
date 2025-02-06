#!/bin/bash

[[ -f ../WSTPlayEnhancer.zip ]] && mv ../WSTPlayEnhancer.zip ../WSTPlayEnhancer_old.zip

zip -r ../WSTPlayEnhancer.zip * -x "*.git*" "README*" "LICENSE" "*.DS_Store*" "*.paint*" "*.sh"