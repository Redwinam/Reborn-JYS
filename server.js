const express = require("express");
const app = express();

// 添加CORS中间件
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://jys.wtf");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
