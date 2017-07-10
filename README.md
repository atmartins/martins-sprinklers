# Martins' Sprinklers
Smart Sprinkler System written in Node for Raspberry Pi.

**More details available at:** [https://aaronmartins.com/articles/sprinklers-node-raspberry-pi/](https://aaronmartins.com/articles/sprinklers-node-raspberry-pi/)

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

## Use
There are a few endpoints that can be interacted with. I'm running this on my Raspberry Pi on my local network at `192.168.1.217:3217`

#### HTTP Verb  - URL - Explanation
* `PUT` - `http://192.168.1.217:3217/channel/all/on` - Turn all channels on.
* `PUT` - `http://192.168.1.217:3217/channel/all/off` - Turn all channels off.

The following work the same for channels 1-8:
* `PUT` - `http://192.168.1.217:3217/channel/1/on` - Turn channel 1 on.
* `PUT` - `http://192.168.1.217:3217/channel/1/off` - Turn channel 1 off.
* `GET` - `http://192.168.1.217:3217/channel/1` - Get channel 1's state.
Returns an object like:
```
{
  id: 1,
  state: 'on',
  msg: 'Zone 1 is on.'
}
```
or a similarly-shaped error.


## Hardware
[Photo of the sprinkler valve manifold](https://goo.gl/photos/eYZANNdi633yRVty7)
