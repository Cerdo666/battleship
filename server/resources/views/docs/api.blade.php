<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battleship Game API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 40px;
        }

        .section h2 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }

        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            gap: 15px;
        }

        .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.9em;
            color: white;
        }

        .method.get {
            background: #28a745;
        }

        .method.post {
            background: #007bff;
        }

        .method.put {
            background: #ffc107;
        }

        .method.delete {
            background: #dc3545;
        }

        .endpoint-url {
            font-family: 'Courier New', monospace;
            font-size: 1.05em;
            color: #333;
            flex: 1;
        }

        .endpoint-desc {
            color: #666;
            margin-bottom: 15px;
            font-size: 0.95em;
        }

        .endpoint-details {
            font-size: 0.9em;
        }

        .endpoint-details p {
            margin-bottom: 8px;
            color: #555;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.85em;
            font-weight: bold;
            margin-left: 10px;
        }

        .badge.public {
            background: #d4edda;
            color: #155724;
        }

        .badge.private {
            background: #f8d7da;
            color: #721c24;
        }

        .code-block {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            margin-top: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #ddd;
        }

        .base-url {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
        }

        .base-url strong {
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚓ Battleship Game API</h1>
            <p>Complete API Documentation</p>
        </div>

        <div class="content">
            <div class="base-url">
                <strong>Base URL:</strong> {{ $baseUrl }}
            </div>

            <!-- PUBLIC ENDPOINTS -->
            <div class="section">
                <h2>📤 Public Endpoints</h2>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/status</span>
                        <span class="badge public">PUBLIC</span>
                    </div>
                    <p class="endpoint-desc">Health check endpoint</p>
                    <div class="endpoint-details">
                        <p><strong>Response:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"status": "ok",<br>
&nbsp;&nbsp;"app": "Battleship Game API",<br>
&nbsp;&nbsp;"version": "1.0"<br>
}
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-url">/register</span>
                        <span class="badge public">PUBLIC</span>
                    </div>
                    <p class="endpoint-desc">Register a new user</p>
                    <div class="endpoint-details">
                        <p><strong>Request Body:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"name": "string",<br>
&nbsp;&nbsp;"email": "string",<br>
&nbsp;&nbsp;"password": "string"<br>
}
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-url">/login</span>
                        <span class="badge public">PUBLIC</span>
                    </div>
                    <p class="endpoint-desc">Login and get authentication token</p>
                    <div class="endpoint-details">
                        <p><strong>Request Body:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"email": "string",<br>
&nbsp;&nbsp;"password": "string"<br>
}
                        </div>
                        <p style="margin-top: 15px;"><strong>Response:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"token": "sanctum_token",<br>
&nbsp;&nbsp;"user": { ... }<br>
}
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/ranking</span>
                        <span class="badge public">PUBLIC</span>
                    </div>
                    <p class="endpoint-desc">Get top 10 players ranking (players with points > 0)</p>
                </div>
            </div>

            <!-- PRIVATE ENDPOINTS -->
            <div class="section">
                <h2>🔒 Private Endpoints</h2>
                <p style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 4px; color: #856404;">
                    <strong>⚠️ Authentication Required:</strong> All endpoints in this section require the header:<br>
                    <code style="background: #ffeaa7; padding: 2px 6px; border-radius: 2px;">Authorization: Bearer {token}</code>
                </p>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-url">/logout</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Logout the current user</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/profile</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Get current user profile information</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method put">PUT</span>
                        <span class="endpoint-url">/change-password</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Change user password</p>
                    <div class="endpoint-details">
                        <p><strong>Request Body:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"current_password": "string",<br>
&nbsp;&nbsp;"new_password": "string",<br>
&nbsp;&nbsp;"new_password_confirmation": "string"<br>
}
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-url">/game/start</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Start a new game</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-url">/game/shoot</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Make a shot during a game</p>
                    <div class="endpoint-details">
                        <p><strong>Request Body:</strong></p>
                        <div class="code-block">
{<br>
&nbsp;&nbsp;"x": number,<br>
&nbsp;&nbsp;"y": number<br>
}
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method delete">DELETE</span>
                        <span class="endpoint-url">/game/abandon</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Abandon the current game</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-url">/game/state</span>
                        <span class="badge private">PRIVATE</span>
                    </div>
                    <p class="endpoint-desc">Get the current game state</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Battleship Game API v1.0 | Last updated: March 3, 2026</p>
        </div>
    </div>
</body>
</html>
