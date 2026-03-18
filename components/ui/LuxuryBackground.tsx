'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePathname } from 'next/navigation'

function GoldDust({ count = 2000 }) {
  const points = useRef<THREE.Points>(null!)
  
  const [particlesPosition, setParticlesPosition] = useState<Float32Array | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      }
      setParticlesPosition(positions)
    }, 0)
    return () => clearTimeout(timer)
  }, [count])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02
      points.current.rotation.x += delta * 0.01
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5
    }
  })

  if (!particlesPosition) return null

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9a86a"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function LuxuryBackground() {
  const [particleCount, setParticleCount] = useState(3000)
  const pathname = usePathname()

  // /cast/* および /admin/* ではThree.jsを非描画（スマホ負荷対策）
  const isLightPage =
    pathname?.startsWith('/cast') || pathname?.startsWith('/admin')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setParticleCount(1000)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (isLightPage) {
    return <div className="fixed inset-0 z-[-1] pointer-events-none bg-white" />
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white/50">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={1}>
        <GoldDust count={particleCount} />
      </Canvas>
    </div>
  )
}
