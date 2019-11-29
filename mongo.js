const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('please provided a password');
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://jordanbinskin:${password}@cluster0-ygoum.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const contactsSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Contact = mongoose.model('Contact', contactsSchema);

const createContact = (name, number) => new Contact({ "name": name, "number": number });

switch (process.argv.length) {
  case 3:
    Contact.find({}).then(results => {
      results.forEach(result => {
        console.log(result)
      })
      mongoose.connection.close();
    })
    break;
  case 4:
    contact = createContact(process.argv[3], undefined)
    contact.save().then((res) => {
      console.log(contact, 'set')
      mongoose.disconnect();
    })
    break;
  case 5:
    contact = createContact(process.argv[3], process.argv[4])
    contact.save().then((res) => {
      console.log(contact, 'set')
      mongoose.disconnect();
    })
    break;
}