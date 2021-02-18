## 1.1.24
- fixed: some more logging
- fixed: description of stopparentfirst flag
- fixed: logging to file with timestamps
- maybe fixed?: shutdown message detection

## 1.1.23
- added: option to pass stopparentfirst flag in when installing

## 1.1.22
- fix: bugs in service.js

## 1.1.21
- changed: added unit logging.js
- changed: all logging functions from logging.js adding timestamps

## 1.1.20
- updated: node-windows
- added: some logging to install / uninstall
- fixed: attempted to start service twice after installed/alreadyinstalled events
- fixed: attempted to uninstall service twice from after stop/alreadystopped events

## 1.1.19
- updated: node-windows

## 1.1.18
- updated: shelljs (for Node 14.x compatibility)

## 1.1.17
- updated: node-windows
- added: parameter to specify executable name separately from service_id

## 1.1.16
- fixed: incorrect logFolder when SERVICEJS_LOGPATH is not specified
- added: append service name suffix to logfile

## 1.1.15
- fixed: tried to assign to const logpath

## 1.1.14
- fixed: cannot use null-coalescing operator (yet)

## 1.1.13
- added: use provided logpath for logging from service.js (via env.SERVICEJS_LOGPATH)

## 1.1.12
- updated: node-windows
- added: install params for account & password
- added: check if password is combined with account

## 1.1.11
- updated: node-windows
- added: support for workingdir param

## 1.1.10
- updated: node-windows
- removed: some unused require imports
- changed: (un)install now (un)installs service in PM2_HOME folder (node-windows creates "daemon" subfolder)
- fixed: uninstall now lets node-windows do the de-installation 
- changed: poll frequency for service removal
- added: some logging for service removal polling

## 1.1.9
- updated: node-windows
- added: setEnv.bat (for testing)
- improved: command line syntax & feedback
- added: support for service recovery config (onFailure & resetFailure)
- changed: install now takes a config object (instead of many params)
- added: validation.js for parsing and validating params
- fixed: name was used for uninstall (now using id)
- fixed: PM2_HOME was referenced before checking
- added: some more logging
- changed: proper var names for service_id (not service_name)
- fixed: service name was stored in .sid file (now service id)
- fixed: ".exe" should not be appended to service id

## 1.1.8
- removed: workaround for single .sid file in APPDATA folder
- added: install now checks if PM2_HOME folder exists
- added: install now checks for PM2_SERVICE_PM2_DIR env var
- added: install now checks if PM2_SERVICE_PM2_DIR exists
- added: install now sets PM2_SERVICE_PM2_DIR for service

## 1.1.7
- changed: now using our own fork of node-windows
- changed: install/uninstall now use .sid file in PM2_HOME folder
- added: install sets PM2_HOME env var for service
- added: install checks if PM2_HOME env var is set
- changed: service name arg is now optional for uninstall (uses .sid file when not specified)

## 1.1.6
- updated: restored orignal README
- improved: command-line args handling
- changed: made service name arg required
- added: description & logpath args
- updated: dependencies
- added: some more logging and error handling

## 1.1.5
- changed: now configuring log rotation and logPath (pm2_home\logs)
- added: logging to pm2_home\logs from service.js
- added: start with stopparentfirst=true for graceful shutdown
- added: listening to shutdown message for graceful shutdown
- added: kill pm2 on service shutdown

## 1.1.4
- updated: node-windows and some other dependencies

## 1.1.3
- added: a little more logging

## 1.1.2
- fixed: work-around in `bin\pm2-service-uninstall` for uninstall issues when using multiple instances.

## 1.1.1
 - fork from https://github.com/innomizetech/pm2-windows-service
   (which in trun was forked form https://github.com/jon-hall/pm2-windows-service)