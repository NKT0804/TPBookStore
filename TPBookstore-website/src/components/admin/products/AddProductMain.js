import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_FAIL, PRODUCT_CREATE_RESET } from "./../../../Redux/Constants/productConstants";
import { createProductAdmin } from "./../../../Redux/Actions/productActions";
import Toast from "./../../base/LoadingError/Toast";
import Message from "./../../base/LoadingError/Error";
import Loading from "./../../base/LoadingError/Loading";
import { listCategoryAdmin } from "../../../Redux/Actions/categoryActions";
import ReactQuill from "react-quill";
import UploadImage from "./UploadImage";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000
};
const moudules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"]
  ]
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block"
];
const AddProductMain = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(null);
  const [priceSale, setPriceSale] = useState(null);
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [countInStock, setCountInStock] = useState(null);
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [supplier, setSupplier] = useState("");
  const [publishingYear, setPublishingYear] = useState(null);
  const [language, setLanguage] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(null);

  const dispatch = useDispatch();

  const productCreateAdmin = useSelector((state) => state.productCreateAdmin);
  const { loading, error, product } = productCreateAdmin;

  const categoryListAdmin = useSelector((state) => state.categoryListAdmin);
  const { category: categoryAddProduct } = categoryListAdmin;

  useEffect(() => {
    dispatch(listCategoryAdmin());
    if (product) {
      toast.success("Thêm sách thành công!", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName("");
      setDescription("");
      setCountInStock(null);
      setImage("");
      setAuthor("");
      setPrice(null);
      setPriceSale(null);
      setPublisher("");
      setSupplier("");
      setPublishingYear(null);
      setLanguage("");
      setNumberOfPages(null);
    }
  }, [product, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (price >= 0 && countInStock >= 0) {
      const product = new FormData();
      product.append("name", name);
      product.append("price", price);
      product.append("priceSale", priceSale);
      product.append("description", description);
      product.append("author", author);
      product.append("image", JSON.stringify(image));
      product.append("countInStock", countInStock);
      product.append("category", category);
      product.append("publisher", publisher);
      product.append("supplier", supplier);
      product.append("publishingYear", publishingYear);
      product.append("language", language);
      product.append("numberOfPages", numberOfPages);
      dispatch(createProductAdmin(product));
    } else {
      dispatch({ type: PRODUCT_CREATE_FAIL });
      toast.error("Thêm sách không thành công!", ToastObjects);
    }
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/admin/products" className="btn btn-primary text-white btn-size">
              Quản lý sản phẩm
            </Link>
            <h2 className="content-title">Sản phẩm mới</h2>
            <div>
              <button type="submit" className="btn btn-primary btn-size">
                Hoàn thành
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}

                  <div className="row mb-4">
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_title" className="form-label">
                        Tên sách
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập tên sách"
                        className="form-control"
                        id="product_title"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_author" className="form-label">
                        Tác giả
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập Tác giả"
                        className="form-control"
                        id="product_author"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_publisher" className="form-label">
                        Nhà xuất bản
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập Nhà xuất bản"
                        className="form-control"
                        id="product_publisher"
                        required
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_supplier" className="form-label">
                        Nhà cung cấp
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập Nhà cung cấp"
                        className="form-control"
                        id="product_supplier"
                        required
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_price" className="form-label">
                        Năm xuất bản
                      </label>
                      <input
                        type="number"
                        placeholder="Nhập năm xuất bản"
                        className="form-control"
                        id="product_price"
                        required
                        value={publishingYear}
                        onChange={(e) => setPublishingYear(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_price_sale" className="form-label">
                        Số trang
                      </label>
                      <input
                        type="number"
                        placeholder="Nhập số trang"
                        className="form-control"
                        id="product_price_sale"
                        required
                        value={numberOfPages}
                        onChange={(e) => setNumberOfPages(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="category_title" className="form-label">
                        Danh mục
                      </label>
                      <select id="category_title" className="form-select" onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Chọn danh mục</option>
                        {categoryAddProduct &&
                          categoryAddProduct.map((category, index) => (
                            <option key={index} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_count_in_stock" className="form-label">
                        Số lượng sản phẩm trong kho
                      </label>
                      <input
                        type="number"
                        placeholder="Số lượng"
                        className="form-control"
                        id="product_count_in_stock"
                        required
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 mb-2">
                      <label htmlFor="product_price" className="form-label">
                        Giá sản phẩm
                      </label>
                      <input
                        type="number"
                        placeholder="0 đ"
                        className="form-control"
                        id="product_price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-2">
                      <label htmlFor="product_price_sale" className="form-label">
                        Giá đã giảm
                      </label>
                      <input
                        type="number"
                        placeholder="0 đ"
                        className="form-control"
                        id="product_price_sale"
                        required
                        value={priceSale}
                        onChange={(e) => setPriceSale(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 mb-2">
                      <label htmlFor="product_author" className="form-label">
                        Ngôn ngữ
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập ngôn ngữ"
                        className="form-control"
                        id="product_author"
                        required
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                  </div>

                  {/*image */}
                  <div className="row mb-4">
                    <label className="form-label">Mô tả</label>
                    <ReactQuill
                      placeholder="Nhập mô tả sản phẩm"
                      className="form-control text-align-content input-description"
                      moudules={moudules}
                      formats={formats}
                      required
                      value={description}
                      onChange={(value) => setDescription(value)}
                    />
                    <div className="col-lg-12 col-md-7 mt-4">
                      <label className="form-label">Hình ảnh sản phẩm</label>
                      <UploadImage setImage={(value) => setImage(value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
