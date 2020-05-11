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
- removed workaround for single .sid file in APPDATA folder
- install now checks if PM2_HOME folder exists
- install now checks for PM2_SERVICE_PM2_DIR env var
- install now checks if PM2_SERVICE_PM2_DIR exists
- install now sets PM2_SERVICE_PM2_DIR for service

## 1.1.7
- now using our own fork of node-windows
- install/uninstall now use .sid file in PM2_HOME folder
- install sets PM2_HOME env var for service
- install checks if PM2_HOME env var is set
- service name arg is now optional for uninstall (uses .sid file when not specified)

## 1.1.6
- restored & updated orignal README
- improved command-line args handling
- made service name arg required
- added description & logpath args
- updated dependencies
- added some more logging and error handling

## 1.1.5
- now configuring log rotation and logPath (pm2_home\logs)
- added logging to pm2_home\logs from service.js
- starting with stopparentfirst=true to allow for graceful shutdown
- listening to shutdown message for graceful shutdown
- kill pm2 on service shutdown

## 1.1.4
- updated node-windows (and some other dependencies)

## 1.1.3
- added: a little more logging

## 1.1.2
- fixed: work-around in `bin\pm2-service-uninstall` for uninstall issues when using multiple instances.

## 1.1.1
 - fork from https://github.com/innomizetech/pm2-windows-service
 - (which in trun was forked form https://github.com/jon-hall/pm2-windows-service)