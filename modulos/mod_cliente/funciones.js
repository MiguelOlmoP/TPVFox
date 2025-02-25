/* 
 * @Copyright 2018, Alagoro Software. 
 * @licencia   GNU General Public License version 2 or later; see LICENSE.txt
 * @Autor Alberto Lago Rodríguez. Alagoro. informatica arroba alagoro punto com
 * @Descripción	
 */


	//~ $('#closebutton').on('click', function() {
		//~ $('#closeX').toggle();		
	//~ });






function metodoClick(pulsado) {
	    console.log("Inicimos switch de control pulsar");
   switch (pulsado) {
	   	case 'VerCliente':
            console.log('Entro en VerCliente');
            if (this.validarChecks()) {
                window.location.href = './cliente.php?id=' + checkID[0];
            }
            break;

        case 'AgregarCliente':
            console.log('entro en agregarCliente');
            window.location.href = './cliente.php';
            break;

        case 'TarificarCliente':
            console.log('entro en tarificarCliente');
            if (this.validarChecks()) {
                window.location.href = './tarifaCliente.php?id=' + checkID[0];
            }
            break;
    }
}

function validarChecks() {
    // Cargamos variable global ar checkID = [];
    //Funcion global en jquery
    VerIdSeleccionado();
    if (checkID.length > 1 || checkID.length === 0) {
        alert('¿Cuantos items tienes seleccionados? \n Sólo puedes tener uno seleccionado');
        return false;
    }
    return true;
}

function controladorAcciones(caja, accion) {
    // @ Objetivo es obtener datos si fuera necesario y ejecutar accion despues de pulsar una tecla.
    //  Es Controlador de acciones a pulsar una tecla que llamamos desde teclado.js
    // @ Parametros:
    //  	caja -> Objeto que aparte de los datos que le ponemos en variables globales de cada input
    //				tiene funciones que podemos necesitar como:
    //						darValor -> donde obtiene el valor input
    

    switch (accion) {
        case 'buscarProducto':
            // Esta funcion necesita el valor.
            if (caja.darValor()!==''){           
				var idcaja = caja.name_cja
				leerArticulo({dedonde: caja.dedonde,idcliente: cliente.idClientes, caja: idcaja, valor: caja.darValor()});
			} else {
				// quiere decir que no tiene valor cja saltamos. .
				if (caja.dedonde !=='popup'){
					//
					ponerFocusCajasEntradas(caja.name_cja);
				} 
			}
            break;

        case 'Ayuda':
            console.log('Ayuda');
            break;
		
		case 'saltar_preciosCon':
			$('#inputPrecioCon').select();
			console.log(caja.id_input);
			recalcularPvp(caja.id_input);
			break;
		
		case 'grabarArticulo':
			recalcularPvp(caja.id_input);
			grabarArticulo(caja);
			$('#cajaidArticulo').focus();
			break;
		
		case 'cancelarAnhadir':
			console.log('vamos cancelar');
			cancelarAnhadir();
			break;
		
		case 'modificarArticulo':
			console.log(caja);
			leerArticulo({idcliente: cliente.idclientes, caja: 'idArticulo', valor: caja.idArticulo});
			break;
		
		case 'cancelarArticulo':
			console.log(caja);
			borrarArticulo(caja.idArticulo);
			break;
		
		case 'mover_down':
			// Controlamos si numero fila es correcto.
			var nueva_fila = 0;
			if ( isNaN(caja.fila) === false){
				nueva_fila = parseInt(caja.fila)+1;
			} 
			console.log('mover_down:'+nueva_fila);
			mover_down(nueva_fila,caja.darParametro('prefijo'));
		break;
		
		case 'mover_up':
			console.log( 'Accion subir 1 desde fila'+caja.fila);
			var nueva_fila = 0;
			if ( isNaN(caja.fila) === false){
				nueva_fila = parseInt(caja.fila)-1;
			} 
			mover_up(nueva_fila,caja.darParametro('prefijo'));
		break;	
		
        default :
            console.log('Accion no encontrada ' + accion);
    }
}

