"use client"

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import { getIds, addCurrentPage, fetchGoodsFilter } from "./lib/slices/goods";
import type { Goods } from "./types";
import Form from "./ui/main/form";
import Pagination from "./ui/components/pagination";
import List from "./ui/main/list";
import Spinner from "./ui/components/spinner";

const Page: React.FC = () => {
  const dispatch = useAppDispatch();

  const goods: Goods = useAppSelector(state => state.goodsSlice.entities);
  const status = useAppSelector(state => state.goodsSlice.status);
  const error = useAppSelector(state => state.goodsSlice.error);
  const page = useAppSelector(state => state.goodsSlice.params.page);
  const price = useAppSelector(state => state.goodsSlice.params.price);
  const product = useAppSelector(state => state.goodsSlice.params.product);
  const brand = useAppSelector(state => state.goodsSlice.params.brand);

  useEffect(() => {
    (async() => {
      if(price || product || brand) { // если есть price или product или brand, отправляем запрос фильтра
        if(price) {
          await dispatch(fetchGoodsFilter({ price: Number(price) }));
        }
        if(product) {
          await dispatch(fetchGoodsFilter({ product }));
        }
        if(brand) {
          await dispatch(fetchGoodsFilter({ brand }));
        }
      } else { // если нет - обычный запрос
        const res = await dispatch(getIds({ offset: (page - 1) * 50, page: page, replaceHistory: true }));
        if(res.meta.requestStatus === "rejected") {
          await dispatch(getIds({ offset: (page - 1) * 50, page: page, replaceHistory: true }));
        }
      }
    })();
  }, []);

  const callbacks = {
    getLIst: async (page: number) => {
      const res = await dispatch(getIds({ offset: (page - 1) * 50, page: page, replaceHistory: false }));
      if(res.meta.requestStatus === "rejected") {
        await dispatch(getIds({ offset: (page - 1) * 50, page: page, replaceHistory: false }));
      }
      dispatch(addCurrentPage(page));
    }
  }

  let content: React.ReactElement;
  if(status === "loading") {
    content = <Spinner text="Загрузка" />;
  } else if(status === "succeeded") {
    content = goods.length
      ? <>
          <List goods={goods} />
          <Pagination count={(price || product || brand) ? 1 : Math.ceil(8001 / 50)} onhandler={callbacks.getLIst} currentPage={page} />
        </>
      : <p>ничего не найдено</p>;
  } else if(status === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <main className="main">
      <Form price={price} product={product} brand={brand} />
      {content}
    </main>
  );
}

export default Page;
