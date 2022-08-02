const form = document.querySelector('#address-form');
const geolocateBtn = document.querySelector('#geolocate-btn');

const pointLocation = position => {
	const { latitude, longitude } = position;
	const coords = [ longitude, latitude ];
	marker.setLngLat(coords).addTo(map);
	map.setCenter(coords);
}

const getLocation = options => new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(resolve, reject, options);
});

form.onsubmit = async e => {
	e.preventDefault();
	
	const formData = new FormData(form);
	const body = JSON.stringify(Object.fromEntries(formData));

	try {
		
	} catch (error) {
		const response = fetch('/geolocate', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	
		if (!response.ok) throw new Error('No se pudo procesar su solicitud.');
	
		const data = response.json();
	}
	// .then(data => {
	// 	if (!data.ok) throw new Error(data.message);
	// 	return pointLocation(data);
	// })
	// .catch(e => {
	// 	alert('No se pudo procesar su solicitud.' + e.message + 'Por favor inténtelo más tarde.');
	// 	console.error(e);
	// });
}

if (navigator.geolocation) {
	geolocateBtn.addEventListener('click', () => {
		getLocation()
			.then(position => {
				pointLocation(position.coords);
			})
			.catch(e => {
				alert('Error al intentar obtener la localización.');
				console.error(e);
			});
	});
} else {
	geolocateBtn.disabled = true;
}