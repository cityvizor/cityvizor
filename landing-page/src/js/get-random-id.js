export default function () {
  return getRandomString() + getRandomString();
}

function getRandomString() {
  const radix = 36;
  return Math.random().toString(radix).substring(2, 15);
}
