
/*

SVGENIUS. The beginning of something beautiful...
=================================================

TODO
====

* Add labels: Chart Title, Chart Major, Chart Minor. Title is least important.
* Add 0 point label
* Changing the stroke width screws up the layout
* Don't forget to remove logging once it's working ok
* setInterval to make value gradually fill up?
* Apply tween to the setInterval above if it ever gets done
*/
var SVGENIUS = SVGENIUS || {};
SVGENIUS.charts = {
    
    newSvgElement: function(tag){
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    },
    
    
    
    gauge: function(conf){
        
        var gaugeContainer = document.getElementById(conf.targetContainerId);
        
        var height = gaugeContainer.getAttribute("height");
        var width = gaugeContainer.getAttribute("width"); //Not using width for much except creating the svg
        
        
        var strokeWidth = 1;
        
        var svg = this.newSvgElement('svg');
        svg.setAttribute('xmlns:svg',"http://www.w3.org/2000/svg");
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('height', height);
        svg.setAttribute('width', width);
        
        
        var gaugeWidth = height/12; //Arbitrary choice made by me. Looks like a reasonable ratio
        var radius = height / 2.0 - 5;
        var innerRadius = radius - gaugeWidth;
        
        
        var startX = radius * 2/3;
        var startY = gaugeWidth+1; //This is a bad idea. Use a central point as a starting point instead? 
        
        //Grey outline of the gauge - draw vertical line up, outer arc, up, inner arc.
        var outline = this.newSvgElement("path");
        var outerArcBottom = (2*radius);
        outline.setAttribute('d', 'M'+startX+','+startY+' v-' + gaugeWidth + ' A1,1 0 0 1 '+startX+' '+outerArcBottom+' v-'+gaugeWidth+' A1,1 0 0 0 '+startX+','+startY+' Z');
        outline.setAttribute('fill', 'none');
        outline.setAttribute('stroke', 'grey');
        outline.setAttribute('stroke-width', '1');
        
        //Compute text positions
        var textSize = gaugeWidth;
        var halfwayX = (startX+radius-(strokeWidth/2));
        var halfwayY = (radius+1);
        var halfwayPoint = halfwayX+','+halfwayY; // Check that this is correct
        
        var positiveTextPositionX = startX - gaugeWidth;
        var positiveTextPositionY = startY - (textSize / 4 ); //Y-position is the bottom of the text
        
        var positiveText = this.newSvgElement('text');
        positiveText.setAttribute('x', positiveTextPositionX);
        positiveText.setAttribute('y', positiveTextPositionY);
        positiveText.setAttribute('font-size', textSize);
        positiveText.setAttribute('font-weight', 'bold');
        positiveText.setAttribute('fill', 'red');
        positiveText.innerHTML = '+';
        
        var negativeTextPositionX = startX - gaugeWidth;
        var negativeTextPositionY = outerArcBottom - (textSize / 4 ); //Y-position is the bottom of the text
            
        var negativeText = this.newSvgElement('text');
        negativeText.setAttribute('x', negativeTextPositionX);
        negativeText.setAttribute('y', negativeTextPositionY);
        negativeText.setAttribute('font-size', textSize);
        negativeText.setAttribute('font-weight', 'bold');
        negativeText.setAttribute('fill', 'red');
        
        negativeText.innerHTML = '&ndash;';
        
        var zeroText = this.newSvgElement('text');
        zeroText.setAttribute('x', halfwayX + gaugeWidth);
        zeroText.setAttribute('y', halfwayY + (textSize / 4));
        zeroText.setAttribute('font-size', textSize);
        zeroText.setAttribute('font-weight', 'bold');
        zeroText.setAttribute('font-family', 'arial');
        zeroText.setAttribute('fill', 'green');
        zeroText.innerHTML = '0';
        
        
        
        
        var percentageDifference = conf.percentageDifference; // Exactly halfway in the top section -- same as in testing
        
        if(percentageDifference > 100){
            percentageDifference = 100;
        } else if (percentageDifference < -100){
            percentageDifference = -100;
        }
        
        console.log('halfwayPoint['+halfwayPoint+']');
        
        var halfwayMarker = this.newSvgElement("path");
        halfwayMarker.setAttribute('d', 'M'+halfwayPoint+' h'+(gaugeWidth/2)+' M'+halfwayPoint+' h-'+gaugeWidth+' Z');
        halfwayMarker.setAttribute('stroke', 'grey');
        halfwayMarker.setAttribute('stroke-width', '1');
        
        var angle = Math.PI / (200 / percentageDifference);
        var outerArcYOffset = radius * Math.sin(angle);
        var outerArcXOffset = radius * Math.cos(angle);
        var innerArcYOffset = (radius - gaugeWidth) * Math.sin(angle);
        var innerArcXOffset = (radius - gaugeWidth) * Math.cos(angle);
        
        console.log('offsets ['+innerArcXOffset+','+innerArcYOffset+'] ['+outerArcXOffset+','+outerArcYOffset+']');
        
        var innerArcFlag = percentageDifference > 0 ? 0 : 1;
        var outerArcFlag = percentageDifference > 0 ? 1 : 0;
        var correction = percentageDifference > 0 ? 1 : 0;
        
        var overlay = this.newSvgElement("path");
        overlay.setAttribute('d', 'M'+halfwayPoint+' l-'+(gaugeWidth)+',0 A'+innerRadius+','+innerRadius+' 0 0 '+innerArcFlag+' '+(startX+innerArcXOffset)+','+(radius-innerArcYOffset+correction)+'  L'+(startX+outerArcXOffset)+','+(radius-outerArcYOffset+correction)+' A'+radius+','+radius+' 0 0 '+outerArcFlag+' '+halfwayPoint);
        overlay.setAttribute('fill', (Math.abs(percentageDifference)>conf.threshold?'red':'green'));
        overlay.setAttribute('stroke-width', '0');
        
        //Add the things to the page
        gaugeContainer.appendChild(svg);
        svg.appendChild(positiveText);
        svg.appendChild(negativeText);
        svg.appendChild(overlay);
        svg.appendChild(outline);
        svg.appendChild(halfwayMarker);
        svg.appendChild(zeroText);
    }
}