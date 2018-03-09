<?php
// Clase base de pedidos

class ClaseCompras
{
	public $db; //(Objeto) Es la conexion;

	
	public function __construct($conexion){
		$this->db = $conexion;

	}
	
	public function htmlPendientes(){
		
	}
	
	
	public function sumarIvaBases($from_where){
		//Función para sumar los ivas de un pedido
		$db=$this->db;
		$smt=$db->query('select sum(importeIva ) as importeIva , sum(totalbase) as  totalbase '.$from_where);
		if ($result = $smt->fetch_assoc () ){
			$sumaIvasBases=$result;
		}
		return $sumaIvasBases;
	}
	public function SelectUnResult($tabla, $where){
		$db=$this->db;
		$smt=$db->query('SELECT * from '.$tabla.' where '.$where);
		if ($result = $smt->fetch_assoc () ){
			$pedido=$result;
		}
		return $pedido;
	}
	public function SelectVariosResult($tabla, $where){
		$db=$this->db;
		$smt=$db->query('SELECT * from '.$tabla.' where '.$where);
		$pedidosPrincipal=array();
		while ( $result = $smt->fetch_assoc () ) {
			array_push($pedidosPrincipal,$result);
		}
		return $pedidosPrincipal;
	}
}
?>
