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
		
		if (features.length === 0) {
			const error = new Error();
			error.statusCode = 400;
			throw error;
		}
        
		const [ longitude, latitude ] = features[0].center;

        return { latitude, longitude };
    } catch (error) {
		error.message = 'No se pudo procesar la solicitud.';
		throw error;
    }
}

router.get('/', (req, res) => {
    res.sendFile('/index.html');
});

router.post('/geolocate', async (req, res, next) => {
    const { body } = req;
    try {
        const coordinates = await geocode(body);
        
        return res.json({ ...coordinates, ok: true });
    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    global.utils.log(err);
    res.json({
        ok: false,
        statusCode,
        message: err.message
    });
});

module.exports = router;