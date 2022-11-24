import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_VERIFY,
  USER_UPDATE_AVATAR_FAIL,
  USER_UPDATE_AVATAR_REQUEST,
  USER_UPDATE_AVATAR_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_GET_ADDRESS_DATA_REQUEST,
  USER_GET_ADDRESS_DATA_SUCCESS,
  USER_GET_ADDRESS_DATA_FAIL,
  USER_UPDATE_PASSWORD_REQUEST,
  USER_UPDATE_PASSWORD_SUCCESS,
  USER_UPDATE_PASSWORD_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  ADMIN_GET_USER_DETAILS_REQUEST,
  ADMIN_GET_USER_DETAILS_SUCCESS,
  ADMIN_GET_USER_DETAILS_FAIL
} from "../Constants/userConstants";
import axios from "axios";

// USER LOGIN
export const userLoginAction = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    const { data } = await axios.post(`/api/v1/user/login`, { email, password }, config);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

// LOGOUT USER
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  // dispatch({ type: USER_LIST_RESET });
  document.location.href = "/login";
  // localStorage.setItem("cartItems", JSON.stringify([]));
};

// REGISTER
export const userRegisterAction = (history, name, email, phone, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    const { data } = await axios.post(`/api/v1/user`, { name, email, phone, password }, config);

    dispatch({ type: USER_REGISTER_VERIFY });
    history.push(`/register/verify/${email}`);
    // dispatch({ type: USER_REGISTER_SUCCESS, payload: { userId: data._id } });
    // dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};

export const verifyEmail = (verificationToken) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_VERIFY });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios.patch(`/api/v1/user/verifyEmail`, { verificationToken }, config);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: message
    });
  }
};

// SHOW USER DETAILS SCREEN
export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(`/api/v1/user/profile`, config);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message
    });
  }
};

// SHOW USER DETAILS SCREEN BY ADMIN
export const adminGetUserDetails = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIN_GET_USER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    const { data } = await axios.get(`/api/v1/user/profile/${userId}`, config);
    dispatch({ type: ADMIN_GET_USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ADMIN_GET_USER_DETAILS_FAIL,
      payload: message
    });
  }
};
// UPDATE PROFILE USER
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.put(`/api/v1/user/profile`, user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message
    });
  }
};

// UPDATE PASSWORD
export const updatePassword = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PASSWORD_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.post(`/api/v1/user/${user.userId}/updatePassword`, user, config);
    dispatch({ type: USER_UPDATE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PASSWORD_FAIL,
      payload: message
    });
  }
};

// FORGOT PASSWORD
export const forGotPassWord = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const data = await axios.patch(`/api/v1/user/forgotPassword`, { email }, config);
    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: message
    });
  }
};

//Reset password
export const userResetPassword = (resetPasswordToken, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { data } = await axios.patch(`/api/v1/user/resetPassword`, { resetPasswordToken, newPassword }, config);
    dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload: message
    });
  }
};

// UPDATE AVATAR USER
export const updateUserAvatar =
  ({ user, formData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UPDATE_AVATAR_REQUEST });

      const {
        userLogin: { userInfo }
      } = getState();

      const config = {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(`/api/v1/user/updateAvatar/${user._id}`, formData, config);
      dispatch({ type: USER_UPDATE_AVATAR_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: USER_UPDATE_AVATAR_FAIL,
        payload: message
      });
    }
  };

// ALL USER
export const listUser =
  (keyword = "", status = "", limit = 8, pageNumber = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LIST_REQUEST });

      const {
        userLogin: { userInfo }
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.get(
        `/api/v1/user?&keyword=${keyword}&status=${status}&limit=${limit}&page=${pageNumber}`,
        config
      );

      dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: USER_LIST_FAIL,
        payload: message
      });
    }
  };

//Get address data
export const getAddressData = () => async (dispatch) => {
  try {
    dispatch({ type: USER_GET_ADDRESS_DATA_REQUEST });
    const { data } = await axios.get(`https://provinces.open-api.vn/api/?depth=3`);
    dispatch({ type: USER_GET_ADDRESS_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_GET_ADDRESS_DATA_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};
