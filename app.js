const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const authRouter = require('./routes/auth.routes')
const usersRouter = require('./routes/users.routes')

const User = require('./models/User')

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

if (process.env.NODE_ENV  === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const dbUri = 'mongodb+srv://Artem:1234qwe@cluster0.y0vtj.mongodb.net/users?retryWrites=true&w=majority';
mongoose.connect(dbUri,
    {   useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', () => console.error.bind(console, 'MongoDb connection error'))



app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))


