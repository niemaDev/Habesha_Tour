<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include 'db.php'; // Ensure this points to your database connection file

// Read incoming JSON payload from React frontend
$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['user_id']) && 
    isset($data['tour_name']) && 
    (isset($data['booking_date']) || isset($data['tour_date'])) && 
    (isset($data['total_price']) || isset($data['price']))
) {
    // Standardize mapping fields depending on frontend key variations
    $user_id = $data['user_id'];
    $tour_name = $data['tour_name'];
    $tour_date = isset($data['booking_date']) ? $data['booking_date'] : $data['tour_date'];
    $price = isset($data['total_price']) ? $data['total_price'] : $data['price'];
    $image_url = isset($data['image_url']) ? $data['image_url'] : 'default.jpg';

    // 1. Grab arrival_method from React payload. Falls back to 'Not Specified' if omitted.
    $arrival_method = isset($data['arrival_method']) ? $data['arrival_method'] : 'Not Specified';

    // 2. Auto-generate uniform ticket tokens (Example output: HT-SIMIE-A3C9)
    $clean_slug = strtoupper(substr(preg_replace("/[^A-Za-z0-9]/", "", $tour_name), 0, 5));
    $random_suffix = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
    $ticket_token = "HT-" . $clean_slug . "-" . $random_suffix;

    // 3. Status set to Pending by default until admin approves/confirms it
    $status = 'Pending';

    try {
        // 4. Secure Prepared Statement Query Scheme
        $sql = "INSERT INTO bookings (ticket_token, user_id, tour_name, tour_date, arrival_method, price, status, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        
        // Parameter Types Mapping: 
        // s = ticket_token, i = user_id, s = tour_name, s = tour_date, s = arrival_method, d = price, s = status, s = image_url
        $stmt->bind_param("sisssdss", $ticket_token, $user_id, $tour_name, $tour_date, $arrival_method, $price, $status, $image_url);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Booking saved successfully!",
                "ticket_token" => $ticket_token
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "error" => "Failed to write database entry: " . $stmt->error
            ]);
        }
        $stmt->close();

    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Server execution error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Incomplete request body data received."
    ]);
}

$conn->close();
?>