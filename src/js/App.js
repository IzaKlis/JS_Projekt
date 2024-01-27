import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import Login from "./Login";
import Home from "./Home";
import EditProfile from "./EditProfile";
import Friends from "./Friends";
import AddPost from "./AddPost";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId === " " || userId == null) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/editProfile" element={<EditProfile />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/addPost" element={<AddPost />} />
                    <Route path="/friends" element={<Friends />} />

                    <Route
                        path="*"
                        element={<Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
