import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Globe3D({ size = 500, autoRotateSpeed = 0.002, enableZoom = true }) {
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
      shininess: 0,
    })

    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    
    // Stars background - layered for depth
    const createStars = (count, radiusMin, radiusMax, size, opacity) => {
      const geometry = new THREE.BufferGeometry()
      const posArray = new Float32Array(count * 3)
      const colorArray = new Float32Array(count * 3)
      const colors = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xdbeafe), // Light Blue
        new THREE.Color(0xfef3c7), // Light Gold
      ]

      for (let i = 0; i < count; i++) {
        const r = radiusMin + Math.random() * (radiusMax - radiusMin)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        
        posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        posArray[i * 3 + 2] = r * Math.cos(phi)

        const color = colors[Math.floor(Math.random() * colors.length)]
        colorArray[i * 3] = color.r
        colorArray[i * 3 + 1] = color.g
        colorArray[i * 3 + 2] = color.b
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
      
      return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity,
          sizeAttenuation: true
        })
      )
    }

    const starField = createStars(6000, 3, 15, 0.012, 0.8)
    const starGroup = new THREE.Group()
    starGroup.add(starField)
    scene.add(starGroup)
    
    // Outer glow effect only; remove the equator ring line for a cleaner globe

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
    let mouseX = 0, mouseY = 0
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      mouseX = (nx - 0.5) * 2
      mouseY = -(ny - 0.5) * 2
    }
    mount.addEventListener('mousemove', handleMouse)

    // Scroll zoom
    let targetZoom = camera.position.z
    const minZoom = 2.5
    const maxZoom = 4.5
    const handleWheel = (e) => {
      if (!enableZoom) return
      e.preventDefault()
      const delta = Math.sign(e.deltaY) * 0.3
      targetZoom = Math.min(maxZoom, Math.max(minZoom, targetZoom + delta))
    }
    mount.addEventListener('wheel', handleWheel, { passive: false })

    // Animation
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)

      // Smooth camera zoom
      if (enableZoom) {
        camera.position.z += (targetZoom - camera.position.z) * 0.08
      }

      globe.rotation.y += autoRotateSpeed + mouseX * 0.001
      globe.rotation.x += mouseY * 0.0005

      // Subtle star rotation for a more dynamic space effect
      starGroup.rotation.y += 0.0002
      starGroup.rotation.x += 0.0001

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
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [size, autoRotateSpeed, enableZoom])

  return <div ref={mountRef} className="w-full h-full" />
}
