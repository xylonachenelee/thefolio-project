// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api/axios'; // ← ADD THIS

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ← ADD THIS

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactForm = () => {
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
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.message === "") {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => { // ← MADE ASYNC
    e.preventDefault();
    
    if (!validateContactForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send message to backend
      await API.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Message',
        message: formData.message
      });

      alert("📬 Thank you for your message!\n\nI appreciate you reaching out and will get back to you soon.\n\n- Cooking XCR");
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message. Please try again later.');
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
            <h2>Contact Me</h2>
            <p>
              If you would like to share cooking ideas, ask questions, or provide feedback,
              feel free to send a message using the form below.
            </p>

            <form id="contactForm" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.message && <span className="error">{errors.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <h2>Cooking Resources</h2>
            <p>
              Below are some trusted websites that helped me learn more about cooking.
              These resources offer recipes, techniques, and inspiration.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a href="https://www.allrecipes.com/" target="_blank" rel="noopener noreferrer">Allrecipes</a></td>
                  <td>Community-based recipes and cooking tips</td>
                </tr>
                <tr>
                  <td><a href="https://tasty.co/" target="_blank" rel="noopener noreferrer">Tasty</a></td>
                  <td>Beginner-friendly cooking videos and guides</td>
                </tr>
                <tr>
                  <td><a href="https://www.seriouseats.com" target="_blank" rel="noopener noreferrer">Serious Eats</a></td>
                  <td>Detailed explanations of cooking techniques</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <h3>Want More Help?</h3>
            Gmail: cookingwhxcr@gmail.com<br />
            Facebook: CookingwhxcrPH<br />
            Tiktok: cookingwh_xcr<br />
            Phone: 0912-365-7000<br />
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <h2>Location</h2>
            <p>La Trinidad, Benguet, Philippines</p>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.541300057049!2d120.58781707584163!3d16.448151929165985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33d1b46321f421f1%3A0x742f88365612e6d6!2sLa%20Trinidad%20Strawberry%20Farm!5e0!3m2!1sen!2sph!4v1709100000000!5m2!1sen!2sph" 
              width="100%" 
              height="500" 
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="La Trinidad Strawberry Farm"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Contact;