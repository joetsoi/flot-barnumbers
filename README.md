Examples
========
For working examples checkout http://joetsoi.github.com/flot-barnumbers/

Usage
=====
simple flot plugin to draw bar numbers in bars, simply add

    series: {
        bars: {
            numbers: {
                show : boolean
            }
        }
    }

There are other additional options

    series: {
        bars: {
            numbers : {
                show : boolean,
                xAlign : null or function like function (x) {return x + 0.5;}, (if null, the text is in the middle)
                yAlign : null or function like function (y) {return y + 0.5;}, (if null, the text is in the middle)
                font : {size : number, style : string, weight : string, family : string, color : string}
            }
        }
    }

By default numbers will be positioned in the center of the bars, but you can specify a function to override this behaviour.
If you have a horizontal bar chart, these 2 functions will switch round the axes they are working on.

This plugin is working well with zooming and panning (navigation plugin) too.
