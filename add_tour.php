<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($conn)) {
    // These keys must match your React initialState
    $name = $conn->real_escape_string($data['name']);
    $region = $conn->real_escape_string($data['region']);
    $price = $data['price'];
    $duration = $conn->real_escape_string($data['duration']);
    $capacity = $data['capacity'];
    $description = $conn->real_escape_string($data['description']);
    $image = 'default.jpg'; // Placeholder

    // Use the NEW column names here
    $query = "INSERT INTO tours (tour_name, region, price, duration, capacity, description, image_url) 
              VALUES ('$name', '$region', '$price', '$duration', '$capacity', '$description', '$image')";

    if ($conn->query($query)) {
        echo json_encode(["success" => true, "message" => "Tour successfully created!"]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No data received"]);
}

if (isset($conn)) { $conn->close(); }
?>