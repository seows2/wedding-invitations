import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("html, body", {
  height: "100%",
});

globalStyle("body", {
  fontFamily: "sans-serif",
  fontSize: "16px",
  fontWeight: "normal",
  fontStyle: "normal",
});

globalStyle(".bg", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom center",
  backgroundSize: "100%",
});
