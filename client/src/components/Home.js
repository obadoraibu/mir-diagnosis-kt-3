import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Example static data for Исследования view
  const tableData = [
    {
      id: 45687,
      sex: 'М',
      age: 76,
      serviceName: 'MRI Scan',
      status: 'Completed',
      studyDate: '2025-03-01',
      uploadDate: '2025-03-02',
    },
    {
      id: 9872364,
      sex: 'М',
      age: 67,
      serviceName: 'CT Scan',
      status: 'Processing',
      studyDate: '2025-03-10',
      uploadDate: '2025-03-11',
    },
    {
      id: 997838,
      sex: 'М',
      age: 82,
      serviceName: 'X-Ray',
      status: 'Completed',
      studyDate: '2025-02-28',
      uploadDate: '2025-03-01',
    },
  ];

  // Basic styling objects (mirroring SignIn/SignUp color palette)
  const styles = {
    pageWrapper: {
      backgroundColor: '#f2f2f2',
      minHeight: '100vh',
    },
    header: {
      backgroundColor: '#008080', // teal to match SignIn/SignUp
      color: '#fff',
      padding: '1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '1.25em',
      fontWeight: 'bold',
    },
    navItems: {
      display: 'flex',
      gap: '1em',
    },
    navItem: {
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    container: {
      maxWidth: '1100px',
      margin: '2em auto',
      backgroundColor: '#fff',
      padding: '2em',
      borderRadius: '0.5em',
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1em',
    },
    title: {
      margin: 0,
      color: '#008080',
    },
    uploadButton: {
      backgroundColor: '#008080',
      color: '#fff',
      border: 'none',
      padding: '0.75em 1.5em',
      borderRadius: '0.25em',
      fontSize: '1em',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#e6e6e6',
      padding: '0.75em',
      border: '1px solid #ccc',
      textAlign: 'left',
    },
    td: {
      padding: '0.75em',
      border: '1px solid #ccc',
    },
    // Modal overlay styles for file upload
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '2em',
      borderRadius: '0.5em',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
    },
    dropArea: {
      border: '2px dashed #008080',
      borderRadius: '0.5em',
      padding: '2em',
      marginTop: '1em',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
    },
    closeButton: {
      marginTop: '1em',
      backgroundColor: '#ccc',
      border: 'none',
      borderRadius: '0.25em',
      padding: '0.5em 1em',
      cursor: 'pointer',
    },
    // Styles for the profile view
    profileField: {
      marginBottom: '1em',
      fontSize: '1em',
    },
    profileLabel: {
      fontWeight: 'bold',
      color: '#333',
    },
  };

  const [activeTab, setActiveTab] = useState('studies'); // 'studies' or 'profile'
  const [message, setMessage] = useState('Loading...');
  const [userData, setUserData] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Common token check and redirect
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setMessage('No token found. Redirecting to sign-in...');
      navigate('/sign-in');
    }
  }, [navigate]);

  // Fetch profile info when Profile tab is active
  useEffect(() => {
    if (activeTab !== 'profile') return;

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const fetchProfile = async (token) => {
      try {
        const response = await fetch('http://localhost:8080/resource', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
        } else {
          setMessage('Session expired. Redirecting to sign-in...');
          navigate('/sign-in');
        }
      } catch (error) {
        setMessage('Error fetching resource. Redirecting to sign-in...');
        navigate('/sign-in');
      }
    };

    const refreshAccessToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.access);
          fetchProfile(data.access);
        } else {
          setMessage('Session expired. Redirecting to sign-in...');
          navigate('/sign-in');
        }
      } catch {
        setMessage('Session expired. Redirecting to sign-in...');
        navigate('/sign-in');
      }
    };

    fetchProfile(accessToken);
  }, [activeTab, navigate]);

  // --- File Upload handlers (for studies view) ---
  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);
      // Implement your file upload logic here
      setIsUploadOpen(false); // Close modal after selection
    }
  };

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleDropAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    handleFileSelect(files);
  };

  // --- Render Content based on activeTab ---
  const renderContent = () => {
    if (activeTab === 'studies') {
      return (
        <>
          <div style={styles.titleRow}>
            <h2 style={styles.title}>Исследования</h2>
            <button style={styles.uploadButton} onClick={handleUploadClick}>
              Загрузить
            </button>
          </div>
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '1em',
              borderRadius: '0.25em',
              marginBottom: '1em',
            }}
          >
            <p style={{ margin: 0 }}></p>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID Пациента</th>
                <th style={styles.th}>Пол, возраст</th>
                <th style={styles.th}>Дата исследования</th>
                <th style={styles.th}>Дата загрузки</th>
                <th style={styles.th}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td style={styles.td}>{row.id}</td>
                  <td style={styles.td}>{`${row.sex}, ${row.age}`}</td>
                  <td style={styles.td}>{row.studyDate}</td>
                  <td style={styles.td}>{row.uploadDate}</td>
                  <td style={styles.td}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else if (activeTab === 'profile') {
      // Display a simple profile card with user info
      return (
        <>
          <h2 style={styles.title}>Профиль</h2>
          <br></br>
          {userData ? (
            <div>
              <div style={styles.profileField}>
                <span style={styles.profileLabel}>Имя: </span>
                <span>{userData.name}</span>
              </div>
              <div style={styles.profileField}>
                <span style={styles.profileLabel}>Email: </span>
                <span>{userData.email}</span>
              </div>
              <div style={styles.profileField}>
                <span style={styles.profileLabel}>Подтверждён: </span>
                <span>{userData.IsConfirmed ? 'Да' : 'Нет'}</span>
              </div>
            </div>
          ) : (
            <p>{message}</p>
          )}
        </>
      );
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* HEADER / NAVBAR */}
      <header style={styles.header}>
        <div style={styles.logo}>MRI App</div>
        <div style={styles.navItems}>
          <span
            style={styles.navItem}
            onClick={() => setActiveTab('studies')}
          >
            Исследования
          </span>
          <span
            style={styles.navItem}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </span>
        </div>
        <div></div>
      </header>

      {/* MAIN CONTENT */}
      <div style={styles.container}>{renderContent()}</div>

      {/* Modal for file upload (only applicable to Исследования view) */}
      {isUploadOpen && activeTab === 'studies' && (
        <div
          style={styles.modalOverlay}
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#008080' }}>Выберите файл</h3>
            <p>Перетащите файл сюда или нажмите, чтобы выбрать</p>
            <div
              style={styles.dropArea}
              onClick={handleDropAreaClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              Перетащите файл сюда
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <button
              style={styles.closeButton}
              onClick={() => setIsUploadOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
