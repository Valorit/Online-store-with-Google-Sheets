<?php 

$data = file_get_contents('php://input');
$data = json_decode($data, true);
var_dump($data);

//сообщение
$message .= 'Name: '.$data['name'];
$message .= 'Phone: '.$data['phone'];
$message .= '>>>>>>>>>>';
foreach ($data['cart'] as $key => $value) {
  $message .= 'id: '.$key;
  $message .= ' count: '.$value;
  $message .= '----------';
}

//отправка
$mail = mail($data['email'], 'Shop', $message);
if($mail){
  echo 'yes';
} else {
  echo 'no';
}

?>