function after_constructor(padre_caja,event){
	// @ Objetivo:
	// Ejecuta procesos ANTES ( mi ingles-- :-) de construir el obj. caja.
	// Traemos 
	//		(objeto) padre_caja -> Que es objeto el padre del objeto que vamos a crear 
	//		(objeto) event -> Es la accion que hizo, que trae todos los datos input,button , check.

	if (padre_caja.id_input.indexOf('N_') >-1){
		padre_caja.id_input = event.target.id;
	}
	if (padre_caja.id_input.indexOf('btn_modificar_') >-1){
		// Ponemos como id realmente el de evento no el caja xml.
		padre_caja.id_input = event.target.id;
	}
	if (padre_caja.id_input.indexOf('btn_cancelar_') >-1){
		// Ponemos como id realmente el de evento no el caja xml.
		padre_caja.id_input = event.target.id;
	}
	return padre_caja;
}
function before_constructor(caja){
	// @ Objetivo :
	//  Ejecutar procesos para obtener datos despues del construtor de caja.
	//  Estos procesos los indicamos en parametro before_constructor, si hay
	if (caja.id_input.indexOf('N_') >-1){
		console.log(' Entro en Before:');
		caja.fila = caja.id_input.slice(2);
	}
	
	if (caja.id_input.indexOf('btn_modificar_') >-1){
		caja.idArticulo = caja.id_input.slice(14);
	}
	
	if (caja.id_input.indexOf('btn_cancelar_') >-1){
		caja.idArticulo = caja.id_input.slice(13);
	}
	
	if  (caja.id_input === 'cajaBusqueda'){
		caja.dedonde = caja.darParametro('dedonde');
	}
	return caja;
}

function leerArticulo(parametros) {
    borrarInputsFiltro();
	parametros['pulsado']='leerArticulo';
	
	$.ajax({
        data: parametros,
        url: 'tareas.php',
        type: 'post',
        success: function(respuesta){
			var obj = JSON.parse(respuesta);
			var response = obj.datos;
			var idCliente = $('#id_cliente').val();
			console.log(obj);
			if (obj.NItems === 1 && parametros.dedonde !=='popup') {
				// Mostrar linea de entrada precio sin iva y con iva.
				mostrarLineaEntradaPrecios(response[0]);
			} else {
				// Abrimos de popup , aunque ya los tengamos abierto,... lo hacemos
				// [PENDIENTE RESOLVER] No esta bien volver abrir, ya lo tuvieramos abierto, solo debería recargar...
				
				var titulo= 'Buscar producto en tarifa clientes ';
				var contenido = obj.html
				abrirModal(titulo,contenido.html);
				if ( parametros.dedonde === 'popup'){
					// Quiere decir que ya estabmos en popup, ahora compruebo si tiene NItems
					console.log(obj);
					if (obj.NItems > 0 ){
						console.log(obj);
						// Ponemos focus en el primer item encontrado.
						$('#N_0').focus();
					}
				} else {
					focusAlLanzarModal('cajaBusqueda');
				}
			}
		}
    });
}

function borrarArticulo(idarticulo) {
    $.ajax({
        data: {pulsado: 'Borrar_producto_tarifa_cliente',idcliente: cliente.idClientes,
            idarticulo: idarticulo},
        url: 'tareas.php',
        type: 'post',
        beforeSend : function () {
		console.log('*********  Eliminando producto de tarifa del cliente **************');
		},
		success    :  function (response) {
				console.log('Respuesta despues de eliminar producto de tarifa.');
				var resultado = $.parseJSON(response);
                console.log('--- Pendiente solucionar para devolver resultado --- ');
			}
    });
}
function escribirProductoSeleccionado(name,iva,pvpSiva,pvpCiva,idArticulo){
	cerrarPopUp()
	var producto = [];
	producto['idArticulo'] = idArticulo;
	producto['articulo_name'] = name;
	producto['pvpSiva'] = pvpSiva;
	producto['pvpCiva'] = pvpCiva;
	producto['iva'] = iva;
	mostrarLineaEntradaPrecios(producto);
} 

