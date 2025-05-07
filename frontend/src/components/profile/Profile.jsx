import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { API_BASE_URL } from '../../config/apiConfig';
import { storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from '../common/Navbar';
import { useToast } from '../common/Toast';
import Footer from '../common/Footer';

// Import components
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import FollowModal from './components/FollowModal';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: []
  });
  const [error, setError] = useState(null);
  
  // Image upload state
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Follow modals
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followData, setFollowData] = useState([]);
  const [isLoadingFollowData, setIsLoadingFollowData] = useState(false);

  // Fetch profile data - either current user or another user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/auth');
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setCurrentUser(data);

        if (!userId) {
          setUser(data);
          setIsCurrentUserProfile(true);
          setEditForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            bio: data.bio || '',
            skills: data.skills || []
          });
        }
      } catch (error) {
        console.error('Error fetching current user profile:', error);
        addToast('Failed to load user data. Please try again.', 'error');
      }
    };

    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
        setIsCurrentUserProfile(currentUser?.id === data.id);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        addToast('Failed to load user profile. Please try again.', 'error');
        navigate('/dashboard');
      }
    };

    setIsLoading(true);
    fetchCurrentUser()
      .then(() => fetchUserProfile())
      .finally(() => setIsLoading(false));

  }, [navigate, userId, addToast]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!imageUpload) return null;

    try {
      setIsUploading(true);
      const imageName = `${user.id}_${Date.now()}_${imageUpload.name}`;
      const storageRef = ref(storage, `profileImages/${imageName}`);

      await uploadBytes(storageRef, imageUpload);

      const url = await getDownloadURL(storageRef);
      setIsUploading(false);

      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      setIsUploading(false);
      addToast('Failed to upload image. Please try again.', 'error');
      return null;
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let profilePictureUrl = user.profilePicture;
      if (imageUpload) {
        profilePictureUrl = await handleImageUpload();
        if (!profilePictureUrl) {
          return;
        }
      }

      const updateData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio,
        skills: editForm.skills,
        profilePicture: profilePictureUrl
      };

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setImageUpload(null);
      setImagePreview(null);

      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleSkillChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setEditForm({
      ...editForm,
      skills: skillsArray
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const fetchFollowData = async (type) => {
    setIsLoadingFollowData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${type}/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }

      const data = await response.json();
      setFollowData(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setFollowData([]);
    } finally {
      setIsLoadingFollowData(false);
    }
  };

  const handleShowFollowers = () => {
    fetchFollowData('followers');
    setShowFollowersModal(true);
  };

  const handleShowFollowing = () => {
    fetchFollowData('following');
    setShowFollowingModal(true);
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isFollowing ? 'unfollow' : 'follow';

      const response = await fetch(`${API_BASE_URL}/users/${endpoint}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${endpoint} user`);
      }

      const type = showFollowersModal ? 'followers' : 'following';
      fetchFollowData(type);

      setFollowData(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, isFollowing: !isFollowing }
            : user
        )
      );

      addToast(
        isFollowing ? 'Successfully unfollowed user' : 'Successfully followed user',
        'success'
      );
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
      addToast(error.message || `Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`, 'error');
    }
  };

  const handleFollowAction = async () => {
    if (!user || isCurrentUserProfile) return;

    const isFollowing = user.isFollowing;

    try {
      const token = localStorage.getItem('token');
      const endpoint = isFollowing ? 'unfollow' : 'follow';

      const response = await fetch(`${API_BASE_URL}/users/${endpoint}/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} user`);
      }

      setUser(prev => ({
        ...prev,
        isFollowing: !isFollowing
      }));

      addToast(
        isFollowing ? 'Successfully unfollowed user' : 'Successfully followed user',
        'success'
      );
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
      addToast(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`, 'error');
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-PrimaryColor">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-PrimaryColor">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl text-red-600 font-semibold mb-4">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-DarkColor text-white rounded-md hover:bg-ExtraDarkColor"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar user={currentUser} />

      {/* Profile Header */}
      <ProfileHeader
        user={user}
        currentUser={currentUser}
        isCurrentUserProfile={isCurrentUserProfile}
        isEditing={isEditing}
        imagePreview={imagePreview}
        triggerFileInput={triggerFileInput}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        isUploading={isUploading}
        setIsEditing={setIsEditing}
        handleLogout={handleLogout}
        handleFollowAction={handleFollowAction}
        handleShowFollowers={handleShowFollowers}
        handleShowFollowing={handleShowFollowing}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <AboutSection
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            handleEditSubmit={handleEditSubmit}
            handleSkillChange={handleSkillChange}
            isUploading={isUploading}
            imageUpload={imageUpload}
            imagePreview={imagePreview}
            setImageUpload={setImageUpload}
            setImagePreview={setImagePreview}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>

      {/* Followers Modal */}
      <FollowModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        data={followData}
        isLoading={isLoadingFollowData}
        onFollowToggle={handleFollowToggle}
      />

      {/* Following Modal */}
      <FollowModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        data={followData}
        isLoading={isLoadingFollowData}
        onFollowToggle={handleFollowToggle}
      />

      <Footer />
    </div>
  );
};

export default Profile;
