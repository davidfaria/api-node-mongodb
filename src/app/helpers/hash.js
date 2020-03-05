import base64 from 'base-64';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

const randomHash = (length = 30) => {
  return randomBytes(length).toString('hex');
};

const generateBcryptHash = async (password, length = 8) => {
  return await bcrypt.hash(password, length);
};

const compareBcryptHash = async (password, passsword_hash) => {
  return await bcrypt.compare(password, passsword_hash);
};

const btoa = value => {
  if (!value) return value;
  return base64.encode(value);
};

const atob = value => {
  if (!value) return value;
  return base64.decode(value);
};

export { randomHash, generateBcryptHash, compareBcryptHash, btoa, atob };
