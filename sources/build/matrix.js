var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Utility;
(function (Utility) {
    function fixDegrees(deg) {
        return deg - (Math.floor(deg / 360.0) * 360.0);
    }
    Utility.fixDegrees = fixDegrees;
    function color_hsl(h, s, l) {
        if (s === void 0) { s = 100; }
        if (l === void 0) { l = 50; }
        return "hsl(" + h + ", " + s + "%, " + l + "%)";
    }
    Utility.color_hsl = color_hsl;
    function color_hsla(h, s, l, a) {
        if (s === void 0) { s = 100; }
        if (l === void 0) { l = 50; }
        if (a === void 0) { a = 1.0; }
        return "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")";
    }
    Utility.color_hsla = color_hsla;
    function color_rgb(r, g, b) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    Utility.color_rgb = color_rgb;
    function color_rgba(r, g, b, a) {
        if (a === void 0) { a = 1.0; }
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
    Utility.color_rgba = color_rgba;
    function debug_value(selector, value) {
        var el;
        if ((el = document.querySelector(selector)))
            el.innerHTML = value;
    }
    Utility.debug_value = debug_value;
    var GraphicCanvas = /** @class */ (function () {
        function GraphicCanvas(_canvas) {
            if (!_canvas)
                _canvas = document.createElement('canvas');
            this.canvas = _canvas;
            this.ctx = this.canvas.getContext('2d');
        }
        GraphicCanvas.prototype.resize = function (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        };
        GraphicCanvas.prototype.getBuffer = function () {
            return this.canvas;
        };
        return GraphicCanvas;
    }());
    Utility.GraphicCanvas = GraphicCanvas;
})(Utility || (Utility = {}));
var MatrixFX;
(function (MatrixFX) {
    var FX = /** @class */ (function () {
        function FX() {
            this.buffer = document.createElement('canvas');
            this.ctx = this.buffer.getContext('2d');
        }
        FX.prototype.fx_buffer = function (width, height) {
            this.buffer.width = width;
            this.buffer.height = height;
        };
        FX.prototype.fx_render = function (interval, width, height) {
            this.ctx.clearRect(0, 0, width, height);
            this.render(interval, width, height);
            return this.buffer;
        };
        return FX;
    }());
    MatrixFX.FX = FX;
    var BasicColumnFX = /** @class */ (function (_super) {
        __extends(BasicColumnFX, _super);
        function BasicColumnFX() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hueOffset = 0;
            return _this;
        }
        BasicColumnFX.prototype.render = function (interval, width, height) {
            var colHue = 360.0 / (width / Matrix.COLUMN_SIZE);
            for (var x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                this.ctx.fillStyle = Utility.color_hsl(Utility.fixDegrees(this.hueOffset -
                    colHue * (x / Matrix.COLUMN_SIZE)));
                this.ctx.fillRect(x, 0, Matrix.COLUMN_SIZE, height);
            }
            this.hueOffset = Utility.fixDegrees(this.hueOffset + colHue);
        };
        return BasicColumnFX;
    }(FX));
    MatrixFX.BasicColumnFX = BasicColumnFX;
    var BasicLetterFX = /** @class */ (function (_super) {
        __extends(BasicLetterFX, _super);
        function BasicLetterFX() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hueOffset = 0;
            return _this;
        }
        BasicLetterFX.prototype.render = function (interval, width, height) {
            var colHue = 360.0 / (width / Matrix.COLUMN_SIZE);
            var rowHue = 360.0 / (height / Matrix.COLUMN_SIZE);
            for (var y = 0; y < height; y += Matrix.COLUMN_SIZE) {
                for (var x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                    this.ctx.fillStyle = Utility.color_hsl(Utility.fixDegrees(this.hueOffset -
                        colHue * (x / Matrix.COLUMN_SIZE) -
                        rowHue * (y / Matrix.COLUMN_SIZE)));
                    this.ctx.fillRect(x, y, Matrix.COLUMN_SIZE, Matrix.COLUMN_SIZE);
                }
            }
            this.hueOffset = Utility.fixDegrees(this.hueOffset + rowHue);
        };
        return BasicLetterFX;
    }(FX));
    MatrixFX.BasicLetterFX = BasicLetterFX;
})(MatrixFX || (MatrixFX = {}));
var Matrix;
(function (Matrix) {
    Matrix.DEFAULT_SIZE = 300;
    Matrix.DEFAULT_COLOR = '#44ff00';
    Matrix.DEFAULT_SYMBOLS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ日(+*;)-|2589Z';
    Matrix.DEFAULT_SPEED = 1;
    Matrix.DEFAULT_LINE_LENGTH = 16;
    Matrix.DEFAULT_ROTATION = 0;
    Matrix.DEFAULT_UPDATE_RATE = 32;
    Matrix.DEFAULT_FX = new MatrixFX.BasicColumnFX();
    Matrix.COLUMN_SIZE = 12;
    Matrix.MAX_SPEED = 32;
    Matrix.MAX_LINE_LENGTH = 32;
    // --- Internal Settings
    var width = Matrix.DEFAULT_SIZE;
    var height = Matrix.DEFAULT_SIZE;
    var canvas;
    var ctx;
    var color = Matrix.DEFAULT_COLOR;
    var characters = [];
    function convertSymbols(_symbols) {
        if (_symbols === void 0) { _symbols = Matrix.DEFAULT_SYMBOLS; }
        characters = [];
        for (var i = 0, l = _symbols.length; i < l; i++) {
            var c = _symbols[i];
            var measure = ctx.measureText(c);
            characters.push({
                width: measure.width,
                char: c
            });
        }
    }
    var speed = Matrix.DEFAULT_SPEED;
    var lineLength = Matrix.DEFAULT_LINE_LENGTH;
    var rotation = Matrix.DEFAULT_ROTATION;
    var ups = Matrix.DEFAULT_UPDATE_RATE;
    var useFX = false;
    var fx = Matrix.DEFAULT_FX;
    function create(selector, settings) {
        var _canvas = document.querySelector(selector);
        if (_canvas.tagName.toLowerCase() != 'canvas')
            return;
        canvas = _canvas;
        ctx = _canvas.getContext('2d');
        resize(Matrix.DEFAULT_SIZE, Matrix.DEFAULT_SIZE);
        // Settings
        convertSymbols(Matrix.DEFAULT_SYMBOLS);
        if (settings) {
            if (settings.size)
                resize(settings.size.width, settings.size.height);
            if (settings.color)
                setColor(settings.color);
            if (settings.symbols)
                setSymbols(settings.symbols);
            if (settings.speed)
                setSpeed(settings.speed);
            if (settings.lineLength)
                setLineLength(settings.lineLength);
            if (settings.rotation)
                setRotation(settings.rotation);
            if (settings.updateRate)
                setUpdateRate(settings.updateRate);
            if (settings.useFX != null)
                setUseFX(settings.useFX);
            if (settings.fx && settings.fx.render)
                setFX(settings.fx);
        }
    }
    Matrix.create = create;
    function start() {
        RenderEngine.start();
    }
    Matrix.start = start;
    // --- Settings
    function resize(_width, _height) {
        if (_width === void 0) { _width = Matrix.DEFAULT_SIZE; }
        if (_height === void 0) { _height = Matrix.DEFAULT_SIZE; }
        width = _width;
        height = _height;
        canvas.width = _width;
        canvas.height = _height;
        fx.fx_buffer(_width, _height);
        RenderEngine.recalculate_columns();
    }
    Matrix.resize = resize;
    function setColor(_color) {
        if (_color === void 0) { _color = Matrix.DEFAULT_COLOR; }
        color = _color;
    }
    Matrix.setColor = setColor;
    function setSymbols(_symbols) {
        if (_symbols === void 0) { _symbols = Matrix.DEFAULT_SYMBOLS; }
        convertSymbols(_symbols);
    }
    Matrix.setSymbols = setSymbols;
    function setSpeed(_speed) {
        if (_speed === void 0) { _speed = Matrix.DEFAULT_SPEED; }
        if (_speed < 1 || _speed > Matrix.MAX_SPEED)
            _speed = Matrix.DEFAULT_SPEED;
        speed = _speed;
    }
    Matrix.setSpeed = setSpeed;
    function setLineLength(_lineLength) {
        if (_lineLength === void 0) { _lineLength = Matrix.DEFAULT_LINE_LENGTH; }
        if (_lineLength < 1 || _lineLength > Matrix.MAX_LINE_LENGTH)
            _lineLength = Matrix.DEFAULT_LINE_LENGTH;
        lineLength = _lineLength;
    }
    Matrix.setLineLength = setLineLength;
    function setRotation(_rotation) {
        if (_rotation === void 0) { _rotation = Matrix.DEFAULT_ROTATION; }
        rotation = Utility.fixDegrees(_rotation);
    }
    Matrix.setRotation = setRotation;
    function setUpdateRate(_ups) {
        if (_ups === void 0) { _ups = Matrix.DEFAULT_UPDATE_RATE; }
        if (_ups < 1)
            _ups = Matrix.DEFAULT_UPDATE_RATE;
        ups = _ups;
    }
    Matrix.setUpdateRate = setUpdateRate;
    function setUseFX(_useFX) {
        if (_useFX === void 0) { _useFX = false; }
        useFX = _useFX;
    }
    Matrix.setUseFX = setUseFX;
    function setFX(_fx) {
        if (_fx === void 0) { _fx = Matrix.DEFAULT_FX; }
        fx = _fx;
    }
    Matrix.setFX = setFX;
    // Rendering
    var RenderEngine;
    (function (RenderEngine) {
        var columns = [];
        function recalculate_columns() {
            columns = [];
            paint_reset();
            for (var x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                columns.push({
                    x: x,
                    segments: [create_segment()]
                });
            }
        }
        RenderEngine.recalculate_columns = recalculate_columns;
        function create_segment() {
            var hLineLength = lineLength / 2.0;
            return {
                delay: Math.ceil(5 + Math.random() * 15),
                y: 0,
                letters: [],
                length: Math.ceil(hLineLength + Math.random() * hLineLength)
            };
        }
        var columnsAccumulator = 0;
        var colorAccumulator = 0;
        var bg;
        var fxBuffer;
        function render_columns(delta) {
            Utility.debug_value('#debug-columns', "" + columns.length);
            Utility.debug_value('#debug-column-0', "" + columns[0].segments[columns[0].segments.length - 1].delay);
            if (columnsAccumulator >= 1000.0 / speed) {
                for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    var l_Column = columns_1[_i];
                    ctx.beginPath();
                    ctx.clearRect(l_Column.x, 0, Matrix.COLUMN_SIZE, height);
                    ctx.beginPath();
                    ctx.drawImage(bg.getBuffer(), 0, 0, Matrix.COLUMN_SIZE, height, l_Column.x, 0, Matrix.COLUMN_SIZE, height);
                    var needsNext = true;
                    for (var _a = 0, _b = l_Column.segments; _a < _b.length; _a++) {
                        var l_Segment = _b[_a];
                        if (l_Segment.delay > 0) {
                            l_Segment.delay -= 1;
                            needsNext = false;
                            continue;
                        }
                        if (l_Segment.letters.length < l_Segment.length) {
                            l_Segment.letters.push(characters[Math.floor(Math.random() * characters.length)]);
                            needsNext = false;
                        }
                        else {
                            ctx.beginPath();
                            ctx.clearRect(l_Column.x, l_Segment.y, Matrix.COLUMN_SIZE, Matrix.COLUMN_SIZE);
                            l_Segment.y += Matrix.COLUMN_SIZE;
                        }
                        for (var i = 0, l = l_Segment.letters.length; i < l; i++) {
                            paint_letter(l_Segment.letters[i], l_Column.x, l_Segment.y + Matrix.COLUMN_SIZE * i);
                        }
                    }
                    if (needsNext) {
                        l_Column.segments.push(create_segment());
                    }
                    l_Column.segments = l_Column.segments.filter(function (segment) { return segment.y - (Matrix.COLUMN_SIZE * segment.length) < height; });
                }
                columnsAccumulator = 0;
            }
        }
        function render_bg() {
            ctx.save();
            // ctx.globalCompositeOperation = 'copy';
            ctx.drawImage(bg.getBuffer(), 0, 0);
            ctx.restore();
        }
        function render_color(delta) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-atop';
            if (useFX) {
                if (!fxBuffer || colorAccumulator >= 1000.0 / ups) {
                    fxBuffer = fx.fx_render(delta, width, height);
                    colorAccumulator = 0;
                }
                ctx.drawImage(fxBuffer, 0, 0);
            }
            else {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.fillRect(0, 0, width, height);
            }
            ctx.restore();
        }
        function start() {
            function loop(timestamp) {
                var delta = timestamp - lastRender;
                // ctx.clearRect(0, 0, width, height);
                // render_bg();
                columnsAccumulator += delta;
                render_columns(delta);
                colorAccumulator += delta;
                render_color(delta);
                lastRender = timestamp;
                window.requestAnimationFrame(loop);
            }
            bg = new BG();
            paint_reset();
            var lastRender = 0;
            window.requestAnimationFrame(loop);
        }
        RenderEngine.start = start;
        function paint_reset() {
            ctx.clearRect(0, 0, width, height);
            ctx.scale(1.2, 1.2);
            if (bg)
                bg.render();
        }
        function paint_letter(charData, x, y) {
            ctx.beginPath();
            ctx.clearRect(x, y, Matrix.COLUMN_SIZE, Matrix.COLUMN_SIZE);
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.fillText(charData.char, x + 6 - (charData.width / 2.0), y + 1, Matrix.COLUMN_SIZE);
        }
        var BG = /** @class */ (function (_super) {
            __extends(BG, _super);
            function BG() {
                return _super.call(this) || this;
            }
            BG.prototype.render = function () {
                this.resize(width, height);
                this.ctx.clearRect(0, 0, width, height);
                this.ctx.fillStyle = '#000000';
                for (var y = 0; y < height; y += Matrix.COLUMN_SIZE) {
                    for (var x = 0; x < width; x += Matrix.COLUMN_SIZE) {
                        this.ctx.beginPath();
                        this.ctx.fillRect(x + 5, y + 5, 2, 2);
                    }
                }
            };
            return BG;
        }(Utility.GraphicCanvas));
    })(RenderEngine || (RenderEngine = {}));
})(Matrix || (Matrix = {}));
