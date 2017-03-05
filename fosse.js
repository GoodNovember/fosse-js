function Fosse(options){
	var self = this;

	var label = "[FOSSE]"

	var isDebugMode = true;

	var allowRightClick = false;

	var lastMoveTimestamp = 0;
	var lastWheelEvent = 0;

	var lastVelocity = 0;
	var lastVelocityX = 0;
	var lastVelocityY = 0;

	var globalState = {
		isMoving:false,
		canTouch:false,
		isTargeted:false,
		isDragging:false,
		isTouching:false,
		isTouchMode:false,
		velocity:null,
		velocityX:null,
		velocityY:null,
		startX:null,
		startY:null,
		x:null,
		y:null,
		lastX:null,
		lastY:null,
		diffX:null,
		diffY:null,
		dragDiffX:null,
		dragDiffY:null,
		wheelDelta:0,
		wheelDeltaX:0,
		wheelDeltaY:0,
		directions:{
			up:false,
			down:false,
			left:false,
			right:false,
			upLeft:false,
			upRight:false,
			downLeft:false,
			downRight:false,
			north:false,
			south:false,
			east:false,
			west:false,
			northEast:false,
			northWest:false,
			southEast:false,
			southWest:false,
		},
		buttons:{
			left:false,
			right:false,
			middle:false,
			fourth:false,
			fifth:false,
			any:false,
		},
		modKeys:{
			alt:false,
			meta:false,
			shift:false,
			ctrl:false,
		}
	};

	var noAEL = typeof window.addEventListener !== "function";
	var supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() {
			supportsPassive = true;
			}
		});
		window.addEventListener("test", null, opts);
	} catch (e) {}

	function init(){

		self.attach = attach;
		self.getState = getState;

	}init();

	function attach(input){

		var elm = null;

		switch(typeof input){
			case "string":
				var test = document.querySelector(input);
				if(test instanceof Element){
					elm = test;
				}else{
					log("The string you gave me does not point to anything I can attach to.",input, test)
				}
				break;
			case "object":
				if(!input){
					log("I cannot attach to a null.", input);
					break;
				}
				// otherwise we continue downward.
			case "function":
				if(input instanceof Element){
					elm = input;
				}else{
					var test = input();
					if(test instanceof Element){
						elm = test;
					}
					else{
						log("I cannot attach to this:", input, test);
					}
				}
				break;
			default:
				log("I don't know what you tried to make me do but I don't like it.", input);
				break;
				
		}

		if(elm){
			log('Got an element!', elm);
			setupEventMachinery(elm);
		}else{
			log("Don't have an element.");
		}

	}

	function getState(){
		return globalState;
	}

	function setupEventMachinery(elm){
		log('SETTING UP EVENT Machinery');

		addListenerTo(elm, "mousedown", mouseDownHandler);
		function mouseDownHandler(event){
			// console.log("DOWN", event);
			handleMouseButtons(event);
			if(globalState.buttons.left){
				globalState.startX = event.clientX;
				globalState.startY = event.clientY;
				globalState.dragDiffX = 0;
				globalState.dragDiffY = 0;
				globalState.isDragging = true;
			}
			// console.log("GS - down", globalState);
		}	

		addListenerTo(elm, "touchend", mouseUpHandler);

		addListenerTo(elm, "mouseup", mouseUpHandler);
		function mouseUpHandler(event){
			// console.log("UP", event);
			handleMouseButtons(event);
			if(globalState.buttons.any === false){
				globalState.isDragging = false;
				globalState.startX = null;
				globalState.startY = null;
				globalState.dragDiffX = null;
				globalState.dragDiffY = null;
				globalState.velocity = null;
				globalState.velocityX = null;
				globalState.velocityY = null;
				handleDirection();
			}
			// console.log("GS - up", globalState);
		}

		addListenerTo(elm, "mouseenter", mouseEnterHandler);
		function mouseEnterHandler(event){
			touchDetector(event);
			globalState.isTargeted = true;
		}

		addListenerTo(elm, "mouseleave", mouseLeaveHandler);
		function mouseLeaveHandler(event){
			globalState.isTargeted = false;
			globalState.isDragging = false;
			globalState.lastX = null;
			globalState.lastY = null;
			globalState.diffX = null;
			globalState.diffY = null;
			globalState.dragDiffX = null;
			globalState.dragDiffY = null;
			globalState.x = null;
			globalState.y = null;
			globalState.velocity = null;
			globalState.velocityX = null;
			globalState.velocityY = null; 
			globalState.isMoving = false;
			handleDirection();
		}

		addListenerTo(elm, "mousewheel", mouseWheelHandler);
		function mouseWheelHandler(event){
			// console.log("EVENT", event);

			globalState.wheelDeltaX = event.wheelDeltaX;
			globalState.wheelDeltaY = event.wheelDeltaY;
			globalState.wheelDelta = event.wheelDelta;

			lastWheelEvent = event.timeStamp;
		}

		addListenerTo(elm, "mousemove", mouseMoveHandler);
		function mouseMoveHandler(event){
			touchDetector(event);
			handleMouseButtons(event);

			var time = event.timeStamp;
			var duration = time - lastMoveTimestamp;

			// console.log("MOVE", event);

			if(globalState.canTouch === false){
				globalState.isMoving = true;
				globalState.lastX = globalState.x;
				globalState.lastY = globalState.y;
				globalState.x = event.clientX;
				globalState.y = event.clientY;
				globalState.diffX = globalState.x - globalState.lastX;
				globalState.diffY = globalState.y - globalState.lastY;
				globalState.velocityX = Math.abs(globalState.diffX / duration);
				globalState.velocityY = Math.abs(globalState.diffY / duration);
				if(globalState.velocityX > globalState.velocityY){
					globalState.velocity = globalState.velocityX;
				}else{
					globalState.velocity = globalState.velocityY;
				}
				lastMoveTimestamp = time;
			}

			if(globalState.isDragging){
				globalState.dragDiffX = globalState.x - globalState.startX
				globalState.dragDiffY = globalState.y - globalState.startY
			}

			handleDirection();

			
		}

		// TOUCH EVENTS!
		addListenerTo(elm, "touchstart", touchStartHandler);
		function touchStartHandler(event){
			touchDetector(event);
			log("touchStart", event );
		}

		

		addListenerTo(elm, "contextmenu", contextMenuHandler)
		function contextMenuHandler(event){
			if(!allowRightClick){
				event.preventDefault();
			}
		}

		function handleMouseButtons(event){
			var map = {
				0: parse("00000"),
				1: parse("10000"),
				2: parse("01000"),
				3: parse("11000"),
				4: parse("00100"),
				5: parse("10100"),
				6: parse("01100"),
				7: parse("11100"),
				8: parse("00010"),
				9: parse("10010"),
				10:parse("01010"),
				11:parse("11010"),
				12:parse("00110"),
				13:parse("10110"),
				14:parse("01110"),
				15:parse("11110"),
				16:parse("00001"),
				17:parse("10001"),
				18:parse("01001"),
				19:parse("11001"),
				20:parse("00101"),
				21:parse("10101"),
				22:parse("01101"),
				23:parse("11101"),
				24:parse("00011"),
				25:parse("10011"),
				26:parse("01011"),
				27:parse("11011"),
				28:parse("00111"),
				29:parse("10111"),
				30:parse("01111"),
				31:parse("11111")
			}
			function parse(str){

				var btns = {
					0:"left",
					1:"right",
					2:"middle",
					3:"fourth",
					4:"fifth"
				}

				var output = {};
				var anyWerePressed = false;
				for(var i = 0; i < str.length; i++){
					var btnPressed = parseInt(str[i]);
					if(!anyWerePressed && btnPressed === 1){
						anyWerePressed = true;
					}
					output[btns[i]] = btnPressed === 1;
				}
				output.any = anyWerePressed;
				return output;
			}
			if(typeof event.buttons === "number"){
				globalState.buttons = map[event.buttons];
			}
			globalState.modKeys = {
				shift:event.shiftKey === true,
				meta:event.metaKey === true,
				altKey:event.altKey === true,
				ctrlKey:event.ctrlKey === true
			}
		}

		function touchDetector(event){
			if(event.sourceCapabilities){
				globalState.canTouch = event.sourceCapabilities.firesTouchEvents
			}
			if(globalState.canTouch && event.touches){
				globalState.isTouching = event.touches.length > 0;
			}
		}

		function handleDirection(){
			var isUp = false;
			var isDown = false;
			var isLeft = false;
			var isRight = false;
			if(globalState.dragDiffX > 0){
				isRight = true;
			}else if(globalState.dragDiffX < 0){
				isLeft = true;
			}
			if(globalState.dragDiffY > 0){
				isDown = true;
			}else if(globalState.dragDiffY < 0){
				isUp = true;
			}

			var isUpLeft = false;
			var isUpRight = false;
			var isDownLeft = false;
			var isDownRight = false;

			if(isUp){
				if(isLeft){
					isUpLeft = true;
				}else if(isRight){
					isUpRight = true;
				}
			}else if(isDown){
				if(isLeft){
					isDownLeft = true;
				}else if( isRight){
					isDownRight = true;
				}
			}

			var mapped = {
				up:isUp,
				left:isLeft,
				down:isDown,
				right:isRight,
				upLeft:isUpLeft,
				upRight:isUpRight,
				downLeft:isDownLeft,
				downRight:isDownRight,
				north:isUp,
				west: isLeft,
				south: isDown,
				east: isRight,
				northEast: isUpRight,
				northWest: isUpLeft,
				southEast: isDownRight,
				southWest: isDownLeft,
			}

			globalState.directions = mapped;

		}

		requestAnimationFrame(garbageMan);
	}

	function garbageMan(timeStamp){

		if((timeStamp - lastMoveTimestamp > 60) && (globalState.isTargeted)){
			if(globalState.isTargeted){
				globalState.isMoving = false;
				globalState.velocity = 0;
				globalState.velocityX = 0;
				globalState.velocityY = 0;
				globalState.diffX = 0;
				globalState.diffY = 0;
			}else{
				globalState.isMoving = false;
				globalState.velocity = null;
				globalState.velocityX = null;
				globalState.velocityY = null;
				globalState.diffX = null;
			}

			
		}

		if(timeStamp - lastWheelEvent > 100){
			globalState.wheelDelta = 0;
			globalState.wheelDeltaX = 0;
			globalState.wheelDeltaY = 0;
		}

		requestAnimationFrame(garbageMan);
	}

	function addListenerTo(elm, eventNameStr, handlerFn, useCapture, wantsPassive){
		if(noAEL){
			elm.attachEvent("on" + eventNameStr, handlerFn);
		}else{
			if(supportsPassive && wantsPassive){
				elm.addEventListener(eventNameStr, handlerFn, {capture: useCapture, passive: true})
			}else{
				elm.addEventListener(eventNameStr, handlerFn, useCapture)
			}
		}
	}
	function removeListenerFrom(elm, eventNameStr, handlerFn){
		if(noAEL){
			elm.detachEvent("on" + eventNameStr, handlerFn);
		}else{
			elm.removeEventListener(eventNameStr, handlerFn)
		}
	}

	function log(){
		if(isDebugMode){

			var args = [label];

			for(var i = 0; i < arguments.length; i++){
				arg = arguments[i];
				args.push(arg);
			}

			if(console.log){
				console.log.apply(this, args);
			}
		}
	}
}