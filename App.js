import * as React from "react";
import Box from "@mui/material/Box";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Discover from "./views/Discover";
import Manage from "./views/Manage";
import SignIn from "./views/SignIn";

export default function App() {
  return (
    <Box>
      <Router>
        <Routes>
          <Route exact path="/" element={<Discover />} />
          <Route exact path="/devices" element={<Manage />} />
          <Route exact path="/tools" element={<Manage />} />
          <Route exact path="/login" element={<SignIn />} />
        </Routes>
      </Router>
    </Box>
  );
}
