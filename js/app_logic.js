const { ArMarkerControls, ArToolkitContext, ArToolkitSource } = THREEx;


			window.requestAnimFrame = function () {
			    return window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.oRequestAnimationFrame ||
					   window.msRequestAnimationFrame ||
					   function (callback) {
					       window.setTimeout(callback, 1000 / 60);
					   };
			} ();


navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;			

//booleans
var m_IsCompatibleDevice;
var m_isCurrentLandscape = false;
var m_visitedBefore = false;

var m_debugtext = "";

//interaction variables 

var ongoingTouches = new Array;
var m_PreviousInteractionTime = 0;
var m_timeoutFired;
var m_enableTouchClick = false;
var m_clickCollisonValue = -1;
var m_ActiveClickPoints = new Array;

var m_enableFullScreenToggle = false; 
var m_screenTogglePending = false;
var m_videoControllerPending = false;
var m_toggleStatePending = [];
var m_wakeLockEnabled = false;
var m_noSleep;

var m_ARMarkerVisibleCount = 0;

var m_cameraStream = null;

//canvases
var m_canvas2d;
var m_canvas2dContext;
var m_canvas3d;	
var m_canvasVR;	
var m_qrcodeCanvas;	
var m_disclaimerCanvas;
var m_contextDisclaimerCanvas;
var m_vr2dDisplayCanvas;
var m_vr2dDisplayCanvasContext;

var m_resizedARCanvasWidth;
var m_resizeARCanvasX;
var m_resizedARCanvasY;
var m_resizeARCanvasHeight;

var m_canvasWidth;
var m_canvasHeight;

//3d stuff
var m_renderer;
var m_scene;
var m_camera;
//var m_sceneModels = [];
//var m_shadowARPlane = null;

var storedHemisphereLightIntensities = [];
var storedAmbientLightIntensities = [];

var m_clock;

var m_backgroundCubeMap;

var m_video;
var m_video360Element;
var m_360Texture;
var m_360SphereMesh;

var m_clickableObjectGroup = null;
var m_sceneLightsGroup = null;


var m_isMouseDown = false;

var m_INTERSECTED;
var m_crosshair;

//VR controls
var m_controls;
var m_vrDisplay;
var m_effect;

var m_polyfill;

//var m_vrType;

var m_stats;


var m_displaytext3DPlane;
var m_displaytext3DTexture;

var m_playerARMarker;
var m_npcARMarkers = null;
var m_npcARMarkerVisible = false;

var m_playerVRCharacter;
//var m_npcVRCharacters = null;

var m_arToolkitSource;
var m_arToolkitContext;	


var m_selectedExercise;
var m_selectedGender;
var m_selectedAvatarID;
var m_selectedAvatarTexture;
var m_tempSelectedAvatar;
var m_tempSelectedTexture;
var m_tempSelectedAvatarModelIndex;
		
var m_loadingComplete = false;
var m_loadingError = false;
var m_loadingErrorMessage;
var m_transition; 
		
//states
var m_GameState;
var m_RenderState;
var m_ARState;

var m_progressLoading;
	
 var AnchorPointEnum = {
  TOPLEFT: 0,
  TOPRIGHT: 1,
  TOPCENTRE: 2,
  BOTTOMLEFT: 3,
  BOTTOMRIGHT: 4,
  BOTTOMCENTRE: 5,
  CENTRE: 6,
  CENTRELEFT: 7,
  CENTRERIGHT: 8
}; 



var m_LerpedAlpha  = new Array;
var m_lerpValue;
var LERPSPEED = 0.015;
var MIN_DISTANCE = 2.1;
var MIN_LOOKATANGLE = 30;

var DEFAULTPORTRAITCANVASWIDTH = 360;
var DEFAULTPORTRAITCANVASHEIGHT = 640;


var ToggleStateEnum = {
  NONE: 0,
  FULLSCREENSTATE: 1,
  WINDOWEDSCREENSTATE: 2,
  VIDEOPLAYERSTATE: 3,
  VRSTATE: 4,
  NOSLEEP: 5
};
	
var RenderStateEnum = {
  NORENDER: 0,
  RENDERALL: 1,
  RENDERPAGE: 2
};

var GameStateEnum = {
	LOADING: 0,
	INIT: 1,
	LANDING: 2,
	QRLOADING: 3,
	QRSCAN: 4,
	QRUNLOADING: 5,
	QRCODEFOUND: 6,
	VIDEOLOADING: 7,
	VIDEO: 8,
	VIDEOUNLOADING: 9,
	ARLOADING: 10,
	ARSCAN: 11,
	ARUNLOADING: 12,
	AVATARGENDERCHOICE: 13,
	AVATARCHOICELOADING: 14,
	AVATARCHOICE: 15,
	AVATARCHOICEUNLOADING: 16,
	VRLOADING: 17,
	VR: 18,
	VRUNLOADING: 19
};

var VRTypeEnum = {
	VIDEO360: 0,
	VOCABULARY: 1,
	QUESTIONS: 2,
	DIALOG: 3
};

var SpeechStatusEnum = {
	QUESTIONSAY: 0,
	QUESTIONEND: 1,
	ANSWERSAY: 2,
	ANSWEREND: 3
};

var ARStateEnum = {
	SCANNING: 0,
	AVATARCHOICE: 1,
	TEXTURECHOICE: 2,
	AVATARCHOICECOMPLETED: 3
};

//content and structure read from JSON files

var dataContentReceived = false;
var dataStructureReceived = false;
var m_Content;
var m_Structure;

//voice stuff
var m_recognition;
var m_recognizedText;
var m_timer;
//var m_enabledMic;
var m_showWaiting;
var m_showSubtitles = true;
var m_SubtitleLines = new Array;
var m_SubtitleFontColours = new Array;
var m_enableConversation;
var m_activeNPC;



//video stuff
var m_windowedVideoPlayer;
var m_pausedByUser = false;
var m_VideoCurrentStatus;
var m_VideoIsPresent = false;

var VideoPlayStateEnum = {
  NOTPLAYING: 0,
  PLAYING: 1,
  PAUSED: 2
};

//button images
var m_startButtonImage;
var m_downloadButtonImage;
var m_backButtonImage;
var m_tickButtonImage;
var m_crossButtonImage;
var m_micButtonImage;
var m_pauseButtonImage;
var m_playButtonImage;
var m_replayButtonImage;
var m_subtitleButtonImage;
var m_rightButtonImage;
var m_leftButtonImage;
var m_femaleButtonImage;
var m_maleButtonImage;
var m_entervrButtonImage;
var m_waitingImagesArray = new Array;
var m_LerpedControlPts = new Array;

//maths
var TO_RADIANS = Math.PI/180;

function init () {
	document.getElementById("loader").style.display = "inline";
	m_GameState = GameStateEnum.LOADING;
	m_toggleStatePending.length = 0;
	m_toggleStatePending[0] = ToggleStateEnum.NONE;
	//load content and structure JSON files
	var xmlhttp = new XMLHttpRequest();
	var url = "content/content.json";
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			m_Content = JSON.parse(xmlhttp.responseText);
			dataContentReceived = true;
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
			
	var xmlhttp2 = new XMLHttpRequest();
	var url2 = "content/structure.json";
				
	xmlhttp2.onreadystatechange = function () {
		if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
			m_Structure = JSON.parse(xmlhttp2.responseText);
			dataStructureReceived = true;
		}
	};
	xmlhttp2.open("GET", url2, true);
	xmlhttp2.send();
	
	m_IsCompatibleDevice = false;
	
	testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');
	
	if (isChrome() && (testExp.test(navigator.userAgent)) && ('webkitSpeechRecognition' in window) && ('speechSynthesis' in window))
	{
		m_IsCompatibleDevice = true;
	/* 	window.document.documentElement.requestFullscreen();
		screen.orientation.lock('portrait'); */
	}

	// load play, pause, replay images
	m_startButtonImage = new Image();
	m_startButtonImage.src = "assets/images/startbutton.png";
	m_downloadButtonImage = new Image();
	m_downloadButtonImage.src = "assets/images/downloadbutton.png";
	m_backButtonImage = new Image();
	m_backButtonImage.src = "assets/images/backbutton2.png";
	m_tickButtonImage = new Image();
	m_tickButtonImage.src = "assets/images/tickbutton.png";
	m_crossButtonImage = new Image();
	m_crossButtonImage.src = "assets/images/crossbutton.png";
	m_micButtonImage = new Image();
	m_micButtonImage.src = "assets/images/micbutton.png";
	m_playButtonImage = new Image();
	m_playButtonImage.src = "assets/images/playbutton.png";
	m_pauseButtonImage = new Image();
	m_pauseButtonImage.src = "assets/images/pausebutton.png";
	m_replayButtonImage = new Image();
	m_replayButtonImage.src = "assets/images/replaybutton.png";
	m_subtitleButtonImage = new Image();
	m_subtitleButtonImage.src = "assets/images/subtitlebutton.png";
	m_rightButtonImage = new Image();
	m_rightButtonImage.src = "assets/images/rightbutton.png";
	m_leftButtonImage = new Image();
	m_leftButtonImage.src = "assets/images/leftbutton.png";
	m_femaleButtonImage = new Image();
	m_femaleButtonImage.src = "assets/images/femalebutton1.png";
	m_maleButtonImage = new Image();
	m_maleButtonImage.src = "assets/images/malebutton1.png";
	m_entervrButtonImage = new Image();
	m_entervrButtonImage.src = "assets/images/entervrbutton.png";
	

	m_selectedAvatarID = null;
	var avatarindex = getCookie("avatar");
    if (avatarindex != "") {
		m_selectedAvatarID = parseInt(avatarindex);
	}
	m_selectedAvatarTexture = 0;
	var textureindex = getCookie("texture");
    if (textureindex != "") {
		m_selectedAvatarTexture = parseInt(textureindex);
	}
	m_tempSelectedAvatar = 0;
	m_tempSelectedTexture = 0;
	var subtitle = getCookie("subtitle");
    if (subtitle != "") {
		m_showSubtitles = subtitle == "true" ? true : false;
	}
	m_visitedBefore = Boolean(getCookie("visitedbefore"));
	
	for(var j=0;j<8;j++){ 
		m_waitingImagesArray[j] = [];
		m_waitingImagesArray[j] = new Image();
		m_waitingImagesArray[j].onload = function() {
			
		};
		m_waitingImagesArray[j].src = "assets/images/waiting" + j + ".png"; 	
				
	}
	
	//m_noSleep = new NoSleep();
	
	//setup canvases
	
	
	
	m_canvas2d = document.getElementById('main_canvas');
	resizeCanvas();

	
	m_canvas2dContext = m_canvas2d.getContext('2d');
	// resize the canvas to fill browser window dynamically
    window.addEventListener("resize", resizeCanvas, false);
	window.addEventListener("orientationchange", resizeCanvas, false);
	console.log("m_canvasWidth = " + m_canvasWidth);
	console.log("m_canvasHeight = " + m_canvasHeight);
	m_ActiveClickPoints.length = 0;
	
	
	
	
	m_canvas2d.addEventListener("touchstart", handleStart, false);
	m_canvas2d.addEventListener("touchend", handleEnd, false);
	m_canvas2d.addEventListener("touchcancel", handleCancel, false);
	m_canvas2d.addEventListener("touchleave", handleEnd, false);
	m_canvas2d.addEventListener("touchmove", handleMove, false);	

	m_disclaimerCanvas = document.createElement('canvas');
	m_disclaimerCanvas.width = 2400;
    m_disclaimerCanvas.height = 1000;
    m_contextDisclaimerCanvas = m_disclaimerCanvas.getContext('2d');	

	
	//m_stats = new Stats();
	
	
	
	
	update();
  }



