'use strict';
const fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    promisify = require('util').promisify || require('promisify-node'),
    del = require('del'),
    is_admin = require('is-admin'),
    { warn } = require("./logging");

exports.check_platform = function() {
    if(!/^win/.test(process.platform)) {
        throw new Error('pm2-windows-service has to be run on Windows...');
    }
};

exports.admin_warning = function() {
    return promisify(is_admin)().
        then(isAdmin => {
            if(!isAdmin) {
                warn('*** WARNING: Run this as administrator ***');
            }
        }, _ => {
            warn('*** WARNING: Run this as administrator ***');
            // Don't re-throw, we just assume they aren't admin if it errored
        });
};

exports.remove_previous_daemon = function(service, folder) {
    return del(path.resolve(folder, 'daemon', service.id + '.*'), { force: true });
}

exports.guess_pm2_global_dir = function() {
    let dir;

    try {
        // Use 'which' to find pm2 'executable'
        dir = fs.realpathSync(shell.which('pm2').stdout);

        // Then resolve to the pm2 directory from there
        dir = path.join(dir, '..', 'node_modules', 'pm2', 'index.js' );
    } catch(ex) {
        // Ignore error, just return undefined
    }

    return dir;
};
