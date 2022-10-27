import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../Redux/Actions/cartActions";
import { Link } from "react-router-dom";
import { getAddressData } from "../Redux/Actions/userActions";
//import { updateUserProfile } from "../Redux/Actions/userActions";

const ShippingScreen = ({ history }) => {
  window.scrollTo(0, 0);

  //const userDetails = useSelector((state) => state.userDetails);
  //const { user, loading, error } = userDetails;
  const getListAddressData = useSelector((state) => state.addressData);
  const { addressData } = getListAddressData;
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  const dispatch = useDispatch();

  const selectProvinceHandler = (value) => {
    setProvince(value);
    setDistrict("");
    setWard("");
    setWardList([]);
    const getDistrict = addressData.find((item) => {
      return item.name == value;
    });
    if (getDistrict) {
      setDistrictList(getDistrict.districts);
    } else setDistrictList([]);
  };
  const selectDistrictHandler = (value) => {
    setDistrict(value);
    setWard("");
    const getWard = districtList.find((item) => {
      return item.name == value;
    });
    if (getWard) {
      setWardList(getWard.wards);
    } else setDistrictList([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // const addressUpdate = { province, district, ward, specificAddress };
    // user.address = addressUpdate;
    // dispatch(updateUserProfile(user));
    history.push("/payment");
  };
  useEffect(() => {
    dispatch(getAddressData());
  }, [dispatch]);
  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
          <h6>DELIVERY ADDRESS</h6>

          <div className="filter-menu-item">
            <select
              className="form-select"
              aria-label="Filter by category"
              value={province}
              onChange={(e) => selectProvinceHandler(e.target.value)}
            >
              <option value="">Tỉnh/Thành phố</option>
              {addressData?.map((item, index) => (
                <option value={item.name} key={index} id={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-menu-item">
            <select
              className="form-select"
              aria-label="Filter by category"
              value={district}
              onChange={(e) => selectDistrictHandler(e.target.value)}
            >
              <option value="">Quận/Huyện</option>
              {districtList?.map((item, index) => (
                <option value={item.name} key={index} id={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-menu-item">
            <select
              className="form-select"
              aria-label="Filter by category"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="">Phường/Xã</option>
              {wardList?.map((item, index) => (
                <option value={item.name} key={index} id={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            required
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
          />

          <button type="submit">
            <Link to="/payment" className="text-white">
              Continue
            </Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default ShippingScreen;