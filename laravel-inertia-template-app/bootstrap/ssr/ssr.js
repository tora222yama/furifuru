import * as React from "react";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
const Test = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "this is default pages."), /* @__PURE__ */ React.createElement("div", null, "first-record"), /* @__PURE__ */ React.createElement("div", null, "second-record"));
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Test,
  default: Test
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Test.tsx": __vite_glob_0_0 });
      return pages[`./Pages/${name}.tsx`];
    },
    setup: ({ App, props }) => /* @__PURE__ */ React.createElement(App, { ...props })
  })
);
