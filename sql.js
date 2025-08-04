// app.js
const mysql = require("mysql2");

// Create connection
const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});

// Connect
connection.connect((err) => {
  if (err) {
    return console.error("❌ Error connecting: " + err.stack);
  }
  console.log("✅ Connected as ID " + connection.threadId);

  // Simple SELECT query
  connection.query("SHOW TABLES", (err, results, fields) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      return;
    }

    console.log("📦 Query Results:", results);

    // Close connection
    connection.end();
  });
});
