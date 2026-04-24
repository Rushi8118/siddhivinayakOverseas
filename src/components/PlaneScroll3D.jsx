import { useRef, useEffect } from 'react'
import * as THREE from 'three'

/**
 * PlaneScroll3D
 * ──────────────────────────────────────────────────────────────────────────
 * Scroll-driven 3D airliner. The plane enters from the bottom-left on scroll
 * start and arrives at the top-right exactly when the `#destinations` section
 * enters the viewport. Fixed full-viewport overlay, pointer-events-none,
 * respects prefers-reduced-motion.
 *
 * Realism details:
 *  - Capsule fuselage with tapered nose + tail cones
 *  - Glossy dark cockpit windshield (clearcoat-like shading)
 *  - Row of passenger windows on both sides
 *  - Swept tapered wings via ExtrudeGeometry
 *  - Twin under-wing turbofan engines with dark intake + exhaust rings
 *  - Vertical tail fin with brand livery + gold accent stripe
 *  - Horizontal stabilisers
 *  - Red/green wing-tip navigation lights (emissive)
 *  - Gold belly stripe in brand palette
 */
export default function PlaneScroll3D() {
  const mountRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
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
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200)
    camera.position.z = 14

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.pointerEvents = 'none'

    // ── Lighting (bright daytime, brand tint) ──────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.75))

    const key = new THREE.DirectionalLight(0xffffff, 1.35)
    key.position.set(5, 6, 8)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xbfd9ec, 0.55)
    fill.position.set(-6, -2, -3)
    scene.add(fill)

    const goldRim = new THREE.PointLight(0xd4af37, 0.7, 30)
    goldRim.position.set(-3, -3, 5)
    scene.add(goldRim)

    const hemi = new THREE.HemisphereLight(0xffffff, 0xd7e7f3, 0.45)
    scene.add(hemi)

    // ── Materials ──────────────────────────────────────────────────────────
    const mFuselage = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, metalness: 0.5, roughness: 0.3,
    })
    const mBelly = new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 0.75, roughness: 0.25,
    })
    const mFin = new THREE.MeshStandardMaterial({
      color: 0x3a9bcb, metalness: 0.45, roughness: 0.35,
    })
    const mAccent = new THREE.MeshStandardMaterial({
      color: 0xd4af37, metalness: 0.8, roughness: 0.2,
    })
    const mEngine = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, metalness: 0.85, roughness: 0.2,
    })
    const mEngineDark = new THREE.MeshStandardMaterial({
      color: 0x0f172a, metalness: 0.7, roughness: 0.5,
    })
    const mCockpit = new THREE.MeshPhysicalMaterial({
      color: 0x0f2a44, metalness: 0.95, roughness: 0.08,
      clearcoat: 1, clearcoatRoughness: 0.05,
    })
    const mWindow = new THREE.MeshStandardMaterial({
      color: 0x0b1b3a, metalness: 0.9, roughness: 0.1,
      emissive: 0x08162d, emissiveIntensity: 0.25,
    })
    const mNavGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.8,
    })
    const mNavRed = new THREE.MeshStandardMaterial({
      color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.8,
    })

    // ── Build realistic airliner ───────────────────────────────────────────
    // Nose points along +X so the plane "flies to the right".
    const plane = new THREE.Group()

    // Fuselage (main tube)
    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 3.0, 32),
      mFuselage,
    )
    fuselage.rotation.z = Math.PI / 2
    plane.add(fuselage)

    // Nose cone (front, +X)
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.7, 32),
      mFuselage,
    )
    nose.position.set(1.85, 0, 0)
    nose.rotation.z = -Math.PI / 2
    plane.add(nose)

    // Tail cone (rear, -X) — longer + tapered
    const tailCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.95, 32),
      mFuselage,
    )
    tailCone.position.set(-1.97, 0.05, 0)
    tailCone.rotation.z = Math.PI / 2
    plane.add(tailCone)

    // Cockpit windshield (dark glossy dome near nose)
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      mCockpit,
    )
    cockpit.position.set(1.55, 0.1, 0)
    cockpit.rotation.z = -Math.PI / 2
    plane.add(cockpit)

    // Belly gold livery stripe (partial cylinder shell along underside)
    const belly = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.283, 0.283, 2.6, 32, 1, true,
        Math.PI * 1.25, Math.PI * 0.5,
      ),
      mBelly,
    )
    belly.rotation.z = Math.PI / 2
    plane.add(belly)

    // Passenger windows — two rows along fuselage
    const windowCount = 22
    for (let i = 0; i < windowCount; i++) {
      const t = i / (windowCount - 1)
      const x = THREE.MathUtils.lerp(-1.35, 1.25, t)
      const winR = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.05, 0.015),
        mWindow,
      )
      winR.position.set(x, 0.08, 0.272)
      plane.add(winR)
      const winL = winR.clone()
      winL.position.z = -0.272
      plane.add(winL)
    }

    // ── Swept, tapered main wings (ExtrudeGeometry) ────────────────────────
    const wingShape = new THREE.Shape()
    wingShape.moveTo(0, 0.35)        // leading root
    wingShape.lineTo(1.95, 0.05)     // leading tip (swept back)
    wingShape.lineTo(2.1, -0.12)     // tip trailing
    wingShape.lineTo(0, -0.45)       // trailing root
    wingShape.lineTo(0, 0.35)
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 6,
    })
    wingGeo.translate(0, 0, -0.03)

    const wingR = new THREE.Mesh(wingGeo, mFuselage)
    wingR.position.set(-0.15, -0.08, 0.28)
    wingR.rotation.x = Math.PI / 2
    plane.add(wingR)

    const wingL = new THREE.Mesh(wingGeo, mFuselage)
    wingL.position.set(-0.15, -0.08, -0.28)
    wingL.rotation.x = -Math.PI / 2
    wingL.rotation.z = Math.PI
    plane.add(wingL)

    // Wing-tip navigation lights
    const navR = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      mNavGreen,
    )
    navR.position.set(-0.15, -0.05, 2.25)
    plane.add(navR)
    const navL = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      mNavRed,
    )
    navL.position.set(-0.15, -0.05, -2.25)
    plane.add(navL)

    // ── Under-wing turbofan engines ────────────────────────────────────────
    const buildEngine = (z) => {
      const g = new THREE.Group()

      const nacelle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.13, 0.62, 24),
        mEngine,
      )
      nacelle.rotation.z = Math.PI / 2
      g.add(nacelle)

      const intake = new THREE.Mesh(
        new THREE.CylinderGeometry(0.155, 0.155, 0.06, 24),
        mEngineDark,
      )
      intake.rotation.z = Math.PI / 2
      intake.position.x = 0.31
      g.add(intake)

      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.01, 18),
        mEngineDark,
      )
      fan.rotation.z = Math.PI / 2
      fan.position.x = 0.29
      g.add(fan)

      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.085, 0.1, 18),
        mEngineDark,
      )
      exhaust.rotation.z = Math.PI / 2
      exhaust.position.x = -0.33
      g.add(exhaust)

      // Pylon (connector to wing)
      const pylon = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.18, 0.05),
        mFuselage,
      )
      pylon.position.y = 0.16
      g.add(pylon)

      g.position.set(0.1, -0.32, z)
      return g
    }
    plane.add(buildEngine(0.98))
    plane.add(buildEngine(-0.98))

    // ── Vertical tail fin ──────────────────────────────────────────────────
    const finShape = new THREE.Shape()
    finShape.moveTo(0, 0)
    finShape.lineTo(-0.55, 0.95)
    finShape.lineTo(-0.2, 0.95)
    finShape.lineTo(0.55, 0)
    finShape.lineTo(0, 0)
    const finGeo = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    })
    finGeo.translate(0, 0, -0.025)
    const fin = new THREE.Mesh(finGeo, mFin)
    fin.position.set(-1.55, 0.25, 0)
    fin.rotation.y = -Math.PI / 2
    plane.add(fin)

    // Gold accent on fin leading edge
    const finAccent = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.04, 0.065),
      mAccent,
    )
    finAccent.position.set(-1.4, 0.7, 0)
    finAccent.rotation.z = -0.55
    plane.add(finAccent)

    // ── Horizontal stabilisers ─────────────────────────────────────────────
    const hStabShape = new THREE.Shape()
    hStabShape.moveTo(0, 0.18)
    hStabShape.lineTo(0.95, 0.04)
    hStabShape.lineTo(1.0, -0.04)
    hStabShape.lineTo(0, -0.22)
    hStabShape.lineTo(0, 0.18)
    const hStabGeo = new THREE.ExtrudeGeometry(hStabShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    })
    hStabGeo.translate(0, 0, -0.025)

    const hStabR = new THREE.Mesh(hStabGeo, mFuselage)
    hStabR.position.set(-1.55, 0.12, 0.12)
    hStabR.rotation.x = Math.PI / 2
    plane.add(hStabR)

    const hStabL = new THREE.Mesh(hStabGeo, mFuselage)
    hStabL.position.set(-1.55, 0.12, -0.12)
    hStabL.rotation.x = -Math.PI / 2
    hStabL.rotation.z = Math.PI
    plane.add(hStabL)

    plane.scale.setScalar(1.4)
    plane.position.set(-1000, 0, 0) // parked off-screen initially
    scene.add(plane)

    // ── Contrail (GPU particles with per-point age) ────────────────────────
    const N = 140
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
      uniforms: { uPixelRatio: { value: renderer.getPixelRatio() } },
      vertexShader: /* glsl */ `
        attribute float aAge;
        varying float vAge;
        uniform float uPixelRatio;
        void main() {
          vAge = clamp(aAge, 0.0, 1.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float base = mix(32.0, 4.0, vAge);
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
          float alpha = soft * (1.0 - vAge) * 0.7;
          vec3 col = mix(vec3(0.97, 0.99, 1.0), vec3(0.82, 0.92, 1.0), vAge);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })
    const trail = new THREE.Points(trailGeom, trailMat)
    scene.add(trail)

    // ── Scroll-progress anchored to #destinations section ──────────────────
    // Flight starts almost immediately (50px buffer) and ends when the
    // destinations section top crosses 80% of viewport height.
    const updateScroll = () => {
      const startScroll = 50
      const target = document.getElementById('destinations')
      const scrollY = window.scrollY || window.pageYOffset || 0
      const vh = window.innerHeight || 800

      let endScroll
      if (target) {
        const rect = target.getBoundingClientRect()
        const sectionTopAbs = rect.top + scrollY
        endScroll = sectionTopAbs - vh * 0.8
      } else {
        endScroll = startScroll + vh * 1.2
      }

      const range = Math.max(200, endScroll - startScroll)
      const raw = (scrollY - startScroll) / range
      progressRef.current = Math.min(1, Math.max(0, raw))
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
      updateScroll()
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ─────────────────────────────────────────────────────
    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

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
      const pRaw = progressRef.current
      const p = easeInOut(pRaw)

      // Visible world extents at camera.z
      const visHeight =
        2 * Math.tan((camera.fov * 0.5) * (Math.PI / 180)) * camera.position.z
      const visWidth = visHeight * camera.aspect

      // Fly from bottom-left (off-screen) to top-right (off-screen),
      // with a pronounced arc to sell the "takeoff" feeling.
      const startX = -visWidth / 2 - 3
      const endX = visWidth / 2 + 3
      const startY = -visHeight * 0.28
      const endY = visHeight * 0.34

      const tgtX = THREE.MathUtils.lerp(startX, endX, p)
      // Arc lift peaks mid-flight to give extra altitude
      const arc = Math.sin(p * Math.PI) * (visHeight * 0.1)
      const tgtY =
        THREE.MathUtils.lerp(startY, endY, p) +
        arc +
        Math.sin(t * 1.4) * 0.08

      if (curX < -900) {
        curX = tgtX
        curY = tgtY
      }
      curX += (tgtX - curX) * 0.14
      curY += (tgtY - curY) * 0.12
      plane.position.set(curX, curY, 0)

      // Bank + pitch from vertical velocity
      const vy = tgtY - lastTgtY
      lastTgtY = tgtY
      plane.rotation.z =
        THREE.MathUtils.clamp(vy * 2.8, -0.28, 0.28) + Math.sin(t * 1.2) * 0.02
      plane.rotation.x = THREE.MathUtils.clamp(-vy * 1.4, -0.22, 0.22)
      plane.rotation.y = Math.sin(t * 0.7) * 0.03

      // Pulse nav lights
      const pulse = 0.6 + 0.4 * (Math.sin(t * 6) * 0.5 + 0.5)
      mNavGreen.emissiveIntensity = 1.2 + pulse
      mNavRed.emissiveIntensity = 1.2 + pulse

      // Spawn contrail particles only while in flight range
      if (pRaw > 0.002 && pRaw < 0.998) {
        const burst = 2
        for (let k = 0; k < burst; k++) {
          const idx = cursor % N
          positions[idx * 3] = curX - 2.2 + (Math.random() - 0.5) * 0.2
          positions[idx * 3 + 1] = curY + (Math.random() - 0.5) * 0.3
          positions[idx * 3 + 2] = (Math.random() - 0.5) * 0.3
          ages[idx] = 0
          cursor++
        }
      }

      // Age + drift particles
      for (let i = 0; i < N; i++) {
        if (ages[i] < 1) {
          ages[i] += dt * 0.55
          positions[i * 3] -= 1.2 * dt
          positions[i * 3 + 1] += 0.22 * dt
        } else {
          positions[i * 3] = 9999
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
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      plane.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
          else o.material.dispose()
        }
      })
      trailGeom.dispose()
      trailMat.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  )
}
