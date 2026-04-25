// Simple health check handler - no dependencies
module.exports = (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
};
