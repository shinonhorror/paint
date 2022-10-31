/* Класс, который запоминает состояние инструмента */
import { makeAutoObservable } from "mobx";

class ToolState {
  tool = null;
  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool) {
    this.tool = tool;
  }

  setFillColor(color) {
    this.tool.fillColor = color;
  }
  setStrokeColor(color) {
    this.tool.strokeColor = color;
  }
  setLineWidth(width) {
    this.tool.lineWidth = width;
  }
  getLineWidth() {
    return this.tool.lineWidth;
  }
  getStrokeColor() {
    return this.tool.strokeColor;
  }
}

export default new ToolState();
