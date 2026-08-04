"use client";

export function Lights() {
  return (
    <>
      <hemisphereLight args={["#e0f2fe", "#0f172a", 0.45]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        color="#f8fafc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.55}
        color="#06b6d4"
      />
      <directionalLight
        position={[0, 3, -5]}
        intensity={0.7}
        color="#3b82f6"
      />
      <pointLight
        position={[0, 0.3, 3]}
        intensity={0.8}
        color="#60a5fa"
        distance={12}
      />
    </>
  );
}
