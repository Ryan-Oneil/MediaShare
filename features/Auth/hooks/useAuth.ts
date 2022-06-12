import React from "react";
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
  const auth = React.useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return auth;
};
