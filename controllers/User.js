const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('userItems')
    return res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            first_name: body.first_name,
            last_name: body.last_name,
            passwordHash
        })

        const savedUser = await user.save()
        res.json(savedUser)

    } catch (err)  {
        next(err)
    }
})

module.exports = usersRouter