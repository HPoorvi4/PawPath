import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Doesnt need login pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Service from "./pages/Service";
import Review from "./pages/Review";
import Contact from "./pages/Contact";
import AllReviews from "./pages/AllReviews";
import RateUs from "./pages/RateUs";

// These things   (requires login)
import Home from "./pages/Home";
import Adopt from './pages/Adopt';
import Sell from './pages/Sell';
import LostReport from "./pages/LostReport";
import LostFoundList from "./pages/LostFoundList";
import DocAppointment from "./pages/DocAppointment";
import MyProfile from "./pages/MyProfile";
import PetDetails from "./pages/PetDetails";
import VetDetails from "./pages/VetDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import EditProfile from "./pages/EditProfile";
import EditPet from "./pages/EditPet"; 
import EditAppointment from "./pages/EditAppointment";
import LostPetDetails from "./pages/LostPetDetails";
import FoundPetDetails from "./pages/FoundPetDetails";

function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/review" element={<Review />} />
        <Route path="/review/all" element={<AllReviews />} />
        <Route path="/review/new" element={<RateUs />} />
        <Route path="/contact" element={<Contact />} />

       
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/adopt"
          element={
            <PrivateRoute>
              <Adopt />
            </PrivateRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <PrivateRoute>
              <Sell />
            </PrivateRoute>
          }
        />
        <Route
          path="/lost-report"
          element={
            <PrivateRoute>
              <LostReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/lost-search"
          element={
            <PrivateRoute>
              <LostFoundList />
            </PrivateRoute>
          }
        />
        <Route
          path="/doc-appointment"
          element={
            <PrivateRoute>
              <DocAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/myprofile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/pet/:id"
          element={
            <PrivateRoute>
              <PetDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/vet/:id"
          element={
            <PrivateRoute>
              <VetDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking/confirmation"
          element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/lost/:id"
          element={
            <PrivateRoute>
              <LostPetDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/found/:id"
          element={
            <PrivateRoute>
              <FoundPetDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-pet/:id"
          element={
            <PrivateRoute>
              <EditPet />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-appointment/:id"
          element={
            <PrivateRoute>
              <EditAppointment />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
