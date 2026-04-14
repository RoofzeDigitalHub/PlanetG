<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Only POST requests are allowed.',
    ]);
    exit;
}

$cleanField = static function (string $value): string {
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return filter_var($value, FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW) ?: '';
};

$name = $cleanField((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = $cleanField((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$website = trim((string) ($_POST['website'] ?? ''));

if ($website !== '') {
    echo json_encode([
        'ok' => true,
        'message' => 'Thanks! Your message has been received.',
    ]);
    exit;
}

$errors = [];

if ($name === '' || mb_strlen($name) < 2) {
    $errors['name'] = 'Please enter your name.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if ($phone === '' || !preg_match('/^[0-9+\-\s()]{7,20}$/', $phone)) {
    $errors['phone'] = 'Please enter a valid phone number.';
}

if ($message === '' || mb_strlen(trim($message)) < 10) {
    $errors['message'] = 'Please enter a message with at least 10 characters.';
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'message' => 'Please check the highlighted fields and try again.',
        'errors' => $errors,
    ]);
    exit;
}

$recipient = 'ankit306600@gmail.com';
$subject = sprintf('PlanetG contact enquiry from %s', $name);
$fromAddress = trim((string) ini_get('sendmail_from'));

if ($fromAddress === '') {
    $fromAddress = 'admin@planetg.local';
}

$safeReplyTo = str_replace(["\r", "\n"], '', $email);
$safeMessage = trim(str_replace("\r\n", "\n", $message));

$bodyLines = [
    'A new contact form enquiry was submitted on the PlanetG website.',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . $phone,
    '',
    'Message:',
    $safeMessage,
    '',
    'Submitted at: ' . date('Y-m-d H:i:s'),
    'Source: ' . ((isset($_SERVER['HTTP_HOST']) ? 'http://' . $_SERVER['HTTP_HOST'] : 'PlanetG website')),
];

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: PlanetG Website <' . $fromAddress . '>',
    'Reply-To: ' . $safeReplyTo,
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($recipient, $encodedSubject, implode("\r\n", $bodyLines), implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Message submit ho gaya, lekin is server par outgoing mail abhi configured nahi hai. PHP SMTP/sendmail setup ke baad email delivery start ho jayegi.',
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'message' => 'Thanks! Your message has been sent successfully.',
]);
