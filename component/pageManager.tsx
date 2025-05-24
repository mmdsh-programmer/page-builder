import React, { useEffect, useState } from "react";
import { Editor, Page } from "grapesjs";
import { PageInfo } from "@/interface/index";
interface Iprops {
  editor: Editor | null;
  open: boolean;
  onClose: () => void;
}

const PageManager = ({ editor, open, onClose }: Iprops) => {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Fetch pages from GrapesJS
  const refreshPages = () => {
    if (!editor) return;
    const allPages = editor.Pages.getAll() as Page[];
    setPages(
      allPages.map((p) => ({
        id: String(p.id),
        name: String(p.get("name") || p.id),
      }))
    );
    const sel = editor.Pages.getSelected();
    setSelectedId(sel ? String(sel.id) : null);
  };

  useEffect(() => {
    if (!editor) return;
    refreshPages();
    const onPage = () => refreshPages();
    editor.on("page", onPage);
    return () => {
      editor.off("page", onPage);
    };
    // eslint-disable-next-line
  }, [editor]);

  const handleSelect = (id: string) => {
    if (!editor) return;
    editor.Pages.select(id);
    setSelectedId(id);
  };

  const handleAdd = () => {
    if (!editor || !newPageName.trim()) return;
    editor.Pages.add({
      id: String(Date.now()),
      name: newPageName.trim(),
      component: "<div>New Page</div>",
      styles: "",
    });
    setNewPageName("");
    refreshPages();
  };

  const handleDelete = (id: string) => {
    if (!editor) return;
    if (window.confirm("Delete this page?")) {
      editor.Pages.remove(id);
      refreshPages();
    }
  };

  const handleRename = (id: string) => {
    setRenamingId(id);
    const page = pages.find((p) => p.id === id);
    setRenameValue(page?.name || "");
  };

  const handleRenameSubmit = (id: string) => {
    if (!editor) return;
    const page = editor.Pages.get(id);
    if (page && renameValue.trim()) {
      page.set("name", renameValue.trim());
      setRenamingId(null);
      setRenameValue("");
      refreshPages();
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 border-l border-gray-200 flex flex-col ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ minWidth: 320 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Pages</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {pages.map((page) => (
            <li
              key={page.id}
              className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer ${
                selectedId === page.id ? "bg-indigo-100" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(page.id)}
            >
              {renamingId === page.id ? (
                <input
                  className="border px-1 py-0.5 rounded text-sm w-32"
                  value={renameValue}
                  autoFocus
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSubmit(page.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(page.id);
                  }}
                />
              ) : (
                <span className="flex-1 truncate" title={page.name}>
                  {page.name}
                </span>
              )}
              <div className="flex items-center gap-1 ml-2">
                <button
                  className="text-xs text-gray-400 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename(page.id);
                  }}
                  title="Rename"
                >
                  ✎
                </button>
                <button
                  className="text-xs text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page.id);
                  }}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            className="border px-2 py-1 rounded flex-1"
            placeholder="New page name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageManager;
