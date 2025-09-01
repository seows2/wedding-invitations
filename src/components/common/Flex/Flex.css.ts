import { vars } from "@/styles/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const Flex = recipe({
  base: {
    display: "flex",
  },
  variants: {
    align: {
      ["flex-start"]: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      ["flex-end"]: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" },
      baseline: { alignItems: "baseline" },
    },
    justify: {
      ["flex-start"]: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      ["flex-end"]: { justifyContent: "flex-end" },
      ["space-between"]: { justifyContent: "space-between" },
      ["space-around"]: { justifyContent: "space-around" },
      ["space-evenly"]: { justifyContent: "space-evenly" },
    },
    vertical: {
      false: { flexDirection: "row" },
      true: { flexDirection: "column" },
    },
    wrap: {
      wrap: { flexWrap: "wrap" },
      nowrap: { flexWrap: "nowrap" },
    },
    gap: {
      none: { gap: vars.space.none },
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },
  },
  defaultVariants: {
    align: "center",
    justify: "center",
    wrap: "nowrap",
    vertical: false,
  },
});
