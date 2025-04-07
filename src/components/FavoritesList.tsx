import Image from 'next/image';

interface FavoritesListProps {
  favorites: string[];
  onSelect: (city: string) => void;
  onDelete: (city: string) => void;
}

const FavoritesList = ({ favorites, onSelect, onDelete }: FavoritesListProps) => {
  return (
    <div className="favoritesBox">
      <h1 className="favTitle">Favorites:</h1>
      <ul className="list-none">
        {favorites.map((city) => (
          <li
            key={city}
            className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-2 shadow-md"
          >
            <span onClick={() => onSelect(city)} className="favCity">
              {city}
            </span>
            <button onClick={() => onDelete(city)} className="hover:opacity-75">
              <Image
                src="/images/remove.png"
                alt="Delete"
                className="removeBTN"
                width={24} 
                height={24} 
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
