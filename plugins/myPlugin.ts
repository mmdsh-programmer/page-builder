import { Editor } from "grapesjs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Update the UI based on the fetched data
const updateUI = (data: any, editor: any, id: string) => {
  const block = editor.getWrapper().find(`.${id}`)[0];
  if (block) {
    block.components(`<div class="placeholder" style="display:flex;flex-direction:column;">
              <span>userId: ${data.userId}</span>
              <span>title: ${data.title}</span>
              <span>timestamp ${+new Date()}</span>
            </div>`);
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

export const myPlugin = (editor: Editor) => {
  editor.BlockManager.add("custom-block", {
    label: "Custom Block",
    media: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></svg>', // Add your custom SVG icon here
    content: () => {
      const uuid = uuidv4(); // Generate a unique ID for each block
      fetchData(editor, uuid);
      return {
        type: "customBlock",
        tagName: "custom-block",
        components: `<div class="custom-block ${uuid}">Loading data...</div>`
      }; // Add the unique ID to the block's class
    },
    category: "Basic",
  });
};