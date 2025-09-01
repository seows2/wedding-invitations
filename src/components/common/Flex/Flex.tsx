import { Space } from "@/styles/theme.css";
import * as S from "./Flex.css";

type Align = "baseline" | "center" | "flex-end" | "flex-start";

type Justify =
  | "space-evenly"
  | "space-around"
  | "space-between"
  | "center"
  | "flex-end"
  | "flex-start";

type FlexProps = {
  justify?: Justify;
  align?: Align;
  gap?: Space;
  vertical?: boolean;
  children: React.ReactNode;
};

export const Flex = (props: FlexProps) => {
  const { justify, align, vertical, gap, children } = props;

  return (
    <div className={S.Flex({ align, justify, vertical, gap })}>{children}</div>
  );
};
