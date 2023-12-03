const User = require('../../models/User');
const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');

router.get("/getUnconfirmedDrivers", authenticate, function(req, res) {
    const coopId = req.user.coopId;
    User.find({ coopId: coopId, confirmed: false }).exec()
    .then(users => {
        res.status(200).send({ users });
    })
});

module.exports = router;