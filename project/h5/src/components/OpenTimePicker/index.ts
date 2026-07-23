import type { OpenTimePickerOptions } from './types'
import { createVNode, render } from 'vue'
import OpenTimePicker from './index.vue'

const instances: HTMLElement[] = []

function createOpenTimePicker(config: OpenTimePickerOptions) {
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

  if (id && document.getElementById(`_OpenTimePicker${id}`)) return

  const container = document.createElement('div')

  id && (container.id = `_OpenTimePicker${id}`)

  let vnode = null
  vnode = createVNode(OpenTimePicker, {
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
      value.value[field] = `${v.selectedValues[0]}:${v.selectedValues[1]}`
      // showLabelField && (value.value[showLabelField] = v.selectedOptions[0].text)
    }
    else {
      value[field] = `${v.selectedValues[0]}:${v.selectedValues[1]}`
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

export function createTimePicker(params?: OpenTimePickerOptions) {
  return createOpenTimePicker(params)
}

export function openTimePicker(params?: OpenTimePickerOptions) {
  const { open } = createOpenTimePicker(params)
  open()
}
