#!/bin/bash
#
# Written by Aaron Martins
# me@aaronmartins.com
#
# Sync files to production.
#
# Ignores timestamps, uses md5 sums on files to see if different,
#     allowing it to be compatible with version control (which
#     ignores timestamps).
#
# Moves contents of folder 1 into folder 2. Update any files which have changed (even if older) and delete any files which no longer exist in source.
#

# log file
T="logs/deploy_$(date +%s).log"

src="."
dest="pi@192.168.1.217:/home/pi/martins-sprinklers"
options="-rpgohi --links --checksum --stats --progress --delete --force --no-perms --no-owner --no-group"

# REMEMBER: No quotes around the folder names!
exclusions="--exclude '*.DS_Store' --exclude '*.log' --exclude .git --exclude node_modules"


#c --checksum - skip based on checksum, not mod-time & size
#r - recurse into directories
#l - copy symlinks as symlinks
#p - preserve permissions
#t - preserve modification times
#g - preserve group
#o - preserve owner
#h - output numbers in a human-readable format
#i - output a change-summary for all updates
#--delete - delete extraneous files from dest dirs
#--force - force deletion of dirs even if not empty
#--progress - show progress during transfer

echo "Key for rsync output:"
echo " "
echo "< - upload file"
echo "> - download file"
echo ". - item not updating, attributes may be updated though"
echo "* - check the message to the right on this line (e.g. Deleting)"
echo "f - file"
echo "d - directory"
echo "c - local change/creation to the file"
echo "s - size is different, updating file"
echo "t - modification time is different, updating to sender's value"
echo "T - modification time will be set to the transfter time"
echo "p - permissions are different, updating to sender's value"
echo "o - owner is different, updating to sender's value"
echo "g - group is different, updating to sender's value"
echo " "


# Dry-run, so we can see and approve changes
cmd="rsync --dry-run $options $exclusions $src $dest"
echo "$cmd"
$cmd

echo ">>> Proceed with updating live site? [y/n]:"
read uProceed

if [ $uProceed == y ]
then
  echo "------- rsync starting -------"

  cmd="rsync $options $exclusions $src $dest"
  $cmd

  echo "------- rsync complete -------"
else
	echo "-------------- NOT syncing anything ---------------"
fi
