"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { searchAlbums, getAlbumDetails } from "@/app/actions/spotify";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Disc, Music, Tag, Thermometer } from "lucide-react";
import { addVinyl } from "../actions/vinyl";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  uri: string;
  album_type: string;
  type: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  artists: SpotifyArtist[];
  uri: string;
}

interface SpotifyAlbumDetails extends SpotifyAlbum {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
  genres: string[];
  popularity: number;
  label: string;
  copyrights: Array<{
    text: string;
    type: string;
  }>;
}

interface SpotifySearchResult {
  success: boolean;
  albums?: SpotifyAlbum[];
  message?: string;
}

interface SpotifyAlbumDetailsResult {
  success: boolean;
  album?: SpotifyAlbumDetails;
  message?: string;
}

export default function SpotifySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: searchResults,
    error: searchError,
    isLoading: isSearching,
  } = useQuery<SpotifySearchResult, Error>({
    queryKey: ["albumSearch", debouncedSearchTerm],
    queryFn: () => searchAlbums({ query: debouncedSearchTerm }),
    enabled: debouncedSearchTerm.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: albumDetails,
    error: albumError,
    isLoading: isLoadingAlbum,
  } = useQuery<SpotifyAlbumDetailsResult, Error>({
    queryKey: ["albumDetails", selectedAlbumId],
    queryFn: () => getAlbumDetails(selectedAlbumId!),
    enabled: !!selectedAlbumId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedAlbumId(null); // Clear selected album when searching
  };

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setSearchTerm(""); // Clear search term when an album is selected
  };

  const handleBackToSearch = () => {
    setSelectedAlbumId(null);
  };

  const handleAddToCollection = async (album: SpotifyAlbumDetails) => {
    const vinylData = {
      title: album.name,
      artist: album.artists.map((artist) => artist.name).join(", "),
      totalTracks: album.total_tracks,
      tracks: album.tracks.items.map((track) => ({
        name: track.name,
        duration: track.duration_ms,
      })),
      releaseDate: album.release_date,
      coverImage: getLargestImage(album.images).url,
    };

    const result = await addVinyl(vinylData);
    if (result?.data?.success) {
      toast({
        title: "Success",
        description: "Vinyl added to collection",
        action: (
          <ToastAction altText="View" onClick={() => router.push("/")}>
            View
          </ToastAction>
        ),
      });
      setSelectedAlbumId(null);
    } else {
      toast({
        title: "Error",
        description: result?.serverError || "Failed to add vinyl to collection",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const getLargestImage = (images: SpotifyImage[]) => {
    return images.reduce((largest, image) => {
      return image.width * image.height > largest.width * largest.height
        ? image
        : largest;
    }, images[0]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Type to search</h1>
      {!selectedAlbumId && (
        <div className="mb-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for albums..."
            className="w-full"
          />
        </div>
      )}

      {searchError && (
        <p className="text-red-500 mb-4">{searchError.message}</p>
      )}
      {albumError && <p className="text-red-500 mb-4">{albumError.message}</p>}

      {!selectedAlbumId && (
        <div className="grid grid-cols-1 gap-6">
          {isSearching && (
            <>
              <SearchResultSkeleton />
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </>
          )}
          {searchResults?.success &&
            searchResults.albums &&
            searchResults.albums.map((album) => (
              <Card
                key={album.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleAlbumClick(album.id)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 p-4">
                    {album.images && album.images.length > 0 && (
                      <div className="relative w-full pt-[100%]">
                        <Image
                          src={getLargestImage(album.images).url}
                          alt={album.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-2/3 p-4">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">
                        {album.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-2">
                        <span className="font-semibold">Artists:</span>{" "}
                        {album.artists.map((artist) => artist.name).join(", ")}
                      </p>
                      <p className="mb-2">
                        <span className="font-semibold">Release Date:</span>{" "}
                        {new Date(album.release_date).toLocaleDateString()}
                      </p>
                      <p className="mb-2">
                        <span className="font-semibold">Total Tracks:</span>{" "}
                        {album.total_tracks}
                      </p>
                      <p className="mb-2">
                        <span className="font-semibold">Album Type:</span>{" "}
                        {album.album_type.charAt(0).toUpperCase() +
                          album.album_type.slice(1)}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {selectedAlbumId && (
        <div>
          <Button onClick={handleBackToSearch} className="mb-4">
            Back to search
          </Button>
          {isLoadingAlbum ? (
            <AlbumDetailsSkeleton />
          ) : (
            albumDetails?.success &&
            albumDetails.album && (
              <Card className="overflow-hidden">
                <div className="relative h-80 md:h-[28rem] lg:h-[36rem]">
                  {albumDetails.album.images &&
                    albumDetails.album.images.length > 0 && (
                      <Image
                        src={getLargestImage(albumDetails.album.images).url}
                        alt={albumDetails.album.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        quality={100}
                        priority
                      />
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {albumDetails.album.name}
                    </h2>
                    <p className="text-xl md:text-2xl text-white">
                      {albumDetails.album.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>
                        {new Date(
                          albumDetails.album.release_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Music className="w-5 h-5 mr-2" />
                      <span>{albumDetails.album.total_tracks} tracks</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      <span>{albumDetails.album.label}</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="w-5 h-5 mr-2" />
                      <span>Popularity: {albumDetails.album.popularity}</span>
                    </div>
                    <div className="flex items-center">
                      <Disc className="w-5 h-5 mr-2" />
                      <span>
                        {albumDetails.album.album_type.charAt(0).toUpperCase() +
                          albumDetails.album.album_type.slice(1)}
                      </span>
                    </div>
                    {albumDetails.album.genres.length > 0 && (
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        <span>{albumDetails.album.genres.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Tracks</h3>
                  <div className="space-y-2">
                    {albumDetails.album.tracks.items.map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center p-2 bg-secondary rounded-md"
                      >
                        <span className="text-lg font-semibold mr-4 w-8 text-center">
                          {index + 1}
                        </span>
                        <div className="flex-grow">
                          <p className="font-medium">{track.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {track.artists
                              .map((artist) => artist.name)
                              .join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(track.duration_ms)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() =>
                      handleAddToCollection(
                        albumDetails.album as SpotifyAlbumDetails
                      )
                    }
                    className="mt-4"
                  >
                    Add to Collection
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultSkeleton() {
  return (
    <Card className="w-full">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <Skeleton className="w-full pt-[100%]" />
        </div>
        <div className="w-full md:w-2/3 p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </Card>
  );
}

function AlbumDetailsSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-80 md:h-[28rem] lg:h-[36rem] w-full" />
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="space-y-2">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
