<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

if($id) {
    $stmt = $conn->prepare("SELECT * FROM tours WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Tour not found"]);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid ID"]);
}
$conn->close();
?>