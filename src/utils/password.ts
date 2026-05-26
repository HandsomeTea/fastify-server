import type { BinaryToTextEncoding } from 'node:crypto';
import crypto from 'node:crypto';

/**
 * randomBy
 *
 * @param {number} charsCount 要生成字符串的长度
 * @param {string} alphabet 随机来源数据，如：从123123123中随机抽取组成一个字符串
 * @returns {string}
 */
export const randomBy = (charsCount: number, alphabet: string): string => {
    const digits = [];

    for (let i = 0; i < charsCount; i++) {
        digits[i] = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return digits.join('');
};
export const randomString = () => crypto.randomBytes(24).toString('hex').substring(0, 24);
export const sha256 = (string: string, encode: BinaryToTextEncoding = 'hex'): string => crypto.createHash('sha256').update(string).digest(encode);

/**
 * 明文密码加密
 *
 * @param {string} password 明文密码
 * @returns
 */
export const passwordEncrypted = (password: string) => {
    const hashPwd = sha256(password, 'hex');
    const randomStr = randomBy(10, '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz');

    return sha256(`${hashPwd}${randomStr}`) + randomStr;
};

export const passwordVerify = (password: string, encryptedPwd: string) => {
    const hashPwd = sha256(password, 'hex');
    const randomStr = encryptedPwd.split('').reverse().splice(0, 10).reverse().join('');

    return sha256(`${hashPwd}${randomStr}`) + randomStr === encryptedPwd;
};
