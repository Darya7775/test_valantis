import { Goods } from "../types";

export const filterSimilarIds = (goods: Goods) => {
  let lastId = "";
  let filterGoods: Goods = [];

  for(let i = 0; i < goods.length; i++) {
    if(lastId === goods[i].id) {
      lastId = goods[i].id;
      continue;
    }
    filterGoods.push(goods[i]);
    lastId = goods[i].id;
  }

  return filterGoods;
};
