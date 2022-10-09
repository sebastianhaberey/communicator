# communicator

Minimalistic UI to use a Raspberry Pi with a touchscreen as a control
unit for an attached scanner.

![screenshot](https://github.com/sebastianhaberey/communicator/raw/main/doc/screenshot.png)

It uses the awesome [scanservjs](https://github.com/sbs20/scanservjs) project
and uploads the scanned document to a pre-configured Nextcloud account. It
is probably not very useful for anyone but me, which is why the following
instructions are rather brief and incomplete.

## Set up Raspbian Lite

- install Raspberry Pi OS Lite using Raspberry Pi Imager: https://www.raspberrypi.com/software/
- make changes for Waveshare display: https://www.waveshare.com/wiki/4.3inch_DSI_LCD?Amazon
- set up Openbox window manager: https://die-antwort.eu/techblog/2017-12-setup-raspberry-pi-for-kiosk-mode/
- configure Openbox in `/etc/xdg/openbox`

## Install communicator

1. create user communicator: `sudo useradd -m -g users communicator`
2. optional: for shutdown functionality: add user to no-password sudoers:
   `sudo cp /etc/sudoers.d/010_pi-nopasswd /etc/sudoers.d/010_communicator-nopasswd` then edit file
3. optional: change user login shell to zsh: `sudo chsh -s /usr/bin/zsh communicator`
4. switch to user: `sudo su - communicator`
5. install [n](https://www.npmjs.com/package/n): `curl -L https://git.io/n-install | bash`
6. install Node.js 16.17.1
7. install yarn: `npm install --global yarn`
8. clone repository into www directory `git clone https://github.com/sebastianhaberey/communicator.git /var/www/communicator`
9. `cd /var/www/communicator`
10. `yarn install`
11. `yarn deploy`
12. edit deploy/communicator.config.js
13. edit deploy/shutdown-wrapper.sh
14. copy systemd service configuration `cp scripts/communicator.service /etc/systemd/system`
15. enable service: `sudo systemctl enable communicator`

## Install scanservjs

1. create user scanservjs, install n and Node.js 12.22.12 (all like above)
2. remove `nodejs` and `npm` lines from `apt-get install` command in
   [installer script](https://raw.githubusercontent.com/sbs20/scanservjs/master/packages/server/installer.sh),
   run the script

## Various commands

- start systemd service: `sudo systemctl start communicator`
- enable service autostart: `sudo systemctl enable communicator`
- show service log output: `journalctl -u communicator`