const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const register = async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
        if (err) {
            res.json({
                error: err
            })
        }
        const userId = await createUniqueID();
        User.find({
            plate: req.body.plate
        }).exec().then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Phone number already exists"
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
                    res.json(savedUser);
                } catch (err) {
                    res.json({
                        message: err
                    })
                }
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
                return res.status(401).json({
                    message: "User does not found!"
                });
            }
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication failed!"
                    });
                }
                if (result) {
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
                        message: "Authentication successful",
                        token: token,
                    });
                } else {
                    return res.status(401).json({
                        message: "Password does not match!"
                    });
                }
            });
        }
    );
}

function generateSixDigitRandom() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
}

async function createUniqueID() {
    let isUnique = false;
    let newUniqueId;
    
    while (!isUnique) {
      newUniqueId = generateSixDigitRandom();
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