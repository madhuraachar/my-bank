require('./db/mongoose');
const express = require('express');

const userRouter = require('./routes/user');
const transactionRouter = require('./routes/transaction');
const accountRouter = require('./routes/account');
const cardRouter = require('./routes/card');

const app = express();
const PORT = process.env.PORT

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT,  OPTIONS')
    next();
})

app.use(userRouter);
app.use(transactionRouter);
app.use(accountRouter);
app.use(cardRouter);


app.listen(PORT, ()=>{
    console.log('<------ Server started at port 3000 -------->')
})