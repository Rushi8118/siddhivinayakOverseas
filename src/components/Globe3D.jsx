import { useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * Premium 3D Globe for Siddhivinayak Overseas.
 * - Transparent background that blends with the light sky hero.
 * - Earth texture + bump map with warm gold rim light + soft sky ambient.
 * - Subtle orbiting highlight particles instead of a harsh starfield, so it fits a bright UI.
 */
export default function Globe3D({ size = 520, autoRotateSpeed = 0.0022, enableZoom = true }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width  = mount.clientWidth  || size
    const height = mount.clientHeight || size

    // Scene
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 2.6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Globe sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    const bumpMap      = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png')

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      shininess: 6,
      specular: new THREE.Color(0x3A9BCB),
    })

    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Soft glow halo (sprite-less, using a back-side sphere with transparent gradient shader-lite)
    const haloGeo = new THREE.SphereGeometry(1.12, 64, 64)
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        uColor: { value: new THREE.Color('#87CEEB') },
      },
      vertexShader: `
        varying float vIntensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vIntensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vIntensity;
        void main() {
          gl_FragColor = vec4(uColor, 1.0) * vIntensity;
        }
      `,
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    scene.add(halo)

    // Sparse warm highlight particles (not a space starfield — more like shimmering air particles)
    const createParticles = (count, radiusMin, radiusMax, size, opacity) => {
      const geom = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors    = new Float32Array(count * 3)
      const gold = new THREE.Color('#D4AF37')
      const sky  = new THREE.Color('#87CEEB')
      const white = new THREE.Color('#ffffff')
      const choices = [gold, sky, white]

      for (let i = 0; i < count; i++) {
        const r     = radiusMin + Math.random() * (radiusMax - radiusMin)
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = r * Math.cos(phi)
        const c = choices[Math.floor(Math.random() * choices.length)]
        colors[i * 3]     = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
      return new THREE.Points(
        geom,
        new THREE.PointsMaterial({
          size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true,
          blending: THREE.AdditiveBlending, depthWrite: false,
        })
      )
    }

    const particles = createParticles(900, 1.8, 4.5, 0.016, 0.7)
    const particleGroup = new THREE.Group()
    particleGroup.add(particles)
    scene.add(particleGroup)

    // Lighting: gold rim, sky fill, soft ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const goldLight = new THREE.DirectionalLight(0xfbbf24, 1.6)
    goldLight.position.set(5, 3, 5)
    scene.add(goldLight)

    const skyLight = new THREE.PointLight(0x87ceeb, 1.2, 12)
    skyLight.position.set(-3, -2, -3)
    scene.add(skyLight)

    // Mouse parallax
    let mouseX = 0, mouseY = 0
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      mouseX = (nx - 0.5) * 2
      mouseY = -(ny - 0.5) * 2
    }
    mount.addEventListener('mousemove', handleMouse)

    // Wheel zoom
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

    // Animate
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (enableZoom) camera.position.z += (targetZoom - camera.position.z) * 0.08
      globe.rotation.y += autoRotateSpeed + mouseX * 0.0009
      globe.rotation.x += mouseY * 0.0004
      halo.rotation.y  += autoRotateSpeed * 0.5
      particleGroup.rotation.y += 0.0004
      particleGroup.rotation.x += 0.00015
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
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      haloGeo.dispose()
      haloMat.dispose()
    }
  }, [size, autoRotateSpeed, enableZoom])

  return <div ref={mountRef} className="w-full h-full" aria-label="Interactive 3D globe showing global study destinations" role="img" />
}
