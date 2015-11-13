/*jslint browser:true */
/*

SVGENIUS. The beginning of something beautiful...
=================================================

Coming up...
============

* Add labels: Chart Title, Chart Major, Chart Minor. Title is least important.
* Changing the stroke width screws up the layout
* Don't forget to remove logging once it's working ok
* setInterval to make value gradually fill up?
* Apply tween to the setInterval above if it ever gets done
* Zero value doesn't quite look right... might explain some other small issues when scaling different values
* Only makes sense if height dimension of containing div is greater or equal to width otherwise we all fall down.
*/
var SVGENIUS = (function (my) {

    'use strict';

    my.charts = {
        newSvgElement: function (tag) {
            return document.createElementNS("http://www.w3.org/2000/svg", tag);
        },
        newSvg: function (height, width) {
            var svg = this.newSvgElement('svg');
            svg.setAttribute('xmlns:svg', "http://www.w3.org/2000/svg");
            svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            svg.setAttribute('height', height);
            svg.setAttribute('width', width);
            return svg;
        },
        svgText: function (xPos, yPos, textSize, text, color) {
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
        gauge: function (conf) {

            //I feel like JSLint pushed me into this...
            var percentageDifference = conf.percentageDifference > 100 ? 100 : (conf.percentageDifference < -100 ? -100 : conf.percentageDifference),
                gaugeContainer = document.getElementById(conf.targetContainerId),

                //This is probably not the right way to ascertain the dimensions as it only works for html attributes
                height = gaugeContainer.offsetHeight,
                width = gaugeContainer.offsetWidth,
                strokeWidth = 1, // I think a bug in my code means this cannot easily be changed.
                svg = this.newSvg(height, width),
                //Compute positions of various stuff based on the above
                gaugeWidth = height / 12, //Arbitrary ratio choice made by me. Looks ok
                radius = (height - 2) / 2.0, // Allow 1 pixel either side for padding
                innerRadius = radius - gaugeWidth,
                startX = radius * 2 / 3,
                startY = gaugeWidth + 1, //This is a bad idea. Use a central point as a starting point instead? 
                outerArcBottom = (2 * radius),
                halfwayX = (startX + radius - (strokeWidth / 2)),
                halfwayY = (radius + 1),
                halfwayPoint = halfwayX + ',' + halfwayY, // Check that this is correct
                //Grey outline of the gauge - draw vertical line up, outer arc, up, inner arc.
                outline = this.newSvgElement("path"),
                //Compute text positions
                textSize = gaugeWidth,
                positiveTextPositionX = startX - gaugeWidth,
                positiveTextPositionY = startY - (textSize / 2),
                positiveText = this.svgText(positiveTextPositionX, positiveTextPositionY, textSize, '+', 'red'),
                negativeTextPositionX = positiveTextPositionX,
                negativeTextPositionY = outerArcBottom - (textSize / 2),
                negativeText = this.svgText(negativeTextPositionX, negativeTextPositionY, textSize, '-', 'red'),
                zeroText = this.svgText(halfwayX + gaugeWidth, halfwayY, textSize, '0', 'green'),
                basePath = 'M' + startX + ',' + startY + ' v-' + gaugeWidth + ' A1,1 0 0 1 ' + startX + ' ' + outerArcBottom + ' v-' + gaugeWidth + ' A1,1 0 0 0 ' + startX + ',' + startY + ' Z',
                base = this.newSvgElement("path"),
                chartMajorText,
                labelText,
                majorLabel,
                minorLabel,
                minorLabelText,
                halfwayMarker,
                angle = Math.PI / (200 / percentageDifference),
                outerArcYOffset = radius * Math.sin(angle),
                outerArcXOffset = radius * Math.cos(angle),
                innerArcYOffset = (radius - gaugeWidth) * Math.sin(angle),
                innerArcXOffset = (radius - gaugeWidth) * Math.cos(angle),
                //Flags for arc decision making
                innerArcFlag = percentageDifference > 0 ? 0 : 1,
                outerArcFlag = percentageDifference > 0 ? 1 : 0,
                //Rendering negative chart doesn't work without this correction. Can't tell you why...
                correction = percentageDifference > 0 ? 1 : 0,
                overlay = this.newSvgElement("path");

            outline.setAttribute('d', basePath);
            outline.setAttribute('fill', 'none');
            outline.setAttribute('stroke', 'grey');
            outline.setAttribute('stroke-width', '1');
            //Separate layer for base and outline so colors can be manipulated appropriately
            base.setAttribute('d', basePath);
            base.setAttribute('fill', 'white');
            //This section needs some attention
            if (conf.showValueAsLabel === true) {
                chartMajorText = conf.percentageDifference.toFixed(2);
                labelText = this.newSvgElement('text');
                majorLabel = this.newSvgElement('tspan');
                minorLabelText = percentageDifference >= 0 ? 'Ahead by' : 'Behind by';
                minorLabel = this.newSvgElement('tspan');

                labelText.setAttribute('alignment-baseline', 'middle');
                labelText.setAttribute('text-anchor', 'middle');
                labelText.setAttribute('x', startX);
                labelText.setAttribute('y', halfwayY);

                majorLabel.setAttribute('font-size', radius / 3.5); //Arbitrary
                majorLabel.setAttribute('font-weight', 'bold');
                majorLabel.setAttribute('fill', 'black');
                majorLabel.textContent = chartMajorText + '%';
                majorLabel.setAttribute('font-family', 'Arial');


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



            halfwayMarker = this.newSvgElement("path");
            halfwayMarker.setAttribute('d', 'M' + halfwayPoint + ' h' + (gaugeWidth / 2) + ' M' + halfwayPoint + ' h-' + gaugeWidth + ' Z');
            halfwayMarker.setAttribute('stroke', 'grey');
            halfwayMarker.setAttribute('stroke-width', '1');

            overlay.setAttribute('d', 'M' + halfwayPoint + ' l-' + gaugeWidth + ',0 A' + innerRadius + ',' + innerRadius + ' 0 0 ' + innerArcFlag + ' ' + (startX + innerArcXOffset) + ',' + (radius - innerArcYOffset + correction) + '  L' + (startX + outerArcXOffset) + ',' + (radius - outerArcYOffset + correction) + ' A' + radius + ',' + radius + ' 0 0 ' + outerArcFlag + ' ' + halfwayPoint);
            overlay.setAttribute('fill', (Math.abs(percentageDifference) > conf.threshold ? 'red' : 'green'));
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

    };

    return my;
}(SVGENIUS || {}));
