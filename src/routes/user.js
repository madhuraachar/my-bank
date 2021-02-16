
const express = require('express');
const User = require('./../modals/user');
const auth = require('./../middleware/auth');
const router = new express.Router()


//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateToken();
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
});


//login user
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({user, token});
    }catch(e) {
        res.status(500).send(e)
    }
});


//get users
router.get('/users/me',auth, async (req, res) => {
    try {
        const user = await req.user.populate('cards').populate('accounts').populate('transactions').execPopulate();
        res.send({ user, cards: user.cards, accounts: user.accounts, transactions: user.transactions})
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
});



//get user by id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         console.log(_id)
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })


//update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "mobileNo"]
    const isValidOperation = updates.every(el => allowedUpdates.includes(el))
    if (!isValidOperation) {
        return res.status(400).send()
    }
    try {
        const user = req.user;
        updates.forEach(el => {
            user[el] = req.body[el]
        })
        await user.save();
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;