function update() {
	
	
	switch (m_GameState) {
	case GameStateEnum.LOADING:

		if ((dataContentReceived) && (dataStructureReceived))
		{
			
			m_GameState = GameStateEnum.INIT;
		}
		break;
	case GameStateEnum.INIT:
		
		/* var startbutton1 = new buttonObject(m_startButtonImage, m_Structure.toplevel.startbuttonposition.x , m_Structure.toplevel.startbuttonposition.y, m_Structure.toplevel.startbuttonposition.scale, m_Structure.toplevel.startbuttonposition.rotation);
		var tapPoint = new tapItem(m_Structure.toplevel.startbuttontapcollision, startbutton1, "start", 1, false);
		m_ActiveClickPoints.push(tapPoint);
		*/
		m_ActiveClickPoints.length = 0;
		m_canvas2d.addEventListener( 'mousedown', handleStart, false );
		m_canvas2d.addEventListener( 'mouseup', handleEnd, false );
		m_enableTouchClick = true;
		setupButton(m_downloadButtonImage, m_Structure.toplevel.downloadbutton.x, m_Structure.toplevel.downloadbutton.y, m_Structure.toplevel.downloadbutton.radius, m_Structure.toplevel.downloadbutton.scale, m_Structure.toplevel.downloadbutton.rotation, m_Structure.toplevel.downloadbutton.type, m_Structure.toplevel.downloadbutton.scale, m_Structure.toplevel.downloadbutton.anchorpoint);
		
		if (m_IsCompatibleDevice)
		{
			
			setupButton(m_startButtonImage, m_Structure.toplevel.startbutton.x, m_Structure.toplevel.startbutton.y, m_Structure.toplevel.startbutton.radius, m_Structure.toplevel.startbutton.scale, m_Structure.toplevel.startbutton.rotation, m_Structure.toplevel.startbutton.type, m_Structure.toplevel.startbutton.scale, m_Structure.toplevel.startbutton.anchorpoint);
	
			
			if (m_IsCompatibleDevice)
			{
		
				responsiveVoice.speak("", "UK English Male");
			}
		}
		m_clickCollisonValue = -1;
		m_RenderState = RenderStateEnum.RENDERALL;
		document.getElementById("loader").style.display = "none";
		document.body.style.cursor = 'auto';
		m_GameState = GameStateEnum.LANDING;

		break;
	case GameStateEnum.LANDING:
		
		
		if (m_clickCollisonValue > -1)
		{
			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			case "start":
				document.body.style.cursor = 'none';
				document.getElementById("loader").style.display = "inline";
				m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				//m_toggleStatePending[1] = ToggleStateEnum.NOSLEEP;
				m_screenTogglePending = true;
				m_enableTouchClick = false;
				m_canvas2d.removeEventListener( 'mousedown', handleStart, false );
				m_canvas2d.removeEventListener( 'mouseup', handleEnd, false );
				m_GameState = GameStateEnum.QRLOADING;
				m_transition = 0;
				break;
			case "download":
				
				downloadURI("downloads/speaking skills.pdf", "Speaking Skills"); 
				break;
			}
			
			m_clickCollisonValue = -1;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.QRLOADING:
		
		if (m_visitedBefore)
		{
			m_transition = 2;
		}
	
		//set up webrtc originally to get permissions for camera and microphone then delete it 
		if (m_transition == 0)
		{
			if (navigator.mediaDevices != undefined)
			{			
				var userMediaConstraints = {
				audio: true,
				video: {
					facingMode: 'environment',
					width: {
						ideal: 640
					},
					height: {
						ideal: 480
						}
					}
				}
				
				var promise = navigator.mediaDevices.getUserMedia(userMediaConstraints).then(function success(stream) {
					if (m_GameState == GameStateEnum.QRLOADING)
					{	
						m_cameraStream = stream;
						m_transition = 1;
					}
				}).catch(function(error) {
				
					console.log("Error : " + error);
					m_transition = 1;
				});

				
			}
			
			
		}
		else
		{
			if (m_transition == 1)
			{
				if (m_cameraStream != null)
				{
					let tracks = m_cameraStream.getTracks();

					tracks.forEach(function(track) {
						track.stop();
					});
				
					m_cameraStream = null;
					setCookie("visitedbefore", "true", 30);				
					m_transition = 2;
				}
				
	
			}
			if (m_transition == 2)
			{

				m_visitedBefore = true;
				//Artoolkit stuff
		
				setupARCamera();
		
		
				resizeCanvas();
		
		
				//set up buttons
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				qrcode.callback = read;
				m_transition = 0;
				m_GameState = GameStateEnum.SCANQRCODE;
			}
		}
		
		break;
	case GameStateEnum.SCANQRCODE:
		m_enableTouchClick = true;
		
		if (m_clickCollisonValue > -1)
		{

			if (m_ActiveClickPoints[m_clickCollisonValue].itemtype == "back")
			{
				m_GameState = GameStateEnum.QRUNLOADING;
/* 				if (m_wakeLockEnabled)
				{
					m_noSleep.disable(); // let the screen turn off.
					m_wakeLockEnabled = false;
				} */
				m_enableTouchClick = false;
				m_toggleStatePending[0] = ToggleStateEnum.WINDOWEDSCREENSTATE;
				m_screenTogglePending = true;
			}
	
			m_clickCollisonValue = -1;

			
		}
		
		
 		if( m_arToolkitSource.ready)
		{
			document.getElementById("loader").style.display = "none";
			//m_arToolkitContext.update( m_arToolkitSource.domElement );
		}
		//grab the context from your destination canvas
		var ctx = m_qrcodeCanvas.getContext('2d');

 		//call its drawImage() function passing it the source canvas directly
		ctx.drawImage(m_arToolkitSource.domElement, 0, 0);
		 try{
              qrcode.decode();
            }
            catch(e){       
                //console.log(e);
			}  
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.QRUNLOADING:
		//stop webcam 
		document.getElementById("loader").style.display = "inline";
		
		unloadARCamera();
		
/* 		let stream = m_arToolkitSource.domElement.srcObject;
		let tracks = stream.getTracks();

		tracks.forEach(function(track) {
		track.stop();
		});

		m_arToolkitSource.domElement.srcObject = null;
		m_arToolkitSource.domElement = null;

		m_arToolkitSource = null; */
		

		m_qrcodeCanvas = null;
		
		m_GameState = GameStateEnum.INIT;
		break;
	case GameStateEnum.QRCODEFOUND:
		//if( m_arToolkitSource.ready)
		//{
		//	m_arToolkitContext.update( m_arToolkitSource.domElement );
		//}
		
		
		if (m_clickCollisonValue > -1)
		{
			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
				case "back":
				//set up buttons
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_GameState = GameStateEnum.SCANQRCODE;
				break;
			
			case "no":
				//set up buttons
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_GameState = GameStateEnum.SCANQRCODE;
				break;
			case "yes":
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				switch (m_Content.coursework.exercises[m_selectedExercise].exercise.type.toLowerCase())
				{
				case "video":
					m_ActiveClickPoints.length = 0;
					m_transition = 0;
					m_LerpedAlpha.length = 0;
					m_LerpedAlpha[0] = 0;
					m_lerpValue = 0;
					setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);							
					//m_VideoIsPresent = setupVideoPlayer();
					m_enableTouchClick = false;	
					m_loadingComplete = false;
					m_progressLoading = "0%";
					m_GameState = GameStateEnum.VIDEOLOADING;
	/* 				if (m_VideoIsPresent)
					{
						m_LerpedAlpha.length = 0;
						m_LerpedAlpha[0] = 0;
						m_lerpValue = 0;				
						m_GameState = GameStateEnum.VIDEOLOADING;
						document.getElementById("loader").style.display = "inline";
						
						setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
						m_enableTouchClick = false;
					}
					else
					{
						
						//set up buttons
						m_ActiveClickPoints.length = 0;
						setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
						m_GameState = GameStateEnum.SCANQRCODE;
					}						 */
					break;
				case "avatarchoice":
				//set up buttons
					m_ActiveClickPoints.length = 0;
					setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
					setupButton(m_maleButtonImage, m_Structure.arscanner.malebutton.x, m_Structure.arscanner.malebutton.y, m_Structure.arscanner.malebutton.radius, m_Structure.arscanner.malebutton.scale, m_Structure.arscanner.malebutton.rotation, m_Structure.arscanner.malebutton.type, m_Structure.arscanner.malebutton.scale, m_Structure.arscanner.malebutton.anchorpoint);							
					setupButton(m_femaleButtonImage, m_Structure.arscanner.femalebutton.x, m_Structure.arscanner.femalebutton.y, m_Structure.arscanner.femalebutton.radius, m_Structure.arscanner.femalebutton.scale, m_Structure.arscanner.femalebutton.rotation, m_Structure.arscanner.femalebutton.type, m_Structure.arscanner.femalebutton.scale, m_Structure.arscanner.femalebutton.anchorpoint);		
					m_GameState = GameStateEnum.AVATARGENDERCHOICE;
					m_enableTouchClick = true;					
					break;
				case "ar":
					m_GameState = GameStateEnum.ARLOADING;
					m_loadingComplete = false;
					m_loadingError = false;
					m_loadingErrorMessage = "";
					m_transition = 0;
					m_lerpValue = 0;
					m_LerpedAlpha.length = 0;
					m_LerpedAlpha[0] = 0;
					m_progressLoading = "0%";
					m_enableConversation = false;
					m_activeNPC = 0;
					document.getElementById("loader").style.display = "inline";
					m_enableTouchClick = false;					
					break;
				case "vr":
					m_GameState = GameStateEnum.VRLOADING;
					m_LerpedAlpha.length = 0;
					m_LerpedAlpha[0] = 0;
					m_lerpValue = 0;		
					m_loadingComplete = false;
					m_loadingError = false;
					m_loadingErrorMessage = "";
					m_transition = 0;
					m_progressLoading = "0%";
					m_enableConversation = false;
					m_activeNPC = 0;
					document.getElementById("loader").style.display = "inline";
					m_enableTouchClick = false;					
					break;
				}
				break;
			}
			m_clickCollisonValue = -1;

			
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		
		break;
	case GameStateEnum.VIDEOLOADING:

		//windowed video
		if (m_transition == 0)
		{
			m_windowedVideoPlayer = document.createElement("video");
			m_windowedVideoPlayer.autoplay = false; 
			m_windowedVideoPlayer.controls = false;
			m_windowedVideoPlayer.loop = false;
			m_windowedVideoPlayer.height = 640; 
			m_windowedVideoPlayer.width = 360;
			m_VideoCurrentStatus = VideoPlayStateEnum.NOTPLAYING;
	
			//event listeners
			m_windowedVideoPlayer.addEventListener("play", videoPlay, false);
			m_windowedVideoPlayer.addEventListener("pause", videoPause, false);	
			m_windowedVideoPlayer.addEventListener("ended", videoEnded, false);	
			m_windowedVideoPlayer.addEventListener('error', (event) => {
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
			/* m_windowedVideoPlayer.addEventListener('canplaythrough' , function() {
				m_loadingComplete = true;
			}); */
			
			
			m_VideoIsPresent = setupVideoPlayer();

			if (m_VideoIsPresent)
			{
				document.getElementById("loader").style.display = "inline";
			}
			else
			{
				//set up buttons
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_GameState = GameStateEnum.VIDEOUNLOADING;
			}			
			
			
			//m_lerpValue = 0;
			m_transition++;
		}	
		else
		{
			if ((m_lerpValue <= 1) )
			{

				m_LerpedAlpha.length = 0;
				var C = [0];
				var D = [1];
				m_LerpedAlpha = lerp(C, D, m_lerpValue);
				m_lerpValue += LERPSPEED * 1.9;
			}
			else
			{
				if (m_loadingComplete)
				{
					if (m_VideoIsPresent)
					{
						m_windowedVideoPlayer.currentTime = 0;
						//m_windowedVideoPlayer.play();
					}
					document.getElementById("loader").style.display = "none";
					//m_videoControllerPending = false;
					m_enableTouchClick = true;		
					m_GameState = GameStateEnum.VIDEO;
				}
			}
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.VIDEO:
		if (m_clickCollisonValue > -1)
		{
			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			
			case "back":
				//set up buttons
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_enableTouchClick = false;	
				m_lerpValue = 0;	
				if (m_VideoCurrentStatus == VideoPlayStateEnum.PLAYING)
				{
					m_toggleStatePending[0] = ToggleStateEnum.VIDEOPLAYERSTATE;
					//m_videoControllerPending = true;
				}
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[1] = ToggleStateEnum.FULLSCREENSTATE;
				}				
				m_GameState = GameStateEnum.VIDEOUNLOADING;
				break;
				
			case "videocontrol":
				m_toggleStatePending[0] = ToggleStateEnum.VIDEOPLAYERSTATE;
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[1] = ToggleStateEnum.FULLSCREENSTATE;
				}
				//m_videoControllerPending = true;
				break;

			}
			m_clickCollisonValue = -1;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.VIDEOUNLOADING:
		if ((m_lerpValue <= 1) )
		{
			m_LerpedAlpha.length = 0;
			var C = [1];
			var D = [0];
			m_LerpedAlpha = lerp(C, D, m_lerpValue);
			m_lerpValue += LERPSPEED * 1.9;
		}
		else
		{
			m_windowedVideoPlayer.currentTime == 0;
			
		
	
			//event listeners
			m_windowedVideoPlayer.removeEventListener("play", videoPlay, false);
			m_windowedVideoPlayer.removeEventListener("pause", videoPause, false);	
			m_windowedVideoPlayer.removeEventListener("ended", videoEnded, false);	
			m_windowedVideoPlayer.removeEventListener('error', (event) => {
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
			m_windowedVideoPlayer.removeEventListener('canplaythrough' , function() {
				m_loadingComplete = true;
			});
			
			
			m_windowedVideoPlayer = null;	
			
			m_lerpValue = 0;
			document.getElementById("loader").style.display = "none";
			m_enableTouchClick = true;		
			m_GameState = GameStateEnum.SCANQRCODE;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.ARLOADING:
		
		
			
		if (m_transition == 0)
		{
			if ((m_lerpValue < 1) )
			{

				m_LerpedAlpha.length = 0;
				var C = [0];
				var D = [1];
				m_LerpedAlpha = lerp(C, D, m_lerpValue);
				m_lerpValue += LERPSPEED * 1.9;
			}
			else
			{
				m_ARState = ARStateEnum.SCANNING;
			
				m_ARMarkerVisibleCount = 0;
				//only do this once, set up three.js stuff
				m_canvas3d = document.createElement('canvas');
			
				m_canvas3d.width = m_Structure.qrscanner.cameraresolution.width;
				m_canvas3d.height = m_Structure.qrscanner.cameraresolution.height;
				m_canvas3d.style.position = 'absolute'
				m_canvas3d.style.top = '0px'
				m_canvas3d.style.left = '0px'
				m_canvas3d.style.zIndex = "1";
				
				storedHemisphereLightIntensities.length = 0;
				storedAmbientLightIntensities.length = 0;
	
				m_renderer	= new THREE.WebGLRenderer({
					canvas: m_canvas3d,
					antialias	: true,
					alpha: true
				});		
				m_renderer.setSize( m_Structure.qrscanner.cameraresolution.width, m_Structure.qrscanner.cameraresolution.height );
				m_camera = new THREE.PerspectiveCamera( 45, m_Structure.qrscanner.cameraresolution.width / m_Structure.qrscanner.cameraresolution.height, 1, 2000 );

	
				// creating a new scene
				m_scene = new THREE.Scene();
				m_camera.position.set( 0, 0, 0 );
				m_scene.add(m_camera);
			
			
				// create an atToolkitContext
				loadARContext();
	/* 			ArToolkitContext.baseURL = '../';
				m_arToolkitContext = null;
				m_arToolkitContext = new ArToolkitContext({
					cameraParametersUrl: "data/data/camera_para.dat",
					detectionMode: 'mono',
					maxDetectionRate: m_Structure.qrscanner.cameraresolution.maxdetectionrate,
					// The two following settings adjusts the resolution. Higher is better (less flickering) but slower
					canvasWidth: m_Structure.qrscanner.cameraresolution.width,
					canvasHeight: m_Structure.qrscanner.cameraresolution.height
				});
	
				m_arToolkitContext.init(() => {
					m_camera.projectionMatrix.copy(m_arToolkitContext.getProjectionMatrix());
				});
			
				if( m_arToolkitSource.ready)
				{
					onResize();
					m_arToolkitContext.update( m_arToolkitSource.domElement );
				} */
			
				//set up buttons
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.arscanner.backbutton.x, m_Structure.arscanner.backbutton.y, m_Structure.arscanner.backbutton.radius, m_Structure.arscanner.backbutton.scale, m_Structure.arscanner.backbutton.rotation, m_Structure.arscanner.backbutton.type, m_Structure.arscanner.backbutton.scale, m_Structure.arscanner.backbutton.anchorpoint);		

		
				//load manager
		
				var manager = new THREE.LoadingManager();
				manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

				};

				manager.onLoad = function ( ) {
	
					console.log( 'Loading complete!');
					m_loadingComplete = true;
					m_progressLoading = "100%";

				};
				manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
					m_progressLoading = (Math.floor((itemsLoaded / itemsTotal) * 100)) + "%";
				};
				manager.onError = function ( url ) {

					console.log( 'There was an error loading ' + url );
					m_loadingErrorMessage = "Error loading " + url;
					m_loadingError = true;
				};
			
				//loader, marker, scene, artoolkitcontext
				m_npcARMarkers = new Array;
				m_npcARMarkers.length = 0;

			
				m_Content.coursework.exercises[m_selectedExercise].exercise.content.forEach( function( item ) {

					if (item.hasOwnProperty('light'))
					{
						setupLights(item, manager);

					}
					if (item.hasOwnProperty('marker'))
					{
						if (item.marker.markertype.toLowerCase() == "player")
						{

							var modelindex = 0;
							if (m_selectedAvatarID != null)
							{
								for(var i=0;i<m_Content.avatarchoice.models.length;i++)
								{ 
									if (m_Content.avatarchoice.models[i].avatar.id == m_selectedAvatarID)
									{								
										modelindex = i;
										break;
									}
								}
							}
					
							m_playerARMarker = null;
							m_playerARMarker = new ArMarker(manager, m_scene, m_arToolkitContext, item.marker, 0, ARAvatarMarkerType.MAIN);
							m_playerARMarker.setModelsNum(1);
							m_playerARMarker.addMesh(m_Content.avatarchoice.models[modelindex].avatar.model + "_artakes.fbx", m_Content.avatarchoice.models[modelindex].avatar, 0, m_selectedAvatarTexture);
				
					
							//m_playerARMarker = new ArMarker(manager, m_scene, m_arToolkitContext, item.marker, m_selectedAvatarTexture);
							setupButton(m_micButtonImage, m_Structure.arscanner.micbutton.x, m_Structure.arscanner.micbutton.y, m_Structure.arscanner.micbutton.radius, m_Structure.arscanner.micbutton.scale, m_Structure.arscanner.micbutton.rotation, m_Structure.arscanner.micbutton.type, m_Structure.arscanner.micbutton.scale, m_Structure.arscanner.micbutton.anchorpoint);		
							setupButton(m_subtitleButtonImage, m_Structure.arscanner.subtitlebutton.x, m_Structure.arscanner.subtitlebutton.y, m_Structure.arscanner.subtitlebutton.radius, m_Structure.arscanner.subtitlebutton.scale, m_Structure.arscanner.subtitlebutton.rotation, m_Structure.arscanner.subtitlebutton.type, m_Structure.arscanner.subtitlebutton.scale, m_Structure.arscanner.subtitlebutton.anchorpoint);			 
						}
						if (item.marker.markertype.toLowerCase() == "npc")
						{
							var npcARMarker = new ArMarker(manager, m_scene, m_arToolkitContext, item.marker, 0, ARAvatarMarkerType.MAIN);
							npcARMarker.setSubtitleColour(m_playerARMarker.getSubtitleColour());
							//console.log("npcARMarker.getSubtitleColour player " + npcARMarker.getSubtitleColour());
							m_npcARMarkers.push(npcARMarker);

						}
					}
						
				});
			
				m_lerpValue = 0;
				m_transition++;
			}
		}
		else
		{
		
			if ((m_loadingComplete) && ( m_arToolkitSource.ready) && (!m_loadingError))
			{
				if ((m_lerpValue < 1) )
				{

					m_LerpedAlpha.length = 0;
					var C = [1];
					var D = [0];
					m_LerpedAlpha = lerp(C, D, m_lerpValue);
					m_lerpValue += LERPSPEED * 1.9;
				}
				else
				{
					document.getElementById("loader").style.display = "none";
					m_enableTouchClick = true;
					//m_enabledMic = true;
					m_showWaiting = false;
					m_SubtitleLines.length = 0;
					m_SubtitleFontColours.length = 0;
					m_lerpValue = 0;
					resizeCanvas();
					m_GameState = GameStateEnum.ARSCAN;
				}
			}
			else
			{
				if ((m_loadingError) && (m_loadingComplete))
				{
					if ((m_lerpValue < 1) )
					{

						m_LerpedAlpha.length = 0;
						var C = [1];
						var D = [0];
						m_LerpedAlpha = lerp(C, D, m_lerpValue);
						m_lerpValue += LERPSPEED * 1.9;
					}
					else
					{
						m_GameState = GameStateEnum.ARUNLOADING;
					}
				}
			}
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	
	case GameStateEnum.ARSCAN:
		if( !m_arToolkitSource.ready === false)
		{
			
			m_arToolkitContext.update( m_arToolkitSource.domElement );
		}
		
		if ((m_lerpValue <= 1) )
		{
			m_LerpedControlPts.length = 0;
			var C = [0];
			var D = [m_waitingImagesArray.length - 1];
			m_LerpedControlPts = lerp(C, D, m_lerpValue);
			m_lerpValue += LERPSPEED* 4.2;
		}
			else
		{
			m_lerpValue = 0;
			
					
		}
		
		
		
		if (m_clickCollisonValue > -1)
		{

			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			
			case "back":
				//set up buttons
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_GameState = GameStateEnum.ARUNLOADING;
				break;

	 		case "mic":
				console.log("mic pressed");
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				if ((m_enableConversation) && ((m_npcARMarkers[m_activeNPC].currentState == MarkerStateEnum.READY) || (m_npcARMarkers[m_activeNPC].currentState == MarkerStateEnum.TALK)))
				{
					m_npcARMarkers[m_activeNPC].startConversation();
					
					console.log("mic pressed");
				}
				break;	
			case "showsubtitles":
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_showSubtitles = m_showSubtitles ? false : true;
				setCookie("subtitles", m_showSubtitles, 30);
				break;
			} 
			m_clickCollisonValue = -1;

			
		}
		
		var visiblemarkercount = 0;

		m_playerARMarker.update();
		m_npcARMarkerVisible = false;
		for(var i=0;i<m_npcARMarkers.length;i++)
		{ 
			m_npcARMarkers[i].update();
			if (m_npcARMarkers[i].isVisible())
			{
				m_npcARMarkerVisible = true;
			}
			
		}
		var active_npc = null; 
		var storeddistance = null;
		var enableconversation = false;
		
		if (m_playerARMarker.isVisible())
		{
			visiblemarkercount++;
			if ((m_enableConversation) && (m_npcARMarkers[m_activeNPC].distanceFrom(m_playerARMarker.getPosition()) < MIN_DISTANCE) && (m_playerARMarker.angleFacing(m_npcARMarkers[m_activeNPC].getPosition()) < MIN_LOOKATANGLE) && (m_npcARMarkers[m_activeNPC].angleFacing(m_playerARMarker.getPosition()) < MIN_LOOKATANGLE))
			{
				//check to see active npc is still within range
				if (m_npcARMarkers[m_activeNPC].currentState == MarkerStateEnum.IDLE)
				{
					//console.log("change to talk for " + i);
					m_npcARMarkers[m_activeNPC].changeState(MarkerStateEnum.READY);
				}
				active_npc = m_activeNPC;
				enableconversation = true;
				for(var i=0;i<m_npcARMarkers.length;i++)
				{
					if (m_npcARMarkers[i].isVisible())
					{
						visiblemarkercount++;
					}						
 					if ((m_npcARMarkers[i].currentState != MarkerStateEnum.IDLE) && (active_npc != i))
					{
						m_npcARMarkers[i].changeState(MarkerStateEnum.IDLE);
					}
				}
			}
			else
			{
				
				//if not in range, to see if anything else is in range
				for(var i=0;i<m_npcARMarkers.length;i++)
				{ 
					if (m_npcARMarkers[i].isVisible())
					{
						visiblemarkercount++;
						if ((m_npcARMarkers[i].distanceFrom(m_playerARMarker.getPosition()) < MIN_DISTANCE) && (m_playerARMarker.angleFacing(m_npcARMarkers[i].getPosition()) < MIN_LOOKATANGLE) && (m_npcARMarkers[i].angleFacing(m_playerARMarker.getPosition()) < MIN_LOOKATANGLE)) 
						{
					
							if ((active_npc != null) && (storeddistance != null))
							{
								if (m_npcARMarkers[i].distanceFrom(m_playerARMarker.getPosition()) < storeddistance)
								{
									//this one is closest
									if (m_npcARMarkers[active_npc].currentState == MarkerStateEnum.IDLE)
									{
										m_npcARMarkers[active_npc].changeState(MarkerStateEnum.READY);
									}
									active_npc = i;
									storeddistance = m_npcARMarkers[i].distanceFrom(m_playerARMarker.getPosition());
									enableconversation = true;
								}
								else
								{
									if (m_npcARMarkers[active_npc].currentState != MarkerStateEnum.IDLE)
									{
										m_npcARMarkers[active_npc].changeState(MarkerStateEnum.IDLE);
									}
								}
							}									
							else
							{
								if (m_npcARMarkers[i].currentState == MarkerStateEnum.IDLE)
								{
									//console.log("change to talk for " + i);
									m_npcARMarkers[i].changeState(MarkerStateEnum.READY);
								}
								active_npc = i;
								storeddistance = m_npcARMarkers[i].distanceFrom(m_playerARMarker.getPosition());
								enableconversation = true;									
							}

						}
						else
						{
							if (m_npcARMarkers[i].currentState != MarkerStateEnum.IDLE)
							{
								//console.log("change to idle for " + i);
								m_npcARMarkers[i].changeState(MarkerStateEnum.IDLE);
							}
						}
					}
				}
			}

		}
		else
		{
			enableconversation = false;
			m_activeNPC = 0;
			for(var i=0;i<m_npcARMarkers.length;i++)
			{ 
				if (m_npcARMarkers[i].isVisible())
				{
					visiblemarkercount++;
				}
				if (m_npcARMarkers[i].currentState != MarkerStateEnum.IDLE)
				{
					m_npcARMarkers[i].changeState(MarkerStateEnum.IDLE);
				}
			}
		}
		
		
		m_enableConversation = enableconversation;
		
		
		if (m_enableConversation)
		{
			m_activeNPC = active_npc;
			if (m_playerARMarker.currentState !=  MarkerStateEnum.TALK)
			{
				//console.log("change to talk for player");
				m_playerARMarker.changeState(MarkerStateEnum.TALK);
			}
		}
		else
		{
			m_activeNPC = 0;
			if (m_playerARMarker.currentState != MarkerStateEnum.IDLE)
			{
				//console.log("change to idle for player");
				m_playerARMarker.changeState(MarkerStateEnum.IDLE);
			}
		}	
		
		//hack to mitigate problem with lighting with more model leads to greater intensity of lights
		if (m_ARMarkerVisibleCount != visiblemarkercount)
		{
			//chnage in number so change lighting
			if (visiblemarkercount > 1)
			{
				
				if (m_sceneLightsGroup != null)
				{
					var j = 0;
					var k = 0; 
					for(var i=0;i<m_sceneLightsGroup.children.length;i++) {

						const light = m_sceneLightsGroup.children[i];
						
 						//if ((light.type == 'Lensflare') && (light.type != 'DirectionalLight') && (typeof light.intensity != 'undefined'))
						//if ((light.type != 'Lensflare') && (light.type != 'DirectionalLight') && (typeof light.intensity != 'undefined'))
						//{
						if (light.type == 'AmbientLight')
						{
							
							
							light.intensity = (storedAmbientLightIntensities[j]) / (4.3 * (visiblemarkercount - 1)) ;
							console.log("light.type " + light.type + " intensity " + light.intensity);
							if (j < storedAmbientLightIntensities.length)
							{
								j++;
							}
						}
						 if (light.type == 'HemisphereLight')
						{
							
							light.intensity = (storedHemisphereLightIntensities[k]) / (4.3 * (visiblemarkercount - 1)) ;
							console.log("light.type " + light.type + " intensity " + light.intensity);
							if (k < storedHemisphereLightIntensities.length)
							{
								k++;
							}
						} 
					}
				}
			}
			else
			{

				var j = 0;
				var k = 0; 
				for(var i=0;i<m_sceneLightsGroup.children.length;i++) {
					const light = m_sceneLightsGroup.children[i];
					if (light.type == 'AmbientLight')
					{
		
						light.intensity = (storedAmbientLightIntensities[j]) ;
						console.log("light.type " + light.type + " intensity " + light.intensity);
						if (j < storedAmbientLightIntensities.length)
						{
							j++;
						}
					}
					if (light.type == 'HemisphereLight')
					{
	
						light.intensity = (storedHemisphereLightIntensities[k]) ;
						console.log("light.type " + light.type + " intensity " + light.intensity);
						if (k < storedHemisphereLightIntensities.length)
						{
							k++;
						}
					}
				}
			}
		}
		m_ARMarkerVisibleCount = visiblemarkercount;	
		

		
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.ARUNLOADING:
		//stop webcam '
		

		
		document.getElementById("loader").style.display = "inline";
		console.log( "before", m_renderer.info.memory );
		m_ARMarkerVisibleCount = 0;
		m_ActiveClickPoints.length = 0;
		setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
		m_enableTouchClick = false;	
		m_lerpValue = 0;
		if (m_playerARMarker != null)
		{
			m_playerARMarker.dispose();
		}
		storedHemisphereLightIntensities.length = 0;
		storedAmbientLightIntensities.length = 0;
		
		for(var i=0;i<m_npcARMarkers.length;i++)
		{ 
			m_npcARMarkers[i].dispose();
			m_npcARMarkers[i] = null;
		}
		
		if (m_sceneLightsGroup != null)
		{
			for (var i = m_sceneLightsGroup.children.length - 1; i >= 0; i--) {
				const light = m_sceneLightsGroup.children[i];
				console.log("light.type " + light.type);
 
				if ( light.shadow && light.shadow.map ) {

					light.shadow.map.dispose();

				}
				if (light.type == 'Lensflare')
				{
					light.dispose();
				}
				else
				{
					disposeSceneMesh(light);
				}
				m_sceneLightsGroup.remove(light);
			}
		}
		m_scene.remove(m_sceneLightsGroup);
		m_sceneLightsGroup = null;
		
		
		//remove three.js stuff
		
		m_scene.remove(m_camera);
		m_camera = null;

		m_scene = null;
		console.log( "after", m_renderer.info.memory );
			
		if (m_renderer != null)
		{
			m_renderer.dispose();
			m_renderer.forceContextLoss(); 
			m_renderer.context=undefined;
			m_renderer.domElement=undefined;
			m_renderer = null;
		}
		//canvases
		m_canvas3d = null;
		
		m_playerARMarker = null;
		if (m_npcARMarkers != null)
		{
			m_npcARMarkers.length = 0;
			m_npcARMarkers = null;
		}
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		//m_arToolkitContext = null;
		unloadARContext();
		
		document.getElementById("loader").style.display = "none";
		m_enableTouchClick = true;		
		m_GameState = GameStateEnum.SCANQRCODE;
		
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.AVATARGENDERCHOICE:
		if (m_clickCollisonValue > -1)
		{
			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			
			case "back":
				//set up buttons
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_enableTouchClick = true;		
				m_GameState = GameStateEnum.SCANQRCODE;
				break;
			case "female":	
			case "male":
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_selectedGender = m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase();
				m_ARState = ARStateEnum.AVATARCHOICE;
					
				m_tempSelectedAvatar = 0;
				m_tempSelectedAvatarTexture = 0;
				m_loadingComplete = false;
				m_loadingError = false;
				m_loadingErrorMessage = "";
				m_transition = 0;
				m_LerpedAlpha.length = 0;
				m_LerpedAlpha[0] = 0;
				m_lerpValue = 0;	
				m_progressLoading = "0%";
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				document.getElementById("loader").style.display = "inline";
				m_enableTouchClick = false;					
				m_GameState = GameStateEnum.AVATARCHOICELOADING;
				break;

			}
			m_clickCollisonValue = -1;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.AVATARCHOICELOADING:
		if (m_transition == 0)
		{
			if ((m_lerpValue < 1) )
			{

				m_LerpedAlpha.length = 0;
				var C = [0];
				var D = [1];
				m_LerpedAlpha = lerp(C, D, m_lerpValue);
				m_lerpValue += LERPSPEED * 1.9;
			}
			else
			{
				m_ARState = ARStateEnum.SCANNING;
			
				//only do this once, set up three.js stuff
				m_canvas3d = document.createElement('canvas');
			
				m_canvas3d.width = m_Structure.qrscanner.cameraresolution.width;
				m_canvas3d.height = m_Structure.qrscanner.cameraresolution.height;
				m_canvas3d.style.position = 'absolute'
				m_canvas3d.style.top = '0px'
				m_canvas3d.style.left = '0px'
				m_canvas3d.style.zIndex = "1";
	
				m_renderer	= new THREE.WebGLRenderer({
					canvas: m_canvas3d,
					antialias	: true,
					alpha: true
				});		
				m_renderer.setSize( m_Structure.qrscanner.cameraresolution.width, m_Structure.qrscanner.cameraresolution.height );
				m_camera = new THREE.PerspectiveCamera( 45, m_Structure.qrscanner.cameraresolution.width / m_Structure.qrscanner.cameraresolution.height, 1, 2000 );

	
				// creating a new scene
				m_scene = new THREE.Scene();
				m_camera.position.set( 0, 0, 0 );
				m_scene.add(m_camera);
			
			
				// create an atToolkitContext
				loadARContext();
				
				
/*				ArToolkitContext.baseURL = '../';
				m_arToolkitContext = null;
				m_arToolkitContext = new ArToolkitContext({
					cameraParametersUrl: "data/data/camera_para.dat",
					detectionMode: 'mono',
					maxDetectionRate: m_Structure.qrscanner.cameraresolution.maxdetectionrate,
					// The two following settings adjusts the resolution. Higher is better (less flickering) but slower
					canvasWidth: m_Structure.qrscanner.cameraresolution.width,
					canvasHeight: m_Structure.qrscanner.cameraresolution.height
				});
	
				m_arToolkitContext.init(() => {
					m_camera.projectionMatrix.copy(m_arToolkitContext.getProjectionMatrix());
				});
			
				if( m_arToolkitSource.ready)
				{
					onResize();
					m_arToolkitContext.update( m_arToolkitSource.domElement );
				} */
			
				//set up buttons
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.arscanner.backbutton.x, m_Structure.arscanner.backbutton.y, m_Structure.arscanner.backbutton.radius, m_Structure.arscanner.backbutton.scale, m_Structure.arscanner.backbutton.rotation, m_Structure.arscanner.backbutton.type, m_Structure.arscanner.backbutton.scale, m_Structure.arscanner.backbutton.anchorpoint);		

		
				//load manager
		
				var manager = new THREE.LoadingManager();
				manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

				};

				manager.onLoad = function ( ) {

					console.log( 'Loading complete!');
					m_loadingComplete = true;
					m_progressLoading = "100%";

				};
				manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
					m_progressLoading = (Math.floor((itemsLoaded / itemsTotal) * 100)) + "%";
				};
				manager.onError = function ( url ) {

					console.log( 'There was an error loading ' + url );
					m_loadingErrorMessage = "Error loading " + url;
					m_loadingError = true;
				};
			
				//loader, marker, scene, artoolkitcontext
				var avatars = [];
			
				m_Content.avatarchoice.models.forEach( function( item ) {

					if (item.avatar.gender.toLowerCase() == m_selectedGender)
					{
						avatars.push(item.avatar);
					}
				});
			
								
				m_ARState = ARStateEnum.AVATARCHOICE;
					

			
			
			
				m_Content.coursework.exercises[m_selectedExercise].exercise.content.forEach( function( item ) {

					if (item.hasOwnProperty('light'))
					{
						setupLights(item, manager);

					}
				
					if (item.hasOwnProperty('marker'))
					{			
						if (item.marker.markertype.toLowerCase() == "player")
						{
							if (avatars.length > 0)
							{
								m_tempSelectedAvatarTexture = 0;
								m_playerARMarker = null;
								m_playerARMarker = new ArMarker(manager, m_scene, m_arToolkitContext, item.marker, 0, ARAvatarMarkerType.SELECTION);
					
								m_playerARMarker.setModelsNum(avatars.length);
								for(var i=0;i<avatars.length;i++)
								{ 
									m_playerARMarker.addMesh((avatars[i]).model + "_selecttakes.fbx", avatars[i], i, 0);
								} 

								setupButton(m_leftButtonImage, m_Structure.arscanner.leftbutton.x, m_Structure.arscanner.leftbutton.y, m_Structure.arscanner.leftbutton.radius, m_Structure.arscanner.leftbutton.scale, m_Structure.arscanner.leftbutton.rotation, m_Structure.arscanner.leftbutton.type, m_Structure.arscanner.leftbutton.scale, m_Structure.arscanner.leftbutton.anchorpoint);		
								setupButton(m_rightButtonImage, m_Structure.arscanner.rightbutton.x, m_Structure.arscanner.rightbutton.y, m_Structure.arscanner.rightbutton.radius, m_Structure.arscanner.rightbutton.scale, m_Structure.arscanner.rightbutton.rotation, m_Structure.arscanner.rightbutton.type, m_Structure.arscanner.rightbutton.scale, m_Structure.arscanner.rightbutton.anchorpoint);		
								setupButton(m_tickButtonImage, m_Structure.arscanner.tickbutton.x, m_Structure.arscanner.tickbutton.y, m_Structure.arscanner.tickbutton.radius, m_Structure.arscanner.tickbutton.scale, m_Structure.arscanner.tickbutton.rotation, m_Structure.arscanner.tickbutton.type, m_Structure.arscanner.tickbutton.scale, m_Structure.arscanner.tickbutton.anchorpoint);		
								setupButton(m_crossButtonImage, m_Structure.arscanner.crossbutton.x, m_Structure.arscanner.crossbutton.y, m_Structure.arscanner.crossbutton.radius, m_Structure.arscanner.crossbutton.scale, m_Structure.arscanner.crossbutton.rotation, m_Structure.arscanner.crossbutton.type, m_Structure.arscanner.crossbutton.scale, m_Structure.arscanner.crossbutton.anchorpoint);		
							}

						}
					}
						
				});
				m_lerpValue = 0;
				m_transition++;
			}
		}
		else
		{
		
			if ((m_loadingComplete) && ( m_arToolkitSource.ready) && (!m_loadingError))
			{
				if ((m_lerpValue < 1) )
				{
					m_LerpedAlpha.length = 0;
					var C = [1];
					var D = [0];
					m_LerpedAlpha = lerp(C, D, m_lerpValue);
					m_lerpValue += LERPSPEED * 1.9;
				}
				else
				{
					document.getElementById("loader").style.display = "none";
					m_enableTouchClick = true;
					m_lerpValue = 0;
					resizeCanvas();
					m_playerARMarker.showModel(0);
					m_GameState = GameStateEnum.AVATARCHOICE;
				}
			}
			else
			{
				if ((m_loadingError) && (m_loadingComplete))
				{
					if ((m_lerpValue < 1) )
					{
						m_LerpedAlpha.length = 0;
						var C = [1];
						var D = [0];
						m_LerpedAlpha = lerp(C, D, m_lerpValue);
						m_lerpValue += LERPSPEED * 1.9;
					}
					else
					{
						m_GameState = GameStateEnum.AVATARCHOICEUNLOADING;
					}
				}
			}
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.AVATARCHOICE:
		if( !m_arToolkitSource.ready === false)
		{
			
			m_arToolkitContext.update( m_arToolkitSource.domElement );
		}
		
		if (m_clickCollisonValue > -1)
		{

			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			
			case "back":
				//set up buttons
				if (!screenfull.isFullscreen)
				{
					m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
				}
				m_ActiveClickPoints.length = 0;
				setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
				m_GameState = GameStateEnum.AVATARCHOICEUNLOADING;
				break;
			case "left":
				if (m_playerARMarker.isVisible())
				{
					switch (m_ARState) {
					
					case ARStateEnum.AVATARCHOICE:
						if (m_tempSelectedAvatar == 0)
						{
							m_tempSelectedAvatar = m_playerARMarker.getModelsNum() - 1;
						}
						else
						{
							m_tempSelectedAvatar--;
						}
						m_playerARMarker.showModel(m_tempSelectedAvatar);
						break;
					case ARStateEnum.TEXTURECHOICE:
						if (m_tempSelectedTexture == 0)
						{
							m_tempSelectedTexture = m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures.length - 1;
						}
						else
						{
							m_tempSelectedTexture--;
						}

						document.getElementById("loader").style.display = "inline";
						m_enableTouchClick = false;
						m_playerARMarker.replaceTexture(m_tempSelectedAvatar, m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures[m_tempSelectedTexture].texture.filename);

						break;
					}
				}
				break;
			case "right":
				if (m_playerARMarker.isVisible())
				{
					switch (m_ARState) {
					
					case ARStateEnum.AVATARCHOICE:
						if (m_tempSelectedAvatar == (m_playerARMarker.getModelsNum() - 1))
						{
							m_tempSelectedAvatar = 0;
						}
						else
						{
							m_tempSelectedAvatar++;
						}
						m_playerARMarker.showModel(m_tempSelectedAvatar);
						break;
					case ARStateEnum.TEXTURECHOICE:
						if (m_tempSelectedTexture == (m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures.length - 1))
						{
							m_tempSelectedTexture = 0;
						}
						else
						{
							m_tempSelectedTexture++;
						}
						document.getElementById("loader").style.display = "inline";
						m_enableTouchClick = false;
						m_playerARMarker.replaceTexture(m_tempSelectedAvatar, m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures[m_tempSelectedTexture].texture.filename);


						break;
					}
				}
				break;
			case "no":
				if (m_playerARMarker.isVisible())
				{
					if (!screenfull.isFullscreen)
					{
						m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
					}
					switch (m_ARState) {
					
					case ARStateEnum.AVATARCHOICE:
						m_ActiveClickPoints.length = 0;
						setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
						m_GameState = GameStateEnum.AVATARCHOICEUNLOADING;
						break;
					
					case ARStateEnum.TEXTURECHOICE:
						m_tempSelectedTexture = 0;
						document.getElementById("loader").style.display = "inline";
						m_enableTouchClick = false;
						m_playerARMarker.replaceTexture(m_tempSelectedAvatar, m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures[m_tempSelectedTexture].texture.filename);

						m_ARState = ARStateEnum.AVATARCHOICE;
						
						break;
					}
				}
				break;
			case "yes":
				if (m_playerARMarker.isVisible())
				{
					if (!screenfull.isFullscreen)
					{
						m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
					}
					switch (m_ARState) {
					
					case ARStateEnum.AVATARCHOICE:
						var modelid = m_playerARMarker.getModelID(m_tempSelectedAvatar);
						for(var i=0;i<m_Content.avatarchoice.models.length;i++)
						{ 
							if ((m_Content.avatarchoice.models[i].avatar.id == modelid) && (m_Content.avatarchoice.models[i].avatar.gender.toLowerCase() == m_selectedGender))
							{								
								m_tempSelectedAvatarModelIndex = i;
								break;
							}
						}
			 			if (m_Content.avatarchoice.models[m_tempSelectedAvatarModelIndex].avatar.textures.length > 1)
						{
							m_ARState = ARStateEnum.TEXTURECHOICE;
						}
						else
						{
							m_selectedAvatarID = m_playerARMarker.getModelID(m_tempSelectedAvatar);
							m_selectedAvatarTexture = 0;
							setCookie("avatar", m_selectedAvatarID, 30);
							setCookie("texture", m_selectedAvatarTexture, 30);
							m_ActiveClickPoints.length = 0;
							setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
							m_ARState = ARStateEnum.AVATARCHOICECOMPLETED;
							m_playerARMarker.changeState(MarkerStateEnum.CHEER);
							m_timer = window.setTimeout(function() { m_GameState = GameStateEnum.AVATARCHOICEUNLOADING; }, 8000);

						} 
						break;
					
					case ARStateEnum.TEXTURECHOICE:
						m_selectedAvatarTexture = m_tempSelectedTexture;
						m_selectedAvatarID = m_playerARMarker.getModelID(m_tempSelectedAvatar);
						setCookie("avatar", m_selectedAvatarID, 30);
						setCookie("texture", m_selectedAvatarTexture, 30);
						m_ActiveClickPoints.length = 0;
						setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
						m_ARState = ARStateEnum.AVATARCHOICECOMPLETED;
						m_playerARMarker.changeState(MarkerStateEnum.CHEER);
						m_timer = window.setTimeout(function() { m_GameState = GameStateEnum.AVATARCHOICEUNLOADING; }, 8000);

						break;
					}
				}
				break;

			} 
			m_clickCollisonValue = -1;

			
		}

		m_playerARMarker.update();
		

		
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	
	case GameStateEnum.AVATARCHOICEUNLOADING:
		
		document.getElementById("loader").style.display = "inline";
		
		console.log( "before", m_renderer.info.memory );
		window.clearTimeout(m_timer);
		m_timer = null;
		m_enableTouchClick = false;	
		m_lerpValue = 0;
		if (m_playerARMarker != null)
		{
			m_playerARMarker.dispose();
		}
	
		//remove three.js stuff
		
		
		if (m_sceneLightsGroup != null)
		{
			for (var i = m_sceneLightsGroup.children.length - 1; i >= 0; i--) {
				const light = m_sceneLightsGroup.children[i];
				console.log("light.type " + light.type);
 
				if ( light.shadow && light.shadow.map ) {

					light.shadow.map.dispose();

				}
				if (light.type == 'Lensflare')
				{
					light.dispose();
				}
				else
				{
					disposeSceneMesh(light);
				}
				m_sceneLightsGroup.remove(light);
			}
		}
		m_scene.remove(m_sceneLightsGroup);
		m_sceneLightsGroup = null;
		
		
		m_scene.remove(m_camera);
		m_camera = null;
		m_playerARMarker = null;
		m_scene = null;
		
		console.log( "after", m_renderer.info.memory );
			
		if (m_renderer != null)
		{
			m_renderer.dispose();
			m_renderer.forceContextLoss(); 
			m_renderer.context=undefined;
			m_renderer.domElement=undefined;
			m_renderer = null;
		}
		
		//canvases
		m_canvas3d = null;
		
		unloadARContext();
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		//m_arToolkitContext = null;
		
		document.getElementById("loader").style.display = "none";
		m_enableTouchClick = true;	
		if (m_ARState == ARStateEnum.AVATARCHOICECOMPLETED)
		{	
			m_ActiveClickPoints.length = 0;
			setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
			m_enableTouchClick = true;		
			m_GameState = GameStateEnum.SCANQRCODE;
		}
		else
		{
			m_ActiveClickPoints.length = 0;
			setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
			setupButton(m_maleButtonImage, m_Structure.arscanner.malebutton.x, m_Structure.arscanner.malebutton.y, m_Structure.arscanner.malebutton.radius, m_Structure.arscanner.malebutton.scale, m_Structure.arscanner.malebutton.rotation, m_Structure.arscanner.malebutton.type, m_Structure.arscanner.malebutton.scale, m_Structure.arscanner.malebutton.anchorpoint);							
			setupButton(m_femaleButtonImage, m_Structure.arscanner.femalebutton.x, m_Structure.arscanner.femalebutton.y, m_Structure.arscanner.femalebutton.radius, m_Structure.arscanner.femalebutton.scale, m_Structure.arscanner.femalebutton.rotation, m_Structure.arscanner.femalebutton.type, m_Structure.arscanner.femalebutton.scale, m_Structure.arscanner.femalebutton.anchorpoint);		
			m_enableTouchClick = true;	
			m_GameState = GameStateEnum.AVATARGENDERCHOICE;
		}
		
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.VRLOADING:

	
		if ((m_lerpValue < 1) )
		{

			m_LerpedAlpha.length = 0;
			var C = [0];
			var D = [1];
			m_LerpedAlpha = lerp(C, D, m_lerpValue);
			m_lerpValue += LERPSPEED * 1.9;
		}
		else
		{
			if (m_transition == 0)
			{
				m_lerpValue = 1;

				m_playerVRCharacter = null;
	/* 			m_npcVRCharacters = null;
				m_npcVRCharacters = new Array;
				m_npcVRCharacters.length = 0; */
			
				m_polyfill = new WebVRPolyfill(config);
				m_renderer = new THREE.WebGLRenderer( { antialias: false } );
				
				//m_renderer.setClearColor( 0x000000 );
				m_renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
			
				// Append the canvas element created by the renderer to document body element.
				m_canvasVR = m_renderer.domElement;
				m_canvasVR.width = window.innerWidth;
				m_canvasVR.height = window.innerHeight;
				m_canvasVR.style.position = 'absolute'
				m_canvasVR.style.top = '0px'
				m_canvasVR.style.left = '0px'
				m_canvasVR.id = 'm_canvasVR';
			
				//m_sceneModels.length = 0;
				
				m_scene = new THREE.Scene();
			
				m_effect = new THREE.VREffect(m_renderer);
				m_effect.setSize(window.innerWidth, window.innerHeight);
				
				
				//load manager
		
				var manager = new THREE.LoadingManager();
				manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

				};

				manager.onLoad = function ( ) {

					console.log( 'Loading complete!');
					m_loadingComplete = true;
					m_progressLoading = "100%";

				};
				manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

					console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
					m_progressLoading = (Math.floor((itemsLoaded / itemsTotal) * 100)) + "%";
				};
				manager.onError = function ( url ) {

					console.log( 'There was an error loading ' + url );
					m_loadingErrorMessage = "Error loading " + url;
					m_loadingError = true;
				};
					
				loadShadowRenderer = false;
				
				for(var i=0;i<m_Content.coursework.exercises[m_selectedExercise].exercise.content.length;i++)
				{ 
					
					if (m_Content.coursework.exercises[m_selectedExercise].exercise.content[i].hasOwnProperty('playervr'))
					{	

						m_playerVRCharacter = null;
						m_playerVRCharacter = new VrCharacter(manager, m_scene, m_Content.coursework.exercises[m_selectedExercise].exercise.content[i].playervr, m_renderer);
						setupVRDisplay();
						m_transition++;
						break;

					}
				}
				
				
			}
			if (m_transition == 1)
			{
				
				if ((m_playerVRCharacter != null) && (m_vrDisplay != null) && (m_controls != null))
				{
					
					m_Content.coursework.exercises[m_selectedExercise].exercise.content.forEach( function( item ) {

						if (item.hasOwnProperty('playervr'))
						{
							if (item.playervr.showavatar)
							{
								var modelindex = 0;
								if (m_selectedAvatarID != null)
								{
									for(var j=0;j<m_Content.avatarchoice.models.length;j++)
									{ 
										if (m_Content.avatarchoice.models[j].avatar.id == m_selectedAvatarID)
										{								
											modelindex = j;
											break;
										}
									}
								}
								m_playerVRCharacter.addPlayerAvatar(m_Content.avatarchoice.models[modelindex].avatar.model + "_vrtakes.fbx", m_Content.avatarchoice.models[modelindex].avatar, m_selectedAvatarTexture);
								m_controls.userHeight = m_Content.avatarchoice.models[modelindex].avatar.vrcamheight;
							}
						}
						
						if (item.hasOwnProperty('video360'))
						{
							m_playerVRCharacter.setPlayerVRType(VRTypeEnum.VIDEO360);
							m_playerVRCharacter.setPlayerHeight(m_controls.userHeight);
							var geometry = new THREE.SphereGeometry(500, 60, 40);

							m_video360Element = document.createElement('video');
							m_video360Element.crossOrigin = 'anonymous';
							m_video360Element.setAttribute('webkit-playsinline', 'true');
							m_video360Element.setAttribute('playsinline', 'true');
							m_video360Element.loop = true;
	
							var req = new XMLHttpRequest();
							req.open('GET', "assets/videos/" + item.video360.filename, true);
							req.responseType = 'blob';

							req.onload = function() {
							// Onload is triggered even on 404
							// so we need to check the status code
								if (this.status === 200) {
									var videoBlob = this.response;
									var vid = URL.createObjectURL(videoBlob); // IE10+
						
									// Video is now downloaded
									// and we can set it as source on the video element
									m_video360Element.src = vid;
									m_loadingComplete = true;
								}
							}
				
							req.onprogress = function (event) {
						
								m_progressLoading = (Math.floor((event.loaded / event.total) * 100)) + "%";

							};
				
							req.onerror = function() {
								// Error
								m_loadingErrorMessage = "Error loading video";
								m_loadingError = true;
								m_loadingComplete = true;
								console.log("error loading video");
							}

							req.send();
								
								
							m_360Texture = new THREE.Texture(m_video360Element);
							m_360Texture.minFilter = THREE.LinearFilter;
							m_360Texture.magFilter = THREE.LinearFilter;
							m_360Texture.format = THREE.RGBFormat;
					
							var material = new THREE.MeshBasicMaterial({ map: m_360Texture, side: THREE.DoubleSide });
							m_360SphereMesh = new THREE.Mesh(geometry, material);
							m_360SphereMesh.scale.x = -1;
							m_360SphereMesh.position.set(0, m_controls.userHeight, -1);
							m_scene.add(m_360SphereMesh);
						}
							
						if (item.hasOwnProperty('texture360'))
						{
							var geometry = new THREE.SphereGeometry(500, 60, 40);
							var loader = new THREE.TextureLoader(manager);
							loader.load("assets/textures/360textures/" + item.texture360.filename, function ( object ) {
								m_360Texture = object;
								var material = new THREE.MeshBasicMaterial({ map: m_360Texture, side: THREE.DoubleSide });
								m_360SphereMesh = new THREE.Mesh(geometry, material);
								m_360SphereMesh.position.set(0, m_controls.userHeight, -1);
								m_scene.add(m_360SphereMesh);
								
							} );
						}
							
						if (item.hasOwnProperty('charactervr'))
						{
							switch (item.charactervr.charactertype.toLowerCase()) {
							case "npc":
								m_playerVRCharacter.setPlayerVRType(VRTypeEnum.DIALOG);
								var npcVRMarker = new VrCharacter(manager, m_scene, item.charactervr, null);
								npcVRMarker.setPlayer(m_playerVRCharacter);
								m_playerVRCharacter.addNPC(npcVRMarker);
								
								break;
							}


						}
						
						if (item.hasOwnProperty('cubemap'))
						{
							m_backgroundCubeMap = new THREE.CubeTextureLoader(manager)
								.setPath( 'assets/textures/' + item.cubemap.folder + '/' )
								.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

							m_backgroundCubeMap.format = THREE.RGBFormat;
							m_scene.background = m_backgroundCubeMap;

						}
						
						if (item.hasOwnProperty('light'))
						{
							setupLights(item, manager);

						}
							
						if (item.hasOwnProperty('modelvr'))
						{

							if (m_clickableObjectGroup == null)
							{
								m_clickableObjectGroup = new THREE.Group();
								m_scene.add(m_clickableObjectGroup);
							}
							
							console.log("loading vr " + item.modelvr.model);
							var loader1 = new THREE.FBXLoader(manager);
							loader1.load( 'assets/models/' + item.modelvr.model, function ( object ) {
							
								object.traverse( function ( child ) {

									if ( child.isMesh ) {
										child.castShadow = item.modelvr.castshadow;
										child.receiveShadow = item.modelvr.castshadow;
	
									}
								} );
								
								m_clickableObjectGroup.add( object );
								object.position.set(item.modelvr.x, item.modelvr.y, item.modelvr.z);
								object.name = item.modelvr.name;	
								console.log("object id " + object.id);									
								object.visible = true;
								applyMatrixOfMesh(object);
								var faceNormalsHelper = new THREE.FaceNormalsHelper( object, 1 );
								m_clickableObjectGroup.add( faceNormalsHelper );
								var vertexNormalsHelper = new THREE.VertexNormalsHelper( object, 1 );
								m_clickableObjectGroup.add(  vertexNormalsHelper );
								//m_sceneModels.push(object);

							});
						}
						
						if (item.hasOwnProperty('movemarker'))
						{
							m_playerVRCharacter.addMoveMarker(item.movemarker);
						}

							
						if (item.hasOwnProperty('objectVocab'))
						{
							m_playerVRCharacter.setPlayerVRType(VRTypeEnum.VOCABULARY);
							m_playerVRCharacter.addRecognitionItem(item.objectVocab);
						}
							
						if (item.hasOwnProperty('questionVocab'))
						{
							m_playerVRCharacter.setPlayerVRType(VRTypeEnum.QUESTIONS);
							m_playerVRCharacter.addRecognitionItem(item.questionVocab);
							
						}
						
					});
			
					m_transition++;
				}
			}
			if (m_transition == 2)
			{
				
				if ((m_loadingComplete) && (!m_loadingError) && (m_playerVRCharacter != null))
				{

					//if (m_playerVRCharacter.getNumRecognitionItems() > 0)

					if (m_clickableObjectGroup != null)
					{
						console.log("add m_clickableObjectGroup " + m_clickableObjectGroup);
						m_playerVRCharacter.setClickableObjectGroup(m_clickableObjectGroup);
					}
					if (m_sceneLightsGroup != null)
					{
						if (m_sceneLightsGroup.children.length > 0)
						{
							m_playerVRCharacter.setLightsGroup(m_sceneLightsGroup);
						}
					}
	/* 				if (m_npcVRCharacters != null)
					{
						if (m_npcVRCharacters.length > 0)
							m_playerVRCharacter.setPlayerVRType(VRTypeEnum.DIALOG);
					} */
					m_isMouseDown = false;
			
					
					m_transition++;

				}
				else if ((m_loadingError) && (m_loadingComplete))
				{
					
					m_ActiveClickPoints.length = 0;
					setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, 1, m_Structure.qrscanner.backbutton.anchorpoint);		
					m_enableTouchClick = false;	
					m_transition = 0;
					m_lerpValue = 0;
					m_LerpedAlpha.length = 0;
					m_LerpedAlpha[0] = 1;							
					m_GameState = GameStateEnum.VRUNLOADING;
				}
			}
				
			if (m_transition == 3)
			{
				if (m_vrDisplay != null)
				{

					m_ActiveClickPoints.length = 0;
					setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
					setupButton(m_entervrButtonImage, m_Structure.qrscanner.entervrbutton.x, m_Structure.qrscanner.entervrbutton.y, m_Structure.qrscanner.entervrbutton.radius, m_Structure.qrscanner.entervrbutton.scale, m_Structure.qrscanner.entervrbutton.rotation, m_Structure.qrscanner.entervrbutton.type, 1, m_Structure.qrscanner.entervrbutton.anchorpoint);								
					//stop webcam 
					unloadARCamera();
					
/* 					let stream = m_arToolkitSource.domElement.srcObject;
					let tracks = stream.getTracks();

					tracks.forEach(function(track) {
						track.stop();
					});

					m_arToolkitSource.domElement.srcObject = null;
					m_arToolkitSource.domElement = null;
					m_arToolkitSource = null; */
					m_qrcodeCanvas = null;

						
					//resizeCanvas();
					m_transition++;
				}
			}
		
			if (m_transition == 4)
			{

				m_enableTouchClick = true;	
				document.getElementById("loader").style.display = "none";
				if (m_clickCollisonValue > -1)
				{
					switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype.toLowerCase()) {
			
					case "back":
					//set up buttons
						if (!screenfull.isFullscreen)
						{
							m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
						}
						m_ActiveClickPoints.length = 0;
						setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, 1, m_Structure.qrscanner.backbutton.anchorpoint);		
						m_enableTouchClick = false;	
						m_transition = 0;
						m_lerpValue = 0;
						m_LerpedAlpha.length = 0;
						m_LerpedAlpha[0] = 1;							
						m_GameState = GameStateEnum.VRUNLOADING;
						break;

					case "entervr":
						console.log("entervr pressed");
						
						m_toggleStatePending[0] = ToggleStateEnum.VRSTATE;
						
	
						break;
					}
					m_clickCollisonValue = -1;
				}
			}
				
				
			
		}
		

		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.VR:
		
		if (m_controls != null)
		{
			m_controls.update();
		}
		
		if (m_playerVRCharacter != null)
		{
			m_playerVRCharacter.update();	
		}
