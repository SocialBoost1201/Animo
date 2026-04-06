#!/bin/bash
NODE_BIN="/opt/homebrew/Cellar/node@22/22.22.1_1/bin"
exec "$NODE_BIN/node" /opt/homebrew/Cellar/node@22/22.22.1_1/lib/node_modules/corepack/dist/pnpm.js "$@"
