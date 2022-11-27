import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Pagination from "./pagination";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../Redux/Actions/productActions";
import Message from "./../base/LoadingError/Error";
import Filter from "../../screens/Filter";
import { listCategory } from "../../Redux/Actions/categoryActions";
import CardProductLoading from "../base/LoadingError/CardProductLoading";
import SortBy from "./SortBy";
import Limit from "./Limit";
import formatCash from "../../utils/formatCash";

const ShopSection = (props) => {
  const { keyword, pageNumber, isFilter, setIsFilter } = props;
  const dispatch = useDispatch();

  const [categoryFilter, setCategoryFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [minPrice, setMinPriceInput] = useState("");
  const [maxPrice, setMaxPriceInput] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const { category } = categoryList;

  const CategoryList = () => {
    const dispatch = useDispatch();
    const categoryList = useSelector((state) => state.categoryList);
    const { category } = categoryList;

    useEffect(() => {
      dispatch(listCategory());
    }, [dispatch]);
  };

  // const checkNameCategory = (item) => item.name === categoryFilter;
  // const nameCate = category?.find(checkNameCategory)?.name;
  const checkIsFilter = useCallback(() => {
    if (categoryFilter !== "" || ratingFilter !== "" || maxPrice > 0) {
      setIsFilter(true);
    } else {
      return isFilter;
    }
  }, [categoryFilter, ratingFilter, maxPrice, isFilter, setIsFilter]);

  const loadData = useCallback(() => {
    dispatch(listProducts(keyword, pageNumber, categoryFilter, ratingFilter, minPrice, maxPrice, sortBy, limit));
    dispatch(listCategory());
  }, [dispatch, keyword, pageNumber, categoryFilter, ratingFilter, minPrice, maxPrice, , sortBy, limit]);

  useEffect(() => {
    loadData();
    checkIsFilter();
  }, [loadData, checkIsFilter]);
  const [activeId, setActiveId] = useState();
  return (
    <>
      <div className="container all-products">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12  article">
              <div className="shopcontainer">
                {/* list category */}
                <ul className="list__category">
                  {category?.map((item) => (
                    <div className="list__category-item">
                      <li
                        className={
                          activeId === item._id ? "list__category-name active" : "list__category-name inactive"
                        }
                        onClick={() => setActiveId(item._id)}
                      >
                        {item.name}
                      </li>
                    </div>
                  ))}
                </ul>

                {/* Search and products quantity */}
                {/* <div className="search__category row">
                  <div className="col-lg-6">
                    <SortBy sortBy={sortBy} setSortBy={setSortBy} />
                  </div>
                  <div className="col-lg-6">
                    <Limit limit={limit} setLimit={setLimit} />
                  </div>
                </div> */}

                {/* Show products */}
                <div className="row justify-content-center mx-0 col-lg-12 col-md-12 col-12">
                  {/* Filter */}
                  {/* <div className="find-product col-lg-2 col-md-4 col-3 pc-header">
                    <Filter
                      category={category}
                      categoryFilter={categoryFilter}
                      setCategoryFilter={setCategoryFilter}
                      ratingFilter={ratingFilter}
                      setRatingFilter={setRatingFilter}
                      setMinPriceInput={setMinPriceInput}
                      setMaxPriceInput={setMaxPriceInput}
                    />
                  </div> */}

                  {/* Show all products */}
                  <div className="col-lg-12 col-md-12 col-9 row product-container ">
                    {loading ? (
                      products?.map((product) => {
                        return (
                          <div className="l-2-4" aria-hidden="true" key={product._id}>
                            <div className="shadow p-3 mb-4 bg-body rounded">
                              <CardProductLoading />
                            </div>
                          </div>
                        );
                      })
                    ) : error ? (
                      <Message variant="alert-danger">{error}</Message>
                    ) : (
                      products?.map((product) => (
                        <div className="l-2-4 col-md-4 c-6" key={product._id}>
                          <div className="shadow p-3 mb-4 bg-body border border-1 rounded">
                            <Link to={`/product/${product.slug}`}>
                              <div className="shopBack main-effect">
                                <img className="main-scale" src={product.image} alt={product.name} />
                              </div>
                            </Link>

                            <div className="shoptext">
                              <p className="shoptext__name">
                                <Link to={`/product/${product.slug}`}>
                                  {product.name.length >= 55 ? `${product.name.slice(0, 55)}...` : ` ${product.name}`}
                                </Link>
                              </p>

                              <Rating value={product.rating} numRating={product.rating} />
                              {/* Price PC */}
                              <div className="shoptext__price">
                                <p className="shoptext__price-special">
                                  <span className="shoptext__price-special-new">{formatCash(product.priceSale)}</span>
                                  {product.priceSale < product.price ? (
                                    <p className="shoptext__price-old mx-1">{formatCash(product.price)}</p>
                                  ) : (
                                    <></>
                                  )}
                                  {product.priceSale < product.price ? (
                                    <span className="shoptext__price-special-discount">
                                      -{Math.round(100 - (product.priceSale / product.price) * 100)}%
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </p>
                              </div>

                              {/* Price Mobile */}
                              <div className="shoptext__price__mobile">
                                <p className="shoptext__price-special">
                                  <span className="shoptext__price-special-new">{formatCash(product.priceSale)}</span>

                                  {product.priceSale < product.price ? (
                                    <span className="shoptext__price-special-discount">
                                      -{Math.round(100 - (product.priceSale / product.price) * 100)}%
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </p>
                                {product.priceSale < product.price ? (
                                  <p className="shoptext__price-old mx-1">{formatCash(product.price)}</p>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: "12px" }}>
                  <Link to="/products">
                    <button
                      type="button"
                      style={{
                        textAlign: "center",
                        border: "#4ac4fa solid 3px",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        backgroundColor: "white"
                      }}
                    >
                      Xem thêm
                    </button>
                  </Link>
                </div>

                {/* Pagination */}
                {/* <Pagination page={page} pages={pages} keyword={keyword ? keyword : ""} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
