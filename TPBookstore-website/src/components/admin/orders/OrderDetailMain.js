import React, { useEffect, useState } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import formatCash from "../../../utils/formatCash";
import { useDispatch, useSelector } from "react-redux";
import {
  deliverOrder,
  getOrderDetails,
  isPaidOrder,
  confirmOrder,
  cancelOrderAdmin
} from "./../../../Redux/Actions/orderActions";
import Loading from "./../../base/LoadingError/Loading";
import Message from "./../../base/LoadingError/Error";
import moment from "moment";
import { listUser } from "../../../Redux/Actions/userActions";
import Modal from "../../base/modal/Modal";

const OrderDetailMain = (props) => {
  const { orderId } = props;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  if (!loading) {
    order.itemsPrice = order.orderItems.reduce((accumulate, item) => accumulate + item.price * item.qty, 0);
  }

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDelivered, success: successDelivered } = orderDeliver;

  const orderConfirm = useSelector((state) => state.orderConfirm);
  const { loading: loadingConfirm, success: successConfirm } = orderConfirm;

  // const orderIsPaid = useSelector((state) => state.orderIsPaidAdmin);
  // const { loading: loadingIsPaid, success: successIsPaid } = orderIsPaid;

  const orderCancelAdmin = useSelector((state) => state.orderCancelAdmin);
  const { loading: loadingCancel, success: successCancel } = orderCancelAdmin;

  const orderSelectShipper = useSelector((state) => state.orderSelectShipper);
  const { success: successSelectShipper } = orderSelectShipper;

  const shipperList = useSelector((state) => state.userList);
  const { loading: loadingShipper, error: errorShipper, users } = shipperList;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    dispatch(listUser("", "shipper"));
  }, [dispatch, orderId, successDelivered, successConfirm, successCancel, successSelectShipper]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [btnTitle, setBtnTitle] = useState("");
  const [btnType, setBtnType] = useState("");
  const [typeAction, setTypeAction] = useState(() => {});

  const typeModal = (type) => {
    if (type === "confirm") {
      setModalTitle("X??c nh???n ????n h??ng");
      setModalBody("B???n c?? ch???c mu???n nh???n ????n h??ng n??y?");
      setBtnTitle("X??c nh???n");
      setBtnType("confirm");
      setTypeAction(type);
    }
    if (type === "deliver") {
      setModalTitle("X??c nh???n ???? giao h??ng");
      setModalBody("B???n c?? ch???c ????n h??ng ???? giao th??nh c??ng?");
      setBtnTitle("X??c nh???n");
      setBtnType("confirm");
      setTypeAction(type);
    }
    // if (type === "paid") {
    //   setModalTitle("X??c nh???n ???? thanh to??n");
    //   setModalBody("B???n c?? ch???c ????n h??ng ???? thanh to??n th??nh c??ng?");
    //   setBtnTitle("X??c nh???n");
    //   setBtnType("confirm");
    //   setTypeAction(type);
    // }
    if (type === "cancel") {
      setModalTitle("X??c nh???n h???y ????n h??ng");
      setModalBody("B???n c?? ch???c mu???n h???y ????n h??ng n??y?");
      setBtnTitle("H???y");
      setBtnType("delete");
      setTypeAction(type);
    }
  };

  const confirmHandler = () => {
    dispatch(confirmOrder(order._id));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };
  // const isPaidHandler = () => {
  //   dispatch(isPaidOrder(order._id));
  // };
  const cancelHandler = () => {
    dispatch(cancelOrderAdmin(order._id));
  };
  return (
    <>
      <Modal
        modalTitle={modalTitle}
        modalBody={modalBody}
        btnTitle={btnTitle}
        btnType={btnType}
        handler={
          typeAction === "confirm"
            ? confirmHandler
            : typeAction === "deliver"
            ? deliverHandler
            : // : typeAction === "paid"
              // ? isPaidHandler
              cancelHandler
        }
      />
      <section className="content-main">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <div className={order.isDisabled ? `card status-disabled` : `card`}>
            <header className="card-header p-3 Header-green">
              <div className="row align-items-center ">
                <div className="col-lg-1 col-md-1">
                  <Link to="/admin/orders" className="btn">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="col-lg-5 col-md-5">
                  <i class="far fa-barcode-alt"></i>
                  <b className="text-white mx-1">M?? ????n h??ng:</b>
                  <span className="text-white mx-1">{order._id}</span>
                  <br />
                  <span>
                    <i className="far fa-calendar-alt"></i>
                    <b className="text-white">Ng??y ?????t:</b>
                    <span className="text-white mx-3 ">
                      {moment(order.createdAt).format("LT") + " " + moment(order.createdAt).format("DD/MM/yyyy")}
                    </span>
                  </span>
                </div>
                <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                  <Link className="btn btn-success ms-2" to="#">
                    <i className="fas fa-print"></i>
                  </Link>
                </div>
              </div>
            </header>
            <div className="card-body">
              {/* Order info */}
              <OrderDetailInfo order={order} shippers={users} />

              <div className="row">
                <div className="col-lg-8 col-md-12">
                  <div className="table-responsive">
                    <OrderDetailProducts order={order} loading={loading} />
                  </div>
                </div>
                {/* Payment Info */}
                <div className="col-lg-4 px-0">
                  <table className="table__order-details mx-0">
                    <tr>
                      <td>
                        <article className="float-end">
                          <dl className="dlist">
                            <dt className="text-start">T???ng ti???n s???n ph???m:</dt>{" "}
                            <dd className="mx-0 text-end">{formatCash(order.itemsPrice)}</dd>
                          </dl>
                          <dl className="dlist">
                            <dt className="text-start">Ph?? v???n chuy???n: </dt>{" "}
                            <dd className="mx-0 text-end">{formatCash(order.shippingPrice)}</dd>
                          </dl>
                          <dl className="dlist">
                            {/* <dt className="text-start">Thu??? VAT(5%):</dt>{" "} */}
                            {/* <dd className="mx-0 text-end">{formatCash(order.taxPrice)}</dd> */}
                          </dl>
                          <dl className="dlist">
                            <dt className="text-start">T???ng ti???n:</dt>
                            <dd className="mx-0 text-end">
                              <b>{formatCash(order.totalPrice)}</b>
                            </dd>
                          </dl>
                          <dl className="dlist">
                            <dt className="text-start">Ph????ng th???c thanh to??n:</dt>
                            <dd className="mx-0 text-start" style={{ fontSize: "15px" }}>
                              <span className="">{order.paymentMethod}</span>
                            </dd>
                          </dl>
                        </article>
                      </td>
                    </tr>
                  </table>
                  <div className="box shadow-sm bg-light">
                    {!order.cancelled ? (
                      <div>
                        {order?.delivered ? (
                          <button className="btn btn-success col-12">
                            <p>Giao h??ng th??nh c??ng&nbsp;</p>
                            <p>
                              ({moment(order.deliveredAt).format("LT")}&nbsp;
                              {moment(order.deliveredAt).format("DD/MM/yyyy")})
                            </p>
                          </button>
                        ) : !order?.confirmed ? (
                          <>
                            {loadingConfirm && <Loading />}
                            <button
                              data-toggle="modal"
                              data-target="#exampleModalCenter"
                              onClick={() => typeModal("confirm")}
                              type="button"
                              className="btn btn-primary col-12 btn-size"
                            >
                              X??c nh???n ????n h??ng
                            </button>
                          </>
                        ) : (
                          <>
                            {loadingDelivered && <Loading />}
                            <button
                              data-toggle="modal"
                              data-target="#exampleModalCenter"
                              onClick={() => typeModal("deliver")}
                              className="btn btn-primary col-12 btn-size"
                              disabled={!order.shipper}
                            >
                              X??c nh???n giao h??ng th??nh c??ng
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}

                    {!order?.delivered ? (
                      <>
                        {!order.cancelled ? (
                          <>
                            {loadingCancel && <Loading />}
                            <button
                              data-toggle="modal"
                              data-target="#exampleModalCenter"
                              onClick={() => typeModal("cancel")}
                              className="btn btn-danger col-12 btn-size mt-2"
                            >
                              H???y ????n h??ng
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-danger col-12 btn-size mt-2">????n h??ng ???? b??? h???y</button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default OrderDetailMain;
