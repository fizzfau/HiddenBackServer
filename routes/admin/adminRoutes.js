const Login = require('./adminLogin');
const getDrivers = require('./getHomePage');
const createJob = require('../../modules/jobs/createJob');
const driverConfirmation = require('./driverConfirmation');
const { Logs } = require('./logs')

const AdminRoutes = [
    Login,
    getDrivers,
    createJob,
    driverConfirmation,
    Logs
]

module.exports = AdminRoutes;