const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { uuid } = require('uuidv4');

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

let items = [

]

app.get('/api/items', (req, res) => {
    return res.json(items)
})

app.get('/api/items/:id', (req, res) => {
    const id = req.params.id
    const item = items.find(i => i.id === id)

    if (!item) {
        return res.status(404).end()
    }

    return res.json(item)
})

app.post('/api/items', (req, res) => {

    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const item = {
        id: uuid(),
        reference: body.reference,
        description: body.description,
        vr_unit: body.vr_unit,
        discount: body.discount,
        currency: body.currency
    }

    items = items.concat(item)

    res.json(item)
})

app.patch('/api/items/:id', (req, res) => {
    const id = req.params.id
    const body = req.body

    if (!body) {
        return res.status(404).json({
            error: 'content missing'
        })
    }

    const item = items.find(i => i.id === id)

    if (!item) {
        return res.status(404).json({
            error: 'unable to find matching id'
        })
    }

    const updatedItem = {...item, ...body}
    items = items.map(i => i.id !== id ? i : updatedItem)

    return res.json(updatedItem)
})

app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id
    items = items.filter(i => i.id !== id)
    return res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`)
})