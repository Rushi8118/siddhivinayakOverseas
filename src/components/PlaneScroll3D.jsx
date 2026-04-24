import { useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * PlaneScroll3D
 * ──────────────────────────────────────────────────────────────────────────
 * Scroll-driven 3D airplane that flies across the viewport from left → right
 * as the user scrolls the page. Sits as a fixed overlay, pointer-events-none
 * so it never blocks clicks.
 *
 * Design:
 *  - Airplane built from primitives (white fuselage, sky-blue wings, gold fin)
 *  - Scroll progress drives X (off-screen left → off-screen right)
 *  - Sine curve on scroll drives a gentle Y arc (climb then descend)
 *  - Subtle bank roll based on vertical velocity
 *  - Particle contrail with per-point shader-fade behind the plane
 *  - Respects prefers-reduced-motion
 *  - Hidden below md to protect mobile performance
 */
export default function PlaneScroll3D() {
  const mountRef = useRef(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    // Respect reduced-motion preference
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const mount = mountRef.current
    if (!mount) return

    // ── Scene / camera / renderer ───────────────────────────────────────────
    let w = window.innerWidth
    let h = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200)
    camera.position.z = 15

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.pointerEvents = 'none'

    // ── Lighting (bright, brand-aligned) ───────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.9))

    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(4, 6, 8)
    scene.add(key)

    const goldRim = new THREE.PointLight(0xd4af37, 0.75, 30)
    goldRim.position.set(-4, -3, 4)
    scene.add(goldRim)

    // ── Airplane (nose points along +X so it "flies right") ────────────────
    const plane = new THREE.Group()

    const whiteMat = new THREE.MeshPhongMaterial({
      color: 0xffffff, shininess: 90, specular: 0xaaaaaa,
    })
    const skyMat = new THREE.MeshPhongMaterial({
      color: 0x3a9bcb, shininess: 60,
    })
    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xd4af37, shininess: 110, specular: 0xffeeaa,
    })
    const darkMat = new THREE.MeshPhongMaterial({
      color: 0x0f2a44, shininess: 70,
    })

    // Fuselage
    const fuselage = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 1.7, 10, 18),
      whiteMat
    )
    fuselage.rotation.z = Math.PI / 2
    plane.add(fuselage)

    // Gold stripe along fuselage
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.285, 0.285, 1.7, 20, 1, true),
      goldMat
    )
    stripe.rotation.z = Math.PI / 2
    stripe.scale.y = 0.18
    plane.add(stripe)

    // Cockpit window
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 18, 12, 0, Math.PI),
      darkMat
    )
    cockpit.rotation.y = -Math.PI / 2
    cockpit.position.set(0.85, 0.09, 0)
    cockpit.scale.set(1, 0.55, 0.95)
    plane.add(cockpit)

    // Main wings
    const wings = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.06, 3.2),
      skyMat
    )
    plane.add(wings)

    // Gold wing accent
    const wingAccent = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.07, 3.25),
      goldMat
    )
    wingAccent.position.x = -0.25
    plane.add(wingAccent)

    // Horizontal stabiliser
    const hTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.05, 1.4),
      skyMat
    )
    hTail.position.x = -1.0
    plane.add(hTail)

    // Vertical fin (gold)
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.55, 0.06),
      goldMat
    )
    fin.position.set(-1.0, 0.3, 0)
    plane.add(fin)

    // Under-wing engines
    const engineGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.48, 18)
    const engineL = new THREE.Mesh(engineGeom, darkMat)
    engineL.rotation.z = Math.PI / 2
    engineL.position.set(0.05, -0.13, 0.95)
    plane.add(engineL)
    const engineR = engineL.clone()
    engineR.position.z = -0.95
    plane.add(engineR)

    plane.scale.setScalar(1.55)
    plane.position.set(-1000, 0, 0) // park off-screen until first tick
    scene.add(plane)

    // ── Contrail (GPU particle system with per-point age) ──────────────────
    const N = 130
    const positions = new Float32Array(N * 3)
    const ages = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      positions[i * 3] = 9999
      positions[i * 3 + 1] = 9999
      positions[i * 3 + 2] = 9999
      ages[i] = 1
    }

    const trailGeom = new THREE.BufferGeometry()
    trailGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    trailGeom.setAttribute('aAge', new THREE.BufferAttribute(ages, 1))

    const trailMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        attribute float aAge;
        varying float vAge;
        uniform float uPixelRatio;
        void main() {
          vAge = clamp(aAge, 0.0, 1.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float base = mix(28.0, 4.0, vAge);
          gl_PointSize = base * uPixelRatio * (10.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAge;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float soft = smoothstep(0.5, 0.0, d);
          float alpha = soft * (1.0 - vAge) * 0.72;
          vec3 col = mix(vec3(0.96, 0.98, 1.0), vec3(0.85, 0.93, 1.0), vAge);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })

    const trail = new THREE.Points(trailGeom, trailMat)
    scene.add(trail)

    // ── Scroll progress (0..1 over full document) ──────────────────────────
    const updateScroll = () => {
      const doc = document.documentElement
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / max))
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      trailMat.uniforms.uPixelRatio.value = renderer.getPixelRatio()
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ─────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let cursor = 0
    let curX = -1000
    let curY = 0
    let lastTgtY = 0
    let frameId

    const tick = () => {
      frameId = requestAnimationFrame(tick)
      const dt = Math.min(0.05, clock.getDelta())
      const t = clock.elapsedTime
      const p = scrollRef.current

      // Visible world extents at camera.z
      const visHeight =
        2 * Math.tan((camera.fov * 0.5) * (Math.PI / 180)) * camera.position.z
      const visWidth = visHeight * camera.aspect

      // Target position: X spans a little beyond both edges so it enters/exits
      const tgtX = THREE.MathUtils.lerp(-visWidth / 2 - 5, visWidth / 2 + 5, p)
      // Y arcs: climb then descend; tiny float adds life
      const tgtY =
        Math.sin(p * Math.PI) * (visHeight * 0.18) +
        Math.sin(t * 1.4) * 0.12

      // First frame snap
      if (curX < -900) curX = tgtX

      curX += (tgtX - curX) * 0.12
      curY += (tgtY - curY) * 0.1
      plane.position.set(curX, curY, 0)

      // Bank + pitch from vertical velocity
      const vy = tgtY - lastTgtY
      lastTgtY = tgtY
      plane.rotation.z =
        THREE.MathUtils.clamp(vy * 3.0, -0.25, 0.25) + Math.sin(t * 1.2) * 0.02
      plane.rotation.x = -vy * 1.5
      plane.rotation.y = Math.sin(t * 0.7) * 0.03

      // Spawn contrail particles while flight is in view
      if (p > 0.002 && p < 0.998) {
        const burst = 2
        for (let k = 0; k < burst; k++) {
          const idx = cursor % N
          positions[idx * 3] = curX - 2.05 + (Math.random() - 0.5) * 0.25
          positions[idx * 3 + 1] = curY + (Math.random() - 0.5) * 0.35
          positions[idx * 3 + 2] = (Math.random() - 0.5) * 0.3
          ages[idx] = 0
          cursor++
        }
      }

      // Age + drift existing particles
      for (let i = 0; i < N; i++) {
        if (ages[i] < 1) {
          ages[i] += dt * 0.55
          positions[i * 3] -= 1.25 * dt // drift backward
          positions[i * 3 + 1] += 0.22 * dt // drift upward
        } else {
          positions[i * 3] = 9999 // park
        }
      }
      trailGeom.attributes.position.needsUpdate = true
      trailGeom.attributes.aAge.needsUpdate = true

      renderer.render(scene, camera)
    }
    tick()

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', onResize)
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement)
      renderer.dispose()
      plane.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
      trailGeom.dispose()
      trailMat.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 20 }}
      aria-hidden="true"
    />
  )
}
