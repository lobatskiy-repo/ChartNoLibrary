class Chart {
  constructor(container, samples, options) {
    this.samples = samples;

    this.axesLabels = options.axesLabels;
    this.styles = options.styles;

    this.canvas = document.createElement("canvas");
    this.canvas.width = options.size;
    this.canvas.height = options.size;

    this.canvas.style = "background-color: white;";

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.marging = options.size * 0.1;
    this.transparency = 0.5;

    this.dataTrans = {
      offest: [0, 0],
      scale: 1,
    };

    this.dragInfo = {
      start: [0, 0],
      end: [0, 0],
      offest: [0, 0],
      dragging: false,
    };

    this.pixelBounds = this.#getPixelBounds();
    this.dataBounds = this.#getDataBounds();
    this.defaultDataBounds=this.#getDataBounds();

    this.#draw();

    this.#addEventListeners();
  }

  #addEventListeners() {
    const { canvas, dataTrans, dragInfo } = this;

    canvas.onmousedown = (evn) => {
      const dataLoc = this.#getMouse(evn, true);
      dragInfo.start = dataLoc;
      dragInfo.dragging = true;
      console.log(dataLoc);
    };
    canvas.onmousemove = (evn) => {
      if (dragInfo.dragging) {
        const dataLoc = this.#getMouse(evn, true);
        dragInfo.end = dataLoc;
        dragInfo.offest = math.subtract(dragInfo.start, dragInfo.end);
        const newOffset = math.add(dataTrans.offest, dragInfo.offest);

        this.#updateDataBounds(newOffset);
        this.#draw();
      }
    };

    canvas.onmouseup = (evn) => {
      dataTrans.offest = math.add(dataTrans.offest, dragInfo.offest);
      dragInfo.dragging = false;
    };
  }

  #updateDataBounds(offest) {
    const { dataBounds, defaultDataBounds: def } = this;

    dataBounds.left = def.left + offest[0];
    dataBounds.right = def.right + offest[0];
    dataBounds.top = def.top + offest[1];
    dataBounds.bottom = def.bottom + offest[1];
  }
  #getMouse(evn, dataSpace = false) {
    const rect = this.canvas.getBoundingClientRect();

    const pixelLoc = [evn.clientX - rect.left, evn.clientY - rect.top];

    if (dataSpace) {
      const dataLoc = math.remapPoint(
        this.pixelBounds,
        this.defaultDataBounds,
        pixelLoc
      );

      return dataLoc;
    }

    return pixelLoc;
  }

  #getPixelBounds() {
    const { canvas, marging } = this;

    const bounds = {
      left: marging,
      right: canvas.width - marging,
      top: marging,
      bottom: canvas.height - marging,
    };

    return bounds;
  }

  #getDataBounds() {
    const { samples } = this;

    const x = samples.map((s) => s.point[0]);
    const y = samples.map((s) => s.point[1]);

    const minX = Math.min(...x);
    const maxX = Math.max(...x);

    const minY = Math.min(...y);
    const maxY = Math.max(...y);

    const bounds = {
      left: minX,
      right: maxX,
      top: maxY,
      bottom: minY,
    };

    return bounds;
  }

  #draw() {
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.#drawAxes();

    ctx.globalAlpha = this.transparency;
    this.#drawSamples();
    ctx.globalAlpha = 1;
  }
  #drawAxes() {
    const { ctx, canvas, axesLabels, marging } = this;
    const { left, right, top, bottom } = this.pixelBounds;

    graphics.drawText(ctx, {
      text: axesLabels[0],
      loc: [canvas.width / 2, bottom + marging / 2],
      size: marging * 0.6,
    });

    ctx.save();
    ctx.translate(left - marging / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: axesLabels[1],
      loc: [0, 0],
      size: marging * 0.6,
    });
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lightgray";
    ctx.stroke();
    ctx.setLineDash([]);

    const dataMin = math.remapPoint(this.pixelBounds, this.dataBounds, [
      left,
      bottom,
    ]);

    graphics.drawText(ctx, {
      text: math.formatNumber(dataMin[0], 2),
      loc: [left, bottom],
      size: marging * 0.3,
      align: "left",
      vAligin: "top",
    });
    ctx.save();
    ctx.translate(left, bottom);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatNumber(dataMin[1], 2),
      loc: [0, 0],
      size: marging * 0.3,
      align: "left",
      vAligin: "bottom",
    });
    ctx.restore();

    const dataMax = math.remapPoint(this.pixelBounds, this.dataBounds, [
      right,
      top,
    ]);

    graphics.drawText(ctx, {
      text: math.formatNumber(dataMax[0], 2),
      loc: [right, bottom],
      size: marging * 0.3,
      align: "right",
      vAligin: "top",
    });
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatNumber(dataMax[1], 2),
      loc: [0, 0],
      size: marging * 0.3,
      align: "right",
      vAligin: "bottom",
    });
    ctx.restore();
  }

  #drawSamples() {
    const { ctx, samples, dataBounds, pixelBounds } = this;
    for (const sample of samples) {
      const { point } = sample;

      const pixelLoc = math.remapPoint(dataBounds, pixelBounds, point);

      graphics.drawPoint(ctx, pixelLoc);
    }
  }
}
