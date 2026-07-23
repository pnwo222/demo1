<script setup lang='ts'>
import { UserIdentityType } from '@/api/user/enums'
import { createApiPicker } from '@/components/OpenApiPicker'
import { getLocalStorage, useStorage } from '@/hooks/system/useStorage'
import { identityTypeMap, useUserInfo } from '@/hooks/system/useUser'

const { userInfo } = useUserInfo()

const form = getLocalStorage<any>('userTypeForm', {
  userType: userInfo.value.identityType,
  _userType: identityTypeMap[userInfo.value.identityType],
})

const { open } = createApiPicker({
  value: form,
  field: 'userType',
  showLabelField: '_userType',
  props: {
    title: '选择当前身份',
    columns: [
      {
        text: '访客',
        value: UserIdentityType.VISITOR,
      },
      {
        text: '新生',
        value: UserIdentityType.NEW_STUDENT,
      },
      {
        text: '在校生',
        value: UserIdentityType.CURRENT_STUDENT,
      },
      {
        text: '校友',
        value: UserIdentityType.ALUMNI,
      },
      {
        text: '教职工',
        value: UserIdentityType.TEACHER,
      },
    ] as { text: string, value: UserIdentityType }[],
  },
  onConfirm: (value) => {
    userInfo.value.identityType = value.selectedValues[0] as UserIdentityType
  },
})

function clears() {
  useStorage.ls.remove('userTypeForm')
  location.reload()
}
</script>

<template>
  <div class="index text-12 ">
    <a class="color-red underline" @click="open">
      方便自测 当前身份:({{ form._userType }})
    </a>

    <a class="color-red underline ml-20" @click="clears">
      重置
    </a>
  </div>
</template>

<style scoped lang='less'>
  .index {
    width: 100%;

  }
</style>
