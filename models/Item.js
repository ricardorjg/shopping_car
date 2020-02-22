const mongoose = require("mongoose")
const { uuid } = require("uuidv4")

const url = process.env.MONGODB_URI

mongoose
    .connect(url, { useNewUrlParser: true })
    .then(result => console.log('Connected to db'))
    .catch(error => console.log('Error connecting to db: ', error.message))

const itemSchema = new mongoose.Schema({
    id: { type:String, default:uuid },
    reference: { type: String, required: true },
    description: String,
    currency: { type: String, required: true },
    vr_unit: Number,
    discount: Number,
    user: {
        type: String,
        ref: 'User'
    },
}, { toJSON: { virtuals: true } })

itemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Item', itemSchema)