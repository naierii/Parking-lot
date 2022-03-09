import Car from "./Car";

export type SectionType = "SP" | "MP" | "LP";

export default interface Section{
  type: SectionType;
  maxSlots: number;
  slots: (Car | undefined)[];
}