import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import "../../../node_modules/react-toastify/dist/ReactToastify.min.css";
import {
  getDialogsPreview,
  getDialog,
  closeDialog,
  sendMessage,
  readMessages,
  getTarget
} from "../../actions/messageAction";
import { getCurrentProfile } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";
import socket from "../../socket";

// Import components
import Preview from "./Preview";
import Dialog from "./Dialog";

class Messages extends Component {
  state = {
    dialog: null,
    to: null,
    showPreview: true,
    showDialog: true,
    postId: null
  };

  componentDidMount() {
    if (window.innerWidth <= 1400) {
      this.setState({ showDialog: false });
    }

    const urlQuery = queryString.parse(this.props.location.search);
    if (urlQuery.to !== undefined) {
      this.getDialog(parseInt(urlQuery.to));
      this.setState({
        to: parseInt(urlQuery.to)
      });
    }
    if (urlQuery.post !== undefined) {
      this.setState({
        postId: parseInt(urlQuery.post)
      });
    }

    this.props.getDialogsPreview();
  }

  getDialog = id => {
    this.props.getDialog(id);
    this.setState({
      to: id
    });
    if (window.innerWidth <= 1400) {
      this.setState({ showPreview: false, showDialog: true });
    }
    if (this.state.postId !== null) {
      this.setState({
        postId: null
      });
    }
  };

  closeDialog = () => {
    this.props.closeDialog();
    if (window.innerWidth <= 1400) {
      this.setState({ showPreview: true, showDialog: false });
    }
  };

  componentDidUpdate(prevProps) {
    const dialogTarget = this.props.messages.dialogTarget;
    if (
      dialogTarget !== prevProps.messages.dialogTarget &&
      dialogTarget !== null
    ) {
      const dialog = this.props.messages.dialog;
      if (
        !isEmpty(dialog) &&
        dialog[dialog.length - 1].toId === this.props.auth.user.id
      ) {
        // Socket event - Send messages read
        socket.emit(`messageRead`, {
          to: dialogTarget,
          from: this.props.auth.user.id
        });
        // Update messgaes in the read
        this.props.readMessages(
          dialogTarget,
          this.props.messages.previews,
          dialogTarget,
          this.props.messages.dialog
        );
        // Unread messages count get
        socket.emit("getUnreaded", { user: this.props.auth.user.id });
      }
    }
  }

  sendMessage = message => {
    this.props.sendMessage(message, this.state.to, this.state.postId);
    if (this.state.postId !== null) {
      this.setState({
        postId: null
      });
    }
  };

  findTarget = () => {
    this.props.getTarget(this.props.messages.dialogTarget);
  };

  previewFindTarget = () => {
    this.props.getTarget(this.props.messages.previews[0].fromId);
  };

  render() {
    const auth = this.props.auth;
    const previews = this.props.messages.previews;

    const targets = this.props.messages.targets;
    let uniqTargets = [];

    const dialog = this.props.messages.dialog;
    const dialogTarget = this.props.messages.dialogTarget;

    const user = this.props.profile.profile;

    return (
      <div className="messages">
        <div className="messages-wrapper">
          {this.state.showPreview === true ? (
            <div className="messages-preview">
              {targets.length < 0 ? (
                <div className="messages-preview-loader">
                  <div className="lds-dual-ring" />
                </div>
              ) : previews.length !== 0 ? (
                previews.map(preview => {
                  let targetId =
                    preview.toId !== auth.user.id
                      ? preview.toId
                      : preview.fromId;

                  if (uniqTargets.indexOf(targetId) === -1) {
                    uniqTargets.push(targetId);
                    return (
                      <Preview
                        getDialog={this.getDialog}
                        key={preview.id}
                        id={preview.toId}
                        findTarget={this.previewFindTarget}
                        target={targets.find(x => x.id === targetId)}
                        message={preview}
                      />
                    );
                  } else {
                    return "";
                  }
                })
              ) : (
                <div className="messages-preview-empty">
                  У вас нету сообщений, напишите{" "}
                  <Link to="/posts">кому-то</Link>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          {this.state.showDialog === true ? (
            <div className="messages-dialog">
              {dialogTarget !== null ? (
                <div
                  onClick={this.closeDialog}
                  className="messages-dialog-close"
                >
                  <i className="far fa-arrow-left" />
                  <span>Назад</span>
                </div>
              ) : (
                ""
              )}
              {dialogTarget !== null ? (
                <Dialog
                  dialog={dialog}
                  me={user}
                  findTarget={this.findTarget}
                  target={targets.find(x => x.id === parseInt(dialogTarget))}
                  sendMessage={this.sendMessage}
                />
              ) : (
                <div className="messages-dialog-banner">
                  <div className="messages-dialog-banner-wrapper">
                    <i className="fal fa-comments" />
                    Пожалуйста, выберите диалог или напишите{" "}
                    <Link to="/posts">кому-то</Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  messages: state.messages,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  {
    getDialogsPreview,
    getDialog,
    closeDialog,
    getCurrentProfile,
    sendMessage,
    readMessages,
    getTarget
  }
)(Messages);
