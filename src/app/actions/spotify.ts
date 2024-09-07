/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { getAccessToken } from "@/utils/spotify";

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

interface SpotifySearchResponse {
  albums: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
  };
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

export async function searchAlbums({ query }: { query: string }): Promise<SpotifySearchResult> {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<SpotifySearchResponse>(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      albums: response.data.albums.items,
    };
  } catch (error: any) {
    console.error("Search albums error:", error);
    return { success: false, message: error.message };
  }
}

export async function getAlbumDetails(albumId: string): Promise<SpotifyAlbumDetailsResult> {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get<SpotifyAlbumDetails>(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { success: true, album: response.data };
  } catch (error: any) {
    console.error("Get album details error:", error);
    return { success: false, message: error.message };
  }
}