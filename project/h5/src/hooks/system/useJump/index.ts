import { ykt } from 'icard-jssdk'
import router from '@/router'
import { isPath, isUrl } from '@/utils/is'

export function useJump() {
  const jump = (path: string, type?: string) => {
    if (isUrl(path)) {
      if (type === 'tab') {
        if (ykt.isIcard()) {
          ykt.openLink({
            url: path,
          })
        }
        else {
          location.href = path
        }
      }
      else {
        location.href = path
      }
    }
    else if (isPath(path)) {
      router.push(path)
    }
  }

  return {
    jump,
  }
}
