const form = document.querySelector('#address-form');
const geolocateBtn = document.querySelector('#geolocate-btn');
const overlay = document.querySelector('#overlay');
const spinner = document.querySelector('#loader');

const showSpinner = () => {
	overlay.classList.remove('hidden');
	spinner.classList.remove('hidden');
}

const hideSpinner = () => {
	overlay.classList.add('hidden');
	spinner.classList.add('hidden');
}

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

	showSpinner();
	
	const formData = new FormData(form);
	const body = JSON.stringify(Object.fromEntries(formData));

	try {
		const response = await fetch('/geolocate', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) throw new Error('No se pudo procesar su solicitud.');
	
		const data = await response.json();

		if (!data.ok) throw new Error(data.message);

		pointLocation(data);
	}
	catch (error) { alert(error.message); }
	finally { hideSpinner(); }
}

if (navigator.geolocation) {
	geolocateBtn.onclick = async () => {
		try {
			showSpinner();
			const position = await getLocation();
			pointLocation(position.coords);
		}
		catch (error) { alert('Error al intentar obtener la localización.'); }
		finally { hideSpinner(); }
	}
} else {
	geolocateBtn.onclick = () => alert('El navegador actual no soporta la geolocalización.');
	alert('El navegador actual no soporta la geolocalización.');
}