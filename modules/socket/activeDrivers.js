const coops = {};
const Cooperative = require('../../models/Cooperative');

Cooperative.find().exec().then(cooperative => {
    cooperative.forEach(coop => {
        coops[coop.cooperativeId] = 0;
    });
});

function GetDrivers(coopId)
{
    return coops[coopId];
}

function IncrementDriver(coopId)
{
    !isNaN(coops[coopId]) && coops[coopId]++;
}

function DecrementDriver(coopId)
{
    !isNaN(coops[coopId]) && coops[coopId]--;
    coops[coopId] < 0 && (coops[coopId] = 0);
}

module.exports = {
    GetDrivers,
    IncrementDriver,
    DecrementDriver
}