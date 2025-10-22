'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { XR, ARButton } from '@react-three/xr'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function MachineModel({ scale, position }: { scale: number; position: [number, number, number] }) {
  const { scene } = useGLTF('https://d4olfypp2qmmqbyx.public.blob.vercel-storage.com/Machine_Updated-eOpAysCMZk4FOaAUCoGXCnvtJx4JSM.glb')
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={[scale, scale, scale]}
    />
  )
}

export default function WebXRARViewer() {
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState<[number, number, number]>([0, 0, -1])

  useEffect(() => {
    setMounted(true)
  }, [])

  const resetSize = () => setScale(1)
  const recenter = () => setPosition([0, 0, -1])

  if (!mounted) return null // Wait until mount

  return (
    <div className="w-full h-screen relative bg-black text-white">
      {/* ✅ AR Button */}
      <ARButton
        sessionInit={{
          requiredFeatures: ['hit-test', 'local-floor'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body },
        }}
        className="z-50"
      />

      {/* ✅ Canvas + XR */}
      <Canvas>
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1.2} />
          <Suspense fallback={null}>
            <MachineModel scale={scale} position={position} />
            <Environment preset="sunset" />
          </Suspense>
        </XR>
      </Canvas>

      {/* ✅ AR Controls */}
      <div className="absolute bottom-6 right-4 flex flex-col space-y-3 z-50">
        <button
          onClick={resetSize}
          className="bg-yellow-500 px-4 py-2 rounded text-sm font-semibold shadow-lg"
        >
          🔁 Reset Size
        </button>
        <button
          onClick={recenter}
          className="bg-green-600 px-4 py-2 rounded text-sm font-semibold shadow-lg"
        >
          📍 Recenter
        </button>
      </div>
    </div>
  )
}