/* 		for(var i=0;i<m_npcVRCharacters.length;i++)
		{ 
			m_npcVRCharacters[i].update();
		} */	
			
			

		if (m_video360Element != null)
		{
			if ( m_video360Element.readyState >= m_video360Element.HAVE_CURRENT_DATA ) {
				m_360Texture.needsUpdate = true;
			}

		}
		
		
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.VRUNLOADING:

			
		if (m_transition == 0)
		{	

			
			console.log( "before", m_renderer.info.memory );
			console.log( "before num scene", m_scene.children.length );
			
			document.getElementById("loader").style.display = "inline";	
			window.removeEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
			window.removeEventListener('vrdisplayconnect', onVRDisplayConnect);
			
			m_renderer.domElement.removeEventListener( 'mousedown', m_playerVRCharacter.onMouseDown, false );
			m_renderer.domElement.removeEventListener( 'mouseup', m_playerVRCharacter.onMouseUp, false );
			m_renderer.domElement.removeEventListener( 'touchstart', m_playerVRCharacter.onMouseDown, false );
			m_renderer.domElement.removeEventListener( 'touchend', m_playerVRCharacter.onMouseUp, false );
			
			if (m_video360Element != null)
			{
				m_video360Element.loop = false;
				m_video360Element.currentTime == 0;
				m_video360Element = null;
				
			}
			
			if (m_360Texture != null)
			{
				m_360Texture.dispose();
				m_360Texture = null;
			}
			
			if (m_360SphereMesh != null)
			{
				disposeSceneMesh(m_360SphereMesh);
				m_scene.remove(m_360SphereMesh);
				m_360SphereMesh = null;
			}
			
			var container = document.getElementById("container");
			if (m_canvas2d == null)
			{
				m_canvas2d = document.createElement('canvas');
				m_canvas2d.id = "main_canvas";
				container.appendChild(m_canvas2d);
				m_canvas2d.addEventListener("touchstart", handleStart, false);
				m_canvas2d.addEventListener("touchend", handleEnd, false);
				m_canvas2d.addEventListener("touchcancel", handleCancel, false);
				m_canvas2d.addEventListener("touchleave", handleEnd, false);
				m_canvas2d.addEventListener("touchmove", handleMove, false);
				m_canvas2dContext = m_canvas2d.getContext('2d');
				m_canvas2d.style.zIndex = "0";				
			}
			setupARCamera();
		/* 	//Artoolkit stuff
			m_arToolkitSource = new ArToolkitSource({
				sourceType : 'webcam',
				sourceWidth: m_Structure.qrscanner.cameraresolution.width,
				sourceHeight: m_Structure.qrscanner.cameraresolution.height,
				// resolution displayed for the source 
				displayWidth: m_Structure.qrscanner.cameraresolution.width,
				displayHeight: m_Structure.qrscanner.cameraresolution.height
			});
	
	
			m_arToolkitSource.init(function onReady(){
	
			})
		
			m_qrcodeCanvas = document.createElement('canvas');
		 
			m_qrcodeCanvas.width = m_Structure.qrscanner.cameraresolution.width;
			m_qrcodeCanvas.height = m_Structure.qrscanner.cameraresolution.height;
			m_qrcodeCanvas.style.position = 'absolute'
			m_qrcodeCanvas.style.top = '0px'
			m_qrcodeCanvas.style.left = '0px' */
			resizeCanvas();
			qrcode.callback = read;
			
			if (m_playerVRCharacter != null)
			{
				m_playerVRCharacter.dispose();
				m_playerVRCharacter = null;				
			}
		/* 	if (m_npcVRCharacters != null)
			{
				for(var i=0;i<m_npcVRCharacters.length;i++)
				{ 
					m_npcVRCharacters[i].dispose();
					m_npcVRCharacters[i] = null;
				}	
				m_npcVRCharacters.length = 0;
				m_npcVRCharacters = null;
			} */
			m_vrDisplay = null;
			m_controls = null; 
			m_effect = null;
			
			if (m_backgroundCubeMap != null)
			{
				
				disposeSceneMesh(m_backgroundCubeMap);
				m_scene.remove(m_backgroundCubeMap);
				m_scene.background.dispose();
				m_backgroundCubeMap = null;
			}

			if (m_sceneLightsGroup != null)
			{
				for (var i = m_sceneLightsGroup.children.length - 1; i >= 0; i--) {
					const light = m_sceneLightsGroup.children[i];
					console.log("light.type " + light.type);
 
					if ( light.shadow && light.shadow.map ) {

						light.shadow.map.dispose();

					}
					disposeSceneMesh(light);
					if (light.type == 'Lensflare')
					{
						light.dispose();
					}
					m_sceneLightsGroup.remove(light);
				}
			}
			m_scene.remove(m_sceneLightsGroup);
			m_sceneLightsGroup = null;
			
			if (m_clickableObjectGroup != null)
			{
				for (var i = m_clickableObjectGroup.children.length - 1; i >= 0; i--) {
					disposeSceneMesh(m_clickableObjectGroup.children[i]);
					m_clickableObjectGroup.remove(m_clickableObjectGroup.children[i]);
				}
			}
			m_scene.remove(m_clickableObjectGroup);
			m_clickableObjectGroup = null;
/* 			console.log("scenemodel length " + m_sceneModels.length);
			for (var i = 0; i < m_sceneModels.length; i++) {
			//for (var i = m_sceneModels.length - 1; i >= 0; i--) {
				console.log("dispose scenemodel " + i);
				disposeSceneMesh(m_sceneModels[i]);
			}
			m_sceneModels.length = 0; */
			
			console.log( "after num scene" +  m_scene.children.length );
			console.log( "after", m_renderer.info.memory );
			
			
			m_scene = null;
			
			
			
			if (m_renderer != null)
			{
				m_renderer.dispose();
				m_renderer.forceContextLoss(); 
				m_renderer.context=undefined;
				m_renderer.domElement=undefined;
				m_renderer = null;
			}
		
	
			m_polyfill = null;
			m_ActiveClickPoints.length = 0;
			setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
			m_transition++;
		}
		else
		{
			if (m_canvasVR != null)
			{
				var container = document.getElementById("container");
				console.log("remove m_canvasVR");
				if (container.contains(document.getElementById("m_canvasVR")))
				{
					container.removeChild(m_canvasVR);
				}

				m_canvasVR = null;
			}
			
			
			if ( m_arToolkitSource.ready)
			{	
				if ((m_lerpValue <= 1) )
				{
					m_LerpedAlpha.length = 0;
					var C = [1];
					var D = [0];
					m_LerpedAlpha = lerp(C, D, m_lerpValue);
					m_lerpValue += LERPSPEED * 1.9;
				}
				else
				{	
					document.getElementById("loader").style.display = "none";		
					m_enableTouchClick = true;		
					m_GameState = GameStateEnum.SCANQRCODE;
				}
			}
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
		
	}
	
	if (m_GameState != GameStateEnum.LOADING)
	{
		render();
	}
		
	if ((m_vrDisplay != null) && (m_vrDisplay.isPresenting) && (m_GameState != GameStateEnum.VRUNLOADING))
	{
		
		m_vrDisplay.requestAnimationFrame(update);
	}
	else
	{
		requestAnimFrame(update);	
	}
}



