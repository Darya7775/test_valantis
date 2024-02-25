import React from "react";
import type { Goods } from "../../../types";
import "./styles.scss";

interface Props {
  goods: Goods;
}

const List: React.FC<Props> = (props: Props) => {
  return(
    <ul className="list">
      {props.goods.map((good, i) =>
        <li className={`list__item list__item--${i%2 ? "white" : "blue"}`} key={good.id}>
          <span>Наименование: {good.product}</span>
          <span>Цена: {good.price}</span>
          {good.brand && <span>Бренд: {good.brand}</span>}
        </li>)}
    </ul>
  );
};

export default List;
