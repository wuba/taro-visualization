import { Canvas } from '@tarojs/components';
import { createSelectorQuery, getSystemInfoSync } from '@tarojs/taro';
import lottie from 'lottie-miniprogram';
import type { AnimatedLottieViewProps } from 'lottie-react-native';
import React, { Component } from 'react';

let i = 0;
interface LottieViewState {
  inited: boolean;
}

class LottieView extends Component<AnimatedLottieViewProps, LottieViewState> {
  constructor(props) {
    super(props);
  }
  id = `lottie-${i++}`;
  animation;
  inited = false;
  static state = {
    inited: false,
  };
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
    this.animation?.destroy();
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
  init() {
    return new Promise((resolve, reject) => {
      if (this.inited) {
        resolve(this.inited);
      } else {
        const {
          source,
          loop,
          autoPlay,
          style: { width, height },
          onAnimationFinish,
        } = this.props;
        createSelectorQuery()
          .select(`#${this.id}`)
          .node((res) => {
            try {
              const canvas = res.node;
              const context = canvas.getContext('2d');
              // scale canvas to adapt dpr
              const dpr = getSystemInfoSync().pixelRatio;
              canvas.width = parseFloat(width) * dpr;
              canvas.height = parseFloat(height) * dpr;
              context.scale(dpr, dpr);
              lottie.setup(canvas);
              this.animation = lottie.loadAnimation({
                animationData: source,
                loop,
                autoplay: autoPlay,
                rendererSettings: {
                  context,
                },
              });
              onAnimationFinish &&
                this.animation.addEventListener('complete', onAnimationFinish);
              this.setSpeed();
              this.inited = true;
              resolve(this.inited);
            } catch (error) {
              reject(error);
            }
          })
          .exec();
      }
    });
  }
  render() {
    const { style } = this.props;
    return <Canvas type="2d" id={this.id} style={style} />;
  }
}

export default LottieView;
