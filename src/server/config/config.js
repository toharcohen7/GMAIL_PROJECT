module.exports = {
    APP_PORT: process.argv[2] || 12345,
    BL_PORT: process.argv[3] || 12346,
    BL_HOST: process.argv[4] || '127.0.0.1',
    MONGO_CONNECTION: process.argv[5] || 'mongodb://localhost:27017/email'
};
