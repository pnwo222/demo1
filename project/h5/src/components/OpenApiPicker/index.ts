import type { OpenApiPickerOptions } from './types'
import { createVNode, render } from 'vue'
import OpenApiPicker from './index.vue'

const instances: HTMLElement[] = []

function createOpenApiPicker(config: OpenApiPickerOptions) {
  const {
    value,
    field,
    showLabelField,
    id,
    props,
    api,
    labelField,
    valueField,
    resultField,
    showSearch,
    autoFetch,
    searchKeyField,
    filter,
    emptyText,
    requiredSearchKeyword,
    formatData,
    onClose,
    onConfirm,
    onReady,
    onSearch,
  } = config || {}

  if (id && document.getElementById(`_OpenApiPicker${id}`)) return

  const container = document.createElement('div')

  id && (container.id = `_OpenApiPicker${id}`)

  let vnode = null
  vnode = createVNode(OpenApiPicker, {
    value,
    field,
    api,
    props,
    labelField,
    valueField,
    resultField,
    showSearch,
    autoFetch,
    searchKeyField,
    showLabelField,
    filter,
    emptyText,
    formatData,
    requiredSearchKeyword,
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
      value.value[field] = v.selectedValues[0]
      showLabelField && (value.value[showLabelField] = v.selectedOptions[0].text)
    }
    else {
      value[field] = v.selectedValues[0]
      showLabelField && (value[showLabelField] = v.selectedOptions[0].text)
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

export function createApiPicker(params?: OpenApiPickerOptions) {
  return createOpenApiPicker(params)
}

export function openApiPicker(params?: OpenApiPickerOptions) {
  const { open } = createOpenApiPicker(params)
  open()
}
