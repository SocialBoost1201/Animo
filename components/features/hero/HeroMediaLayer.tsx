'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeroMedia } from './types';
import { useScroll } from 'framer-motion';
import Image from 'next/image';

interface HeroMediaLayerProps {
  media: HeroMedia[];
  activeIndex: number;
  transitionMode: string;
  transitionMs: number;
  isReducedMotion: boolean;
}

// ─────────────────────────────────────────────────────────────
// カスタムシェーダー（水面の波紋トランジション ＋ スクロール歪み）
// ─────────────────────────────────────────────────────────────
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float progress;
uniform float scrollVelocity;
uniform vec2 uResolution;
uniform vec2 uMedia1Resolution;
uniform vec2 uMedia2Resolution;
varying vec2 vUv;

vec2 getFitUv(vec2 uv, vec2 resolution, vec2 mediaResolution) {
  float rs = resolution.x / max(resolution.y, 0.001);
  float ms = mediaResolution.x / max(mediaResolution.y, 0.001);
  
  float scaleX = 1.0;
  float scaleY = 1.0;
  
  if (resolution.x < 768.0) {
    // Mobile: contain (動画が欠けないように全体を収める)
    if (rs > ms) {
      scaleX = ms / rs;
    } else {
      scaleY = rs / ms;
    }
  } else {
    // PC: cover (画面いっぱいに広げる)
    if (rs > ms) {
      scaleY = rs / ms;
    } else {
      scaleX = ms / rs;
    }
  }
  
  return (uv - 0.5) / vec2(scaleX, scaleY) + 0.5;
}

