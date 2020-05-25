'use strict';

const path = require('path'),
    co = require('co'),
    event = require('co-event'),
    promisify = require('util').promisify || require('promisify-node'),
    fsx = require('fs-extra'),
    fs = require('fs'),
    exec = promisify(require('child_process').exec),
    Service = require('node-windows').Service,
    inquirer = require('inquirer'),
    common = require('./common'),
    { parseOnFailureString } = require("../src/validation"),
    setup = require('./setup');

module.exports = co.wrap(function*(config) {


    const {name, id, description, logpath, unattended, onfailure, resetfailure, workingdir, account, password} = config;
    console.log(`Install called with config`, config);

    //when id is not specified, use name instead
    const service_id = id ? id : name;
    common.check_platform();

    yield common.admin_warning();

    const PM2_HOME = process.env.PM2_HOME;
    if (!PM2_HOME) {
        throw new Error('PM2_HOME environment variable is not set. This is required for installation.');
    } else {
        if (!fs.existsSync(PM2_HOME)) {
            throw new Error(`The folder specified by PM2_HOME (${PM2_HOME}) does not exist. \nPlease make sure this folder exists before service installation.`);
        }
    }
    const PM2_SERVICE_PM2_DIR = process.env.PM2_SERVICE_PM2_DIR;
    if (!PM2_SERVICE_PM2_DIR) {
        throw new Error('PM2_SERVICE_PM2_DIR environment variable is not set. This is required for installation.');
    } else {
        if (!fs.existsSync(PM2_SERVICE_PM2_DIR)) {
            throw new Error(`The file specified by PM2_SERVICE_PM2_DIR (${PM2_SERVICE_PM2_DIR}) does not exist. \nPlease make sure pm2 is properly installed before service installation.`);
        }
    }

    let setup_response = yield unattended ? Promise.resolve({
        perform_setup: false
    }) : inquirer.prompt([{
        type: 'confirm',
        name: 'perform_setup',
        message: 'Perform environment setup (recommended)?',
        default: true
    }]);

    if (setup_response.perform_setup) {
        yield setup();
    }

    console.log(`Installing PM2 service with name="${name}"` + (service_id ? ` and id="${service_id}"` : ``));

    logpath = logpath ? logpath : path.join(PM2_HOME, "logs");

    let service = new Service({
        id: service_id,
        name: name || 'PM2',
        description,
        script: path.join(__dirname, 'service.js'),
        stopparentfirst: true,
        logging: {
            mode: 'roll-by-time',
            pattern: 'yyyyMMdd'
        },
        logpath: logpath,
        env: [{
                name: "PM2_HOME",
                value: PM2_HOME // service needs PM2_HOME environment var
            },{
                name: "PM2_SERVICE_PM2_DIR",
                value: PM2_SERVICE_PM2_DIR // service needs PM2_SERVICE_PM2_DIR environment var
            },
            {
                name: "SERVICEJS_LOGPATH",
                value: logpath
            }],
        onFailure: onfailure ? parseOnFailureString(onfailure) : null,
        resetFailure: resetfailure ? resetfailure : null,
        workingDirectory: workingdir,
        logOnAs: account ? {
            account,
            password: password ? password : null
        } : null
    });

    // Let this throw if we can't remove previous daemon
    try {
        yield common.remove_previous_daemon(service, PM2_HOME);
    } catch(ex) {
        throw new Error('Previous daemon still in use, please stop or uninstall existing service before reinstalling.');
    }

    // NOTE: We don't do (service_id = service_id || 'PM2') above so we don't end up writing out a sid_file for default service_id
    const sid_file = path.resolve(PM2_HOME, '.sid');
    yield* save_sid_file(service_id, sid_file);

    yield* kill_existing_pm2_daemon();

    yield* install_and_start_service(service, PM2_HOME);
});

function* save_sid_file(service_id, sid_file) {
    if (service_id) {
        // Save id to %PM2_HOME%/.sid, if supplied
        console.log(`Service id: ${service_id} stored in: ${sid_file}.`);
        yield fsx.outputFile(sid_file, service_id);
    }
}

function* kill_existing_pm2_daemon() {
    try {
        yield exec('pm2 kill');
    } catch (ex) {
        // PM2 daemon wasn't running, no big deal
    }
}

function* install_and_start_service(service, folder) {
    // Make sure we kick off the install events on next tick BEFORE we yield
    setImmediate(_ => service.install(folder));

    // Now yield on install/alreadyinstalled/start events
    let e;
    while (e = yield event(service)) {
        switch (e.type) {
            case 'alreadyinstalled':
            case 'install':
                console.log("Starting service...");
                service.start();
                break;
            case 'start':
                console.log("Service started.");
                return;
            case 'error':
                console.error('node-windows reports error ', e.args);
                return;
            case 'invalidinstallation':
                console.error('node-windows reports invalid installation ', e.args);
                return;
        }
    }
}
