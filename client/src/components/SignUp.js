import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setMessage('Sign up successful! Please check your email to confirm.');
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage('Error: ' + (errorData.message || 'Something went wrong'));
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
      setIsSuccess(false);
    }
  };

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
    },
    loginText: {
      marginTop: '1em',
      textAlign: 'center',
      fontSize: '0.9em',
    },
    loginLink: {
      color: '#008080',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Регистрация</h2>
        <form onSubmit={handleSignUp}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Имя</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Зарегистрироваться
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: isSuccess ? '#008080' : 'red',
            }}
          >
            {message}
          </p>
        )}

        {/* The new "Already registered?" section */}
        <p style={styles.loginText}>
          Уже зарегистрированы?{' '}
          <Link to="/sign-in" style={styles.loginLink}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