void main() {
  vec2 uv = vUv;
  
  vec2 uv1 = getFitUv(uv, uResolution, uMedia1Resolution);
  vec2 uv2 = getFitUv(uv, uResolution, uMedia2Resolution);
  
  float aspectRatio = uResolution.x / max(uResolution.y, 0.001);
  vec2 dir = uv - vec2(0.5);
  vec2 correctedDir = dir * vec2(aspectRatio, 1.0);
  float dist = length(correctedDir);
  
  float ripple = 0.0;
  float scrollDistortion = 0.0;
  
  if (uResolution.x >= 768.0) {
    // PC: リッチな波紋とスクロール歪みエフェクト
    ripple = sin(dist * 20.0 - progress * 15.0) * 0.05 * sin(progress * 3.14159);
    scrollDistortion = sin(uv.y * 10.0 + scrollVelocity) * 0.01 * min(abs(scrollVelocity) * 0.1, 0.05);
  } else {
    // Mobile: パフォーマンス優先で簡略化されたエフェクト
    ripple = sin(dist * 10.0 - progress * 10.0) * 0.02 * sin(progress * 3.14159);
    // スクロール歪みはモバイルではオフにしてガタつきを防止
  }

  
  vec2 offset = dir * ripple + vec2(scrollDistortion, 0.0);
  
  vec2 finalUv1 = uv1 + offset;
  vec2 finalUv2 = uv2 - offset;
  
  vec4 color1 = texture2D(texture1, clamp(finalUv1, 0.0, 1.0));
  if (finalUv1.x < 0.0 || finalUv1.x > 1.0 || finalUv1.y < 0.0 || finalUv1.y > 1.0) {
    color1 = vec4(0.0, 0.0, 0.0, 1.0); // レターボックスは黒で埋める
  }
  
  vec4 color2 = texture2D(texture2, clamp(finalUv2, 0.0, 1.0));
  if (finalUv2.x < 0.0 || finalUv2.x > 1.0 || finalUv2.y < 0.0 || finalUv2.y > 1.0) {
    color2 = vec4(0.0, 0.0, 0.0, 1.0);
  }
  
  gl_FragColor = mix(color1, color2, progress);
}
`;

// キャッシュ用ビデオエレメント管理
const videoCache = new Map<string, HTMLVideoElement>();
const getVideo = (src: string) => {
  if (videoCache.has(src)) return videoCache.get(src)!;
  const v = document.createElement('video');
  v.src = src;
  v.crossOrigin = 'anonymous';
  v.loop = true;
  v.muted = true;
  v.playsInline = true;
  v.load();
  videoCache.set(src, v);
  return v;
};

// ─── 実際の描画シーン ───────────────────────────────────────────
const WebGLScene = ({
  media,
  activeIndex,
  transitionMs,
}: {
  media: HeroMedia[];
  activeIndex: number;
  transitionMs: number;
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [prevIndex, setPrevIndex] = useState(activeIndex);
  
  // テクスチャ管理
  const tex1Ref = useRef<THREE.VideoTexture | THREE.Texture | null>(null);
  const tex2Ref = useRef<THREE.VideoTexture | THREE.Texture | null>(null);
  
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const velocity = useRef(0);

  // 解像度を更新するヘルパー
  const updateMediaResolution = (item: HeroMedia, uniformName: 'uMedia1Resolution' | 'uMedia2Resolution') => {
    if (item.type === 'video') {
      const v = getVideo(item.url);
      const update = () => {
        if (v.videoWidth > 0 && materialRef.current) {
          materialRef.current.uniforms[uniformName].value.set(v.videoWidth, v.videoHeight);
        }
      };
      if (v.readyState >= 1) update();
      else v.addEventListener('loadedmetadata', update, { once: true });
    } else {
      const img = new window.Image();
      img.onload = () => {
        if (materialRef.current) {
          materialRef.current.uniforms[uniformName].value.set(img.width, img.height);
        }
      };
      img.src = item.url;
    }
  };

  // 初回マウント時に現在のアクティブテクスチャをロード
  useEffect(() => {
    const item = media[activeIndex];
    if (item.type === 'video') {
      const v = getVideo(item.url);
      v.play().catch(() => {});
      tex1Ref.current = new THREE.VideoTexture(v);
      tex1Ref.current.generateMipmaps = false;
      tex1Ref.current.minFilter = THREE.LinearFilter;
      tex1Ref.current.magFilter = THREE.LinearFilter;
    } else {
      const loader = new THREE.TextureLoader();
      tex1Ref.current = loader.load(item.url);
    }
    
    updateMediaResolution(item, 'uMedia1Resolution');
    updateMediaResolution(item, 'uMedia2Resolution');

    if (materialRef.current) {
      materialRef.current.uniforms.texture1.value = tex1Ref.current;
      materialRef.current.uniforms.texture2.value = tex1Ref.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // activeIndexが変化した時のトランジション制御
  useEffect(() => {
    if (activeIndex === prevIndex) return;

    const prevItem = media[prevIndex];
    if (prevItem.type === 'video') {
       // トランジション前に前の動画が動いていることを担保
       const v = getVideo(prevItem.url);
       tex1Ref.current = new THREE.VideoTexture(v);
    }
    
    const nextItem = media[activeIndex];
    let nextTex: THREE.Texture;
    if (nextItem.type === 'video') {
      const v = getVideo(nextItem.url);
      v.currentTime = 0;
      v.play().catch(() => {});
      nextTex = new THREE.VideoTexture(v);
    } else {
      const loader = new THREE.TextureLoader();
      nextTex = loader.load(nextItem.url);
    }
    
    updateMediaResolution(nextItem, 'uMedia2Resolution');
    
    if (materialRef.current) {
      materialRef.current.uniforms.texture1.value = tex1Ref.current;
      materialRef.current.uniforms.texture2.value = nextTex;
      materialRef.current.uniforms.progress.value = 0.0;
    }
    tex2Ref.current = nextTex;

    // アニメーションループでprogressを進める
    const startTime = performance.now();
    let animationFrame: number;

    const animateProgress = (now: number) => {
      const elapsed = now - startTime;
      let p = elapsed / transitionMs;
      if (p >= 1.0) {
        p = 1.0;
        setPrevIndex(activeIndex);
        tex1Ref.current = nextTex;
        if (materialRef.current) {
          materialRef.current.uniforms.texture1.value = nextTex;
          materialRef.current.uniforms.uMedia1Resolution.value.copy(materialRef.current.uniforms.uMedia2Resolution.value);
          materialRef.current.uniforms.progress.value = 0.0;
        }
        // 前の動画を停止（メモリ・負荷対策）
        if (prevItem.type === 'video') {
          const v = getVideo(prevItem.url);
          v.pause();
        }
      } else {
        // イージング (easeOutQuart)
        const easeP = 1 - Math.pow(1 - p, 4);
        if (materialRef.current) {
          materialRef.current.uniforms.progress.value = easeP;
        }
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };
    animationFrame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [activeIndex, prevIndex, media, transitionMs]);

  useFrame((state) => {
    // スクロールベロシティ計算
    const currentScrollY = scrollY.get();
    const diff = currentScrollY - lastScrollY.current;
    
    // スムージングしてベロシティを更新
    velocity.current = velocity.current * 0.9 + diff * 0.1;
    lastScrollY.current = currentScrollY;

    if (materialRef.current) {
      // 画面比率の更新
      materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
      
      // スクロールによる歪みパラメータの更新（微細に揺らす）
      materialRef.current.uniforms.scrollVelocity.value = state.clock.elapsedTime * 5.0 + velocity.current * 0.1;
      
      // スクロール速度に連動して動画の再生速度も倍率制御
      const currentItem = media[activeIndex];
      if (currentItem.type === 'video') {
         const v = getVideo(currentItem.url);
         // スクロールが速いほど動画再生も加速（1.0 ~ 2.0倍）
         const targetRate = 1.0 + Math.min(Math.abs(velocity.current) * 0.01, 1.0);
         v.playbackRate = v.playbackRate + (targetRate - v.playbackRate) * 0.1; // 滑らかに追従
      }
    }
  });

  const uniforms = useMemo(() => ({
    texture1: { value: null },
    texture2: { value: null },
    progress: { value: 0.0 },
    scrollVelocity: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMedia1Resolution: { value: new THREE.Vector2(1920, 1080) },
    uMedia2Resolution: { value: new THREE.Vector2(1920, 1080) },
  }), []);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export const HeroMediaLayer: React.FC<HeroMediaLayerProps> = ({
  media,
  activeIndex,
  transitionMode,
  transitionMs,
  isReducedMotion,
}) => {
  if (media.length === 0) {
    return <div className="absolute inset-0 bg-gray-900" />;
  }

  // ripple モードのみ WebGL シェーダーを使用
  const useWebGL = transitionMode === 'ripple' || transitionMode === 'fade';

  // 負荷軽減 or CSS モードの場合はCSSベースで描画
  if (isReducedMotion || !useWebGL) {
    return (
      <CSSHeroTransition
        media={media}
        activeIndex={activeIndex}
        transitionMode={transitionMode}
        transitionMs={transitionMs}
        isReducedMotion={isReducedMotion}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
      {media.length > 0 && media[0].type === 'image' && (
        <Image
          src={media[0].url}
          alt="Hero Background LCP"
          fill
          priority
          sizes="100vw"
          className="opacity-0 pointer-events-none"
        />
      )}
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ powerPreference: 'high-performance', alpha: false, antialias: false }}
        dpr={1}
      >
        <WebGLScene
          media={media}
          activeIndex={activeIndex}
          transitionMs={transitionMs}
        />
      </Canvas>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CSS ベーストランジション（slide / zoom / burn / fade）
// ─────────────────────────────────────────────────────────────
function CSSHeroTransition({
  media,
  activeIndex,
  transitionMode,
  transitionMs,
}: {
  media: HeroMedia[];
  activeIndex: number;
  transitionMode: string;
  transitionMs: number;
  isReducedMotion: boolean;
}) {
  const durationSec = `${transitionMs / 1000}s`;

  const getEnterStyle = (): React.CSSProperties => {
    switch (transitionMode) {
      case 'slide': return { transform: 'translateX(0)', opacity: 1 };
      case 'zoom':  return { transform: 'scale(1)',      opacity: 1 };
      case 'burn':  return { filter: 'brightness(1)',   opacity: 1 };
      default:      return { opacity: 1 };
    }
  };

  const getExitStyle = (): React.CSSProperties => {
    switch (transitionMode) {
      case 'slide': return { transform: 'translateX(-5%)',  opacity: 0 };
      case 'zoom':  return { transform: 'scale(1.08)',      opacity: 0 };
      case 'burn':  return { filter: 'brightness(3)',       opacity: 0 };
      default:      return { opacity: 0 };
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
      {media.map((item, i) => {
        const isActive = i === activeIndex;
        const style: React.CSSProperties = {
          position: 'absolute',
          inset: 0,
          transition: `all ${durationSec} cubic-bezier(0.4, 0, 0.2, 1)`,
          ...(isActive ? getEnterStyle() : getExitStyle()),
        };

        return (
          <div key={item.id} style={style}>
            {item.type === 'video' ? (
              <video
                src={item.url}
                poster={item.posterUrl}
                autoPlay={isActive}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={item.url}
                alt={item.title ?? 'Hero Background'}
                fill
                priority={i === 0}
                className="object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
