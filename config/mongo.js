const mongoose = require('mongoose');
module.exports = async () => {
    await mongoose.connect('mongodb+srv://thuancac:123456Aa@cluster0.htimo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    return mongoose
}