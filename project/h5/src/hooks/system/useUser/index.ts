import type { ComputedRef } from 'vue'
import type { IUserInfoExtends } from '@/store/modules/user-types'
import { ykt } from 'icard-jssdk'
import { UserIdentityType } from '@/api/user/enums'
import { check } from '@/api/user/user'
import { getLocalStorage, useStorage } from '@/hooks/system/useStorage'
import { useUserStoreWithOut } from '@/store/modules/user'
import { requireImage } from '@/utils/require'

export const identityTypeMap = {
  [UserIdentityType.VISITOR]: '访客',
  [UserIdentityType.NEW_STUDENT]: '新生',
  [UserIdentityType.CURRENT_STUDENT]: '在校生',
  [UserIdentityType.ALUMNI]: '校友',
  [UserIdentityType.TEACHER]: '教职工',
}

/** 0封存 1正常 2挂失 3应用锁定 4临时挂失 9注销 */
export const aluActivatedStatusMap = {
  1: '正常',
  2: '挂失',
  3: '应用锁定',
  4: '临时挂失',
  9: '注销',
}

/** 用户信息 */
export function useUserInfo(): {
  /** 用户信息 */
  userInfo: ComputedRef<IUserInfoExtends | null>
  /** 是否是访客 */
  isVisitor: ComputedRef<boolean>
  /** 是否是新生 */
  isNewStudent: ComputedRef<boolean>
  /** 是否是在校生 */
  isCurrentStudent: ComputedRef<boolean>
  /** 是否是校友 */
  isAlumni: ComputedRef<boolean>
  /** 是否是教职工 */
  isTeacher: ComputedRef<boolean>
  /** 是否绑定了社保卡 */
  hasSbCard: ComputedRef<boolean>
  /** 是否是社保三代卡 */
  is3Card: ComputedRef<boolean>
  /** 是否已激活 */
  isActivated: ComputedRef<boolean>
  userStore: any

  checkUser: () => void
} {
  const userStore = useUserStoreWithOut()

  const userInfo = computed(() => userStore.userInfo)

  // const isHomeCheck = computed(() => userInfo.value?.isHomeCheck)

  const isVisitor = computed(() => userInfo.value?.identityType === UserIdentityType.VISITOR || !userInfo.value?.identityType)

  const isNewStudent = computed(() => userInfo.value?.identityType === UserIdentityType.NEW_STUDENT)

  const isCurrentStudent = computed(() => userInfo.value?.identityType === UserIdentityType.CURRENT_STUDENT)

  const isAlumni = computed(() => userInfo.value?.identityType === UserIdentityType.ALUMNI)

  const isTeacher = computed(() => userInfo.value?.identityType === UserIdentityType.TEACHER)

  const hasSbCard = computed(() => !!userInfo.value?.aac002)

  const isActivated = computed(() => userInfo.value?.aluActivatedStatus === '1' || userInfo.value?.stuActivatedStatus === '1' || userInfo.value?.teaActivatedStatus === '1')

  const is3Card = computed(() => {
    return userInfo.value?.aaz508?.startsWith('3')
  })

  function checkUser() {
    if (isActivated.value || isVisitor.value) {
      return
    }

    check().then((res) => {
      if (res.msg === '1') {
        userStore.fetchUserInfo()
      }
    })
  }

  return {
    userInfo,
    isVisitor,
    isNewStudent,
    isCurrentStudent,
    isAlumni,
    isTeacher,
    hasSbCard,
    is3Card,

    userStore,
    isActivated,
    checkUser,
  }
}

export function useAvatar() {
  const { userInfo } = useUserInfo()

  // const url = userInfo.value.avatar

  // const avatar = ref(requireImage('image/tx/male_default.png'))
  // if (!url) {
  //   if (userInfo.value.gender?.includes('女')) {
  //     avatar.value = requireImage('image/tx/female_default.png')
  //   }
  // }
  // else if (url.includes('mine_header_')) {
  //   avatar.value = requireImage(`image/tx/${url}.png`)
  // }
  // else {
  //   avatar.value = url
  // }

  // console.log('avatar', avatar)

  const avatar = getLocalStorage('avatar', requireImage('image/tx/male_default.png'))

  if (userInfo.value.gender?.includes('女')) {
    avatar.value = requireImage('image/tx/female_default.png')
  }

  // 从app获取头像
  ykt.getUserInfo({
    clientId: 'd044731c937a4e60b46ac0ea39b0e907',
  }).then((res) => {
    if (res && res.headIconUrl) avatar.value = requireImage(`image/tx/${res.headIconUrl}.png`)
  })

  return {
    avatar,
  }
}
