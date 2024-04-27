import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRedo } from "@fortawesome/free-solid-svg-icons";

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string; title: string };
  preview: string;
}
interface AudioRefs {
  [id: number]: HTMLAudioElement;
}

interface SongListProps {
  songs: Song[];
  playingSongId: number | null;
  audioRefs: React.MutableRefObject<AudioRefs>;
  togglePlayPause: (song: Song) => void;
}

interface ProgressMap {
  [key: number]: number;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  playingSongId,
  audioRefs,
}) => {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loopStatus, setLoopStatus] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      let newProgress: ProgressMap = {};
      songs.forEach((song) => {
        const audio = audioRefs.current[song.id];
        if (audio) {
          newProgress[song.id] =
            (audio.currentTime / audio.duration) * 100 || 0;
        }
      });
      setProgress(newProgress);
    }, 50);

    return () => clearInterval(interval);
  }, [songs, audioRefs]);

  const calculateStrokeDasharray = (progress: number) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    return `${(progress / 100) * circumference} ${circumference}`;
  };

  const toggleLoop = (songId: number) => {
    setLoopStatus((prevLoopStatus) => {
      const newLoopStatus = {
        ...prevLoopStatus,
        [songId]: !prevLoopStatus[songId],
      };
      const audio = audioRefs.current[songId];
      if (audio) {
        audio.loop = newLoopStatus[songId];
      }
      return newLoopStatus;
    });
  };

  const [isPlaying, setIsPlaying] = useState<{ [id: number]: boolean }>({});

  const togglePlayPause = (song: Song) => {
    const currentAudio = audioRefs.current[song.id];

    if (!currentAudio) {
        audioRefs.current[song.id] = new Audio(song.preview);
        console.log("Audio element created for:", song.id);
    }

    Object.keys(audioRefs.current).forEach((id) => {
        const audio = audioRefs.current[Number(id)];
        if (Number(id) !== song.id && !audio.paused) {
            audio.pause();
            setIsPlaying((prev) => ({ ...prev, [Number(id)]: false }));
            console.log("Playback paused for:", id);
        }
    });

    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play().then(() => {
                setIsPlaying((prev) => ({ ...prev, [song.id]: true }));
                console.log("Playback started for:", song.id);
            }).catch((error) => {
                console.error("Error during playback:", error);
            });
        } else {
            currentAudio.pause();
            setIsPlaying((prev) => ({ ...prev, [song.id]: false }));
            console.log("Playback paused for:", song.id);
        }
    } else {
        console.error("No audio element available for song ID:", song.id);
    }
};

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {songs.map((item) => (
        <div
          key={item.id}
          className="rounded-lg shadow-lg p-4 flex items-center space-x-4"
          style={{ backgroundColor: "#6C53B9", color: "white" }}
        >
          <div className="flex-shrink-0">
            <Image
              src={item.album.cover}
              alt={`Album cover of ${item.album.title}`}
              width={100}
              height={100}
              unoptimized={true}
              className="rounded"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg text-white">{item.title}</h3>
            <p className="text-pink-400">Artist: {item.artist.name}</p>
            <div className="relative" style={{ width: "50px", height: "50px" }}>
              <svg width="50" height="50" className="absolute top-0 left-0">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "purple", stopOpacity: 1 }}
                    />
                    <stop
                      offset="50%"
                      style={{ stopColor: "pink", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "white", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="transparent"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray={calculateStrokeDasharray(
                    progress[item.id] || 0
                  )}
                />
              </svg>
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-black text-white focus:outline-none focus:shadow-outline"
                onClick={() => togglePlayPause(item)}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FontAwesomeIcon
                  icon={isPlaying[item.id] ? faPause : faPlay}
                  style={{ fontSize: "20px" }}
                />
              </button>

              <button
                className={`absolute top-0 right-0 rounded-full focus:outline-none focus:shadow-outline ${
                  loopStatus[item.id] ? "bg-pink-500" : "bg-black"
                } text-white`}
                onClick={() => toggleLoop(item.id)}
                style={{
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FontAwesomeIcon
                  icon={faRedo}
                  style={{
                    fontSize: "10px",
                    color: loopStatus[item.id] ? "white" : "white",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
