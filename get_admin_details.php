<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    $sql = "SELECT name, role FROM users WHERE id = $id AND role = 'Admin'";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Admin not found"]);
    }
}
?>