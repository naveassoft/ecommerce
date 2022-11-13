import "../styles/globals.css";
import "../styles/dashboard.css";
import Alert from "../components/global/Alert";
import StoreProvider from "../components/context/StoreProvider";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
      <Alert />
    </StoreProvider>
  );
}

export default MyApp;
