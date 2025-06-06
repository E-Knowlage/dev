import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './css/LearningPlan.css'

const LearningPlanMain = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8082/api/learning/view', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleNewPlan = () => {
    navigate('/new');
  };

  // const handleStatusToggle = (id) => {
  //   setPlans((prevPlans) =>
  //     prevPlans.map((plan) =>
  //       plan.id === id
  //         ? {
  //             ...plan,
  //             status: plan.status === 'In Progress' ? 'Completed' : 'In Progress',
  //           }
  //         : plan
  //     )
  //   );
  // };

  const handleStatusToggle = (id) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== id) return plan;
  
        const nextStatus = plan.status === 'In Progress' ? 'Completed' : 'In Progress';
        return { ...plan, status: nextStatus };
      })
    );
  };
  
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8082/api/learning/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPlans();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
 
  return (
    <div>
      <Navbar/>
      <div className="main-container">
      <div className="header-section">
        <h1>Learning Plan</h1>
        <button className="new-plan-btn" onClick={handleNewPlan}>New Plan</button>
      </div>

      {plans.map((plan) => (
        <div key={plan.id} className="plan-card">
          <div className="card-header">
            <h3 className="plan-title">{plan.title}</h3>
            {/* <button className="add-btn" onClick={() => navigate('/new', { state: { title: plan.title } })}>Add+</button> */}
          </div>

          <div className="plan-table ">
            <div className="table-row  bg">
              <div>Topic</div>
              <div>Description</div>
              <div>Deadline</div>
              <div>Resources</div>
              <div>Status</div>
              <div>Option</div>
            </div>
            <div className="table-row">
              <div>{plan.topic}</div>
              <div>{plan.description || '-'}</div>
              <div>{plan.deadline}</div>
              <div><button className="view-btn" onClick={() => plan.id && navigate(`/resources/${plan.id}`)}>View</button></div>
              {/* <div><button className="status-btn">In Progress</button></div> */}
              <div>
                <button
                className={`status-btn ${plan.status === 'Completed' ? 'completed' : 'in-progress'}`}
                onClick={() => handleStatusToggle(plan.id)}>
                {plan.status}
                </button>
            </div>
              <div className='btn-container'>
                <FaPen className="icon" onClick={() => navigate(`/edit/${plan.id}`)}/>
                <FaTrash className="icon" onClick={() => handleDelete(plan.id)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <Footer/>
    </div>
  );
};

export default LearningPlanMain;
