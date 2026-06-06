import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/login";
import SelectAddress from "./components/SelectAddress";
import PostLand from "./pages/PostLand";
import BankDetails from "./pages/BankDetails";
import Headerpart from "./components/Headerpart";
import Sidebar from "./components/Sidebar";

import TakeLandOnRent from "./pages/TakeLandOnRent";
import TakeLandOnRentHeader from "./components/TakeLandOnRentHeader";
import Home from "./pages/Home";
import LabourRegistration from "./pages/LobourRegistration";
import MachineRegistration from "./pages/MachineRegistration";
import SearchMachinary from "./pages/SearchMachinary";
import SearchLabour from "./pages/SearchLabour";
import ReceivedRequestTable from "./components/ReceivedRequestTable";
import SentRequestTable from "./components/SentRequestTable";
import ProfilePage from "./pages/ProfilePage";
import ChatSupport from "./pages/ChatSupport";
import SearchNavBar from "./components/SearchNavBar";
import CallApiButton from "./components/CallApiButton";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SelectAddress" element= {<SelectAddress />} />
        <Route path="/PostLand" element= {<PostLand />} />
        <Route path="/BankDetails" element= {<BankDetails />} />
        <Route path="/Headerpart" element= {<Headerpart />} />
        <Route path="/Sidebar" element= {<Sidebar />} />
        <Route path="/TakeLandOnRent" element= {<TakeLandOnRent />} />
        <Route path="/SearchNavBar" element= {<SearchNavBar />} />
       
        <Route path="/TakeLandOnRentHeader" element= {<TakeLandOnRentHeader />} />
        <Route path="/LabourRegistration" element= {<LabourRegistration />} />
        <Route path="/MachineRegistration" element= {<MachineRegistration />} />
        <Route path="/SearchMachinary" element= {<SearchMachinary />} />
        <Route path="/SearchLabour" element= {<SearchLabour />} />
        <Route path="/ReceivedRequestTable" element= {<ReceivedRequestTable />} />
        <Route path="/SentRequestTable" element= {<SentRequestTable />} />
        <Route path="/ProfilePage" element= {<ProfilePage />} />
        <Route path="/ChatSupport" element= {<ChatSupport />} />
        <Route path="/Abhishek4852" element= {<CallApiButton />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;