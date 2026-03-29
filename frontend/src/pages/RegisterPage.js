// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    gender: '',
    accountType: 'basic' // Default to basic instead of empty
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, name } = e.target;
    
    if (type === 'radio') {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.name === "") {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (formData.email === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.birthday === "") {
      newErrors.birthday = "Birthday is required";
      isValid = false;
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.birthday = "You must be 18 years or older to register";
        isValid = false;
      }
    }

    if (formData.password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.confirmPassword === "") {
      newErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (formData.gender === "") {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for backend (exclude confirmPassword)
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      birthday: formData.birthday,
      gender: formData.gender,
      accountType: formData.accountType
    };

    try {
      const result = await register(userData);
      
      if (result.success) {
        // Success! Show welcome message and redirect
        alert(`🎉 Welcome to Cooking XCR, ${formData.name}!\n\nYou have successfully registered. You'll now receive updates about new recipes and cooking tips.`);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          birthday: '',
          password: '',
          confirmPassword: '',
          gender: '',
          accountType: ''
        });
        
        // Redirect to home page
        navigate('/home');
      } else {
        // Show error from backend
        setApiError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <div className="car-container">
          <div className="car">
            <h2>Sign Up for Cooking Updates</h2>
            <p>
              By signing up, you will receive updates about my cooking journey,
              new dishes, and future food-related content.
            </p>

            {apiError && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #f5c6cb'
              }}>
                {apiError}
              </div>
            )}

            <form id="registrationForm" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              
              <div>
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              
              <div>
                <label htmlFor="birthday">Birthday (Must be 18+):</label>
                <input 
                  type="date" 
                  id="birthday" 
                  name="birthday" 
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.birthday && <span className="error">{errors.birthday}</span>}
              </div>
              
              <div>
                <label htmlFor="password">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
              
              <div>
                <label>Gender:</label>
                <div className="radio-group">
                  <input 
                    type="radio" 
                    id="male" 
                    name="gender" 
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="male">Male</label>
                  
                  <input 
                    type="radio" 
                    id="female" 
                    name="gender" 
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="female">Female</label>
                  
                  <input 
                    type="radio" 
                    id="other" 
                    name="gender" 
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="other">Other</label>
                </div>
                {errors.gender && <span className="error">{errors.gender}</span>}  
              </div>
                
              <div>
                <label htmlFor="accountType">Account Type:</label>
                <select 
                  id="accountType" 
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.accountType && <span className="error">{errors.accountType}</span>}
              </div>
              
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <img src="food3.jpg" alt="mixed foods" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Register;