import './style.css'
import salas from './salas.js'
import proyectos from './proyectos.js'
import textos from './textos.js'

// CONFIGuración centralizada del armazón — cambiar aquí, en un solo lugar
const CONFIG = {
  whatsappNumber: '584241875518' // Aprobado por Erickson 2026-10-24
}

const WA_BASE = `https://wa.me/${CONFIG.whatsappNumber}`
const waHref = (mensaje) => `${WA_BASE}?text=${encodeURIComponent(mensaje)}`

const app = document.getElementById('app')
if (!app) throw new Error('app not found')

let lang = localStorage.getItem('portafolio-lang') || 'es'

const tUI = () => textos[lang] || textos.es
const t = (obj) => (obj && (obj[lang] ?? obj.es)) || ''

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v
    else if (k === 'text') node.textContent = v
    else if (k === 'html') node.innerHTML = v
    else node.setAttribute(k, v)
  }
  for (const c of children) {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c))
    else if (c) node.appendChild(c)
  }
  return node
}

const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild) }

// ── Observadores únicos: se crean una vez y se reutilizan (nunca uno por render) ──
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const cardObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          cardObserver.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
  : null

const sectionNodes = new Map()

// ── Estructura ──
const skip = el('a', { class: 'skip-link', href: '#content', 'data-i18n': 'skipToContent' })
document.body.appendChild(skip)

const torch = el('div', { id: 'torch' })
document.body.appendChild(torch)

const nav = el('nav', { class: 'nav', id: 'nav', 'aria-label': 'Portfolio', 'data-i18n-aria': 'navLabel' })
const langBtn = el('button', { class: 'btn ghost', id: 'langBtn', type: 'button', 'data-i18n': 'langToggle' })

const header = el('header', {}, [
  el('div', { class: 'logo' }, [el('span', { text: 'ED-Dev' })]),
  nav,
  el('div', { class: 'lang' }, [langBtn])
])

const progress = el('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Progreso', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', 'data-i18n-aria': 'progressLabel' }, [
  el('div', { class: 'progress-bar', id: 'progressBar' })
])

const main = el('main', { id: 'content' })
const container = el('div', { class: 'container' }, [header, progress, main])
app.appendChild(container)

const footer = el('footer', { id: 'footer', 'data-i18n': 'footer' })
container.appendChild(footer)

const toast = el('div', { class: 'copy-toast', id: 'toast', role: 'status', 'aria-live': 'polite' })
document.body.appendChild(toast)

let toastTimer = null
function showToast(msg) {
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800)
}

// ── Tarjetas de proyecto ──
// Un mismo proyecto puede vivir en varias salas (destacado + su propia sala),
// así que guardamos TODOS sus actualizadores, no solo uno.
const projectCards = new Map()

function buildProjectCard(p) {
  const tag = el('span', { class: 'tag' })
  const title = el('h3', { class: 'project-title' })
  const desc = el('p', { class: 'project-desc' })
  const soon = el('span', { class: 'tag soon' })

  const demo = p.urlDemo
    ? el('a', { class: 'btn secondary', href: p.urlDemo, target: '_blank', rel: 'noopener noreferrer' })
    : el('span', { class: 'btn secondary disabled', 'aria-disabled': 'true' })

  const copyBtn = el('button', { class: 'btn secondary', type: 'button' })
  const waBtn = el('a', { class: 'btn', target: '_blank', rel: 'noopener noreferrer' })

  const update = () => {
    tag.textContent = tUI().typeLabels[p.type] || p.type
    title.textContent = t(p.title)
    desc.textContent = t(p.description)
    soon.textContent = tUI().tagPronto
    demo.textContent = p.urlDemo ? tUI().btnDemo : tUI().btnDemoSoon
    copyBtn.textContent = tUI().btnCopy
    waBtn.textContent = tUI().btnWhatsApp
    waBtn.href = waHref(t(p.propuesta))
  }
  update()

  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(t(p.propuesta))
    showToast(ok ? tUI().toastCopy : tUI().toastCopyFail)
  })

  const card = el('article', { class: 'project' + (p.destacado ? ' featured' : ''), 'data-proyecto': p.id }, [
    el('div', { class: 'project-body' }, [
      el('div', { class: 'project-meta' }, [tag, p.estado === 'proximo' ? soon : null]),
      title,
      desc,
      el('div', { class: 'actions' }, [demo, copyBtn, waBtn])
    ])
  ])

  const updaters = projectCards.get(p.id) || []
  updaters.push(update)
  projectCards.set(p.id, updaters)
  return card
}

