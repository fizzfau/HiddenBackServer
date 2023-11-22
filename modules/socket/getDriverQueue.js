const queue = [
    {
        name: 'driver1',
        plate: 'plate1',
        status: 'available',

    },
    {
        name: 'driver2',
        plate: 'plate2',
        status: 'available',

    },
    {
        name: 'driver3',
        plate: 'plate3',
        status: 'available',

    },
    {
        name: 'driver4',
        plate: 'plate4',
        status: 'available',

    },
    {
        name: 'driver5',
        plate: 'plate5',
        status: 'available',

    },
    {
        name: 'driver6',
        plate: 'plate6',
        status: 'available',

    },
    {
        name: 'driver7',
        plate: 'plate7',
        status: 'available',

    },
    {
        name: 'driver8',
        plate: 'plate8',
        status: 'available',

    },
    {
        name: 'driver9',
        plate: 'plate9',
        status: 'available',

    },
    {
        name: 'driver10',
        plate: 'plate10',
        status: 'available',

    },
    {
        name: 'driver11',
        plate: 'plate11',
        status: 'available',

    },
    {
        name: 'driver12',
        plate: 'plate12',
        status: 'available',

    },
    {
        name: 'driver13',
        plate: 'plate13',
        status: 'available',

    },
    {
        name: 'driver14',
        plate: 'plate14',
        status: 'available',

    },
    {
        name: 'driver15',
        plate: 'plate15',
        status: 'available',

    },
    {
        name: 'driver16',
        plate: 'plate16',
        status: 'available',

    },
    {
        name: 'driver17',
        plate: 'plate17',
        status: 'available',

    },
    {
        name: 'driver18',
        plate: 'plate18',
        status: 'available',

    },
    {
        name: 'driver19',
        plate: 'plate19',
        status: 'available',

    },
    {
        name: 'driver20',
        plate: 'plate20',
        status: 'available',

    },
    {
        name: 'driver21',
        plate: 'plate21',
        status: 'available',

    },
]

const express = require('express');
const router = express.Router();
let currentUser = null;

function StartQueue(io) {
    console.log("Sıra başlatılıyor")
    setInterval(() => {
        console.log("Sıra kontrol ediliyor")
        if (queue.length > 0) {
            // Eğer sıradaki kişi sıra içinde herhangi bir etkileşimde bulunmamışsa, sıradan çıkar
            console.log(`Sıradaki kişi:`, JSON.stringify(currentUser));
            if (currentUser !== null) {
                queue.push(currentUser);
                currentUser = null;
            }
    
            // Sıradaki kişiyi al
            currentUser = queue.shift();
            console.log(`Sırada şuan sıradaki kişi: ${currentUser.name}`);
            console.log(`Bir sonraki kişi:`, queue[0].name);
            console.log(`Sıradan son çıkan kişi:`, queue[queue.length - 1].name);
            io.emit('queueChanged', currentUser);
        }
    }, 5000);
}

// Etkileşimde bulunma endpoint'i
router.post('/interact/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    // Sıradaki kişi mi kontrol et
    if (currentUser === userId) {
        currentUser = null; // Etkileşimde bulunulduğunda sıradan çıkar
        res.send(`Etkileşimde bulunan kullanıcı: ${userId}`);
    } else {
        res.send(`Sıradaki kullanıcı değilsiniz.`);
    }
});

module.exports = {router, currentUser, StartQueue};