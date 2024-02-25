import React from "react";
import "./styles.scss";

interface Props {
  text: string,
  size?: string
}

const Spinner: React.FC<Props> = ({ text = "", size = "5em" }: Props) => {
  const header = text ? <h4>{text}</h4> : null;
  return (
    <div className="spinner">
      {header}
      <div className="spinner__loader" style={{ height: size, width: size }} />
    </div>
  );
};

export default Spinner;