function render() { 

	if (m_stats != null)
	{
		m_stats.begin();
	}
	
	if (m_RenderState == RenderStateEnum.RENDERALL)
	{
		if (m_canvas2d != null)
		{
			m_canvas2dContext = m_canvas2d.getContext('2d');
			m_canvas2dContext.clearRect(0, 0, m_canvas2d.width, m_canvas2d.height);
		}
		switch (m_GameState) {
			
		case GameStateEnum.LANDING:	
		
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			} 
			var textposx = (m_canvas2d.width / 2) + (m_Structure.toplevel.instructions.x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			var textposy = m_canvas2d.height - ((m_canvas2d.height / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - m_Structure.toplevel.instructions.y));
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_Structure.toplevel.instructions.text, m_Structure.toplevel.instructions.font1, m_Structure.toplevel.instructions.font2, m_Structure.toplevel.instructions.colour1, m_Structure.toplevel.instructions.colour2, m_Structure.toplevel.instructions.lineheight1, m_Structure.toplevel.instructions.lineheight2, m_Structure.toplevel.instructions.maxwidth, textposx, textposy, m_Structure.toplevel.instructions.rotation,   m_Structure.toplevel.instructions.alignment, m_Structure.toplevel.instructions.anchor, null, null); 	

			break;
			
		case GameStateEnum.SCANQRCODE:
			
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			//drawScaledCanvas(m_arToolkitSource.domElement, m_arToolkitSource.domElement.videoWidth, m_arToolkitSource.domElement.videoHeight);
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			}
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, "SCAN QR CODE", "bold 20px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 	
			
			renderCrossHair();
			break;
			
		case GameStateEnum.QRCODEFOUND:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			} 
			renderCrossHair();
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_Content.coursework.exercises[m_selectedExercise].exercise.title, "bold 20px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 				
			break;
			
		case GameStateEnum.VIDEOLOADING:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			renderCrossHair();
			drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			} 
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_progressLoading, "bold 30px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 				
			
			break;
		case GameStateEnum.VIDEO:
			drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, 1.0);
			if (m_isCurrentLandscape)
			{
				drawRotatedImage(m_canvas2dContext, m_windowedVideoPlayer, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, m_canvas2d.height / m_windowedVideoPlayer.height, 1.0);
			}
			else
			{
				drawRotatedImage(m_canvas2dContext, m_windowedVideoPlayer, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, 1.0);
			}
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			}

			
			switch (m_VideoCurrentStatus) {
				
			case VideoPlayStateEnum.NOTPLAYING:
				
				if (m_windowedVideoPlayer.currentTime == m_windowedVideoPlayer.duration)
				{
					drawRotatedImage(m_canvas2dContext, m_replayButtonImage, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, 1.0);	
				}
				if (m_windowedVideoPlayer.currentTime == 0)
				{
					drawRotatedImage(m_canvas2dContext, m_playButtonImage, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, 1.0);	
				}
				break;
			case VideoPlayStateEnum.PAUSED:
				if (m_pausedByUser)
				{
					drawRotatedImage(m_canvas2dContext, m_playButtonImage, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, 1.0);
				}
				else
				{
					if (m_windowedVideoPlayer.currentTime == 0)
					{
						drawRotatedImage(m_canvas2dContext, m_playButtonImage, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, 1.0);	
					}	
				}	
				break;
			}		
			
			break;	
		case GameStateEnum.VIDEOUNLOADING:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			renderCrossHair();
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			} 
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, "SCAN QR CODE", "bold 20px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 	
			drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
			if (m_isCurrentLandscape)
			{
				drawRotatedImage(m_canvas2dContext, m_windowedVideoPlayer, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, m_canvas2d.height / m_windowedVideoPlayer.height, m_LerpedAlpha[0]);
			}
			else
			{
				drawRotatedImage(m_canvas2dContext, m_windowedVideoPlayer, (m_canvas2d.width / 2),(m_canvas2d.height / 2),0, 1.0, m_LerpedAlpha[0]);
			}
			break;
		case GameStateEnum.AVATARGENDERCHOICE:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			}
			if (m_isCurrentLandscape)
			{
				var points = calculateLandscapePts(m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.anchorpoint)
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, "CHOOSE GENDER", m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, points[0] , points[1], m_Structure.arscanner.selectiontext.rotation,   m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
			}
			else
			{
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, "CHOOSE GENDER", m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.rotation,  m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
			}
			break;
		case GameStateEnum.AVATARCHOICELOADING:
		case GameStateEnum.ARLOADING:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						if (m_ActiveClickPoints[i].itemtype.toLowerCase() == "back")
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
						}
					}
					else
					{
						if (m_ActiveClickPoints[i].itemtype.toLowerCase() == "back")
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
						}
					}
					
				}
											
			} 
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_progressLoading, "bold 30px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 				
			if (m_loadingError)
			{
				
				if (m_isCurrentLandscape)
				{
					var points = calculateLandscapePts(m_Structure.arscanner.errormessage.x , m_Structure.arscanner.errormessage.y, m_Structure.arscanner.errormessage.anchorpoint)
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_loadingErrorMessage, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.maxwidth, points[0] , points[1], m_Structure.arscanner.errormessage.rotation,   m_Structure.arscanner.errormessage.alignment, m_Structure.arscanner.errormessage.anchor, null, null); 	
				}
				else
				{
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_loadingErrorMessage, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.maxwidth, m_Structure.arscanner.errormessage.x , m_Structure.arscanner.errormessage.y, m_Structure.arscanner.errormessage.rotation,  m_Structure.arscanner.errormessage.alignment, m_Structure.arscanner.errormessage.anchor, null, null); 	
				}
	
			}
			break;
		case GameStateEnum.ARSCAN:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			
			m_renderer.render( m_scene, m_camera );
			//ctx.drawImage(m_arToolkitContext.arController.canvas, 0, 0 );
			//m_canvas2dContext.drawImage(m_canvas3d, 0, 0 );
			m_canvas2dContext.drawImage(m_canvas3d, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						switch (m_ActiveClickPoints[i].itemtype.toLowerCase()) {

						case "mic":
							if (m_enableConversation)
							{
								switch (m_npcARMarkers[m_activeNPC].currentState)
								{
								case MarkerStateEnum.READY:
								case MarkerStateEnum.TALK:
									drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);								
									break;
								case MarkerStateEnum.LISTEN:
									drawRotatedImage(m_canvas2dContext, m_waitingImagesArray[(Math.round(m_LerpedControlPts[0]))], m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
									break;
								}

							}
							break;
						case "showsubtitles":
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							if (m_showSubtitles)
							{
								drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ON", "bold 12px Arial", "bold 12px Arial", "#ffffff", "#ffffff", 5, 5, 20, m_ActiveClickPoints[i].buttonObject.landscape_posx + 18 , m_ActiveClickPoints[i].buttonObject.landscape_posy, 0,  "left", "top", null, null); 		
							}
							else
							{
								drawPagewithTwoFontsTwoColours(m_canvas2dContext, "OFF", "bold 12px Arial", "bold 12px Arial", "#ffffff", "#ffffff", 5, 5, 20, m_ActiveClickPoints[i].buttonObject.landscape_posx + 18 , m_ActiveClickPoints[i].buttonObject.landscape_posy, 0,  "left", "top", null, null); 		
							}
							break;
						default:
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							break;
						}
					}
					else
					{
						switch (m_ActiveClickPoints[i].itemtype.toLowerCase()) {

						case "mic":
							if (m_enableConversation)
							{
								switch (m_npcARMarkers[m_activeNPC].currentState)
								{
								case MarkerStateEnum.READY:
								case MarkerStateEnum.TALK:
									drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
									break;
								case MarkerStateEnum.LISTEN:
									drawRotatedImage(m_canvas2dContext, m_waitingImagesArray[(Math.round(m_LerpedControlPts[0]))], m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
									break;
								}

							}
							break;
						case "showsubtitles":
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							if (m_showSubtitles)
							{
								drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ON", "bold 12px Arial", "bold 12px Arial", "#ffffff", "#ffffff", 5, 5, 20, m_ActiveClickPoints[i].buttonObject.portrait_posx + 12 , m_ActiveClickPoints[i].buttonObject.portrait_posy - 6, 0,  "left", "top", null, null); 		
							}
							else
							{
								drawPagewithTwoFontsTwoColours(m_canvas2dContext, "OFF", "bold 12px Arial", "bold 12px Arial", "#ffffff", "#ffffff", 5, 5, 20, m_ActiveClickPoints[i].buttonObject.portrait_posx + 12 , m_ActiveClickPoints[i].buttonObject.portrait_posy - 6, 0,  "left", "top", null, null); 		
							}
							break;
						default:
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							break;
						}
					}
				}
											
			}


			
			if ((m_showSubtitles) && (m_enableConversation))
			{
				if (m_npcARMarkers[m_activeNPC].getSubtitles()[0].length > 0)
				{
					if (m_npcARMarkers[m_activeNPC].getSubtitles()[0].length == 1)
					{
						var concatstr = "\b" + (m_npcARMarkers[m_activeNPC].getSubtitles()[0])[0];
						
						if (m_isCurrentLandscape)
						{
							var points = calculateLandscapePts(m_Structure.arscanner.subtitles.x , m_Structure.arscanner.subtitles.y, m_Structure.arscanner.subtitles.anchorpoint)
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, concatstr, m_Structure.arscanner.subtitles.font, m_Structure.arscanner.subtitles.font, (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.maxwidth, points[0] , points[1], m_Structure.arscanner.subtitles.rotation,   m_Structure.arscanner.subtitles.alignment, m_Structure.arscanner.subtitles.anchor, m_Structure.arscanner.subtitles.bckcolour, m_Structure.arscanner.subtitles.bckframe); 	
						}
						else
						{
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, concatstr, m_Structure.arscanner.subtitles.font, m_Structure.arscanner.subtitles.font, (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.maxwidth, m_Structure.arscanner.subtitles.x , m_Structure.arscanner.subtitles.y, m_Structure.arscanner.subtitles.rotation,  m_Structure.arscanner.subtitles.alignment, m_Structure.arscanner.subtitles.anchor, m_Structure.arscanner.subtitles.bckcolour, m_Structure.arscanner.subtitles.bckframe); 	
						}
					}
					else
					{
						var concatstr = "\b" + (m_npcARMarkers[m_activeNPC].getSubtitles()[0])[0] + "\f" + (m_npcARMarkers[m_activeNPC].getSubtitles()[0])[1];
						
						if (m_isCurrentLandscape)
						{
							var points = calculateLandscapePts(m_Structure.arscanner.subtitles.x , m_Structure.arscanner.subtitles.y, m_Structure.arscanner.subtitles.anchorpoint)
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, concatstr, m_Structure.arscanner.subtitles.font, m_Structure.arscanner.subtitles.font, (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[1], m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.maxwidth, points[0] , points[1], m_Structure.arscanner.subtitles.rotation,   m_Structure.arscanner.subtitles.alignment, m_Structure.arscanner.subtitles.anchor, m_Structure.arscanner.subtitles.bckcolour, m_Structure.arscanner.subtitles.bckframe); 	
						}
						else
						{
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, concatstr, m_Structure.arscanner.subtitles.font, m_Structure.arscanner.subtitles.font, (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[0], (m_npcARMarkers[m_activeNPC].getSubtitles()[1])[1], m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.lineheight, m_Structure.arscanner.subtitles.maxwidth, m_Structure.arscanner.subtitles.x , m_Structure.arscanner.subtitles.y, m_Structure.arscanner.subtitles.rotation,  m_Structure.arscanner.subtitles.alignment, m_Structure.arscanner.subtitles.anchor, m_Structure.arscanner.subtitles.bckcolour, m_Structure.arscanner.subtitles.bckframe); 	
						}
					}					
				}
			}
			
			if ((!m_playerARMarker.isVisible()) && (!m_npcARMarkerVisible))
			{
				var selectiontext = "USE AR MARKERS";
				if (m_isCurrentLandscape)
				{
					var points = calculateLandscapePts(m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.anchorpoint)
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, selectiontext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, points[0] , points[1], m_Structure.arscanner.selectiontext.rotation,   m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
				//drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_debugtext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, points[0] , points[1], m_Structure.arscanner.selectiontext.rotation,   m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
				}
				else
				{
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, selectiontext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.rotation,  m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
					//drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_debugtext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.rotation,  m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	

				}
			}
			break;
			
		case GameStateEnum.AVATARCHOICE:	

			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			m_renderer.render( m_scene, m_camera );
			//ctx.drawImage(m_arToolkitContext.arController.canvas, 0, 0 );
			//m_canvas2dContext.drawImage(m_canvas3d, 0, 0 );
			m_canvas2dContext.drawImage(m_canvas3d, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						switch (m_ActiveClickPoints[i].itemtype.toLowerCase()) {
						case "left":
						case "right":
						case "yes":
						case "no":
							if (m_playerARMarker.isVisible())
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							}
							break;

						default:
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							break;
						}
					}
					else
					{
						switch (m_ActiveClickPoints[i].itemtype.toLowerCase()) {
						case "left":
						case "right":
						case "yes":
						case "no":
							if (m_playerARMarker.isVisible())
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							}
							break;

						default:
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							break;
						}
					}
				}
											
			}
			var selectiontext = "";
			switch (m_ARState){
			
			case ARStateEnum.AVATARCHOICE:
				selectiontext = "CHOOSE AVATAR";
				break;
			case ARStateEnum.TEXTURECHOICE:
				selectiontext = "CUSTOMISE AVATAR";
				break;
			case ARStateEnum.AVATARCHOICECOMPLETED:
				selectiontext = "AVATAR UPDATED";
				break;
			}
			if (!m_playerARMarker.isVisible())
			{
					selectiontext = "USE AR MARKER";
			}
			if (m_isCurrentLandscape)
			{
				var points = calculateLandscapePts(m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.anchorpoint)
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, selectiontext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, points[0] , points[1], m_Structure.arscanner.selectiontext.rotation,   m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
				//drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_debugtext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, points[0] , points[1], m_Structure.arscanner.selectiontext.rotation,   m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
			}
			else
			{
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, selectiontext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.rotation,  m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	
				//drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_debugtext, m_Structure.arscanner.selectiontext.font, m_Structure.arscanner.selectiontext.font, '#ffffff', '#ffffff', m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.lineheight, m_Structure.arscanner.selectiontext.maxwidth, m_Structure.arscanner.selectiontext.x , m_Structure.arscanner.selectiontext.y, m_Structure.arscanner.selectiontext.rotation,  m_Structure.arscanner.selectiontext.alignment, m_Structure.arscanner.selectiontext.anchor, null, null); 	

			}
		
			break;
			
		case GameStateEnum.AVATARCHOICEUNLOADING:
		case GameStateEnum.ARUNLOADING:
			//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
			m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (m_isCurrentLandscape)
					{
						if (m_ActiveClickPoints[i].itemtype.toLowerCase() != "mic")
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
						}
					}
					else
					{
						if (m_ActiveClickPoints[i].itemtype.toLowerCase() != "mic")
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
						}
					}
					
				}
											
			}    
			break;
		case GameStateEnum.VRLOADING:
			if (m_canvas2d != null)
			{
				if (m_arToolkitSource != null)
				{
					//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
					m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
				}
				drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
				//if ((m_loadingComplete) && (!m_loadingError))
				if (m_transition == 4)
				{
					for(var i=0;i<m_ActiveClickPoints.length;i++)
					{
						if ((m_ActiveClickPoints[i].buttonObject != null))
						{
							if (m_isCurrentLandscape)
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							}
							else
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							}
					
						}
					}
