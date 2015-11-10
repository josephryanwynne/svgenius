
/*

SVGENIUS. The beginning of something beautiful...
=================================================

TODO
====

* Add labels: Chart Title, Chart Major, Chart Minor. Title is least important.
* Changing the stroke width screws up the layout
* Don't forget to remove logging once it's working ok
* setInterval to make value gradually fill up?
* Apply tween to the setInterval above if it ever gets done
* Zero value doesn't quite look right... might explain some other small issues when scaling different values
*/
var SVGENIUS = SVGENIUS || {};
SVGENIUS.charts = {
    
    newSvgElement: function(tag){
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    },
    newSvg: function(height, width){
        var svg = this.newSvgElement('svg');
        svg.setAttribute('xmlns:svg',"http://www.w3.org/2000/svg");
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('height', height);
        svg.setAttribute('width', width);
        return svg;
    },
    svgText: function(xPos,yPos,textSize,text,color){
        var newSvgTextElement = this.newSvgElement('text');
        newSvgTextElement.setAttribute('dominant-baseline', 'central');
        newSvgTextElement.setAttribute('x', xPos);
        newSvgTextElement.setAttribute('y', yPos);
        newSvgTextElement.setAttribute('font-size', textSize);
        newSvgTextElement.setAttribute('font-weight', 'bold');
        newSvgTextElement.setAttribute('fill', color);
        newSvgTextElement.textContent = text;
        newSvgTextElement.setAttribute('font-family', 'Arial');
        return newSvgTextElement;
    },
    gauge: function(conf){
        
        var percentageDifference = conf.percentageDifference;
        var gaugeContainer = document.getElementById(conf.targetContainerId);
        
        //This is probably not the right way to ascertain the dimensions as it only works for html attributes
        var height = gaugeContainer.getAttribute("height");
        var width = gaugeContainer.getAttribute("width");
        var strokeWidth = 1; // TODO : Bug in my code means this cannot easily be changed.
        var svg = this.newSvg(height, width);
        //Compute positions of various stuff based on the above
        var gaugeWidth = height/12; //Arbitrary ratio choice made by me. Looks ok
        var radius = (height - 2) / 2.0; // Allow 1 pixel either side for padding
        var innerRadius = radius - gaugeWidth;
        var startX = radius * 2/3;
        var startY = gaugeWidth+1; //This is a bad idea. Use a central point as a starting point instead? 
        var outerArcBottom = (2*radius);
        var halfwayX = (startX+radius-(strokeWidth/2));
        var halfwayY = (radius+1);
        var halfwayPoint = halfwayX+','+halfwayY; // Check that this is correct
        var labelFont = conf.labelFont;
        
        //Grey outline of the gauge - draw vertical line up, outer arc, up, inner arc.
        var outline = this.newSvgElement("path");
        var basePath = 'M'+startX+','+startY+' v-' + gaugeWidth + ' A1,1 0 0 1 '+startX+' '+outerArcBottom+' v-'+gaugeWidth+' A1,1 0 0 0 '+startX+','+startY+' Z';
        outline.setAttribute('d', basePath);
        outline.setAttribute('fill', 'none');
        outline.setAttribute('stroke', 'grey');
        outline.setAttribute('stroke-width', '1');
        //Separate layer for base and outline so colors can be manipulated appropriately
        var base = this.newSvgElement("path");
        base.setAttribute('d', basePath);
        base.setAttribute('fill', 'white');
        
        //Compute text positions
        var textSize = gaugeWidth;
        var positiveTextPositionX = startX - gaugeWidth;
        var positiveTextPositionY = startY - (textSize / 2);
        
        var positiveText = this.svgText(positiveTextPositionX, positiveTextPositionY, textSize, '+', 'red');
        
        var negativeTextPositionX = positiveTextPositionX;
        var negativeTextPositionY = outerArcBottom - (textSize / 2);
            
        var negativeText = this.svgText(negativeTextPositionX, negativeTextPositionY, textSize, '-', 'red');
        var zeroText = this.svgText(halfwayX + gaugeWidth, halfwayY, textSize, '0', 'green');
        
        //TODO : CLEAN ME
        if(conf.showValueAsLabel == 'true'){
            var chartMajorText = conf.percentageDifference.toFixed(2);
            var labelText = this.newSvgElement('text');
            labelText.setAttribute('alignment-baseline', 'middle');
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('x', startX);
            labelText.setAttribute('y', halfwayY);
            var majorLabel = this.newSvgElement('tspan');
            majorLabel.setAttribute('font-size', radius / 3.5); //Arbitrary
            majorLabel.setAttribute('font-weight', 'bold');
            majorLabel.setAttribute('fill', 'black');
            majorLabel.textContent = chartMajorText + '%';
            majorLabel.setAttribute('font-family', 'Arial');

            var minorLabelText = percentageDifference >= 0 ? 'Ahead by' : 'Behind by';
            var minorLabel = this.newSvgElement('tspan');
            minorLabel.setAttribute('font-size', radius / 7); // Arbitrary
            minorLabel.setAttribute('text-anchor', 'middle');
            minorLabel.setAttribute('fill', 'black');
            minorLabel.setAttribute('dy', '1.1em');
            minorLabel.setAttribute('x', startX);
            minorLabel.textContent = minorLabelText;
            minorLabel.setAttribute('font-family', 'Arial');
            
            labelText.appendChild(majorLabel);
            labelText.appendChild(minorLabel);
            svg.appendChild(labelText);
        }
        
        //Prevent overflow if user passes numbers outside of accepted range
        if(percentageDifference > 100){
            percentageDifference = 100;
        } else if (percentageDifference < -100){
            percentageDifference = -100;
        }
        
        var halfwayMarker = this.newSvgElement("path");
        halfwayMarker.setAttribute('d', 'M'+halfwayPoint+' h'+(gaugeWidth/2)+' M'+halfwayPoint+' h-'+gaugeWidth+' Z');
        halfwayMarker.setAttribute('stroke', 'grey');
        halfwayMarker.setAttribute('stroke-width', '1');
        
        var angle = Math.PI / (200 / percentageDifference);
        var outerArcYOffset = radius * Math.sin(angle);
        var outerArcXOffset = radius * Math.cos(angle);
        var innerArcYOffset = (radius - gaugeWidth) * Math.sin(angle);
        var innerArcXOffset = (radius - gaugeWidth) * Math.cos(angle);
        
        //Flags for arc decision making
        var innerArcFlag = percentageDifference > 0 ? 0 : 1;
        var outerArcFlag = percentageDifference > 0 ? 1 : 0;
        
        //Rendering negative chart doesn't work without this correction. Can't tell you why...
        var correction = percentageDifference > 0 ? 1 : 0;
        
        var overlay = this.newSvgElement("path");
        overlay.setAttribute('d', 'M'+halfwayPoint+' l-'+(gaugeWidth)+',0 A'+innerRadius+','+innerRadius+' 0 0 '+innerArcFlag+' '+(startX+innerArcXOffset)+','+(radius-innerArcYOffset+correction)+'  L'+(startX+outerArcXOffset)+','+(radius-outerArcYOffset+correction)+' A'+radius+','+radius+' 0 0 '+outerArcFlag+' '+halfwayPoint);
        overlay.setAttribute('fill', (Math.abs(percentageDifference)>conf.threshold?'red':'green'));
        overlay.setAttribute('stroke-width', '0');
        
        //Add the things to the page to create beautiful gauge
        gaugeContainer.appendChild(svg);
        //Draw the gauge
        svg.appendChild(base);
        svg.appendChild(overlay);
        svg.appendChild(outline);
        svg.appendChild(halfwayMarker);
        //Draw the labels
        svg.appendChild(positiveText);
        svg.appendChild(negativeText);
        svg.appendChild(zeroText);
    }
}