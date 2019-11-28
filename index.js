const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const generic = express.Router();
const api = express.Router();

let phonebook = [
  {
    name: "Gian Gian",
    number: "0240342",
    id: 1
  },
  {
    name: "Scott Man",
    number: "02343123",
    id: 2
  },
  {
    name: "Garrosh",
    number: "026452",
    id: 3
  },
  {
    name: "Pizza man",
    number: "0243434",
    id: 4
  }
]

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use(morgan(':body'))


generic.get('/', (req, res) => res.send('<h1>Welcome to the phonebook API</h1>'))

generic.get('/info', (req, res) => res
  .send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>The time of this request is ${new Date}<p>
  `)
)

api.get('/', (req, res) => res.send('Add /phonebook to URL to view the collection'));

api.get('/phonebook', (req, res) => res.json(phonebook));

api.get('/phonebook/:id', (req, res) => {
  const id = req.params.id;
  const contact = phonebook.find(contact => contact.id == id);
  if (contact) {
    res.json(contact)
  } else {
    res.status(400).send('this record does not exist in the collection')
  }
})

api.delete('/phonebook/:id', (req, res) => {
  const id = req.params.id;
  const person = phonebook.find(contact => contact.id == id)
  if (person) {
    phonebook = phonebook.filter(contact => contact.id != id)
    res.status(200).json(phonebook);
  }
  else {
    res.status(404).json({
      error: "resource does not exist"
    })
  }
})

api.post('/phonebook', (req, res) => {
  let content = req.body;
  if (!content.name || !content.number) {
    return res.status(400).send('You have provided an incomplete entry, please ensure you provide both name and number in the request');
  }

  if (phonebook.find(contact => contact.name == content.name)) {
    return res.status(400).send('This contact already exists')
  }

  const contact = {
    name: content.name,
    number: content.number,
    date: new Date,
    id: Math.floor(Math.random() * 1000)
  }

  phonebook = [...phonebook, contact];

  res.status(200).json(contact)
})

app.use('/', generic)
app.use('/api', api)
const PORT = 3001;
app.listen(PORT, () => console.log(`listening on port:${PORT}`))