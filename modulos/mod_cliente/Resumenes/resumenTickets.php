<!DOCTYPE html>
<html>
    <head>
		 <?php
		// Reinicio variables
        include './../../../head.php';
         include './../funciones.php';
        include ("./../../../controllers/Controladores.php");
        include_once ($RutaServidor.$HostNombre.'/controllers/parametros.php');
        $ClasesParametros = new ClaseParametros('../parametros.xml');  
        include '../clases/ClaseCliente.php';
		$Cliente= new ClaseCliente($BDTpv);
        $Controler = new ControladorComun; 
		$Controler->loadDbtpv($BDTpv);
		$errores=array();
		$titulo="";
		$fechaInicial="";
		$fechaFinal="";
		$style='style="display:none;"';
		if(isset($_GET['id'])){
			$id=$_GET['id'];
			$datosCliente=$Cliente->getCliente($id);
			if(isset($datosCliente['error'])){
				 $errores[1]=array ( 'tipo'=>'DANGER!',
								 'dato' => $datosCliente['consulta'],
								 'class'=>'alert alert-danger',
								 'mensaje' => 'Error en sql'
								 );
			}else{
				$titulo='Resumen tickets';
				
			}
		}else{
			$errores[1]=array ( 'tipo'=>'DANGER!',
								 'dato' => '',
								 'class'=>'alert alert-danger',
								 'mensaje' => 'Error no se ha enviado el id del cliente'
								 );
		}
		
		if(isset($_POST['porfechas'])){
			$comprobarFechas=comprobarFechas($_POST['fechaInicial'], $_POST['fechaFinal']);
			if(isset($comprobarFechas['error'])){
				$errores[8]=array ( 'tipo'=>'Info!',
								 'dato' => $comprobarFechas['consulta'],
								 'class'=>'alert alert-info',
								 'mensaje' => ''
								 );
			 }else{
				 header('Location: resumenTickets.php?fechaIni='.$comprobarFechas['fechaIni'].
						'&fechaFin='.$comprobarFechas['fechaFin'].'&id='.$id);
			 }
		}
		if(isset($_POST['portodo'])){
			 header('Location: resumenTickets.php?fechaIni=&fechaFin=&id='.$id);
		}
		if(isset($_GET['fechaIni']) & isset($_GET['fechaFin'])){
			$fechaIni=$_GET['fechaIni'];
			$fechaFin=$_GET['fechaFin'];
			$idCliente=$_GET['id'];
			if($fechaIni<>"" & $fechaFin<>""){
				$fechaInicial =date_format(date_create($fechaIni), 'd-m-Y');
				$fechaFinal =date_format(date_create($fechaFin), 'd-m-Y');
			}
			$style="";
			$arrayNums=$Cliente->ticketClienteFechas($idCliente, $fechaIni, $fechaFin);
			if(isset($arrayNums['error'])){
				$errores[1]=array ( 'tipo'=>'DANGER!',
								 'dato' => $arrayNums['consulta'],
								 'class'=>'alert alert-danger',
								 'mensaje' => 'Error de sql'
								 );
			}
		}else{
			$errores[1]=array ( 'tipo'=>'DANGER!',
								 'dato' => '',
								 'class'=>'alert alert-danger',
								 'mensaje' => 'Error no se han enviado corectamente las fechas'
								 );
		}
		?>
	</head>
	<body>
		<script src="<?php echo $HostNombre; ?>/modulos/mod_cliente/funciones.js"></script>
		<script src="<?php echo $HostNombre; ?>/modulos/mod_incidencias/funciones.js"></script>
		<?php
        include './../../../header.php';
       
				
				if (isset($errores)){
				foreach($errores as $error){
						echo '<div class="'.$error['class'].'">'
						. '<strong>'.$error['tipo'].' </strong> '.$error['mensaje'].' <br>Sentencia: '.$error['dato']
						. '</div>';
				}
				}
				?>
		
		<div class="container">
			<div class="col-md-12 text-center" >
					<h2 class="text-center"> <?php echo $titulo;?></h2>
			</div>
			<div class="col-md-12" >
				<div class="col-md-3 " >
					<a  onclick="imprimirResumen('ticket', '<?php echo $id; ?>', '<?php echo $fechaInicial;?>', '<?php echo $fechaFinal;?>')">Imprimir resumen</a>
					<h4><u>DATOS DEL CLIENTE</u></h4>
					<b>ID: </b><?php echo $id;?></br>
					<b>Nombre: </b><?php echo $datosCliente['datos'][0]['Nombre'];?></br>
					<b>Razón social: </b><?php echo $datosCliente['datos'][0]['razonsocial'];?></br>
					<b>NIF:</b><?php echo $datosCliente['datos'][0]['nif'];?></br>
				</div>
				<div class="col-md-4" >
					<form method="post">
					<label>Fecha Inicial</label>
					<input type="date" id="fechaInicial" name="fechaInicial" value="<?php echo $fechaInicial;?>" pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" placeholder='dd-mm-yyyy' title=" Formato de entrada dd-mm-yyyy">
					<label>Fecha Final</label>
					<input type="date" id="fechaFinal" name="fechaFinal" value="<?php echo $fechaFinal;?>" pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" placeholder='dd-mm-yyyy' title=" Formato de entrada dd-mm-yyyy">
					<br><br>
					<input type="submit" name="porfechas" class="btn btn-info" value="Resumen fechas">
					<input type="submit" name="portodo"class="btn btn-warning"  value="Todo">
					
					</form>
				</div>
				<div class="col-md-5 " <?php echo $style;?>>
					<h4 class="text-center" ><u>TOTALES</u></h4>
					<table class="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th></th>
								<th>BASE</th>
								<th>IVA</th>
								<th>TOTAL</th>
							</tr>
						</thead>
						<tbody>
						<?php 
						$totalLinea=0;
						$totalDesglose=0;
						foreach($arrayNums['desglose'] as $desglose){
							$totalLinea=$desglose['sumBase']+$desglose['sumiva'];
							$totalDesglose=$totalDesglose+$totalLinea;
							echo '<tr>
								<td>'.$desglose['iva'].'%</td>
								<td>'.$desglose['sumBase'].'</td>
								<td>'.$desglose['sumiva'].'</td>
								<td>'.$totalLinea.'</td>
							</tr>';
						}
						
						?>
						</tbody>
					</table>
					<div class="col-md-12">
						<div class="col-md-5">
						</div>
						<div class="col-md-7">
							<div class="panel panel-success">
								<div class="panel-heading">
									<h3 class="panel-title">TOTAL: <?php echo $totalDesglose;?></h3>
								</div>
							</div>
						</div>
					</div>
				
				</div>
			</div>
			
			
				
			<div class="col-md-6"   <?php echo $style;?>>
				<h4 class="text-center" ><u>RESUMEN PRODUCTOS</u></h4>
					<table class="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th>PRODUCTO</th>
								<th>CANTIDAD</th>
								<th>PRECIO</th>
								<th>IMPORTE</th>
							</tr>
						</thead>
						<tbody>
						<?php 
						$totalProductos=0;
						foreach($arrayNums['productos'] as $producto){
							$precio=$producto['totalUnidades']*$producto['precioCiva'];
							echo '<tr>'
							. '<td>'.$producto['cdetalle'].'</td>'
							.'<td>'. number_format ($producto['totalUnidades'],2).'</td>'
							.'<td>'.number_format ($producto['precioCiva'],2).'</td>'
							. '<td>'.number_format ($precio,2).'</td>'
							. '</tr>';
							$totalProductos=$totalProductos+number_format ($precio,2);
						}
						?>
						</tbody>
					</table>
					<div class="col-md-12">
						<div class="col-md-7">
						</div>
						<div class="col-md-5">
							<div class="panel panel-success">
								<div class="panel-heading">
									<h3 class="panel-title">TOTAL: <?php echo $totalProductos;?></h3>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 "   <?php echo $style;?>>
					<h4 class="text-center" ><u>TICKETS</u></h4>
					<table class="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th>FECHA</th>
								<th>TICKET</th>
								<th>BASE</th>
								<th>IVA</th>
								<th>TOTAL</th>
							</tr>
						</thead>
						<tbody>
						<?php 
						$totalLinea=0;
						$totalbases=0;
							foreach($arrayNums['resumenBases'] as $bases){
								$totalLinea=$bases['sumabase']+$bases['sumarIva'];
								$totalbases=$totalbases+$totalLinea;
								$numTicket=$bases['idTienda'].'-'.$bases['idUsuario'].'-'.$bases['Numticket'];
								echo '<tr>
								<td>'.$bases['fecha'].'</td>
								<td>'.$numTicket.'</td>
								<td>'.$bases['sumabase'].'</td>
								<td>'.$bases['sumarIva'].'</td>
								<td>'.$totalLinea.'</td>
								</tr>';
							}
						?>
						
						</tbody>
					</table>
					<div class="col-md-12" >
						<div class="col-md-5">
						</div>
						<div class="col-md-7">
							<div class="panel panel-success">
								<div class="panel-heading">
									<h3 class="panel-title">TOTAL: <?php echo $totalbases;?></h3>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
		<?php 
		echo '<script src="'.$HostNombre.'/plugins/modal/func_modal.js"></script>';
		include $RutaServidor.'/'.$HostNombre.'/plugins/modal/busquedaModal.php';
		?>

	</body>
</html>
