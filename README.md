# Martins' Sprinklers
Smart Sprinkler System written in Node for Raspberry Pi.

## Prerequisites
* node
* npm
* gpio-admin - see https://www.npmjs.com/package/pi-gpio for install instructions.

### Installing Node on Raspberry Pi
`wget http://node-arm.herokuapp.com/node_latest_armhf.deb`
`sudo dpkg -i node_latest_armhf.deb`

### Installing this software
git clone https://github.com/atmartins/martins-sprinklers.git

## Use
`npm install`
`sudo npm start` (Pins require root access)

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


## Schedule
Using cron
`crontab -e`

```
@reboot sudo /usr/local/bin/node /home/pi/martins-sprinklers/index.js &
```

```
# Zone 1, blueberries - At 5am, errday, for 15 minutes.
0 5 * * *    curl -X PUT localhost:3217/channel/1/on
15 5 * * *   curl -X PUT localhost:3217/channel/1/off

# Zone 2, main garden - At 5:16am, errday, for 20 minutes.
16 5 * * *   curl -X PUT localhost:3217/channel/2/on
36 5 * * *   curl -X PUT localhost:3217/channel/2/off

# Zone 3, lawn - At 5:45am, errday, for 30 minutes.
45 5 * * *   curl -X PUT localhost:3217/channel/3/on
15 6 * * *   curl -X PUT localhost:3217/channel/3/off

# Zone 4, herbs - At 6:16am, errday, for 10 minutes.
16 6 * * *   curl -X PUT localhost:3217/channel/4/on
26 6 * * *   curl -X PUT localhost:3217/channel/4/off
```

## Boot
Restart node process after reboot:
TODO

## Development
### Deployment
To deploy from dev machine to the rPi, edit deploy.sh, specifically the IP address of the rPi. Then:
`./deploy.sh`

**More details available at:** [https://aaronmartins.com/articles/sprinklers-node-raspberry-pi/](https://aaronmartins.com/articles/sprinklers-node-raspberry-pi/)
