<?php
// Start session
session_start();

// Database configuration
$host = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "your_database_name"; // Replace with your actual DB name

// Create connection
$conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$email = $_POST['email'];
$password = $_POST['password'];

// Escape inputs to prevent SQL injection
$email = $conn->real_escape_string($email);
$password = $conn->real_escape_string($password);

// Query to check if user exists
$sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $_SESSION['email'] = $email;
    echo "Login successful!";
    header("Location: dashboard.php");
    exit();
} else {
    echo "Invalid email or password.";
    header(" Location: create.html");
}

$conn->close();
?>
