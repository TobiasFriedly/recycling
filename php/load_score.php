<?php

$host = 'localhost';  
$db   = '110018_7_1';
$user = '110018_7_1';
$pass = 'kENVZlYdr0hK';
$charset = 'utf8mb4';


$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}


$sql = "SELECT name, score FROM scores ORDER BY score DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$scores = $stmt->fetchAll();


header('Content-Type: application/json');
echo json_encode($scores);
?>
