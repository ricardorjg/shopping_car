require('dotenv').config()

const jwt = require('jsonwebtoken')
const itemsRouter = require('express').Router()
const Item = require('../models/Item')
const User = require('../models/User')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }

    return null
}

itemsRouter.get('/', async (req, res) => {
    const items = await Item.find({})
    res.json(items)
})

itemsRouter.get('/:id', async (req, res, next) => {
    try {
        const item = await Item.findOne({ id: req.params.id })
        if (!item)  {
            throw Error('the id couldnt be found on the server')
        }
        res.json(item)
    } catch (err) {
        next(err)
    }
})

itemsRouter.post('/', async (req, res, next) => {

    const body = req.body

    if (!body) {
        return res.status(400).send({
            message: 'content missing'
        })
    }

    const token = getTokenFrom(req)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({
                error: 'token missing or invalid'
            })
        }

        const user = await User.findOne({ id: body.userId })

        const item = new Item({
            reference: body.reference,
            description: body.description,
            vr_unit: body.vr_unit,
            discount: body.discount,
            currency: body.currency,
            user: user.id
        })

        const savedItem = await item.save()
        user.items = user.items.concat(savedItem.id)
        await user.save()
        res.json(savedItem)
    } catch (err) {
        next(err)
    }
})

itemsRouter.patch('/:id', async (req, res) => {

    const id = req.params.id
    const body = req.body

    if (!body) {
        return res.status(404).json({
            error: 'content missing'
        })
    }

    const updatedItem = await Item
                                .findOneAndUpdate(
                                    { id: req.params.id }, 
                                    { $set: body },
                                    { new: true }
                                )
    res.json(updatedItem)
})

itemsRouter.delete('/:id', async (req, res) => {
    await Item.deleteOne({ id: req.params.id })
    res.status(204).end()
})

module.exports = itemsRouter