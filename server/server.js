const app = require('./app');

const PORT = process.env.PORT || 5050;

// get ip address command: ipconfig getifaddr en0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});