/* 					if (m_isCurrentLandscape)
					{
						var points = calculateLandscapePts(m_Structure.qrscanner.entervrtext.x , m_Structure.qrscanner.entervrtext.y, m_Structure.qrscanner.entervrtext.anchorpoint)
						//drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ENTER VR", m_Structure.qrscanner.entervrtext.font, m_Structure.qrscanner.entervrtext.font, '#ffffff', '#ffffff', m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.maxwidth, points[0] , points[1], m_Structure.qrscanner.entervrtext.rotation,   m_Structure.qrscanner.entervrtext.alignment, m_Structure.qrscanner.entervrtext.anchor, null, null); 	
						drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ENTER VR", m_Structure.qrscanner.entervrtext.font, m_Structure.qrscanner.entervrtext.font, '#ffffff', '#ffffff', m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.maxwidth, m_canvas2d.width / 2 , (m_canvas2d.height / 2) + , m_Structure.qrscanner.entervrtext.rotation,   m_Structure.qrscanner.entervrtext.alignment, m_Structure.qrscanner.entervrtext.anchor, null, null); 	
					}
					else
					{ */
						//drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ENTER VR", m_Structure.qrscanner.entervrtext.font, m_Structure.qrscanner.entervrtext.font, '#ffffff', '#ffffff', m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.maxwidth, m_Structure.qrscanner.entervrtext.x , m_Structure.qrscanner.entervrtext.y, m_Structure.qrscanner.entervrtext.rotation,  m_Structure.qrscanner.entervrtext.alignment, m_Structure.qrscanner.entervrtext.anchor, null, null); 	
						drawPagewithTwoFontsTwoColours(m_canvas2dContext, "ENTER VR", m_Structure.qrscanner.entervrtext.font, m_Structure.qrscanner.entervrtext.font, '#ffffff', '#ffffff', m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.lineheight, m_Structure.qrscanner.entervrtext.maxwidth, m_canvas2d.width / 2 , (m_canvas2d.height / 2) + (m_Structure.qrscanner.entervrtext.y - (DEFAULTPORTRAITCANVASHEIGHT / 2)), m_Structure.qrscanner.entervrtext.rotation,  m_Structure.qrscanner.entervrtext.alignment, m_Structure.qrscanner.entervrtext.anchor, null, null); 	
					//}
				
				}
				else
				{
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_progressLoading, "bold 30px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null); 				
					if (m_loadingError)
					{	
				
						if (m_isCurrentLandscape)
						{
							var points = calculateLandscapePts(m_Structure.arscanner.errormessage.x , m_Structure.arscanner.errormessage.y, m_Structure.arscanner.errormessage.anchorpoint)
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_loadingErrorMessage, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.maxwidth, points[0] , points[1], m_Structure.arscanner.errormessage.rotation,   m_Structure.arscanner.errormessage.alignment, m_Structure.arscanner.errormessage.anchor, null, null); 	
						}
						else
						{
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_loadingErrorMessage, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.font, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.fontcolour, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.lineheight, m_Structure.arscanner.errormessage.maxwidth, m_Structure.arscanner.errormessage.x , m_Structure.arscanner.errormessage.y, m_Structure.arscanner.errormessage.rotation,  m_Structure.arscanner.errormessage.alignment, m_Structure.arscanner.errormessage.anchor, null, null); 	
						}
	
					}
				}
			}				
			break;
		case GameStateEnum.VR:
			// Render the scene.
			m_effect.render(m_scene, m_playerVRCharacter.getPlayerCamera());
			//ctx.drawImage(m_canvasVR, 0, 0 );
			break;
		case GameStateEnum.VRUNLOADING:
			if (m_arToolkitSource != null)
			{
				if( m_arToolkitSource.ready)
				{
					m_canvas2dContext.drawImage(m_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
					//m_canvas2dContext.drawImage(m_arToolkitSource.domElement, 0, 0 );
				}
			}
			drawRotatedRectangle(m_canvas2dContext, m_canvas2d.height, m_canvas2d.width, "#000000", (m_canvas2d.width / 2), (m_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
			break;
		
		}
	}
	
	if (m_stats != null)
	{
		m_stats.end();
	}
	
	m_RenderState = RenderStateEnum.NORENDER;
}

