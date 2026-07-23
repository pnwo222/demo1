(function () {
  const STORAGE_KEY = 'snowy-h5-prototype-annotations-v1'
  const ownSelector = '.h5-annotation-toolbar,.h5-annotation-outline,.h5-annotation-pin,.h5-comment-mask,.h5-comment-composer,.h5-annotation-dialog,.h5-requirement-drawer'
  let data
  let mode = false
  let hoverTarget = null
  let selectedTarget = null
  let currentPage = 'home'
  let annotations = []
  let hiddenAutoIds = []
  let outline
  let toolbar
  let composer

  function htmlEscape(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
  }

  function loadState() {
    const embedded = window.__H5_ANNOTATION_STATE__ || {}
    let local = {}
    try { local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch (_) {}
    const baseline = (data.annotations || []).map(item => ({ ...item, baseline: { title: item.title, content: item.content } }))
    const changes = local.annotations || embedded.annotations || []
    hiddenAutoIds = local.hiddenAutoIds || embedded.hiddenAutoIds || []
    annotations = baseline.map(item => changes.find(change => change.id === item.id) ? { ...item, ...changes.find(change => change.id === item.id) } : item)
    changes.filter(change => !change.automatic && !annotations.some(item => item.id === change.id)).forEach(change => annotations.push(change))
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotations, hiddenAutoIds, pageRequirements: data.pageRequirements }))
  }

  function pageScope() {
    return `page:${currentPage}`
  }

  function isOwn(node) {
    return !node || node.closest(ownSelector)
  }

  function targetKey(node) {
    if (node.dataset.annotationKey) return node.dataset.annotationKey
    const parts = []
    let cursor = node
    while (cursor && cursor !== document.body && parts.length < 5) {
      const key = cursor.dataset && cursor.dataset.annotationKey
      if (key) return `${key}/${parts.reverse().join('/')}`.replace(/\/$/, '')
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

  function visibleAnnotation(item) {
    return !hiddenAutoIds.includes(item.id) && (item.scope === 'global' || item.scope === pageScope())
  }

  function updateOutline(node) {
    if (!node || isOwn(node)) {
      outline.style.display = 'none'
      return
    }
    const rect = node.getBoundingClientRect()
    const left = Math.max(0, rect.left)
    const top = Math.max(0, rect.top)
    const right = Math.min(innerWidth, rect.right)
    const bottom = Math.min(innerHeight, rect.bottom)
    outline.style.cssText += `;display:block;left:${left}px;top:${top}px;width:${Math.max(0, right-left)}px;height:${Math.max(0, bottom-top)}px`
  }

  function renderPins() {
    document.querySelectorAll('.h5-annotation-pin').forEach(node => node.remove())
    annotations.filter(visibleAnnotation).forEach(item => {
      const target = findTarget(item.targetKey)
      if (!target) return
      const rect = target.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return
      const pin = document.createElement('button')
      pin.className = `h5-annotation-pin${item.automatic ? ' auto' : ''}`
      pin.type = 'button'
      pin.textContent = item.index
      pin.title = item.title
      pin.style.left = `${Math.max(4, Math.min(innerWidth - 28, rect.right - 26))}px`
      pin.style.top = `${Math.max(4, Math.min(innerHeight - 28, rect.top + 4))}px`
      pin.addEventListener('click', event => {
        event.stopPropagation()
        openDetail(item)
      })
      document.body.appendChild(pin)
    })
  }

  function setMode(next) {
    mode = next
    document.body.classList.toggle('h5-annotation-mode', mode)
    toolbar.querySelector('[data-action="toggle"]').classList.toggle('active', mode)
    toolbar.querySelector('[data-action="toggle"] span').textContent = mode ? '正在标注' : '开启标注'
    if (!mode) clearSelection()
  }

  function clearSelection() {
    hoverTarget = null
    selectedTarget = null
    outline.style.display = 'none'
    if (composer) composer.remove()
    composer = null
    document.querySelector('.h5-comment-mask')?.remove()
  }

  function openComposer(x, y) {
    document.querySelector('.h5-comment-mask')?.remove()
    const mask = document.createElement('div')
    mask.className = 'h5-comment-mask'
    mask.addEventListener('click', clearSelection)
    document.body.appendChild(mask)
    composer = document.createElement('div')
    composer.className = 'h5-comment-composer'
    composer.innerHTML = '<textarea rows="1" placeholder="添加评论..."></textarea><button type="button" disabled aria-label="发送">✓</button>'
    composer.style.left = `${Math.max(12, Math.min(innerWidth - 352, x))}px`
    composer.style.top = `${Math.max(56, Math.min(innerHeight - 88, y + 10))}px`
    const input = composer.querySelector('textarea')
    const send = composer.querySelector('button')
    input.addEventListener('input', () => {
      send.disabled = !input.value.trim()
      input.style.height = 'auto'
      input.style.height = `${Math.min(112, input.scrollHeight)}px`
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
        source: 'user',
        automatic: false
      })
      persist()
      clearSelection()
      renderPins()
    })
    document.body.appendChild(composer)
    input.focus()
  }

  function openDetail(item) {
    const mask = document.createElement('div')
    mask.className = 'h5-comment-mask'
    const dialog = document.createElement('section')
    dialog.className = 'h5-annotation-dialog'
    dialog.innerHTML = `
      <h2>注释 ${item.index}</h2>
      <label>标题<input class="h5-title-input" value="${htmlEscape(item.title)}"></label>
      <label>内容<textarea>${htmlEscape(item.content)}</textarea></label>
      <div class="h5-dialog-actions"><button class="delete" type="button">删除</button><button class="save" type="button">保存</button></div>`
    const close = () => { mask.remove(); dialog.remove() }
    mask.addEventListener('click', close)
    dialog.querySelector('.save').addEventListener('click', () => {
      item.title = dialog.querySelector('input').value.trim() || '注释'
      item.content = dialog.querySelector('textarea').value.trim()
      persist()
      close()
    })
    dialog.querySelector('.delete').addEventListener('click', () => {
      if (item.automatic) {
        if (item.baseline && (item.title !== item.baseline.title || item.content !== item.baseline.content)) {
          item.title = item.baseline.title
          item.content = item.baseline.content
        } else hiddenAutoIds.push(item.id)
      } else annotations = annotations.filter(row => row.id !== item.id)
      persist()
      close()
      renderPins()
    })
    document.body.append(mask, dialog)
  }

  function openRequirements() {
    const mask = document.createElement('div')
    mask.className = 'h5-comment-mask'
    const drawer = document.createElement('aside')
    drawer.className = 'h5-requirement-drawer'
    drawer.innerHTML = `<h2>页面需求</h2><textarea>${htmlEscape(data.pageRequirements[currentPage] || '')}</textarea><div class="h5-dialog-actions"><button type="button">保存</button></div>`
    const close = () => { mask.remove(); drawer.remove() }
    mask.addEventListener('click', close)
    drawer.querySelector('button').addEventListener('click', () => {
      data.pageRequirements[currentPage] = drawer.querySelector('textarea').value
      persist()
      close()
    })
    document.body.append(mask, drawer)
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

  function createToolbar() {
    toolbar = document.createElement('nav')
    toolbar.className = 'h5-annotation-toolbar'
    toolbar.innerHTML = `
      <button data-action="toggle" type="button" title="开启标注">◉ <span>开启标注</span></button>
      <button data-action="requirements" type="button" title="页面需求">▤</button>
      <button data-action="save" type="button" title="另存为">▣</button>
      <button data-action="clear" class="danger" type="button" title="全部删除">⌫</button>`
    toolbar.querySelector('[data-action="toggle"]').addEventListener('click', () => setMode(!mode))
    toolbar.querySelector('[data-action="requirements"]').addEventListener('click', openRequirements)
    toolbar.querySelector('[data-action="save"]').addEventListener('click', exportHtml)
    toolbar.querySelector('[data-action="clear"]').addEventListener('click', () => {
      annotations = annotations.filter(item => item.automatic).map(item => ({ ...item, title: item.baseline.title, content: item.baseline.content }))
      hiddenAutoIds = []
      persist()
      renderPins()
    })
    document.body.appendChild(toolbar)
  }

  function capture(event) {
    if (!mode || isOwn(event.target)) return
    if (['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'dblclick', 'contextmenu'].includes(event.type)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.type === 'click') {
        selectedTarget = event.target
        updateOutline(selectedTarget)
        openComposer(event.clientX, event.clientY)
      }
    }
  }

  function init(input) {
    data = input
    currentPage = data.currentPage || 'home'
    loadState()
    outline = document.createElement('div')
    outline.className = 'h5-annotation-outline'
    document.body.appendChild(outline)
    createToolbar()
    document.addEventListener('pointermove', event => {
      if (!mode || composer || isOwn(event.target)) return
      hoverTarget = event.target
      updateOutline(hoverTarget)
    }, true)
    ;['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'dblclick', 'contextmenu'].forEach(type => document.addEventListener(type, capture, true))
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setMode(false) })
    window.addEventListener('scroll', () => { if (mode && hoverTarget) updateOutline(hoverTarget); renderPins() }, true)
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
