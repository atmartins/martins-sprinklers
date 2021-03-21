#!/bin/sh -x

# Install crontab
mkdir -p ./tmp
crontab -l > ./tmp/original-crons
cp ./tmp/original-crons ./tmp/new-crons
cat ./install/cron/martins-sprinklers >> ./tmp/new-crons
crontab ./tmp/new-crons

# Set up default logfile
sudo touch /var/log/martins-sprinklers.log
sudo chown pi:pi /var/log/martins-sprinklers.log

# Install npm dependencies. Note NO sudo here
npm install --production
