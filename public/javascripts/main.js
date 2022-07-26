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

const postData = async (e) => {
	e.preventDefault();
	const body = new URLSearchParams();
	const formData = new FormData(form);
	for (const pair of formData) {
		body.append(...pair);
	}

	fetch('/geolocate', {
		method: 'POST',
		body
	})
	.then(res => res.json())
	.then(data => {
		if (!data.ok) throw new Error(data.message);
		return pointLocation(data);
	})
	.catch(e => {
		alert('No se pudo procesar su solicitud.' + e.message + 'Por favor inténtelo más tarde.');
		console.error(e);
	});
};

const form = document.querySelector('#address-form');
form.addEventListener('submit', postData, false);

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