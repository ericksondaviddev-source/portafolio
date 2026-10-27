import './style.css'
import proyectos from './proyectos.js'
import textos from './textos.js'

// CONFIGuración centralizada del armazón — cambiar aquí, en un solo lugar
const CONFIG = {
  whatsappNumber: '584241875518' // Aprobado por Erickson 2026-10-24
}

const app = document.getElementById('app')
if (!app) throw new Error('app not found')

let lang = localStorage.getItem('portafolio-lang') || 'es'
let filter = localStorage.getItem('portafolio-filter') || 'todo'

const tUI = () => textos[lang] || textos.es
const tProj = (obj) => obj[lang] ?? obj.es ?? ''

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v
    else if (k === 'text') node.textContent = v
    else node.setAttribute(k, v)
  }
  for (const c of children) {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c))
    else if (c) node.appendChild(c)
  }
  return node
}
const clear = n => { while (n.firstChild) n.removeChild(n.firstChild) }

const container = el('div', {class:'container'})
app.appendChild(container)

// torch layer
const torch = el('div', {id:'torch'})
document.body.appendChild(torch)

const header = el('header', {}, [
  el('div', {class:'logo', text:'ED-Dev'}),
  el('span', {text: tUI().appTitle}),
  el('div', {class:'lang'}, [
    el('button', {class:'btn ghost', id:'langBtn', text: tUI().langToggle})
  ])
])
container.appendChild(header)

const grid = el('div', {class:'grid'})
container.appendChild(grid)

function buildHero() {
  const hero = el('section', {class:'card hero bento-1'}, [
    el('div', {}, [
      el('h3', {id:'heroTitle', text: tUI().heroTitle}),
      el('p', {id:'heroDesc', text: tUI().heroDesc})
    ]),
    el('div', {}, [
      el('button', {class:'btn', id:'scrollBtn', text: tUI().heroBtn})
    ])
  ])
  grid.appendChild(hero)
}

function buildFiltersCard() {
  const card = el('section', {class:'card bento-2'}, [
    el('h3', {text: tUI().filterTitle}),
    el('div', {class:'filters', id:'filters'})
  ])
  grid.appendChild(card)
  renderFilters()
}

function renderFilters() {
  const wrap = document.getElementById('filters')
  clear(wrap)
  const keys = ['todo','landing','app','video','musica','libro']
  for (const k of keys) {
    const btn = el('button', {text: tUI().filters[k] || k})
    if (filter === k) btn.classList.add('active')
    btn.addEventListener('click', () => {
      filter = k
      localStorage.setItem('portafolio-filter', filter)
      renderFilters()
      renderProjects()
    })
    wrap.appendChild(btn)
  }
}

function buildInfo() {
  const info = el('section', {class:'card bento-3'}, [
    el('h3', {text: tUI().styleTitle}),
    el('p', {text: tUI().styleDesc})
  ])
  grid.appendChild(info)
}

function buildWhatsApp() {
  const card = el('section', {class:'card bento-4'}, [
    el('h3', {text: tUI().whatsappTitle}),
    el('div', {class:'whatsapp'}, [
      el('strong', {text: tUI().whatsappLabel})
    ])
  ])
  grid.appendChild(card)
}

function buildArch() {
  const card = el('section', {class:'card bento-5'}, [
    el('h3', {text: tUI().archTitle}),
    el('p', {text: tUI().archDesc})
  ])
  grid.appendChild(card)
}

function buildProjectsSection() {
  const sec = el('section', {class:'card bento-6', id:'proyectos'}, [
    el('h3', {id:'projectsTitle', text: tUI().projectsTitle}),
    el('div', {class:'projects', id:'projects'})
  ])
  grid.appendChild(sec)
  renderProjects()
}

const footer = el('footer', {id:'footer', text: tUI().footer})
container.appendChild(footer)

const toast = el('div', {class:'copy-toast', id:'toast', text: tUI().toastCopy})
document.body.appendChild(toast)

function showToast(msg) {
  toast.textContent = msg
  toast.classList.add('show')
  setTimeout(()=> toast.classList.remove('show'), 1800)
}

function renderProjects() {
  const wrap = document.getElementById('projects')
  clear(wrap)
  const items = proyectos.filter(p => filter === 'todo' || p.type === filter)
  for (const p of items) {
    const card = el('article', {class: 'project' + (p.destacado ? ' featured' : '')})
    const body = el('div', {class:'project-body'})
    const tag = el('span', {class:'tag', text: tUI().filters[p.type] || p.type})
    const title = el('strong', {})
    title.appendChild(document.createTextNode(tProj(p.title)))
    const desc = el('p', {text: tProj(p.description)})

    if (p.urlDemo) {
      const demoBtn = el('a', {class:'btn secondary', href:p.urlDemo, target:'_blank', text: tUI().btnDemo})
      body.appendChild(demoBtn)
      body.appendChild(document.createElement('br'))
    } else {
      const demoSpan = el('span', {class:'btn secondary disabled', text: tUI().btnDemoSoon})
      body.appendChild(demoSpan)
      body.appendChild(document.createElement('br'))
    }

    const copyBtn = el('button', {class:'btn secondary', text: tUI().btnCopy})
    copyBtn.style.marginTop = '8px'
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(tProj(p.textoPropuesta))
        showToast(tUI().toastCopy)
      } catch(e) {
        showToast(tUI().toastCopyFail)
      }
    })

    // Enlace WhatsApp con número centralizado en CONFIG
    const waHref = p.linkWhatsApp.replace(/wa\.me\/\d+/, `wa.me/${CONFIG.whatsappNumber}`)
    const waBtn = el('a', {class:'btn', href: waHref, target:'_blank', text: tUI().btnWhatsApp})
    waBtn.style.marginTop = '8px'

    body.appendChild(tag)
    body.appendChild(title)
    body.appendChild(document.createElement('br'))
    body.appendChild(desc)
    body.appendChild(document.createElement('br'))
    body.appendChild(copyBtn)
    body.appendChild(document.createElement('br'))
    body.appendChild(waBtn)

    card.appendChild(body)
    wrap.appendChild(card)
  }
  // intersection observer for entrance
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          obs.unobserve(e.target)
        }
      })
    }, {threshold:0.15})
    document.querySelectorAll('.project').forEach(el => obs.observe(el))
  }
}

function updateLang() {
  document.getElementById('langBtn').textContent = tUI().langToggle
  document.getElementById('heroTitle').textContent = tUI().heroTitle
  document.getElementById('heroDesc').textContent = tUI().heroDesc
  document.getElementById('scrollBtn').textContent = tUI().heroBtn
  document.getElementById('projectsTitle').textContent = tUI().projectsTitle
  document.getElementById('footer').textContent = tUI().footer
  toast.textContent = tUI().toastCopy
  renderFilters()
  renderProjects()
}

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es'
  localStorage.setItem('portafolio-lang', lang)
  updateLang()
})

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scrollBtn')?.addEventListener('click', () => {
    document.getElementById('proyectos')?.scrollIntoView({behavior:'smooth'})
  })
})

// torch cursor
if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let x = 0, y = 0
  document.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; })
  function tick() {
    torch.style.setProperty('--x', x + 'px')
    torch.style.setProperty('--y', y + 'px')
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// init
buildHero()
buildFiltersCard()
buildInfo()
buildWhatsApp()
buildArch()
buildProjectsSection()

