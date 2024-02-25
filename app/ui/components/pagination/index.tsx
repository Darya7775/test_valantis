import React from "react";
import "./styles.scss";

interface Props {
  count: number,
  onhandler: (number: number) => void,
  currentPage: number,
}

const Pagination: React.FC<Props> = (props: Props) => {
  const NUMBERS_OF_PAGES = 500;
  const NUMBERS_OF_VISIBLE_PAGES = 2;

  // ограничение на количество страниц <= 500
  const count = props.count > NUMBERS_OF_PAGES ? NUMBERS_OF_PAGES : props.count;

  // Номера слева и справа относительно активного номера, которые остаются видимыми
  let left = Math.max(props.currentPage - 1, 1);
  const right = Math.min(left + 1 * NUMBERS_OF_VISIBLE_PAGES, count);
  // Корректировка когда страница в конце
  left = Math.max(right - 1 * NUMBERS_OF_VISIBLE_PAGES, 1);

  // Массив номеров, чтобы удобней рендерить
  const items = [];
  // Первая страница всегда нужна
  if (left > 1) items.push(1);
  // Пропуск
  if (left > NUMBERS_OF_VISIBLE_PAGES) items.push(null);
  // Последовательность страниц
  for (let page = left; page <= right; page++) items.push(page);
  // Пропуск
  if (right < count - 1) items.push(null);
  // Последняя страница
  if (right < count) items.push(count);

  const onClickHandler = (number: number) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.onhandler(number);
  };

  return(
    <div className="pagination">
      <ul className="pagination__list">
        {items.map((number, index) => (
          <li key={index}>
            {number
              ? (number === props.currentPage
                ? (<button className="pagination__link pagination__link--active" onClick={onClickHandler(number)}>{number}</button>)
                : (<button className="pagination__link" onClick={onClickHandler(number)}>{number}</button>) )
              : ("...")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
