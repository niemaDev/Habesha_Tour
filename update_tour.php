<?php
// Force error reporting to be quiet to avoid corrupting JSON output stream
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'db.php';

// Catch raw execution errors cleanly
function sendJsonError($message) {
    echo json_encode(["success" => false, "message" => $message]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    sendJsonError("Invalid JSON input payload received.");
}

if (!empty($data->id) && !empty($data->tour_name)) {
    $id = intval($data->id);
    $tour_name = $data->tour_name;
    $description = isset($data->description) ? $data->description : "";
    $price = floatval($data->price);
    $region = isset($data->region) ? $data->region : "N/A";
    $duration = isset($data->duration) ? $data->duration : "N/A";
    $capacity = intval($data->capacity);

    $query = "UPDATE tours SET tour_name = ?, description = ?, price = ?, region = ?, duration = ?, capacity = ? WHERE id = ?";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        sendJsonError("SQL Prepare Failed: " . $conn->error);
    }
    
    // Explicitly binding with double validated typed structures (ssdssii)
    $stmt->bind_param("ssdssii", $tour_name, $description, $price, $region, $duration, $capacity, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Tour updated successfully."]);
    } else {
        sendJsonError("Database Execute Fail: " . $stmt->error);
    }
    $stmt->close();
} else {
    sendJsonError("Incomplete data details provided for the update payload.");
}
?>