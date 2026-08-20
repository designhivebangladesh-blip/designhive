import dynamic from "next/dynamic";
import Head from "next/head";
import type { NextPage } from "next";
import config from "@/sanity.config";

// Sanity Studio is mounted through the Pages Router (not the App
// Router) deliberately: App Router's directive-scanning ("use client")
// pass resolves every reachable module — including this one — through
// React's restricted "react-server" build while walking the module
// graph, and that build doesn't include newer React APIs Studio's
// bundle now uses (e.g. useEffectEvent), which fails the build even
// though this code only ever runs on the client. The Pages Router has
// no such pass, so this sidesteps the conflict entirely while staying
// on Next.js 15. NextStudio is still loaded with ssr disabled since
// it's a browser-only single-page app that manages its own history.
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

const StudioPage: NextPage = () => (
  <>
    <Head>
      <title>Designhive Studio</title>
      <meta name="robots" content="noindex" />
    </Head>
    <NextStudio config={config} />
  </>
);

export default StudioPage;
