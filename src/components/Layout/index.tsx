import React from "react";
import Navbar from "../Navbar";
import { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default Layout;
