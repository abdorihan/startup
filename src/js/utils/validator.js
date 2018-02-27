import { isEmail, isNumber, isInt, isPhone, isWebsite, getMessage, passwordScore } from './utils';
import _ from 'lodash';

const Validator = {};

Validator.required = 1;
Validator.email = 2;
Validator.number = 3;
Validator.int = 4;
Validator.website = 5;
Validator.phone = 6;
Validator.binary = 7;
Validator.strongPass = 8;

Validator.error = (value, options) => {
    if (!options || options.length === 0) {
        return false;
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        if (typeof option === typeof 1) {
            option = { type: option };
        }
        switch (option.type) {
        case Validator.required:
            if (String(value).trim() === '') {
                return option.msg || getMessage('required_field');
            }
            break;
        case Validator.email:
            if (!isEmail(value)) {
                return option.msg || getMessage('not_valid_email');
            }
            break;
        case Validator.number:
            if (!isNumber(value)) {
                return option.msg || getMessage('not_number');
            }
            break;
        case Validator.int:
            if (!isInt(value)) {
                return option.msg || getMessage('not_int');
            }
            break;
        case Validator.phone:
            if (!isPhone(value)) {
                return option.msg || getMessage('not_valid_phone');
            }
            break;
        case Validator.website:
            if (!isWebsite(value)) {
                return option.msg || getMessage('not_valid_website');
            }
            break;
        case Validator.binary:
            if (!isNumber(value) || (String(value) !== '0' && String(value) !== '1')) {
                return option.msg || getMessage('not_valid_binary');
            }
            break;
        case Validator.strongPass:
            if (passwordScore(value) < 60) {
                return option.msg || getMessage('weak_pass');
            }
            break;
        default:
        }
    }
    return false;
};

Validator.validate = (element, validationHeader) => {
    for (let i = 0; i < validationHeader.length; i++) {
        const v = validationHeader[i];
        const err = Validator.error(_.get(element, v.accessor), v.validators);
        if (err) {
            return err;
        }
    }
    return true;
};

Validator.getMessage = getMessage;

export default Validator;
