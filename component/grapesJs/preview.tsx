import ClientScripts from "../clientScripts";
import { JSDOM } from "jsdom";
import React from "react";
import axios from "axios";
import fs from "fs";
import grapesjs from "grapesjs";

const Preview = async () => {
  const editor = grapesjs.init({ headless: true });
  editor.DomComponents.addType("gjs-swiper", {});

  const data = fs.readFileSync(process.cwd() + "/database.text", "utf8");
  editor.loadProjectData({ ...JSON.parse(data) });

  const html = editor.getHtml();
  const css = editor.getCss();
  const sanitizeHtml = html
    .replace(`<body`, "<div")
    .replace(`</body>`, "</div>");

  const fullHtml = `
    <style>${css}</style>
    ${sanitizeHtml}
  `;

  const dom = new JSDOM(`${fullHtml}`);

  const elements = dom.window.document.getElementsByClassName("custom-block");

  for (const el of elements) {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/5"
    );
    el.innerHTML = `<div class="placeholder" style="display:flex;flex-direction:column;">
              <span>userId: ${response.data.userId}</span>
              <span>title: ${response.data.title}</span>
              <span>timestamp ${+new Date()}</span>
            </div>`;
  }

  const pageHtml = dom.serialize();
  dom.window.close();
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <div
        className="main-wrapper mx-auto"
        dangerouslySetInnerHTML={{ __html: pageHtml }}
      />
      <ClientScripts />
    </div>
  );
};

export default Preview;
