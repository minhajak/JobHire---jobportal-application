import React from "react";
import type { LoadingProps } from "../../lib/types/types";


const Loading: React.FC<LoadingProps> = ({ loading, ...rest }) => {
  if (loading) {
    return <div>{rest.message ?? "Loading..."}</div>;
  }
};

export default Loading;
