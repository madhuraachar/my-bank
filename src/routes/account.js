const express = require('express');
const Account = require('./../modals/account');
const auth = require('./../middleware/auth');
const mongoose = require('mongoose');
const router = new express.Router();

//create Account 
router.post('/accounts', auth,  async (req, res) => {
    try{
        const _id = mongoose.Types.ObjectId();
        const account = new Account({ ...req.body, owner: req.user._id, _id})
        await account.save();
        res.status(201).send({account})
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//get account
router.get('/accounts', async (req, res) => {
    try{
        const accounts = await Account.find();
        if(! accounts) {
            return res.status(404).send()
        }
        res.send(accounts)
    }catch(e) {
        res.status(500).send(e)
    }
})

//update account
router.patch('/accounts/:id',auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['amount', 'date']
    const isUpdateAllowed = updates.every(el => allowedUpdates.includes(el));
    if(! isUpdateAllowed) {
        return res.status(401).send({error: 'updated not allowed'})
    }
    try{
        let account = await Account.find({_id});
        if(req.body.amount < 1) {
            return res.status(404).send()
        }
        if (!account) {
            return res.status(404).send()
        }
        account[0].amount = account[0].amount + req.body.amount;
        await account[0].save()
        console.log(account)
        res.send({ account: account[0]})
    }catch(e) {
        console.log(e)
        res.status(404).send(e)
    }
})

module.exports = router;
