import { useMemo } from "react";
import { FaHeadset } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { CgGym } from "react-icons/cg";
import { GrYoga } from "react-icons/gr";
import { TbYoga, TbKarate } from "react-icons/tb";
import { IoFitnessOutline } from "react-icons/io5";
import defaultAvatar from "../assets/img/logoAvatar.png";

const useAvatar = (divisionName = "") => {
  switch (divisionName) {
    case "Ufficio segreteria":
      return {
        src: defaultAvatar,
        name: "Ufficio Segreteria",
      };
    case "Inserviente":
      return {
        icon: <GrUserWorker />,
        name: "Inserviente",
      };
    case "Istruttore palestra":
      return {
        icon: <CgGym />,
        name: "Istruttore Palestra",
      };
    case "Istruttrice di zumba":
      return {
        icon: <TbYoga />,
        name: "Istruttrice di Zumba",
      };
    case "Istruttrice di danza":
      return {
        icon: <GrYoga />,
        name: "Istruttrice di Danza",
      };
    case "Istruttore di Karate":
      return {
        icon: <TbKarate />,
        name: "Istruttore di Karate",
      };
    case "Assistente psicologo":
      return {
        icon: <IoFitnessOutline />,
        name: "Assistente Psicologo",
      };
    case "Centralinista":
      return {
        icon: <FaHeadset />,
        name: "Centralinista",
      };
    default:
      return {
        src: defaultAvatar,
        name: "Assistente",
      };
  }
};

export default useAvatar;
