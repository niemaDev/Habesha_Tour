<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'db.php';

function sendResponse($success, $message) {
    echo json_encode(["success" => $success, "message" => $message]);
    exit();
}

// Intercept raw payload body context data
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    sendResponse(false, "No form input data received.");
}

// 1. EXTRACTION & SANITIZATION
$first_name = isset($data->first_name) ? trim($data->first_name) : '';
$last_name = isset($data->last_name) ? trim($data->last_name) : '';
$email = isset($data->email) ? trim($data->email) : '';
$phone = isset($data->phone) ? trim($data->phone) : '';
$message = isset($data->message) ? trim($data->message) : '';
$captcha_answer = isset($data->captcha_answer) ? intval($data->captcha_answer) : null;

// 2. INPUT VALIDATION
if (empty($first_name) || empty($last_name) || empty($email) || empty($phone) || empty($message)) {
    sendResponse(false, "Please fill out all required fields.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Please provide a valid email address.");
}

// 3. CAPTCHA MATH VERIFICATION (Checks if 3 + 1 === 4)
if ($captcha_answer !== 4) {
    sendResponse(false, "Human verification failed. Please check your math answer.");
}

// 4. PREPARED SQL STATEMENT INJECTION PROTECTION
$query = "INSERT INTO contact_messages (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if (!$stmt) {
    sendResponse(false, "System SQL configuration error: " . $conn->error);
}

$stmt->bind_param("sssss", $first_name, $last_name, $email, $phone, $message);

if ($stmt->execute()) {
    sendResponse(true, "Thank you! Your message has been sent successfully.");
} else {
    sendResponse(false, "Failed to deliver message: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>