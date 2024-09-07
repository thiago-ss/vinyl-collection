"use client";

import VinylList from "@/components/vinyl-list";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your collection</h1>
      <VinylList />
    </div>
  );
}
