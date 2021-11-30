const ChapterPlayStateEnum = {
  NOTPLAYING: 0,
  PLAYING: 1,
  ENDED: 2
};


const VideoTextureStateEnum = {
  INITIALISEVIDEO: 0,
  STARTVIDEO: 1,
  VIDEOPLAYBACK: 2,
  SAFARIVIDEOPLAYBACK: 3,
  VIDEOQUEUED: 4
  
};

ARVideoTexture = function(item, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.nodeName = null;
	this.videoTexture = null;
	this.videoPlayer = null;
	this.videoChapters = new Array;
	this.currentChapter = null;
	this.currentChapterUID = null;
	this.queueAfterEnd = null;
	this.nextQueuedChapter = null;
	this.nextQueuedChapterUID = null;
	this.startOnOpening = true;
	this.defaultChapter = null;
	this.firstTime = true;
	this.isDeactivate = false;
	this.videoTimerClock = new THREE.Clock();
	this.pauseTimerClock = new THREE.Clock();
	this.storedElapsedTime = 0;
	this.storedVolume = 1;
	this.currentVolume = 1;
	this.volumeScale = 1;
	this.videoMesh = null;
	this.dynamicVolume = false;
	this.videoTextureState = VideoTextureStateEnum.INITIALISEVIDEO;
	this.currentChapterStatus = ChapterPlayStateEnum.NOTPLAYING;
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.VIDEOTEXTURE);
	}
	
	if (item.hasOwnProperty('dynamicvolume'))
	{
		this.dynamicVolume = item.dynamicvolume;	
	}
	
	if (item.hasOwnProperty('volume'))
	{
		this.storedVolume = item.volume;;
		this.currentVolume = item.volume;;
	}
	
	if (item.hasOwnProperty('nodename'))
	{
		this.nodeName = item.nodename;
	}
	
	if (item.hasOwnProperty('startonopening'))
	{	
		this.startOnOpening = item.startonopening;
	}
	
	if (item.hasOwnProperty('chapters'))
	{	
		if (item.chapters.length > 0)
		{
			for (let i = 0; i < item.chapters.length; i++)
			{
				if (item.chapters[i].chapter.hasOwnProperty('default'))
				{
					if (item.chapters[i].chapter.default)
					{
						this.defaultChapter = i;
						this.currentChapter = i;
					}
				}
				var videochapter = new VideoChapter(item.chapters[i].chapter.uid, item.chapters[i].chapter.start, item.chapters[i].chapter.end, item.chapters[i].chapter.loop);
				this.videoChapters.push(videochapter);
			}
		}
	}
	
	if (g_isIPhone)
	{
		this.videoPlayer = document.getElementById( 'videoplayer' );		
	}
	else
	{
		this.videoPlayer = document.createElement('video' );
		this.videoPlayer.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );	
	}
	this.videoPlayer.autoplay = false; 
	this.videoPlayer.controls = false;
	this.videoPlayer.loop = false;
	this.videoPlayer.volume = this.currentVolume;
	this.videoCurrentStatus = MediaPlayStateEnum.NOTINITIALISED;
	this.storedVideoStatus = null;
 	console.log("this.videoPlayer can play videos " + this.videoPlayer.canPlayType('video/mp4')); 
	//event listeners
	this.videoPlayer.addEventListener("play", videoPlay, false);
	this.videoPlayer.addEventListener("playing", videoPlaying, false);
	this.videoPlayer.addEventListener("pause", videoPause, false);	
	this.videoPlayer.addEventListener("ended", videoEnded, false);

	this.videoPlayer.addEventListener('error', (event) => {
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
	
	this.playVideo = null;
	if (g_browserType == BrowserTypeEnum.SAFARI)
	{
		this.playVideo = function() {
			_this.videoPlayer.play();
		}
	}
	else
	{
		this.playVideo = async function() {
		  try {
			await _this.videoPlayer.play();
			_this.videoCurrentStatus = MediaPlayStateEnum.PLAYING;
		  } catch(err) {
			_this.videoCurrentStatus = MediaPlayStateEnum.ERROR;
		  }
		}
	}
	
	this.pauseVideo = null;
	if (g_browserType == BrowserTypeEnum.SAFARI)
	{
		this.pauseVideo = function() {
			_this.videoPlayer.pause();
		}
	}
	else
	{
		this.pauseVideo = function() {
		  try {
			_this.videoPlayer.pause();
			_this.videoCurrentStatus = MediaPlayStateEnum.PAUSED;
		  } catch(err) {
			_this.videoCurrentStatus = MediaPlayStateEnum.ERROR;
		  }
		}
	}
	
	this.videoTexture = new THREE.VideoTexture(this.videoPlayer);
	this.videoTexture.minFilter = THREE.LinearFilter;
	this.videoTexture.magFilter = THREE.LinearFilter;
	this.videoTexture.format = THREE.RGBFormat;
	var loader = new THREE.FileLoader(g_loadingManager);
	loader.setResponseType ( 'arraybuffer' );
	loader.load( 'assets/videos/' + item.video, function ( data ) {
		var blob = new Blob([data], {type: 'video\/mp4'});
		vid = webkitURL.createObjectURL(blob);
		// Video is now downloaded
		// and we can set it as source on the video element
		_this.videoPlayer.preload = 'auto';
		_this.videoPlayer.src = vid;
		
	})
	
	
	function videoPlay()
	{

		_this.videoCurrentStatus = MediaPlayStateEnum.PLAYING;
	};
	
	function videoPlaying()
	{

		_this.videoCurrentStatus = MediaPlayStateEnum.PLAYING;
	};

	function videoPause()
	{

		_this.videoCurrentStatus = MediaPlayStateEnum.PAUSED;
	};

	function videoEnded()
	{

		_this.videoCurrentStatus = MediaPlayStateEnum.NOTPLAYING;
	};
	
	
	function VideoChapter(uid, start, end, loop)
	{
		this.uid = uid;
		this.startTime = start;
		this.endTime = end;
		this.loop = loop;
		
	}
}

ARVideoTexture.prototype.constructor = ARVideoTexture;


ARVideoTexture.prototype.setup = function(mesh){
	this.videoMesh = mesh;
	this.videoMesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: this.videoTexture });
}

