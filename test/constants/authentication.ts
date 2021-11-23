//   Login process e2e Testing correct login details sample
export const CORRECT_LOGIN = { username: 'amel', password: 'password' };

//   Login process e2e Testing incorrect login details sample
export const INCORRECT_LOGIN = { username: 'amel', password: 'passwor' };

//   Login process e2e Testing correct login result
export const LOGIN_SUCCESS_RESPONSE = {
  token: expect.any(String),
  success: true,
};

//   Login process e2e Testing incorrect login result
export const LOGIN_FAILURE_RESPONSE = {
  success: false,
  message: expect.any(String),
};

//   Fake user details for testing
export const FAKEUSER = {
  _id: { $oid: 'oid' },
  uid: 'uid',
  username: 'amel',
  password: 'password',
  lockAttemptCount: 0,
  token: 'token',
  createdAt: Date.now(),
  lockExpiry: Date.now(),
  __v: 0,
};

//   Fake but correct login details
export const USERIDENTIFIER = { username: 'amel', password: 'password' };

//   Fake but incorrect login details
export const INCORRECT_USERIDENTIFIER = {
  username: 'testincorrect',
  password: 'incorrectpassword',
};
