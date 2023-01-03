<?php 
	//@ Objetivo:
    //  Añadir factura temporal hace exactamente lo mismo que el añadir albarán temporal pero esta vez con facturas
    //  Deberiamos:
    //    - STANDARIZAR en un proceso unico.
    //    - Comprobar si los productos tiene numero albaran o pedido, que venga los adjuntos.
    
    $idFacturaTemp=$_POST['idTemporal'];
    $idUsuario=$_POST['idUsuario'];
    $idTienda=$_POST['idTienda'];
    $numFactura=$_POST['idReal'];
    $fecha=$_POST['fecha'];
    $fecha = new DateTime($fecha);
    $fecha = $fecha->format('Y-m-d');
    $productos=json_decode($_POST['productos']);
    $idCliente=$_POST['idCliente'];
    if(isset($_POST['albaranes'])){
        $albaranes=$_POST['albaranes'];
    }else{
        $albaranes=array();
    }
    $respuesta=array();
    $existe=0;
    if ($idFacturaTemp>0){
        $rest=$CFac->modificarDatosFacturaTemporal($idUsuario, $idTienda, $fecha , $albaranes, $idFacturaTemp, $productos);
        if(isset($rest['error'])){
            $respuesta['error']=$rest['error'];
            $respuesta['consulta']=$rest['consulta'];
        }else{
            $existe=1;	
            $pro=$rest['productos'];
        }
    }else{
        $rest=$CFac->insertarDatosFacturaTemporal($idUsuario, $idTienda,  $fecha , $albaranes, $productos, $idCliente);
        if(isset($rest['error'])){
            $respuesta['error']=$rest['error'];
            $respuesta['consulta']=$rest['consulta'];
        }else{
            $existe=0;
            $pro=$rest['productos'];
            $idFacturaTemp=$rest['id'];
        }
        
    }
    $respuesta['numFactura']=$numFactura;
    if ($numFactura>0){
        $modId=$CFac->addNumRealTemporal($idFacturaTemp, $numFactura);
        if(isset($modId['error'])){
            $respuesta['error']=$modId['error'];
            $respuesta['consulta']=$modId['consulta'];
        }
    }
    if (isset($productos)){
        $CalculoTotales = recalculoTotales($productos);
        $total=round($CalculoTotales['total'],2);
        $respuesta['total']=round($CalculoTotales['total'],2);
        $respuesta['totales']=$CalculoTotales;
        $modTotal=$CFac->modTotales($idFacturaTemp, $respuesta['total'], $CalculoTotales['subivas']);
        if(isset($modTotal['error'])){
            $respuesta['error']=$modTotal['error'];
            $respuesta['consulta']=$modTotal['consulta'];
        }
        $htmlTotales=htmlTotales($CalculoTotales);
        $respuesta['htmlTabla']=$htmlTotales['html'];
        
    }
    $respuesta['id']=$idFacturaTemp;
    $respuesta['existe']=$existe;
    $respuesta['productos']=$_POST['productos'];
?>
