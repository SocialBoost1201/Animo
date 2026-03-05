'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GoldDust({ count = 2000 }) {
  const points = useRef<THREE.Points>(null!)
  
  // Create random positions for particles
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15 // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 // z
    }
    return positions
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
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white/50">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <GoldDust count={3000} />
      </Canvas>
    </div>
  )
}
