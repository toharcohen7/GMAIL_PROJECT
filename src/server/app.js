const express = require ('express');
const Config = require('./models/config');
const cors = require('cors');
const app = express();

const usersRoutes = require('./routes/users');
const mailsRoutes = require('./routes/mails');
const tokensRoutes = require('./routes/tokens');
const labelsRoutes = require('./routes/labels');
const blacklistRoutes = require('./routes/blacklist');

app.use(express.json({ limit: '20mb' }));
app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/labels', labelsRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.listen(Config.appPort);