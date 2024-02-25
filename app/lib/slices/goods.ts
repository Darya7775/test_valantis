import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import md5Hash from "../hash";
import type { Goods } from "../../types";
import { filterSimilarIds } from "../utils";

const getInitState = () => {
  const state = {
    status: "idle",
    entities: [],
    params: {
      price: "",
      product: "",
      brand: "",
      page: 1
    },
    error: ""
  };

  if(typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("price")) state.params.price = urlParams.get("price") || "";
    if(urlParams.has("product")) state.params.product = urlParams.get("product") || "";
    if(urlParams.has("brand")) state.params.brand= urlParams.get("brand") || "";
    if(urlParams.has("page")) state.params.page = Number(urlParams.get("page")) || 1;
  }

  return state;
};

const initialState = getInitState();

const fetchGoods = async(ids: string[]): Promise<Goods> => {
  const response = await fetch("https://api.valantis.store:41000/",
    {
      method: "POST",
      headers: {
        "X-Auth": md5Hash,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "get_items",
        params: {"ids": ids}
      })
    }
  );

  if (response.ok) {
    const data: { result: Goods } = await response.json();
    return data.result;
  } else {
    const error = await response.json();
    console.log("fetchGoods", error.detail);
    throw new Error(error.detail);
  }
};

export const getIds = createAsyncThunk("goods/getIds", async(params: { offset: number, page: number, replaceHistory: boolean }) => {
  // Сохранить параметры в адрес страницы
  const url = `/?page=${params.page}${window.location.hash}`;
  if(params.replaceHistory) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }

  const response = await fetch("https://api.valantis.store:41000/",
    {
      method: "POST",
      headers: {
        "X-Auth": md5Hash,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "action": "get_ids",
        "params": {"offset": params.offset, "limit": 50}
      })
    }
  );

  if (response.ok) {
    const data = await response.json();
    const goods = await fetchGoods(data.result);
    return filterSimilarIds(goods);
  } else {
    const error = await response.json();
    console.log("getIds", error.detail);
    throw new Error(error.detail);
  }
});

export const fetchGoodsFilter = createAsyncThunk("goods/filter", async(param: {[key: string]: string | number}) => {
  // Сохранить параметры в адрес страницы
  const urlSearch = `${(param.price && `price=${param.price}`) || (param.product && `product=${param.product}`) || (param.brand && `brand=${param.brand}`)}`;
  const url = `/${(urlSearch ? `?${urlSearch}`: "")}${window.location.hash}`;
  window.history.replaceState({}, "", url);

  const response = await fetch("https://api.valantis.store:41000/",
    {
      method: "POST",
      headers: {
        "X-Auth": md5Hash,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "filter",
        params: param
      })
    }
  );

  if (response.ok) {
    const data = await response.json();
    const goods = await fetchGoods(data.result);
    return filterSimilarIds(goods.slice(0, 100));
  } else {
    const error = await response.json();
    console.log("fetchGoodsFilter", error.detail);
    throw new Error(error.detail);
  }
});

const goodsSlice = createSlice({
  name: "goods",
  initialState,
  reducers: {
    addCurrentPage: (state, action: PayloadAction<number>) => {
      state.params.page = action.payload;
    },
    setPriceParam: (state, action: PayloadAction<string>) => {
      state.params.price = action.payload;
    },
    setProductParam: (state, action: PayloadAction<string>) => {
      state.params.product = action.payload;
    },
    setBrandParam: (state, action: PayloadAction<string>) => {
      state.params.brand = action.payload;
    },
    resetParams: (state) => {
      state.params.page = 1;
      state.params.brand = "";
      state.params.price = "";
      state.params.product = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getIds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getIds.fulfilled, (state, action: PayloadAction<Goods>) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(getIds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchGoodsFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoodsFilter.fulfilled, (state, action: PayloadAction<Goods>) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchGoodsFilter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  }
});

export default goodsSlice.reducer;

export const { addCurrentPage, resetParams, setPriceParam, setProductParam, setBrandParam } = goodsSlice.actions;
