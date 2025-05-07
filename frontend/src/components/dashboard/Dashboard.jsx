import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/apiConfig';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Fetch user profile data for the navbar
    const fetchUserProfile = async () => {
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
        setUser(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <Footer />
    </div>
  );
};

export default Dashboard;
