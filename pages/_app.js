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
  const [token, setToken] = useState("");

  const [session, setSession] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("baas_token");
    console.log("token", token);
    setToken(token);

    if (token && token !== "undefined") {
      console.log("ndncncncn", typeof token);
      axios.defaults.baseURL = rootEndPoint;
      axios.defaults.headers = {
        authorization: `Bearer ${JSON?.parse(token)}`,
        "content-type": "application/json",
      };
    }
    // console.log("routetrrr", router);

    const currentSession = supabase.auth.session();

    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    setSession(currentSession);
    const currentUser = supabase.auth.user();
    if (!currentSession && router.asPath !== "/") {
      router.push("/login");
    }
    localStorage.setItem("user", JSON?.stringify(currentSession?.user));
    localStorage.setItem(
      "baas_token",
      JSON.stringify(currentSession?.access_token)
    );

    // console.log(
    //   "local storajdjdjge",
    //   JSON.parse(localStorage.getItem("baas_token"))
    // );
    axios.interceptors.response.use(
      (res) => Promise.resolve(res),
      (err) => {
        if (!err.response) {
          NotificationManager.error("Check your network connection");
        }

        console.log({ err });

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
      <Navbar />
      {/* {console.log("the session is", session)} */}
      <Component {...pageProps} session={session} />
      <Footer />
    </div>
  );
}
export default MyApp;
