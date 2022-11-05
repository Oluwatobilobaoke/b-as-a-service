import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { supabase } from "../utils/supabase";
import { rootEndPoint } from "../utils/endpoints";
import { useRouter } from "next/router";

import axios from "axios";
import { NotificationManager } from "react-notifications";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [session, setSession] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    const currentSession = supabase.auth.session();
    if (!currentSession) {
      router.push("/login");
    }
    localStorage.setItem("user", JSON.stringify(currentSession?.user));
    localStorage.setItem(
      "baas_token",
      JSON.stringify(currentSession.access_token)
    );
    axios.defaults.baseURL = rootEndPoint;
    axios.defaults.headers = {
      authorization: `Bearer ${localStorage.getItem("baas_token")}`,
      "content-type": "application/json",
    };
    axios.interceptors.response.use(
      (res) => Promise.resolve(res),
      (err) => {
        if (!err.response) {
          NotificationManager.error("Check your network connection");
        }

        console.log({err});

        if (err.response.statusCode === 401 && router.pathname !== "/login") {
          setTimeout(() => {
            router.replace("/login");
            typeof window != "undefined" && localStorage.clear();
          }, 0);
        }
        return Promise.reject(err);
      }
    );
    if (!localStorage.getItem("baas_token")) {
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
