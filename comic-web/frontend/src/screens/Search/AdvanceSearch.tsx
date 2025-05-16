import React, { useEffect, useState } from "react";
import { GenreState, AdvancedFilter, STATUS_OPTIONS } from "../../types/search/advanceSearch";
import { Novel } from '../../types/novel/novelDetails';
import { Genre } from "../../types/genre/genreDetails";
import { fetchAdvancedSearch } from "../../actions/searchActions"; // nếu có API thật, bạn gọi từ đây
import {fetchGenre} from "../../actions/genreAction"; // nếu có API thật, bạn gọi từ đây
import NovelGrid from "../../components/NovelGrid";

const genreStates = ["❌ Không chọn", "✅ Bao gồm", "🚫 Loại trừ"];
const genreColors = ["bg-gray-200", "bg-green-300", "bg-red-300"]; // thêm màu tuỳ thích

const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<AdvancedFilter>({ genres: {} });
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<Novel[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() =>{
    const loadGenres = async () => {
        const data = await fetchGenre();
        setAllGenres(data);
        };
        loadGenres();
  }, []);

  const toggleGenreState = (genreId: string) => {
    setFilters(prev => {
      const prevState = prev.genres[genreId] || 0;
      const newState = (prevState + 1) % 3 as GenreState;
      return {
        ...prev,
        genres: {
          ...prev.genres,
          [genreId]: newState,
        },
      };
    });
  };

  const applyFilters = async () => {
    try {
      const novels = await fetchAdvancedSearch(filters,"novel");
      setResults(novels);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm nâng cao:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Bộ lọc nâng cao</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {allGenres.map(g => {
          const state = filters.genres[g._id] ?? 0;
          return (
            <button
              key={g._id}
              onClick={() => toggleGenreState(g._id)}
              className={`px-3 py-1 rounded ${genreColors[state]} hover:opacity-80 transition-all`}
              title={genreStates[state]}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Tác giả"
        className="border p-2 w-full"
        onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
      />

      <select
        value={selectedStatus}
        onChange={(e) => {
          const newStatus = e.target.value;
          setSelectedStatus(newStatus);  // Cập nhật selectedStatus
          setFilters(prev => ({ ...prev, status: newStatus }));  // Cập nhật filters với status mới
        }}
      >
        <option value="">Tất cả</option>
        {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Tối thiểu chương"
        className="border p-2 w-full"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, minChapters: parseInt(e.target.value) || 0 }))
        }
      />

      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tìm kiếm
      </button>

      <NovelGrid novels={results}/>
    </div>
  );
};

export default AdvancedSearch;
