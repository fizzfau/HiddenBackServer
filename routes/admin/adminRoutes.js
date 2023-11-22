const Login = require('./adminLogin');
const getDrivers = require('./getHomePage');

const AdminRoutes = [
    Login,
    getDrivers
]

module.exports = AdminRoutes;