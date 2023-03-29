const express = require('express');

const app = express();
const mongoose = require('mongoose');

const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost/attendance',{useNewUrlparser: true});

const db = mongoose.connection
db.on('error', () => console.error(error))
db.once('open',()=> console.log('Co0nnected to database ') )

app.use(express.json())

const employeRouter = require('./routes/employes')
app.use('/employes', employeRouter)


app.listen(3000,() => console.log('servers started'))