const VideoPlayStateEnum = {
  NOTPLAYING: 0,
  PLAYING: 1,
  PAUSED: 2
};

ARVideo = function(item, parentside, parentstage) {
	var _this = this;
 	this.UID = null;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	/* this.nodeName = null;
	this.videoTexture = null;
	this.videPlayer = null;
	this.videoCurrentStatus = null;
	this.defaultTexture = null;
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.VIDEOTEXTURE);
	}
	
	if (item.hasOwnProperty('nodename'))
	{
		this.nodeName = item.nodename;
	}
	
	this.videPlayer = document.createElement("video");
	this.videPlayer.autoplay = false; 
	this.videPlayer.controls = false;
	this.videPlayer.loop = false;
	this.videPlayer.height = 640; 
	this.videPlayer.width = 360;
	this.videoCurrentStatus = VideoPlayStateEnum.NOTPLAYING;
	
	//event listeners
	this.videPlayer.addEventListener("play", videoPlay, false);
	this.videPlayer.addEventListener("pause", videoPause, false);	
	this.videPlayer.addEventListener("ended", videoEnded, false);	
	this.videPlayer.addEventListener('error', (event) => {
		let error = event;
		// Chrome v60
		if (event.path && event.path[0]) {
		error = event.path[0].error;
			}
			// Firefox v55
			if (event.originalTarget) {
				error = error.originalTarget.error;
			}
			// Here comes the error message
			console.log("video error " + error.message);
			//window.URL.revokeObjectURL(url);
	}, false);
	
	this.videoTexture = new THREE.VideoTexture( video );
	
	
	
	function videoPlay()
	{
		this.videoCurrentStatus = VideoPlayStateEnum.PLAYING;
	};

	function videoPause()
	{
		this.videoCurrentStatus = VideoPlayStateEnum.PAUSED;
	};

	function videoEnded()
	{
		this.videoCurrentStatus = VideoPlayStateEnum.NOTPLAYING;
	}; */
}

ARVideo.prototype.constructor = ARVideo;

ARVideo.prototype.update = function(){
	
	
}

ARVideo.prototype.dispose = function(){
	
	/* this.videPlayer.currentTime == 0;
	//event listeners
	this.videPlayer.removeEventListener("play", videoPlay, false);
	this.videPlayer.removeEventListener("pause", videoPause, false);	
	this.videPlayer.removeEventListener("ended", videoEnded, false);	
	this.videPlayer.removeEventListener('error', (event) => {
		let error = event;

		// Chrome v60
		if (event.path && event.path[0]) {
			error = event.path[0].error;
		}

		// Firefox v55
		if (event.originalTarget) {
			error = error.originalTarget.error;
		}

		// Here comes the error message
		console.log("video error " + error.message);

		//window.URL.revokeObjectURL(url);
	}, false);
	
	this.videPlayer = null;
	
	
 	this.UID = null;
	this.parentSide = null;
	this.parentStage = null;
	this.nodeName = null;
	this.material = null; */
}