import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

interface Song {
  id: number;
  title: string;
  artist: { name: string; };
  album: { cover: string; title: string; };
  preview: string;
}

interface SongListProps {
  songs: Song[];
  togglePlayPause: (song: Song) => void;
  playingSongId: number | null;
  audioRefs: React.MutableRefObject<{ [id: number]: HTMLAudioElement }>;
}

const SongList: React.FC<SongListProps> = ({ songs, togglePlayPause, playingSongId, audioRefs }) => {
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
              className="rounded"
            />
          </div>
          <div className="flex-grow ">
            <h3 className="text-lg text-white dark:vibrant-pink-text">
              {item.title}
            </h3>
            <p className="text-pink-400 dark:text-gray-300">
              Artist: {item.artist.name}
            </p>
            <button
              className="button mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => togglePlayPause(item)}
            >
              <FontAwesomeIcon
                icon={playingSongId === item.id && !audioRefs.current[item.id]?.paused ? faPause : faPlay}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
