<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['user_id']) && isset($data['tour_name'])) {
    $user_id   = $conn->real_escape_string($data['user_id']);
    $tour_name = $conn->real_escape_string($data['tour_name']);
    $tour_date = $conn->real_escape_string($data['tour_date']);
    $price     = $conn->real_escape_string($data['price']);
    $image_url = $conn->real_escape_string($data['image_url']);

    // Matching your table columns: user_id, tour_name, tour_date, price, status, image_url
    $sql = "INSERT INTO bookings (user_id, tour_name, tour_date, price, status, image_url) 
            VALUES ('$user_id', '$tour_name', '$tour_date', '$price', 'Pending', '$image_url')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Booking confirmed!"]);
    } else {
        echo json_encode(["success" => false, "message" => "SQL Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing required booking data."]);
}

$conn->close();
?>