'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ModelViewer = dynamic(() => import('@/components/Modelviewer'), { ssr: false })

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-10">
      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-center">
        SS Innovations 3D Model Viewer
      </h1>

      {/* 3D Model Section */}
      <div className="w-full max-w-4xl aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-gray-700">
        <Suspense fallback={<div className="text-center p-4">Loading 3D Model...</div>}>
          <ModelViewer />
        </Suspense>
      </div>

      {/* Description */}
      <p className="mt-6 text-center text-sm sm:text-base opacity-70 max-w-lg">
        You can rotate, zoom, and pan the model using your finger or mouse.
      </p>

      {/* AR Button */}
      <a
        href="/models/Machine.glb"
        rel="ar"
        download
        className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-lg font-medium hover:scale-105 transition-transform duration-300"
      >
        📱 Experience in Your Room
      </a>
    </main>
  )
}
