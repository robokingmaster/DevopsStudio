
#!/usr/bin/env sh
set -eu

# (optional) simple check for APP_COLOR present
: "${APP_COLOR:=steelblue}"

# Start gunicorn; no quotes around the whole command
exec
