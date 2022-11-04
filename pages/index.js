import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import CalculationCard from "../components/CalculationCard";

export default function Home({ session }) {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(session);

  useEffect(() => {
    if (session?.user) {
      if (loading) {
        return <div className={styles.loading}>Fetching Calculations...</div>;
      }
      fetchCalculations();
    }
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

  return (
    <div className={styles.container}>
      <Head>
        <title>BAAS Calculator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        {!session?.user ? (
          <div>
            <p>
              Welcome to My Calculator App. Kindly login or signup to use the
              app.
            </p>
          </div>
        ) : (
          <div>
            <p className={styles.calculationHeading}>
              Hello <span className={styles.email}>{session.user.email}</span>,
              Welcome to your dashboard
            </p>
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
                <CalculationCard data={calculations} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
