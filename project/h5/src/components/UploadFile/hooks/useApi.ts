import { useUpload } from '@/hooks/system/useUpload'

// 上传图片
export function fileRead(FILE) {
  const { file } = FILE
  FILE.status = 'uploading'
  FILE.message = '上传中'

  const { url } = useUpload({
    file,
    onLoading(e) {
      if (e.progress === 1) {
        FILE.message = '加载中'
      }
      else {
        FILE.message = `上传中 ${(e.progress * 100).toFixed(0)}%`
      }
    },
    onSuccess({ url, result }) {
      FILE.status = 'done'
      FILE.message = '上传成功'
      FILE.url = url
      console.log('[上传成功]', result)
    },
    onFail() {
      FILE.status = 'failed'
      FILE.message = '上传失败'
    },
  })

  return {
    url,
  }
}
