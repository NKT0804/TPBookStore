import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCategoryAdmin, listCategoryAdmin } from "../../../Redux/Actions/categoryActions";
import { CATEGORY_DELETE_RESET, CATEGORY_UPDATE_RESET } from "../../../Redux/Constants/categoryConstants";
import Message from "../../base/LoadingError/Error";
import Loading from "../../base/LoadingError/Loading";
import Toast from "../../base/LoadingError/Toast";
import Modal from "../../base/modal/Modal";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000
};
const CategoriesTable = ({ setIsEditCategory, handleEditCategory, handleCurrentCategory }) => {
  const dispatch = useDispatch();

  const categoryListAdmin = useSelector((state) => state.categoryListAdmin);
  const { error, loading, category } = categoryListAdmin;

  const categoryCreateAdmin = useSelector((state) => state.categoryCreateAdmin);
  const { success: successAdd } = categoryCreateAdmin;

  const categoryDeleteAdmin = useSelector((state) => state.categoryDeleteAdmin);
  const { success: successDel, error: errorDel } = categoryDeleteAdmin;

  const categoryUpdateAdmin = useSelector((state) => state.categoryUpdateAdmin);
  const { success: successUpdated, error: errorUpdated } = categoryUpdateAdmin;

  const [categoryIdDelete, setCategoryIdDelete] = useState("");
  const categoryDeleteHandler = () => {
    dispatch(deleteCategoryAdmin(categoryIdDelete));
  };

  useEffect(() => {
    if (successDel) {
      toast.success("Xóa danh mục thành công!", ToastObjects);
    }
    if (errorDel) {
      toast.error(errorDel, ToastObjects);
    }
    dispatch({ type: CATEGORY_DELETE_RESET });
  }, [dispatch, successDel, errorDel]);

  useEffect(() => {
    if (successUpdated) {
      toast.success("Cập nhật danh mục thành công!", ToastObjects);
      setIsEditCategory(false);
    }
    if (errorUpdated) {
      toast.error(errorUpdated, ToastObjects);
    }
    dispatch({ type: CATEGORY_UPDATE_RESET });
  }, [dispatch, successUpdated, errorUpdated, setIsEditCategory]);

  useEffect(() => {
    dispatch(listCategoryAdmin());
  }, [dispatch, successAdd, successDel, successUpdated]);

  return (
    <>
      <Toast />
      <Modal
        modalTitle={"Xóa danh mục"}
        modalBody={"Bạn có chắc muốn xóa danh mục này?"}
        btnTitle={"Xóa"}
        btnType={"delete"}
        handler={categoryDeleteHandler}
      />
      <table className="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Danh mục cha</th>
            <th className="text-end">Thao tác</th>
          </tr>
        </thead>
        {/* Table Data */}
        <tbody>
          {loading ? (
            <tr className="mb-5 mt-5">
              <Loading />
            </tr>
          ) : error ? (
            <tr>
              <Message variant="alert-danger">{error}</Message>
            </tr>
          ) : (
            category?.map((item, index) => (
              <tr key={item._id}>
                <th>{index + 1}</th>
                <td className="fw-bold">{item.name}</td>
                <td className="fw-bold">{item.parent_category}</td>
                <td className="text-end">
                  <div className="dropdown action__categories">
                    <Link to="#" data-bs-toggle="dropdown">
                      <i
                        className="text-warning fas fa-edit"
                        onClick={() => {
                          handleEditCategory();
                          handleCurrentCategory(index);
                        }}
                      ></i>
                    </Link>
                    <Link data-toggle="modal" data-target="#exampleModalCenter">
                      <i class="text-danger fas fa-trash-alt" onClick={() => setCategoryIdDelete(item._id)}></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default CategoriesTable;
