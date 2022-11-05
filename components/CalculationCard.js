import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/CalculationCard.module.css";
import { supabase } from "../utils/supabase";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns/";

const CalculationCard = ({ data, handleDelete }) => {
  return (
    <div className={styles.calulationContainer}>
      {data?.map((item) => (
        <div key={item.id} className={styles.container}>
          <p className={styles.expression}>
            {" "}
            Expression: {""}
            {item.expression}
          </p>
          <p className={styles.results}>Result:{item.result}</p>
          <p className={styles.time}>
            created:{" "}
            {formatDistanceToNow(new Date(item.inserted_at), {
              addSuffix: true,
            })}
          </p>

          <div className={styles.buttons}>
            <Link href={`/edit/${item.id}`}>
              <FiEdit className={styles.edit} />
            </Link>
            <button
              onClick={() => handleDelete(item.id)}
              className={styles.delete}
            >
              <BsTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalculationCard;
