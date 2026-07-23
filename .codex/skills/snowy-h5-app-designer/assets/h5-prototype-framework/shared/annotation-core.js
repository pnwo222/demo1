(function () {
  const STORAGE_KEY = 'snowy-shared-prototype-annotations-v1'
  const ownSelector = '.annotation-toolbar,.node-comment-outline,.node-comment-pin,.node-comment-mask,.node-comment-popover,.annotation-modal-mask,.annotation-detail-modal,.requirement-drawer'
  const icons = {
    collapse: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 14l5-5 5 5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h8M6 12h12M9 18h6" stroke-width="2" stroke-linecap="round"/></svg>',
    comment: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5A2.5 2.5 0 0 1 16.5 15H12l-4 4v-4h-.5A2.5 2.5 0 0 1 5 12.5v-5Z" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 9h7M8.5 11.5H13" stroke-width="1.8" stroke-linecap="round"/></svg>',
    requirement: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3.5h8l4 4V20H6V3.5Z" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h9l3 3v13H6V4Z" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 4v5h6V4M9 16h6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    delete: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5" stroke-width="2.4" stroke-linecap="round"/><path d="M6.5 10.5 12 5l5.5 5.5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  }
  let data
  let mode = false
  let collapsed = false
  let hoverTarget = null
  let selectedTarget = null
  let currentPage = 'home'
  let annotations = []
  let hiddenAutoIds = []
  let outline
  let toolbar
  let composer

  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

  function loadState() {
    const embedded = window.__H5_ANNOTATION_STATE__ || {}
    let local = {}
    try { local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch (_) {}
    const saved = local.annotations || embedded.annotations || []
    hiddenAutoIds = local.hiddenAutoIds || embedded.hiddenAutoIds || []
    data.pageRequirements = { ...(data.pageRequirements || {}), ...(embedded.pageRequirements || {}), ...(local.pageRequirements || {}) }
    annotations = (data.annotations || []).map(item => {
      const change = saved.find(row => row.id === item.id)
      return {
        ...item,
        baseline: { title: item.title, content: item.content, detail: item.detail || '' },
        ...(change || {})
      }
    })
    saved.filter(item => !item.automatic && !annotations.some(row => row.id === item.id)).forEach(item => annotations.push(item))
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotations, hiddenAutoIds, pageRequirements: data.pageRequirements }))
  }

  const pageScope = () => `page:${currentPage}`
  const isOwn = node => !node || node.closest(ownSelector)

  function targetKey(node) {
    if (node.dataset.annotationKey) return node.dataset.annotationKey
    const parts = []
    let cursor = node
    while (cursor && cursor !== document.body && parts.length < 6) {
      if (cursor.dataset && cursor.dataset.annotationKey) return `${cursor.dataset.annotationKey}/${parts.reverse().join('/')}`.replace(/\/$/, '')
      const siblings = cursor.parentElement ? Array.from(cursor.parentElement.children).filter(item => item.tagName === cursor.tagName) : []
      parts.push(`${cursor.tagName.toLowerCase()}:${Math.max(0, siblings.indexOf(cursor))}`)
      cursor = cursor.parentElement
    }
    return parts.reverse().join('/')
  }

  function findTarget(key) {
    const exact = document.querySelector(`[data-annotation-key="${CSS.escape(key)}"]`)
    if (exact) return exact
    const pieces = key.split('/')
    const root = document.querySelector(`[data-annotation-key="${CSS.escape(pieces.shift())}"]`)
    if (!root) return null
    return pieces.reduce((node, piece) => {
      if (!node) return null
      const [tag, index] = piece.split(':')
      return Array.from(node.children).filter(item => item.tagName.toLowerCase() === tag)[Number(index)] || null
    }, root)
  }

  const isVisible = item => !hiddenAutoIds.includes(item.id) && (item.scope === 'global' || item.scope === pageScope())

  function updateOutline(node, selected = false) {
    if (!node || isOwn(node)) {
      outline.hidden = true
      return
    }
    const rect = node.getBoundingClientRect()
    const left = Math.max(0, rect.left)
    const top = Math.max(0, rect.top)
    const right = Math.min(innerWidth, rect.right)
    const bottom = Math.min(innerHeight, rect.bottom)
    outline.hidden = false
    outline.classList.toggle('selected', selected)
    Object.assign(outline.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.max(0, right - left)}px`,
      height: `${Math.max(0, bottom - top)}px`
    })
  }

  function renderPins() {
    document.querySelectorAll('.node-comment-pin').forEach(node => node.remove())
    annotations.filter(isVisible).forEach(item => {
      const target = findTarget(item.targetKey)
      if (!target) return
      const rect = target.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return
      const pin = document.createElement('button')
      pin.className = `node-comment-pin${item.automatic ? ' automatic' : ''}`
      pin.type = 'button'
      pin.textContent = item.index
      pin.title = item.title
      pin.style.left = `${Math.max(4, Math.min(innerWidth - 34, rect.right - 32))}px`
      pin.style.top = `${Math.max(4, Math.min(innerHeight - 34, rect.top + 4))}px`
      pin.addEventListener('click', event => {
        event.stopPropagation()
        openDetail(item)
      })
      document.body.appendChild(pin)
    })
  }

  function renderToolbar() {
    toolbar.classList.toggle('collapsed', collapsed)
    toolbar.innerHTML = collapsed
      ? `<button class="annotation-tool-button icon-only" data-action="collapse" type="button" title="展开标注工具栏">${icons.expand}</button>`
      : `<button class="annotation-tool-button icon-only" data-action="collapse" type="button" title="隐藏标注工具栏">${icons.collapse}</button>
         <span class="annotation-tool-separator" aria-hidden="true"></span>
         <div class="annotation-tool-actions">
           <button class="annotation-tool-button annotation-tool-action${mode ? ' primary expanded' : ''}" data-action="toggle" type="button" title="${mode ? '关闭标注' : '开启标注'}">${icons.comment}<span class="annotation-tool-label">${mode ? '正在标注' : '开启标注'}</span></button>
           <button class="annotation-tool-button annotation-tool-action" data-action="requirements" type="button" title="查看和编辑当前页面整体需求">${icons.requirement}<span class="annotation-tool-label">页面需求</span></button>
           <button class="annotation-tool-button annotation-tool-action" data-action="save" type="button" title="另存为包含当前标注的 HTML">${icons.save}<span class="annotation-tool-label">另存为</span></button>
           <span class="annotation-tool-separator annotation-tool-danger-separator" aria-hidden="true"></span>
           <button class="annotation-tool-button annotation-tool-action danger" data-action="clear" type="button" title="删除当前页面全部用户标注和修改">${icons.delete}<span class="annotation-tool-label">全部删除</span></button>
         </div>`
    toolbar.querySelector('[data-action="collapse"]').addEventListener('click', () => {
      collapsed = !collapsed
      renderToolbar()
    })
    toolbar.querySelector('[data-action="toggle"]')?.addEventListener('click', () => setMode(!mode))
    toolbar.querySelector('[data-action="requirements"]')?.addEventListener('click', openRequirements)
    toolbar.querySelector('[data-action="save"]')?.addEventListener('click', exportHtml)
    toolbar.querySelector('[data-action="clear"]')?.addEventListener('click', resetPageAnnotations)
  }

  function setMode(next) {
    mode = next
    document.body.classList.toggle('annotation-cursor-mode', mode)
    renderToolbar()
    if (!mode) clearSelection()
  }

  function clearSelection() {
    hoverTarget = null
    selectedTarget = null
    outline.hidden = true
    composer?.remove()
    composer = null
    document.querySelector('.node-comment-mask')?.remove()
  }

  function positionFloating(node, x, y, width, height) {
    node.style.left = `${Math.max(12, Math.min(innerWidth - width - 12, x))}px`
    node.style.top = `${Math.max(58, Math.min(innerHeight - height - 12, y + 10))}px`
  }

  function openComposer(x, y) {
    document.querySelector('.node-comment-mask')?.remove()
    const mask = document.createElement('div')
    mask.className = 'node-comment-mask'
    mask.addEventListener('click', clearSelection)
    composer = document.createElement('div')
    composer.className = 'node-comment-popover'
    composer.innerHTML = `<div class="node-comment-input">
      <button class="node-comment-cancel" type="button" title="取消评论">${icons.close}</button>
      <textarea rows="1" placeholder="添加评论..."></textarea>
      <button class="node-comment-submit" type="button" disabled title="请输入注释内容">${icons.send}</button>
    </div>`
    positionFloating(composer, x, y, Math.min(360, innerWidth - 24), 68)
    const input = composer.querySelector('textarea')
    const send = composer.querySelector('.node-comment-submit')
    composer.querySelector('.node-comment-cancel').addEventListener('click', clearSelection)
    input.addEventListener('keydown', event => event.stopPropagation())
    input.addEventListener('input', () => {
      input.style.height = 'auto'
      input.style.height = `${Math.min(112, input.scrollHeight)}px`
      composer.classList.toggle('multiline', input.scrollHeight > 38 || input.value.includes('\n'))
      send.disabled = !input.value.trim()
      send.classList.toggle('ready', Boolean(input.value.trim()))
      send.title = input.value.trim() ? '添加注释' : '请输入注释内容'
    })
    send.addEventListener('click', () => {
      if (!input.value.trim() || !selectedTarget) return
      const scope = selectedTarget.closest('[data-page-id]') ? pageScope() : 'global'
      annotations.push({
        id: `user-${Date.now()}`,
        index: Math.max(0, ...annotations.map(item => Number(item.index) || 0)) + 1,
        scope,
        pageId: scope === 'global' ? '' : currentPage,
        targetKey: targetKey(selectedTarget),
        title: '注释',
        content: input.value.trim(),
        detail: '',
        source: 'user',
        automatic: false
      })
      persist()
      clearSelection()
      renderPins()
    })
    document.body.append(mask, composer)
    input.focus()
  }

  function editableBlock(field, value, muted = false) {
    return `<div class="annotation-editable${muted ? ' muted' : ''}" data-field="${field}">
      <span>${escapeHtml(value)}</span>
      <button class="annotation-edit-action" type="button" title="编辑">${icons.edit}</button>
    </div>`
  }

  function openDetail(item) {
    const snapshot = JSON.stringify({ title: item.title || '注释', content: item.content || '', detail: item.detail || '' })
    const mask = document.createElement('div')
    mask.className = 'annotation-modal-mask'
    const dialog = document.createElement('section')
    dialog.className = 'annotation-detail-modal'
    dialog.innerHTML = `<header><strong>注释 ${item.index}</strong><button class="modal-close" type="button">${icons.close}</button></header>
      <div class="annotation-detail-view">
        <div class="annotation-detail-title">${editableBlock('title', item.title || '注释')}</div>
        ${editableBlock('content', item.content || '')}
        ${item.detail ? editableBlock('detail', item.detail, true) : ''}
      </div>
      <footer class="annotation-modal-footer"><button class="danger-button" type="button">删除</button><div class="annotation-modal-actions"><button class="cancel-button" type="button">取消</button><button class="primary-button save-button" type="button" hidden>保存</button></div></footer>`
    const close = () => { mask.remove(); dialog.remove() }
    const current = () => ({
      title: dialog.querySelector('[data-field="title"] input')?.value ?? dialog.querySelector('[data-field="title"] span')?.textContent ?? '',
      content: dialog.querySelector('[data-field="content"] textarea')?.value ?? dialog.querySelector('[data-field="content"] span')?.textContent ?? '',
      detail: dialog.querySelector('[data-field="detail"] textarea')?.value ?? dialog.querySelector('[data-field="detail"] span')?.textContent ?? ''
    })
    const updateDirty = () => { dialog.querySelector('.save-button').hidden = JSON.stringify(current()) === snapshot }
    dialog.querySelectorAll('.annotation-edit-action').forEach(button => {
      button.addEventListener('click', () => {
        const block = button.closest('.annotation-editable')
        const field = block.dataset.field
        const value = block.querySelector('span').textContent
        block.innerHTML = field === 'title'
          ? `<input value="${escapeHtml(value)}">`
          : `<textarea rows="${field === 'detail' ? 4 : 3}">${escapeHtml(value)}</textarea>`
        const input = block.querySelector('input,textarea')
        input.addEventListener('input', updateDirty)
        input.focus()
      })
    })
    mask.addEventListener('click', close)
    dialog.querySelector('.modal-close').addEventListener('click', close)
    dialog.querySelector('.cancel-button').addEventListener('click', close)
    dialog.querySelector('.save-button').addEventListener('click', () => {
      Object.assign(item, current())
      persist()
      close()
    })
    dialog.querySelector('.danger-button').addEventListener('click', () => {
      if (item.automatic) {
        const changed = item.baseline && (item.title !== item.baseline.title || item.content !== item.baseline.content || (item.detail || '') !== item.baseline.detail)
        if (changed) Object.assign(item, item.baseline)
        else hiddenAutoIds.push(item.id)
      } else annotations = annotations.filter(row => row.id !== item.id)
      persist()
      close()
      renderPins()
    })
    document.body.append(mask, dialog)
  }

  function openRequirements() {
    const original = data.pageRequirements[currentPage] || ''
    const mask = document.createElement('div')
    mask.className = 'annotation-modal-mask'
    const drawer = document.createElement('aside')
    drawer.className = 'requirement-drawer'
    drawer.innerHTML = `<header><strong>页面需求</strong><button class="modal-close" type="button">${icons.close}</button></header>
      <div class="requirement-body">${editableBlock('requirement', original)}</div>
      <footer><button class="cancel-button" type="button">取消</button><button class="primary-button save-button" type="button" hidden>保存</button></footer>`
    const close = () => { mask.remove(); drawer.remove() }
    mask.addEventListener('click', close)
    drawer.querySelector('.modal-close').addEventListener('click', close)
    drawer.querySelector('.cancel-button').addEventListener('click', close)
    drawer.querySelector('.annotation-edit-action').addEventListener('click', event => {
      const block = event.currentTarget.closest('.annotation-editable')
      block.innerHTML = `<textarea rows="12">${escapeHtml(original)}</textarea>`
      const input = block.querySelector('textarea')
      input.addEventListener('input', () => { drawer.querySelector('.save-button').hidden = input.value === original })
      input.focus()
    })
    drawer.querySelector('.save-button').addEventListener('click', () => {
      data.pageRequirements[currentPage] = drawer.querySelector('textarea').value
      persist()
      close()
    })
    document.body.append(mask, drawer)
  }

  function resetPageAnnotations() {
    annotations = annotations.filter(item => item.automatic || item.scope !== pageScope()).map(item => {
      if (item.scope === pageScope() && item.automatic && item.baseline) return { ...item, ...item.baseline }
      return item
    })
    hiddenAutoIds = hiddenAutoIds.filter(id => !annotations.some(item => item.id === id && item.scope === pageScope()))
    persist()
    renderPins()
  }

  function exportHtml() {
    const clone = document.documentElement.cloneNode(true)
    clone.querySelectorAll(ownSelector).forEach(node => node.remove())
    const state = document.createElement('script')
    state.textContent = `window.__H5_ANNOTATION_STATE__=${JSON.stringify({ annotations, hiddenAutoIds, pageRequirements: data.pageRequirements }).replace(/</g, '\\u003c')};`
    clone.querySelector('head').appendChild(state)
    const blob = new Blob([`<!doctype html>\n${clone.outerHTML}`], { type: 'text/html;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'h5-prototype-annotated.html'
    link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }

  function capture(event) {
    if (!mode || isOwn(event.target)) return
    if (['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'dblclick', 'contextmenu'].includes(event.type)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.type === 'click') {
        selectedTarget = event.target
        updateOutline(selectedTarget, true)
        openComposer(event.clientX, event.clientY)
      }
    }
  }

  function init(input) {
    data = input
    currentPage = data.currentPage || 'home'
    loadState()
    outline = document.createElement('div')
    outline.className = 'node-comment-outline'
    outline.hidden = true
    toolbar = document.createElement('nav')
    toolbar.className = 'annotation-toolbar'
    document.body.append(outline, toolbar)
    renderToolbar()
    document.addEventListener('pointermove', event => {
      if (!mode || composer || isOwn(event.target)) return
      hoverTarget = event.target
      updateOutline(hoverTarget)
    }, true)
    ;['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'dblclick', 'contextmenu'].forEach(type => document.addEventListener(type, capture, true))
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMode(false)
    })
    window.addEventListener('scroll', () => {
      if (mode && hoverTarget) updateOutline(hoverTarget, selectedTarget === hoverTarget)
      renderPins()
    }, true)
    window.addEventListener('resize', renderPins)
    window.addEventListener('h5-prototype-page-change', event => {
      currentPage = event.detail.pageId
      clearSelection()
      requestAnimationFrame(renderPins)
    })
    requestAnimationFrame(renderPins)
  }

  window.H5AnnotationRuntime = { init }
})()
