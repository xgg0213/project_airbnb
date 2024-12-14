import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log(data);
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  // validation
  const isSubmitDisabled = !email.length || !username.length || !firstName.length 
  || !lastName.length || !password.length || (username && username.length<4) || (password && password.length<6)

  return (
    <div className='login-modal-container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            
          />
        </label>
        {errors.firstName && <p id='signup-error'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            
          />
        </label>
        {errors.lastName && <p id='signup-error'>{errors.lastName}</p>}
        <label>
          Email
          <input
              type="text"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
        </label>
        

        {errors.email && <p id='signup-error'>{errors.email}</p>}
        <label>
          Username
          <input
              type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />
        </label>
        
 
        {errors.username && <p id='signup-error'>{errors.username}</p>}

        <label>
          Password
          <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
        </label>
          
        {errors.password && <p id='signup-error'>{errors.password}</p>}
        <label>
          Confirm Password
          <input
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              
            />
        </label>
          
        {errors.confirmPassword && (
          <p id='signup-error'>{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={isSubmitDisabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;