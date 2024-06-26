"use client";
import React, { useState, useEffect, useRef } from "react";
import kirby from "/public/images/moi.gif";
import Image from "next/image";
import debounce from "@/utils/debounce";
import SongList from "../components/SongList";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

interface DeezerApiResponse {
  data: {
    id: number;
    title: string;
    artist: {
      name: string;
    };
    album: {
      cover: string;
      title: string;
    };
    preview: string;
  }[];
}

type Song = {
  id: number;
  title: string;
  link?: string;
  preview: string;
};

const playSong = (song: Song) => {
  window.open(song.link, "_blank");
};

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<DeezerApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialLogoDisplayed, setInitialLogoDisplayed] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(() => {
    handleSearchSubmit();
    setIsTyping(false);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log("Search Query:", query);

    if (query === "") {
      setData(null);
      console.log("Data reset to null");
    } else {
      setIsTyping(true);
      debouncedSearch();
    }
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleSearchSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const DEEZER_API_ENDPOINT =
      "https://deezerdevs-deezer.p.rapidapi.com/search";
    const API_KEY = process.env.NEXT_PUBLIC_DEEZER_API;

    if (!API_KEY) {
      setError("API key is undefined");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${DEEZER_API_ENDPOINT}?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: new Headers({
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
          }),
        }
      );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const audioRefs = useRef<{ [id: number]: HTMLAudioElement }>({});

  const togglePlayPause = (song: Song) => {
    if (!audioRefs.current[song.id]) {
      audioRefs.current[song.id] = new Audio(song.preview);
    }

    const isCurrentSongPlaying = playingSongId === song.id;
    if (isCurrentSongPlaying && !audioRefs.current[song.id].paused) {
      audioRefs.current[song.id].pause();
      setPlayingSongId(null);
    } else {
      Object.values(audioRefs.current).forEach((audio) => audio.pause());
      audioRefs.current[song.id].play();
      setPlayingSongId(song.id);
    }
  };

  const playSong = (previewUrl: string) => {
    const audio = new Audio(previewUrl);
    audio.play();
  };

  return (
    <div className="drop-shadow-xl  " style={{ minHeight: "100vh" }}>
      {initialLogoDisplayed && (
        <div
          className="initial-logo"
          onAnimationEnd={() => setInitialLogoDisplayed(false)}
        >
          <Image
            src="/images/DRAXOG.png"
            alt="Large DRAX Logo"
            width={500}
            height={150}
            className="mb-4"
          />
        </div>
      )}
      {!initialLogoDisplayed && (
        <>
          <Header
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            dropdownRef={dropdownRef}
          />
          <div className="top-songs-label">
            <div className="flex items-center justify-center text-gray-200 mb-6 mt-6">
              <Image
                src="/images/fire.svg"
                alt="Fire Emoji"
                width={40}
                height={40}
              />

              <h1 className="text-5xl mx-2 text-gray-800 dark:text-white">
                Top Songs
              </h1>

              <Image
                src="/images/fire.svg"
                alt="Fire Emoji"
                width={40}
                height={40}
              />
            </div>

            <iframe
              title="deezer-widget"
              src="https://widget.deezer.com/widget/auto/playlist/1479458365"
              width="100%"
              height="300"
              frameBorder="0"
              allowTransparency
              allow="encrypted-media; clipboard-write"
              className="deezer-widget"
            ></iframe>
          </div>

          <SearchBar
            onSearchSubmit={handleSearchSubmit}
            onSearchChange={handleSearchChange}
          />

          {isLoading && <LoadingIndicator />}
          {error && <ErrorMessage message={error} />}

          {!searchQuery && !data && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-2">
              <h2 className="text-5xl pixel text-center text-gray-600 dark:text-gray-300 mb-0">
                Search for a song
              </h2>
              <div className="flex justify-center items-center mt-0">
                <Image src={kirby} alt="Kirby" width={400} height={100} />
              </div>
            </div>
          )}

          {data && data.data && Array.isArray(data.data) && (
            <SongList
              songs={data.data}
              togglePlayPause={togglePlayPause}
              playingSongId={playingSongId}
              audioRefs={audioRefs}
            />
          )}
        </>
      )}
    </div>
  );
}
