import type { OpenDatePickerOptions } from './types'
import { createVNode, render } from 'vue'
import OpenDatePicker from './index.vue'

const instances: HTMLElement[] = []

function createOpenDatePicker(config: OpenDatePickerOptions) {
  const {
    value,
    field,
    id,
    props,
    type,
    formatData,
    onClose,
    onConfirm,
    onReady,
    onSearch,
  } = config || {}

  if (id && document.getElementById(`_OpenDatePicker${id}`)) return

  const container = document.createElement('div')

  id && (container.id = `_OpenDatePicker${id}`)

  let vnode = null
  vnode = createVNode(OpenDatePicker, {
    value,
    field,
    type,
    props,
    formatData,
    onClose: close,
    onConfirm: confirm,
    onReady: ready,
    onSearch,
  })

  // vnode.appContext = window._context

  render(vnode, container)
  document.body.appendChild(container as HTMLElement)

  instances.push(container)

  function close() {
    vnode.component.props.show = false
    // document.body.removeChild(container as HTMLElement)
    // instances.shift()

    onClose && onClose()
  }

  function open() {
    vnode.component.props.show = true
  }

  function confirm(v) {
    if (value?.value) {
      value.value[field] = `${v.selectedValues[0]}-${v.selectedValues[1]}-${v.selectedValues[2]}`
      // showLabelField && (value.value[showLabelField] = v.selectedOptions[0].text)
    }
    else {
      value[field] = `${v.selectedValues[0]}-${v.selectedValues[1]}-${v.selectedValues[2]}`
      // showLabelField && (value[showLabelField] = v.selectedOptions[0].text)
    }

    onConfirm && onConfirm(v)
  }

  function ready(v) {
    onReady && onReady(v)
  }

  return {
    open,
    vnode,
  }
}

export function createDatePicker(params?: OpenDatePickerOptions) {
  return createOpenDatePicker(params)
}

export function openDatePicker(params?: OpenDatePickerOptions) {
  const { open } = createOpenDatePicker(params)
  open()
}
