<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Matches your database connection file

try {
    // Using u.fullName to perfectly match your users table schema
   $sql = "SELECT 
            b.id, 
            b.ticket_token, 
            u.fullName AS customer_name, 
            b.tour_name, 
            b.tour_date, 
            b.arrival_method, 
            b.price, 
            b.status
        FROM bookings b
        INNER JOIN users u ON b.user_id = u.id
        ORDER BY b.id DESC";

    $result = $conn->query($sql);
    $bookings = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
    }

    echo json_encode($bookings);

} catch (Exception $e) {
    echo json_encode(["error" => "Server exception: " . $e->getMessage()]);
}

$conn->close();
?>