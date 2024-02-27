const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
})

authorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author