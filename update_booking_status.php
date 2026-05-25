<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['booking_id']) && isset($data['status'])) {
    $booking_id = $data['booking_id'];
    $status = $data['status'];

    try {
        $sql = "UPDATE bookings SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $booking_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Status updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to update status."]);
        }
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(["error" => "Server exception: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid inputs received."]);
}

$conn->close();
?>