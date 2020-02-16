require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const Item = require("./models/Item")

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.get('/api/items', (req, res) => {
    Item.find({}).then(items => res.json(items))
})

app.get('/api/items/:id', (req, res, next) => {
    Item
        .findOne({ id: req.params.id })
        .then(item => {
            if (!item) {
                throw new Error("Item not found")
            }

            res.json(item)
        })
        .catch(error => next(error))
})

app.post('/api/items', (req, res, next) => {

    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const item = new Item({
        reference: body.reference,
        description: body.description,
        vr_unit: body.vr_unit,
        discount: body.discount,
        currency: body.currency
    })

    item
        .save()
        .then(savedItem => res.json(savedItem))
        .catch(error => next(error))
})

app.patch('/api/items/:id', (req, res) => {

    const id = req.params.id
    const body = req.body

    if (!body) {
        return res.status(404).json({
            error: 'content missing'
        })
    }

    Item
        .findOneAndUpdate(
            { id: req.params.id }, 
            { $set: body },
            { new: true }
        )
        .then(updatedItem => res.json(updatedItem))
})

app.delete('/api/items/:id', (req, res) => {
    Item
        .deleteOne({ id: req.params.id })
        .then(() => res.status(204).end())
})

const unknownEndPoint = (req, res) => {
    res.status(404).json({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {

    if (error.name === "Error") {
        return res.status(404).send({
            error: error.message
        })
    }

    if (error.name === "ValidationError") {
        return res.status(404).send({
            error: error.message
        })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`)
})