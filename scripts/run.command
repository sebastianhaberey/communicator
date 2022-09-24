#!/bin/zsh
# use this for application start on macOS (e.g. double-click in finder)

PARENT_DIRECTORY=${0%/*} # https://stackoverflow.com/a/3588939/8707976)
cd ${PARENT_DIRECTORY}

source ./run.config.sh || exit 1

clear

eval "node backend/Application.js ${COMMAND_LINE_ARGUMENTS}"
