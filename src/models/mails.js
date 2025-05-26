let idCounter = 0
const allMails = []

const getLast50Mails = (userId) => {
  return allMails.filter(mail => mail.to === userId || mail.from === userId)
    .sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
};

// createMail creates a new mail and pushes it to the end of the mails array
const createMail = (senderId,receiverId,subject,content, timestamp) => {
    const newMail = {id: ++idCounter,senderId,receiverId,subject, content, timestamp};
    allMails.push(newMail);
    return newMail;
};

// getMailById returns a spesific mail
const getMailById = (id) => allMails.find(mail => mail.id === id);

// deleteMail deletes a spesific mail
const deleteMail = (id) => {
    const index = allMails.findIndex(mail => mail.id === id);
    if (index !== -1) 
        allMails.splice(index, 1);
    
};
// function to find mail index by id
const getMailIndexById = (id) => {
  return allMails.findIndex(mail => mail.id === id);
};

// enable patching only the subject and content fields
const patchMail = (index, updates) => {
    if (updates.subject !== undefined)
        allMails[index].subject = updates.subject; 

    if (updates.content !== undefined)
        allMails[index].content = updates.content;
};

const searchQueryInMails = (query) => {
    return allMails.filter(mail => {
        return(mail.subject.includes(query) || mail.content.includes(query));
    });
}

module.exports = {
    getLast50Mails,
    createMail,
    getMailById,
    deleteMail,
    getMailIndexById,
    patchMail,
    searchQueryInMails
}