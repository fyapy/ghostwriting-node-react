import React, { Component } from "react";
import isEmpty from "./../../validation/is-empty";

class Preview extends Component {
  previewHandle = e => {
    e.preventDefault();
    this.props.getDialog(this.props.target.id);
  };

  componentDidMount() {
    if (isEmpty(this.props.target)) {
      this.props.findTarget();
    }
  }

  render() {
    const target = this.props.target;
    const message = this.props.message;

    return (
      <a href="/" className="preview" onClick={this.previewHandle}>
        <div className="preview-avatar">
          <img
            src={`/img/${target ? target.avatar : "04.png"}`}
            alt={target ? target.username : "Имя"}
          />
        </div>
        <div className="preview-data">
          <div className="preview-name">{target ? target.username : "Имя"}</div>
          <div className="preview-text">
            {target && message.fromId !== target.id ? "Вы: " : ""}
            {message.text.length > 34
              ? message.text
                  .replace(/<\/br>/g, " ")
                  .substring(0, 34)
                  .trim() + "..."
              : message.text}
            {!message.readed ? <span className="unreaded" /> : ""}
          </div>
        </div>
      </a>
    );
  }
}

export default Preview;
