import type { ComponentPropsWithoutRef, ElementType } from "react";
import * as S from "./Typography.css";

type TypographyOwnProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
} & S.TypographyVariants;

type TypographyProps<T extends ElementType = "div"> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T> | "className">;

export const Typography = (props: TypographyProps) => {
  const { as, children, color, variant, wrap, ...rest } = props;
  const Component = as || "div";

  return (
    <Component
      className={S.typographyRecipe({ color, variant, wrap })}
      {...rest}
    >
      {children}
    </Component>
  );
};
