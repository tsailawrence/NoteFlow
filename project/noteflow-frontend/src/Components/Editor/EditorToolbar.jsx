import React from "react";
import { Quill } from "react-quill";
import "./EditorToolbar.scss";
import ImageResize from "quill-image-resize-module-react";
import QuillCursors from "quill-cursors";

const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "Times-New-Roman",
  "lucida",
  "DFKai-sb",
];

const BlockEmbed = Quill.import("blots/block/embed");
const Link = Quill.import("formats/link");
class EmbedResponsive extends BlockEmbed {
  static className = "resources";
  static create(value) {
    const node = super.create(value);
    const child = document.createElement("iframe");
    child.setAttribute("frameborder", "0");
    child.setAttribute("allowfullscreen", true);
    child.setAttribute("src", this.sanitize(value));
    child.classList.add("embed-responsive-item");
    node.appendChild(child);
    return node;
  }

  static sanitize(url) {
    url = url.replace("watch?v=", "embed/");
    console.log(url);
    // TODO: url checker
    return Link.sanitize(url);
  }

  static value(domNode) {
    const iframe = domNode.querySelector("iframe");
    return iframe.getAttribute("src");
  }
}

EmbedResponsive.blotName = "video";
EmbedResponsive.tagName = "DIV";
Quill.register("formats/video", EmbedResponsive);
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/cursors", QuillCursors);
Quill.register(Size, true);
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
    handleStyles: {
      backgroundColor: "black",
      border: "none",
      borderRadius: "50%",
      color: "white",
      // other camelCase styles for size display
    },
  },
  cursors: true,
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "code-block",
  "formula",
];

let icons = Quill.import("ui/icons");
icons[
  "video"
] = `<svg width= "16px" viewBox="0 0 25 25" stroke="black" stroke-width="3%">
<path class= "ql-fill"  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17ZM17 10C13.134 10 10 13.134 10 17C10 20.866 13.134 24 17 24C20.866 24 24 20.866 24 17C24 13.134 20.866 10 17 10ZM16.5547 14.1679C16.2478 13.9634 15.8533 13.9443 15.5281 14.1183C15.203 14.2923 15 14.6312 15 15V19C15 19.3688 15.203 19.7077 15.5281 19.8817C15.8533 20.0557 16.2478 20.0366 16.5547 19.8321L19.5547 17.8321C19.8329 17.6466 20 17.3344 20 17C20 16.6656 19.8329 16.3534 19.5547 16.1679L16.5547 14.1679Z"/>
</svg>`;
// Quill Toolbar component

export const QuillToolbar = () => {
  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-font" defaultValue="arial">
          <option value="arial">Arial</option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="Times-New-Roman">Times New Roman</option>
          <option value="lucida">Lucida</option>
          <option value="DFKai-sb">標楷體</option>
        </select>
        <select className="ql-size" defaultValue="medium">
          <option value="extra-small">Size 1</option>
          <option value="small">Size 2</option>
          <option value="medium">Size 3</option>
          <option value="large">Size 4</option>
        </select>
        <select className="ql-header" defaultValue="3">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>

      <span className="ql-formats">
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-link" />
      </span>

      <span className="ql-formats">
        <button className="ql-clean" />
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
      </span>
    </div>
  );
};

export default QuillToolbar;
