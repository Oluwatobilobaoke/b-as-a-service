import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";
import styles from "../styles/Create.module.css";
import { useRouter } from "next/router";

const Create = () => {
  const initialState = {
    expression: "",
    result: "",
  };

  const router = useRouter();

  const [loggedIn, setloggedIn] = useState(null);

  const [calculationData, setCalculationData] = useState(initialState);

  const { expression, result } = calculationData;

  const handleChange = (e) => {
    setCalculationData({ ...calculationData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  async function checkUserLoggedIn() {
    const user = supabase.auth.user();
    if (!user) {
      router.push("/login");
    }
  }

  const createCalculation = async () => {
    try {
      const user = supabase.auth.user();

      const { data, error } = await supabase
        .from("calculations")
        .insert([
          {
            expression,
            result,
            user_id: user?.id,
          },
        ])
        .single();
      if (error) throw error;
      alert("Calculation created successfully");
      setCalculationData(initialState);
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <p className={styles.expression}>Create a New Calculation</p>
          <label className={styles.label}>Expression:</label>
          <input
            type="text"
            name="expression"
            value={expression}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your expression"
          />

          <button className={styles.button} onClick={createCalculation}>
            Calculate
          </button>
        </div>
      </div>
    </>
  );
};

export default Create;
