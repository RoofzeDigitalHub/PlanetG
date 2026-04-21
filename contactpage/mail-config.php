<?php

use PHPMailer\PHPMailer\PHPMailer;

require dirname(__DIR__) . '/vendor/autoload.php';

/*
 | SMTP username/password hamesha sender Gmail ke honge.
 | Form me visitor ka name/email alag se aata hai aur body + reply-to me use hota hai.
 | Final mail is inbox par aayegi: to_email
 */
$config = [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'username' => 'roofzedigitalhub@gmail.com',
    'password' => 'dcoq mxpv nfgd',
    'from_email' => 'roofzedigitalhub@gmail.com',
    'from_name' => 'PlanetG Website',
    'to_email' => 'roofzedigitalhub@gmail.com',
    'to_name' => 'PlanetG',
];

$mail = new PHPMailer(true);

/* Debug off by default; raise it only while troubleshooting SMTP. */
$mail->SMTPDebug = 0;
$mail->Debugoutput = 'html';

/* SMTP SETTINGS */
$mail->isSMTP();
$mail->Host = $config['host'];
$mail->SMTPAuth = true;
$mail->Username = $config['username'];
$mail->Password = $config['host'] === 'smtp.gmail.com'
    ? str_replace(' ', '', $config['password'])
    : $config['password'];

/* SECURITY */
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = $config['port'];

/* BASIC */
$mail->isHTML(false);
$mail->CharSet = 'UTF-8';

return [
    'mail' => $mail,
    'config' => $config,
];
