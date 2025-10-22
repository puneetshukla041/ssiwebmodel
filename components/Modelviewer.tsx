'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

function MachineModel({
  rotating,
  resetSignal,
  recenterSignal,
}: {
  rotating: boolean
  resetSignal: boolean
  recenterSignal: boolean
}) {
  const gltf = useGLTF('/models/Machine 1.glb')
  const modelRef = useRef<THREE.Group>(null)

  // Rotation
  useFrame(() => {
    if (rotating && modelRef.current) {
      modelRef.current.rotation.y += 0.01
    }
  })

  // Reset model to default scale & position
  if (resetSignal && modelRef.current) {
    modelRef.current.scale.set(0.5, 0.5, 0.5)
    modelRef.current.position.set(0, 0, 0)
    modelRef.current.rotation.set(0, 0, 0)
  }

  // Move model in front of camera
  if (recenterSignal && modelRef.current) {
    modelRef.current.position.set(0, 0, 0)
  }

  return <primitive ref={modelRef} object={gltf.scene} />
}

export default function ModelViewer() {
  const [rotating, setRotating] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(false)
  const [recenterTrigger, setRecenterTrigger] = useState(false)

  // Reset triggers automatically off after 1 frame
  const triggerReset = () => {
    setResetTrigger(true)
    setTimeout(() => setResetTrigger(false), 100)
  }

  const triggerRecenter = () => {
    setRecenterTrigger(true)
    setTimeout(() => setRecenterTrigger(false), 100)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [2, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <MachineModel
            rotating={rotating}
            resetSignal={resetTrigger}
            recenterSignal={recenterTrigger}
          />
          <OrbitControls enablePan enableZoom enableRotate />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* UI Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
        <button
          onClick={() => setRotating((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
        >
          {rotating ? '🛑 Stop Rotation' : '🔄 Start Rotation'}
        </button>

        <button
          onClick={triggerReset}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300 text-sm font-medium"
        >
          🔁 Reset Size & Position
        </button>

        <button
          onClick={triggerRecenter}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium"
        >
          📍 Recenter Model
        </button>
      </div>
    </div>
  )
}
