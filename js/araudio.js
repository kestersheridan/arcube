ARAudio = function(item, parentside) {
	var _this = this;
	this.UID = null;
	this.parentSide = parentside;
	this.playOnOpening = false;
	this.audioPlayer = null;
	this.loop = false;
	this.pauseTimerClock = new THREE.Clock();
	this.storedElapsedTime = 0;
	this.storedVolume = 1;
	this.currentVolume = 1;
	this.volumeScale = 1;
	this.dynamicVolume = false;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.AUDIOCLIP);
	}
	
	if (item.hasOwnProperty('volume'))
	{
		this.storedVolume = item.volume;;
		this.currentVolume = item.volume;;
	}
	if (item.hasOwnProperty('dynamicvolume'))
	{
		this.dynamicVolume = item.dynamicvolume;	
	}
	
	if (item.hasOwnProperty('playonopening'))
	{	
		this.playOnOpening = item.playonopening;
	}
	if (item.hasOwnProperty('loop'))
	{	
		this.loop = item.loop;
	}
		
	
	this.audioPlayer = document.createElement('AUDIO' );
	this.audioPlayer.autoplay = false; 
	this.audioPlayer.controls = false;
	this.audioPlayer.loop = this.loop;
	this.audioPlayer.volume = this.currentVolume;
	this.audioPlayer.muted = true;
	console.log("this.audioPlayer can play videos " + this.audioPlayer.canPlayType('audio/mp3')); 
	this.audioCurrentStatus = MediaPlayStateEnum.NOTINITIALISED;

	this.storedAudioStatus = null;
	//event listeners

	this.audioPlayer.addEventListener("ended", audioEnded, false);
	this.audioPlayer.addEventListener('error', (event) => {
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
			console.log("audio error " + error.message);
			//window.URL.revokeObjectURL(url);
	}, false);
	
	this.playAudio = async function() {
	  try {
		await _this.audioPlayer.play();
		_this.audioCurrentStatus = MediaPlayStateEnum.PLAYING;
	  } catch(err) {
		  console.log("play error : " + err);
		_this.audioCurrentStatus = MediaPlayStateEnum.ERROR;
	  }
	}
	
	this.pauseAudio = function() {
	  try {
		_this.audioPlayer.pause();
		_this.audioCurrentStatus = MediaPlayStateEnum.PAUSED;
	  } catch(err) {
		  console.log("pause error : " + err);
		_this.audioCurrentStatus = MediaPlayStateEnum.ERROR;
	  }
	}
	
	
	var loader = new THREE.FileLoader(g_loadingManager);
	loader.setResponseType ( 'arraybuffer' );
	loader.load( 'assets/audio/' + item.audio, function ( data ) {
		var blob = new Blob([data], {type: 'audio\/mp3'});
		clip = webkitURL.createObjectURL(blob);
		// Audio is now downloaded
		// and we can set it as source on the audio element
		_this.audioPlayer.preload = 'auto';
		_this.audioPlayer.src = clip;
		console.log("loaded audio " + clip); 
		_this.pauseAudio();
	})
	
	function audioEnded()
	{
		//if ((_this.audioCurrentStatus == MediaPlayStateEnum.PLAYING) && (_this.audioPlayer.currentTime == _this.audioPlayer.duration))
		if ((_this.audioCurrentStatus == MediaPlayStateEnum.PLAYING) && (!_this.audioPlayer.loop))	
		{
			_this.audioCurrentStatus = MediaPlayStateEnum.ENDED;
		}
	};
}

ARAudio.prototype.constructor = ARAudio;

ARAudio.prototype.InitialisePlayback = function(){
	this.volumeScale = 1;
	console.log("InitialisePlayback");
	this.currentVolume = this.storedVolume;
	//this.audioPlayer.volume = 0.0;
	this.audioPlayer.muted = true;
	//
	//this.pauseAudio();
	

	var playPromise = this.audioPlayer.play();
 
	if (playPromise !== undefined) {
			playPromise.then(_ => {
		  this.audioPlayer.currentTime = 0;
		  this.audioPlayer.pause();
		  this.audioPlayer.volume = (this.currentVolume * this.volumeScale);
		})
		.catch(error => {
			
		});
	  }

}

ARAudio.prototype.isDynamicVolume = function(){
	return this.dynamicVolume;
}

ARAudio.prototype.play = function(){
	if (this.audioCurrentStatus != MediaPlayStateEnum.PLAYING)
	{
		if (this.audioCurrentStatus == MediaPlayStateEnum.ENDED)
		{
			this.audioPlayer.currentTime = 0;
		}
		if (this.audioPlayer.muted)
		{
			this.audioPlayer.muted = false;
		}
		this.playAudio();
	}
}

ARAudio.prototype.playAt = function(value){
	if (this.audioCurrentStatus != MediaPlayStateEnum.PLAYING)
	{
		if (Math.abs(value) < this.audioPlayer.duration)
		{			
			this.audioPlayer.currentTime = Math.abs(value);
		}
		else
		{
			this.audioPlayer.currentTime = 0;
		}
		if (this.audioPlayer.muted)
		{
			this.audioPlayer.muted = false;
		}
		this.playAudio();
	}
}

ARAudio.prototype.pause = function(){
	if (this.audioCurrentStatus == MediaPlayStateEnum.PLAYING)
	{
		this.pauseAudio();
	}
}

ARAudio.prototype.setVolume = function(value, scale){
	if (value != null)
	{
		this.currentVolume = value;
	}
	if (scale != null)
	{
		this.volumeScale = scale;	
	}
	//this.audioPlayer.volume = (this.currentVolume * this.volumeScale);
	this.audioPlayer.volume = this.volumeScale;
}

ARAudio.prototype.getVolume = function(){
	return this.currentVolume;
}

ARAudio.prototype.getType = function(){
	return ObjectTypeEnum.AUDIOCLIP;
}

ARAudio.prototype.StartActivePlayback = function(){
	
 	if (this.playOnOpening)
	{
		if (this.audioPlayer.muted)
		{
			this.audioPlayer.muted = false;
		}
		this.playAudio();
	}
}

ARAudio.prototype.getCurrentStatus = function(){
	return this.audioCurrentStatus;
}

ARAudio.prototype.deactivate = function(){
	
	this.storedAudioStatus = this.audioCurrentStatus;
	if (this.audioCurrentStatus == MediaPlayStateEnum.PLAYING)
	{
		if (g_browserType == BrowserTypeEnum.SAFARI)
		{
			this.pauseTimerClock.start();
			
			//this.videoTimerClock.stop();
		}
		this.pauseAudio();
		this.isDeactivate = true;
	}
}

ARAudio.prototype.reactivate = function(){
	
	if (this.storedAudioStatus == MediaPlayStateEnum.PLAYING)
	{
		if (g_browserType == BrowserTypeEnum.SAFARI)
		{
			this.storedElapsedTime += this.pauseTimerClock.getElapsedTime();
			this.pauseTimerClock.stop();
			//this.videoTimerClock.start();
		}
		this.playAudio();
		this.isDeactivate = false;
	}
}

ARAudio.prototype.dispose = function(){
	this.pauseAudio();
	this.audioPlayer.currentTime == 0;
	this.pauseTimerClock.stop();
	this.pauseTimerClock = null;
	//event listeners

	this.audioPlayer.removeEventListener("ended", this.audioEnded, false);	
	this.audioPlayer.removeEventListener('error', (event) => {
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
		console.log("audio error " + error.message);

		//window.URL.revokeObjectURL(url);
	}, false);
	
	this.audioPlayer = null;
	
 	this.UID = null;
	this.parentSide = null;
}