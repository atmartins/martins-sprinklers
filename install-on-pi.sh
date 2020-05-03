#!/bin/sh

# Run as sudo on pi

cp install/cron/martins-sprinklers.sh /etc/cron.d/

touch /var/log/martins-sprinklers.log

npm install