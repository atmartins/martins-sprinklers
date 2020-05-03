#!/bin/sh

# Run as sudo on pi

sudo cp install/cron/martins-sprinklers /etc/cron.d/

sudo touch /var/log/martins-sprinklers.log

npm install --production