const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const MailSchema = new Schema({
  userId: { type: Mongoose.Schema.Types.ObjectId, required: true },
  mailStatus: { type: String, required: true, default: 'draft' },
  senderId: { type: String, required: true },
  receiversNames: { type: [String], default: [] },
  subject: { type: String, default: '' }, // Empty by default
  content: { type: String, default: '' }, // Empty by default
  labelName: { type: String, default: 'Draft' }, // Default label for drafts
  timestamp: { type: Date, default: Date.now },
  formattedTime: { type: String, default: '' }, // To be set when the mail is created
  starred: { type: Boolean, default: false },
  onRead: { type: Boolean, default: false } // Sender's draft is considered read
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Mail = Mongoose.model('Mail', MailSchema);
module.exports = Mail;
