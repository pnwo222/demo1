import { useSbCode } from '@/hooks/system/useSbCode'

const time = ref(60 * 1000)
const { qrCode, refresh, loading, isError } = useSbCode({
  autoFetch: true,
})
export function useCode() {
  return {
    qrCode,
    refresh,
    loading,
    isError,
    time,
  }
}
