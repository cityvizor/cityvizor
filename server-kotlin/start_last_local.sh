#!/bin/bash

FILE_NAME=`ls /home/server-kotlin | grep server | grep ".tar" | tail -1`
FILE_NO_EXT=${FILE_NAME%.*}

tar -C "/home/server-kotlin" -xf "/home/server-kotlin/$FILE_NAME"

/home/server-kotlin/$FILE_NO_EXT/bin/server