<?php 
//~ require_once('../lib/tcpdf/tcpdf.php');
//~ include ('../clases/imprimir.php');

$pdf = new imprimir(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$cabecera="";
$pdf->SetMargins(3, 10,3, false);
$pdf->setHtmlHeader($cabecera);
$pdf->AddPage();
$style = array(
    'position' => '',
    'align' => 'L',
    'stretch' => false,
    'fitwidth' => true,
    'cellfitalign' => '',
    'border' => false,
    'hpadding' => 'auto',
    'vpadding' => 'auto',
    'fgcolor' => array(0,0,0),
    'bgcolor' => false, //array(255,255,255),
    'text' => true,
    'font' => 'helvetica',
    'fontsize' => 8,
    'stretchtext' => 4
);


$style['cellfitalign'] = 'L';
$i=0;
$cont=0;
$pdf->SetFont('helvetica', '', 9);
foreach($lotes as $lote){
	$etiquetas=$CEtiquetado->datosLote($lote);
	$productos=$etiquetas['productos'];
	$productos=json_decode($productos, true);
	foreach($productos as $producto){
		if($i==2){
			$i=0;
		}
			$x = $pdf->GetX();
            $y = $pdf->GetY();
           
           $texto1='Lote: '.$lote.'  Fecha Env: '.$etiquetas['fecha_env'];
           $texto2='<br><br>'.$producto['nombre'].'<br> '.'Fecha cad: '.$etiquetas['fecha_cad'].' <br> Precio: '.$producto['precio'];
            $pdf->write1DBarcode($producto['codBarras'], 'EAN13', '', $y+3, 105, 18, 0.4, $style, 'M');
            $pdf->SetXY($x,$y);
			$pdf->MultiCell(55, 34.3, $texto1, 0, 'L', 0, 0, '', '', true, 0, false, true, 45 ,'M');
			$pdf->MultiCell(50, 34.3, $texto2, 0, 'L', 0, 0, '', '', true, 0, true, true, 45 ,'M');
		if($i==1){
			$pdf->Ln();
		}
		$cont++;
		$i++;
		if($cont==16){
			$pdf->AddPage();
			$cont=0;
		}
		
	}
}
$pdf->Output($RutaServidor.$rutatmp.'/'.$nombreTmp, 'F');
?>
