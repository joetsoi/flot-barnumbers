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
                xAlign = series.bars.numbers.xAlign;
                yAlign = series.bars.numbers.yAlign;
                var shiftX = typeof xAlign == "number" ? function(x){ return x; } : xAlign;
                var shiftY = typeof yAlign == "number" ? function(y){ return y; } : yAlign;
                if(series.bars.horizontal){
                    for(var i = 0; i < points.length; i += ps){
                        text = points[i];
                        var point = {
                            'x': shiftY(points[i]),
                            'y': shiftX(points[i+1])
                        };
                        if(series.stack != null){
                            point.x = (points[i] - series.data[i/3][0] / 2);
                            console.log(point.x);
                            text = series.data[i/3][1];
                        }
                        var c = plot.p2c(point);
                        ctx.fillText(text.toString(10), c.left + offset.left, c.top + offset.top)
                    }
                } else {
                    for(var i = 0; i < points.length; i += ps){
                        text = points[i+1];
                        var point = {
                            'x': shiftX(points[i]),
                            'y': shiftY(points[i+1])
                        };
                        if(series.stack != null){
                            point.y = (points[i+1] - series.data[i/3][1] / 2);
                            console.log(point.x);
                            text = series.data[i/3][1];
                        }
                        var c = plot.p2c(point);
                        ctx.fillText(text.toString(10), c.left + offset.left, c.top + offset.top)
                    }
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