function mostrarLineaEntradaPrecios(response){
	// Si hay respuesta mostramos caja de entrada precios.
	console.log('Entro en mostrar lineas de producto');
	$('#formulario').removeAttr( 'style' );
	$('#inputIdArticulo').val(response['idArticulo']);
	$('#inputDescripcion').val(response['articulo_name']);
	$('#inputPrecioSin').val(parseFloat(response['pvpSiva']).toFixed(2));
	$('#inputIVA').val(response['iva']);
	$('#inputPrecioCon').val(parseFloat(response['pvpCiva']).toFixed(2));
	$('#formulario').show();
	$('#inputPrecioSin').select();
	
}


function borrarInputsFiltro() {
    $('#cajaidArticulo').val('');
    $('#cajaReferencia').val('');
    $('#cajaCodbarras').val('');
    $('#cajaDescripcion').val('');
}

function grabarArticulo(event){
		console.log('Grabar producto');
        var parametros = {
			'pulsado' : 'Grabar_tarifa_producto_cliente',
            idarticulo: $('#inputIdArticulo').val(),
            pvpSiva: parseFloat($('#inputPrecioSin').val()).toFixed(2),
            pvpCiva: parseFloat($('#inputPrecioCon').val()).toFixed(2),
            idcliente: $('#id_cliente').val()
        };
        $.ajax({
            data: parametros,
            url: './tareas.php',
            type: 'post',
            success: function (response) {
                var idcliente = $('#id_cliente').val();
                window.location.href = './tarifaCliente.php?id=' + idcliente;
            },
            // No se realmente cual es el funcionamiento de esto...
            error: function (request, textStatus, error) {
                console.log(textStatus);
            }
        });
	
	
}

function recalcularPvp(dedonde){
	// @ Objetivo:
	// Recalcular precio s/iva y precio c/iva segun los datos que tengan las cjas y de donde venga.
	// @ Parametros:
	//  dedonde = (string) id_input.
	// Obtenemos iva ( deberías ser funcion)
	console.log('De donde:'+dedonde);
    var iva = parseFloat($('#inputIVA').val(),2);
	if (dedonde === 'inputPrecioSin'){
		var precioSiva = parseFloat($('#inputPrecioSin').val(),2);
		var precioCiva = precioSiva+((precioSiva*iva)/100);
		$('#inputPrecioCon').val(precioCiva.toFixed(2));
		// Ahora destacamos los input que cambiamos.		
		destacarCambioCaja('inputPrecioCon');
	} else {
		console.log('Entro');
		var precioCiva = parseFloat($('#inputPrecioCon').val(),2);
		var precioSiva = precioCiva/(1+((iva)/100));
		$('#inputPrecioSin').val(precioSiva.toFixed(2));
		// Ahora destacamos los input que cambiamos		
		destacarCambioCaja('inputPrecioSin');
	}

}

function destacarCambioCaja(idcaja){
	$("#"+idcaja).css("outline-style","solid");
	$("#"+idcaja).css("outline-color","coral");
	$("#"+idcaja).animate({
			"opacity": "0.3"
		 },2000);
	t = setTimeout(volverMostrar,2000,idcaja);
	
}

function volverMostrar(idcaja){
	console.log('Entro volver mostrar');
	$("#"+idcaja).animate({
			"opacity": "1"
		 },1000);
	$("#"+idcaja).css("outline-color","transparent")
}

function ponerFocusCajasEntradas(caja_name){
	// @ Objetivo:
	// Si el valor de la caja esta vacio poner focus a la caja siguiente de busqueda
	// @ Parametro:
	// 		caja_name : (string ) con nombre de la caja que estamos actualmente.
	switch (caja_name) {
		case 'idArticulo':
			$('#cajaReferencia').focus();
		break;
		
		case 'Referencia':
			$('#cajaCodbarras').focus();
		break;
		
		case 'Codbarras':
			$('#cajaDescripcion').focus();
		break;
		
		case 'Descripcion':
			$('#cajaidArticulo').focus();
		break;
	
	}
}

