<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");
include 'db.php';

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Safety: Don't let users delete themselves via this simple panel if they are logged in
    // You can add session checks here later.
    
    $sql = "DELETE FROM users WHERE id = $id";
    
    if($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
}
?>