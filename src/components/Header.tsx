import Image from 'next/image';
import DeezerAPI from './DeezerAPI';

interface HeaderProps {
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({ showDropdown, setShowDropdown, dropdownRef }) => (
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
      <div className="flex-1 flex justify-end">
        {showDropdown ? (
          <div ref={dropdownRef}>
            <DeezerAPI />
          </div>
        ) : (
          <button
            onClick={() => setShowDropdown(true)}
            className="vibrant-pink text-white py-2 px-4 rounded-md"
          >
            API Status
          </button>
        )}
      </div>
    </div>
    </header>
);

export default Header;
