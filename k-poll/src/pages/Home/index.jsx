import React, { useState,createContext } from "react";
import Top from "./components/Top";
import Left from "./components/Left";
import Screen from "./components/Screen";
import Right from "./components/Right";
import Footer from "./components/Footer";
import "./index.css";
import { LayoutContext } from "./LayoutContext";
const Home = () => {
  const [showNote, setShowNote] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showSubjectCards, setShowSubjectCards] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [subscribeList, setSubscribeList] = useState([]);
  const [activefunctionbutton, setActivefunctionbutton] = useState(null);
  return (
    <div className="home">
      <LayoutContext.Provider value={{
        activefunctionbutton, setActivefunctionbutton,
        subscribe, setSubscribe,
        subscribeList, setSubscribeList,
        showNote, setShowNote,
        showCodeEditor,setShowCodeEditor,
        showSubjectCards,setShowSubjectCards
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
