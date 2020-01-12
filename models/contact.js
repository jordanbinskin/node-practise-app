const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('attempting to connect to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('MongoDB has connected'))
  .catch((err) => console.log('Dun caught that error', err));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

contactSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema);