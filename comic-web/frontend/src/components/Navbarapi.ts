export interface NavbarItem {
    name: string;
    path: string;
  }
  
  export const navbarItems = [
    { name: "Home", path: "/" },
    { name: "Manga", path: "/manga" },
    { name: "Forum", path: "/forum" },
    { name: "Genre", path: "/genre" },
    { name: "Novel", path: "/novel" },
    // { name: "Audio", path: "/audio" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Advanced Search", path: "/avsearch" },
  ];