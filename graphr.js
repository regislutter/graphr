window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function AnimateGrapher(data, options){
    var startTime = (new Date()).getTime();
    Grapher(data, options, startTime);
}

function Grapher(data, options, drawTime){
    var linearSpeed = options.speed ? options.speed : 100;
    var canvas = document.getElementById(options.id);
    var width = canvas.offsetWidth;
    var height = canvas.offsetHeight;
    var ctx = canvas.getContext("2d");
    var marginTop = 10; // Graph margin for canvas
    var marginBottom = 10;

    if(drawTime != undefined){
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        // update
        var time = (new Date()).getTime() - drawTime;
        // pixels / second
        var maxY = linearSpeed * time / 1000;
        // Counter (for drawing texts caracters)
        options.counter = options.counter != undefined ? options.counter+1 : 0;
    }

    // Legend
    var legendTextSizeY = 12;
    if(options.legend.y !== undefined){
        if(options.legend.y.size !== undefined){
            legendTextSizeY = options.legend.y.size;
        }
    }

    var legendTextSizeX = 12;
    var groupLabelIndex = 0;
    var groupBars = undefined;
    if(options.legend.x !== undefined){
        // Legend X size
        if(options.legend.x.size !== undefined){
            legendTextSizeX = options.legend.x.size;
        }

        // Legend X bars group
        if(options.legend.x.group !== undefined){
            if(options.legend.x.group.bars !== undefined){
                groupBars = options.legend.x.group.bars;
            }
            var groupSpacing = 15;
            if(options.legend.x.group.spacing !== undefined){
                groupSpacing = options.legend.x.group.spacing;
            }
        }
    }

    // Chart
    var originMargin = 10;
    var chartMargin = 10; // Left margin for chart text
    if(options.chart.margin !== undefined){
        originMargin = options.chart.margin;
        chartMargin = options.chart.margin;
    }
    var chartTextSize = 12;
    if(options.chart.size !== undefined){
        chartTextSize = options.chart.size;
    }
    var chartSpacing = 5;
    if(options.chart.spacing !== undefined){
        chartSpacing = options.chart.spacing;
    }
    var chartTextColor = "#0E77BE";
    if(options.chart.color !== undefined){
        chartTextColor = options.chart.color;
    }

    // Labels
    var marginLabelBar = 7; // Margin between text legend and bars
    if(options.bars.label.margin !== undefined){
        marginLabelBar = options.bars.label.margin;
    }
    var labelSize = 32;
    if(options.bars.label.size !== undefined){
        labelSize = options.bars.label.size;
    }
    marginTop += labelSize;

    // Bars
    var barWidth = 50;
    if(options.bars.width !== undefined){
        barWidth = options.bars.width;
    }
    var barSpacing = 20;
    if(options.bars.spacing !== undefined){
        barSpacing = options.bars.spacing;
    }

    // Get max value rounded with the chart spacing
    var min = 0;
    var max = chartSpacing;
    if(options.chart.overrideMax !== undefined){
        // Overrided max value in chart parameters
        max = options.chart.overrideMax;
    }else{
        // Automatic max from rounded highest value
        data.forEach(function(el, i, array){
            var round = el.value%chartSpacing;
            if(el.value + round > max){
                if(round == 0){
                    max = el.value;
                }else{
                    max = el.value + (chartSpacing-round);
                }
            }
        });
    }

    // Draw background
    if(options.chart.background !== undefined){
        ctx.fillStyle = options.chart.background;
        ctx.fillRect (0, 0, width, height);
    }

    // Draw bottom legend
    if(options.legend.x !== undefined && options.legend.x.label !== undefined && options.legend.x.label != ''){
        ctx.save();
        ctx.fillStyle = options.legend.x.color?options.legend.x.color:'black';
        ctx.textAlign = "center";
        ctx.font = legendTextSizeX+"px Avenir-Light";
        ctx.fillText(options.legend.x.label, width/2, height-5);
        ctx.restore();
        marginBottom += legendTextSizeX+marginBottom;
    }

    // Draw left legend
    if(options.legend.y !== undefined &&options.legend.y.label !== undefined && options.legend.y.label != ''){
        ctx.save();
        ctx.fillStyle = options.legend.y.color?options.legend.y.color:'black';
        ctx.textAlign = "center";
        ctx.rotate(-Math.PI/2);
        ctx.font = legendTextSizeY+"px Avenir-Light";
        ctx.fillText(options.legend.y.label, -(height+legendTextSizeY)/2, legendTextSizeY-3);
        ctx.restore();
        chartMargin += legendTextSizeY+originMargin;
    }

    // Draw each background line for the chart and label
    var linesColor='#CCC';
    if (options.lines !== undefined && options.lines.color !== undefined)
        linesColor=options.lines.color;

    var rankHeight = (height-marginBottom-marginTop)/max;
    var containDecimal = false;
    for(var i = 0; i <= max; i+=chartSpacing){
        var val = parseFloat(i).toFixed(1);
        var line = val*rankHeight;
        val = val.toString();
        // Format labels with or without .0
        if(val.indexOf('.') > 0 && val.indexOf('.0') <= 0){
            containDecimal = true;
        }
        if(val.indexOf('.0') > 0 && !containDecimal){
            val = val.substr(0, val.indexOf('.0'));
        }

        ctx.fillStyle = linesColor;
        ctx.fillRect(chartMargin+8, height-marginBottom-line, width-chartMargin, 1);
        ctx.fillStyle = chartTextColor;
        ctx.font = chartTextSize+"px Avenir-Light";
        ctx.textAlign = "right";
        ctx.fillText(val, chartMargin-originMargin+15, height-marginBottom-line+(chartTextSize/2));
    }

    // Draw data legend
    if(options.legend.datas.labels.length > 0){
        var nbLabel = 0;
        var legendLeft = options.legend.datas.x;
        var legendTop = options.legend.datas.y;
        var legendTextSize = options.legend.datas.size?options.legend.datas.size:12;
        var legendSpacing = options.legend.datas.spacing?options.legend.datas.spacing:5;
        ctx.font = legendTextSize+"px Avenir-Medium";
        options.legend.datas.labels.forEach(function(el, i, array){
            // Colored square
            ctx.fillStyle = el.color?el.color:'black';
            ctx.fillRect(legendLeft,
                legendTop+nbLabel*(legendTextSize+legendSpacing)-(legendTextSize-2),
                legendTextSize,
                legendTextSize);
            // Legend text
            ctx.fillStyle = options.legend.datas.color?options.legend.datas.color:'black';
            ctx.textAlign = "left";
            ctx.fillText(el.label, legendLeft+15, legendTop+nbLabel*(legendTextSize+legendSpacing));
            nbLabel++;
        });
    }

    // Draw datas
    var nbBars = 0;
    var groupCount = 0; // Count the number of bars drawn for the group
    var stopAnimation = true;
    data.forEach(function(el, i, array){
        ctx.fillStyle = el.color?el.color:'black';
        var leftPosition = chartMargin + (barSpacing*(nbBars+1)) + (barWidth*nbBars);
        if(groupBars !== undefined){
            leftPosition += 20;
            if(groupLabelIndex != 0 || groupCount == groupBars){
                // Add spaces from previous groups
                leftPosition += groupLabelIndex*groupSpacing;
            }

            // Space between groups
            if(groupCount == groupBars){
                leftPosition += groupSpacing;
                groupCount = 1; // Reinit counter of bars drawn
                groupLabelIndex++; // Change group
            } else {
                groupCount += 1;
            }

            // Draw group's labels
            ctx.save();
            //ctx.fillStyle = options.legend.y.group.color?options.legend.y.group.color:'black';
            ctx.fillStyle = chartTextColor;
            ctx.font = chartTextSize+"px Avenir-Light";
            ctx.textAlign = "center";
            if(Math.round(groupBars/2) == groupCount){
                var xLabelPosition = barWidth+barSpacing/2+leftPosition; // even
                if(groupBars%2){ // if groups are odd
                    xLabelPosition = barWidth/2+leftPosition;
                }
                ctx.fillText(options.legend.x.group.labels[groupLabelIndex], xLabelPosition, height-labelSize);
            }
            ctx.restore();
        }
        var topPosition = height-marginBottom;
        var barHeight = el.value*rankHeight;
        var barValue = el.value;
        if(barHeight > maxY){
            if(barValue < 10){
                barValue = Number((barValue/barHeight*maxY).toFixed(1));
                if(barValue%1 == 0){
                    barValue += '.0';
                }
            }else{
                barValue = Math.round(barValue/barHeight*maxY);
            }
            barHeight = maxY;
            stopAnimation = false; // While a bar is lower than the maxY, we keep actualizing the graph
        }
        topPosition -= barHeight;
        ctx.fillRect(leftPosition,
            topPosition,
            barWidth,
            barHeight);
        ctx.font = labelSize+"px Avenir-Heavy";
        ctx.textAlign = "center";
        if (el.showValue !== undefined && el.showValue == false)
        {
            ctx.fillText(el.prefix+el.suffix, leftPosition+(barWidth/2), topPosition-marginLabelBar);
        }
        else {
            ctx.fillText(el.prefix+barValue+el.suffix, leftPosition+(barWidth/2), topPosition-marginLabelBar);
        }
        nbBars++;
    });

    if((options.drawTexts != undefined || options.drawArrows != undefined) && stopAnimation){
        if(options.graphFinished == undefined){
            options.graphFinished = options.counter;
        }

        if(options.drawTexts != undefined){
            options.drawTexts.forEach( function(textParams) {
                var txt = textParams[0];
                if(textParams[0].length > (options.counter-options.graphFinished)/4){
                    txt = textParams[0].substr(0, (options.counter-options.graphFinished)/4);
                    stopAnimation = false;
                }

                drawText(options.id, txt, textParams[1], textParams[2], textParams[3], textParams[4], textParams[5], textParams[6]);
            });
        }

        if(options.drawArrows != undefined){
            options.drawArrows.forEach( function(arrowParams){
                var startX = arrowParams[0];
                var startY = arrowParams[1];
                var diffX = startX - arrowParams[2];
                var diffY = startY - arrowParams[3];
                var ratio = diffX/diffY; // Arrow growing straight
                var endX = startX + (options.counter-options.graphFinished)*ratio;
                var endY = startY + options.counter-options.graphFinished;

                if(endX >= arrowParams[2]){
                    endX = arrowParams[2];
                }else{
                    stopAnimation = false;
                }
                if(endY >= arrowParams[3]){
                    endY = arrowParams[3];
                }else{
                    stopAnimation = false;
                }

                drawArrow(options.id, startX, startY, endX, endY, arrowParams[4], arrowParams[5]);
            });
        }
    }

    if(!stopAnimation){
        requestAnimFrame(function() {
            Grapher(data, options, drawTime);
        });
    }else if(isFunction(options.drawAtEnd)){
        options.drawAtEnd();
    }
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/* ------- */
/* EXAMPLE */
/* ------- */
//var data = [
//    {
//        value: 17, // Numeric value of the data
//        prefix: '', // Prefix to write before the value in the bar label
//        suffix: '%', // Suffix to write after the value in the bar label
//        color: '#a3a3a3' // Color of the bar
//    },
//    {
//        value: 1,
//        prefix: '',
//        suffix: '%',
//        color: '#FAB800'
//    }
//];
//
//var graphic = new Grapher(data, {
//    id: "canvasId",
//    drawTexts: [ [ '35%', 190, 70, 30, 'Avenir-Heavy', '#0E77BE', "center" ], [ 'p=NS', 260, 80, null, null, null, null ] ], // Animated
//    drawArrows: [ [ 137, 43, 178, 129, '#0E77BE', 0 ] ], // Animated
//    drawAtEnd: function(){ drawText(idGraph3, 'p=NS', 260, 80); }, // Not animated
//    legend: {
//        x: {
//            label: 'Cycles', // Title of the axe X
//            color: 'black', // Text color of the axe X
//            size: 12, // Text size of the axe X
//            group: { // Use this to group bars
//                labels: ['1', '2', '3', '4', '5'], // X labels
//                bars: 2, // Number of the bars per group
//                spacing: 15, // Space between the groups (summed with the space between bars)
//            }
//        },
//        y: {
//            label: '% of patients', // Title of the axe Y
//            color: 'black', // Text color of the axe Y
//            size: 12, // Text size of the axe Y
//        },
//        datas: {
//            x: 100, // Legend X position
//            y: 100, // Legend Y position
//            size: 12, // Text size of the legend
//            spacing: 5, // Space between each labels of the legend
//            color: 'black', // Text color of the legend
//            labels: [ // Labels in the legend
//                {
//                    label: 'Placebo (n=465)', // Text of the label
//                    color: '#a3a3a3', // Color of the square before the label
//                },
//                {
//                    label: 'Neulasta® (n=463)',
//                    color: '#FAB800',
//                }
//            ]
//        }
//    },
//    chart: {
//        spacing: 5, // Value of the steps for the chart
//        overrideMax: 20, // Override the maximum value of the chart
//        margin: 10, // Margin on each side of the chart
//        size: 12, // Text size of the chart
//        color: 'black', // Text color of the chart
//        background: 'white', // Background of the chart
//    },
//    bars: {
//        width: 65, // Graphic bar width
//        spacing: 40, // Space betweens bars
//        label: {
//            size: 32, // Text size of the bar's labels
//            margin: 10 // Text margin between the label and the bar top
//        }
//    }
//});
