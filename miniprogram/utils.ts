import CryptoJS from 'crypto-js';

export const generateUUID = (): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
const getKey = () => {
  let key = '';
  for (let index = 0; index < 8; index++) {
    key += generateUUID().replace(/-/g, '');
  }
  return key;
};
// 解密
export const decrypt = (text: string, keyBase: string, ivBase: string) => {
  const key = CryptoJS.enc.Utf8.parse(keyBase);
  const iv = CryptoJS.enc.Utf8.parse(ivBase);
  const encryptedHexStr = CryptoJS.enc.Hex.parse(text);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    hasher: CryptoJS.algo.SHA256,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};
// 加密
export const encrypt = (text: string) => {
  const keyBase = getKey();
  const ivBase = getKey();
  const key = CryptoJS.enc.Utf8.parse(keyBase);
  const iv = CryptoJS.enc.Utf8.parse(ivBase);
  const srcs = CryptoJS.enc.Utf8.parse(text);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    hasher: CryptoJS.algo.SHA256,
  });
  return {
    keyBase,
    ivBase,
    text: encrypted.ciphertext.toString().toUpperCase(),
  };
};
