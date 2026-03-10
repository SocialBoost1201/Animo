'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PointMaterial, Points } from '@react-three/drei';

interface ParticlesProps {
  count?: number;
  color?: string;
}

const ParticleField: React.FC<ParticlesProps> = ({
  count = 2000,
  color = '#c9a86a' // default gold
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // 初回マウント時のみ乱数を生成してパーティクルの初期位置を計算する
  const [particles] = useState(() => {
    const fixedCount = 300; // Use a fixed count for particle generation
    const p = new Float32Array(fixedCount * 3);
    for (let i = 0; i < fixedCount; i++) {
      const radius = 2 + Math.random() * 8; // 半径
      const theta = Math.random() * 2 * Math.PI; // 角度
      const phi = Math.acos(2 * Math.random() - 1); // 仰角

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // ゆっくりと全体を回転させる
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const LuxuryParticles: React.FC<{
  color?: string;
  count?: number;
  className?: string;
}> = ({ color, count, className }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-50 ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 8] }} gl={{ alpha: true, antialias: false }}>
        <ParticleField color={color} count={count} />
      </Canvas>
    </div>
  );
};
