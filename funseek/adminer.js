const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// 提供一个Adminer访问页面
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Adminer - Database Management</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .info { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; }
            .btn { background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 5px; }
            .btn:hover { background-color: #3a5ce5; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Adminer Database Management</h1>
            <div class="info">
                <p><strong>Database Connection Info:</strong></p>
                <p><strong>Host:</strong> ${process.env.DB_HOST || 'localhost'}</p>
                <p><strong>Database:</strong> ${process.env.DB_NAME || 'funseek'}</p>
                <p><strong>Username:</strong> ${process.env.DB_USER || 'postgres'}</p>
                <p><strong>Password:</strong> ${process.env.DB_PASSWORD || 'postgres'}</p>
                <p><strong>Port:</strong> ${process.env.DB_PORT || '5432'}</p>
            </div>
            <p>Click the button below to access Adminer for database management:</p>
            <a href="https://www.adminer.org/" target="_blank" class="btn">Open Adminer</a>
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                Note: For security reasons, this application doesn't host Adminer directly. 
                You'll be redirected to the official Adminer website. Use the connection 
                details above to connect to your PostgreSQL database.
            </p>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Adminer helper server is running on port ${PORT}`);
});