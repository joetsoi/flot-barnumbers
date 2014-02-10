/* Copyright Joe Tsoi, FreeBSD-License
 * simple flot plugin to draw bar numbers halfway in bars
 *
 * options are
 * series: {
 *     bars: {
 *         showNumbers: boolean (left for compatibility)
 *         numbers : {
 *             show : boolean,
 *             xAlign : number or function,
 *             yAlign : number or function,
 *             textAlign : string (Canvas textAlign, default: 'center', Other valid options: start, end, left, right),
 *             textBaseline : string (Canvas textBaseline, default: 'top', Other valid options: hanging, middle, alphabetic, ideographic, bottom),
 *             offsetX : number (Additional x offset value, default: 0),
 *             offsetY : number (Additional y offset value w.r.t bar, default: 0),
 *             numberFormatter : function (To format the bar number)
 *         }
 *     }
 * }
 */
(function ($) {
    var options = {
        bars: {
            numbers: {
            }
        }
    };

    function processOptions(plot, options) {
        var bw = options.series.bars.barWidth;
        var numbers = options.series.bars.numbers;
        var horizontal = options.series.bars.horizontal;
        if(horizontal){
            numbers.xAlign = numbers.xAlign || function(x){ return x / 2; };
            numbers.yAlign = numbers.yAlign || function(y){ return y + (bw / 2); };
            numbers.horizontalShift = 0;
        } else {
            numbers.xAlign = numbers.xAlign || function(x){ return x + (bw / 2); };
            numbers.yAlign = numbers.yAlign || function(y){ return y / 2; };
            numbers.horizontalShift = 1;
        }
        numbers.textAlign = numbers.textAlign || "center";
        numbers.textBaseline = numbers.textBaseline || "top";
        numbers.offsetX = numbers.offsetX || 0;
        numbers.offsetY = numbers.offsetY || 0;
        numbers.numberFormatter = numbers.numberFormatter || function(x){ return x;};
    }

    function draw(plot, ctx){
        $.each(plot.getData(), function(idx, series) {
            if(series.bars.numbers.show || series.bars.showNumbers){
                var ps = series.datapoints.pointsize;
                var points = series.datapoints.points;
                var ctx = plot.getCanvas().getContext('2d');
                var offset = plot.getPlotOffset();
                ctx.textBaseline = series.bars.numbers.textBaseline;
                ctx.textAlign = series.bars.numbers.textAlign;
                alignOffset = series.bars.align === "left" ? series.bars.barWidth / 2 : 0;
                xAlign = series.bars.numbers.xAlign;
                yAlign = series.bars.numbers.yAlign;
                var shiftX = typeof xAlign == "number" ? function(x){ return x; } : xAlign;
                var shiftY = typeof yAlign == "number" ? function(y){ return y; } : yAlign;

                axes = {
                    0 : 'x',
                    1 : 'y'
                }
                hs = series.bars.numbers.horizontalShift;
                for(var i = 0; i < points.length; i += ps){
                    barNumber = i + series.bars.numbers.horizontalShift
                    var point = {
                        'x': shiftX(points[i]),
                        'y': shiftY(points[i+1])
                    };
                    if(series.stack != null){
                        point[axes[hs]] = (points[barNumber] - series.data[i/3][hs] / 2);
                        text = series.data[i/3][hs];
                    } else {
                        text = points[barNumber];
                    }
                    var formattedText = series.bars.numbers.numberFormatter(text);
                    var c = plot.p2c(point);
                    var x = c.left + offset.left + series.bars.numbers.offsetX;
                    var y = c.top + offset.top - series.bars.numbers.offsetY;
                    ctx.fillText(formattedText, x, y);
                }
            }
        });
    }

    function init(plot) {
        plot.hooks.processOptions.push(processOptions);
        plot.hooks.draw.push(draw);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'barnumbers',
        version: '0.5'
    });
})(jQuery);
