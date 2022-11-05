import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { supabase } from "../utils/supabase";
import { rootEndPoint } from "../utils/endpoints";
import axios from "axios";

function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    axios.defaults.baseURL = rootEndPoint;
    axios.defaults.headers = {
      authorization: `Bearer ${localStorage.getItem("supabase.auth.token")}`,
      "content-type": "application/json",
    };
    axios.interceptors.response.use(
      (res) => Promise.resolve(res),
      (err) => {
        if (!err.response) {
          NotificationManager.error("Check your network connection");
        }

        if (err.response.status === 401 && router.pathname !== "/login") {
          setTimeout(() => {
            router.replace("/login");
            typeof window != "undefined" && localStorage.clear();
          }, 0);
        }
        return Promise.reject(err);
      }
    );
    if (
      !localStorage.getItem("supabase.auth.token")
    ) {
      setSession(false);
    } else {
      setSession(session);
    }
  }, []);
  return (
    <div>
      <Navbar session={session} />
      <Component {...pageProps} session={session} />
      <Footer />
    </div>
  );
}
export default MyApp;
