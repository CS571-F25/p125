import { HashRouter, Route, Routes } from 'react-router';
import './App.css';
import Home from './components/Home';
import AboutMe from './components/AboutMe';
import PrimaryNav from './components/PrimaryNav';
import ViewSet from './components/ViewSet';
import Account from './components/Account';
import Login from './components/Login';
import CardDetails from './components/CardDetails';
import WishList from './components/WishList';

import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  if (loading) return <div className="p-10">Loading...</div>;

  // If not logged in → show Login screen
  if (!user) {
    return <Login />;
  }

  return (
    <HashRouter>
      <PrimaryNav user={user} onLogout={logout} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/viewset/:id" element={<ViewSet user={user} />} />
          <Route path="/card/:setId/:cardId" element={<CardDetails user={user} />} />
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/wishlist" element={<WishList user={user} />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
