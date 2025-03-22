#!/bin/bash
ssh-keygen -A
service ssh start 
sleep 1
service ssh status
exec "$@"