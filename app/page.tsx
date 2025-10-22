'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Lazy load WebXR AR Viewer (live camera AR)
const WebXRARViewer = dynamic(() => import('@/components/WebXRARViewer'), {
  ssr: false,
})

// Fallback basic 3D viewer
const ModelViewer = dynamic(() => import('@/components/Modelviewer'), {
  ssr: false,
})

export default function HomePage() {
  const [isAndroid, setIsAndroid] = useState(false)
  const [supportsWebXR, setSupportsWebXR] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase()
      setIsAndroid(ua.includes('android'))

      if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
          setSupportsWebXR(supported)
        })
      }
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-10">
      {/* Heading */}
      <motion.h1
        className="text-3xl sm:text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        SS Innovations 3D + AR Experience
      </motion.h1>

      {/* 3D or WebXR Viewer */}
      <motion.div
        className="w-full max-w-4xl aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Suspense fallback={<div className="text-center p-4">Loading 3D Model...</div>}>
          {supportsWebXR ? <WebXRARViewer /> : <ModelViewer />}
        </Suspense>
      </motion.div>

      {/* Instruction Text */}
      <motion.p
        className="mt-6 text-center text-sm sm:text-base opacity-70 max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Rotate, zoom, and interact with the robotic system. On mobile, experience it in your room!
      </motion.p>

      {/* Android Fallback AR Button */}
      {!supportsWebXR && isAndroid && (
        <motion.a
          href="intent://arvr.google.com/scene-viewer/1.0?file=https://d4olfypp2qmmqbyx.public.blob.vercel-storage.com/Machine_Updated-eOpAysCMZk4FOaAUCoGXCnvtJx4JSM.glb&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 bg-gradient-to-br from-cyan-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          📱 Experience in Your Room (AR)
        </motion.a>
      )}
    </main>
  )
}
