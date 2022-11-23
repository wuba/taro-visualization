import type { AnimatedLottieViewProps } from 'lottie-react-native';
import type AnimatedLottieView from 'lottie-react-native';
import { ComponentType, Ref } from 'react';

interface LottieViewProps extends AnimatedLottieViewProps {
  ref: Ref<LottieView>;
}

interface LottieView extends AnimatedLottieView {
  init(): Promise<boolean>;
}

let implementation;
if (process.env.TARO_ENV === 'weapp') {
  implementation = require('./lib/mp');
} else if (process.env.TARO_ENV === 'h5') {
  implementation = require('./lib/web');
} else {
  implementation = require('./lib/rn');
}
const lottie: ComponentType<LottieViewProps> =
  implementation.default || implementation;
export type LottieViewType = LottieView;
export default lottie;
