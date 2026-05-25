<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

// Added WHERE role = 'customer' to filter the results
$sql = "SELECT id, fullName, email, role FROM users WHERE role = 'customer'"; 
$result = $conn->query($sql);

$users = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode($users);
} else {
    echo json_encode(["error" => "Query failed: " . $conn->error]);
}
?>