# taro-lottie

Lottie component for Taro, reference [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) add web and miniprogram support, base on [lottie-web](https://github.com/airbnb/lottie-web) and [lottie-miniprogram](https://github.com/wechat-miniprogram/lottie-miniprogram).

## Installing

```
yarn add taro-lottie
```

### Extra Installing For React Native

Install `lottie-react-native` (latest) and `lottie-ios` (3.4.0):

```
yarn add lottie-react-native
yarn add lottie-ios@3.4.0
```

Go to your ios folder and run:

```
pod install
```

## Basic Usage

```tsx
import LottieView, { LottieViewType } from 'taro-lottie'
import lottieData from './lottieData.json'

export default class Lottie extends Component {
  animation: LottieViewType | null = null
  // miniprogram needs to init after page onReady event
  onReady(){
    this.animation?.init()
  }
  render() {
    return (
      <LottieView
        ref={ animation => {
          this.animation = animation;
        }}
        style={
          {
            width: 100,
            height: 100
          }
        }
        autoPlay={true}
        loop={true}
        source={lottieData}
      />
    );
  }
}
```

## Component API

> Based on [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) project, under the Apache License 2.0.

| Prop | Description | Default | Platform |
|---|---|---|---|
|**`source`**| **Mandatory** - The source of animation. Can be referenced as a local asset by a string, or remotely with an object with a `uri` property, or it can be an actual JS object of an animation, obtained (for example) with something like `require('../path/to/animation.json')` |*None*| All |
|**`progress`**| A number between 0 and 1, or an `Animated` number between 0 and 1. This number represents the normalized progress of the animation. If you update this prop, the animation will correspondingly update to the frame at that progress value. This prop is not required if you are using the imperative API. |`0`| All |
|**`speed`**| The speed the animation will progress. Sending a negative value will reverse the animation |`1`| All |
|**`duration`**| The duration of the animation in ms. Takes precedence over `speed` when set. This only works when `source` is an actual JS object of an animation. |`undefined`| RN |
|**`loop`**|A boolean flag indicating whether or not the animation should loop. |`true`| All |
|**`autoPlay`**|A boolean flag indicating whether or not the animation should start automatically when mounted. This only affects the imperative API.  |`false`| All |
|**`autoSize`**|A boolean flag indicating whether or not the animation should size itself automatically according to the width in the animation's JSON. This only works when `source` is an actual JS object of an animation.  |`false`| RN |
|**`resizeMode`**|Determines how to resize the animated view when the frame doesn't match the raw image dimensions. Supports `cover`, `contain` and `center`.  |`contain`| RN |
|**`style`**|Style attributes for the view, as expected in a standard [`View`](http://facebook.github.io/react-native/releases/0.46/docs/layout-props.html), aside from border styling |*None*| All |
|**`imageAssetsFolder`**| Needed for **Android** to work properly with assets, iOS will ignore it. |*None*| Android |
|**`onAnimationFinish`**| A callback function which will be called when animation is finished. This callback is called with a boolean `isCancelled` argument, indicating if the animation actually completed playing, or if it was cancelled, for instance by calling `play()` or `reset()` while is was still playing. Note that this callback will be called only when `loop` is set to false. |*None*| All |
|**`renderMode`**| **Only Android**, a String flag to set whether or not to render with `HARDWARE` or `SOFTWARE` acceleration |`AUTOMATIC`| Android |
|**`cacheComposition`**| **Only Android**, a boolean flag indicating whether or not the animation should do caching. |`true`| Android |
|**`colorFilters`**| An array of objects denoting layers by KeyPath and a new color filter value (as hex string). |`[]`| RN |
|**`textFiltersAndroid`**| **Only Android**, an array of objects denoting text values to find and replace. |`[]`| Android |
|**`textFiltersIOS`**| **Only iOS**, an array of objects denoting text layers by KeyPath and a new string value. |`[]`| iOS |

## Methods (Imperative API):
> Based on [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) project, under the Apache License 2.0.

| Method | Description |
|---|---|
|**`play`**| Play the animation all the way through, at the speed specified as a prop. It can also play a section of the animation when called as `play(startFrame, endFrame)`.
|**`reset`**| Reset the animation back to `0` progress.
|**`pause`**| Pauses the animation.
|**`resume`**| Resumes the paused animation.
|**`init`**| Init the animation. Required for miniprogram

## More

View more documentation, FAQ, help, examples, and more at [airbnb.io/lottie](https://airbnb.io/lottie/)

![Example1](https://github.com/lottie-react-native/lottie-react-native/raw/master/docs/gifs/Example1.gif)

![Example2](https://github.com/lottie-react-native/lottie-react-native/raw/master/docs/gifs/Example2.gif)

![Example3](https://github.com/lottie-react-native/lottie-react-native/raw/master/docs/gifs/Example3.gif)

![Community](https://github.com/lottie-react-native/lottie-react-native/raw/master/docs/gifs/Community%202_3.gif)

![Example4](https://github.com/lottie-react-native/lottie-react-native/raw/master/docs/gifs/Example4.gif)

## License
MIT License
