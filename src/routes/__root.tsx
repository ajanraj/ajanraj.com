import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import WaveShader from "@/components/wave-shader";

import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";

import appCss from "@/styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found</p>
    </main>
  ),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ajan Raj" },
      {
        name: "description",
        content: "Student and developer, building stuff that teaches me something new",
      },
      { name: "author", content: "Ajan Raj" },
      { property: "og:site_name", content: "Ajan Raj" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ajan Raj" },
      {
        property: "og:description",
        content: "Student and developer, building stuff that teaches me something new",
      },
      { property: "og:url", content: "https://ajanraj.com" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Ajan Raj" },
      {
        name: "twitter:description",
        content: "Student and developer, building stuff that teaches me something new",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&family=Lora:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      },
    ],
    scripts: [
      {
        src: "https://umami.ajanraj.com/script.js",
        "data-website-id": "44b7a203-2f5e-4e57-abba-1988d082ddfd",
        defer: true,
      },
    ],
  }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <WaveShader fadeTop={false} className="h-[150px] md:h-[150px]" />
        <div className="mx-auto w-full max-w-screen-md flex-1 px-4 md:px-10">
          <Nav />
          <Outlet />
          <Footer />
        </div>
        <WaveShader fadeTop={true} className="h-[300px] md:h-[450px]" />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
