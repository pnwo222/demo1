import type { IBalanceResponse } from '@/api/mine/index/balance-types'
import { getBalanceApi } from '@/api/mine/index'

export function useBalance({
  autoFetch = true,
}: {
  autoFetch?: boolean
} = {}) {
  const balance = ref<IBalanceResponse[]>()

  function getBalance() {
    getBalanceApi({}).then((res) => {
      balance.value = res.records
    })
  }

  if (autoFetch) {
    getBalance()
  }

  return {
    balance,
    getBalance,
  }
}
