import React from "react";
import "../app/ui/scss/global-styles.scss";
import StoreProvider from "./Provides";

interface Props {
  children: React.ReactNode
}

const RootLayout: React.FC<Props> = ({children}: Props) => {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="test valantis" />
        <title>test valantis</title>
      </head>
      <body>
        <StoreProvider>
          <div id="root">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}

export default RootLayout;
