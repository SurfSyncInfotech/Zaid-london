<?php
/**
 * Contact Form Submission Handler
 * -------------------------------
 * This file handles the contact form submission.
 * It validates required fields and returns JSON response.
 */

header('Content-Type: application/json');

// Helper function to sanitize input
function sanitize($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

// Required fields
$requiredFields = [
    'first-name',
    'last-name',
    'email',
    'phone'
];

$errors = [];
$data   = [];

// Validate required fields
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = $field . ' is required';
    } else {
        $data[$field] = sanitize($_POST[$field]);
    }
}

// Validate email format
if (!empty($_POST['email']) && !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

// Optional message
$data['message'] = isset($_POST['message']) 
    ? sanitize($_POST['message']) 
    : '';

// If validation fails
if (!empty($errors)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Validation failed',
        'errors'  => $errors
    ]);
    exit;
}

// =======================
// SUCCESS PROCESS
// =======================
// Example: save to database / send email
// mail(...);

echo json_encode([
    'status'  => 'success',
    'message' => 'Contact form submitted successfully'
]);
