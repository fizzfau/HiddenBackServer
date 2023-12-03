const User = require('../models/User');
const Cooperative = require('../models/Cooperative');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const register =  (req, res) => {
    
    bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
        if (err) {
            res.json({
                error: err
            })
        }
        const userId = await createUniqueID();

        Cooperative.findOne({
            cooperativeId: req.body.coopId
        }).exec().then(coop => {
            if (!coop) {
                return res.status(200).json({
                    success: false,
                    message: "Kooperatif bulunamadı!"
                });
            } else {
                User.find({
                    plate: req.body.plate
                }).exec().then(user => {
                    if (user.length >= 1) {
                        return res.status(200).json({
                            success: false,
                            message: "Plaka zaten kayıtlı!"
                        });
                    } else {
                        let user = new User({
                            name: req.body.name,
                            plate: req.body.plate,
                            coopId: req.body.coopId,
                            userId: userId,
                            password: hashedPass
                        })
                        try {
                            const savedUser = user.save();
                            if (!savedUser) throw Error('Something went wrong saving the user');
                            res.status(200).json({
                                success: true
                            });
                        } catch (err) {
                            res.status(200).json({
                                success: false,
                                message: err.message
                            });
                        }
                    }
                })
            }

        })


    })
}

const login = async (req, res) => {
    const plate = req.body.plate.toString();
    const password = req.body.password;

    User.find({
        plate: plate
    })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(200).json({
                    success: false,
                    message: "Kayıtlı plaka bulunamadı!"
                });
            }
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(200).json({
                        success: false,
                        message: "Authentication failed!"
                    });
                }
                if (result) {
                    if (!user[0].confirmed) {
                        return res.status(200).json({
                            success: false,
                            message: "Hesabınız henüz onaylanmamış!"
                        });
                    }

                    const token = jwt.sign({
                        name: user[0].name,
                        userId: user[0].userId,
                        plate: user[0].plate,
                        coopId: user[0].coopId
                    },
                        process.env.SECRET, {
                        expiresIn: "99y"
                    }
                    );

                    return res.status(200).json({
                        success: true,
                        message: "Authentication successful",
                        token: token,
                        user: {
                            name: user[0].name,
                            userId: user[0].userId,
                            plate: user[0].plate,
                            coopId: user[0].coopId
                        },
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "Şifre hatalı!"
                    });
                }
            });
        }
        );
}

async function createUniqueID() {
    let isUnique = false;
    let newUniqueId;

    while (!isUnique) {
        newUniqueId = Math.floor(100000 + Math.random() * 900000);
        // Check if the generated ID already exists in the database
        const existingDoc = await User.findOne({ userId: newUniqueId });
        if (!existingDoc) {
            isUnique = true;
        }
    }
    console.log(`New unique ID generated: ${newUniqueId}`);
    return newUniqueId.toString();
}

module.exports = {
    register,
    login
}