
import { getCurrentLocale } from 'grommet/utils/Locale';

const locale = getCurrentLocale();
let messages;
try {
    messages = require(`../messages/${locale}`);
} catch (e) {
    messages = require('../messages/en-US');
}

export function isEmail (value) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}
export function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
export function isInt(value) {
    return !isNaN(value) && parseInt(Number(value), 10) === value && !isNaN(parseInt(value, 10));
}
export function isPhone (value) {
    const re = /^[+]?[00]?[(]?[0-9]{3}[)]?[-\\.]?[0-9]{3}[-\\.]?[0-9]{4,8}$/im;
    return re.test(String(value));
}
export function isWebsite (value) {
    const re = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/im;
    return re.test(String(value).toLowerCase());
}
export function getMessage (key) {
    return messages[key] || key;
}
export function passwordScore(pass) {
    let score = 0;
    if (!pass) {
        return score;
    }
    // award every unique letter until 5 repetitions
    const letters = {};
    for (let i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }
    // bonus points for mixing it up
    const variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    };
    let variationCount = 0;
    const keys = Object.keys(variations);
    for (let i = 0; i < keys.length; i++) {
        variationCount += (keys[i] === true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score, 10);
}

export default { isEmail, isNumber, isInt, isPhone, isWebsite, getMessage, passwordScore };
