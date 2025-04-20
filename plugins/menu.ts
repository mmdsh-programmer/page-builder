import { Editor } from "grapesjs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Update the UI based on the fetched data
const updateUI = (data: any, editor: any, id: string) => {
  const block = editor.getWrapper().find(`.${id}`)[0];
  if (block) {
    block.components(`
      <nav class="grapesjs-menu">
        <ul class="drop-down closed">
          <li><a href="#" class="nav-button">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Library</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <style>
        nav .drop-down {
          list-style: none; 
          overflow: hidden; /* When ul height is reduced, ensure overflowing li are not shown */
          height: 172px; /* 172px = (38 (li) + 5 (li border)) * 4 (number of li) */
          background-color: #34495e;
          font-family: Arial;
          width: 200px;
          margin: 0 auto;
          padding: 0;
          text-align: center;
          -webkit-transition: height 0.3s ease;
                  transition: height 0.3s ease;
        }

        nav .drop-down.closed {
          /*  When toggled via jQuery this class will reduce the height of the ul which inconjuction
              with overflow: hidden set on the ul will hide all list items apart from the first */
          /* current li height 38px + 5px border */
          height: 43px;
        }

        nav .drop-down li {
          border-bottom: 5px solid #2c3e50;
        }

        nav .drop-down li a {
          display: block;
          color: #ecf0f1;
          text-decoration: none;
          padding: 10px; /* Larger touch target area */
        }

        nav .drop-down li:first-child a:after {
          content: "\\25BC";
          float: right;
          margin-left: -30px; /* Excessive -margin to bring link text back to center */
          margin-right: 5px;
        }
      </style>
    `);
  }
};

export const fetchData = async (editor: any, id: string) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    updateUI(response.data, editor, id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const menuPlugin = (editor: Editor) => {
  editor.BlockManager.add("grapesjs-menu", {
    label: "Menu",
    media: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" viewBox="0 0 490 490" xml:space="preserve"><g><path d="M109.773,105.325H7.712V0h102.061V105.325z M28.346,84.691h60.793V20.634H28.346V84.691z"/><rect x="165.277" y="38.522" width="317.011" height="20.634"/><path d="M109.773,297.662H7.712V192.333h102.061V297.662z M28.346,277.028h60.793v-64.061H28.346V277.028z"/><rect x="165.277" y="230.859" width="317.011" height="20.634"/><path d="M109.773,490H7.712V384.67h102.061V490z M28.346,469.366h60.793v-64.063H28.346V469.366z"/><rect x="165.277" y="423.197" width="317.011" height="20.634"/></g></svg>`, // Add your custom SVG icon here
    content: () => {
      const uuid = uuidv4(); // Generate a unique ID for each block
      fetchData(editor, uuid);
      return {
        type: "grapesjs-menu",
        tagName: "grapesjs-menu",
        components: `<div class="grapesjs-menu ${uuid}">Loading data...</div>`,
      };  
    },
    category: "Basic",
  });
};
