import { useJump } from '@/hooks/system/useJump'
import { useHistory } from '../modules/history/hooks'

const { jump } = useJump()

export function useSearch() {
  const form = ref({
    type: 'title',
    name: '',
    _type: '题名',
  })

  const { save } = useHistory()

  function search(name?: string, type?: string) {
    if (name) {
      form.value.name = name
    }
    if (type) {
      form.value.type = type
    }
    save(form.value.name, form.value.type)

    jump(`/book/list?searchWord=${form.value.name}&searchFiled=${form.value.type}`)
  }

  return {
    form,
    search,
  }
}
