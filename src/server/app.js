const Config = require('./config/config');

const express = require ('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(Config.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const usersRoutes = require('./routes/users');
const mailsRoutes = require('./routes/mails');
const tokensRoutes = require('./routes/tokens');
const labelsRoutes = require('./routes/labels');
const blacklistRoutes = require('./routes/blacklist');

app.use('/api/users', usersRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/labels', labelsRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.listen(Config.APP_PORT, '0.0.0.0');