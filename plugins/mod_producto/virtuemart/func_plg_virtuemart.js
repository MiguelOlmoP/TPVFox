function modificarProductoWeb(){
    //@Objetivo:
    //MOdificar los datos del producto en la web 
    console.log("entre en modificar producto web ");
    var datos={
        'estado':       $('#estadosWeb').val(),
        'referencia':   $('#referenciaWeb').val(),
        'nombre':       $('#nombreWeb').val(),
        'codBarras':    $('#codBarrasWeb').val(),
        'precioSiva':   $('#precioSivaWeb').val(),
        'iva':          $('#ivasWeb').val(),
        'id':           $('#idWeb').html()
    };
    
    console.log(datos);
     var parametros = {
		"pulsado"    	: 'modificarDatosWeb',
		"datos"	: JSON.stringify(datos)
		};
     $.ajax({
		data       : parametros,
		url        : ruta_plg_virtuemart+'tareas_virtuemart.php',
        type       : 'post',
		beforeSend : function () {
		console.log('********* Envio los datos para modificar el producto en la web  **************');
		},
		success    :  function (response) {
				console.log('Respuesta de modificar los datos de la web  ');
				var resultado = $.parseJSON(response);
                console.log(resultado);
                if(resultado.htmlAlerta){
                    $('#alertasWeb').html(resultado.htmlAlerta);
                }
				 
		}	
        });
}
function ModalNotificacion(numLinea){
    //@Objetivo: mostrar el modal para enviar el correo de la notificación
    console.log("entre en enviar modal notificacion");
   
    var datos={
        'nombreProducto': $('#nombreWeb').val(),
        'id':             $('#idWeb').html(),
        'correo':         $('#mail_'+numLinea).html(),
        'nombreUsuario':  $('#nombre_'+numLinea).html(),
        'idNotificacion':  $('#idNotificacion_'+numLinea).val(), 
        'emailEnvio':  $('#emailW').val(),
        'hostEnvio':$('#hostW').val(),
        'passwordEnvio':$('#passwordW').val(),
        'puertoEnvio':$('#puertoW').val(),
        'numLinea':numLinea
    };
    console.log(datos);
     var parametros = {
		"pulsado"    	: 'mostrarModalNotificacion',
		"datos"	: datos
		};
     $.ajax({
		data       : parametros,
		url        : ruta_plg_virtuemart+'tareas_virtuemart.php',
        type       : 'post',
		beforeSend : function () {
		console.log('********* Envio los datos para mostrar el modal de notificaciones  **************');
		},
		success    :  function (response) {
				console.log('Respuesta de mostrar el modal de notificaciones  ');
				var resultado = $.parseJSON(response);
                console.log(resultado);
                var titulo="Enviar correo de Notificacion";
                abrirModal(titulo, resultado.html);
                
				 
		}	
        });
   
    
    
}
function enviarCorreoNotificacion(){
    //@Objetivo : Enviar el correo con la respuesta de la notificación
    console.log("entre en enviar correo de notificacion");
    var datos={
        'email':$('#email').val(),
        'asunto':$('#asunto').val(),
        'mensaje':$('#mensaje').val(),
        'idProducto':$('#idProducto').html(),
        'idNotificacion':  $('#idNotificacion').val(),
        'emailEnvio':  $('#emailW').val(),
        'hostEnvio':$('#hostW').val(),
        'passwordEnvio':$('#passwordW').val(),
        'puertoEnvio':$('#puertoW').val(),
        'numLinea':$('#numLinea').val(),
    };
    console.log(datos);
      var parametros = {
		"pulsado"    	: 'enviarCorreoNotificacion',
		"datos"	: datos
		};
         $.ajax({
		data       : parametros,
		url        : ruta_plg_virtuemart+'tareas_virtuemart.php',
        type       : 'post',
		beforeSend : function () {
		console.log('********* Envio los datos para mostrar el modal de notificaciones  **************');
		},
		success    :  function (response) {
				console.log('Respuesta de mostrar el modal de notificaciones  ');
				var resultado = $.parseJSON(response);
                console.log(resultado);
               if(resultado.mail==1){
                   alert(resultado.error);
               }else{
                    cerrarPopUp();
                    console.log(resultado.numLinea);
                    $("#Linea_"+resultado.numLinea).remove();
                  
               }
              
                
				 
		}	
        });
        
}
function recalcularPvpWeb(dedonde){
    var iva=parseFloat($( "#ivasWeb option:selected" ).html(),2);
    iva= iva/100;
    console.log(iva);
    if (dedonde === 'precioSivaWeb'){
		var precioSiva = parseFloat($('#precioSivaWeb').val(),2);
		var precioCiva = precioSiva+(precioSiva*iva);
		// Ahora destacamos los input que cambiamos.		
		destacarCambioCaja('precioCivaWeb');
	}else{
        var precioCiva = parseFloat($('#precioCivaWeb').val(),2);
        iva = iva +1;
        var precioSiva = precioCiva/iva;
        destacarCambioCaja('precioSivaWeb');
    }
    $('#precioSivaWeb').val(precioSiva.toFixed(2));
	$('#precioCivaWeb').val(precioCiva.toFixed(2));
}
function modificarIvaWeb(){
    var iva=parseFloat($( "#ivasWeb option:selected" ).html(),2);
    console.log(iva);
    var precioSiva = parseFloat($('#precioSivaWeb').val(),2);
    iva=iva/100;
    console.log(iva);
    var precioCiva=precioSiva+(precioSiva*iva);
    console.log(precioCiva);
    destacarCambioCaja('precioCivaWeb');
    $('#precioCivaWeb').val(precioCiva.toFixed(2));
}
