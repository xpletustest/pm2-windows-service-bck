'use strict';

const path = require('path'),
    co = require('co'),
    event = require('co-event'),
    promisify = require('util').promisify || require('promisify-node'),
    fsx = require('fs-extra'),
    exec = promisify(require('child_process').exec),
    node_win = require('node-windows'),
    elevate = promisify(node_win.elevate),
    Service = node_win.Service,
    del = require('del'),
    common = require('./common');

const MAX_KILL_CHECKS = 12;
const KILL_CHECK_DELAY = 5000;

module.exports = co.wrap(function*(id) {
    common.check_platform();

    yield common.admin_warning();

    const PM2_HOME = process.env.PM2_HOME;
    if (!PM2_HOME) {
        throw new Error('PM2_HOME environment variable is not set. This is required for deinstallation.');
    }

    const sid_file = path.resolve(PM2_HOME, '.sid');
    let id_from_sid_file;
    try {
        id_from_sid_file = yield fsx.readFile(sid_file, 'utf8');
        id = id_from_sid_file;
    } catch(ex) {
        // No sid_file, just keep our current id
    }

    // If we don't have a id by now, then default to 'PM2'
    id = id || 'PM2';

    console.log(`Uninstalling PM2 service with id = ${id}`);

    let service = new Service({
            id,
            name: id, //node-windows wants this (but it is not strictly needed when uninstalling)
            script: path.join(__dirname, 'service.js')
        });
    const service_id = service.id;

    yield* verify_service_exists(service_id);

    yield* stop_and_uninstall_service(service, service_id);

    yield* remove_sid_file(id_from_sid_file, sid_file);

    yield* try_confirm_kill(service_id);

    // Try to clean up the daemon files
    yield common.remove_previous_daemon(service);
});

function* verify_service_exists(service_id) {
    yield exec('sc query ' + service_id);
}

function* stop_and_uninstall_service(service, service_id) {
    // Make sure we kick off the stop event on next tick BEFORE we yield
    console.log("Stopping service...");
    setImmediate(_ => service.stop());

    // Now yield on install/alreadyinstalled/start events
    let e;
    while (e = yield event(service)) {
        switch (e.type) {
            case 'alreadystopped':
            case 'stop':
                console.log("Service stopped.");
                yield elevate('sc delete ' + service_id);
                return;
        }
    }
}

// Checks if the service was fully uninstalled, if not invokes 'sc stop' to give it a little nudge
function* try_confirm_kill(service_id) {
    let removed = false;
    try {
        yield* verify_service_exists(service_id);
    } catch(ex) {
        removed = true;
    }

    if(!removed) {
        // Service hasn't been removed, try stopping it to see if that gets rid of it
        yield elevate('sc stop ' + service_id);

        removed = yield* poll_for_service_removal(service_id);

        if(!removed) {
            // Throw if it still isn't fully gone, it's probably marked for deletion, but can't be sure
            // TODO: Determine if it's stopped and/or marked for deletion...
            throw new Error('WARNING: Unable to fully remove service (' + service_id + '), please confirm it is ' +
                'scheduled for deletion.');
        }
    }
}

function* poll_for_service_removal(service_id) {
    let removed = false;

    // Windows sometimes takes a while to let go of services, so poll for a minute...
    // TODO: Surely there's a better approach...?
    let tries = 0;
    while(!removed && (tries++ < MAX_KILL_CHECKS)) {
        // Re-check to see if it's done now...
        try {
            yield* verify_service_exists(service_id);
        } catch(ex) {
            removed = true;
        }

        yield new Promise(resolve => setTimeout(resolve, KILL_CHECK_DELAY));
    }

    return removed;
}

function* remove_sid_file(id_from_sid_file, sid_file) {
    if (id_from_sid_file) {
        yield del(sid_file, { force: true });
    }
}