async function copyText(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto)
      return true
    }
    const ta = el('textarea', { class: 'visually-hidden' })
    ta.value = texto
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch (e) {
    return false
  }
}

// ── Secciones (salas) ──
function sectionHeader(sala, index, i18nKey) {
  return el('div', { class: 'section-head' }, [
    el('span', { class: 'section-index', text: String(index + 1).padStart(2, '0') }),
    el('h2', { 'data-i18n': i18nKey, text: t(sala.titulo) }),
    el('p', { class: 'section-summary', text: t(sala.resumen) })
  ])
}

const sectionTitleKey = {
  landings: 'landingsTitle',
  apps: 'appsTitle',
  musica: 'musicaTitle',
  libros: 'librosTitle',
  video: 'videoTitle',
  contacto: 'contactoTitle'
}

function buildSala(sala, index) {
  const sec = el('section', { class: 'sala', id: `sala-${sala.id}`, 'data-sala': sala.id, 'data-ambiente': sala.ambiente })

  if (sala.id === 'home') {
    sec.appendChild(el('div', { class: 'hero' }, [
      el('h1', { 'data-i18n': 'heroTitle', text: tUI().heroTitle }),
      el('p', { 'data-i18n': 'heroDesc', text: tUI().heroDesc }),
      el('button', { class: 'btn', id: 'heroBtn', type: 'button', 'data-i18n': 'heroBtn' })
    ]))
    const destacados = proyectos.filter((p) => p.destacado)
    sec.appendChild(el('div', { class: 'section-head' }, [
      el('span', { class: 'section-index', text: '01' }),
      el('h2', { 'data-i18n': 'featuredTitle', text: tUI().featuredTitle })
    ]))
    const grid = el('div', { class: 'projects' })
    destacados.forEach((p) => grid.appendChild(buildProjectCard(p)))
    sec.appendChild(grid)
    return sec
  }

  sec.appendChild(sectionHeader(sala, index, sectionTitleKey[sala.id]))

  if (sala.id === 'contacto') {
    const copyBtn = el('button', { class: 'btn secondary', type: 'button', 'data-i18n': 'contactoCopy' })
    copyBtn.addEventListener('click', async () => {
      const ok = await copyText(t(tUI().contactoPropuesta))
      showToast(ok ? tUI().toastCopy : tUI().toastCopyFail)
    })
    const waBtn = el('a', { class: 'btn wa-big', target: '_blank', rel: 'noopener noreferrer', 'data-i18n': 'contactoWhatsApp' })
    sec.appendChild(el('div', { class: 'card contacto' }, [
      el('p', { 'data-i18n': 'contactoDesc', text: tUI().contactoDesc }),
      el('div', { class: 'actions' }, [waBtn, copyBtn]),
      el('small', { class: 'muted', 'data-i18n': 'contactoHint', text: tUI().contactoHint })
    ]))
    return sec
  }

  const items = proyectos.filter((p) => p.sala === sala.id)
  if (items.length === 0) {
    sec.appendChild(el('div', { class: 'card en-construccion' }, [
      el('strong', { 'data-i18n': 'enConstruccionTitle', text: tUI().enConstruccionTitle }),
      el('p', { 'data-i18n': 'enConstruccionDesc', text: tUI().enConstruccionDesc })
    ]))
    return sec
  }

  const grid = el('div', { class: 'projects' })
  items.forEach((p) => grid.appendChild(buildProjectCard(p)))
  sec.appendChild(grid)
  return sec
}

// ── Navegación ──
const navButtons = new Map()
salas.forEach((sala) => {
  const btn = el('button', { class: 'nav-btn', type: 'button', 'data-sala': sala.id })
  btn.appendChild(el('span', { class: 'nav-label', text: t(sala.titulo) }))
  btn.addEventListener('click', () => goToSala(sala.id))
  nav.appendChild(btn)
  navButtons.set(sala.id, btn)
})

