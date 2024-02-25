"use client"

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./lib/store";

interface Props {
  children: React.ReactNode
}

const StoreProvider: React.FC<Props> = ({children}: Props) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
