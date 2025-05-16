// src/pages/StoryDetailPage.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import {Link, useParams } from 'react-router-dom';
import {Manga} from '../../types/manga/mangaDetails';
import {MangaChapter} from '../../types/manga/mangaChapters';
import { fetchMangaDetails, fetchMangaChapters, updateNumberFavoriteManga} from '../../actions/mangaActions'; 
import { faEye, faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";

const StoryDetailPage = () => {
  const { mangaId } = useParams(); // từ URL /story/:mangaId
  const [story, setStory] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  // const [numFavorites, setNumFavorites] = useState(null);
  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchMangaDetails(String(mangaId));

        setStory(detail);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
    };

    fetchData();
  }, [mangaId]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const chapterList = await fetchMangaChapters(String(mangaId));
        setChapters(chapterList);
      } catch (error) {
        console.error("Lỗi khi load chương:", error);
      }
    };
  
    fetchChapter();
  }, [mangaId]);

  const handleFavoriteClick = async () => {
    try {
      const updated = await updateNumberFavoriteManga(String(mangaId));
      if (story) {
        setStory({ ...story, numFavorites: updated.numFavorites });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt thích:", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-5">
      {story ? (
        <>
          {/* Div 1: Ảnh + Thông tin */}
          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Ảnh bìa bên trái */}
            <div className="w-1/2 md:w-[200px] flex-shrink-0 mx-auto md:mx-0">
              <img
                src={story.cover_image}
                alt="Ảnh bìa"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Thông tin bên phải */}
            <div style={{ flex: 1 }}>
              <h1 style={{ marginBottom: '10px' }}>{story.title}</h1>
              <div > </div>
              <p><FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />   {story.numViews} <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 pl-5.5" />   {story.numFavorites} <FontAwesomeIcon icon={faCommentDots} className="w-3.5 h-3.5  pl-5.5" /> {story.numComments}</p>
              <p><span className = "Emphasize font-bold">Tác giả: </span> {story.author}</p>

              <p>
                <span className="Emphasize font-bold">Thể loại: </span>
                {Array.isArray(story.genres) &&
                story.genres.map((genre, index) => (
                  <span key={genre._id}>
                    {genre.name}
                    {index < story.genres.length - 1 && ', '}
                  </span>
                ))}
              </p>
              <p><span className = "Emphasize font-bold">Trạng thái:  </span> {story.status}</p>
              <p>
                <span className="Emphasize font-bold">Cập nhật: </span> 
                {new Date(story.updated_at).toLocaleDateString('vi-VN')}
              </p>
              
              <p><span className = "Emphasize font-bold"> Lượt favorites:  </span> {story.numFavorites}</p>
              <div className="justify-between mt-2">
                {firstChapter && (
                  <Link
                    to={`/manga/chapter/${firstChapter._id}`}
                  >
                    <button className="text-white bg-orange-500 hover:bg-yellow-400 px-2 mr-2 py-2 rounded">Đọc từ đầu</button>
                  </Link>
                )}
                {lastChapter && (
                  <Link
                    to={`/manga/chapter/${lastChapter._id}`}
                  >
                    <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded">Đọc mới nhất</button>
                  </Link>
                )}

                <button
                  className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded"
                  onClick={handleFavoriteClick}
                >
                  Thích ({story.numFavorites})
                </button>
              </div>
              
            </div>
          </div>

          {/* Div 2: Description */}
          <div className="flex flex-col" style={{ marginTop: '30px' }}>
            <div className="flex-1">
              <h2><span className = "Emphasize font-bold">Mô tả</span></h2>
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                {story.description.split('\n').map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
            </div>

            {/* Danh sách chương */}
            <div style={{ marginTop: '10px' }} className="flex-1">
              <h2><span className = "Emphasize font-bold">Danh sách chương:</span></h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 mt-2">
                {chapters.map((chapter) => (
                  <div className="col-span-1" key={chapter._id}>
                    <div className="p-1">
                      <p>
                        <Link to={`/manga/chapter/${chapter._id}`} className="text-neutral-700 hover:text-orange-500 dark:text-white">
                          Chương {chapter.chapter_number}
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Đang tải truyện...</p>
      )}
    </div>
  );
};


export default StoryDetailPage;