function setupARCamera()
{
	m_arToolkitSource = new ArToolkitSource({
		sourceType : 'webcam',
		sourceWidth: m_Structure.qrscanner.cameraresolution.width,
		sourceHeight: m_Structure.qrscanner.cameraresolution.height,
		// resolution displayed for the source 
		displayWidth: m_Structure.qrscanner.cameraresolution.width,
		displayHeight: m_Structure.qrscanner.cameraresolution.height
	});
	
	
	m_arToolkitSource.init(function onReady(){
		onResize();
	})	
		
	m_qrcodeCanvas = document.createElement('canvas');
		 
	m_qrcodeCanvas.width = m_Structure.qrscanner.cameraresolution.width;
	m_qrcodeCanvas.height = m_Structure.qrscanner.cameraresolution.height;
	m_qrcodeCanvas.style.position = 'absolute'
	m_qrcodeCanvas.style.top = '0px'
	m_qrcodeCanvas.style.left = '0px'
}

function unloadARCamera()
{
		//stop webcam 
	
	let stream = m_arToolkitSource.domElement.srcObject;
	let tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	
	
	if (m_arToolkitContext != null)
	{
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		console.log("remove m_arToolkitContext");
		m_arToolkitContext.removeAllMarkers();
		m_arToolkitContext = null;
	}
	
	m_arToolkitSource.domElement.srcObject = null;
	m_arToolkitSource.domElement = null;

	m_arToolkitSource = null;
}


function loadARContext(){
	// create atToolkitContext
	console.log("add m_arToolkitContext");
	
	// create an atToolkitContext
	ArToolkitContext.baseURL = '../';
	m_arToolkitContext = null;
	m_arToolkitContext = new ArToolkitContext({
		cameraParametersUrl: "data/data/camera_para.dat",
		detectionMode: 'mono',
		maxDetectionRate: m_Structure.qrscanner.cameraresolution.maxdetectionrate,
		// The two following settings adjusts the resolution. Higher is better (less flickering) but slower
		canvasWidth: m_Structure.qrscanner.cameraresolution.width,
		canvasHeight: m_Structure.qrscanner.cameraresolution.height
	});
	
	m_arToolkitContext.init(() => {
		m_camera.projectionMatrix.copy(m_arToolkitContext.getProjectionMatrix());
	});
			
	if( m_arToolkitSource.ready)
	{
		onResize();
		m_arToolkitContext.update( m_arToolkitSource.domElement );
	}
}

function unloadARContext()
{
	if (m_arToolkitContext != null)
	{
		console.log("remove m_arToolkitContext");
		m_arToolkitContext.removeAllMarkers();
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		m_arToolkitContext = null;
	}

}


function onResize(){

    m_arToolkitSource.onResize()	
	if (m_canvas3d != null)
	{
		m_arToolkitSource.copySizeTo(m_canvas3d)	
	}
	if ( m_arToolkitContext != null)
	{
		if( m_arToolkitContext.arController !== null )
		{
			m_arToolkitSource.copySizeTo(m_arToolkitContext.arController.canvas)	
		}    
	}	
} 

function renderCrossHair()
{
	
	var leftx = ((m_canvas2d.width - m_Structure.qrscanner.crosshair.width) / 2);
	var rightx = m_canvas2d.width - ((m_canvas2d.width - m_Structure.qrscanner.crosshair.width) / 2) - m_Structure.qrscanner.crosshair.linelength;
	var topy = ((m_canvas2d.height - m_Structure.qrscanner.crosshair.width) / 2);
	var bottomy = m_canvas2d.height - ((m_canvas2d.height - m_Structure.qrscanner.crosshair.width) / 2);
	//top left corner
	lineAtAngle(m_canvas2dContext, leftx, topy, m_Structure.qrscanner.crosshair.linelength, 0,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	lineAtAngle(m_canvas2dContext, leftx + (m_Structure.qrscanner.crosshair.weight / 2), topy, m_Structure.qrscanner.crosshair.linelength, 90,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	//top right corner
	lineAtAngle(m_canvas2dContext, rightx, topy, m_Structure.qrscanner.crosshair.linelength, 0,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	lineAtAngle(m_canvas2dContext, rightx + m_Structure.qrscanner.crosshair.linelength - (m_Structure.qrscanner.crosshair.weight / 2), topy, m_Structure.qrscanner.crosshair.linelength, 90,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	//bottom left corner
	lineAtAngle(m_canvas2dContext, leftx, bottomy, m_Structure.qrscanner.crosshair.linelength, 0,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	lineAtAngle(m_canvas2dContext, leftx + (m_Structure.qrscanner.crosshair.weight / 2), bottomy, m_Structure.qrscanner.crosshair.linelength, 270,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	//bottom right corner
	lineAtAngle(m_canvas2dContext, rightx, bottomy, m_Structure.qrscanner.crosshair.linelength, 0,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);
	lineAtAngle(m_canvas2dContext, rightx + m_Structure.qrscanner.crosshair.linelength - (m_Structure.qrscanner.crosshair.weight / 2), bottomy, m_Structure.qrscanner.crosshair.linelength, 270,  m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.colour, m_Structure.qrscanner.crosshair.weight);

}

function setupLights(item, manager)
{
	if (m_sceneLightsGroup == null)
	{
		m_sceneLightsGroup = new THREE.Group();
		m_scene.add(m_sceneLightsGroup);
	}
							
	switch (item.light.type.toLowerCase()) {
	case "hemisphere":
		var skycolour = 0xffffff;
		var groundcolour = 0xffffff;
		var intensity = 1;
		if (item.light.hasOwnProperty('skycolour'))
		{
			skycolour = item.light.skycolour
									
		}
		if (item.light.hasOwnProperty('groundcolour'))
		{
			groundcolour = item.light.groundcolour;
			console.log("hemisphere groundcolour " + groundcolour);
		}
		if (item.light.hasOwnProperty('intensity'))
		{
			intensity = item.light.intensity;
			console.log("hemisphere intensity " + intensity);
		}
		m_sceneLightsGroup.add( new THREE.HemisphereLight( skycolour, groundcolour, intensity) );
		storedHemisphereLightIntensities.push(intensity);

		break;
	case "ambient":
		m_sceneLightsGroup.add( new THREE.AmbientLight( item.light.colour ) );
		var intensity = 1;
		storedAmbientLightIntensities.push(intensity);
		break;
	case "directional":
		var colour = 0xffffff;
		var intensity = 1;
		if (item.light.hasOwnProperty('colour'))
		{
			colour = item.light.colour;
			console.log("directional colour " + colour);
		}
		if (item.light.hasOwnProperty('intensity'))
		{
			intensity = item.light.intensity;
			console.log("directional intensity " + intensity);
		}
		var light = new THREE.DirectionalLight( colour, intensity );
		light.position.set( item.light.x, item.light.y, item.light.z );
								
		if ((!m_renderer.shadowMap.enabled) && (item.light.castshadow))
		{
								
			m_renderer.shadowMap.enabled = true;
			if (item.light.hasOwnProperty('softshadow'))
			{
				if (item.light.SoftShadow)
					m_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			}
		}
								
		light.castShadow = item.light.castshadow;
		light.shadow.camera.zoom = item.light.shadowCamZoom;
		if (!item.light.hasOwnProperty('shadowmapsize'))
		{
			light.shadow.mapSize.width = 512;  // default
			light.shadow.mapSize.height = 512; // default
		}
		else
		{
			light.shadow.mapSize.width = item.light.shadowmapsize;  
			light.shadow.mapSize.height = item.light.shadowmapsize; 
		}
		m_sceneLightsGroup.add( light );
		light.target.position.set( item.light.targetx, item.light.targety, item.light.targetz );
		m_sceneLightsGroup.add( light.target );
		var helper = new THREE.CameraHelper( light.shadow.camera );
		break;
	case "lensflare":
		// lensflare
	
			var loader = new THREE.TextureLoader(manager);
			var texture0 = loader.load( "assets/textures/lensflare/lensflare0.png" );
			var texture3 = loader.load( "assets/textures/lensflare/lensflare3.png" );
			var lensflare = new THREE.Lensflare();
			lensflare.position.set( item.light.x, item.light.y, item.light.z );
			lensflare.addElement( new THREE.LensflareElement( texture0, 700, 0 ) );
			lensflare.addElement( new THREE.LensflareElement( texture3, 60, 0.6 ) );
			lensflare.addElement( new THREE.LensflareElement( texture3, 70, 0.7 ) );
			lensflare.addElement( new THREE.LensflareElement( texture3, 120, 0.9 ) );
			lensflare.addElement( new THREE.LensflareElement( texture3, 70, 1 ) );
			m_sceneLightsGroup.add( lensflare );

		break;
	}
}

function setupVideoPlayer()
{
	var videopresent = false;
	
	for(var i=0;i<m_Content.coursework.exercises[m_selectedExercise].exercise.content.length;i++)
	{
		//if (m_Content.topics[m_currentSelectedHeading].menuitems[m_CurrentSelectedMenu].submenuitems[m_CurrentSelectedSubMenu].pages[m_CurrentSelectedPage].page.hasOwnProperty('Video'))
		if (m_Content.coursework.exercises[m_selectedExercise].exercise.content[i].hasOwnProperty('video'))
		{
			var sourceMP4 = document.createElement("source"); 
			if (m_windowedVideoPlayer.canPlayType("video/mp4")) {
				
				var req = new XMLHttpRequest();
				req.open('GET', "assets/videos/" + m_Content.coursework.exercises[m_selectedExercise].exercise.content[i].video.filename, true);
				req.responseType = 'blob';

				req.onload = function() {
					// Onload is triggered even on 404
					// so we need to check the status code
					if (this.status === 200) {
						var videoBlob = this.response;
						var vid = URL.createObjectURL(videoBlob); // IE10+
						
						// Video is now downloaded
						// and we can set it as source on the video element
						m_windowedVideoPlayer.src = vid;
						m_loadingComplete = true;
					}
				}
				
				req.onprogress = function (event) {
					
					m_progressLoading = (Math.floor((event.loaded / event.total) * 100)) + "%";

				};
				
				req.onerror = function() {
				// Error
					console.log("error loading video");
				}

				req.send();
				
				//m_windowedVideoPlayer.src = "assets/videos/" + m_Content.coursework.exercises[m_selectedExercise].exercise.content[i].video.filename; 	
				//m_windowedVideoPlayer.load();
				if (m_isCurrentLandscape)
				{
					setupButton(null, (m_canvas2d.height / 2), (m_canvas2d.width / 2), m_canvas2d.height - 40, 1.0, 0, "videocontrol", 2, "centre");
				}
				else
				{
					setupButton(null, (m_canvas2d.width / 2), (m_canvas2d.height / 2), m_canvas2d.width - 40, 1.0, 0, "videocontrol", 2, "centre");
				}

				m_pausedByUser = false;
				videopresent = true;
			}
			break;
		}
	}
	
	return videopresent; 
}

function setupVRDisplay() {
	
  navigator.getVRDisplays().then(function(vrDisplays) {
	if (vrDisplays.length) {
		m_vrDisplay = vrDisplays[0];
		
		// Apply VR headset positional data to camera.
		m_controls = new THREE.VRControls(m_playerVRCharacter.getPlayerCamera());
		
		m_controls.standing = true;
		return true;

	}
	else {
		return false;

	}
  });
}

function applyMatrixOfMesh(mesh) { // Apply Matrix so that intersect of raycaster works properly
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();
}

function setupButton(buttonimage, portraitposx, portraitposy, radius, scale, rotation, typeofbutton, value, typeofanchor)
{
	var portraitCanvasWidth;
	var portraitCanvasHeight;
	var landscapeCanvasWidth;
	var landscapeCanvasHeight;
	var landscapex, landscapey;
	
	if (m_isCurrentLandscape)
	{
		portraitCanvasWidth = m_canvas2d.height;
		portraitCanvasHeight = m_canvas2d.width;
		landscapeCanvasHeight = m_canvas2d.height;
		landscapeCanvasWidth = m_canvas2d.width;
	}
	else
	{
		portraitCanvasWidth = m_canvas2d.width;
		portraitCanvasHeight = m_canvas2d.height;
		landscapeCanvasHeight = m_canvas2d.width;
		landscapeCanvasWidth = m_canvas2d.height;
	}
	if (screenfull.isFullscreen)
	{
		portraitx = portraitposx;
		portraity = portraitposy;
		switch (typeofanchor.toUpperCase()) {
			case "TOPLEFT":
				landscapex = portraitx;
				landscapey = portraity;
				break;
			case "TOPRIGHT":
				landscapex = portraitx + (landscapeCanvasWidth - portraitCanvasWidth);
				landscapey = portraity;
				break;
			case "TOPCENTRE":
				landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2)); 
				landscapey = portraity;
				break;
			case "BOTTOMLEFT":
				landscapex = portraitx;
				landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
				break;
			case "BOTTOMRIGHT":
				landscapex = portraitx + (landscapeCanvasWidth - portraitCanvasWidth);
				landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
				break;
			case "BOTTOMCENTRE":
				landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2));
				landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
				break;
			case "CENTRE":
				landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2));
				landscapey = (landscapeCanvasHeight / 2) + (portraity - (portraitCanvasHeight / 2));
				break;
			case "CENTRELEFT":
				landscapex = portraitx;
				landscapey = (landscapeCanvasHeight / 2) + (portraity - (portraitCanvasHeight / 2));
				break;
			case "CENTRERIGHT":
				landscapex = portraitx + (landscapeCanvasWidth - portraitCanvasWidth);
				landscapey = (landscapeCanvasHeight / 2) + (portraity - (portraitCanvasHeight / 2));
				break;
		}
	}
	else
	{
		switch (typeofanchor.toUpperCase()) {
			case "TOPLEFT":
				portraitx = portraitposx;
				portraity = portraitposy;
				landscapex = portraitx;
				landscapey = portraity;
				break;
			case "TOPRIGHT":
				portraitx = portraitCanvasWidth - portraitposx;
				portraity = portraitposy;
				landscapex = portraitposx + (landscapeCanvasWidth - portraitCanvasWidth);
				landscapey = portraitposy;
				break;
			case "TOPCENTRE":
				portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
				portraity = portraitposy;
				landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
				landscapey = portraitposy;
				break;
			case "BOTTOMLEFT":
				portraitx = portraitposx;
				portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
				landscapex = portraitposx;
				landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
				break;
			case "BOTTOMRIGHT":
				portraitx = portraitposx + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
				portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
				landscapex = portraitposx + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
				landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
				break;
			case "BOTTOMCENTRE":
				portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
				portraity = portraitCanvasHeight - ((portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - portraitposy));
				landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
				landscapey = landscapeCanvasHeight - ((landscapeCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - portraitposy));
				break;
			case "CENTRE":
				portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
				portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
				landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
				landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
				break;
			case "CENTRELEFT":
				portraitx = portraitposx;
				portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
				landscapex = portraitposx;
				landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
				break;
			case "CENTRERIGHT":
				portraitx = portraitposx + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
				portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
				landscapex = portraitposx + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
				landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));	
				break;
		}
	}
	var tapobject1 = new tapObject(portraitx, portraity, landscapex, landscapey, radius);
	var tapobjectdefault = new tapObjectDefault(portraitposx, portraitposy,  typeofanchor, radius)
	var tapPoint;
	if (buttonimage != null)
	{		
		var button1 = new buttonObject(buttonimage, portraitx, portraity, landscapex, landscapey, scale, rotation);
		tapPoint = new tapItem(tapobject1, button1, typeofbutton, value, false, tapobjectdefault);
	}
	else
	{
		tapPoint = new tapItem(tapobject1, null, typeofbutton, value, false, tapobjectdefault);
	}
	m_ActiveClickPoints.push(tapPoint);					
}


