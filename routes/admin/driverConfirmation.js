const User = require('../../models/User');
const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const Cooperative = require('../../models/Cooperative');
const {AddUserToQueue} = require('../../modules/socket/getDriverQueue');
const {AddLog} = require('./logs');

router.post("/getUnconfirmedDrivers", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        return res.status(200).send({ success: false, message: "Yetkisiz işlem!" });
    }
    const searchFilter = req.body.search
    const query = !searchFilter ? { coopId: coopId, confirmed: false } :
    { coopId: coopId, confirmed: false, $or: [
        {plate: { $regex: new RegExp(searchFilter, 'i') }}, 
        {name: { $regex: new RegExp(searchFilter, 'i') }}
    ] }
    User.find(query).exec()
    .then(users => {
        res.status(200).send({ uccess: true, users });
    })
});

router.post("/confirmDriver", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    const isAdmin = req.user.isAdmin;
    const userId = req.body.userId;
    if (!isAdmin) {
        return res.status(409).send({ success: false, message: "Yetkisiz işlem!" });
    }
    User.findOneAndUpdate({ coopId: coopId, userId: userId }, { confirmed: true }).exec()
    .then(user => {
        // add user to coopDriverQueue
        Cooperative.findOne({ cooperativeId: coopId }).exec()
        .then(coop => {
            let queue = JSON.parse(coop.coopDriverQueue);
            queue.push(user.userId);
            AddUserToQueue({
                name: user.name,
                plate: user.plate,
            });
            Cooperative.findOneAndUpdate({ cooperativeId: coopId }, { coopDriverQueue: JSON.stringify(queue) }).exec()
            .then(() => {
                console.log(40, {
                    userName: req.user.name,
                    coopId: coopId,
                    action: "confirmDriver",
                    logType: "success",
                    logDetails: JSON.stringify({}),
                    logText: `Kullanıcı onaylandı: ${user.name} - ${user.plate}`,
                });
                AddLog({
                    userName: req.user.name,
                    coopId: coopId,
                    action: "confirmDriver",
                    logType: "success",
                    logDetails: JSON.stringify({}),
                    logText: `<strong> ${user.name} - ${user.plate} </strong> kullanıcısı onaylandı.`,
                });
            })
        })
        res.status(200).send({ success: true });
    }).catch(err => {
        res.status(200).send({ success: false, message: err.message });
    })
});

router.post("/declineDriver", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    const isAdmin = req.user.isAdmin;
    const userId = req.body.userId;
    if (!isAdmin) {
        return res.status(200).send({ success: false, message: "Yetkisiz işlem!" });
    }

    User.findOneAndDelete({ coopId: coopId, userId: userId }).exec()
    .then(user => {
        AddLog({
            userName: req.user.name,
            coopId: coopId,
            action: "declineDriver",
            logType: "success",
            logDetails: JSON.stringify({}),
            logText: `<strong> ${user.name} - ${user.plate} </strong> kullanıcısı reddedildi.`,
        });
        res.status(200).send({ success: true, user });
    })
});

module.exports = router;