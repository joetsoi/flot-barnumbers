/* Copyright Joe Tsoi, FreeBSD-License
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
        plot.hooks.drawSeries.push(function (plot, ctx, series){
            if(series.bars.showNumbers){
		var ps = series.datapoints.pointsize
                var points = series.datapoints.points
                var ctx = plot.getCanvas().getContext('2d');
                var offset = plot.getPlotOffset();
                ctx.textBaseline = "top";
                ctx.textAlign = "center";
		alignOffset = series.bars.align === "left" ? series.bars.barWidth / 2 : 0;
		function half(x){ return x/2; }
		function align(x){ return x + alignOffset; }
		function drawPoints(shiftX, shiftY){
			for(var i = 0; i < points.length; i += ps){
				var point = { 'x': shiftX(points[i]),  'y': shiftY(points[i+1])}
				var c = plot.p2c(point);
				ctx.fillText(points[i].toString(10), c.left + offset.left, c.top + offset.top)
			}
		}
		if(series.bars.horizontal){
			drawPoints(half, align);
		} else {
			drawPoints(align, half);
		}
            }
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'barnumbers',
        version: '0.1'
    });
})(jQuery);
