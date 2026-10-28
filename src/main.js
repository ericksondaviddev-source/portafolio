import './fonts.css'
import './style.css'
import salas from './salas.js'
import proyectos from './proyectos.js'
import textos from './textos.js'
import { initRecorrido } from './recorrido.js'
import { MundoCaverna } from './mundo-caverna.js'

const CONFIG = {
  whatsappNumber: '584241875518'
}

const app = document.getElementById('app')
if (!app) throw new Error('app not found')

// JSON-LD mínimo + SEO en documento
function updateDoc() {
  const lang = localStorage.getItem('portafolio-lang') || 'es'
  document.documentElement.lang = lang
  const tUI = textos[lang] || textos.es
  document.title = tUI.pageTitle || 'Portafolio ED-Dev'
  const ld = document.getElementById('ldjson')
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@type':'Person',
      name:'ED-Dev',
      description:'Portafolio de 7 salas: caverna y jardín.',
      knowsAbout: proyectos.map(p=>p.title.es)
    })
  }
}
updateDoc()

// Pintar el recorrido (y repintarlo sin recargar al cambiar idioma)
let vivo = null
function render() {
  if (vivo) vivo.destroy()
  app.innerHTML = ''
  updateDoc()
  vivo = initRecorrido({ app, salas, proyectos, textos, CONFIG, MundoCaverna })
}
render()

// Botón de idioma simple (sin recarga: se repinta y sigues en tu sala)
const btn = document.createElement('button')
btn.className = 'lang-btn'
btn.textContent = localStorage.getItem('portafolio-lang') === 'en' ? 'ES' : 'EN'
btn.addEventListener('click', ()=>{
  const next = localStorage.getItem('portafolio-lang') === 'en' ? 'es' : 'en'
  const salaActual = window.__recorrido ? window.__recorrido.currentIndex() : 0  // antes de repintar
  localStorage.setItem('portafolio-lang', next)
  btn.textContent = next === 'en' ? 'ES' : 'EN'
  render()
  // volver a la sala donde estabas (el hash ya la recuerda)
  if (salaActual > 0) requestAnimationFrame(()=>window.__recorrido.goTo(salaActual))
})
document.body.appendChild(btn)
