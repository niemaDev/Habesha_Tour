<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "habesha_tour_db";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data['userId'];
$fullName = $data['fullName'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// 1. Verify current password first
$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($currentPassword, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
    exit;
}

// 2. Prepare Update Query
if (!empty($newPassword)) {
    // Updating both name and password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateSql = "UPDATE users SET fullName = ?, password = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ssi", $fullName, $hashedPassword, $userId);
} else {
    // Updating only name
    $updateSql = "UPDATE users SET fullName = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("si", $fullName, $userId);
}

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$conn->close();
?>