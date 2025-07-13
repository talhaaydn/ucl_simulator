<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ApiResponse
{
    public static function success($data = null, ?string $message = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], Response::HTTP_OK);
    }
    
    public static function created($data = null, string $message = 'Created successfully'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], Response::HTTP_CREATED);
    }
    
    public static function error(string $message = 'An error occurred', int $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR, $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data' => $data,
            'message' => $message
        ], $statusCode);
    }
} 