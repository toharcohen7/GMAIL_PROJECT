const express = require ('express');
const app = express();

const usersRoutes = require('./routes/users');
const mailsRoutes = require('./routes/mails');
const tokensRoutes = require('./routes/tokens');
const labelsRoutes = require('./routes/labels');
const blacklistRoutes = require('./routes/blacklist');

app.use(express.json())

app.use('/api/users', usersRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/labels', labelsRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.listen(12345);