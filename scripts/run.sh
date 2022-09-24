#!/bin/zsh

source ./run.config.sh || exit 1

clear

eval "node backend/Application.js ${COMMAND_LINE_ARGUMENTS}"
