const unknownEndPoint = (req, res) => {
    res.status(404).json({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, req, res, next) => {

    const { name, message } = error

    switch (name) {
        case 'Error':
            return res.status(404).send({
                message
            })
        case 'ValidationError':
            return res.status(400).send({
                message
            })
        default:
            next(error)
    }
}

module.exports = {
    unknownEndPoint,
    errorHandler
}

