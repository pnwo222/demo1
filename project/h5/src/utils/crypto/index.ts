import Base64 from 'crypto-js/enc-base64'
import Hex from 'crypto-js/enc-hex'
import UTF8 from 'crypto-js/enc-utf8'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import md5 from 'crypto-js/md5'
import { encryptionSetting, hmacSHA256Key } from '@/setting/encryptionSetting'
import { getRandom } from '../index'
import { AesEncryption } from './aes'

const { key, iv } = encryptionSetting

/** AES */
export const encryption = new AesEncryption({ key, iv })

/** AES 加密 */
export function encryptByAES(cipherText: string) {
  return encryption.encryptByAES(cipherText)
}

/** AES 解密 */
export function decryptByAES(cipherText: string) {
  return encryption.decryptByAES(cipherText)
}

/** base64 加密 */
export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

/** base64 解密 */
export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

/** md5 加密 */
export function encryptByMd5(password: string) {
  return md5(password).toString()
}

/** HmacSHA256 验签， 自行修改 */
export function encryptByHmacSHA256() {
  const key = hmacSHA256Key
  const nonce = getRandom(8)
  const ts = String(new Date().getTime()).substring(0, 10)

  return {
    sign: Hex.stringify(HmacSHA256(key + nonce + ts, key)),
    key: hmacSHA256Key,
    nonce,
    ts,
  }
}
