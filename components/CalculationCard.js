import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/CalculationCard.module.css";
import { supabase } from "../utils/supabase";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns/";
import axios from "axios";
import { Modal } from "./Modal";

const CalculationCard = ({ data, fetchCalculations }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedCardDetails, setExpandedCardDetails] = useState(null);
  const [expandedId, setExpandedId] = useState("");
  const collapseCard = () => {
    setIsCardExpanded(false);
    setExpandedCardDetails(null);
  };
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(`/calculation/${id}`);
      alert("Deleted calculation");
    } catch (err) {
      console.log("err.response");
    } finally {
      fetchCalculations(true);
      collapseCard();
    }
  };

  const fetchSingleCalculation = async (id) => {
    const response = await axios.get(`/calculation/${id}`);
    const { expression, result, inserted_at } = response;
    setExpandedCardDetails((prev) => ({
      id: "expanded",
      expression,
      result,
      inserted_at,
    }));
  };

  const expandCard = (id, index) => {
    fetchSingleCalculation(id);
    setIsCardExpanded(true);
    setExpandedId(index);
  };

  return (
    <div className={styles.calulationContainer}>
      {data?.map((item, index) => (
        <Card
          item={item}
          key={item.id}
          onClick={() => {
            expandCard(item.id, index);
          }}
          handleDelete={handleDelete}
        />
      ))}
      <Modal
        component={<Card item={data[expandedId]} handleDelete={handleDelete} />}
        isOpen={isCardExpanded}
        close={collapseCard}
      />
    </div>
  );
};

export default CalculationCard;

const Card = ({ item, onClick, handleDelete }) => {
  return item ? (
    <div
      key={item.id}
      className={styles.container}
      onClick={onClick && onClick}
    >
      <div className={styles.expression}>
        <p>{item.expression}</p>
        <p>= {item.result}</p>
      </div>

      <div className={styles.buttons}>
        <p className={styles.time}>
          Created{" "}
          {formatDistanceToNow(new Date(item?.inserted_at), {
            addSuffix: true,
          })}
        </p>
        <button
          onClick={(e) => handleDelete(item.id, e)}
          className={styles.delete}
        >
          <BsTrash />
        </button>
      </div>
    </div>
  ) : null;
};
