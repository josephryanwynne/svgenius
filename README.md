# SVGenius

## Summary
Pet project to familiarise myself with SVG basics and try out creating some simple graphics. Inspired by the lack of gauges that look like what John wants. 
Currently the only functionality is to produce a gauge chart displaying distance from target value as a percentage of the target (See Example below).

## Usage
### Instructions
* Import the library to make SVGENIUS available on the page
* Add a div element which the svg should be rendered inside
* Configure your chart as below

### JSFiddle
<a href="http://jsfiddle.net/josephryanwynne/ddsohund/">View examples in JSFiddle</a>

### Example
<pre>
&lt;html&gt;
	&lt;body&gt;
		&lt;div id="sampleGaugeContainer" height="400" width="400" /&gt;
		&lt;script type="text/javascript" src="svgenius.js" &gt;&lt;/script&gt;
		&lt;script type="text/javascript"&gt;
				//Configuration for the chart
		        SVGENIUS.charts.gauge({
		            targetContainerId: "sampleGaugeContainer", // id of containing div
		            percentageDifference: 78, // Percentage above or below target
		            threshold: 10 // Values above the threshold will cause the gauge to be rendered in red
		            height: 200, //May be required if the dimensions of containing div cannot be determined
			        width: 200, //May be required if the dimensions of containing div cannot be determined
			        majorLabelStyle: 'font-family: "Times New Roman"; font-size: 28px;', // Optional style
			        minorLabelStyle: 'font-family: "Times New Roman"; font-size: 14px;', // Optional style
			        showValueAsLabel: true // Display the value and ahead/behind. Default is false
		        });
		&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</pre>

## Browser Support
Verified in IE9+, Chrome 46, Firefox 42, Safari 9.
IE8 and below are not supported.