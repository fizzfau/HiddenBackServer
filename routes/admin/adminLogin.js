const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../../models/AdminUser');
require('dotenv').config();

router.get("/login/:coopId/:password", function(req, res) {
    const password = req.params.password;
    const coopId = req.params.coopId;
    AdminUser.findOne({ coopId: coopId }).exec()
    .then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }
        
        const token = jwt.sign({ coopId, isAdmin: true }, process.env.SECRET, {
            expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).send({ auth: true, token });
    })
});

module.exports = router;