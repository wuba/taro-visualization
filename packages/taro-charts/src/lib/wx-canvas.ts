// source from https://github.com/ecomfe/echarts-for-weixin/blob/master/ec-canvas/wx-canvas.js
// under BSD 3-Clause License
export default class WxCanvas {
  ctx: any;
  canvasId: string;
  chart: any;
  isNew: boolean;
  canvasNode: any;
  event: any;
  constructor(ctx: any, canvasId: string, isNew: boolean, canvasNode: any) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.isNew = isNew;
    if (isNew) {
      this.canvasNode = canvasNode;
    } else {
      this._initStyle(ctx);
    }

    // this._initCanvas(zrender, ctx);

    this._initEvent();
  }

  getContext(contextType: string) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }

  // canvasToTempFilePath(opt) {
  //   if (!opt.canvasId) {
  //     opt.canvasId = this.canvasId;
  //   }
  //   return wx.canvasToTempFilePath(opt, this);
  // }

  setChart(chart: any) {
    this.chart = chart;
  }

  addEventListener() {
    // noop
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  _initCanvas(
    zrender: {
      util: { getContext: () => any; $override: (arg0: string, arg1: (text: any, font: any) => any) => void };
    },
    ctx: { font: any; measureText: (arg0: any) => any }
  ) {
    zrender.util.getContext = function () {
      return ctx;
    };

    zrender.util.$override('measureText', function (text: any, font: string) {
      ctx.font = font || '12px sans-serif';
      return ctx.measureText(text);
    });
  }

  _initStyle(ctx: { createRadialGradient: () => any; createCircularGradient: (arg0: IArguments) => any }) {
    ctx.createRadialGradient = () => {
      // eslint-disable-next-line prefer-rest-params
      return ctx.createCircularGradient(arguments);
    };
  }

  _initEvent() {
    this.event = {};
    const eventNames = [
      {
        wxName: 'touchStart',
        ecName: 'mousedown'
      },
      {
        wxName: 'touchMove',
        ecName: 'mousemove'
      },
      {
        wxName: 'touchEnd',
        ecName: 'mouseup'
      },
      {
        wxName: 'touchEnd',
        ecName: 'click'
      }
    ];
    eventNames.forEach((name) => {
      this.event[name.wxName] = (e: { touches: any[] }) => {
        const touch = e.touches[0];
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
          zrY: name.wxName === 'tap' ? touch.clientY : touch.y,
          preventDefault: () => {},
          stopImmediatePropagation: () => {},
          stopPropagation: () => {}
        });
      };
    });
  }

  set width(w) {
    if (this.canvasNode) this.canvasNode.width = w;
  }
  set height(h) {
    if (this.canvasNode) this.canvasNode.height = h;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get width() {
    if (this.canvasNode) return this.canvasNode.width;
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  get height() {
    if (this.canvasNode) return this.canvasNode.height;
    return 0;
  }
}
