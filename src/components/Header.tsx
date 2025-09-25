import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaFileAlt,
  FaUser,
  FaSignOutAlt as FaLogout,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Variantes de animação para o menu
  const menuVariants = {
    closed: {
      x: "-100%",
    },
    open: {
      x: 0,
    },
  };

  // Variantes para o overlay
  const overlayVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  };

  // Variantes para os itens do menu
  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  // Variantes para o container dos itens
  const menuContainerVariants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <>
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 md:py-6 px-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="flex items-center">
            <img
              src="/Logo.png"
              alt="Blog Edc"
              className="h-16 md:h-20 w-auto"
            />
          </Link>
          {/* Ícone de menu para mobile/tablet */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
            title="Menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaBars size={20} />
            </motion.div>
          </motion.button>
        </div>

        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          <Link to="/home" className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link to="/posts" className="text-gray-700 hover:text-black">
            Posts
          </Link>
        </nav>

        {/* Botões de ação desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {user && (
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
              <span>Olá, {user.name}</span>
              <span className="text-orange-500 font-medium">
                ({user.userType === "professor" ? "Professor" : "Aluno"})
              </span>
            </div>
          )}
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-gray-900 transition-colors"
            title="Perfil"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={28} />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 transition-colors"
            title="Sair"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </header>

      {/* Menu lateral para mobile/tablet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay transparente */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              onClick={closeMenu}
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
            />

            {/* Menu lateral transparente */}
            <motion.div
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white bg-opacity-80 backdrop-blur-custom shadow-xl z-50 md:hidden mobile-menu border-r border-white border-opacity-30"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Header do menu */}
              <motion.div
                className="flex items-center justify-between p-4 border-b border-gray-200 border-opacity-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <motion.button
                  onClick={closeMenu}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes size={20} />
                </motion.button>
              </motion.div>

              {/* Navegação do menu */}
              <nav className="p-4">
                <motion.div
                  className="space-y-4"
                  variants={menuContainerVariants}
                  initial="closed"
                  animate="open"
                >
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/home"
                      onClick={closeMenu}
                      className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition-colors py-3 px-3 rounded-lg hover:bg-orange-50 hover:bg-opacity-70 menu-item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaHome size={18} className="text-orange-500" />
                      </motion.div>
                      <span className="text-base font-semibold">Home</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/posts"
                      onClick={closeMenu}
                      className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition-colors py-3 px-3 rounded-lg hover:bg-orange-50 hover:bg-opacity-70 menu-item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaFileAlt size={18} className="text-orange-500" />
                      </motion.div>
                      <span className="text-base font-semibold">Posts</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Informações do usuário */}
                {user && (
                  <motion.div
                    className="mt-8 pt-6 border-t border-gray-200 border-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.div
                      className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 bg-opacity-70"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {user.profileImage ? (
                        <motion.img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        />
                      ) : (
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-orange-500"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaUserCircle size={24} className="text-gray-500" />
                        </motion.div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-orange-600 font-semibold">
                          {user.userType === "professor"
                            ? "Professor"
                            : "Aluno"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      variants={menuContainerVariants}
                      initial="closed"
                      animate="open"
                    >
                      <motion.div variants={menuItemVariants}>
                        <motion.button
                          onClick={() => {
                            navigate("/profile");
                            closeMenu();
                          }}
                          className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition-colors py-3 px-3 rounded-lg hover:bg-orange-50 hover:bg-opacity-70 w-full text-left menu-item"
                          whileHover={{ x: 5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaUser size={18} className="text-orange-500" />
                          </motion.div>
                          <span className="text-base font-semibold">
                            Perfil
                          </span>
                        </motion.button>
                      </motion.div>

                      <motion.div variants={menuItemVariants}>
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors py-3 px-3 rounded-lg hover:bg-red-50 hover:bg-opacity-70 w-full text-left menu-item"
                          whileHover={{ x: 5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaLogout size={18} />
                          </motion.div>
                          <span className="text-base font-semibold">Sair</span>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
