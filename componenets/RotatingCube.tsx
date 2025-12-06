"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { CubeCamera, Icosahedron, Sphere, Torus } from "@react-three/drei" // or Torus if you prefer
import { useRef, useEffect } from "react"
import * as THREE from "three"

function OrbMesh() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()

  // Subtle auto-rotation
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.2
      mesh.current.rotation.x += delta * 0.1
    }
  })

  // Mouse parallax effect
  useEffect(() => {
    if (!mesh.current) return
    const x = pointer.x * 0.1
    const y = -pointer.y * 0.1
    mesh.current.position.x = x
    mesh.current.position.y = y
  }, [pointer])

  return (
    <Icosahedron  ref={mesh}>
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={3.8}
        roughness={5.2}
        metalness={9.5}
        
      />
    </Icosahedron>
  )
}

export default function RotatingCube() {
  return (
    <div className="w-full h-64 relative">
      <Canvas
        className="absolute inset-0 bg-transparent"
        camera={{ position: [0, 0, 4] }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Soft ambient + directional light */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbMesh />
      </Canvas>
    </div>
  )
}