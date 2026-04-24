// OTP Generator Utility
const generateOTP = () => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const calculateOTPExpiry = (minutes = 5) => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

const isOTPExpired = (expiryDate) => {
  const now = new Date();
  return new Date(expiryDate) < now;
};

module.exports = {
  generateOTP,
  calculateOTPExpiry,
  isOTPExpired
};
