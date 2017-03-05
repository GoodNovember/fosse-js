function FPSPumpkin(config){
	var self = this;

	var currentFPS = 0;
	var totalFrames = 0;
	var countedFrames = 0;

	var measurementStartTimestamp = 0;
	var measurementEndTimestamp = 0;
	var previousSecond = 0;

	function init(){
		console.log("INIT FPS PUMPKIN");

		// self.beginMeasurement = begin;
		self.reset = reset;
		self.beginMeasurement = begin;
		self.endMeasurement = end;
		self.getFPS = getCurrentFPS;
		self.getMeasurementDuration = getMeasurementDuration;
		self.getTotalFrames = getTotalFrames;
	}init();

	function begin(){
		measurementStartTimestamp = getTimestamp();
	}

	function end(callback){
		totalFrames++;
		countedFrames++;
		
		var now = getTimestamp();
		
		if(now > (previousSecond + 1000)){
			currentFPS = (countedFrames * 1000) / (now - previousSecond);
			if(typeof callback === "function"){
				callback(currentFPS);
			}
			countedFrames = 0;
			previousSecond = now;
		}

		measurementEndTimestamp = now;
	}

	function reset(){
		previousSecond = 0;
		countedFrames = 0;
		currentFPS = 0;
		totalFrames = 0;
		measurementEndTimestamp = 0;
		measurementStartTimestamp = 0;
	}

	function getTimestamp(){
		if(window.performance && window.performance.now){
			return window.performance.now();
		}else if(Date.now){
			return Date.now();
		}else{
			return Date.getTime();
		}
	}

	function getMeasurementDuration(){
		return measurementStartTimestamp - measurementEndTimestamp;
	}

	function getCurrentFPS(){
		return currentFPS;
	}

	function getTotalFrames(){
		return totalFrames;
	}


}