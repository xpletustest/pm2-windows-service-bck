// throws on Error
function checkValidFailureAction(action) {
    const allowedActions = ['reboot','restart','none'];
    if (!(action && (typeof action === "string") && allowedActions.includes(action))) {
        throw new Error(`<action> should be one of: ${allowedActions}, got "${action}"`);
    }
}

// throws on Error
function checkValidFailureDelay(delay, fieldname) {
    const context = `incorrect sytax for ${fieldname}.`;
    const allowedSuffixes = ['sec','secs','min','mins','hour','hours','day','days'];
    if (!delay || (typeof delay !== "string"))
        throw new Error(`${context} expected: string value, got "${delay}"`);
    valueSuffix = delay.split(' ');
    if (valueSuffix.length != 2)
        throw new Error(`${context} expected: <number> followed by <suffix>, separated by a single space, got "${delay}"`);
    const [value, suffix] = valueSuffix;
    const parsed = parseInt(value, 10);
    if (!value || isNaN(parsed) || (parsed <= 0) || (parsed != value))
        throw new Error(`${context} <number> should be a positive integer value, got "${value}"`);
    if (!allowedSuffixes.includes(suffix))
        throw new Error(`${context} <suffix> should be one of: ${allowedSuffixes}, got "${suffix}"`);
}

// throws on Error
function parseOnFailureString(onFailure) {
    if (!onFailure || (typeof onFailure !== "string"))
        throw new Error(`expected: a string value, got "${onFailure}"`);
    const onFailurePairs = onFailure.split(',');
    if (onFailurePairs.length == 0)
        throw new Error(`expected: <action>;<delay> pairs separated by a comma, got "${onFailure}"`);
    const result = [];
    for (let onFailurePair of onFailurePairs) {
        const actionDelay = onFailurePair.split(';');
        if (actionDelay.length !== 2)
            throw new Error(`'expected: <action> and <delay> values separated by a semicolon, got "${onFailure}"`);
        const [action, delay] = actionDelay;
        result.push({action, delay});
    }
    return result;
}

// throws on Error
function checkValidResetFailure(resetFailure) {
    try {
        checkValidFailureDelay(resetFailure, "<duration>");
    }
    catch (err) {
        throw new Error(`Invalid syntax for resetFailure\n    ${err}`);
    }
}

// throws on Error
function checkValidOnFailure(onFailure) {
    try {
        const actionsWithDelay = parseOnFailureString(onFailure);
        for (let { action, delay } of actionsWithDelay) {
            checkValidFailureAction(action);
            checkValidFailureDelay(delay, "<delay>")
        }
    }
    catch (err) {
        throw new Error(`Invalid syntax for onfailure\n    ${err}`);
    }
}

module.exports = {
    checkValidOnFailure,
    checkValidResetFailure,
    parseOnFailureString
}
