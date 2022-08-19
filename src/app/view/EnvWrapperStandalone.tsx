import React from "react";

import { EnsureLogin } from "./login";

export const EnvWrapperStandalone = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EnsureLogin>
      <div className="App">
        <header className="App-header">Standalone masthead</header>
        {children}
      </div>
    </EnsureLogin>
  );
};
