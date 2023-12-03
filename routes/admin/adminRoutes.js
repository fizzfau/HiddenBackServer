const Login = require('./adminLogin');
const getDrivers = require('./getHomePage');
const createJob = require('../../modules/jobs/createJob');
const driverConfirmation = require('./driverConfirmation');

const AdminRoutes = [
    Login,
    getDrivers,
    createJob,
    driverConfirmation
]

module.exports = AdminRoutes;