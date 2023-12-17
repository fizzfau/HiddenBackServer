const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const LogModel = require('../../models/Logs')

function AddLog(logData) {
    new LogModel(logData).save();
}

router.get('/getLogs', authenticate, function (req, res) {
    const coopId = req.user.coopId;
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        return res.status(200).send({ success: false, message: 'Yetkisiz işlem!' });
    }
    LogModel.find({ coopId: coopId }).exec()
        .then(logs => {
            res.status(200).send({ success: true, logs });
        })
        .catch(err => {
            res.status(200).send({ success: false, message: err.message });
        });
});

const Logs = router;
module.exports = {
    Logs,
    AddLog
};