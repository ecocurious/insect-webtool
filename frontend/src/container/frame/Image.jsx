import React from "react";

const Image = ({ url, classes, setSize }) => {
  const img = React.createRef();
  return (
    <img
      ref={img}
      className={classes.img}
      src={url}
      onLoad={() => {
        const rect = img.current.getBoundingClientRect();
        setSize({
          height: img.current.height,
          width: img.current.width,
          left: rect.left,
          top: rect.top
        });
      }}
    />
  );
};

export default Image;
