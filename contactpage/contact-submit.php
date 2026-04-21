<?php

header('Content-Type: application/json');
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// 👉 form data lo
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

// 👉 basic validation
if (!$name || !$email || !$phone || !$message) {
    echo json_encode([
        "status"=>"error",
        "message"=>"All fields are required!"
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'roofzedigitalhub@gmail.com';
    $mail->Password = 'nxnw xotg qrhn abtw'; // ✅ app password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // 👉 sender & receiver
    $mail->setFrom('roofzedigitalhub@gmail.com', 'PlanetG');
    $mail->addAddress($email);

    // 👉 subject me name add karo
    $mail->Subject = "New Contact Form - $name";

    // 👉 EMAIL BODY (dynamic)
    $mail->Body = "
    You received a new message:

    Name: $name
    Email: $email
    Phone: $phone

    Message:
    $message
    ";

    // 👉 HTML format (optional but better)
    $mail->isHTML(true);
    $mail->Body = "
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> $name</p>
        <p><b>Email:</b> $email</p>
        <p><b>Phone:</b> $phone</p>
        <p><b>Message:</b><br>$message</p>
    ";

    $mail->send();

     header("Location: /planetG/contactpage/CP_contactF/success.html");
     exit; 

} catch (Exception $e) {

    header("Location: error.html");
    exit;
}