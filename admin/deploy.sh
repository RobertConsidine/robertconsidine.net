#!/bin/bash

aws s3 rm s3://blightednixhound.robjinman.com --recursive
aws s3 cp ./dist/rjblog-admin s3://blightednixhound.robjinman.com/ --recursive
