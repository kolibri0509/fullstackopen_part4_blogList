const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        minlength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        require: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
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