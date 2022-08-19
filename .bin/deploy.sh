#!/bin/sh

#BUILD

REACT_APP_PCS_WEB_UI_ENVIRONMENT="cockpit" npm run build
rm -r build-cockpit
mv build build-cockpit

npm run build
rm -r build-standalone
mv build build-standalone

# COPY

scp -r build-cockpit/* r911:/home/user1/projects/cockpit-auth-prototype

PCSD_PUBLIC_DIR="/home/user1/projects/pcs/pcsd/public/"

# shellcheck disable=SC2029
ssh r911 "sudo rm -rf $PCSD_PUBLIC_DIR{ui,build-standalone}"
scp -r build-standalone r911:$PCSD_PUBLIC_DIR
# shellcheck disable=SC2029
ssh r911 "mv ${PCSD_PUBLIC_DIR}build-standalone ${PCSD_PUBLIC_DIR}ui"
