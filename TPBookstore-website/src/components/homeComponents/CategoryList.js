import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

const CategoryList = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const { category } = categoryList;

  return (
    <div className="col-md-1 icon__menu-product ">
      <i class="far fa-bars"></i>
      <div className="list-category-header">
        <div className="row py-2">
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Văn học</span>
            {category?.map((item) =>
              item.parent_category === "Văn học" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Kinh tế</span>
            {category?.map((item) =>
              item.parent_category === "Kinh tế" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Tâm lý-Kĩ năng sống</span>
            {category?.map((item) =>
              item.parent_category === "Tâm lý-Kĩ năng sống" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Nuôi dạy con</span>
            {category?.map((item) =>
              item.parent_category === "Nuôi dạy con" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}
          </div>
        </div>
        <div className="row py-2">
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Sách thiếu nhi</span>
            {category?.map((item) =>
              item.parent_category === "Sách thiếu nhi" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Tiểu sử-Hồi ký</span>
            {category?.map((item) =>
              item.parent_category === "Tiểu sử-Hồi ký" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}{" "}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Giáo khoa-Tham khảo</span>
            {category?.map((item) =>
              item.parent_category === "Giáo khoa-Tham khảo" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}{" "}
          </div>
          <div className="col-3 list-category-header-item">
            <span className="list-category-header-item__title">Sách học ngoại ngữ</span>
            {category?.map((item) =>
              item.parent_category === "Sách học ngoại ngữ" ? (
                <p className="list-category-header-item__link">{item.name}</p>
              ) : (
                <></>
              )
            )}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;