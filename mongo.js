const mongoose = require("mongoose")
const { uuid } = require("uuidv4")

if (process.argv.length < 3) {
    console.log("Please give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-u4mty.mongodb.net/shopping_car?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const itemSchema = new mongoose.Schema({
    id: { type:  String, default: uuid },
    reference: String,
    description: String,
    currency: String,
    vr_unit: Number,
    discount: Number
})

const Item = mongoose.model('Item', itemSchema)

const item = new Item({
    reference: 'Resident evil 2 Remake',
    description: 'Video game',
    currency: 'COP',
    vr_unit: 100000,
    discount: 0
})

item.save().then(response => {
    console.log(`item saved. response ${response}`)
    mongoose.connection.close()
})
