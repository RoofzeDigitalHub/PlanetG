<?php

header('Content-Type: application/json; charset=utf-8');

// Handle preflight if any
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation: Name, email, and message are required. Phone is optional.
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Please fill in all required fields (Name, Email, Message)."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Please enter a valid email address."
    ]);
    exit;
}

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server mailer configuration error. Please contact us directly."
    ]);
    exit;
}

require $autoloadPath;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'roofzedigitalhub@gmail.com';
    $mail->Password = 'nxnw xotg qrhn abtw'; // app password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Sender & recipient: Enquiries reach office@planetg.co.in
    $mail->setFrom('roofzedigitalhub@gmail.com', 'Planet G Website');
    $mail->addAddress('office@planetg.co.in', 'Planet G Office');
    $mail->addReplyTo($email, $name);

    $mail->Subject = "New Website Enquiry from $name";

    $mail->isHTML(true);
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safePhone = !empty($phone) ? htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') : 'Not provided';
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #333;'>
            <h2 style='color: #2f4a2f;'>New Website Enquiry - Planet G</h2>
            <hr style='border: 0; border-top: 1px solid #ddd;' />
            <p><strong>Name:</strong> {$safeName}</p>
            <p><strong>Email:</strong> <a href='mailto:{$safeEmail}'>{$safeEmail}</a></p>
            <p><strong>Phone:</strong> {$safePhone}</p>
            <p><strong>Message:</strong></p>
            <blockquote style='background: #f8faf6; padding: 12px 16px; border-left: 4px solid #2f4a2f; margin: 0;'>
                {$safeMessage}
            </blockquote>
        </div>
    ";

    $mail->AltBody = "Name: $name\nEmail: $email\nPhone: " . ($phone ?: 'Not provided') . "\nMessage:\n$message";

    $mail->send();

    echo json_encode([
        "status" => "success",
        "message" => "Thank you! Your enquiry has been submitted successfully."
    ]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Unable to submit your enquiry. Please try again."
    ]);
    exit;
}
