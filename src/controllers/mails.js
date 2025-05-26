const Mails = require('../models/mails')
const Blacklist = require('../models/blacklist')

exports.getLast50Mails = (req, res) => {
  const userId = parseInt(req.headers['user-id']); // parsing the user name from the http header
  if (!userId) {
    return res.status(401).json({ error: 'Missing user-id header' });
  }

  const mails = Mails.getLast50ForUser(userId);
  res.json(mails);
}

exports.createMail = (req, res) => {
    const senderId = parseInt(req.headers['user-id']); // parsing the user name from the http header
    if (!senderId) {
      return res.status(401).json({ error: 'Missing user-id header' });
    }
    const requiredFields = ['receiverId', 'subject', 'content', 'timestamp'];
    for (const field of requiredFields) { // checking if all required fields exists
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }
    const {receiverId, subject, content, timestamp } = req.body;
    const blacklist = Blacklist.getBlacklist();
    const hasBlacklistLink = blacklist.some(link => content.includes(link));
    if(hasBlacklistLink){
        return res.status(400).json({ error: 'The mail contains blacklisted link' });
    }
    
    const newMail = Mails.createMail(senderId, receiverId, subject, content, timestamp);
    res.status(201).location(`/api/mails/${newMail.id}`).end();
}

exports.getMailById = (req, res) => {
    const mail = Mails.getMailById(parseInt(req.params.id));
    if(!mail)
        return res.status(404).json({error: 'Mail not found'});
    res.json(mail);
}

exports.deleteMail = (req,res) => {
    const id = parseInt(req.params.id);
    const mail = Mails.getMailById(id);
    if(!mail)
        return res.status(404).json({error: 'Mail not found'});
    Mails.deleteMail(id);
    return res.status(204).end();
}

exports.updateMail = (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;

    if (!updates.subject && !updates.content) 
        return res.status(400).json({ error: 'At least one field (subject or content) must be provided' })

    const index = Mails.getMailIndexById(id);

    if (index === -1) 
        return res.status(404).json({ error: 'Mail not found' });

    Mails.patchMail(index, updates);
    return res.status(204).end();
}
exports.searchQueryInMails = (req, res) => {
    const query = req.params.query;
    if(!query){
        return res.status(400).json({ error: 'query is required' });
    }
    
    const results = Mails.searchQueryInMails(query); 
    res.json(results);
}