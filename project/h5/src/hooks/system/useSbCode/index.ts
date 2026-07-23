import QRCode from 'qrcode'
import { getSbQrCode } from '@/api/user/user'
import sbLogo from '@/assets/image/code/sb-logo.png'

export function useSbCode({
  autoFetch,
  red,
}: {
  autoFetch?: boolean
  red?: boolean
} = { autoFetch: true }) {
  const qrCode = ref('')
  const loading = ref(false)
  const isError = ref(false)

  // console.log('展示红码', red)

  async function createQrDataUrlWithLogo(data: string, logoSrc: string) {
    return new Promise<string>((resolve, reject) => {
      const size = 300
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size

      QRCode.toCanvas(
        canvas,
        data,
        {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: size,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (err) => {
          if (err) {
            reject(err)
            return
          }

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(canvas.toDataURL('image/png'))
            return
          }

          const logoImage = new Image()
          logoImage.crossOrigin = 'anonymous'
          logoImage.onload = () => {
            const logoSize = Math.floor(size * 0.18)
            const x = Math.floor((size - logoSize) / 2)
            const y = Math.floor((size - logoSize) / 2)
            ctx.drawImage(logoImage, x, y, logoSize, logoSize)

            resolve(canvas.toDataURL('image/png'))
          }
          logoImage.onerror = () => {
            resolve(canvas.toDataURL('image/png'))
          }
          logoImage.src = logoSrc
        },
      )
    })
  }

  async function refresh() {
    if (loading.value) return
    loading.value = true
    qrCode.value = ''

    await getSbQrCode().then((res) => {
      if (res.qrCode) {
        qrCode.value = res.qrCode
        isError.value = false

        createQrDataUrlWithLogo(res.qrCode, sbLogo)
          .then((url) => {
            loading.value = false
            qrCode.value = url
          })
          .catch(() => {
            loading.value = false
            isError.value = true
          })
      }
      else {
        qrCode.value = ''
        isError.value = true
      }
    }).catch(() => {
      loading.value = false
      isError.value = true
    })
  }

  if (autoFetch) {
    refresh()
  }

  return {
    refresh,
    qrCode,
    loading,
    isError,
  }
}
