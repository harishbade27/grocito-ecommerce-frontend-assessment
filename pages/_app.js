import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import Layout from "../components/Layout";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          transition={Slide}
          pauseOnHover
          theme="light"
        />
      </Layout>
    </CartProvider>
  );
}
