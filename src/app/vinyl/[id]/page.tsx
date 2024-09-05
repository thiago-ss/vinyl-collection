"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVinylById } from "../../actions";
import { GLTF } from "three-stdlib";
import { Vinyl } from "@/db/schema";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    VinylRecord3_VinylRecord3_0: THREE.Mesh;
  };
  materials: {
    VinylRecord3: THREE.MeshStandardMaterial;
  };
};

function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/cc0_-__10_vinyl_record_3_1k-Z6anHR1aNrFfSwsAHEoSuuq3ium9H9.glb",
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group scale={0.025}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.VinylRecord3_VinylRecord3_0.geometry}
          material={materials.VinylRecord3}
          rotation={[-0.357, 0.1, 0.984]}
        />
      </group>
    </group>
  );
}

useGLTF.preload(
  "/cc0_-__10_vinyl_record_3_1k-Z6anHR1aNrFfSwsAHEoSuuq3ium9H9.glb",
);

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

export default function VinylDetails() {
  const { id } = useParams();
  const [vinyl, setVinyl] = useState<Vinyl | null>(null);

  useEffect(() => {
    const fetchVinyl = async () => {
      if (typeof id === "string") {
        const data = await getVinylById(parseInt(id, 10));
        setVinyl(data);
      }
    };
    fetchVinyl();
  }, [id]);

  if (!vinyl) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-light">{vinyl.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Artist: {vinyl.artist}</p>
          <p className="text-muted-foreground mb-4">Year: {vinyl.year}</p>
          <div className="w-full h-[400px] mb-4">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Model />
              </Suspense>
              <OrbitControls enableZoom={true} />
            </Canvas>
          </div>
          <p className="text-sm text-muted-foreground">
            Interact with the 3D model: Click and drag to rotate, scroll to
            zoom.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
