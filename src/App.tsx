import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";
import { PublicRoute } from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AddSpaces from "./pages/AddSpaces";
import SpaceDetails from "./pages/SpaceDetails";
import ShareCard from "./pages/ShareCard";
import SharedSpace from "./pages/SharedSpace";


function App() {
  const isAuth = useAuthStore(state => state.isAuth);

  return (
    <Router>
      <Routes>
        <Route path="/card/:id/share" element={<ShareCard/>}/>
        <Route path="/login" element={<PublicRoute isAuth={isAuth}><Login /></PublicRoute>} />
        <Route element={<ProtectedRoute isAllowed={isAuth}><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/add-spaces" element={<AddSpaces />} />
          <Route path="/spaces/:id/cards" element={<SpaceDetails />} />
          <Route path="/spaces/:id/share" element={<SharedSpace/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
