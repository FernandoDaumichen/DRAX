import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center">
      <CircularProgress style={{ color: "#a5b4fc" }} />
    </div>
  );
};

export default LoadingIndicator;