function cancelarAnhadir(){
	$('#inputIdArticulo').val('');
    $('#inputPrecioSin').val('');
    $('#inputPrecioCon').val('');
    $('#formulario').hide();
	$('#idArticulo').focus();
}

// ===================  FUNCIONES DE PINTAR BONITO y MOVIMIENTOS =========================

function mover_down(fila,prefijo){
	var d_focus = prefijo+fila;
	// Segun prefijo de la caja seleccionamos o pones focus.
	if ( prefijo === 'Unidad_Fila_'){
		// Seleccionamos
		ponerSelect(d_focus);
	} else {
		ponerFocus(d_focus);
	}
}

function mover_up(fila,prefijo){
	var d_focus = prefijo+fila;
		// Segun prefijo de la caja seleccionamos o pones focus.
	if ( prefijo === 'Unidad_Fila_'){
		// Seleccionamos
		ponerSelect(d_focus);
	} else {
		ponerFocus(d_focus);
	}
}
function ponerFocus (destino_focus){
	// @ Objetivo:
	// 	Poner focus a donde nos indique el parametro, que debe ser id queremos apuntar.
	setTimeout(function() {   //pongo un tiempo de focus ya que sino no funciona correctamente
		jQuery('#'+destino_focus.toString()).focus(); 
	}, 50); 
}
function resumen(dedonde, idCliente){
	console.log(dedonde);
    if (dedonde === 'tickets'){
        window.location.href = './Resumenes/resumenTickets.php?id='+idCliente+'&historyJS=1';
    }
    if (dedonde === 'albaranes'){
        window.location.href = './Resumenes/resumenAlbaranes.php?id='+idCliente+'&historyJS=1';
    }
}
function imprimirResumen(dedonde, id, fechaInicial, fechaFinal){
		var parametros = {
			'pulsado' : 'imprimirResumenTickets',
            'idCliente': id,
            'fechaInicial': fechaInicial,
            'fechaFinal': fechaFinal
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
function imprimirTarifa(idCliente){
	 var parametros = {
			'pulsado' : 'imprimirTarifasCliente',
            idCliente: idCliente
        };
       $.ajax({
            data: parametros,
            url: './tareas.php',
            type: 'post',
            success: function (response) {
              var resultado =  $.parseJSON(response); 
              if(resultado.error){
				  alert(resultado.error);
			  }else{
				  window.open(resultado);
				  //~ console.log(resultado);
			  }
            },
           
        });
}


function imprimirFicha(idCliente){
	var parametros = {
		"pulsado"   : 'imprimirFichaCliente',
		"idCliente"        : idCliente
	};
	$.ajax({
			data       : parametros,
			url        : 'tareas.php',
			type       : 'post',
			beforeSend : function () {
				console.log('******** estoy en datos Imprimir JS****************');
			},
			success    :  function (response) {
				 var resultado =  $.parseJSON(response); 
				
				 window.open(resultado);// Abre una nueva pestaña con el documento pdf que se generó anteriormente
		}
	});
}

function abrirModalInforme(titulo, contenido, fechainicio, fechafin, actualizar=0){	
	abrirModal(titulo, contenido);
	var parametros = {		
		"pulsado"   : 'generarResumenTicketsClientes',
		"fechainicio"	: fechainicio,
		"fechafin"		: fechafin,
		"actualizar"	: actualizar
	};
	$.ajax({
			data       : parametros,
			url        : 'tareas.php',
			type       : 'post',
			beforeSend : function () {
				console.log('******** estoy en abrirModalInforme JS****************');
			},
			success    :  function (response) {
				var resultado =  $.parseJSON(response);
                alert(resultado);
				$('.modal-body').html($('.modal-body').html()+'<br/><br/>'+resultado);
		}
	});
}

function cerrarModalInforme(){
	cerrarPopUp()
}




