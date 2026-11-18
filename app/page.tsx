import Script from "next/script";
import { OS_MARKUP } from "./os-markup";
import { PROFILE } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <script id="profile" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE).replace(/</g, "\\u003c") }} />
      <div id="os-root" dangerouslySetInnerHTML={{ __html: OS_MARKUP }} />
      <Script src="/scenes.js" strategy="afterInteractive" />
      <Script src="/os.js" strategy="afterInteractive" />
      <Script src="/cursor.js" strategy="afterInteractive" />
    </>
  );
}
