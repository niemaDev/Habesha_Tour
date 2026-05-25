<?php
// Clear any previous output buffers
ob_clean();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 1. Check if db.php exists
if (!file_exists('db.php')) {
    echo json_encode(["error" => "db.php file is missing in the backend folder"]);
    exit;
}

include 'db.php'; 

// 2. Check if $conn is actually defined in db.php
if (!isset($conn)) {
    echo json_encode(["error" => "Database connection variable (\$conn) not found in db.php"]);
    exit;
}

// 3. Execute Query
$query = "SELECT * FROM tours ORDER BY id DESC";
$result = $conn->query($query);

if ($result) {
    $tours = [];
    while ($row = $result->fetch_assoc()) {
        $tours[] = $row;
    }
    // Success: Output the JSON
    echo json_encode($tours);
} else {
    // Failure: Output the specific SQL error
    echo json_encode(["error" => "SQL Query Failed: " . $conn->error]);
}

$conn->close();
?>