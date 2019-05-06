<?php 

//сообщение
$message = "New buy!";

//отправка
$mail = mail('valor220@gmail.com', 'Shop', $message);
if($mail){
  echo 'no';
}

?>