ARVideoTexture.prototype.getNodeName = function(){
	return this.nodeName;
}

ARVideoTexture.prototype.isDynamicVolume = function(){
	return this.dynamicVolume;
}

ARVideoTexture.prototype.setVolume = function(value, scale){
	if (value != null)
	{
		this.currentVolume = value;
	}
	if (scale != null)
	{
		this.volumeScale = scale;	
	}
	this.videoPlayer.volume = (this.currentVolume * this.volumeScale);

}

ARVideoTexture.prototype.getVolume = function(){
	return this.currentVolume;
}

ARVideoTexture.prototype.getType = function(){
	return ObjectTypeEnum.VIDEOTEXTURE;
}

ARVideoTexture.prototype.InitialisePlayback = function(){
	this.volumeScale = 1;
	this.currentVolume = this.storedVolume;
	this.videoPlayer.volume = (this.currentVolume * this.volumeScale);
	this.videoTextureState = VideoTextureStateEnum.INITIALISEVIDEO;

	this.videoPlayer.currentTime = 0;
	this.playVideo();
	if (this.defaultChapter != null) 
	{
		this.currentChapterUID = this.videoChapters[this.defaultChapter].uid;
		this.currentChapter = this.defaultChapter;
	}
	else
	{
		if (this.videoChapters.length > 0)
		{
			this.currentChapter = 0;
			this.currentChapterUID = this.videoChapters[0].uid;
		}
	}
	
	if (!this.startOnOpening)
	{
		this.currentChapterStatus = ChapterPlayStateEnum.NOTPLAYING;
		this.pauseVideo();
	}

}


ARVideoTexture.prototype.play = function(){
	if (this.videoCurrentStatus != MediaPlayStateEnum.PLAYING)
	{
		this.playVideo();
	}
}

ARVideoTexture.prototype.pause = function(){
	
	this.pauseVideo();
}

ARVideoTexture.prototype.StartActivePlayback = function(){
	
	if (!this.startOnOpening)
	{
		this.playVideo();
	}
}

ARVideoTexture.prototype.getCurrentStatus = function(){
	return this.videoCurrentStatus;
}

ARVideoTexture.prototype.getChapterPlayingStatus = function(chapterid){
	if (this.currentChapterUID == chapterid)
	{
		return this.currentChapterStatus;
	}
	else
	{
		return ChapterPlayStateEnum.NOTPLAYING;
	}
	
}