function resizeButtons()
{
	
	var portraitCanvasWidth;
	var portraitCanvasHeight;
	var landscapeCanvasWidth;
	var landscapeCanvasHeight;
	var portraitScaledWidth;
	var portraitScaledHeight;

	//Samsung S6 640 360  S8 740 360
	if (m_isCurrentLandscape)
	{
		portraitCanvasWidth = m_canvas2d.height;
		portraitScaledWidth = 360 / m_canvas2d.height 
		portraitCanvasHeight = m_canvas2d.width;
		portraitScaledHeight = 640 / m_canvas2d.width ;
		landscapeCanvasHeight = m_canvas2d.height;
		landscapeCanvasWidth = m_canvas2d.width;
	}
	else
	{
		portraitCanvasWidth = m_canvas2d.width;
		portraitScaledWidth = 360 / m_canvas2d.width;
		portraitCanvasHeight = m_canvas2d.height;
		portraitScaledHeight = 640 / m_canvas2d.height;
		landscapeCanvasHeight = m_canvas2d.width;
		landscapeCanvasWidth = m_canvas2d.height;
	}
	
	for(var i=0;i<m_ActiveClickPoints.length;i++)
	{
		var landscapex, landscapey, portraitx, portraity;
		
		//portraitx = portraitScaledWidth * m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
		//console.log("portraitx " + portraitx);
		//portraity = portraitScaledHeight * m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
		//console.log("portraity " + portraity);
		
		
		switch (m_ActiveClickPoints[i].tapObjectDefault.defaulttypeofanchor) {
		case AnchorPointEnum.TOPLEFT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			portraity = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			landscapex = portraitx;
			landscapey = portraity;
			break;
		case AnchorPointEnum.TOPRIGHT:
			portraitx = portraitCanvasWidth - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			portraity = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (landscapeCanvasWidth - portraitCanvasWidth);
			landscapey = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			break;
		case AnchorPointEnum.TOPCENTRE:
		
			portraitx = (portraitCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
			portraity = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			landscapex = (landscapeCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
			landscapey = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;

			break;
		case AnchorPointEnum.BOTTOMLEFT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y);
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y);
			break;
		case AnchorPointEnum.BOTTOMRIGHT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y);
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y);
			break;
		case AnchorPointEnum.BOTTOMCENTRE:
			portraitx = (portraitCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			portraity = portraitCanvasHeight - ((portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y));
			landscapex = (landscapeCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			landscapey = landscapeCanvasHeight - ((landscapeCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y));
			break;
		case AnchorPointEnum.CENTRE:
			portraitx = (portraitCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			portraity = (portraitCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = (landscapeCanvasWidth / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			landscapey = (landscapeCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			break;
		case AnchorPointEnum.CENTRELEFT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			portraity = (portraitCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			landscapey = (landscapeCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			break;
		case AnchorPointEnum.CENTRERIGHT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = (portraitCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			landscapey = (landscapeCanvasHeight / 2) + (m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			break;
		}
		
		if ((m_ActiveClickPoints[i].buttonObject != null))
		{
			m_ActiveClickPoints[i].buttonObject.portrait_posx = portraitx;
			m_ActiveClickPoints[i].buttonObject.portrait_posy = portraity;
			m_ActiveClickPoints[i].buttonObject.landscape_posx = landscapex;
			m_ActiveClickPoints[i].buttonObject.landscape_posy = landscapey;
		}
		if ((m_ActiveClickPoints[i].tapObject != null))
		{
			m_ActiveClickPoints[i].tapObject.portrait_x = portraitx;
			m_ActiveClickPoints[i].tapObject.portrait_y = portraity;
			m_ActiveClickPoints[i].tapObject.landscape_x = landscapex;
			m_ActiveClickPoints[i].tapObject.landscape_y = landscapey;
		}


											
	} 
}

//tap class object

function tapItem(tapObject, buttonObject, type, value, selected, tapObjectDefault) {
    this.tapObject = tapObject;
    this.buttonObject = buttonObject;
    this.itemtype = type;
	this.itemvalue = value;
	this.selected = selected;
	this.tapObjectDefault = tapObjectDefault;
}


function tapObject(portrait_posx, portrait_posy, landscape_posx, landscape_posy, radius)
{
	
	this.portrait_x = portrait_posx;
	this.portrait_y = portrait_posy;
	this.landscape_x = landscape_posx;
	this.landscape_y = landscape_posy;
	this.radius = radius;
}

function tapObjectDefault(portrait_posx, portrait_posy,typeofanchor, radius)
{
	this.defaultportrait_x = portrait_posx;
	this.defaultportrait_y = portrait_posy;
	this.defaultradius = radius;
		switch (typeofanchor.toUpperCase()) {
		case "TOPLEFT":
			this.defaulttypeofanchor = AnchorPointEnum.TOPLEFT;
			break;
		case "TOPRIGHT":
			this.defaulttypeofanchor = AnchorPointEnum.TOPRIGHT;
			break;
		case "TOPCENTRE":
			this.defaulttypeofanchor = AnchorPointEnum.TOPCENTRE;
			break;
		case "BOTTOMLEFT":
			this.defaulttypeofanchor = AnchorPointEnum.BOTTOMLEFT;
			break;
		case "BOTTOMRIGHT":
			this.defaulttypeofanchor = AnchorPointEnum.BOTTOMRIGHT;
			break;
		case "BOTTOMCENTRE":
			this.defaulttypeofanchor = AnchorPointEnum.BOTTOMCENTRE;
			break;
		case "CENTRE":
			this.defaulttypeofanchor = AnchorPointEnum.CENTRE;
			break;
		case "CENTRELEFT":
			this.defaulttypeofanchor = AnchorPointEnum.CENTRELEFT;
			break;
		case "CENTRERIGHT":
			this.defaulttypeofanchor = AnchorPointEnum.CENTRERIGHT;
			break;
	}
	

}

function buttonObject(image, portrait_posx, portrait_posy, landscape_posx, landscape_posy, scale, rotation)
{
	this.Image = image;
	this.portrait_posx = portrait_posx;
	this.portrait_posy = portrait_posy;
	this.landscape_posx = landscape_posx;
	this.landscape_posy = landscape_posy;
	this.scale = scale;
	this.rotation = rotation;
}

//render helper functions

function resizeARCanvas(sourcewidth, sourceheight)
{
	
	var sourceAspect = sourcewidth / sourceheight;
	// compute screenAspect
	var screenAspect = m_canvas2d.width / m_canvas2d.height;
	
	if( screenAspect == sourceAspect )
	{
		m_resizeARCanvasX = 0;
		m_resizedARCanvasY = 0;
		m_resizedARCanvasWidth = sourcewidth;
		m_resizeARCanvasHeight = sourceheight;
	}
	else
	{
		//	source width 640 height 480
		// Samsung S6 640 360  S8 740 360
		// compute sourceAspect
		if( screenAspect < sourceAspect )
		{
		// compute m_resizedARCanvasWidth and sx
			
			m_resizedARCanvasWidth = screenAspect * sourceheight; 
			
			m_resizeARCanvasX = Math.floor((sourcewidth - m_resizedARCanvasWidth) / 2);
			m_resizeARCanvasHeight = sourceheight;
			m_resizedARCanvasY = 0;

		}
		else
		{
			// compute sHeight and m_resizedARCanvasY
			m_resizedARCanvasWidth = sourcewidth; 
			m_resizeARCanvasX = 0;
			//check if screenheight is smaller than sourceheight, else don't need to scale

			if (m_canvas2d.height > sourceheight)
			{
			
				m_resizeARCanvasHeight = screenAspect * sourcewidth;
				m_resizedARCanvasY = Math.floor((sourceheight - m_resizeARCanvasHeight) / 2);
			}
			else
			{
			
				m_resizeARCanvasHeight = m_canvas2d.height;
				m_resizedARCanvasY = Math.floor((sourceheight - m_resizeARCanvasHeight) / 2);
						
			}	
		
	
		}
	
	}
	
}


function calculateLandscapePts(portraitx, portraity, typeofanchor)
{
	var portraitCanvasWidth;
	var portraitCanvasHeight;
	var landscapeCanvasWidth;
	var landscapeCanvasHeight;
	var landscapex, landscapey;
	
	if (m_isCurrentLandscape)
	{
		portraitCanvasWidth = m_canvas2d.height;
		portraitCanvasHeight = m_canvas2d.width;
		landscapeCanvasHeight = m_canvas2d.height;
		landscapeCanvasWidth = m_canvas2d.width;
	}
	else
	{
		portraitCanvasWidth = m_canvas2d.width;
		portraitCanvasHeight = m_canvas2d.height;
		landscapeCanvasHeight = m_canvas2d.width;
		landscapeCanvasWidth = m_canvas2d.height;
	}
	switch (typeofanchor.toUpperCase()) {
		case "TOPLEFT":
			landscapex = portraitx;
			landscapey = portraity;
			break;
		case "TOPRIGHT":
			landscapex = portraitx + (landscapeCanvasWidth - portraitCanvasWidth);
			landscapey = portraity;
			break;
		case "TOPCENTRE":
			landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2)); 
			landscapey = portraity;
			break;
		case "BOTTOMLEFT":
			landscapex = portraitx;
			landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
			break;
		case "BOTTOMRIGHT":
			landscapex = portraitx + (landscapeCanvasWidth - portraitCanvasWidth);
			landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
			break;
		case "BOTTOMCENTRE":
			landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2));
			landscapey = landscapeCanvasHeight - (portraitCanvasHeight - portraity);
			break;
		case "CENTRE":
			landscapex = (landscapeCanvasWidth / 2) + (portraitx - (portraitCanvasWidth / 2));
			landscapey = (landscapeCanvasHeight / 2) + (portraity - (portraitCanvasHeight / 2));
			break;
	}
	return [landscapex, landscapey];
}

function drawRotatedRectangle(context, rectheight, rectwidth, colour, posx, posy, angle, alpha) { 


    context.save();
    // translate context to center of canvas
    context.translate(posx, posy);
	context.globalAlpha = alpha;
	// rotate 45 degrees clockwise
    context.rotate(angle * TO_RADIANS);

    context.fillStyle = colour;
    context.fillRect(rectwidth / -2, rectheight / -2, rectwidth, rectheight);
    context.restore();
 
}

function drawRotatedImage(ctx, image, x, y, angle, scale, alpha) { 
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.beginPath();
	
	ctx.save(); 
	
	ctx.globalAlpha = alpha;
	// move to the middle of where we want to draw our image
	ctx.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -((image.width * scale)/2), -((image.height * scale)/2),  image.width * scale, image.height * scale);
 
	// and restore the co-ords to how they were when we began
	ctx.restore();
	
	ctx.closePath();

	
}

 function lineAtAngle(ctx, x1, y1, length, angle, colorstop1, colorstop2, lineweight) {
	ctx.beginPath()
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + length * Math.cos(angle * TO_RADIANS), y1 + length * Math.sin(angle * TO_RADIANS));
    ctx.lineWidth=lineweight;
    var grd=ctx.createLinearGradient(0,x1,1080,0);
    grd.addColorStop(0,colorstop1);
    grd.addColorStop(1,colorstop2);
    //ctx.fillStyle=grd;
    ctx.strokeStyle=grd;
    ctx.stroke();
	ctx.closePath();
}

function drawPagewithTwoFontsTwoColours(ctx, text, font1, font2, colour1, colour2, lineHeight, lineHeight2, maxWidth, posx , posy, rotation,  textalign, textanchor, bckcolour, bckframe)
{
	m_contextDisclaimerCanvas.height = 1000;
	m_contextDisclaimerCanvas.width = 2400;
    //var x = m_contextDisclaimerCanvas.width / 2;
    //var y = m_contextDisclaimerCanvas.height / 2;
	var x, y;
	if ((textalign == "left") || (textalign == "right"))
	{
		//x = 0;
		x = m_contextDisclaimerCanvas.width / 2;
		y = 0;
	}
	if (textalign == "center")
	{
		x = m_contextDisclaimerCanvas.width / 2;
		y = 0;
	}		
	if (bckcolour != null)
	{	
		var n = text.search('\b');
		if (n != -1)
		{
			var convtext = text.replace('\b', '');
			var [xoffset, yoffset] = wrapTextAlignwithBackgroundColours(m_contextDisclaimerCanvas, convtext, colour1, colour2, x, y, maxWidth, lineHeight, lineHeight2, font1, font2, textalign, textanchor, bckcolour, bckframe);
		}
		else
		{
			var [xoffset, yoffset] = wrapTextAlignwithFontsColours(m_contextDisclaimerCanvas, text, colour1, colour2, x, y, maxWidth, lineHeight, lineHeight2, font1, font2, textalign, textanchor);
		}
	}
	else
	{
		var [xoffset, yoffset] = wrapTextAlignwithFontsColours(m_contextDisclaimerCanvas, text, colour1, colour2, x, y, maxWidth, lineHeight, lineHeight2, font1, font2, textalign, textanchor);
	}	
    drawRotatedImage(ctx, m_disclaimerCanvas, posx, posy, rotation, 1, 1.0);
	m_contextDisclaimerCanvas.clearRect(0, 0, m_disclaimerCanvas.width, m_disclaimerCanvas.height);
 }
 
 



function wrapTextAlignwithFontsColours(context, text, colour1, colour2, x, y, maxWidth, lineSpacing, lineSpacing2, font1, font2, alignment, textanchor) 
{
		context.beginPath();
		context.font = font1;
		context.textAlign = alignment;
		var maxTestWidth = 0;
		var totalHeight = y;
		
		var lineFont1Array = new Array;
		var lineFont2Array = new Array;
		var pointer = lineFont1Array;
		var changefont = false;
		
		var res = font1.split(" ");
		var lineHeight = (calculateFontHeight(res[res.length - 1], res[res.length - 2], "w")) * 0.5;
		var linespacing = lineHeight * (lineSpacing / 100);
		var fontlineheight = linespacing + lineHeight;	
		var totalHeight = y - linespacing ;	
		if (font2 != null)
		{			
			var res2 = font2.split(" ");
			var lineHeight2 = calculateFontHeight(res2[res2.length - 1], res2[res2.length - 2], "w")* 0.5;
			var linespacing2 = lineHeight2 * (lineSpacing2 / 100);
		}
		
		
          var convtext = text.replace(/\n/g, ' |br| ');
		  var convtext2 = convtext.replace(/\f/g, ' |ft| ');
		   
          var words = convtext2.split(' ');
          var line = '';

          for (var n = 0; n < words.length; n++) {
              var newline = false;
			  if (changefont)
			  {
				  if (font2 != null)
				  {
					context.font = font2;
					changefont = false;
					pointer = lineFont2Array;
					//fontlineheight = lineHeight2;
					fontlineheight = linespacing2 + lineHeight2;
				  }
			  }
			  
			  
				if (words[n].indexOf("|br|") > -1)
				{	

					newline = true;
				}			  
			if (words[n].indexOf("|ft|") > -1){
				changefont = true;
			} 
              var testLine = line + words[n] + ' ';
              var metrics = maxWidth;
              var testWidth = maxWidth;

              if (context.measureText) {
                  metrics = context.measureText(testLine);
                  testWidth = metrics.width;
				  if (testWidth > maxTestWidth)
				  {
					  maxTestWidth = testWidth;
				  }
              }
              if ((testWidth > maxWidth && n > 0) || (newline) || (changefont) ) {
					  
					pointer.push(line);
				  
				  
                  if (newline || changefont) n++;
                  line = words[n] + ' ';
                  //totalHeight += lineHeight;
					totalHeight += fontlineheight;
				  }
              else {
                  line = testLine;
              }

  
        }
		
		pointer.push(line);
		
		var offset = 0;
		if (alignment == "left")
		{
			offset = 0;
		}
		if (alignment == "right")
		{
			offset = 0;
		}
		if (alignment == "center")
		{
			offset = 0;
		}
		
		var y2;
		if (textanchor == "center")
		{
			y2 = (context.height / 2) - (totalHeight  / 2) - ((linespacing + lineHeight) / 2);
		}
		if (textanchor == "top")
		{
			y2 = ((context.height) / 2) ;	
		}
		
		if (textanchor == "bottom")
		{
	
			
			y2 = (context.height / 2) - totalHeight  - (linespacing + lineHeight);			
		}
		
		
		context.font = font1;
		context.fillStyle = colour1;
		context.textAlign = alignment;
		
		for (var n = 0; n < lineFont1Array.length; n++) {
			y2 += lineHeight;
			if (n != 0)
			{
				y2 += linespacing;
			}
			context.fillText(lineFont1Array[n], x + offset, y2);
			
		}
		if ((lineFont2Array.length > 0) && (font2 != null))
		{
			
			context.font = font2;
			context.fillStyle = colour2;
			for (var n = 0; n < lineFont2Array.length; n++) {
				y2 += lineHeight2 + linespacing2;
				
				context.fillText(lineFont2Array[n], x + offset, y2);
			
			}
		}
		context.closePath();
		return [maxTestWidth, y2];
}

function wrapTextAlignwithBackgroundColours(context, text, colour1, colour2, x, y, maxWidth, lineSpacing, lineSpacing2, font1, font2, alignment, textanchor, bckcolour, bckframe) 
{
		context.beginPath();
		context.font = font1;
		context.textAlign = alignment;
		var maxTestWidth = 0;
		var totalHeight = y;
		
		
		var lineFont1Array = new Array;
		var lineFont2Array = new Array;
		var pointer = lineFont1Array;
		var changefont = false;
		
		var res = font1.split(" ");
		var lineHeight = (calculateFontHeight(res[res.length - 1], res[res.length - 2], "w")) * 0.5;
		var border1 = parseInt(lineHeight * (bckframe / 100));
		var linespacing = lineHeight * (lineSpacing / 100);
		var fontlineheight = linespacing + lineHeight + border1;	
		
		var res2 = font2.split(" ");
		var lineHeight2 = (calculateFontHeight(res2[res2.length - 1], res2[res2.length - 2], "w"))* 0.5;
		var border2 = parseInt(lineHeight2 * (bckframe / 100));
		var linespacing2 = lineHeight2 * (lineSpacing2 / 100);
		var fontlineheight2 = linespacing2 + lineHeight2 + border2;
	
		
		var totalHeight = y - linespacing ;	
		
		
		
        var convtext = text.replace(/\n/g, ' |br| ');
		var convtext2 = convtext.replace(/\f/g, ' |ft| ');
		  
		  
		   
          var words = convtext2.split(' ');
          var line = '';

          for (var n = 0; n < words.length; n++) {
              var newline = false;
			  if (changefont)
			  {
				  
				  if (font2 != null)
				  {
					context.font = font2;
					changefont = false;
					pointer = lineFont2Array;
					fontlineheight = fontlineheight2;
				  }
			  }
			  
			  
				if (words[n].indexOf("|br|") > -1)
				{	

					newline = true;
				}			  
			if (words[n].indexOf("|ft|") > -1){
				changefont = true;
			} 
              var testLine = line + words[n] + ' ';
              var metrics = maxWidth;
              var testWidth = maxWidth;

              if (context.measureText) {
                  metrics = context.measureText(testLine);
                  testWidth = metrics.width;
				  if (testWidth > maxTestWidth)
				  {
					  maxTestWidth = testWidth;
				  }
              }
              if ((testWidth > maxWidth && n > 0) || (newline) || (changefont) ) {
					  
					pointer.push(line);
				  
				  
                  if (newline || changefont) n++;
                  line = words[n] + ' ';
				  
                  //totalHeight += lineHeight;
					totalHeight += fontlineheight;
				  }
              else {
                  line = testLine;
              }

  
        }
		//if last single word has new font
		if (changefont)
		{
			if (font2 != null)
			{
				context.font = font2;
				changefont = false;
				pointer = lineFont2Array;
				fontlineheight = fontlineheight2;
			}
			totalHeight += fontlineheight;
		}

		pointer.push(line);
		
		var offset = 0;
		if (alignment == "left")
		{
			offset = 0;
		}
		if (alignment == "right")
		{
			offset = 0;
		}
		if (alignment == "center")
		{
			offset = 0;
		}
		
		var y2;
		if (textanchor == "center")
		{
			y2 = (context.height / 2) - (totalHeight  / 2) - ((linespacing + lineHeight +  (border1 * 0.5)) / 2);
		}
		if (textanchor == "top")
		{
			y2 = (context.height) / 2 + border1;	
		}
		
		if (textanchor == "bottom")
		{
			y2 = (context.height / 2) - totalHeight  - (linespacing + lineHeight + border1);			
		}
		
		for (var n = 0; n < lineFont1Array.length; n++) {
			
			context.font = font1;
			context.textAlign = alignment;
			y2 += lineHeight;
			var metrics = context.measureText(lineFont1Array[n]);

			context.fillStyle= bckcolour;
			if (n != 0)
			{
				y2 += linespacing + border1;
			}
			if (lineFont1Array[n] != " ")
			{
				switch (alignment) {
					case "left":
						context.fillRect(x + offset, y2 - lineHeight - border1 ,metrics.width + (border1 * 2),lineHeight + (border1 * 2));
						context.fillStyle = colour1;
						context.fillText(lineFont1Array[n], x + offset + border1, y2);
						break;
					case "right":
						context.fillRect(x + offset - (metrics.width + (border1 * 2)), y2 - lineHeight - border1 ,metrics.width + (border1 * 2),lineHeight + (border1 * 2));
						context.fillStyle = colour1;
						context.fillText(lineFont1Array[n], x + offset - border1, y2);
						break;
					case "center":
						context.fillRect(x + offset - ((metrics.width + (border1 * 2)) / 2), y2 - lineHeight - border1 ,metrics.width + (border1 * 2),lineHeight + (border1 * 2));
						context.fillStyle = colour1;
						context.fillText(lineFont1Array[n], x + offset + (border1 / 2), y2);
						break;
				}
			}
			
		}

		if ((lineFont2Array.length > 0) && (font2 != null))
		{
			context.font = font2;
			
			for (var n = 0; n < lineFont2Array.length; n++) {
				y2 += lineHeight2;
				var metrics = context.measureText(lineFont2Array[n]);
				context.fillStyle= bckcolour;
				//if (n != 0)
				//{
					y2 += linespacing2 + border2;
				//}
				
				if (lineFont2Array[n] != " ")
				{
					switch (alignment) {
					case "left":
						context.fillRect(x + offset, y2 - lineHeight2 - border2 ,metrics.width + (border2 * 2),lineHeight2 + (border2 * 2));
						context.fillStyle = colour2;
						context.fillText(lineFont2Array[n], x + offset + border2, y2);
						break;
					case "right":
						context.fillRect(x + offset - (metrics.width + (border2 * 2)), y2 - lineHeight2 - border2 ,metrics.width + (border2 * 2),lineHeight2 + (border2 * 2));
						context.fillStyle = colour2;
						context.fillText(lineFont2Array[n], x + offset - border2, y2);
						break;
					case "center":
						context.fillRect(x + offset - ((metrics.width + (border2 * 2)) / 2), y2 - lineHeight2 - border2 ,metrics.width + (border2 * 2),lineHeight2 + (border2 * 2));
						context.fillStyle = colour2;
						context.fillText(lineFont2Array[n], x + offset + (border2 / 2), y2);
						break;
					}
				}
			}
		}
		context.closePath();
		return [maxTestWidth, y2];
}

function calculateFontHeight(fName, fSize, text)
{
		// calculate height of the font. 
		var div = document.createElement("div");
		div.innerHTML = text;
		div.style.position = 'absolute';
		div.style.top = '-10000px';
		div.style.left = '-10000px';
		div.style.fontFamily = fName;
		div.style.fontSize = fSize;
		document.body.appendChild(div);
		var textHeight = div.offsetHeight;
		document.body.removeChild(div);
		return textHeight;
}

//helper functions

function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
	document.body.appendChild(link)
    link.click();
	document.body.removeChild(link)
}


// Get config from URL
function config() {
  var config = {};
  var q = window.location.search.substring(1);
  if (q === '') {
    return config;
  }
  var params = q.split('&');
  var param, name, value;
  for (var i = 0; i < params.length; i++) {
    param = params[i].split('=');
    name = param[0];
    value = param[1];

    // All config values are either boolean or float
    config[name] = value === 'true' ? true :
                   value === 'false' ? false :
                   parseFloat(value);
  }
  return config;
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function round(number, precision) {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }  
    numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}

function lerp(a, b, t) {
    var len = a.length;
    if(b.length != len) return;

    var x = [];
    for(var i = 0; i < len; i++)
        x.push(a[i] + t * (b[i] - a[i]));
    return x;
}


function disposeSceneMesh (obj)
{
	if (obj !== null)
	{
		//console.log("dispose " + obj.name);
		if (obj.children != null)
		{
			for (var i = 0; i < obj.children.length; i++)
			{
				disposeSceneMesh(obj.children[i]);
			}
		}
		if (obj.geometry)
		{
			obj.geometry.dispose();
			obj.geometry = undefined;
		}
		if (obj.material)
		{
			if ( Array.isArray( obj.material ) ) {
				for ( var m = 0; m < obj.material.length; m ++ ) {
					if ((obj.material[m]).map)
					{
						(obj.material[m]).map.dispose();
						(obj.material[m]).map = undefined;
					}
					(obj.material[m]).dispose();
					(obj.material[m]) = undefined;
				}
			} else {
				if (obj.material.map)
				{
					obj.material.map.dispose();
					obj.material.map = undefined;
				}
				obj.material.dispose();
				obj.material = undefined;
			}
			
		}
	}
	obj = undefined;
};


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a)
{
    for(var i=0;i<m_Content.coursework.exercises.length;i++){
		if (m_Content.coursework.exercises[i].exercise.id == a)
		{
			m_selectedExercise = i;
			m_ActiveClickPoints.length = 0;
			setupButton(m_backButtonImage, m_Structure.qrscanner.backbutton.x, m_Structure.qrscanner.backbutton.y, m_Structure.qrscanner.backbutton.radius, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.rotation, m_Structure.qrscanner.backbutton.type, m_Structure.qrscanner.backbutton.scale, m_Structure.qrscanner.backbutton.anchorpoint);		
			setupButton(m_tickButtonImage, m_Structure.qrscanner.tickbutton.x, m_Structure.qrscanner.tickbutton.y, m_Structure.qrscanner.tickbutton.radius, m_Structure.qrscanner.tickbutton.scale, m_Structure.qrscanner.tickbutton.rotation, m_Structure.qrscanner.tickbutton.type, m_Structure.qrscanner.tickbutton.scale, m_Structure.qrscanner.tickbutton.anchorpoint);
			setupButton(m_crossButtonImage, m_Structure.qrscanner.crossbutton.x, m_Structure.qrscanner.crossbutton.y, m_Structure.qrscanner.crossbutton.radius, m_Structure.qrscanner.crossbutton.scale, m_Structure.qrscanner.crossbutton.rotation, m_Structure.qrscanner.crossbutton.type, m_Structure.qrscanner.crossbutton.scale, m_Structure.qrscanner.crossbutton.anchorpoint);
			m_GameState = GameStateEnum.QRCODEFOUND;
			break;
		}

	}
/* 	if (m_GameState == GameStateEnum.SCANQRCODE)
	{
		m_GameState = GameStateEnum.QRCODENOTFOUND;
	} */
}	

