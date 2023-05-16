import tinycolor from "tinycolor2";

class QuillEvent {
  constructor() {
    this.ON = false;
    this.quill = null;
    this.editor = null;
  }
  TextChange = (delta, oldDelta, source) => {
    if (source !== "user") return; // ?
    this.editor.submitOp(delta);
  };
  SelectionChange = (range, oldRange, source) => {
    if (source !== "user") return;
    if (!range) return;
    range.name = this.user ? (this.user.name ? this.user.name : "-") : "-";
    this.localPresence.submit(range, (error) => {
      if (error) throw error;
    });
  };

  // editor
  Op = (op, source) => {
    if (source) return;
    this.quill.updateContents(op);
  };

  // presence
  // local presence
  Receive = (id, range) => {
    this.colors[id] = this.colors[id] || tinycolor.random().toHexString();
    const name = (range && range.name) || "Anonymous";
    this.cursors.createCursor(id, name, colors[id]);
    this.cursors.moveCursor(id, range);
  };

  on = (quill, editor, presence, user) => {
    console.log("on");
    this.quill = quill;
    this.editor = editor;
    this.presence = presence;
    this.localPresence = presence.create(user.email);
    this.cursors = quill.getModule("cursors");
    this.user = user;
    this.colors = {};

    this.quill.on("text-change", this.TextChange);
    this.quill.on("selection-change", this.SelectionChange);
    this.editor.on("op", this.Op);
    this.presence.on("receive", this.Receive);
    this.ON = true;
  };

  off = () => {
    this.quill.off("text-change", this.TextChange);
    this.quill.off("selection-change", this.SelectionChange);
    this.editor.off("op", this.Op);
    this.presence.off("receive", this.Receive);
    this.ON = false;
  };

  offon = (quill, editor, presence, user) => {
    if (this.ON) {
      this.off();
    }
    this.on(quill, editor, presence, user);
  };
}

const quillEvent = new QuillEvent();

export default quillEvent;