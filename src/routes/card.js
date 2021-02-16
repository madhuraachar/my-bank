const express = require('express');
const mongoose = require('mongoose');
const Card = require('./../modals/card');
const auth = require('./../middleware/auth')
const router = new express.Router();

//create card
router.post('/cards', auth, async (req, res) => {
    try {
        const _id = mongoose.Types.ObjectId();
        const cardNumber = _id;
        const card = new Card({ ...req.body, owner: req.user._id, _id, cardNumber});
        console.log(card)
        if(! card) {
            return res.status(500).send();
        }
        if (! card.inCardAmount > 0) {
            return res.status(500).send() 
        }
        const savedCard = await card.save();
        res.status(201).send({card: savedCard})
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//get all  cards
router.get('/cards', auth, async (req, res) => {
    try{
        const user = await req.user.populate('cards').execPopulate();
        //const cards = await Card.find();
        if (! user.cards) {
            return res.status(404).send()
        }
        res.send(user.cards)
    }catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/cards/:id', auth, async (req, res) => {
    try{
        const cardNumber = req.params.id;
        const update = Object.keys(req.body);
        const allowedUpdate = ['updatingAmount'];
        const isUpdateAllowed = update.every(el => allowedUpdate.includes(el));
        if (!isUpdateAllowed) {
            return res.status(401).send({ error: 'Unable to add balance' });
        }
        const card = await Card.findOne({ cardNumber });
        if (!card) {
            return res.status(404).send();
        }

        const updatingAmount = req.body.updatingAmount
        if (card.spentAmount < updatingAmount) {
            return res.status(500).send()
        }
        card.spentAmount = card.spentAmount - updatingAmount;
        await card.save();
        res.status(201).send({card: card});
    }catch(e) {
        return res.status(500).send(e)
    }

})

router.patch('/cards/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ['inCardAmount', 'spentAmount'];
    const isUpdateAllowed = updates.every(el => allowedUpdates.includes(el))

    if(! isUpdateAllowed) {
        return res.status(401).send({error: 'Update Not allowed'})
    }
    try {
        const card = await Card.findOne({_id, owner: req.user._id}, {new: true});
        if(! card) {
            return res.status(404).send()
        }

        updates.forEach(el => {
            card[el] = req.body[el]
        })
         await card.save()
        res.send(card)
    }catch(e) {
        res.status(500).send(e)
    }
});

router.delete('/cards/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const card = await Card.findByIdAndDelete(_id);
        if(! card) {
            return res.status(404).send()
        }
        res.send(card);
    }catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router;