function isChrome() {
  
  
  var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS"),
	isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
	
	console.log("isSamsungBrowser " + isSamsungBrowser);
  if(isIOSChrome){
    return true;
  } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false && isSamsungBrowser == null) {

	return true;
  } else {
    return false;
  }
}


function collisionDetection(touchx, touchy)
{

	for (var i = 0; i < m_ActiveClickPoints.length; i++) {
		var dx, dy;
		if (m_isCurrentLandscape)
		{			
			dx = m_ActiveClickPoints[i].tapObject.landscape_x - touchx;
			dy = (m_ActiveClickPoints[i].tapObject.landscape_y) - touchy;
		}
		else
		{
			dx = m_ActiveClickPoints[i].tapObject.portrait_x - touchx;
			dy = (m_ActiveClickPoints[i].tapObject.portrait_y) - touchy;
		}
		var distance = Math.sqrt(dx * dx + dy * dy);
				
		if (distance < (m_ActiveClickPoints[i].tapObject.radius / 2) + 5) {
			// collision detected!
			console.log("collision value " + m_clickCollisonValue);
			m_clickCollisonValue = i;
			break;
		}
		//else
		//{
			//m_collisonDetected = false;
		//}
	}
					
}


function outerCollisionDetection(touchx, touchy, objectx, objecty, innerradius, outerradius)
{

	var dx = objectx - touchx;
	var dy = objecty - touchy;
	var distance = Math.sqrt(dx * dx + dy * dy);

	if ((!(distance < innerradius + 5)) && (distance < outerradius + 5)) {
		//inner collision detected!
		//m_collisonDetected = true;
		return true;
	}
	else
	{
						
		//m_collisonDetected = false;
		return false;
	}

}

// Events


function onVRDisplayPresentChange() {
  console.log('onVRDisplayPresentChange');
  
	if (!m_vrDisplay.isPresenting)
	{
		m_transition = 0;
		m_lerpValue = 0;
		m_LerpedAlpha.length = 0;
		m_LerpedAlpha[0] = 1;
		if (m_video360Element != null)
		{
			m_video360Element.loop = false;
			m_video360Element.pause();
		}
		m_GameState = GameStateEnum.VRUNLOADING;

	}
	else
	{
		resizeCanvas();
	}
  //onResize();
  //buttons.hidden = vrDisplay.isPresenting;
}

function onVRDisplayConnect(e) {
  console.log('onVRDisplayConnect', (e.display || (e.detail && e.detail.display)));
}

function resizeCanvas() {
 
	
	if (m_canvas2d != null)
	{
		m_canvas2d.width = window.innerWidth;
		m_canvas2d.height = window.innerHeight;
		m_canvasWidth = m_canvas2d.width;
		m_canvasHeight = m_canvas2d.height;
	
		document.getElementById("loader").style.left = window.innerWidth / 2;
		document.getElementById("loader").style.top = window.innerHeight / 2;
	
		console.log("resize event width " + m_canvas2d.width + " height " + m_canvas2d.height);
	
	
		
		if (m_canvas2d.width > m_canvas2d.height)
		{
			m_isCurrentLandscape = true;
			if (m_qrcodeCanvas != null)
			{
				m_qrcodeCanvas.width = m_Structure.qrscanner.cameraresolution.width;
				m_qrcodeCanvas.height = m_Structure.qrscanner.cameraresolution.height;
				resizeARCanvas(m_Structure.qrscanner.cameraresolution.width, m_Structure.qrscanner.cameraresolution.height)
				console.log("m_arToolkitSource.domElement.videoWidth " + m_arToolkitSource.domElement.videoWidth);
				console.log("m_arToolkitSource.domElement.videoHeight " + m_arToolkitSource.domElement.videoHeight);
				console.log("m_qrcodeCanvas.height " + m_qrcodeCanvas.height);
				console.log("m_qrcodeCanvas.width " + m_qrcodeCanvas.width);
			}
			if ((m_canvas3d != null) && (m_renderer != null))
			{
				console.log("m_arToolkitSource.domElement.videoWidth " + m_arToolkitSource.domElement.videoWidth);
				console.log("m_arToolkitSource.domElement.videoHeight " + m_arToolkitSource.domElement.videoHeight);
				m_canvas3d.width = m_Structure.qrscanner.cameraresolution.width;
				m_canvas3d.height = m_Structure.qrscanner.cameraresolution.height;
				m_camera.aspect = m_canvas3d.width / m_canvas3d.height;
				m_camera.updateProjectionMatrix();
				m_renderer.setSize( m_Structure.qrscanner.cameraresolution.width, m_Structure.qrscanner.cameraresolution.height );

			}
		}
		else
		{
				m_isCurrentLandscape = false;
				if (m_qrcodeCanvas != null)
				{
					m_qrcodeCanvas.width = m_Structure.qrscanner.cameraresolution.height;
					m_qrcodeCanvas.height = m_Structure.qrscanner.cameraresolution.width;
					resizeARCanvas(m_Structure.qrscanner.cameraresolution.height, m_Structure.qrscanner.cameraresolution.width)
					console.log("m_arToolkitSource.domElement.videoWidth " + m_arToolkitSource.domElement.videoWidth);
					console.log("m_arToolkitSource.domElement.videoHeight " + m_arToolkitSource.domElement.videoHeight);	
					console.log("m_qrcodeCanvas.height " + m_qrcodeCanvas.height);
					console.log("m_qrcodeCanvas.width " + m_qrcodeCanvas.width);					
				}
				if ((m_canvas3d != null) && (m_renderer != null))
				{

					if (m_arToolkitSource != null)
					{
						m_arToolkitSource.onResize()	
						m_arToolkitSource.copySizeTo(m_renderer.domElement)	
						if( m_arToolkitContext.arController !== null ){
							m_arToolkitSource.copySizeTo(m_arToolkitContext.arController.canvas)	
						}
					}
					
					console.log("m_arToolkitSource.domElement.videoWidth " + m_arToolkitSource.domElement.videoWidth);
					console.log("m_arToolkitSource.domElement.videoHeight " + m_arToolkitSource.domElement.videoHeight);
					m_canvas3d.width = m_Structure.qrscanner.cameraresolution.height;
					m_canvas3d.height = m_Structure.qrscanner.cameraresolution.width;
					m_camera.aspect = m_canvas3d.width / m_canvas3d.height;
					m_camera.updateProjectionMatrix();
					m_renderer.setSize( m_Structure.qrscanner.cameraresolution.height, m_Structure.qrscanner.cameraresolution.width );
				}

		}
		if (!screenfull.isFullscreen)
		{
			resizeButtons();
		}
	}
	if ((m_canvasVR != null) && (m_effect != null))
	{
		 if ((!resizeCanvas.resizeDelay) && (m_GameState != GameStateEnum.VRUNLOADING)) {
			resizeCanvas.resizeDelay = setTimeout(function () {
				resizeCanvas.resizeDelay = null;
				if ((m_canvasVR != null) && (m_effect != null))
				{
					console.log('Resizing to %s x %s.', m_canvasVR.clientWidth, m_canvasVR.clientHeight);
					//m_effect.setSize(m_canvasVR.clientWidth, m_canvasVR.clientHeight, false);
					m_effect.setSize(window.innerWidth, window.innerHeight);
					if (m_playerVRCharacter != null)
					{
						m_playerVRCharacter.getPlayerCamera().aspect = m_canvasVR.clientWidth / m_canvasVR.clientHeight;
						m_playerVRCharacter.getPlayerCamera().updateProjectionMatrix();
					}
				}
			}, 250);
		} 
	
 
	}
	m_RenderState = RenderStateEnum.RENDERALL
   
}


// video events

function videoPlay()
{
	m_VideoCurrentStatus = VideoPlayStateEnum.PLAYING;
	
	
}

function videoPause()
{
	m_VideoCurrentStatus = VideoPlayStateEnum.PAUSED;
	
}

function videoEnded()
{
	m_VideoCurrentStatus = VideoPlayStateEnum.NOTPLAYING;
	
	
}


function addError(text) {
	console.log("addError.text = " + text);

}


//touch events

        function handleStart(evt) {



            var touches = evt.changedTouches;
            var offset = findPos(m_canvas2d);
			//m_PreviousInteractionTime = Date.now();
			//m_previousDeltaRotation = 0;
			if (touches === undefined)
			{
				console.log("evt.x " + evt.x + " evt.y " + evt.y);
				if (evt.x - offset.x > 0 && evt.x - offset.x < parseFloat(m_canvas2d.width) && evt.y - offset.y > 0 && evt.y - offset.y < parseFloat(m_canvas2d.height)) {
					evt.preventDefault();
					if (m_enableTouchClick)
					{
						console.log("handleStart");
						collisionDetection(evt.x - offset.x,evt.y - offset.y);

					}
				}
			}
			else
			{
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(m_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(m_canvas2d.height)) {
						evt.preventDefault();
						ongoingTouches.push(copyTouch(touches[i]));
						if (m_enableTouchClick)
						{
							console.log("handleStart");
							collisionDetection(touches[i].clientX - offset.x,touches[i].clientY - offset.y);

						}

					}
				}
			}
        }


        function handleMove(evt) {

            var touches = evt.changedTouches;
            var offset = findPos(m_canvas2d);
			/* m_PreviousInteractionTime = Date.now(); */
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(m_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(m_canvas2d.height)) {
                    evt.preventDefault();
                    var idx = ongoingTouchIndexById(touches[i].identifier);

                    if (idx >= 0) {

						ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
                        
                    }
                }
            }
        }


        function handleEnd(evt) {

			
			//need to put fullscreen toggle here to work
			//if ((m_enableFullScreenToggle) && (m_screenTogglePending))
			for (var i = 0; i < m_toggleStatePending.length; i++) {
				switch (m_toggleStatePending[i]) {
				case ToggleStateEnum.FULLSCREENSTATE:
					if (!screenfull.isFullscreen)
						//screenfull.toggle(document.getElementById('container'));
						//screenfull.request(document.getElementById('container'));
						var con = document.getElementById('container');
						console.log("container " + con);
						screenfull.request(document.getElementById(con));
					break;	
				case ToggleStateEnum.WINDOWEDSCREENSTATE:
					if (screenfull.isFullscreen)
					{
						console.log("windowed");
						screenfull.exit();
					}
					break;								
				case ToggleStateEnum.VIDEOPLAYERSTATE:	
					if (m_VideoIsPresent)
					{
						m_windowedVideoPlayer.pause();
						switch (m_VideoCurrentStatus) {
						
						case VideoPlayStateEnum.PLAYING:
							m_pausedByUser = true;
							m_windowedVideoPlayer.pause();
							break;
						case VideoPlayStateEnum.PAUSED:
							m_windowedVideoPlayer.play();
							break;
						case VideoPlayStateEnum.NOTPLAYING:
							m_windowedVideoPlayer.currentTime = 0;
							m_windowedVideoPlayer.play();
							break;
						}
					}
					
					break;
				case ToggleStateEnum.VRSTATE:
					console.log("ToggleStateEnum.VRSTATE ");
					if (m_vrDisplay != null)
					{
						if ((m_video360Element != null) && (m_playerVRCharacter.getPlayerVRType() == VRTypeEnum.VIDEO360))
						{
							
							m_video360Element.play();
						}	
						console.log("touch " + m_renderer.domElement);
						m_controls.update();
						var container = document.getElementById("container");
						container.appendChild(m_canvasVR);
						m_vrDisplay.requestPresent([{source: m_renderer.domElement}]);
						if (m_canvas2d != null)
						{
							console.log("im deleting canvas2d");
							var container = document.getElementById("container");
							m_canvas2d.removeEventListener("touchstart", handleStart, false);
							m_canvas2d.removeEventListener("touchend", handleEnd, false);
							m_canvas2d.removeEventListener("touchcancel", handleCancel, false);
							m_canvas2d.removeEventListener("touchleave", handleEnd, false);
							m_canvas2d.removeEventListener("touchmove", handleMove, false);	
							console.log("remove m_canvas2d");
							container.removeChild(m_canvas2d);
							m_canvas2d = null;
							m_canvas2dContext = null;
						}
						resizeCanvas();
										
						window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
						window.addEventListener('vrdisplayconnect', onVRDisplayConnect);
						m_GameState = GameStateEnum.VR;
						
					}
					break;
				/* case ToggleStateEnum.NOSLEEP:
					if (!m_wakeLockEnabled) {
						m_noSleep.enable(); // keep the screen on!
						m_wakeLockEnabled = true;
					}

					break; */
				}
			}
			m_toggleStatePending.length = 0;
			m_toggleStatePending[0] = ToggleStateEnum.NONE;

			if (m_canvas2d != null)
			{
				var touches = evt.changedTouches;
				var offset = findPos(m_canvas2d);
				if (touches === undefined)
				{
					evt.preventDefault();
				}
				else
				{
					for (var i = 0; i < touches.length; i++) {
						if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(m_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(m_canvas2d.height)) {
							evt.preventDefault();
							var idx = ongoingTouchIndexById(touches[i].identifier);

							if (idx >= 0) {
							//m_rotationStarted = false;
							//m_move360Started = false;
								manualControl = false;

								ongoingTouches.splice(i, 1); // remove it; we're done
							} else {
							//console.log("can't figure out which touch to end");
							}
						}
					}
				}
			}
			
        }



        function handleCancel(evt) {
            evt.preventDefault();
            //console.log("touchcancel.");
            var touches = evt.changedTouches;

            for (var i = 0; i < touches.length; i++) {
				//m_rotationStarted = false;
				//m_move360Started = false;
				manualControl = false;
				//m_deltaRotation = 0;
				//m_angleRotationStart = 0;
				//m_PreviousInteractionTime = Date.now();
                ongoingTouches.splice(i, 1); // remove it; we're done
            }
        }




        function copyTouch(touch) {
            return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
        }

        function ongoingTouchIndexById(idToFind) {
            for (var i = 0; i < ongoingTouches.length; i++) {
            var id = ongoingTouches[i].identifier;
    
                if (id == idToFind) {
                    return i;
                }
            }
            return -1; // not found
        }

        function findPos (obj) {
            var curleft = 0,
            curtop = 0;

            if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);

            return { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
            }
		}

		
