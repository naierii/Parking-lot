import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import sectionsData from './models/test-data/SectionsData';
import Section from './components/Section';

import { useReducer } from 'react';

function App() {
  const [sectionsDataState, setSectionsDataState] = useState(sectionsData)

  const [timer, setTimer] = useState(60)

  useEffect(()=>{
    setInterval(()=>{
      setTimer(cur => cur+1)
    },1000)
  },[])

  // increases the "sections" of parking lot
  function buyLotHandler(type:"SP" | "MP" | "LP"){
    switch (type.toUpperCase()) {
      case "SP":
        setSectionsDataState(cur => {
          cur[cur.length] = {
            type: "SP",
            maxSlots: 16,
            slots:[]
          }
          return [...cur]
        })
        break;
    
      case "MP":
        setSectionsDataState(cur => {
          cur[cur.length] = {
            type: "MP",
            maxSlots: 12,
            slots:[]
          }
          return [...cur]
        })
        break;
    
      case "LP":
        setSectionsDataState(cur => {
          cur[cur.length] = {
            type: "LP",
            maxSlots: 8,
            slots:[]
          }
          return [...cur]
        })
        break;
    
      default:
        break;
    }
  }

  return (
    <div id={styles.body}>
      <section id={styles.visualSection}>
        {sectionsDataState.map((sectionData, index) => {
          return <Section sectionData={sectionData} timer={timer} key={index}/>
        })}
        <span id={styles.buyLot}>
          <h1>Buy P.Lot?</h1>
          <button onClick={()=>buyLotHandler("SP")}>SP</button>
          <button onClick={()=>buyLotHandler("MP")}>MP</button>
          <button onClick={()=>buyLotHandler("LP")}>LP</button>
        </span>
      </section>
      <span id={styles.timer}>
        <div>Minutes Passed: {timer}</div>
        <button onClick={()=>setTimer(cur => cur + 25)}>Add 25 mins</button>
        <button onClick={()=>setTimer(cur => cur + 60)}>Add 1 hour</button>
      </span>
    </div>
  );
}

export default App;
