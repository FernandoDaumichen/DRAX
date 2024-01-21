import React, { useState } from 'react';

type SearchBarProps = {
  onSearchSubmit: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, onSearchChange }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit();
  };    

  return (
    <form onSubmit={handleSubmit} className="flex justify-center p-12">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearchChange(e);
        }}
        className="rounded-l-lg p-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
      />
      <button
        className="px-8 rounded-r-lg vibrant-pink text-white font-bold p-2 uppercase  border-t border-b border-r"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
