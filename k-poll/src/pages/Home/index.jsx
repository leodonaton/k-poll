import React, { useState,createContext } from "react";
import Top from "./components/Top";
import Left from "./components/Left";
import Screen from "./components/Screen";
import Right from "./components/Right";
import Footer from "./components/Footer";
import "./index.css";
import { LayoutContext } from "./LayoutContext";
const Home = () => {
  const [showNote, setShowNote] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(null);
  const [showSubjectCards, setShowSubjectCards] = useState(null);
  const [subscribe, setSubscribe] = useState(false);
  const [subscribeList, setSubscribeList] = useState([]);
  const [activefunctionbutton, setActivefunctionbutton] = useState(null);
  const [selectedright, setSelectedright] = useState(null);
  const [notedragging, setNotedragging] = useState(false);
  const [continueactive, setContinueactive] = useState(false);
  return (
    <div className="home">
      <LayoutContext.Provider value={{
        activefunctionbutton, setActivefunctionbutton,
        subscribe, setSubscribe,
        subscribeList, setSubscribeList,
        showNote, setShowNote,
        showCodeEditor,setShowCodeEditor,
        showSubjectCards,setShowSubjectCards,
        selectedright, setSelectedright,
        notedragging, setNotedragging,
        continueactive, setContinueactive
      }}>

        
      <Top />
      <Left />
      <Screen />
      <Right />
      <Footer />


      </LayoutContext.Provider>
    </div>
  );
};

export default Home;
