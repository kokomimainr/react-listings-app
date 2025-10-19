import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/providers/store/ZustandStore";
import { useLogout } from "@/hooks/useAuth";
import {
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const Header: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/");
        setIsMobileMenuOpen(false);
      },
    });
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Housing Catalog
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="rounded px-2 py-1 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>
            {token ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="w-4 h-4" />
                  <span>{t("welcome")}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSignOutAlt className="w-3 h-3" />
                  {isPending ? t("loggingOut") : t("logout")}
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <FaSignInAlt className="w-3 h-3" />
                {t("signIn")}
              </button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t("language")}:</span>
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="rounded px-2 py-1 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                >
                  <option value="en">EN</option>
                  <option value="ru">RU</option>
                </select>
              </div>

              {token ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700 py-2">
                    <FaUser className="w-4 h-4" />
                    <span>{t("welcome")}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaSignOutAlt className="w-3 h-3" />
                    {isPending ? t("loggingOut") : t("logout")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <FaSignInAlt className="w-3 h-3" />
                  {t("signIn")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
