'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MetaMaskButton from '../components/MetaMaskButton';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('register');
  const [stars, setStars] = useState({ slow: [], medium: [], fast: [] });
  const parallaxRef = useRef(null);
  const router = useRouter();

  // 🌌 Star background layers
  useEffect(() => {
    const generateStars = (count) =>
      Array.from({ length: count }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() > 0.5 ? 2 : 3,
      }));

    setStars({
      slow: generateStars(20),
      medium: generateStars(20),
      fast: generateStars(20),
    });
  }, []);

  // 🌠 Mouse-based parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 🎯 Auto-redirect if user is already logged in
  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) {
      fetch(`http://localhost:5000/api/role/${savedWallet}`)
        .then((res) => res.json())
        .then((data) => {
          const role = data.role;
          if (role === 'Admin') router.push('/admin-dashboard');
          else if (role === 'Regulatory Body') router.push('/regulatory-dashboard');
          else if (role === 'General User') router.push('/user-dashboard');
        })
        .catch((err) => console.error('Auto-login failed:', err));
    }
  }, []);

  return (
    <main style={styles.main}>
      <div ref={parallaxRef} style={styles.parallaxContainer}>
        <div style={styles.starsWrapper}>
          {['slow', 'medium', 'fast'].map((layer) => (
            <div key={layer} style={{ ...styles.layer, ...styles[layer] }}>
              {stars[layer].map((star, i) => (
                <span
                  key={i}
                  style={{
                    ...styles.star,
                    top: star.top,
                    left: star.left,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={styles.nebulaOverlay}></div>
        <div style={styles.shootingWrapper}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ ...styles.shootingStar, animationDelay: `${i * 4}s` }} />
          ))}
        </div>
      </div>

      <h1 style={styles.title}>Lumos Space Traffic Management</h1>

      <div style={styles.container}>
        <p style={styles.subtitle}>Connect your wallet to begin</p>
        <MetaMaskButton onConnected={setWalletAddress} />

        {walletAddress && (
          <>
            <p style={styles.connected}>
              ✅ Wallet Connected: <strong>{walletAddress}</strong>
            </p>

            <div style={styles.toggleContainer}>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  ...styles.toggleButton,
                  backgroundColor: activeTab === 'register' ? '#4caf50' : '#555',
                }}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  ...styles.toggleButton,
                  backgroundColor: activeTab === 'login' ? '#4caf50' : '#555',
                }}
              >
                Login
              </button>
            </div>

            <div style={styles.card}>
              {activeTab === 'register' ? <RegisterForm /> : <LoginForm />}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes parallaxSlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-200px); }
        }
        @keyframes parallaxMedium {
          0% { transform: translateY(0); }
          100% { transform: translateY(-400px); }
        }
        @keyframes parallaxFast {
          0% { transform: translateY(0); }
          100% { transform: translateY(-600px); }
        }
        @keyframes shooting {
          0% { transform: translateX(0) translateY(0) rotate(30deg); opacity: 0; }
          10% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% {
            transform: translateX(1000px) translateY(200px) rotate(30deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  parallaxContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    transition: 'transform 0.1s ease-out',
  },
  starsWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  slow: {
    animation: 'parallaxSlow 60s linear infinite',
  },
  medium: {
    animation: 'parallaxMedium 40s linear infinite',
  },
  fast: {
    animation: 'parallaxFast 20s linear infinite',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: '50%',
    opacity: 0.8,
    filter: 'blur(0.8px)',
  },
  shootingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  shootingStar: {
    position: 'absolute',
    top: `${Math.random() * 80}%`,
    left: '-10%',
    width: '150px',
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2), transparent)',
    opacity: 0.4,
    borderRadius: '50%',
    animation: 'shooting 5s ease-in-out infinite',
    boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
    transform: 'rotate(30deg)',
  },
  nebulaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle at 30% 40%, rgba(255, 0, 255, 0.1), transparent), radial-gradient(circle at 70% 60%, rgba(0, 255, 255, 0.1), transparent)',
    mixBlendMode: 'screen',
    filter: 'blur(100px)',
  },
  title: {
    fontSize: '50px',
    fontWeight: 'bold',
    marginBottom: '30px',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    zIndex: 2,
  },
  container: {
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    zIndex: 2,
  },
  subtitle: {
    marginBottom: '20px',
    color: '#ccc',
  },
  connected: {
    marginTop: '20px',
    marginBottom: '20px',
    color: '#90ee90',
    fontSize: '14px',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
  },
  toggleButton: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s ease',
  },
  card: {
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};
