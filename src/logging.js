function log(msg) {
    console.log(new Date().toLocaleString() +' '+ msg);
}
function error(err) {
    console.error(new Date().toLocaleString() +' '+ err);
}
function warn(warning) {
    console.warn(warning);
}

module.exports = {
    log,
    error,
    warn
}
