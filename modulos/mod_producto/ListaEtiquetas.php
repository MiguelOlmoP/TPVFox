<!DOCTYPE html>
<html>
    <head>
	<?php
	include './../../head.php';
	include './funciones.php';
	include ("./../../plugins/paginacion/paginacion.php");
	include ("./../../controllers/Controladores.php");
	include ("./clases/ClaseProductos.php");
	echo '<pre>';
	print_r($_SESSION['productos']);
	echo '</pre>';
	?>
	<script src="<?php echo $HostNombre; ?>/modulos/mod_producto/funciones.js"></script>
    <script src="<?php echo $HostNombre; ?>/controllers/global.js"></script> 
		</head>

<body>
        <?php
        include './../../header.php';
        ?>
       
	<div class="container">
		<div class="row">
			<div class="col-md-12 text-center">
				<h2> Etiquetas: Imprimir etiquetas del producto </h2>
			</div>
			<form action="" method="post" name="formProducto" onkeypress="return anular(event)">
			<div class="col-sm-2">
				<a class="text-ritght" href="./ListaProductos.php">Volver Atrás</a>
				<br><br>
				Selecciona el tamaño: 
				<select  name="tamanhos">
					<option value="a9">A9</option>
					<option value="a5">A5</option>
					<option value="a7">A7</option>
				</select>
				<br><br>
				<input type="submit" value="Imprimir">
				
				
			</div>
			<div class="col-md-10">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>ID</th>
						<th>PRODUCTO</th>
						<th>P.V.P</th>
						<th>ELIMINAR</th>
					</tr>
				</thead>
				<tbody>
				<?php
					foreach($_SESSION['productos'] as $producto){
					echo '<tr><td>
					'.$producto.'
					</td>
					
					
					</tr>';
					}
				?>
				</tbody>
			</table>
			</div>
			</form>
		</div>
		 </div>
		
</body>
</html>
