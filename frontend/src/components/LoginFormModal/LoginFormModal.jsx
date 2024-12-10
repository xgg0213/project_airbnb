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
        console.log(data.errors)
        if (data && data.errors) {
          // setErrors(data.errors);
          setErrors({ credential: "The provided credentials were invalid" })
        }
      });
  };

  // validation
  const isSubmitDisabled = credential.length < 4 || password.length < 6;
  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className='login-form'>
        <label>
          {/* Username or Email */}
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            className='form-input'
            // required
          />
          {credential && credential.length < 4 && (
            <p className="field-error">Username must be 4 or more characters</p>
          )}
        </label>
        <label>
          {/* Password */}
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form-input'
            // required
          />
          {password && password.length < 6 && (
            <p className="field-error">Password must be 6 or more characters</p>
          )}
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={isSubmitDisabled} className='submit-button'>Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;