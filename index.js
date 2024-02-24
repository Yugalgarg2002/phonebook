const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))

app.use(cors())
app.use(express.json())

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (!person) {
        return (
            response.status(404).end()
        )
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const getId = () => {
    return Math.floor(Math.random() * 23456754326789)
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return (
            response.status(400).json({
                error: "Name or Number Missing"
            })
        )
    }

    const pName = persons.map(p => p.name)

    if (pName.includes(body.name)) {
        return (
            response.status(400).json({
                error: "Name must be unique"
            })
        )
    }

    const person = {
        id: getId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)

})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p> ${Date()} </p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Started the server on ${PORT}`)
})
