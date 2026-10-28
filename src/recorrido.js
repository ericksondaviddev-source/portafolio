export function initRecorrido({app, salas, proyectos, textos, CONFIG, MundoCaverna}) {
  const tUI = () => textos[localStorage.getItem('portafolio-lang') || 'es'] || textos.es
  const t = (obj) => (obj && (obj[localStorage.getItem('portafolio-lang') || 'es'] ?? obj.es)) || ''

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag)
    for (const [k,v] of Object.entries(attrs)) {
      if (k==='class') node.className = v
      else if (k==='text') node.textContent = v
      else if (k==='html') node.innerHTML = v
      else node.setAttribute(k,v)
    }
    for (const c of children) {
      if (typeof c==='string') node.appendChild(document.createTextNode(c))
      else if (c) node.appendChild(c)
    }
    return node
  }

  // Tarjeta de proyecto (una sola vez; la usan las salas y los destacados de Home)
  const crearCard = (p) => {
    const card = el('article', {class:'project' + (p.destacado ? ' featured' : '')})
    const body = el('div', {class:'project-body'})
    body.appendChild(el('span', {class:'tag', text:tUI().typeLabels[p.type] || p.type}))
    body.appendChild(el('h2', {text:t(p.title)}))
    body.appendChild(el('p', {class:'project-desc', text:t(p.description)}))
    const acciones = el('div', {class:'project-actions'})
    if (p.urlDemo) {
      acciones.appendChild(el('a', {class:'btn', href:p.urlDemo, target:'_blank', rel:'noopener', text:tUI().btnDemo}))
    } else {
      acciones.appendChild(el('span', {class:'btn disabled', text:tUI().btnDemoSoon}))
    }
    const waPropuesta = t(p.propuesta) || tUI().contactoPropuesta
    acciones.appendChild(el('a', {
      class:'btn secondary',
      href:`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waPropuesta)}`,
      target:'_blank', rel:'noopener', text:tUI().btnWhatsApp
    }))
    body.appendChild(acciones)
    card.appendChild(body)
    return card
  }

  // Canvas caverna fijo detrás
  const canvas = el('canvas', {id:'caverna'})
  document.body.prepend(canvas)

  // Inicializar mundo
  let mundo = null
  try {
    mundo = new MundoCaverna(canvas, {mode:'cueva'})
  } catch(e){ console.warn('MundoCaverna no disponible', e) }

  // Stage horizontal
  const stage = el('div', {class:'stage'})
  const track = el('div', {class:'track'})
  stage.appendChild(track)

  // Mapa
  const map = el('div', {class:'map'})
  const mapInner = el('div', {class:'map-inner'})
  map.appendChild(mapInner)

  salas.forEach((s,i)=>{
    const item = el('button', {class:'map-item', 'data-sala':s.id})
    item.innerHTML = `<span class="map-index">${String(i+1).padStart(2,'0')}</span><span class="map-label">${t(s.titulo)}</span>`
    item.addEventListener('click', ()=> goTo(i))
    mapInner.appendChild(item)
  })

  // Construir salas
  salas.forEach((sala,idx)=>{
    const room = el('section', {class:'room', 'data-sala':sala.id, 'data-ambiente':sala.ambiente})
    const head = el('div', {class:'room-head'})
    head.appendChild(el('span', {class:'room-index', text:String(idx+1).padStart(2,'0')}))
    head.appendChild(el('h1', {text:t(sala.titulo)}))
    room.appendChild(head)

    if (sala.id==='contacto') {
      room.appendChild(el('p', {class:'room-sub', text:t(sala.resumen)}))
      const bloque = el('div', {class:'contacto'})
      bloque.appendChild(el('p', {text:tUI().contactoDesc}))
      const acciones = el('div', {class:'actions'})
      const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(tUI().contactoPropuesta || '')}`
      acciones.appendChild(el('a', {class:'btn wa-big', href:waHref, target:'_blank', rel:'noopener', text:tUI().contactoWhatsApp}))
      const btnCopy = el('button', {class:'btn secondary', text:tUI().contactoCopy})
      btnCopy.addEventListener('click', async ()=>{
        try {
          await navigator.clipboard.writeText(tUI().contactoPropuesta || '')
          mostrarToast(tUI().toastCopy)
        } catch { mostrarToast(tUI().toastCopyFail) }
      })
      acciones.appendChild(btnCopy)
      bloque.appendChild(acciones)
      bloque.appendChild(el('span', {class:'muted', text:tUI().contactoHint}))
      room.appendChild(bloque)
      room.appendChild(el('span', {class:'muted', text:tUI().footer}))
    } else if (sala.id==='home') {
      room.appendChild(el('p', {class:'room-sub', text:t(sala.resumen)}))
      const accionesHome = el('div', {class:'home-actions'})
      const btnEntrar = el('button', {class:'btn wa-big', text:tUI().heroBtn})
      btnEntrar.addEventListener('click', ()=>goTo(1))
      accionesHome.appendChild(btnEntrar)
      room.appendChild(accionesHome)

      // Proyectos destacados: 3 piezas con luz propia, reutilizan la tarjeta de las salas
      const destacados = proyectos.filter(p=>p.destacado)
      if (destacados.length) {
        const block = el('div', {class:'home-featured'})
        block.appendChild(el('h2', {class:'featured-title', text:tUI().featuredTitle}))
        const grid = el('div', {class:'projects proyectos-casa'})
        destacados.forEach(p=>grid.appendChild(crearCard(p)))
        block.appendChild(grid)
        room.appendChild(block)
      }
    } else {
      room.appendChild(el('p', {class:'room-sub', text:t(sala.resumen)}))
      const proyectosSala = proyectos.filter(p=>p.sala===sala.id)
      if (proyectosSala.length===0) {
        const cardVacia = el('div', {class:'card en-construccion'})
        cardVacia.appendChild(el('strong', {text:tUI().enConstruccionTitle}))
        cardVacia.appendChild(el('p', {text:tUI().enConstruccionDesc}))
        room.appendChild(cardVacia)
      } else {
        const grid = el('div', {class:'projects'})
        proyectosSala.forEach(p=>grid.appendChild(crearCard(p)))
        room.appendChild(grid)
      }
    }
    track.appendChild(room)
  })

  app.appendChild(stage)
  app.appendChild(map)

  // Toast de copiado
  const toast = el('div', {class:'copy-toast'})
  const mostrarToast = (msg)=>{
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(mostrarToast._t)
    mostrarToast._t = setTimeout(()=>toast.classList.remove('show'), 1800)
  }
  document.body.appendChild(toast)

  // Revelado de tarjetas de proyecto (una sola vez, sin observers huérfanos)
  const revelar = new IntersectionObserver((entradas)=>{
    entradas.forEach((entrada)=>{
      if (entrada.isIntersecting) {
        entrada.target.classList.add('in')
        revelar.unobserve(entrada.target)
      }
    })
  }, {root: stage, threshold: .15})
  document.querySelectorAll('.project').forEach((c)=>revelar.observe(c))

  // Scroll horizontal con inercia suave (lerp la rueda hacia su destino)
  let targetScroll = stage.scrollLeft
  let rafScroll = false
  const roomW = ()=> stage.clientWidth
  const maxScroll = ()=> roomW() * (salas.length - 1)

  const lerpScroll = ()=>{
    const diff = targetScroll - stage.scrollLeft
    if (Math.abs(diff) < 1) {
      // Al asentarse: si quedó cerca de una frontera de sala, termina de asentarse en ella
      const i = Math.round(stage.scrollLeft / roomW())
      const resto = stage.scrollLeft - i * roomW()
      if (i >= 0 && i < salas.length && Math.abs(resto) >= 1 && Math.abs(resto) <= roomW() * .25) {
        targetScroll = i * roomW()
        requestAnimationFrame(lerpScroll)
        return
      }
      rafScroll = false
      return
    }
    stage.scrollLeft += diff * .16
    requestAnimationFrame(lerpScroll)
  }
  const animarScroll = (destino)=>{
    targetScroll = Math.min(Math.max(destino, 0), maxScroll())
    if (!rafScroll) {
      rafScroll = true
      requestAnimationFrame(lerpScroll)
    }
  }
  const goTo = (i)=> animarScroll(i * roomW())
  const currentIndex = ()=> Math.round(stage.scrollLeft / roomW())

  // Progreso arriba y botón de Contacto siempre a la mano
  const progress = el('div', {class:'progress'})
  const progressBar = el('div', {class:'progress-bar'})
  progress.appendChild(progressBar)
  const salaContacto = salas.find(s=>s.id==='contacto')
  const contactoBtn = el('button', {class:'contacto-btn', text:t(salaContacto.titulo)})
  contactoBtn.addEventListener('click', ()=>goTo(salas.length-1))
  document.body.appendChild(progress)
  document.body.appendChild(contactoBtn)

  // Parallax sutil de los títulos (se apaga con movimiento reducido)
  const salasEls = [...document.querySelectorAll('.room')]
  const headEls = salasEls.map(r=>r.querySelector('.room-head'))
  const parallaxActivo = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let ticking = false
  stage.addEventListener('scroll', ()=>{
    if (ticking) return
    ticking = true
    requestAnimationFrame(()=>{
      const sl = stage.scrollLeft           // una sola lectura de layout por frame
      const rw = roomW()
      const i = Math.round(sl / rw)
      if (mundo) {
        const sala = salas[i]
        const mode = sala.ambiente==='jardin' ? 'jardin' : 'cueva'
        mundo.setMode(mode)
        // Fondo vivo: parallax por capas + variante por sala
        if (mundo.setScene) mundo.setScene({scroll: sl, seed: i})
      }
      document.querySelectorAll('.map-item').forEach((b,idx)=>{
        b.classList.toggle('active', idx===i)
      })

      // Progreso: cálculo puro, sin leer layout
      progressBar.style.width = `${(sl / Math.max(1, maxScroll())) * 100}%`
      contactoBtn.classList.toggle('oculto', i === salas.length - 1)

      // Parallax matemático: el centro de cada sala es predecible, cero rect reads
      if (parallaxActivo) {
        headEls.forEach((head, idx)=>{
          const off = (idx * rw + rw/2 - sl) / rw
          head.style.transform = `translateX(${off * -6}%)`
          head.style.opacity = String(Math.max(0.25, 1 - Math.abs(off) * 1.4))
        })
      }
      ticking = false
    })
  })

  // Wheel: vertical o lateral (trackpad), normalizado, siempre con inercia
  stage.addEventListener('wheel', (e)=>{
    e.preventDefault()
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    const paso = e.deltaMode === 1 ? delta * 16 : e.deltaMode === 2 ? delta * roomW() : delta
    animarScroll(targetScroll + paso)
  }, {passive:false})

  // Teclas
  window.addEventListener('keydown', (e)=>{
    if (e.key==='ArrowRight') goTo(Math.min(salas.length-1, currentIndex()+1))
    if (e.key==='ArrowLeft') goTo(Math.max(0, currentIndex()-1))
  })

  // Resize mundo con debounce rAF
  let resizeRAF = false
  const ro = new ResizeObserver(()=>{
    if (resizeRAF) return
    resizeRAF = true
    requestAnimationFrame(()=>{
      mundo && mundo.resize()
      resizeRAF = false
    })
  })
  ro.observe(document.body)

  // Exponer
  window.__recorrido = {goTo, currentIndex}
}
