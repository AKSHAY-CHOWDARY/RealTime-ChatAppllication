import React from "react";

const BoxComponent = () => {
  const boxStyle = {
    width: "100%",
    height: "100%",
    "--s": "200px", /* This won't work with inline styles, so it's omitted */
    "--c1": "#f7f4e9",
    "--c2": "#051622",
    "--c3": "#1ba098",
    background: `repeating-conic-gradient(
        from 30deg,
        #0000 0 120deg,
        var(--c3) 0 180deg
      )
      calc(0.5 * var(--s)) calc(0.5 * var(--s) * 0.577),
      repeating-conic-gradient(
        from 30deg,
        var(--c1) 0 60deg,
        var(--c2) 0 120deg,
        var(--c3) 0 180deg
      )`,
    backgroundSize: "var(--s) calc(var(--s) * 0.577)",
  };

  return <div style={boxStyle}></div>;
};

export default BoxComponent;
