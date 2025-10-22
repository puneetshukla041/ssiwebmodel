"use client";

import { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// 3D Model Component
function Model() {
  const { scene } = useGLTF("/models/model1.glb");
  return (
    <primitive
      object={scene}
      scale={0.5}
      position={[0.5, -0.5, 0]}
      rotation={[0, -0.87266, 0]} // ~ -50 degrees left
    />
  );
}

// Loader Component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-white text-sm font-medium">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

// Camera animation controller
function CameraController({ hasExplored, setHasExplored, setButtonVisible, setShowText }: any) {
  const targetPosition = new THREE.Vector3(2, 0, 4);
  const targetFov = 30;

  useFrame(({ camera }) => {
    if (hasExplored) {
      const cam = camera as THREE.PerspectiveCamera;

      // Faster movement
      cam.position.lerp(targetPosition, 0.15);

      // Faster zoom
      cam.fov += (targetFov - cam.fov) * 0.15;
      cam.updateProjectionMatrix();

      // Stop animation when close
      if (cam.position.distanceTo(targetPosition) < 0.05) {
        setHasExplored(false);
        setButtonVisible(false);

        // ✅ Show the text after animation finishes
        setShowText(true);
      }
    }
  });

  return null;
}

// Main App
export default function App() {
  const [hasExplored, setHasExplored] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [showText, setShowText] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-black relative font-sans">
      {/* Button */}
      {buttonVisible && (
        <div
          className={`absolute top-1/2 left-90 transform -translate-y-1/2 z-10 transition-opacity duration-700 ${
            hasExplored ? "opacity-0" : "opacity-100"
          }`}
        >
          <button
            onClick={() => setHasExplored(true)}
            className="relative px-6 py-2 text-white text-base font-semibold rounded-full
                       bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800
                       border border-gray-600 shadow-lg
                       transition-all duration-300 cursor-pointer overflow-hidden
                       group"
          >
            <span className="relative z-10">Explore</span>

            {/* Moving gradient shine */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         -translate-x-full group-hover:translate-x-full 
                         transition-transform duration-700 ease-in-out"
            ></span>

            {/* Glow effect */}
            <span
              className="absolute inset-0 rounded-full shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></span>
          </button>
        </div>
      )}

      {/* ✅ Text on Left Side (after animation completes) */}
      {showText && (
        <div className="absolute left-10 top-1/3 max-w-xl">
          <h3
            data-aos="fade-up"
            data-aos-once="true"
            className="text-3xl font-bold leading-snug bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            1″ CMOS Primary Wide-Angle Camera
          </h3>
        </div>
      )}

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        <pointLight position={[0, 3, 3]} intensity={1.2} />
        <hemisphereLight intensity={0.6} groundColor="black" />

        {/* Loader + Model */}
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        {/* Camera animation */}
        <CameraController
          hasExplored={hasExplored}
          setHasExplored={setHasExplored}
          setButtonVisible={setButtonVisible}
          setShowText={setShowText}
        />

        {/* Controls */}
        <OrbitControls
          enableRotate={false}
          enablePan={!hasExplored}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}
