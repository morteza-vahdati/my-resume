import localFont from "next/font/local";

const iransansfanum = localFont({
  src: [
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum).woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum).woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum)_UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum)_UltraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum)_Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum)_Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum)_Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum)_Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum)_Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum)_Bold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff2/IRANSansWeb(FaNum)_Black.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../app/fonts/iransansfanum/woff/IRANSansWeb(FaNum)_Black.woff",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-iransansFaNum",
});

export { iransansfanum };
