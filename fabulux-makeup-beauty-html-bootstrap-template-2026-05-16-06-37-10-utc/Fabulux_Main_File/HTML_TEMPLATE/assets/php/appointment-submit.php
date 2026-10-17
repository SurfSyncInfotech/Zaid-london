<?php
/**
 * Appointment Form Submission Handler
 * -----------------------------------
 * This file handles the appointment form submission.
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
    'telephone',
    'treatment'
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
    'message' => 'Appointment form submitted successfully'
]);
