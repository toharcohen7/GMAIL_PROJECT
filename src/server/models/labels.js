const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const LabelSchema = new Schema({
  userId: { type: Mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  iconClass: { type: String, required: true },
  countBadge: { type: Number, default: 0 }
});

const Label = Mongoose.model('Label', LabelSchema);
module.exports = Label;