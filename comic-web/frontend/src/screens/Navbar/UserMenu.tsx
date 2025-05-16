import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../types/user/userSlice";
import { logoutUser } from "../../actions/userActions";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  return (
    <div className="relative">
      <img src="/avatar.jpg" alt="Avatar" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Hồ sơ</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200">Đăng xuất</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
