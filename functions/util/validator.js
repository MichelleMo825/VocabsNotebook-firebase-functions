isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    }
    return false;
}


isEmpty = (string) => {
    if (string.trim() === '') {
        return true;
    }
    return false;
}

exports.validateSignupData = (data) => {
    let errors = {}
    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }

    if (isEmpty(data.password)) errors.password = 'Must not be empty'
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match'
    if (isEmpty(data.username)) errors.username = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length > 0 ? false : true
    }
}

exports.validateLoginData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    return {
        errors,
        valid: Object.keys(errors).length > 0 ? false : true
    }
}