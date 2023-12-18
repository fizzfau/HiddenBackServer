const User = require('../../models/User');
const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const Cooperative = require('../../models/Cooperative');
const {AddUserToQueue} = require('../../modules/socket/getDriverQueue');
const {AddLog} = require('./logs');

router.post("/getUnconfirmedDrivers", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    const isAdmin = req.user.isAdmin;
    const page = req.body.page;
    const startIndex = page && (page == 1 ? 1 : (page - 1) * 10);
    const endIndex = page && (page == 1 ? 10 : page * 10);
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
            res.status(200).send({ success: true, users: !searchFilter ? users.slice(startIndex, endIndex) : users, totalCount: users.length });
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
                userId: userId
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

// router.get('/createFakeDrivers', (req, res) => {
//     const names = ["Ahmet", "Mehmet", "Ali", "Veli", "Ayşe", "Fatma", "Zeynep", "Merve", "Ece", "Ege", "Berk", "Bora", "Cem", "Can", "Deniz", "Doruk", "Ekin", "Elif", "Emir", "Emre", "Furkan", "Gökçe", "Gökhan"
//     , "Güneş", "Hakan", "İbrahim", "İpek", "İrem", "Kerem", "Koray", "Mert", "Mete", "Nur", "Oğuz", "Ömer", "Özge", "Pınar", "Selin", "Sena", "Sude", "Sude", "Şeyma", "Taha", "Tolga", "Yiğit", "Yusuf", "Zeynep"]
//     const plates = ["34", "35", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16"]
//     const coopId = "12345"
//     for (i = 0; i < 100; i++) {
//         let user = new User({
//             name: names[Math.floor(Math.random() * names.length)],
//             plate: plates[Math.floor(Math.random() * plates.length)] + " " + Math.floor(Math.random() * 10000),
//             coopId: coopId,
//             userId: Math.floor(Math.random() * 100000000),
//             password: "123456",
//             confirmed: false
//         })
//         user.save();
//     }
// })

module.exports = router;