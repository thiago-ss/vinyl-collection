"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF, SpotLight, Environment } from "@react-three/drei";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteVinyl, getVinylById } from "../../actions/vinyl";
import { GLTF } from "three-stdlib";
import { Vinyl } from "@/db/schema";
import { Music, Calendar, Disc, Trash2 } from "lucide-react";
import * as THREE from "three";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LoadingRecord } from "@/components/loading-record";

type GLTFResult = GLTF & {
  nodes: {
    VinylRecord3_VinylRecord3_0: THREE.Mesh;
  };
  materials: {
    VinylRecord3: THREE.MeshStandardMaterial;
  };
};

function Model({ coverImage }: { coverImage?: string }) {
  const { nodes, materials } = useGLTF(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cc0_-__10_vinyl_record_3_1k-gaEhWTwf0jE9z2QIpSjTTxsr1pETCc.glb"
  ) as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const { gl: renderer } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.rotation.z += delta * 0.9;
    }
  });

  const texture = useLoader(
    THREE.TextureLoader,
    coverImage || "/placeholder.svg?height=500&width=500"
  );

  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  return (
    <group ref={groupRef} dispose={null}>
      <group scale={0.4}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.VinylRecord3_VinylRecord3_0.geometry}
          material={materials.VinylRecord3}
        />
        <mesh position={[0, 0, 0.026]}>
          <circleGeometry args={[2, 64]} />
          <meshStandardMaterial map={texture} side={THREE.FrontSide} />
        </mesh>
        <mesh position={[0, 0, -0.026]}>
          <circleGeometry args={[2, 64]} />
          <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="black" side={THREE.FrontSide} />
        </mesh>
        <mesh position={[0, 0, -0.04]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="black" side={THREE.BackSide} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cc0_-__10_vinyl_record_3_1k-gaEhWTwf0jE9z2QIpSjTTxsr1pETCc.glb"
);

export default function Component() {
  const { id } = useParams();
  const [vinyl, setVinyl] = useState<Vinyl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchVinyl = async () => {
      if (typeof id === "string") {
        try {
          const data = await getVinylById(parseInt(id, 10));
          setVinyl(data);
        } catch (error) {
          console.error("Error fetching vinyl:", error);
          toast({
            title: "Error",
            description: "Failed to load vinyl details. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchVinyl();
  }, [id, toast]);

  const handleDelete = async () => {
    if (vinyl && vinyl.id) {
      setIsLoading(true);
      try {
        const result = await deleteVinyl({ id: vinyl.id });
        if (result?.data?.success) {
          toast({
            title: "Success",
            description: "Vinyl has been deleted from your collection.",
            duration: 3000,
          });
          router.push("/");
        } else {
          throw new Error("Failed to delete vinyl");
        }
      } catch (error) {
        console.error("Error deleting vinyl:", error);
        toast({
          title: "Error",
          description: "Failed to delete the vinyl. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingRecord />;
  }

  if (!vinyl) {
    return <div>Vinyl not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[400px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <color attach="background" args={["#f0f0f0"]} />
              <ambientLight intensity={0.5} />
              <SpotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
              />
              <Suspense fallback={null}>
                <Model coverImage={vinyl.coverImage as string} />
              </Suspense>
              <Environment preset="studio" />
            </Canvas>
          </div>
          <div className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {vinyl.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Artist: {vinyl.artist}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Release Date: {vinyl.releaseDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Disc className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Total Tracks: {vinyl.totalTracks}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete vinyl
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
      {vinyl.tracks ? (
        <Card>
          <CardHeader>
            <CardTitle>Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {vinyl.tracks.map((track) => (
                <li
                  key={track.id}
                  className="flex justify-between items-center"
                >
                  <span>{track.name}</span>
                  <span className="text-muted-foreground">
                    {Math.floor(track.duration / 60000)}:
                    {((track.duration % 60000) / 1000)
                      .toFixed(0)
                      .padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}