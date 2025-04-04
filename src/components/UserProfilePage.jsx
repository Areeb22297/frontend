import '../assets/styles/Auth.css';
import '../assets/styles/Profile.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function UserProfilePage() {
  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    email: "",
    bio: "",
    profile_picture_url: null,
    is_verified: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${username}/profile/`, {
          withCredentials: true
        });

        setProfileData({
          ...response.data,
          profile_picture_url: response.data.profile_picture_url
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("User not found.");
        } else {
          setError("Failed to load user profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    // If trying to view your own profile, redirect to the profile edit page
    if (user && user.username === username) {
      navigate('/profile');
      return;
    }

    if (user) {
      fetchUserProfile();
    }
  }, [user, username, navigate]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="profile-container fade-in">
      <div className="profile-header glass-card slide-up">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-avatar-wrapper">
            <img
              src={profileData.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
              alt="Profile"
              className="profile-avatar"
            />
          </div>
          <div className="profile-details">
            <h1>{profileData.full_name}</h1>
            <p className="username">@{profileData.username}</p>
            <p className="email">{profileData.email}</p>
            <p className="bio">{profileData.bio}</p>
            {profileData.is_verified && (
              <p className="verified-badge">
                <i className="fas fa-check-circle"></i> Verified Account
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="user-actions">
        <button
          className="action-button message-button"
          onClick={() => navigate('/messages', { state: { username: profileData.username } })}
        >
          <i className="fas fa-envelope"></i> Send Message
        </button>
      </div>
    </div>
  );
}
