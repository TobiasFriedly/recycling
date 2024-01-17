<?php



$host = 'localhost';  
$db   = '110018_7_1';
$user = '110018_7_1';
$pass = 'kENVZlYdr0hK';
$charset = 'utf8mb4';


$playerName = $_POST['playerName'];
$playerScore = $_POST['playerScore'];


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


$sql = "INSERT INTO scores (name, score) VALUES (?, ?)";
$stmt= $pdo->prepare($sql);
$stmt->execute([$playerName, $playerScore]);

echo "Score submitted successfully!";
?>
