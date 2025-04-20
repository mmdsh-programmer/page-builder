"use client";

import React, { useEffect, useRef } from "react";

import axios from "axios";
import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjs from "grapesjs";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import swiperComponent from "@/plugins/swiper";

const Editor = () => {
  const editor = useRef<any>(null);
  useEffect(() => {
    if (editor.current) return;
    editor.current = grapesjs.init({
      container: "#gjs",
      fromElement: false,
      storageManager: false,
      plugins: [grapesjsBlocksBasic, gjsPresetWebpage, gjsForms, swiperComponent],
      pluginsOpts: {
        swiperComponent:{}
      },
      canvas: {
        styles:["http://localhost:3000/swiper-bundle.min.css", "http://localhost:3000/custom.css"],
        scripts: ["http://localhost:3000/swiper-bundle.min.js"],
      },
    });
  }, []);

  const getProjectData = async () => {
    try {
      const data = editor.current.getProjectData();
      await axios.post("/api", {
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loadProjectData = async () => {
    try {
      const result = await axios.get("/api");
      editor.current.loadProjectData(JSON.parse(result.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="GrapesjsApp h-screen w-screen">
      <div className="Editor h-full w-full">
        <div id="gjs" className="h-full w-full" />
      </div>
      <div className="Editor-toolbar absolute bottom-0 left-0 right-0 h-[45px] bg-white z-10">
        <button className="bg-red-400 px-5 mx-3" onClick={() => getProjectData()}>save data</button>
        <button className="bg-yellow-400 px-5 mx-3"  onClick={() => loadProjectData()}>load data</button>
      </div>
    </div>
  );
};

export default Editor;
