import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllDeals, successDeal } from "../../actions/dealsAction";
import { Link } from "react-router-dom";

class Deals extends Component {
  componentDidMount() {
    this.props.getAllDeals();
  }

  successDeal = (id, status) => {
    this.props.successDeal({ post: id, status }, this.props.getAllDeals);
  };

  render() {
    const deals = this.props.deals.deals;
    const user = this.props.auth.user;

    return (
      <div className="deals">
        <div className="deals-title">Ваши сделки</div>
        {deals.length > 0 ? (
          deals.map(deal => (
            <div className="deals-item" key={deal.id}>
              <div className="deals-avatar">
                {user.id === deal.userId ? (
                  <img
                    src={`/img/${
                      deal.worker_avatar !== null
                        ? deal.worker_avatar
                        : deal.user_avatar
                    }`}
                    alt={
                      deal.worker_name !== null
                        ? deal.worker_name
                        : deal.user_name
                    }
                  />
                ) : (
                  <img src={`/img/${deal.user_avatar}`} alt={deal.user_name} />
                )}
              </div>
              {user.id === deal.userId ? (
                <div className="deals-body">
                  {deal.workerId === null ? (
                    <div>
                      Исполнитель для вашего{" "}
                      <Link to={`/post/${deal.id}`}>заказа</Link> не выбран,
                      выберите <Link to="/messages?">исполнителя</Link>
                    </div>
                  ) : (
                    <div>
                      {deal.protected !== null ? (
                        <span>
                          <i className="far fa-shield-alt" /> Безопасная сделка
                          на сумму{" "}
                          <span className="money">{deal.protected}</span>{" "}
                          <i className="far fa-ruble-sign" />.
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      <Link to={`/user/${deal.workerId}`}>Пользователь</Link>{" "}
                      был выбран иполнителем вашего{" "}
                      <Link to={`/post/${deal.id}`}>заказа</Link>, если заказ
                      был выполнен вы можете оценить его или перейтик диалогу с{" "}
                      <Link to={`/messages?to=${deal.workerId}`}>
                        исполнителем
                      </Link>
                      {deal.completed === null ? (
                        <div className="deals-btns">
                          <div
                            className="button deals-btn accept"
                            onClick={() => this.successDeal(deal.id, 1)}
                          >
                            Отлично
                          </div>
                          <div
                            className="button deals-btn reject"
                            onClick={() => this.successDeal(deal.id, 0)}
                          >
                            Плохо
                          </div>
                        </div>
                      ) : (
                        <div className="deals-completed">Заказ был сдан</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="deals-body">
                  {deal.protected !== null ? (
                    <span>
                      <i className="far fa-shield-alt" /> Безопасная сделка на
                      сумму <span className="money">{deal.protected}</span>{" "}
                      <i className="far fa-ruble-sign" />.
                    </span>
                  ) : (
                    ""
                  )}{" "}
                  Вы были выбраны иcполнителем{" "}
                  <Link to={`/post/${deal.id}`}>заказа</Link>, если заказ был
                  выполнен вы можете попросить его оценить в{" "}
                  <Link to={`/messages?to=${deal.userId}`}>диалоге</Link> с
                  заказчиком
                  {deal.completed === null ? (
                    ""
                  ) : (
                    <div className="deals-completed">Вы сдали заказ</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="deals-empty">Сделок нету</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deals: state.deals,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllDeals, successDeal }
)(Deals);
