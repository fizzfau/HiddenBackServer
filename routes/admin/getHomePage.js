const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const { GetDrivers } = require('../../modules/socket/activeDrivers');

router.get("/getHomePageData", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    User.find({ coopId: coopId, confirmed: true }).exec()
    .then(users => {
        if (!users) {
            return res.status(404).send({ message: "User Not found." });
        }
        const onlineUsers = GetDrivers(coopId);
        res.status(200).send({ users, onlineUsers });
    })
});

router.get("/navbar/:coopId", authenticate, function(req, res) {
    const coopId = req.params.coopId;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
        return res.status(401).send({ success: false, message: "Yetkisiz işlem!" });
    }
    res.json({
        activeUserCount: GetDrivers(coopId),
    });   
})

module.exports = router;