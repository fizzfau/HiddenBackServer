const Login = require('./adminLogin');
const getDrivers = require('./getHomePage');
const createJob = require('../../modules/jobs/createJob');

const AdminRoutes = [
    Login,
    getDrivers,
    createJob
]

module.exports = AdminRoutes;