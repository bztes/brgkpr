export function randomPassword(length = 16) {
  const availableChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const cryptoArray = new Uint32Array(length);
  crypto.getRandomValues(cryptoArray);

  return Array.from(cryptoArray, (x) => availableChars[x % availableChars.length]).join('');
}
