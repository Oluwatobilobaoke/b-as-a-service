import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";
import styles from "../styles/Create.module.css";
import { useRouter } from "next/router";
import axios from "axios";

const Create = () => {
  const initialState = {
    expression: "",
    result: "",
  };

  const router = useRouter();
  const [loggedIn, setloggedIn] = useState(null);
  const [calculationData, setCalculationData] = useState(initialState);
  const { expression, result } = calculationData;
  const [calculationResult, setCalculationResult] = useState("");
  const [calculatedExpression, setCalculatedExpression] = useState("");
  const [calculating, setCalculating] = useState(false);

  const handleChange = (e) => {
    setCalculationData({ ...calculationData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  async function checkUserLoggedIn() {
    const user = supabase.auth.user();
    // console.log("user", user);
    if (!user) {
      router.push("/login");
    }
  }

  const createCalculation = async () => {
    if (!expression) {
      alert("Please enter an expression");
      return;
    }
    try {
      const user = supabase.auth.user();
      setCalculating(true);

      // const { data, error } = await supabase
      //   .from("calculations")
      //   .insert([
      //     {
      //       expression,
      //       result,
      //       user_id: user?.id,
      //       user_id: user?.email,
      //     },
      //   ])
      //   .single();

      const response = await axios.post("/calculation", {
        expression,
        user_id: user?.id,
      });

      // if (error) throw error;
      // alert("Calculation created successfully");
      setCalculatedExpression(expression);
      setCalculationData(initialState);
      setCalculationResult(response.data);

      // router.push("/");
    } catch (error) {
      alert(error?.response?.message || "An error occured");
      // console.log("err.response", error.response);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <p className={styles.expression}>Create a New Calculation</p>
          <label className={styles.label}>Enter expression (e.g. 3 * 5):</label>
          <input
            type="text"
            name="expression"
            value={expression}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your expression"
          />

          <button
            className={styles.button}
            disabled={calculating}
            onClick={createCalculation}
          >
            {calculating ? "Calculating" : "Calculate"}
          </button>
        </div>

        {calculationResult && (
          <div className={styles.answer}>
            {/* <p className={styles.expression}>Answer</p> */}
            <label className={styles.label2}>Answer:</label>
            <input
              type="text"
              name="expression"
              value={`${calculatedExpression} = ${calculationResult}`}
              onChange={handleChange}
              className={styles.input2}
              // placeholder="Enter your expression"
              disabled={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Create;
