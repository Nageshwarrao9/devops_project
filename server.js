const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello! Node.js application deployed successfully using Jenkins CI/CD.");
});

app.get("/about", (req, res) => {
    res.send("This is a DevOps CI/CD lab project using Jenkins.");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Application is running"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;