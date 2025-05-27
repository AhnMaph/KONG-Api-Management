#!/bin/sh
# Start cron as root
cron
# Switch to nobody and run the Python app
exec gosu nobody:nogroup python http_log_server.py