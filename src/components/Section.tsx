import Car, { CarSize } from "models/interfaces/Car"
import CheckedoutCar from "models/interfaces/CheckedoutCar"
import SectionInterface from "models/interfaces/Section"
import { useState } from "react"
import sectionsData from "../models/test-data/SectionsData"
import styles from "./Section.module.scss"

interface Props{
  sectionData: SectionInterface;
  timer: number;
}

let MAX_FREE_HOURS = 3;

export default function Section({sectionData, timer}: Props){
  const {type, maxSlots, slots} = sectionData

  // creates an array with undefined values
  const fillers = Array(maxSlots).fill(undefined)

  // decrease filler's length in a way that I can combine it with slots with a length of maxSlots
  fillers.length = maxSlots - slots.length
  const [filledSlots, setFilledSlots] = useState<(Car|undefined)[]>([...slots, ...fillers])
  const [checkedoutSection, setCheckedoutSection] = useState<CheckedoutCar[]>([])

  function calculateTotalBill(totalTime: number){
    let hourlyPrice;
    
    switch (type.toUpperCase()) {
      case "SP":
        hourlyPrice = 20
        break;
    
      case "MP":
        hourlyPrice = 60
        break;
    
      case "LP":
        hourlyPrice = 100
        break;
    
      default:
        break;
    }
    const hoursToBePaid = Math.round(totalTime/60) - MAX_FREE_HOURS

    if(!hourlyPrice) throw new Error("Incorrect car size!")
    const totalPrice = 
      40 + 
      (
        hoursToBePaid < 0 ? 0 : hoursToBePaid
        * hourlyPrice
      )
    return totalPrice
  }

  function removeCarHandler(posId: number){
    const filledSlot = filledSlots[posId]
    if(!filledSlot) return;
    const {timeStart, size} = filledSlot
    const totalTime = (timeStart - timer) * -1

    if(window.confirm(`Wanna exit the Parking Lot?\nTotal Time: ${Math.floor(totalTime/60)} hours, ${totalTime%60} minutes \nBill: ${calculateTotalBill(totalTime)} PHP`)){
      setFilledSlots(cur => {
        const checkedoutCar = cur[posId]
        if(!checkedoutCar) return cur
        cur[posId] = undefined

        setCheckedoutSection((curCheckedoutSection:any) => {
          const newCheckedout:CheckedoutCar = {...checkedoutCar, ...{timeCheckout: timer}}
          return [...curCheckedoutSection, newCheckedout]
        })
        return [...cur]
      })
      alert("You've exited the premise. You're free to come back within 1 hour and choose to get charged continously.")
    }else{

    }
  }

  function addCarHandler(size:string){
    // check if there is an available slot
    const availableSlotsCount = filledSlots.filter(slot => slot === undefined).length
    if(!availableSlotsCount){
      alert("This Parking Section is full, please check the other sections")
      return
    }

    switch (size.toUpperCase()) {
      case "S":
        setFilledSlots(cur => {
          cur[cur.indexOf(undefined)] = {
            size: "S",
            timeStart: timer,
          }
          return [...cur]
        })
        break;
      case "M":
        if(type === "SP"){
          alert("Your vehicle is too large for this Parking Lot!")
          return
        }
        setFilledSlots(cur => {
          cur[cur.indexOf(undefined)] = {
            size: "M",
            timeStart: timer,
          }
          return [...cur]
        })
        break;
      case "L":
        if(type === "SP" || type === "MP"){
          alert("Your vehicle is too large!")
          return
        }
        setFilledSlots(cur => {
          cur[cur.indexOf(undefined)] = {
            size: "L",
            timeStart: timer,
          }
          return [...cur]
        })
        break;
    
      default:
        break;
    }
  }

  function reParkHandler(posId:number, car: CheckedoutCar){

    const availableSlotsCount = filledSlots.filter(slot => slot === undefined).length
    const reParkTimeLeft = 60 - ((car.timeCheckout - timer) * -1)

    const totalBill = calculateTotalBill((car.timeStart - car.timeCheckout) * -1)
    if(!availableSlotsCount){
      alert("This Parking Section is full, please check the other sections")
      return
    }
    if(reParkTimeLeft <= 0){
      alert(`You've exceeded the time limit to return, you are charged: ${totalBill}`)
      return
    }
    if(window.confirm(`Re park? \nYou still have ${reParkTimeLeft} minutes to re-park and continue your last charge.\n[OK] for park again\n[Cancel] to leave \n\n Total Bill: ${totalBill}`)){
      setCheckedoutSection(cur => {
        const goBackCar = cur.splice(posId, 1)[0]
  
        setFilledSlots(filledSlotsCur => {
          filledSlotsCur[filledSlotsCur.indexOf(undefined)] = goBackCar
          return [...filledSlotsCur]
        })
  
        return [...cur]
      })
    }else{
      setCheckedoutSection(cur => {
        cur.splice(posId, 1)
        alert(`You left, you are charged: ${totalBill}`)
        return [...cur]
      })
    }
  }

  function slotStyle(size:CarSize){
    switch (size.toUpperCase()) {
      case "S":
        return styles.car_s
      case "M":
        return styles.car_m
      case "L":
        return styles.car_l
      default:
        throw new Error("Invalid car type!!!")
    }
  }
  function checkedoutCarStyle(size:string){
    switch (size.toUpperCase()) {
      case "S":
        return styles.checkedoutCar_s
      case "M":
        return styles.checkedoutCar_m
      case "L":
        return styles.checkedoutCar_l
      default:
        throw new Error("Invalid car type!!!")
    }
  }
  return <>
    <div className={styles.body}>
      <div className={styles.parkingSections}>
        <section className={styles.parkingSection}>
          <span className={styles.entrance}>Entrance</span>
          {/* <span className={styles.exit}>Exit</span> */}
          <div className={styles.addCars}>
            <span>Add Car<br/>({type})</span>
            <button onClick={()=>{addCarHandler("S")}}>S</button>
            <button onClick={()=>{addCarHandler("M")}}>M</button>
            <button onClick={()=>{addCarHandler("L")}}>L</button>
          </div>
          <div className={styles.parkingSpaces}>
            {filledSlots.map((slot, index) => {
              return <div className={styles.parkingSpace} key={index}>
                <div onClick={()=>{removeCarHandler(index)}} className={`${slot ? slotStyle(slot.size) : ''}`}>
                  <span className={styles.fee}>{slot ? ((slot.timeStart - timer) * -1) : ''}</span>
                </div>
              </div>
            })}
          </div>
        </section>
      </div>
      <div className={styles.checkedoutSection}>
        {checkedoutSection.map((car, index)=>{
          
          return <div onClick={()=>reParkHandler(index, car)} className={checkedoutCarStyle(car.size)} key={index}>{(car.timeStart - timer) * -1}</div>
        })}
      </div>
    </div>
  </>
}