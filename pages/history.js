import Link from "next/link";
import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CalculationCard from "../components/CalculationCard";
import styles from "../styles/Home.module.css";

const History = ({ session }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [calculations, setCalculations] = useState([]);

  useEffect(() => {
    session?.user && fetchCalculations();
    checkUserLoggedIn();
  }, []);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("inserted_at", { ascending: false });

      console.log(data);
      if (error && status !== 406) {
        throw error;
      }
      setCalculations(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function checkUserLoggedIn() {
    const user = supabase.auth.user();
    if (!user) {
      router.push("/login");
    }
    return true;
  }

  return (
    <div className={styles.container}>
      <div className={styles.home}>
        <div>
          <p className={styles.calculationHeading}></p>
          {calculations?.length === 0 ? (
            <div className={styles.noCalulation}>
              <p>You have no calculations yet</p>
              <Link href="/create">
                <button className={styles.button}> Calculate</button>
              </Link>
            </div>
          ) : (
            <div>
              <p className={styles.calculationHeading}>
                Here are your calculations
              </p>
              {session?.user && loading ? (
                <div className={styles.loading}>Fetching Calculations...</div>
              ) : (
                <CalculationCard data={calculations} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
