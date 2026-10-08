<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Email, and Message).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

$to = 'office@planetg.co.in';
$subject = 'New Consultation Inquiry from ' . $name . ' - Planet G';
$headers = "From: web-inquiry@planetg.co.in\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = "New Inquiry Details:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . (!empty($phone) ? $phone : 'Not provided') . "\n\n";
$body .= "Message:\n" . $message . "\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been received. Our team will contact you shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to send your message right now. Please call or WhatsApp us at +91 9879232854.'
    ]);
}
?>
