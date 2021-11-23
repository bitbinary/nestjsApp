export const tokenConfig = () => {
  const secret = process.env.TOKEN_SECRET;
  const signOptions = { expiresIn: '60s' };
  return { secret, signOptions };
};
