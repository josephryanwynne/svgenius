# SVGenius

## Usage
### Instructions
* Import the library to make SVGENIUS available on the page
* Add a div element which the svg should be rendered inside
* Configur your chart

### Example

<pre>
&lt;html&gt;
	&lt;body&gt;
		&lt;div id="sampleGaugeContainer" height="400" width="400" /&gt;
		&lt;script type="text/javascript" src="svgenius.js" &gt;&t/script&gt;
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
