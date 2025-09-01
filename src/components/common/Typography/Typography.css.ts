import { typography, vars } from "@/styles/theme.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const typographyRecipe = recipe({
  base: {},
  variants: {
    variant: {
      title_01: {
        ...typography.title_01,
      },
      title_02: {
        ...typography.title_02,
      },
      body_01: {
        ...typography.body_01,
      },
    },
    color: {
      primary: {
        color: vars.colors.text.primary,
      },
    },
    wrap: {
      true: {
        textWrap: "wrap",
      },
      false: {
        textWrap: "nowrap",
      },
    },
  },
  defaultVariants: {
    color: "primary",
    variant: "body_01",
    wrap: false,
  },
});

export type TypographyVariants = RecipeVariants<typeof typographyRecipe>;
