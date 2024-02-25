"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../../lib/hooks";
import { fetchGoodsFilter, addCurrentPage, getIds, resetParams, setPriceParam, setProductParam, setBrandParam } from "../../../lib/slices/goods";
import "./styles.scss";

interface Props {
  price: string;
  product: string;
  brand: string;
}

type FormValuesPrice = {
  price: string;
}

type FormValuesProduct = {
  product: string;
}

type FormValuesBrand = {
  brand: string;
}

const Form: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();

  const { register: registerPrice, handleSubmit: handleSubmitPrice, formState: formStatePrice, reset: resetPrice } = useForm<FormValuesPrice>();
  const { isValid: isValidPrice, isSubmitting: isSubmittingPrice } = formStatePrice;

  const { register: registerProduct, handleSubmit: handleSubmitProduct, formState: formStateProduct, reset: resetProduct} = useForm<FormValuesProduct>();
  const { isValid: isValidProduct, isSubmitting: isSubmittingProduct } = formStateProduct;

  const { register: registerBrand, handleSubmit: handleSubmitBrand, formState: formStateBrand, reset: resetBrand} = useForm<FormValuesBrand>();
  const { isValid: isValidBrand, isSubmitting: isSubmittingBrand } = formStateBrand;

  const callbacks = {
    onSubmitPrice: async (price: FormValuesPrice) => {
      dispatch(addCurrentPage(1));
      dispatch(setPriceParam(price.price));
      const res = await dispatch(fetchGoodsFilter({ price: Number(price.price) }));
      resetPrice();
      if(res.meta.requestStatus === "rejected") {
        await dispatch(fetchGoodsFilter({ price: Number(price.price) }));
      }
    },
    onSubmitProduct: async (product: FormValuesProduct) => {
      dispatch(addCurrentPage(1));
      dispatch(setProductParam(product.product));
      const res = await dispatch(fetchGoodsFilter({ product: product.product }));
      resetProduct();
      if(res.meta.requestStatus === "rejected") {
        await dispatch(fetchGoodsFilter({ product: product.product }));
      }
    },
    onSubmitBrand: async (brand: FormValuesBrand) => {
      dispatch(addCurrentPage(1));
      dispatch(setBrandParam(brand.brand));
      const res = await dispatch(fetchGoodsFilter({ brand: brand.brand }));
      resetBrand();
      if(res.meta.requestStatus === "rejected") {
        await dispatch(fetchGoodsFilter({ brand: brand.brand }));
      }
    },
    onResetParams: async() => {
      dispatch(resetParams());
      const res = await dispatch(getIds({ offset: 0, page: 1, replaceHistory: true }));
      if(res.meta.requestStatus === "rejected") {
        await dispatch(getIds({ offset: 0, page: 1, replaceHistory: true }));
      }
    }
  }
  return(
    <div className="form">
      <form className="form__form" method="POST" onSubmit={handleSubmitPrice(callbacks.onSubmitPrice)} noValidate>
        <div className="form__wrap-input">
          <label htmlFor="price">Цена</label>
          <input type="text" id="price" placeholder="1000" aria-label="Введите цену"
            {...registerPrice("price", {
              required: true,
              min: 4,
              maxLength: 20,
              pattern: {
                value: /^[0-9]*$/,
                message: "1000"
              }
            })} />
        </div>
        <button className="form__button" type="submit" disabled={!isValidPrice || isSubmittingPrice}>Применить</button>
      </form>

      <form className="form__form" method="POST" onSubmit={handleSubmitProduct(callbacks.onSubmitProduct)} noValidate>
        <div className="form__wrap-input">
          <label htmlFor="product">Название товара</label>
          <input type="text" id="product" placeholder="кольцо" aria-label="Введите название товара"
            {...registerProduct("product", {
              required: true,
              min: 2,
              maxLength: 100,
              pattern: {
                value: /^[а-яА-Яa-zA-Z0-9 ]*$/,
                message: "кольцо"
              }
            })} />
        </div>
        <button className="form__button" type="submit" disabled={!isValidProduct || isSubmittingProduct}>Применить</button>
      </form>

      <form className="form__form" method="POST" onSubmit={handleSubmitBrand(callbacks.onSubmitBrand)} noValidate>
        <div className="form__wrap-input">
          <label htmlFor="brand">Бренд</label>
          <input type="text" id="brand" placeholder="Piaget" aria-label="Введите название товара"
            {...registerBrand("brand", {
              required: true,
              min: 2,
              maxLength: 100,
              pattern: {
                value: /^[a-zA-Z0-9 ]*$/,
                message: "Piaget"
              }
            })} />
        </div>
        <button className="form__button" type="submit" disabled={!isValidBrand || isSubmittingBrand}>Применить</button>
      </form>
      <button className="form__button" type="button" onClick={callbacks.onResetParams}>Сбросить параметры</button>
    </div>
  );
};

export default Form;
