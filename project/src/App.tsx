import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';

function App() {
  return (
    <main className="bg-black">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
    </main>
  );
}

export default App;