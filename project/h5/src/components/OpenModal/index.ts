import type { ModalOptions } from './types'
import { createVNode, render } from 'vue'
import Modal from './index.vue'

const instances: HTMLElement[] = []

export function createModal(config: ModalOptions) {
  const { content, style, title, id, onClose, onConfirm, data } = config

  if (id && document.getElementById(`_openModal${id}`)) return

  const container = document.createElement('div')

  id && (container.id = `_openModal${id}`)

  let vnode = null
  if (typeof content === 'string') {
    vnode = createVNode(Modal, {
      style,
      title,
      data,
      onConfirm: confirm,
      onClose: close,
    }, { default: () => content })
  }
  else {
    vnode = createVNode(Modal, {
      content,
      style,
      title,
      data,
      onConfirm: confirm,
      onClose: close,
    })
  }

  // vnode.appContext = window._context

  render(vnode, container)
  document.body.appendChild(container as HTMLElement)

  instances.push(container)

  // console.log(instances)

  function confirm(v) {
    onConfirm && onConfirm(v)
  }

  function close() {
    vnode.component.props.show = false
    // document.body.removeChild(container as HTMLElement)
    // instances.shift()

    onClose && onClose()
  }

  function open(data: any) {
    vnode.component.props.show = true
    vnode.component.props.data = data
  }

  return {
    close,
    open,
  }
}
