import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/orderActions";
import moment from "moment";
import { ORDER_PAY_RESET } from "../Redux/Constants/orderConstants";
import Loading from "../components/base/LoadingError/Loading";
import Message from "../components/base/LoadingError/Error";
import formatCash from "../utils/formatCash";

const OrderScreen = ({ match }) => {
  window.scrollTo(0, 0);
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  if (!loading) {
    order.itemsPrice = order.orderItems.reduce((accumulate, item) => accumulate + item.price * item.qty, 0);
  }

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  return (
    <>
      <Header />
      <div className="container">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row order-detail">
              {/*  */}
              <div className="order-detail-item col-lg-3 col-md-6 col-6">
                <div className="row order-detail-item-content">
                  <div className="col-md-3 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="col-md-9 center">
                    <h7 className="order-detail-title">
                      <strong>Khách hàng</strong>
                    </h7>
                    <p className="order-detail-text">Tên: {order.user.name}</p>
                    <p className="order-detail-text">SĐT: {order.user.phone}</p>
                  </div>
                </div>
              </div>
              {/* 2 */}
              <div className="order-detail-item col-lg-3 col-md-6 col-6">
                <div className="row order-detail-item-content">
                  <div className="col-md-3 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-truck-moving"></i>
                    </div>
                  </div>
                  <div className="col-md-9 center">
                    <h7 className="order-detail-title">
                      <strong>Thông tin vận chuyển</strong>
                    </h7>
                    <p className="order-detail-text">Đơn vị vận chuyển: GHTK</p>
                    <p className="order-detail-text">Hình thức vận chuyển: Nhanh</p>
                  </div>
                </div>
              </div>
              {/* 3 */}
              <div className="order-detail-item col-lg-3 col-md-6 col-6">
                <div className="row order-detail-item-content">
                  <div className="col-md-3 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-9 center">
                    <h7 className="order-detail-title">
                      <strong>Địa chỉ giao hàng</strong>
                    </h7>
                    <p className="order-detail-text">{order.shippingAddress}</p>
                    {!order.confirmed ? (
                      <Link className="btn-link" to={"/shipping"}>
                        Thay đổi
                      </Link>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              {/* 4 */}
              <div className="order-detail-item col-lg-3 col-md-6 col-6">
                <div className="row order-detail-item-content">
                  <div className="col-md-3 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h7 className="order-detail-title">
                      <strong>Trạng thái đơn hàng</strong>
                    </h7>
                    {order.isPaid ? (
                      <div className="bg-info mb-1 p-1 col-12">
                        <p className="order-detail-text text-white text-center text-sm-start">
                          Đã thanh toán: {moment(order.paidAt).format("LT") + " " + moment(order.paidAt).format("L")}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger mb-1 p-1 col-12">
                        <p className="order-detail-text text-white text-center text-sm-start">Chưa thanh toán</p>
                      </div>
                    )}
                    {order.isDelivered ? (
                      <div className="bg-info mb-1 p-1 col-12">
                        <p className="order-detail-text text-white text-center text-sm-start">Đang giao</p>
                      </div>
                    ) : (
                      <div className="bg-danger mb-1 p-1 col-12">
                        <p className="order-detail-text text-white text-center text-sm-start">Đang chờ xác nhận</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row order-products justify-content-between">
              <div className="col-lg-8">
                {order?.orderItems.length === 0 ? (
                  <Message variant="alert-info mt-5">Bạn chưa có đơn hàng nào</Message>
                ) : (
                  <>
                    {order?.orderItems.map((item, index) => (
                      <div className="order-products-item row" key={index}>
                        <div className="col-lg-2 col-md-2 col-3">
                          <Link to={`/product/${item.product}`}>
                            <img src={item.image} alt={item.name} />
                          </Link>
                        </div>
                        <div className="col-lg-4 px-2 col-md-4 col-6 d-flex align-items-center">
                          <Link to={`/product/${item.product}`}>
                            <h6>{item.name.length >= 50 ? `${item.name.slice(0, 50)}...` : ` ${item.name}`}</h6>
                          </Link>
                        </div>
                        <div className="order-products-item-qty mt-3 mt-md-0  col-lg-2 col-md-2 col-3  d-flex align-items-center flex-column justify-content-center ">
                          <h4>Số lượng</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="unit__price mt-3 mt-md-0 col-lg-2 col-md-2 col-9  d-flex align-items-center flex-column justify-content-center ">
                          <h4>Đơn giá</h4>
                          <h6>{formatCash(item.price)}</h6>
                        </div>
                        <div className="order-products-item-total mt-3 mt-md-0 col-lg-2 col-md-2 col-3 align-items-end  d-flex flex-column justify-content-center ">
                          <h4>Thành tiền</h4>
                          <h6 className="text-danger fw-bold">{formatCash(item.qty * item.price)}</h6>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* total */}
              <div className="col-lg-4 d-flex align-items-end flex-column mt-5 subtotal-order">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Tổng tiền sản phẩm</strong>
                      </td>
                      <td>{formatCash(order.itemsPrice)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Phí vận chuyển</strong>
                      </td>
                      <td>{formatCash(order.shippingPrice)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Thuế VAT (5%)</strong>
                      </td>
                      <td>{formatCash(order.taxPrice)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Tổng cộng</strong>
                      </td>
                      <td>{formatCash(order.totalPrice)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Phương thức thanh toán </strong>
                      </td>
                      <td>{order.paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>
                {order.confirmed ? <button>Đã nhận hàng</button> : <span>Đang chờ xác nhận</span>}
                {!order.confirmed ? <button>Hủy đơn hàng</button> : <></>}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;
