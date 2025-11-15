import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
