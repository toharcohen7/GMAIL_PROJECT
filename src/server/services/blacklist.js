const net = require('net');
const Config = require('../config/config');

const sendOperationBlacklistServer = (operation, url) => {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({ port: Config.BL_PORT, host: Config.BL_HOST }, () => {
            const message = `${operation} ${url}\n`;
            client.write(message);
        });

        let response = '';

        client.on('data', (data) => {
            response += data.toString();
        });

        client.on('end', () => {
            resolve(response);
        });

        client.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    operationOnBlacklist: sendOperationBlacklistServer
};