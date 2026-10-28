import './style.css'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
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

// Inicializar recorrido horizontal con 7 salas
initRecorrido({ app, salas, proyectos, textos, CONFIG, MundoCaverna })

// Mantener idioma en documento y JSON-LD mínimo
let lang = localStorage.getItem('portafolio-lang') || 'es'
document.documentElement.lang = lang

function updateLang() {
  document.documentElement.lang = lang
  const tUI = textos[lang] || textos.es
  const title = tUI.pageTitle || 'Portafolio ED-Dev'
  document.title = title
  const ld = document.getElementById('ldjson')
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@type':'Person',
      name:'ED-Dev',
      description:'Portafolio de 7 salas: caverna y jardín.'
    })
  }
}
updateLang()

// Botón de idioma simple
const btn = document.createElement('button')
btn.className = 'lang-btn'
btn.textContent = lang === 'es' ? 'EN' : 'ES'
btn.addEventListener('click', ()=>{
  lang = lang === 'es' ? 'en' : 'es'
  localStorage.setItem('portafolio-lang', lang)
  updateLang()
  location.reload()
})
document.body.appendChild(btn)
