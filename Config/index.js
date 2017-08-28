const path = require('path');

const config = key => {
    if (typeof key !== 'string') {
        throw new TypeError('The config method parameter type must be a string');
    }
    if (key.length <= 0) {
        throw new Error('The config method parameter length can not be zero');
    }
    let keys = key.split('.');

    let config;
    let configFileName = path.resolve(__dirname, `${keys.shift()}.json`);
    try {
        config = require(configFileName);
    } catch (error) {
        throw error;
        throw new TypeError(`Load the config file error, please confirm whether the file exists or format is json file. loading config file is ${configFileName}`);
    }

    if (typeof config !== 'object') {
        throw new TypeError(`The config file format must be an object. config file is ${configFileName}`);
    }

    let result = config;
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (result.hasOwnProperty(key)) {
            result = result[key];
        } else {
            throw new TypeError(`Do not have '${key}' item`);
        }
    }
    return result;
};

module.exports = config;
