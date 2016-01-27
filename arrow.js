/* ------- */
/* EXAMPLE */
/* ------- */
//drawArrow('grapher', 50, 50, 275, 275, '#0E77BE', false);
function drawArrow(canvasId, startX, startY, endX, endY, color, doubleArrow){
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    // create a new line object
    var line = new Line(startX, startY, endX, endY);

    // draw the line
    line.drawWithArrowheads(context, color, doubleArrow);
}

function Line(x1,y1,x2,y2){
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
}

Line.prototype.drawWithArrowheads=function(ctx, color, doubleArrow){

    // arbitrary styling
    ctx.strokeStyle=color?color:"blue";
    ctx.fillStyle=color?color:"blue";
    ctx.lineWidth=1;

    // draw the line
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.stroke();

    // draw the starting arrowhead
    if(doubleArrow){
        var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
        this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
    }

    // draw the ending arrowhead
    var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
    this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
}

Line.prototype.drawArrowhead=function(ctx,x,y,radians){
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.lineTo(5,20);
    ctx.lineTo(-5,20);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}
