import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";


function MyApp({ Component, pageProps }) {
  // custom hook in hooks.ts file

  const { user, username } = useUserData();

  return (
    <>
      <UserContext.Provider value={{ user: user, username: username }}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
