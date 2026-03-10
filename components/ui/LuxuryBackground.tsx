'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GoldDust({ count = 2000 }) {
  const points = useRef<THREE.Points>(null!)
  
  // Create random positions for particles
  const [particlesPosition, setParticlesPosition] = useState<Float32Array | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15 // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15 // z
      }
      setParticlesPosition(positions)
    }, 0)
    return () => clearTimeout(timer)
  }, [count])

  // Slowly rotate the whole particle system
  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02
      points.current.rotation.x += delta * 0.01
      // Make them float up slowly
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

  useEffect(() => {
    // スマホなど画面幅が狭い場合はパーティクルを3分の1に減らして負荷軽減
    // set-state-in-effectによるカスケードレンダリングを避けるため遅延させる
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setParticleCount(1000)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white/50">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={1}>
        <GoldDust count={particleCount} />
      </Canvas>
    </div>
  )
}

