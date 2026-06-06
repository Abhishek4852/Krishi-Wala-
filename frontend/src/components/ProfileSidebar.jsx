import { Home, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileSidebar({ sidebarOpen, setSidebarOpen, isMobile, user, setIsChatOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChatSupportClick = () => {
    window.dispatchEvent(new Event("open-chat-support"));
    setSidebarOpen(false);    // Close sidebar
    setIsChatOpen(true);      // Open chatbot
  };

  return (
    <>
      {/* Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed top-17 left-0 h-full w-64 bg-green-800 text-white p-6 shadow-lg transform transition-transform duration-300 z-50 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `fixed top-17 left-0 h-full w-64 bg-green-800 text-white p-6 shadow-lg z-40 ${
                sidebarOpen ? "" : "hidden"
              }`
        }`}
      >
        {/* Close button only on mobile */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        )}

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 mt-8 border-b border-green-600 pb-4">
          <img
            src={"profilephoto.png"}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />
          <span className="text-lg font-bold">
            {user?.name || "Guest User"}
          </span>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-6 font-medium">
          <a
            href="https://krishi-wala-fkfg.vercel.app/"
            className="flex items-center gap-3 hover:text-yellow-300 transition"
          >
            <Home size={24} />
            <span>Home</span>
          </a>

          {/* Chat Support opens chatbot and closes sidebar */}
          <button
            onClick={handleChatSupportClick}
            className="flex items-center gap-3 hover:text-yellow-300 transition"
          >
            <MessageSquare size={24} />
            <span>Chat Support</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileSidebar;
