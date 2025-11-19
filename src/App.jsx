import { HashRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './components/Home'
import AboutMe from './components/AboutMe'
import PrimaryNav from './components/PrimaryNav'
import ViewSet from './components/ViewSet'
import Account from './components/Account'

function App(){
  return <HashRouter>
    <PrimaryNav />
    <div className="pt-16">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<AboutMe/>} />
        <Route path="/viewset/:id" element={<ViewSet/>} />
        <Route path="/account" element={<Account/>} />
      </Routes>
    </div>
  </HashRouter>

}

export default App
