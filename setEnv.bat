@ECHO OFF
MD pm2_home

CALL :find_dp0
SET PM2_HOME=%dp0%pm2_home
SET PM2_SERVICE_PM2_DIR=%dp0%node_modules\pm2\index.js

ECHO PM2_HOME=%PM2_HOME%
ECHO PM2_SERVICE_PM2_DIR=%PM2_SERVICE_PM2_DIR%
EXIT /b

:find_dp0
SET dp0=%~dp0
EXIT /b
