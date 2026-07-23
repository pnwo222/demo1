import { decrypt, encrypt } from 'crypto-js/aes'
import UTF8, { parse } from 'crypto-js/enc-utf8'
import ECB from 'crypto-js/mode-ecb'
import pkcs7 from 'crypto-js/pad-pkcs7'

export interface EncryptionParams {
  key: string
  iv: string
}

export class AesEncryption {
  private key
  private iv

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt
    if (key)
      this.key = parse(key)

    if (iv)
      this.iv = parse(iv)
  }

  get getOptions() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv,
    }
  }

  /** AES 加密 */
  encryptByAES(cipherText: string) {
    return encrypt(cipherText, this.key, this.getOptions).toString()
  }

  /** base64 解密 */
  decryptByAES(cipherText: string) {
    return decrypt(cipherText, this.key, this.getOptions).toString(UTF8)
  }
}
