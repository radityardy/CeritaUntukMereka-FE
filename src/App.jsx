import { Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/admin/HomePage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/auth/AuthPage";
import DonaturSignUp from "./pages/auth/DonaturSignUp";
import OrphanageSignUp from "./pages/auth/OrphanagaseSignUp";
import HomePageOrphanage from "./pages/orphanage/HomePage";
import OrphanagaseListPage from "./pages/donor/OrphanagaseListPage";
import DonatePage from "./pages/donor/DonatePage";
import DonaturPage from "./pages/donor/DonaturPage";
import NotFoundPage from "./pages/404NotFound";
import AboutPages from "./pages/aboutPages";
import RequestBook from "./pages/orphanage/RequestBook";
import ConfirmBook from "./pages/orphanage/ConfirmBook";
import ProfileOrphanage from "./pages/orphanage/ProfileOrphanage";
import SugestOrphanagePage from "./pages/orphanage/SugestOrphanagePage";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/donatur-signup" element={<DonaturSignUp />} />
        <Route path="/orphanage-signup" element={<OrphanageSignUp />} />
        <Route path="/orphanage-dashboard" element={<HomePageOrphanage />} />
        <Route path="/donatur-dashboard" element={<LandingPage />} />
        <Route path="/donatur-orphanageList" element={<OrphanagaseListPage />} />
        <Route path="/donatur-donate" element={<DonatePage />} />
        <Route path="/donatur-profile" element={<DonaturPage />} />
        <Route path="/orphanage-requestBook" element={<RequestBook />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/orphanage-confirmBook" element={<ConfirmBook />} />
        <Route path="/orphanage-profile" element={<ProfileOrphanage />} />
        <Route path="/orphanage-sugest" element={<SugestOrphanagePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;