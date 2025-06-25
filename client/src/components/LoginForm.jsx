import { useState } from 'react';
import { login, register } from '../services/api';

function LoginForm({ setCurrentUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isRegister) await register(formData);
      const res = await login(formData);
      setCurrentUser(res.data.user);  
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          )}
          
          <form 
            noValidate 
            className={validated ? 'was-validated' : ''} 
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <div className="invalid-feedback">
                Please provide a username.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="invalid-feedback">
                Please provide a password.
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              {isRegister ? 'Register' : 'Login'}
            </button>

            <div className="text-center">
              <button 
                type="button" 
                className="btn btn-link" 
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
              >
                {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;