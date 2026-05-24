const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwt();

  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  };

  const publicUser = user.toPublic ? user.toPublic() : user;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: publicUser,
    });
};

module.exports = sendTokenResponse;
