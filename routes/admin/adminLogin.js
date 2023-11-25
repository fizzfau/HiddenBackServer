const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../../models/AdminUser');
const Cooperative = require('../../models/Cooperative');
require('dotenv').config();

router.get("/login/:username/:coopId/:password", function(req, res) {
    const password = req.params.password;
    const coopId = req.params.coopId;
    const userName = req.params.username
    AdminUser.findOne({ coopId, userName }).exec()
    .then(user => {
        if (!user) {
            return res.status(200).send({auth: false, message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(200).send({ auth: false });
        }
        
        

        Cooperative.findOne({ cooperativeId: coopId }).exec()
        .then(coop => {
            const token = jwt.sign({ coopId, isAdmin: true, userName}, process.env.SECRET, {
                expiresIn: 86400, // expires in 24 hours
            });

            console.log(30, user, coop);

            res.status(200).send({ auth: true, token, user, coop });
        })
        .catch(err => {
            res.status(200).send({ auth: false, message: "Kooperatif bulunamadı!" });
        });
    })
});

module.exports = router;