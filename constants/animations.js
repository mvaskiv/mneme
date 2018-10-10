import { LayoutAnimation } from 'react-native';

export const ListItemAnimation = {
    duration: 175,
    create: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear,
    },
    update: {
      property: LayoutAnimation.Properties.scaleXY,
      type: LayoutAnimation.Types.linear,
    },
    delete: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear,
    },
  }
export const SwipeItemAnimation = {
    duration: 235,
    create: {
      property: LayoutAnimation.Properties.scaleXY,
      type: LayoutAnimation.Types.linear,
    },
    update: {
      property: LayoutAnimation.Properties.scaleXY,
      type: LayoutAnimation.Types.linear,
    },
    delete: {
      property: LayoutAnimation.Properties.scaleXY,
      type: LayoutAnimation.Types.linear,
    },
  }