// SearchMachineNavigationBar.jsx
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function SearchMachineNavigationBar({ setIsOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-800 shadow-md p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isMobile && (
            <button
              onClick={() => setIsOpen(true)}
              className="text-green-700 p-2 rounded border"
            >
              <Menu className="text-green-700" size={28} />
            </button>
          )}
          <h1 className="font-bold text-green-700 text-xl sm:text-4xl">
            🌾 KrishiWala
          </h1>
        </div>
      </div>
    </nav>
  );
}