ARVideoTexture.prototype.update = function(){
	
	switch (this.videoTextureState) {
	case VideoTextureStateEnum.INITIALISEVIDEO:
	
		if ((this.videoCurrentStatus == MediaPlayStateEnum.PLAYING))
		{
			this.videoPlayer.currentTime = this.videoChapters[this.currentChapter].startTime;
			this.currentChapterStatus = ChapterPlayStateEnum.PLAYING;
			if (g_browserType == BrowserTypeEnum.SAFARI)
			{
				this.storedElapsedTime = 0;
				this.videoTextureState = VideoTextureStateEnum.SAFARIVIDEOPLAYBACK;
				this.videoTimerClock.start();
			}
			else
			{
				this.videoTextureState = VideoTextureStateEnum.VIDEOPLAYBACK;
			}
		}
		break;
	
	case VideoTextureStateEnum.SAFARIVIDEOPLAYBACK:
		if (!this.isDeactivate)
		{
			var videoTimer = this.videoChapters[this.currentChapter].startTime + this.videoTimerClock.getElapsedTime() - this.storedElapsedTime;
			if ((videoTimer >= this.videoChapters[this.currentChapter].startTime) && (videoTimer < this.videoChapters[this.currentChapter].endTime))
			{
				if ((this.videoCurrentStatus == MediaPlayStateEnum.PLAYING))
				{
					if ((this.nextQueuedChapter != null) && (!this.queueAfterEnd))
					{
						this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
					}
				}
				else
				{

					if (this.nextQueuedChapter != null)
					{
						this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
					}
				}
			}
			else
			{
				if ((this.nextQueuedChapter != null))
				{
					this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
				}
				else
				{
					if (this.videoChapters[this.currentChapter].loop)
					{
						if ((this.nextQueuedChapter == null))
						{
							this.currentChapterStatus = ChapterPlayStateEnum.ENDED;
							this.videoTextureState = VideoTextureStateEnum.INITIALISEVIDEO;
						}
					}
					else
					{
						if ((this.videoCurrentStatus != MediaPlayStateEnum.PAUSED))
						{
							
							this.currentChapterStatus = ChapterPlayStateEnum.ENDED;
							this.pauseVideo();
						}
					}
				}
			}
		
		}
		break;	
	case VideoTextureStateEnum.VIDEOPLAYBACK:
		
		if ((this.videoPlayer.currentTime >= this.videoChapters[this.currentChapter].startTime) && (this.videoPlayer.currentTime < this.videoChapters[this.currentChapter].endTime))
		{
			if ((this.videoCurrentStatus == MediaPlayStateEnum.PLAYING))
			{
				if ((this.nextQueuedChapter != null) && (!this.queueAfterEnd))
				{
					this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
				}
			}
			else
			{
				if (this.nextQueuedChapter != null)
				{
					this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
				}
			}
		}
		else
		{
			if ((this.nextQueuedChapter != null))
			{
				this.videoTextureState = VideoTextureStateEnum.VIDEOQUEUED;
			}
			else
			{
				if (this.videoChapters[this.currentChapter].loop)
				{
					if ((this.nextQueuedChapter == null))
					{
						this.videoTextureState = VideoTextureStateEnum.INITIALISEVIDEO;
					}
				}
				else
				{
					if ((this.videoCurrentStatus != MediaPlayStateEnum.PAUSED))
					{
						
						this.currentChapterStatus = ChapterPlayStateEnum.ENDED;
						this.pauseVideo();
					}
				}
			}
		}
		break;
	case VideoTextureStateEnum.VIDEOQUEUED:
		this.currentChapterStatus = ChapterPlayStateEnum.NOTPLAYING;
		this.playVideo();
		this.currentChapter = this.nextQueuedChapter; 
		this.currentChapterUID = this.nextQueuedChapterUID;
		this.nextQueuedChapter = null;
		this.nextQueuedChapterUID = null;
		this.queueAfterEnd = null;
		this.videoTextureState = VideoTextureStateEnum.INITIALISEVIDEO;
		break;			
	}
	
	/* if (this.videoCurrentStatus != MediaPlayStateEnum.NOTINITIALISED)
	{
		if ((this.currentChapter != null) && (this.videoChapters.length > 0))
		{
			if ((this.videoPlayer.currentTime >= this.videoChapters[this.currentChapter].startTime) && (this.videoPlayer.currentTime < this.videoChapters[this.currentChapter].endTime))
			{		
				if ((this.nextQueuedChapter != null) && (!this.queueAfterEnd))
				{
					this.currentChapter = this.nextQueuedChapter; 
					this.currentChapterUID = this.nextQueuedChapterUID;
					this.nextQueuedChapter = null;
					this.nextQueuedChapterUID = null;
					this.queueAfterEnd = null;
					if (this.videoCurrentStatus != MediaPlayStateEnum.PLAYING)
					{
						this.playVideo();
						this.currentChapterStatus = ChapterPlayStateEnum.PLAYING;
					}
					this.videoPlayer.currentTime = this.videoChapters[this.currentChapter].startTime;
					this.playVideo();
				}
			}
			else
			{
				if ((this.nextQueuedChapter != null) && (this.queueAfterEnd))
				{
					this.currentChapter = this.nextQueuedChapter; 
					this.currentChapterUID = this.nextQueuedChapterUID;
					this.nextQueuedChapter = null;
					this.nextQueuedChapterUID = null;
					this.queueAfterEnd = null;
					if (this.videoCurrentStatus != MediaPlayStateEnum.PLAYING)
					{
						this.playVideo();
						this.currentChapterStatus = ChapterPlayStateEnum.PLAYING;
					}
					this.videoPlayer.currentTime = this.videoChapters[this.currentChapter].startTime;
					this.playVideo();
				}
				else
				{
					if (this.videoChapters[this.currentChapter].loop)
					{
						this.videoPlayer.currentTime = this.videoChapters[this.currentChapter].startTime;
					}
					else
					{
						this.currentChapterStatus = ChapterPlayStateEnum.ENDED;
						this.pauseVideo();
					}
				}
			}
		}
	} */
}

