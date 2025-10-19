import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/providers/store/ZustandStore";
import { useLogout } from "@/hooks/useAuth";
import { FaSignInAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

export const Header: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Housing Catalog
          </Link>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="w-4 h-4" />
                  <span>Welcome!</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSignOutAlt className="w-3 h-3" />
                  {isPending ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <FaSignInAlt className="w-3 h-3" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};