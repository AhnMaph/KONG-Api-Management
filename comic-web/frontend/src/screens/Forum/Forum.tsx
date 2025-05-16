
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../types/user/userSlice";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  comments: Comment[];
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
};

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState("");
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/posts/", {
        withCredentials: true, // Gửi cookie kèm theo yêu cầu
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await axios.post(
        "http://localhost:8000/api/posts/",
        newPost,
        { withCredentials: true }
      );
      setNewPost({ title: "", content: "" });
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error("Lỗi khi tạo bài viết:", err);
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    if (!newComment.trim()) return;

    try {
      await axios.post(
        "http://localhost:8000/api/comments/",
        { content: newComment, post: postId },
        { withCredentials: true }
      );
      setNewComment("");
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error("Lỗi khi tạo bình luận:", err);
    }
  };

  return (
    <div className="forum-container max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Diễn Đàn</h1>

      {/* Danh sách bài viết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 text-sm">{post.content.slice(0, 100)}...</p>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Chi tiết bài viết */}
      {selectedPost && (
        <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
          <button
            className="text-red-500 mb-4"
            onClick={() => setSelectedPost(null)}
          >
            ← Quay lại
          </button>
          <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
          <p className="text-gray-700 mt-4">{selectedPost.content}</p>
          <p className="text-gray-400 text-sm mt-2">
            {new Date(selectedPost.created_at).toLocaleString()}
          </p>

          {/* Bình luận */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Bình luận</h3>
            <ul className="space-y-4 mt-4">
              {selectedPost.comments.map((comment) => (
                <li key={comment.id} className="p-3 border rounded-lg bg-gray-50">
                  <p>{comment.content}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {/* Thêm bình luận */}
            {user && (
              <div className="mt-4">
                <textarea
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập bình luận..."
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={() => handleCommentSubmit(selectedPost.id)}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Gửi bình luận
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thêm bài viết */}
      {user && !selectedPost && (
        <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
          <h3 className="text-lg font-semibold">Tạo bài viết mới</h3>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tiêu đề bài viết"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            className="w-full p-3 border rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nội dung bài viết"
            rows={5}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <button
            onClick={handlePostSubmit}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Đăng bài viết
          </button>
        </div>
      )}
    </div>
  );
};

export default Forum;














// import { useEffect, useState } from "react";
// import {Manga} from "../../types/manga/mangaDetails";  // Import API function
// import {fetchManga} from "../../actions/mangaActions";

// const Forum = () => {
//     const [mangas, setMangas] = useState<Manga[]>([]);

//     useEffect(() => {
//         const loadMangas = async () => {
//             const data = await fetchManga();
//             setMangas(data);
//         };

//         loadMangas();
//     }, []);

//     return (
//         <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }} id="forum">
//             <h1 style={{ textAlign: "center", color: "#333" }}>Hello. I'm Forum.</h1>
//             <ul style={{ listStyleType: "none", padding: 0 }}>
//                 {mangas.map(manga => (
//                     <li key={manga.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
//                         <h2 style={{ color: "#555" }}>{manga.title}</h2>
//                         <p style={{ margin: "5px 0" }}><strong>Author:</strong> {manga.author}</p>
//                         <p style={{ margin: "5px 0" }}>{manga.description}</p>
//                         <img src={manga.cover_image} alt={manga.title} style={{ width: "200px", borderRadius: "10px" }} />
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Forum;
