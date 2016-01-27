function drawText(canvasId, text, posX, posY, size, font, color, textAlign){
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");

    var textFont = font?font:'Avenir-Medium';
    var textSize = size?size:12;

    ctx.save();

    ctx.fillStyle = color?color:'black';
    ctx.textAlign = textAlign?textAlign:"left";
    ctx.font = textSize+"px "+textFont;
    //ctx.rotate(-Math.PI/2);
    ctx.fillText(text, posX, posY);

    ctx.restore();
}
