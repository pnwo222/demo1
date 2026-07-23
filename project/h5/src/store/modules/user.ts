import type { IUserInfoExtends } from './user-types'
import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user/user'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { PageEnum } from '@/enums/pageEnum'
import { useStorage } from '@/hooks/system/useStorage'
import { identityTypeMap } from '@/hooks/system/useUser'
import router from '@/router'
import { store } from '@/store'
import { maskIdCard, maskName, maskPhone } from '@/utils'

interface UserState {
  userInfo: IUserInfoExtends | null
  token?: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
  }),
  getters: {
    getUserInfo(state) {
      return state.userInfo
    },
    getToken(state): string {
      return state.token
    },
  },
  actions: {
    setToken(token: string) {
      useStorage.ls.set(TOKEN_KEY, token, null, `${useStorage.ls.get('openId')}_`)
      this.token = token
    },
    /** 登出 */
    async loginOut() {
      if (!import.meta.env.DEV) {
        useStorage.ls.clear()
        useStorage.ss.clear()
        location.href = `${import.meta.env.VITE_API_REDIRECT}?openId=${`${useStorage.ls.get('openId')}`}`
      }

      // useStorage.ls.clear()
      // useStorage.ss.clear()
      // router.push(PageEnum.BASE_LOGIN)
    },
    /** 获取用户信息 */
    async fetchUserInfo() {
      try {
        const data = await getUserInfo() as IUserInfoExtends

        if (data.identityType === '3') {
          data.stuNo = data.aluNo
          data.stuCollegeName = data.aluCollege
          data.stuMajorName = data.aluMajor
          data.stuClassName = data.aluClass
          data.stuActivatedStatus = data.aluActivatedStatus
        }

        data.realPhone = data.phone || data.account
        data.realName = data.name

        data.name = maskName(data.name)
        data.phone = maskPhone(data.realPhone)
        data.account = maskPhone(data.account)
        data.idCardNumber = maskIdCard(data.idCardNumber)

        if (data.stuNo) {
          data.year = data.stuNo.slice(0, 4)
        }

        if (data.teaNo) {
          data.tYear = data.teaNo.slice(0, 4)
        }

        // data.teaActivatedStatus = '0'
        // data.identityType = '0'
        // data.aac002 = ''

        // if (useStorage.ls.get('userTypeForm')) {
        //   data.identityType = useStorage.ls.get('userTypeForm').userType
        // }

        if ([1, 2, 3, 4].includes(Number(data.identityType))) {
          data.isCheck = true
        }

        console.log('[当前身份]:', data.identityType, identityTypeMap[data.identityType])
        console.log('[用户信息]:', data)

        this.userInfo = data
        return Promise.resolve(data)
      }
      catch (error) {
        if (error.cause?.code === 401) {
          this.loginOut()
        }
        return Promise.reject(error)
      }
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
