# SVGenius

## Summary
Pet project to familiarise myself with SVG basics and try out creating some simple graphics. Inspired by the lack of gauges that look like what John wants. 
Currently the only functionality is to produce a gauge chart displaying distance from target value as a percentage of the target (See Example below).

## Usage
### Instructions
* Import the library to make SVGENIUS available on the page
* Add a div element which the svg should be rendered inside
* Configure your chart as below

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
		        });
		&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</pre>
