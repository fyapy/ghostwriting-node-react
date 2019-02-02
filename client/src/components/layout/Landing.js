import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="home">
        <div className="home-box">
          <div className="home-title">GhostWriting</div>
          <div className="home-subtitle">Нужен текст для трэка?</div>
          <div className="home-text">
            Ты можешь разместить заказ, и наши талантливые гострайтеры тебе
            помогут
          </div>
          <div className="home-btns">
            <Link to="/register" className="home-btns-link button left">
              Гострайтер
            </Link>
            <Link to="/register" className="home-btns-link button right">
              Заказчик
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propsTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
