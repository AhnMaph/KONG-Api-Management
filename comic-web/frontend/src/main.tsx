import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./screens/Home/HomePage";
import Profiles from "./screens/Auth/ListProfiles";
import Error from "./screens/Error";
import UserProfilePage from "./screens/Auth/ProfileScreen";
import MangaList from "./screens/Manga/MangaList.tsx";
import NovelList from "./screens/Novel/NovelList.tsx";
import Forum from "./screens/Forum/Forum";
import Genre from "./screens/Genre/Genre.tsx";
import Leaderboard from "./screens/Leaderboard/Leaderboard";
import AdvanceSearch from "./screens/Search/AdvanceSearch.tsx";
import AuthRoutes from "./router/AuthRoutes";
import NovelData from './screens/Novel/NovelDetail.tsx'
import MangaData from './screens/Manga/MangaDetail.tsx'
import NovelChapterDetailPage from './screens/Novel/NovelChapterDetail'
import NovelChapterDetail from './screens/Novel/NovelChapterDetail'
import MangaChapterDetailPage from './screens/Manga/MangaChapterDetail.tsx'
import MangaChapterDetail from './screens/Manga/MangaChapterDetail.tsx'

// redux 

import {store} from './store'
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Đặt App làm layout chính
    errorElement: <Error />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/profiles", element: <Profiles /> },
      { path: "/profile", element: <UserProfilePage /> },
      //{ path: "/profiles/:userId", element: <UserProfilePage /> },
      { path: "/manga", element: <MangaList /> },
      { path: "/novel", element: <NovelList /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/forum", element: <Forum /> },
      { path: "/genre", element: <Genre /> },
      { path: "/avsearch", element: <AdvanceSearch /> },
      { path: "/auth/*", element: <AuthRoutes /> },
      { path: "/novel/:storyId", element: <NovelData />},
      { path: "/manga/:mangaId", element: <MangaData />},
      { path: "/novel/chapter/:chapterId", element: <NovelChapterDetail/>},
      { path: "/chapter/:chapterId", element: <NovelChapterDetailPage />},
      { path: "/manga/chapter/:chapterId", element: <MangaChapterDetail/>},
      { path: "/chapter/:chapterId", element: <MangaChapterDetailPage />},
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* warp the app with the provider, now store is global state */}
    <Provider store={store}> 
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

