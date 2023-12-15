import { EButtonType } from "./enum";

export const getButtonExtraClassName = (buttonType: EButtonType) => {
  switch (buttonType) {
    case EButtonType.OUTLINED:
      return "button-outlined";
    case EButtonType.PRIMARY_BLACK:
      return "button-primary-black";
    case EButtonType.PRIMARY_LIME:
      return "button-primary-lime";
    case EButtonType.PRIMARY_WHITE:
      return "button-primary-white";
  }
};
