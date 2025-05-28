const net = require('net');
const Config = require('../config');

const sendOperationBlacklistServer = (operation, url) => {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({ port: Config.blPort, host: Config.blHost }, () => {
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