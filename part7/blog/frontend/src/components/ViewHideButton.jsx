import { useState, forwardRef, useImperativeHandle } from "react";
import propTypes from "prop-types";

const ViewHideButton = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        {props.children}
      </div>
    </div>
  );
});

ViewHideButton.propTypes = {
  buttonLabel: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
};

ViewHideButton.displayName = "ViewHideButton";

export default ViewHideButton;
