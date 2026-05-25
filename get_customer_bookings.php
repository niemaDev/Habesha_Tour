<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Matches your database connection file

// Check if user_id is passed via URL query parameter (e.g., ?user_id=4)
if (!isset($_GET['user_id'])) {
    echo json_encode(["error" => "Missing user_id parameter"]);
    exit();
}

$user_id = $_GET['user_id'];

try {
    // Included b.arrival_method to match your exact database column setup
    $sql = "SELECT 
                b.id, 
                b.ticket_token, 
                b.tour_name, 
                b.price, 
                b.image_url, 
                b.tour_date, 
                b.status,
                b.arrival_method,
                t.airport_pickup, 
                t.bus_pickup, 
                t.guide_contact
            FROM bookings b
            INNER JOIN tours t ON b.tour_name = t.tour_name
            WHERE b.user_id = ?
            ORDER BY b.id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
    }

    echo json_encode($bookings);
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(["error" => "Server exception: " . $e->getMessage()]);
}

$conn->close();
?>