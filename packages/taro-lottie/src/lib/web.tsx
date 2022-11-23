import type { AnimatedLottieViewProps } from 'lottie-react-native';
import lottie from 'lottie-web';
import React, { Component } from 'react';

interface LottieViewState {
  inited: boolean;
}

class LottieView extends Component<AnimatedLottieViewProps, LottieViewState> {
  el = null;
  animation = null;
  static defaultProps = {
    loop: true,
    autoPlay: false,
    speed: 1,
    style: {
      width: 100,
      height: 100,
    },
  };
  componentWillUnmount() {
    this.props.onAnimationFinish &&
      this.animation.removeEventListener(
        'complete',
        this.props.onAnimationFinish
      );
    this.animation.destroy();
  }
  componentDidUpdate(prevProps): void {
    const { progress, speed } = this.props;
    if (prevProps.progress !== progress) {
      this.animation.goToAndPlay(
        progress * this.animation.getDuration(true),
        true
      );
    }
    if (prevProps.speed !== speed) {
      this.setSpeed();
    }
  }
  play(startFrame?: number, endFrame?: number) {
    if (startFrame === undefined || endFrame === undefined) {
      this.animation.play();
    } else {
      this.animation.playSegments([startFrame, endFrame], true);
    }
  }
  setSpeed() {
    const { speed } = this.props;
    this.animation.setSpeed(Math.abs(speed));
    this.animation.setDirection(speed > 0 ? 1 : -1);
  }
  resume() {
    this.animation.play();
  }
  reset() {
    this.animation.goToAndPlay(0, true);
  }
  pause() {
    this.animation.pause();
  }
  componentDidMount() {
    const { source, autoPlay, loop, onAnimationFinish } = this.props;
    this.animation = lottie.loadAnimation({
      animationData: source,
      autoplay: autoPlay,
      loop,
      container: this.el,
    });
    onAnimationFinish &&
      this.animation.addEventListener('complete', onAnimationFinish);
    this.setSpeed();
  }
  init() {
    return Promise.resolve(true);
  }
  render() {
    const { style } = this.props;
    return (
      <div
        style={style}
        ref={(c) => {
          this.el = c;
        }}
      />
    );
  }
}

export default LottieView;
