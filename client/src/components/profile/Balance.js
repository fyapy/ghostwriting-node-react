import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  getPaymentsHistory,
  getCurrentProfile,
  cashOutBalance
} from "../../actions/profileActions";
import Moment from "react-moment";
import "moment/locale/ru";
import isEmpty from "../../validation/is-empty";

class Balance extends Component {
  state = {
    cash_out: false,
    yandex_money: "",
    card: "",
    amount: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.props.getPaymentsHistory();
    this.props.getCurrentProfile();
  }

  hangleCashOut = () => {
    if (this.props.profile.profile.balance !== 0) {
      this.setState({ cash_out: !this.state.cash_out });
    }
  };

  onCashOut = e => {
    e.preventDefault();
    const amount = parseInt(this.state.amount);
    const balance = this.props.profile.profile.balance;
    const yandex_money = this.state.yandex_money;
    const card = this.state.card;

    if (amount <= balance && (!isEmpty(yandex_money) || !isEmpty(card))) {
      this.props.cashOutBalance({ amount, yandex_money, card });
      this.setState({
        yandex_money: "",
        card: "",
        amount: ""
      });

      toast.success(
        `Запрос на вывод средств отправлен. Ожидайте выплаты в течений 24 часов`,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000
        }
      );
    }
  };

  render() {
    const profile = this.props.profile.profile;
    const payments_history = this.props.profile.payments_history;

    return (
      <div className="balance">
        <div className="balance-wrapper">
          <div className="balance-top">
            <div className="balance-avatar">
              <img
                src={`/img/${profile ? profile.avatar : "04.png"}`}
                alt={profile ? profile.username : "Имя"}
              />
            </div>
            <div className="balance-status">
              <div className="balance-value">
                Ваш баланс:{" "}
                <span>
                  {profile ? profile.balance : "0"}{" "}
                  <i className="far fa-ruble-sign" />
                </span>
              </div>
              <div className="balance-title">
                Это страница вашего баланса здесь вы можете пополнить ваш баланс
                для заключения с гострайтером безопасной сделки, а так же
                вывести деньги что скапились на балансе в результате сделок.
              </div>
              <div
                className={`balance-cash-out button ${
                  !profile ? "" : profile.balance === 0 ? "" : " active "
                }`}
                onClick={this.hangleCashOut}
              >
                Вывести
                {!profile ? "" : profile.balance === 0 ? " (Баланс пуст)" : ""}
              </div>
            </div>
          </div>
          <div
            className={`balance-pay ${
              this.state.cash_out === true ? "hide" : ""
            }`}
          >
            <iframe
              src={`https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9F%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%B0%20%D0%BD%D0%B0%20GhostWriting.Online&targets-hint=&default-sum=300&button-text=12&payment-type-choice=on&hint=&successURL=&quickpay=shop&account=41001791234267&label=${
                this.props.auth.user.id
              }`}
              width="100%"
              height="250"
              title="balance"
              frameBorder="0"
              allowtransparency="true"
              scrolling="no"
            />
          </div>
          <form
            className={`balance-pay ${
              this.state.cash_out === false ? "hide" : ""
            }`}
            onSubmit={this.onCashOut}
          >
            <h1 className="form-title">Данные для вывода</h1>
            <h1 className="form-text">
              Для вывода средств укажите ваш YM кошелёк или номер Банковской
              карты. После отправки запроса на вывод в течений 24 часов будет
              произведа выплата.
            </h1>
            <div className="form-group">
              <span className="form-subtitle">Сумма:</span>
              <input
                type="text"
                name="amount"
                className="form-control"
                value={this.state.amount}
                placeholder="Сумма для вывода"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <span className="form-subtitle">YandexMoney:</span>
              <input
                type="text"
                name="yandex_money"
                className="form-control"
                value={this.state.yandex_money}
                placeholder="Ваш Yandex Money кошелёк"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <span className="form-subtitle">Карта:</span>
              <input
                type="text"
                name="card"
                className="form-control"
                value={this.state.card}
                placeholder="Ваш номер карты"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <input
                className="form-submit button"
                type="submit"
                value="Отправить"
              />
            </div>
          </form>
          <div className="balance-history">
            <div className="balance-history-title">История ваших платижей:</div>
            {payments_history === null ? (
              <div className="messages-preview-loader">
                <div className="lds-dual-ring" />
              </div>
            ) : payments_history.length > 0 ? (
              payments_history.map(payment => (
                <div className="balance-history-item" key={payment.id}>
                  <div className="balance-history-name">
                    {payment.payload === 1
                      ? "Пополнение баланса"
                      : "Вывод с баланса"}
                  </div>
                  <div className="balance-history-amount">
                    {payment.amount}
                    <i className="far fa-ruble-sign" />{" "}
                    {payment.payload === 1 ? (
                      <i className="far fa-plus" />
                    ) : (
                      <i className="far fa-minus" />
                    )}
                  </div>
                  <Moment className="balance-history-date" locale="ru" fromNow>
                    {payment.createdAt}
                  </Moment>
                </div>
              ))
            ) : (
              <div className="balance-history-empty">
                У вас не было платижей
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPaymentsHistory, getCurrentProfile, cashOutBalance }
)(Balance);
