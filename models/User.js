const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { uuid } = require("uuidv4")

const userSchema = new mongoose.Schema({
    id: { type:String, default:uuid },
    username: {
        type: String,
        unique: true
    },
    first_name: String,
    last_name: String,
    passwordHash: String,
    items: [
        {
            type: String,
            ref: 'Item'
        }
    ]
})

userSchema.virtual('userItems', {
    ref: 'Item',
    localField: 'id',
    foreignField: 'user'
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User