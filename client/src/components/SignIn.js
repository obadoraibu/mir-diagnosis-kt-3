import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Simple fingerprint generator (placeholder logic)
  const generateFingerprint = () => {
    return navigator.userAgent + Math.random().toString(36).substring(2);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const fingerprint = generateFingerprint();

    try {
      const response = await fetch('http://localhost:8080/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fingerprint }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access && data.refresh) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          navigate('/home');
        } else {
          setMessage('Invalid response from server.');
        }
      } else {
        const errorData = await response.json();
        setMessage('Error: ' + (errorData.message || 'Something went wrong'));
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  // Basic styling object
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      padding: '1em',
    },
    loginBox: {
      backgroundColor: '#fff',
      borderRadius: '0.5em',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      padding: '2em',
      maxWidth: '400px',
      width: '100%',
      margin: '1em',
    },
    heading: {
      marginBottom: '1em',
      textAlign: 'center',
      color: '#004D4D',
    },
    formGroup: {
      marginBottom: '1em',
    },
    label: {
      display: 'block',
      marginBottom: '0.5em',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '0.75em',
      border: '1px solid #ccc',
      borderRadius: '0.25em',
      fontSize: '1em',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '0.75em',
      backgroundColor: '#008080',
      color: '#fff',
      border: 'none',
      borderRadius: '0.25em',
      fontSize: '1em',
      cursor: 'pointer',
      marginTop: '1em',
    },
    message: {
      marginTop: '1em',
      textAlign: 'center',
      color: 'red',
    },
    registerText: {
      marginTop: '1em',
      textAlign: 'center',
      fontSize: '0.9em',
    },
    registerLink: {
      color: '#008080',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Авторизация</h2>
        <form onSubmit={handleSignIn}>
          <div style={styles.formGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button style={styles.button} type="submit">
            Войти
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.registerText}>
          Новый пользователь?{' '}
          <Link to="/sign-up" style={styles.registerLink}>
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
