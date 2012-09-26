/* Copyright Joe Tsoi, FreeBSD-License
 * simple flot plugin to draw bar numbers halfway in bars
 *
 * options are
 * series: {
 *     bars: {
 *         showNumbers: boolean (left for compatibility)
 *         numbers : {
 *             show : boolean,
 *             alignX : number or function,
 *             alignY : number or function,
 *         }
 *     }
 * }
 */
(function ($) {
    var options = {
        bars: {
            numbers: {
                show : false,
            }
        }
    };

    function init(plot) {
        plot.hooks.processOptions.push(function (plot, options){
            var bw = options.series.bars.barWidth;
            var numbers = options.series.bars.numbers;
            numbers.xAlign = numbers.xAlign || function(x){ return x + (bw / 2); };
            numbers.yAlign = numbers.yAlign || function(y){ return y / 2; };
        });
        plot.hooks.drawSeries.push(function (plot, ctx, series){
            if(series.bars.numbers.show || series.bars.showNumbers){
                var ps = series.datapoints.pointsize;
                var points = series.datapoints.points;
                var ctx = plot.getCanvas().getContext('2d');
                var offset = plot.getPlotOffset();
                ctx.textBaseline = "top";
                ctx.textAlign = "center";
                alignOffset = series.bars.align === "left" ? series.bars.barWidth / 2 : 0;
                function drawPoints(xAlign, yAlign){
                    var shiftX = typeof xAlign == "number" ? function(x){ return x; } : xAlign;
                    var shiftY = typeof yAlign == "number" ? function(y){ return y; } : yAlign;
                    for(var i = 0; i < points.length; i += ps){
                        var point = {
                            'x': shiftX(points[i]),
                            'y': shiftY(points[i+1])
                        };
                        var c = plot.p2c(point);
                        ctx.fillText(points[i].toString(10), c.left + offset.left, c.top + offset.top)
                    }
                }
                if(series.bars.horizontal){
                    drawPoints(series.bars.numbers.yAlign, series.bars.numbers.xAlign);
                } else {
                    drawPoints(series.bars.numbers.xAlign, series.bars.numbers.yAlign);
                }
            }
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'barnumbers',
        version: '0.3'
    });
})(jQuery);
