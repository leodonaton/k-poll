import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const rotateAngle = isOpen ? 180 : 0;
  const contentOpacity = isOpen ? 1 : 0;

  return (
    <>
      <div className="container">
        {!isOpen ? <button className="wax-seal" onClick={handleClick}>
          打开
        </button> : null}
        <svg className="envelope" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            className="envelope-flap"
            points="0,0 100,0 50,50"
            fill="#E0BC6F"
            style={{ transform: `rotateX(-${rotateAngle}deg)` }}
          />
        </svg>
        <div className="content" style={{ opacity: contentOpacity ,transition: 'opacity 1s ease-in-out' }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;