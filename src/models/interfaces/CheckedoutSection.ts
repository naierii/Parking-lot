import Car from "./Car";
import { SectionType } from "./Section";

export default interface CheckedoutSection{
  type: SectionType;
  slots: Car[];
}