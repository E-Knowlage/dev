import React, { useState } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import './css/AddLearningPlan.css';

function AddLearningPlan({ onSave}) {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledTitle = location.state?.title || '';

  const [formData, setFormData] = useState({
    title: prefilledTitle,
    topic: '',
    description: '',
    deadline: '',
    resourceLink: '',
    status: 'Pending',
    userId: 1, // temporary, later use logged-in user
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGoBack = () => {
    navigate('/LearningPlan');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem('token');

    try {
    
      const response = await axios.post('http://localhost:8082/api/learning/create', {
        ...formData,
        resourceLink: formData.resourceLink || (file ? file.name : ''),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

      if (onSave) onSave(response.data); // optional callback
      alert('Learning plan created!');
      setFormData({ title: '', topic: '', description: '', deadline: '', resourceLink: '', status: 'Pending', userId: 1 });
      setFile(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving learning plan:', error);
    }
  };

  return (
    
    <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Create New Plan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} readOnly={!!prefilledTitle}/>
          {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
        </div>

        <div>
          <label>Topic:</label><br />
          <input type="text" name="topic" value={formData.topic} onChange={handleChange}  />
          {errors.topic && <p style={{ color: 'red' }}>{errors.topic}</p>}
        </div>

        <div>
          <label>Description:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div>
          <label>Deadline:</label><br />
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
          {errors.deadline && <p style={{ color: 'red' }}>{errors.deadline}</p>}
        </div>

        <div>
          <label>Resources (link or upload):</label><br />
          <input type="text" name="resourceLink" placeholder="Paste link here (optional)" value={formData.resourceLink} onChange={handleChange} />
          <br />
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
        </div>

        <br />

        <div className="alp-button-group">
          <button type="submit">Save</button>
          <button type="button" className="go-back-btn" onClick={handleGoBack}>Go Back</button>
        </div>
      </form>
    </div>
  );
}

export default AddLearningPlan;
