const mongoose = require('mongoose');
require('dotenv').config()
const app = require('./app');

const mongoUrl = process.env.MONGODB_URI
if (!mongoUrl) {
    console.error('MONGODB_URI is not defined in .env')
    process.exit(1)
}

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB Atlas')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})