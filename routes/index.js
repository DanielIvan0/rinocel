const router = require('express').Router();
const postmanRequest = require('postman-request');
const request = (url) => new Promise((resolve, reject) => {
    postmanRequest({ url, json: true }, (e, res) => {
        if (e) return reject(e);
        resolve(res);
    });
});
const geocode = async body => {
    const { number, street, zip, city, state } = body;
    const req = encodeURIComponent(`${number} ${street} ${zip} ${city} ${state} MA`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${req}.json?access_token=${process.env.mapbox_public}`;
    try {
        const response = await request(url);
        const { features } = response.body;
        const [ longitude, latitude ] = features[0].center;
        return { latitude, longitude };
    } catch (error) {
        throw new Error('No se pudo obtener las coordenadas.');
    }
}

router.get('/', (req, res) => {
    res.sendFile('/index.html');
});

router.post('/geolocate', async (req, res, next) => {
    const { body } = req;
    try {
        const coordinates = await geocode(body);
        
        if (!coordinates) {
            const err = new Error('Error al conectar al servicio.');
            err.code = 500;
            
            throw err;
        }
        if (coordinates.error) return res.json({ coordinates, ok: false }).statusCode(500);
        
        return res.json({ ...coordinates, ok: true });
    } catch (error) {
        next(error);
    }
});

module.exports = router;