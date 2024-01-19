"use client";
import React, { useState, useRef } from "react";
import DeezerAPI from "../components/DeezerAPI";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import Image from "next/image";

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

function debounce(func: (...args: any[]) => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
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


  const debouncedSearch = debounce(() => {
    handleSearchSubmit();
    setIsTyping(false);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
    debouncedSearch();
  };
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const DEEZER_API_ENDPOINT =
      "https://deezerdevs-deezer.p.rapidapi.com/search";
    const API_KEY = "ee75c3cc9dmsha7e377714a18573p11f471jsn38c6ba464127";
    try {
      const response = await fetch(
        `${DEEZER_API_ENDPOINT}?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
          },
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
  <div  className="coal " style={{ minHeight: "100vh" }}>
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
        <header className="App-header p-4 shadow-lg bg-purple">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <Image
                src="/images/DRAX.png"
                alt="DRAX Logo"
                width={200}
                height={60}
                className="mb-4"
              />
            </div>
            <div onClick={handleDropdown} className="flex-1 flex justify-end">
              API Status
              {showDropdown && <DeezerAPI />}
            </div>
          </div>
        </header>


        <div className="top-songs-label">
          <div className="flex items-center justify-center text-gray-200 mb-6 mt-6">

            <Image
              src="/images/fire.svg" 
              alt="Fire Emoji"
              width={40}
              height={40}
            />


            <h1 className="text-5xl mx-2">Top Songs</h1>

        
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

        {isLoading && <div className="loading-indicator">Loading...</div>}
        {error && (
          <div className="error-message text-red-600">Error: {error}</div>
        )}
        {!data && !isLoading && (
          <p className="search-prompt text-lg">Search your favorite songs...</p>
        )}

        {data && data.data && Array.isArray(data.data) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((item) => (
              <div
                key={item.id}
                className="rounded-lg shadow-md p-4 flex items-center space-x-4"
                style={{ backgroundColor: "#6C53B9", color: "white" }}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={item.album.cover}
                    alt={`Album cover of ${item.album.title}`}
                    width={100}
                    height={100}
                    className="rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg  text-blue-600 dark:text-blue-400">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Artist: {item.artist.name}
                  </p>
                  <button
                    className="button mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => togglePlayPause(item)}
                  >
                    <FontAwesomeIcon
                      icon={
                        playingSongId === item.id &&
                          !audioRefs.current[item.id]?.paused
                          ? faPause
                          : faPlay
                      }
                    />

                  </button>
                </div>

              </div>
            ))}


          </div>
        )}

      </>

    )}

  </div>
  );
}