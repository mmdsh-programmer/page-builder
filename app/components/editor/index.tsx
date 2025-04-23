"use client";

import React from "react";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";

const Editor = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <style>{`body { margin: 0 }`}</style>
      <StudioEditor
        style={{ flexGrow: 1 }}
        options={{
          gjsOptions: { storageManager: false },
          licenseKey: ":)",
          project: {
            type: "web",
            default: {
              pages: [
                { name: "Home", component: "<h1>Home page</h1>" },
                { name: "About", component: "<h1>About page</h1>" },
                { name: "Contact", component: "<h1>Contact page</h1>" },
              ],
            },
          },
        }}
      />
    </div>
  );
};

export default Editor;
