import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function ProfileUpperNavigationBar() {
  const { user, token, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

    useEffect(() => {
    if (!loading) {
      if (!token) {
        navigate("/login");
      } else if (user) {
        try { setUserName(user.name || "User"); } catch(e) {}
      }
    }
  }, [user, token, loading, navigate]);

  return (
    <>
     

      {/* Top Navbar */}
      <nav className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-800 shadow-md fixed p-4 w-full top-0 left-0 z-50 ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="text-green-800" size={28} />
              </button>
            )}
            {!isMobile && (
              <h1 className="font-bold text-green-700 text-xl sm:text-4xl">
                🌾 KrishiWala
              </h1>
            )}
          </div>

          {/* Right Side - Profile Info */}
          <div className="flex items-center gap-2">
            <img
              src="profilephoto.png"
              alt="User Avatar"
              className="w-9 h-9 rounded-full border-2 border-white object-cover"
            />
            <span className="text-green-700 font-semibold sm:text-base text-sm">
              {userName}
            </span>
          </div>
        </div>
      </nav>
       {/* Sidebar */}
       <ProfileSidebar
        sidebarOpen={isMobile ? isSidebarOpen : true}
        setSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
        user={{
          name: userName,
          image: "/geetanshi-profile.jpg",
        }}
      />
    </>
  );
}

export default ProfileUpperNavigationBar;