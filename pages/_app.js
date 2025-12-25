import { Provider } from "react-redux";
import { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store";
import "../styles/globals.css";
import Head from "next/head";
function MyApp({ Component, pageProps, auth }) {
  // Globally suppress Google Translate banner/balloon and body offset
  useEffect(() => {
    const hideTranslateArtifacts = () => {
      try {
        const banner = document.querySelector(".goog-te-banner-frame");
        if (banner) banner.style.display = "none";
        const banner2 = document.querySelector("iframe.goog-te-banner-frame");
        if (banner2) banner2.style.display = "none";
        const balloon = document.querySelector("#goog-gt-tt");
        if (balloon) balloon.style.display = "none";
        const balloonFrame = document.querySelector(".goog-te-balloon-frame");
        if (balloonFrame) balloonFrame.style.display = "none";
        document.body.style.top = "0px";
      } catch {}
    };

    hideTranslateArtifacts();
    const observer = new MutationObserver(() => hideTranslateArtifacts());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    window.addEventListener("hashchange", hideTranslateArtifacts);
    window.addEventListener("resize", hideTranslateArtifacts);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", hideTranslateArtifacts);
      window.removeEventListener("resize", hideTranslateArtifacts);
    };
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <title>Agri Connect</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Agri_Connect is a platform for farmers to connect with each other and share their knowledge and experience"
        />
        <link
          rel="apple-touch-icon"
          href="/Images/Logo/Agriconnect_logo.png"
        ></link>
        <meta name="theme-color" content="#fff" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="icons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="icons/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="icons/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="icons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="icons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="icons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="icons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="icons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="icons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="icons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="icons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </Head>
      <PersistGate persistor={persistor} loading={null}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
