#!/bin/sh
npm run build
if [ -e .dev/install.sh ]; then
	.dev/install.sh
else
	.bin/install-default.sh
fi
