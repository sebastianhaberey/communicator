# communicator

Web-based app to scan documents locally and upload them to a Nextcloud account.
To be used with Raspberry PI, touch screen and scanservjs.

## Prerequisites

Install scanservjs. Do not use the [installer script](https://raw.githubusercontent.com/sbs20/scanservjs/master/packages/server/installer.sh).
as it will install a global node version. Instead create user scanj and install n for user.
Then follow the steps in the installer script.

## Installation

1. Create user communicator: `sudo useradd -m -g users communicator`
2. For shutdown functionality: add user to no-password sudoers: `sudo cp /etc/sudoers.d/010_pi-nopasswd /etc/sudoers.d/010_communicator-nopasswd` (and edit file)
3. Change user login shell to zsh: `sudo chsh -s /usr/bin/zsh communicator`
4. Switch to user: `sudo su - communicator`
5. Install [n](https://www.npmjs.com/package/n): `curl -L https://git.io/n-install | bash`
6. Install Node.js 16.17.1
7. Install yarn: `npm install --global yarn`
8. Clone repository into www directory `git clone https://github.com/sebastianhaberey/communicator.git /var/www/communicator`
9. `cd /var/www/communicator`
10. `yarn install`
11. `yarn deploy`
12. Copy systemd service configuration `cp scripts/communicator.service /etc/systemd/system`
13. Enable service: `sudo systemctl enable communicator`

## Various commands

Start systemd service:
`sudo systemctl start communicator`

Enable service autostart:
`sudo systemctl enable communicator`

Show service log output:
`journalctl -u communicator`