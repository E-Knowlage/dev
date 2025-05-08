import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/UpdateLearningPlan.css';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const UpdateLearningPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState({
    title: '',
    topic: '',
    description: '',
    deadline: '',
    resources: '',
    status: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8082/api/learning/view/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlan(response.data);
      } catch (error) {
        console.error('Failed to fetch plan:', error);
        setError('Failed to load plan data');
      }
    };
    fetchPlan();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8082/api/learning/update/${id}`, plan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/LearningPlan');
    } catch (error) {
      console.error('Update failed:', error);
      setError('Failed to update plan');
    }
  };

  const handleCancel = () => {
    navigate('/LearningPlan');
  };

  return (
    <div>
      <Navbar/>
    <div className="update-main-container">
      <h1>Update Learning Plan</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="plan-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={plan.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Topic</label>
          <input
            type="text"
            name="topic"
            value={plan.topic}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={plan.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={plan.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Resources</label>
          <input
            type="text"
            name="resources"
            value={plan.resources}
            onChange={handleChange}
          />
        </div>
      
        <div className="form-buttons">
          <button type="submit" className="submit-btn">Update Plan</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default UpdateLearningPlan;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {useNavigate, useParams } from 'react-router-dom';
// import '../css/UpdateLearningPlan.css';

// const UpdateLearningPlan = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [plan, setPlan] = useState({
//     title: '',
//     topic: '',
//     description: '',
//     deadline: '',
//     resources: ''
//   });
//   const [error, setError] = useState(null);

//   // useEffect(() => {
//   //   const fetchPlan = async () => {
//   //     try {
//   //       const response = await axios.get(`http://localhost:8082/api/learning/${id}`);
//   //       setPlan(response.data);
//   //     } catch (error) {
//   //       console.error('Failed to fetch plan details:', error);
//   //     }
//   //   };
//   //   fetchPlan();
//   // }, [id]);

//   useEffect(() => {
//     const fetchPlan = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8082/api/learning/${id}`);
//         console.log('Fetched plan:', response.data);

//         setPlan(response.data);
//       } catch (error) {
//         console.error('Failed to fetch plan details:', error);
//         setError('Failed to load plan data');
//       }
//     };
//     fetchPlan();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPlan((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:8082/api/learning/update/${id}`, plan);
//       navigate('/');
//     } catch (error) {
//       console.error('Update failed:', error);
//       setError('Failed to update plan');
//     }
//   };

//   const handleCancel = () => {
//     navigate('/');
//   };

//   return (
//     <div className="update-container">
//       <h2>Update Learning Plan</h2>
//       {error && <div className="error-message">{error}</div>}
//       <div className="form-group">
//         <label>Title</label>
//         <input
//           type="text"
//           name="title"
//           value={plan.title}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div className="form-group">
//           <label>Topic</label>
//           <input
//             type="text"
//             name="topic"
//             value={plan.topic}
//             onChange={handleChange}
//             required
//           />
//       </div>
//       <div className="form-group">
//         <label>Description</label>
//         <textarea
//           name="description"
//           rows="4"
//           value={plan.description}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="form-group">
//         <label>Deadline</label>
//         <input
//           type="date"
//           name="deadline"
//           value={plan.deadline}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label>Resources</label>
//         <input
//           type="text"
//           name="resources"
//           value={plan.resources}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="button-group">
//         <button className="save-btn" onClick={handleSubmit}>Save</button>
//         <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default UpdateLearningPlan;