ARVideoTexture.prototype.deactivate = function(){
	
	this.storedVideoStatus = this.videoCurrentStatus;
	if (this.videoCurrentStatus == MediaPlayStateEnum.PLAYING)
	{
		if (g_browserType == BrowserTypeEnum.SAFARI)
		{
			this.pauseTimerClock.start();
			
			//this.videoTimerClock.stop();
		}
		this.pauseVideo();
		this.isDeactivate = true;
	}
}

ARVideoTexture.prototype.reactivate = function(){
	
	if (this.storedVideoStatus == MediaPlayStateEnum.PLAYING)
	{
		if (g_browserType == BrowserTypeEnum.SAFARI)
		{
			this.storedElapsedTime += this.pauseTimerClock.getElapsedTime();
			this.pauseTimerClock.stop();
			//this.videoTimerClock.start();
		}
		this.playVideo();
		this.isDeactivate = false;
	}
}

ARVideoTexture.prototype.queueNextChapter = function(chapteruid, waittoend){
	for (let i = 0; i < this.videoChapters.length; i++)
	{
		if (this.videoChapters[i].uid == chapteruid)
		{
			console.log("found chapter " + this.videoChapters[i].uid);
			this.nextQueuedChapter = i;
			this.nextQueuedChapterUID = chapteruid;
			this.queueAfterEnd = waittoend;
			break;
		}
	}
}

ARVideoTexture.prototype.dispose = function(){
	this.pauseVideo();
	this.videoPlayer.currentTime == 0;
	//event listeners
	this.videoPlayer.removeEventListener("play", videoPlay, false);
	this.videoPlayer.removeEventListener("pause", videoPause, false);	
	this.videoPlayer.removeEventListener("ended", videoEnded, false);	
	this.videoPlayer.removeEventListener('error', (event) => {
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
	
	if (this.videoChapters != null)
	{
		for(let i=0;i<this.videoChapters.length;i++)
		{
			this.videoChapters[i] = null;
		}
		this.videoChapters.length = 0;
		this.videoChapters = null;
	}
	this.videoTimerClock = null;
	this.videoPlayer = null;
	this.videoTexture.dispose();
	this.videoTexture = null;
	disposeObjectMesh(this.videoMesh);
	this.videoMesh = null;
	
 	this.UID = null;
	this.currentChapterUID = null;
	this.nextQueuedChapterUID = null;
	this.parentSide = null;
	this.parentStage = null;
	this.nodeName = null;

}