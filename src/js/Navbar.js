import {Link, useNavigate} from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        navigate("/login");
    };

    if(sessionStorage.getItem("userId")==null){
    return;
    } else return (

        <div className="navbar">
            <div className="navbar-left">
                <Link to="/">HOME</Link>
            </div>
            <div className="navbar-right">
                <Link to="/friends">Friends</Link>
                <Link to="/profile">My profile</Link>
                <Link to="/addPost">Add post</Link>
                <Link to="/login" onClick={handleLogout}>Log Out</Link>
            </div>
        </div>
    );
}