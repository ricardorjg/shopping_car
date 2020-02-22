const User = require('../models/User')

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    usersInDb
}