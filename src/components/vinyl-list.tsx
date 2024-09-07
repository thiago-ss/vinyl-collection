"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getVinyls } from "@/app/actions/vinyl";
import { LoadingRecord } from "./loading-record";
import { formatDate } from "@/lib/utils";
import { NewVinyl } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function VinylList() {
  const [textFilter, setTextFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [tracksFilter, setTracksFilter] = useState([0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const vinyls = useQuery({
    queryKey: ["vinyls"],
    queryFn: () => getVinyls(),
  });

  const { maxTracks } = useMemo(() => {
    if (!vinyls.data) return { maxTracks: 0 };

    return vinyls.data.reduce((acc, vinyl: NewVinyl) => ({
      maxTracks: Math.max(acc.maxTracks, vinyl.totalTracks || 0),
    }), { maxTracks: 0 });
  }, [vinyls.data]);

  const filteredVinyls = useMemo(() => {
    if (!vinyls.data) return [];

    return vinyls.data.filter((vinyl: NewVinyl) => {
      const textMatch = textFilter
        ? vinyl.title.toLowerCase().includes(textFilter.toLowerCase()) ||
          vinyl.artist.toLowerCase().includes(textFilter.toLowerCase())
        : true;

      const yearMatch = yearFilter
        ? new Date(vinyl.releaseDate as string).getFullYear().toString() === yearFilter
        : true;

      const tracksMatch = vinyl.totalTracks
        ? vinyl.totalTracks >= tracksFilter[0]
        : true;

      return textMatch && yearMatch && tracksMatch;
    });
  }, [vinyls.data, textFilter, yearFilter, tracksFilter]);

  if (vinyls.isLoading) {
    return <LoadingRecord />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search by title or artist"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          className="flex-grow"
        />
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filters <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto p-4">
            <DropdownMenuLabel className="text-lg font-semibold mb-4">
              Filter options
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mb-4" />
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="year-filter"
                  className="block text-sm font-medium mb-2"
                >
                  Release year
                </label>
                <Input
                  id="year-filter"
                  type="number"
                  placeholder="Enter year"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  min={1900}
                  max={new Date().getFullYear()}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="tracks-filter"
                  className="block text-sm font-medium mb-2"
                >
                  Minimum tracks: {tracksFilter[0]}
                </label>
                <Slider
                  id="tracks-filter"
                  min={0}
                  max={maxTracks}
                  step={1}
                  value={tracksFilter}
                  onValueChange={setTracksFilter}
                  className="w-full"
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVinyls.map((vinyl: NewVinyl) => (
          <Card key={vinyl.id}>
            <CardHeader>
              <CardTitle>{vinyl.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {vinyl.coverImage && (
                <Image
                  src={vinyl.coverImage}
                  alt={vinyl.title}
                  height={1920}
                  width={1080}
                  className="object-cover mb-4 rounded"
                />
              )}
              <p className="text-sm text-muted-foreground">
                Artist: {vinyl.artist}
              </p>
              {vinyl.totalTracks && (
                <p className="text-sm text-muted-foreground">
                  Total tracks: {vinyl.totalTracks}
                </p>
              )}
              {vinyl.releaseDate && (
                <p className="text-sm text-muted-foreground">
                  Release date: {formatDate(vinyl.releaseDate)}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/vinyl/${vinyl.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}