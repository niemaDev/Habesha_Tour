<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "habesha_tour_db";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data)) {
    $fullName = $conn->real_escape_string($data['fullName']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (fullName, email, password) VALUES ('$fullName', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        http_response_code(201);
        echo json_encode(["message" => "Registration successful!"]);
    } else {
        if ($conn->errno === 1062) {
            http_response_code(400);
            echo json_encode(["error" => "This email is already registered."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $conn->error]);
        }
    }
}
$conn->close();
?>