<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "habesha_tour_db";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data)) {
    $email = $data['email'];
    $password = $data['password'];

    // Use Prepared Statements to prevent SQL Injection
    $stmt = $conn->prepare("SELECT id, fullName, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify the hashed password from the database
        if (password_verify($password, $user['password'])) {
            // Success! Return user info including the ID for the Dashboard
            echo json_encode([
                "message" => "Login successful!",
                "user" => [
                    "id" => $user['id'], // Crucial for Dashboard database queries
                    "fullName" => $user['fullName'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid password."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User account not found."]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request data."]);
}

$conn->close();
?>