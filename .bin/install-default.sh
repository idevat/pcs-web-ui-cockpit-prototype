#!/bin/sh
sudo rm -r /var/www/html/* && sudo cp -r build/* /var/www/html
ln -snf "$PWD"/build ~/.local/share/cockpit/hacluster
