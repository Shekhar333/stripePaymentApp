import React from "react";

function Container({ className, children }) {
  return (
    <div className={"  min-w-full min-h-[100vh] " + className}>{children}</div>
  );
}

export default Container;
