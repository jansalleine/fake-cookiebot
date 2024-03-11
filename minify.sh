#!/bin/sh
command -v uglifyjs >/dev/null 2>&1 || { echo >&2 "[ERROR] uglifyjs not installed or not in PATH variable."; exit 1; }

uglifyjs --comments '/^\/*!/' FakeCookiebot.js > FakeCookiebot.min.js
