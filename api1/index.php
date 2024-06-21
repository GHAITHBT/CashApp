<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db.php';

// Helper function to get input data
function get_input_data() {
    return json_decode(file_get_contents('php://input'), true);
}

// Route handling
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

switch ($request_method) {
    case 'POST':
        if (strpos($request_uri, '/api/transactions') !== false) {
            add_transaction();
        }
        break;
    case 'GET':
        if (strpos($request_uri, '/api/transactions') !== false) {
            get_transactions();
        }
        break;
    default:
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

// Function to add a transaction
function add_transaction() {
    global $conn;
    $data = get_input_data();
    $articles = $data['articles'];
    $paidAmount = $data['paidAmount'];
    $totalAmount = $data['totalAmount'];
    $changeAmount = $paidAmount - $totalAmount;
    $transactionDate = date('Y-m-d H:i:s');

    $query = "INSERT INTO transactions (paid_amount, total_amount, change_amount, transaction_date) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ddds', $paidAmount, $totalAmount, $changeAmount, $transactionDate);

    if ($stmt->execute()) {
        $transactionId = $stmt->insert_id;
        $articleValues = [];
        foreach ($articles as $article) {
            $articleValues[] = "($transactionId, '{$article['barcode']}', '{$article['price']}', '{$article['quantity']}')";
        }
        $articleQuery = "INSERT INTO articles (transaction_id, barcode, price, quantity) VALUES " . implode(', ', $articleValues);
        $conn->query($articleQuery);
        echo json_encode(['changeAmount' => $changeAmount]);
    } else {
        echo json_encode(['error' => 'Failed to save transaction']);
    }
}

// Function to get transactions
function get_transactions() {
    global $conn;
    $query = "
        SELECT t.id AS transaction_id, t.paid_amount, t.total_amount, t.change_amount, t.transaction_date,
               a.id AS article_id, a.barcode, a.price, a.quantity
        FROM transactions t
        LEFT JOIN articles a ON t.id = a.transaction_id
        ORDER BY t.transaction_date DESC
    ";
    $result = $conn->query($query);
    $transactions = [];

    while ($row = $result->fetch_assoc()) {
        $transactionId = $row['transaction_id'];
        if (!isset($transactions[$transactionId])) {
            $transactions[$transactionId] = [
                'transaction_id' => $row['transaction_id'],
                'paid_amount' => $row['paid_amount'],
                'total_amount' => $row['total_amount'],
                'change_amount' => $row['change_amount'],
                'transaction_date' => $row['transaction_date'],
                'articles' => []
            ];
        }
        $transactions[$transactionId]['articles'][] = [
            'article_id' => $row['article_id'],
            'barcode' => $row['barcode'],
            'price' => $row['price'],
            'quantity' => $row['quantity']
        ];
    }

    echo json_encode(array_values($transactions));
}
?>
