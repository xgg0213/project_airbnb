// frontend/src/components/LoginFormPage/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          // setErrors(data.errors);
          setErrors({ credential: "The provided credentials were invalid" })
        }
      });
  };

  const handleDemoUserLogin = () => {
    // Log in as a demo user
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch((err) => console.error(err));
  };

  // validation
  const isSubmitDisabled = credential.length < 4 || password.length < 6;
  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      {errors.credential && (
          <p>{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit} className='login-form'>
     
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className='form-input'

          />
          {credential && credential.length < 4 && (
            <p className="field-error">Username must be 4 or more characters</p>
          )}


          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form-input'

          />
          {password && password.length < 6 && (
            <p className="field-error">Password must be 6 or more characters</p>
          )}
        
        <button type="submit" disabled={isSubmitDisabled} className='submit-button'>Log In</button>
        <button type="button" className="demo-user-button" onClick={handleDemoUserLogin}>
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;