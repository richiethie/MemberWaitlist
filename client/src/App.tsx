import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import MemberWaitlist from './pages/MemberWaitlist';

function App() {

  return (
<div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MemberWaitlist />} />

          </Routes>
        </main>
      </div>
  )
}

export default App
