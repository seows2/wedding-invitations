import {
  createTheme,
  createThemeContract,
  CSSProperties,
} from "@vanilla-extract/css";

export type Space = keyof typeof vars.space;

export const vars = createThemeContract({
  colors: {
    text: {
      primary: null,
    },
    background: {
      ["01"]: null,
      ["02"]: null,
    },
    border: {
      ["01"]: null,
    },
  },
  space: {
    none: null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
});

export const theme = createTheme(vars, {
  colors: {
    background: {
      "01": "#fffdf9",
      "02": "#fcd8ba",
    },
    text: {
      primary: "#202121",
    },
    border: {
      "01": "#DEDFE2",
    },
  },
  space: {
    none: "0",
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
});

export const typography = {
  title_01: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "24px",
  },
  title_02: {
    fontSize: "30px",
    fontWeight: 500,
    lineHeight: "24px",
  },
  body_01: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
  },
} as const satisfies Record<string, CSSProperties>;
