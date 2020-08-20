var app = new Vue({
	el: '#app',
	data: {
		//array con datos originales de miembros
		months_: ["SEPTEMBER", "OCTOBER"],
		//cargo la información de los partidos desde el (information.js)
		months: months,
		//trabajo con la copia del array para hacer los filtros
		filteredMonths: months,
		map: "",
		/* Inicialmente setea page= "NYSL HOME", es decir home, que es la que está activa al abrir la aplicación -->*/
		page: "NYSL HOME",
		mensaje: '',
		mensajes: [],
		userEmail: '',
		userPassword: '',
		date: '',
		teams: '',
		location: '',
		times: '',
		gameId: '',
		error: '',

	},
	//implementa función usando vue
	methods: {
		mostrarMapa: function (linkMapa) {
			app.map = linkMapa;
		},
		mostrarPagina: function (pagina) {
			this.page = pagina;
		},
		//Almacena el detalle de la información del juego del mensaje que se está escribiendo actualmente
		mostrarMsjeJuego: function (date, teams, location, times, gameId) {
			this.date = date;
			this.teams = teams;
			this.location = location;
			this.times = times;
			this.gameId = gameId;

		},

		send: function () {
			//toma fecha del sistema, en el momento que escribe el mensajes
			var now = new Date();
			//Esta es la estructura y la información que va a aparecer en el firebase ( ver Database -> Datos)
			var postData = {
				texto: app.mensaje,
				email: firebase.auth().currentUser.email,
				fecha: now.toUTCString(),
				gameId: app.gameId,

			};
			var updates = {
				//"mesajes/1": postData
			};
			var key = firebase.database().ref().push().key;
			updates['/mensajes/' + key] = postData;
			firebase.database().ref().update(updates).then(function (result) {
				app.error = "Mensaje Enviado"; // Como limpiar la variable para volverla a usar o llamar a una función para poner la variable en ""
			});
			/*app.error=""; ponerlo en una función "on-focus" así como on-change que dispara un evento  */
		},
		limpiar: function () {
			app.mensaje='';
			app.error = '';
		},
		login: function () {
			/*logueo con cuenta google, gmail*/
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider);
		},
		register: function () {
			firebase.auth().createUserWithEmailAndPassword(app.userEmail, app.userPassword)
				.then(function () {
					app.error = "Cuenta Creada";

				})
				.catch(function (error) {
					app.error = "Error al Crear la Cuenta " + error;

				})
		},
		loginEmail: function () {
			firebase.auth().signInWithEmailAndPassword(app.userEmail, app.userPassword)
				.then(function () {
					app.error = "Cuenta Logueada";

				})
				.catch(function (error) {
					app.error = "Error de Loguin " + error;
				})
		}

	}
});


//FUNCION FILTRO (ambos filtros en una sola función)
function filter() {
	//array con el resultado del filtro
	var arrayFilter = [];
	//tomar valor del mes seleccionado
	var mes = document.getElementById("meses").value;
	for (var j = 0; j < app.months.length; ++j) {
		var month = app.months[j];
		//filtra por mes, hay algún mes seleccionado o esta seleccionado la opción All ("")
		if (month.name == mes || mes == "") {
			arrayFilter.push(month);
		}
	}
	//Actualizo la copia del array a mostrar
	app.filteredMonths = arrayFilter;
}

firebase.database().ref('/mensajes/').on('child_added', function (data) {
	/*cada barra es un nivel*/
	app.mensajes.push(data.val());

}) /*lectura de datos*/
