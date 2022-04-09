
function metodoClick(pulsado){
	console.log("Inicimos switch de control pulsar");
	switch(pulsado) {
		case 'VerProveedor':
			console.log('Entro en proveedor ver');
			// Cargamos variable global ar checkID = [];
			VerIdSeleccionado ();
			if (checkID.length >1 || checkID.length=== 0) {
				alert ('Que items tienes seleccionados? \n Solo puedes tener uno seleccionado');
				return
			}	
			window.location.href = './proveedor.php?id='+checkID[0]+'&accion=ver';		
			break;
		
		case 'AgregarProveedor':
			console.log('entro en agregar proveedor');
			window.location.href = './proveedor.php';
			break;
		
		case 'ListadoProductos':
			console.log('Entro en Listado de productos de un proveedor');
			// Cargamos variable global ar checkID = [];
			VerIdSeleccionado ();
			if (checkID.length >1 || checkID.length=== 0) {
				alert ('Que items tienes seleccionados? \n Solo puedes tener uno seleccionado');
				return
			}
			window.location.href = './OtrasVistas/ListadoProductosDeProveedor.php?id='+checkID[0];
			break;
		
	 }
} 

function resumen(dedonde, idProveedor){

	window.location.href = './OtrasVistas/resumenAlbaranes.php?id='+idProveedor;
}

function imprimirResumen(dedonde, id, fechaInicial, fechaFinal){
		  var parametros = {
			'pulsado' : 'imprimirResumenAlbaran',
            idProveedor: id,
            fechaInicial: fechaInicial,
            fechaFinal: fechaFinal
           
        };
         $.ajax({
            data: parametros,
            url: './../tareas.php',
            type: 'post',
            success: function (response) {
              var resultado =  $.parseJSON(response); 
				console.log(resultado);
				 window.open(resultado);
            },
           
        });
}
function filtroEstado(input,id){
    // @ Objetivo
    // Ocultar o mostrar Row con estado tal.
	if (input.value == '1'){
		// Ocultamos
		$(input).val('0');
		var x = document.getElementsByClassName('Row'+id);

		for (var i = 0; i < x.length; i++) {
		x[i].style.display= "none";
		}


	} else {
		// Mostramos
		$(input).val('1');
		var x = document.getElementsByClassName('Row'+id);
		for (var i = 0; i < x.length; i++) {
		x[i].removeAttribute("style");
		}
	}
	    
}
