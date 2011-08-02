/* Copyright Steel Business Breifing, FreeBSD-License
 * simple flot plugin to draw bar numbers halfway in bars
 *
 * options are
 * series: {
 *     bars: {
 *         showNumbers: boolean
 *     }
 * }
 */
(function ($) {
    var options = {
        bars: { showNumbers: false }
    };

    function init(plot) {
        function drawNumbers(plot, ctx, series){
            if(series.bars.showNumbers){
                var points = series.datapoints.points
                var ctx = plot.getCanvas().getContext('2d');
                var offset = plot.getPlotOffset();
                ctx.textBaseline = "top";
                ctx.textAlign = "center";
                if(series.bars.align == "left")
                    alignOffset = series.bars.barWidth / 2;
                else
                    alignOffset = 0;

                for(var datapoint in points){
                    if((datapoint - 1) % 3 == 0){
                        var point = { 'x': points[datapoint - 1] + alignOffset, 'y': points[datapoint] / 2 }
                        var c = plot.p2c(point);
                        ctx.fillText(points[datapoint].toString(10), c.left + offset.left, c.top + offset.top)
                    }
                }
            }
        }
        plot.hooks.drawSeries.push(drawNumbers);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'barnumbers',
        version: '0.1'
    });
})(jQuery);
