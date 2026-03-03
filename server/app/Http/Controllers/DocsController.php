<?php

namespace App\Http\Controllers;

class DocsController extends Controller
{
    public function index()
    {
        return response()->view('docs.api', [
            'baseUrl' => config('app.url') . '/api',
        ], 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
}
