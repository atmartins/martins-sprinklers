# Martins' Sprinklers
Smart Sprinkler System written in Node for Raspberry Pi.

## Prerequisites
* node
* npm
* gpio-admin - see https://www.npmjs.com/package/pi-gpio for install instructions.

### Installing Node on Raspberry Pi
`wget http://node-arm.herokuapp.com/node_latest_armhf.deb`
`sudo dpkg -i node_latest_armhf.deb`

## Deployment
Edit deploy.sh, specifically the IP address of the destination. Then:
`./deploy.sh`
