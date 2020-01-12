require('dotenv').config();
const express = require('express');
const app = express();
const Contact = require('./models/contact')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const generic = express.Router();
const api = express.Router();

app.use(express.static('build'));
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use(morgan(':body'))


generic.get('/info', (req, res) => res
  .send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>The time of this request is ${new Date}<p>
  `)
)

api.get('/', (req, res) => res.send('Add /phonebook to URL to view the collection'));

api.get('/phonebook', (req, res) => {
  Contact.find({})
    .then(contacts => res.json(contacts.map(contact => contact.toJSON())))
});

api.get('/phonebook/:id', (req, res) => {
  const id = req.params.id;
  const contact = Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact.toJSON())
      } else {
        res.status(400).send('this record does not exist in the collection')
      }
    })

})

api.delete('/phonebook/:id', (req, res) => {
  const id = req.params.id;
  Contact.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

api.post('/phonebook', (req, res) => {
  let content = req.body;
  if (!content.name || !content.number) {
    return res.status(400).send('You have provided an incomplete entry, please ensure you provide both name and number in the request');
  }

  const contact = new Contact({
    name: content.name,
    number: content.number,
    date: new Date
  })

  contact.save()
    .then((savedEntry) => {
      res.json(savedEntry.toJSON())
  })
    .catch((err) => console.log('Error', err))
  
})

api.put('/api/phonebook/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    content: body.content,
    important: body.important,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({error: 'malformatted id'})
  }
  
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint

api.use(unknownEndpoint)
app.use(errorHandler) 
app.use('/', generic)
app.use('/api', api)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on port:${PORT}`))