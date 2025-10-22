// components/ModelViewer.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense } from 'react'

function MachineModel() {
  const gltf = useGLTF('/models/Machine.glb')
  return <primitive object={gltf.scene} scale={0.5} />
}

export default function ModelViewer() {
  return (
    <Canvas
      camera={{ position: [2, 2, 4], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <MachineModel />
        <OrbitControls enablePan enableZoom enableRotate />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
