import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);


  return (
    <button onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-4 rounded-full transition duration-300 sm:ml-0 dark:text-black dark:bg-white
              ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-amber-200 hover:bg-stone-400"}`}>
            {isDarkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-700" />}
    </button>
  );
};

export default ThemeSwitcher;
