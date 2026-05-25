<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'db.php'; // Ensure your database connection setup is included

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $id = $data->id;

    $query = "DELETE FROM tours WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Tour deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Unable to delete tour. Database error."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Unable to delete tour. Data is incomplete."]);
}
?>