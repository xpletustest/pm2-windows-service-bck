## 1.1 6
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