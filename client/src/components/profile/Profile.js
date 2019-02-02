import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  getCurrentProfile,
  uploadAvatar,
  changeDescription
} from "../../actions/profileActions";
import Cropper from "../../../node_modules/react-cropper/dist/react-cropper";
import "../../../node_modules/cropperjs/dist/cropper.min.css";
import Moment from "react-moment";
import "moment/locale/ru";

class Profile extends Component {
  state = {
    avatar: null,
    file: null,
    upload: false,
    description: ""
  };

  _crop() {
    const avatar = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState({ avatar, upload: true });
  }

  changeFile = e => {
    const files = e.target.files;
    this.setState({
      upload: false
    });
    if (files.length > 0) {
      var selectedFile = files[0];
      var reader = new FileReader();

      reader.onload = e => {
        this.setState({ file: e.target.result });
        setTimeout(() => {
          this._crop();
        }, 750);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      this.setState({ file: null });
    }
  };

  uploadAvatar = () => {
    if (this.state.upload === true) {
      this.props.uploadAvatar({
        upload: this.state.avatar
      });
    }
  };

  submitDescription = e => {
    e.preventDefault();
    this.props.changeDescription({ description: this.state.description });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidUpdate(prevProps) {
    const profile = this.props.profile.profile;
    if (profile !== prevProps.profile.profile) {
      this.setState({ description: profile.description, upload: false });
    }
  }

  render() {
    const profile = this.props.profile.profile;
    const file = this.state.file;

    return (
      <div className="profile">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="profile-avatar-title">
              Смена аватарки{" "}
              {this.props.profile.uploaded !== null ? (
                <span className="profile-avatar-uploaded">Обновлено</span>
              ) : (
                ""
              )}
            </div>
            <div className="profile-cropper">
              <Cropper
                ref="cropper"
                src={
                  file ? file : `/img/${profile ? profile.avatar : "04.png"}`
                }
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  margin: "0 auto",
                  maxHeight: "200px"
                }}
                minContainerWidth={200}
                minContainerHeigth={150}
                aspectRatio={4 / 4}
                viewMode={2}
                guides={false}
                cropend={this._crop.bind(this)}
              />
              <label htmlFor="cropper-file">
                <input
                  type="file"
                  onChange={this.changeFile}
                  className="profile-cropper-file"
                  id="cropper-file"
                />
                <div className="profile-cropper-btn button">Сменить</div>
              </label>
              <div
                className={classnames("profile-upload button", {
                  active: this.state.upload
                })}
                onClick={this.uploadAvatar}
              >
                Обновить
              </div>
            </div>
          </div>
          <div className="profile-stats">
            <div className="profile-name">
              {profile ? profile.name : ""}{" "}
              <span className="profile-online">Online</span>
            </div>
            <div className="profile-date">
              Аккаунт создан{" "}
              <Moment locale="ru" fromNow>
                {profile ? profile.createdAt : Date.now()}
              </Moment>
              <Link
                to={`/user/${profile ? profile.id : ""}`}
                className="profile-view"
              >
                <i className="far fa-eye" /> Взглянуть
              </Link>
            </div>
            <div className="profile-marks">
              <div className="profile-likes">
                <i className="fal fa-thumbs-up" />{" "}
                {profile ? profile.likes : ""}
              </div>
              <div className="profile-dislikes">
                <i className="fal fa-thumbs-down" />{" "}
                {profile ? profile.dislikes : ""}
              </div>
            </div>
            <form className="profile-form" onSubmit={this.submitDescription}>
              <div className="profile-form-title">
                Смена описания:{" "}
                {this.props.profile.updated !== null ? (
                  <span className="profile-form-updated">Обновлено</span>
                ) : (
                  ""
                )}
              </div>
              <textarea
                name="description"
                value={
                  this.state.description !== null ? this.state.description : ""
                }
                onChange={this.onChange}
                placeholder="Описание пустое.."
                className="profile-description"
              />
              <input
                type="submit"
                value="Обновить"
                className="profile-btn button"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, uploadAvatar, changeDescription }
)(Profile);
