#!/bin/bash
export SENTRY_ORG=sentry
export SENTRY_PROJECT=fuksilaite
export SENTRY_URL=https://toska.it.helsinki.fi/


SENTRY_RELEASE=$(cat /SENTRY_RELEASE)
sentry-cli releases new -p $SENTRY_PROJECT $SENTRY_RELEASE
sentry-cli releases set-commits --auto $SENTRY_RELEASE
sentry-cli releases files $SENTRY_RELEASE upload ./dist/main.js '~/fuksilaite/main.js'
sentry-cli releases files $SENTRY_RELEASE upload-sourcemaps ./dist
sentry-cli releases finalize $SENTRY_RELEASE
