import Car from "./Car";

export default interface CheckedoutCar extends Car{
  timeCheckout: number;
}