import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Globe3D({ size = 500, markers = [], autoRotateSpeed = 0.002, enableZoom = true, showTooltip = true }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || size
    const height = mount.clientHeight || size

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Globe sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64)

    // Load Earth Texture
    const textureLoader = new THREE.TextureLoader()
    // Use a high-quality Earth texture from a reliable CDN
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    const bumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png')
    
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specular: new THREE.Color('#1a1a1a'),
      shininess: 5,
      transparent: true,
      opacity: 0.9,
    })

    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Country markers
    const markerGroup = new THREE.Group()
    const markerRadius = 0.015
    const baseR = 1.01
    markers.forEach(({ lat, lon, color = '#fbbf24', name, flag }) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const x = baseR * Math.sin(phi) * Math.cos(theta)
      const y = baseR * Math.cos(phi)
      const z = baseR * Math.sin(phi) * Math.sin(theta)
      
      // Marker point
      const markerGeo = new THREE.SphereGeometry(markerRadius, 16, 16)
      const markerMat = new THREE.MeshBasicMaterial({ color })
      const marker = new THREE.Mesh(markerGeo, markerMat)
      marker.position.set(x, y, z)
      marker.userData.countryName = name
      marker.userData.flag = flag
      marker.userData.pulse = Math.random() * Math.PI * 2
      
      // Add a small glow to the marker
      const glowGeo = new THREE.SphereGeometry(markerRadius * 2.5, 16, 16)
      const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      marker.add(glow)
      
      markerGroup.add(marker)
    })
    globe.add(markerGroup)

    // Atmosphere glow
    const atmosphereGeo = new THREE.SphereGeometry(1.06, 64, 64)
    const atmosphereMat = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08,
      side: THREE.FrontSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    scene.add(atmosphere)

    // Outer glow ring
    const ringGeo = new THREE.TorusGeometry(1.12, 0.015, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.4 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    // Particles around globe
    const particleCount = 300
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.008, transparent: true, opacity: 0.6 })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xfbbf24, 1.5)
    dirLight.position.set(5, 3, 5)
    scene.add(dirLight)

    const blueLight = new THREE.PointLight(0x6366f1, 1, 10)
    blueLight.position.set(-3, -2, -3)
    scene.add(blueLight)

    // Mouse interaction
    let mouseX = 0, mouseY = 0, mouseClientX = 0, mouseClientY = 0
    const pointer = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    let hovered = null
    let tooltipEl = null
    if (showTooltip) {
      tooltipEl = document.createElement('div')
      tooltipEl.style.position = 'absolute'
      tooltipEl.style.pointerEvents = 'none'
      tooltipEl.style.padding = '6px 10px'
      tooltipEl.style.background = 'rgba(0,0,0,0.6)'
      tooltipEl.style.border = '1px solid rgba(255,255,255,0.15)'
      tooltipEl.style.borderRadius = '8px'
      tooltipEl.style.fontSize = '12px'
      tooltipEl.style.color = '#e2e8f0'
      tooltipEl.style.backdropFilter = 'blur(6px)'
      tooltipEl.style.transform = 'translate(-50%, -120%)'
      tooltipEl.style.display = 'none'
      mount.style.position = 'relative'
      mount.appendChild(tooltipEl)
    }

    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      mouseX = (nx - 0.5) * 2
      mouseY = -(ny - 0.5) * 2
      pointer.x = nx * 2 - 1
      pointer.y = -(ny * 2 - 1)
      mouseClientX = e.clientX - rect.left
      mouseClientY = e.clientY - rect.top
    }
    mount.addEventListener('mousemove', handleMouse)

    // Scroll zoom
    let targetZoom = camera.position.z
    const minZoom = 1.8
    const maxZoom = 4.2
    const handleWheel = (e) => {
      if (!enableZoom) return
      e.preventDefault()
      const delta = Math.sign(e.deltaY) * 0.3
      targetZoom = Math.min(maxZoom, Math.max(minZoom, targetZoom + delta))
    }
    mount.addEventListener('wheel', handleWheel, { passive: false })

    // Animation
    let frameId
    let time = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      time += 0.005

      // Smooth camera zoom
      if (enableZoom) {
        camera.position.z += (targetZoom - camera.position.z) * 0.08
      }

      globe.rotation.y += autoRotateSpeed + mouseX * 0.001
      globe.rotation.x += mouseY * 0.0005

      atmosphere.rotation.y = globe.rotation.y
      ring.rotation.z = time * 0.3

      particles.rotation.y += 0.001
      particles.rotation.x = Math.sin(time) * 0.05

      // Hover detection
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(markerGroup.children, true)
      if (hits.length > 0) {
        const obj = hits[0].object
        if (hovered !== obj) {
          if (hovered) hovered.scale.set(1, 1, 1)
          hovered = obj
          hovered.scale.set(1.6, 1.6, 1.6)
        }
        if (tooltipEl) {
          tooltipEl.innerHTML = `<span style="font-size: 1.2rem; margin-right: 5px;">${obj.userData.flag || ''}</span> <span>${obj.userData.countryName || 'Country'}</span>`
          tooltipEl.style.left = `${mouseClientX}px`
          tooltipEl.style.top = `${mouseClientY}px`
          tooltipEl.style.display = 'flex'
          tooltipEl.style.alignItems = 'center'
        }
      } else {
        if (hovered) hovered.scale.set(1, 1, 1)
        hovered = null
        if (tooltipEl) tooltipEl.style.display = 'none'
      }

      // Marker pulsing
      markerGroup.children.forEach((m, idx) => {
        const t = time * 2 + (m.userData.pulse || 0)
        const s = 1 + Math.sin(t) * 0.15
        m.scale.set(s, s, s)
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('mousemove', handleMouse)
      mount.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      if (tooltipEl && tooltipEl.parentNode === mount) mount.removeChild(tooltipEl)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [size, markers, autoRotateSpeed, enableZoom, showTooltip])

  return <div ref={mountRef} className="w-full h-full" />
}
