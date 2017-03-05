var fpsPump = new FPSPumpkin();
var fosse = new Fosse();

var canvas = document.getElementById("target");
var ctx = canvas.getContext('2d');

var blankCanvas = null;

fosse.attach(canvas);

function renderLoop(){
	fpsPump.beginMeasurement();

	size(sized)

	function sized(){
		clear(cleared);
	}
	function cleared(){
		var state = fosse.getState();
		draw(state, drawn);
	}
	function drawn(){
		fpsPump.endMeasurement();
		requestAnimationFrame(renderLoop);
	}
}
requestAnimationFrame(renderLoop);

function size(next){
	var parent = canvas.parentNode;
	var width = parent.clientWidth;
	var height = parent.clientHeight;
	var sized = false;
	if((canvas.width !== width) || (canvas.height !== height)){
		sized=true;
		canvas.width = width;
		canvas.height = height;
	}
	if(sized){
		blankCanvas = ctx.getImageData(0,0,canvas.width, canvas.height);
	}

	if(typeof next === "function"){
		next();
	}
}

function clear(next){
	if(blankCanvas){
		ctx.putImageData(blankCanvas, 0,0);
	}else{
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}
	// ctx.beginPath();
	// ctx.fillStyle="white";
	// ctx.fillRect(0,0,canvas.width, canvas.height);
	// canvas.width = canvas.width
	// ctx.clearRect(0,0,100, 100);
	// ctx.fill();
	if(typeof next === "function"){
		next();
	}
}

function draw(state, next){

	var fps = fpsPump.getFPS();
	var frameTime = fpsPump.getMeasurementDuration();

	var arr = [
		"isMoving: " + state.isMoving,
		"canTouch: " + state.canTouch,
		"FPS: " + fps,
		"Frametime: " + frameTime + " ms",
		"X: "+ state.x,
		"Y: "+ state.y,
		"startX: "+ state.startX,
		"startY: "+ state.startY,
		"dX: " + state.diffX,
		"dY: " + state.diffY,
		"dragDiffX: " + state.dragDiffX,
		"dragDiffY: " + state.dragDiffY,
		"velocity: " + state.velocity,
		"velocityX: " + state.velocityX,
		"velocityY: " + state.velocityY,
		"--- buttons ---",
		"any: " + state.buttons.any,
		"left: " + state.buttons.left,
		"right: " + state.buttons.right,
		"middle: " + state.buttons.middle,
		"fourth: " + state.buttons.fourth,
		"fifth: " + state.buttons.fifth,
		"--- directions ---",
		"N: " +state.directions.north,
		"S: " +state.directions.south,
		"E: " +state.directions.east,
		"W: " +state.directions.west,
		"NE: " +state.directions.northEast,
		"NW: " +state.directions.northWest,
		"SE: " +state.directions.southEast,
		"SW: " +state.directions.southWest,
		"U: " +state.directions.up,
		"L: " +state.directions.left,
		"D: " +state.directions.down,
		"R: " +state.directions.right,
		"UL: " +state.directions.upLeft,
		"UR: " +state.directions.upRight,
		"DL: " +state.directions.downLeft,
		"DR: " +state.directions.downRight,
		"--- wheel ---",
		"delta: " + state.wheelDelta,
		"deltaX: " + state.wheelDeltaX,
		"deltaY: " + state.wheelDeltaY,
	]

	drawTextArray(arr, drawnText);

	function drawnText(){
		if(state.isDragging){
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.moveTo(state.startX, state.startY)
			ctx.lineTo(state.x, state.y);
			if(state.modKeys.shift){
				ctx.strokeStyle = "red";
			}else{
				ctx.strokeStyle = "black";
			}
			ctx.stroke()
		}
		if(typeof next === "function"){
			next();
		}
	}


	// if(typeof next === "function"){
	// 	next();
	// }
}

function drawTextArray(linesArray, next){
	var lineHeight = 16;
	ctx.fillStyle = "black";
	for(var i = 0; i < linesArray.length; i++){
		var lh = lineHeight * (i+1);
		var text = linesArray[i];
		ctx.fillText(text, 3, lh);
	}
	if(typeof next === "function"){
		next();
	}
}