function setActiveSala(id) {
  navButtons.forEach((btn, key) => {
    const active = key === id
    btn.classList.toggle('active', active)
    if (active) btn.setAttribute('aria-current', 'true')
    else btn.removeAttribute('aria-current')
  })
}

function goToSala(id) {
  const target = document.getElementById(`sala-${id}`)
  if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

// ── Render ──
salas.forEach((sala, i) => {
  const sec = buildSala(sala, i)
  main.appendChild(sec)
  sectionNodes.set(sala.id, sec)
})
if (cardObserver) {
  document.querySelectorAll('.project').forEach((c) => cardObserver.observe(c))
} else {
  document.querySelectorAll('.project').forEach((c) => c.classList.add('in'))
}

// ── Idioma: actualiza textos en sitio, sin recrear el DOM ──
function applyLang() {
  const ui = tUI()
  document.documentElement.lang = lang
  document.title = ui.pageTitle

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = ui[node.dataset.i18n]
    if (typeof value === 'string') node.textContent = value
  })
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    const value = ui[node.dataset.i18nAria]
    if (typeof value === 'string') node.setAttribute('aria-label', value)
  })

  salas.forEach((sala) => {
    const label = navButtons.get(sala.id)?.querySelector('.nav-label')
    if (label) label.textContent = t(sala.titulo)
    const resumen = document.querySelector(`#sala-${sala.id} .section-summary`)
    if (resumen) resumen.textContent = t(sala.resumen)
  })

  projectCards.forEach((updaters) => updaters.forEach((update) => update()))

  const waBtn = document.querySelector('.wa-big')
  if (waBtn) waBtn.href = waHref(t(ui.contactoPropuesta))
}

applyLang()

// ── Datos estructurados: se generan desde el catálogo, una sola fuente de verdad ──
function renderJsonLd() {
  const node = document.getElementById('ldjson')
  if (!node) return
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'ED-Dev',
    description: 'Diseño, tecnología y cultura. Solarpunk, bento grid y glassmorphism.',
    knowsAbout: ['Diseño web', 'Desarrollo de apps', 'Video contenido', 'Identidad visual'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Portafolio ED-Dev',
      itemListElement: proyectos.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: t(p.title),
          description: t(p.description),
          url: p.urlDemo || undefined,
          creator: { '@type': 'Person', name: 'ED-Dev' }
        }
      }))
    }
  }
  node.textContent = JSON.stringify(data)
}
renderJsonLd()

langBtn.addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es'
  localStorage.setItem('portafolio-lang', lang)
  applyLang()
  renderJsonLd()
})

const heroBtn = document.getElementById('heroBtn')
if (heroBtn) heroBtn.addEventListener('click', () => goToSala('landings'))

// ── Progreso de scroll ──
const progressBar = document.getElementById('progressBar')
let scrollQueued = false
function computeActiveSala() {
  const line = window.scrollY + window.innerHeight * 0.35
  let active = salas[0].id
  for (const sala of salas) {
    const sec = sectionNodes.get(sala.id)
    if (sec && sec.offsetTop <= line) active = sala.id
  }
  setActiveSala(active)
}
function updateProgress() {
  scrollQueued = false
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight
  const pct = max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 0
  progressBar.style.transform = `scaleX(${pct / 100})`
  progress.setAttribute('aria-valuenow', String(pct))
  computeActiveSala()
}
window.addEventListener('scroll', () => {
  if (scrollQueued) return
  scrollQueued = true
  requestAnimationFrame(updateProgress)
}, { passive: true })
updateProgress()

// ── Antorcha del cursor: se actualiza al mover el puntero, no en cada frame ──
if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  let px = window.innerWidth / 2
  let py = window.innerHeight / 2
  let queued = false
  document.addEventListener('pointermove', (e) => {
    px = e.clientX
    py = e.clientY
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      torch.style.setProperty('--x', px + 'px')
      torch.style.setProperty('--y', py + 'px')
    })
  }, { passive: true })
}
