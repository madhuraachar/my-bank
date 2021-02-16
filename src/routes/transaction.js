const express = require('express')
const Transaction = require('./../modals/transaction')
const auth = require('./../middleware/auth')
const Account = require('./../modals/account')
const mongoose = require('mongoose');
const router = new express.Router();


//get all transaction
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        if (!transactions) {
            return res.status(404).send()
        }
        res.send(transactions)
    } catch (e) {
        res.status(500).send(e)
    }
});

//get single transaction
router.get('/transactions/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const transaction = await Transaction.findById(_id);
        if (!transaction) {
            return res.status(404).send()
        }
        res.send(transaction)
    } catch (e) {
        res.status(500).send(e)
    }
})

//update transaction 
router.patch('/transactions/:id', async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'amount', 'transactionType', 'date'];
    const isUpdateAllowed = updates.every(el => allowedUpdates.includes(el));

    if (!isUpdateAllowed) {
        return res.status(400).send({ error: 'update not allowed' })
    }
    try {
        const transaction = await Transaction.findByIdAndUpdate(_id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).send();
        }
        res.send(transaction);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.post('/transaction', auth, async(req, res) => {
    try{
        //get user account amount
        const accountNo = req.body.accountNo;
        if(! accountNo.length == 24) {
            return res.status(401).send({error: 'Invalid Account Number'});
        }
        const receiverAccountList = await Account.find({ owner: accountNo})

        if (! receiverAccountList.length > 0) {
            return res.status(401).send({ error: 'Account Not Exists' });
        }

        const accountList = await Account.find({owner: req.user._id});
        let account = accountList[0]
        const amount = req.body.amount;
        const _id = mongoose.Types.ObjectId();
        let transaction = new Transaction({ ...req.body, owner: req.user._id, _id });
        if (! (amount <= account.amount)) {
            transaction.status = false;
            await transaction.save();
            return res.status(201).send({ error: "Insufficient balance", transaction})
        }else {
            //update transaction
            transaction.status = true;
            account.amount = account.amount - amount;

            const receiverAccount = receiverAccountList[0];
            receiverAccount.amount = receiverAccount.amount + amount;

            await receiverAccount.save();
            await account.save();
            await transaction.save();
            return res.status(201).send({transaction})
        }
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
})

module.exports = router;