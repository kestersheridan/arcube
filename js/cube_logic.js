
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


	
//device capabilties

const BrowserTypeEnum = {
	UNKNOWN: 0,
	SAFARI: 1,
	CHROME: 2,
	FIREFOX: 3
};

const ButtonStateEnum = {
	NOTTOUCHED : 0,
	FIRSTTOUCHED : 1,
	TOUCHCONTINUE : 2
}


const AssetLoaderTypeEnum = {
	MODEL: 0,
	TEXTURE: 1
};

const AssetFileTypeEnum = {
	FBX : 0,
	GLB : 1
}

const SideTypeEnum = {
	TOP: 0,
	BOTTOM: 1,
	FRONT: 2,
	BACK: 3,
	RIGHT : 4,
	LEFT : 5
};

const IOSVersionEnum = {
	NOT: 0,
	IOS12ORLOWER: 1,
	IOS13PLUS: 2
};

var SpeechSDK = window.SpeechSDK;
var g_serviceRegion = null;
var g_authorizationToken = null;
var authorizationEndpoint = "token.php";
var g_azureVoiceNames = new Array;



var m_isMobileDevice = false;
var g_isIOS = false;
var g_isIPhone = false;
var g_browser;
var g_enableParticleSystem = true;
var m_IOSVersion = IOSVersionEnum.NOT;
var g_browserType;
var g_isTextToSpeechCompatibleDevice = false;
var g_isSpeechToTextCompatibleDevice = false;
var m_isFullscreenCompatibleBrowser = false;
var m_isHomescreen = false;


var patternArray, markerRootArray, markerGroupArray;
var sceneGroup;

//booleans

var g_isCurrentLandscape = false;
var m_currentScreenAngle = 0;
var m_visitedBefore = false;

var m_debugtext = "";

const TouchStateEnum = {
  NONE: 0,
  START: 1,
  MOVE: 2,
  END: 3
};

//interaction variables 

var m_currentTouchState = TouchStateEnum.NONE; 
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

var g_loadingManager = null;

//var m_genericAbsSensor = null;
var m_genericRelSensor = null;
//var m_sensorQuauaternion = null;

var m_cameraStream = null;

//canvases
var g_canvas2d;
var m_canvas2dContext;
var m_canvas3d;	

var m_disclaimerCanvas;
var m_contextDisclaimerCanvas;


var m_resizedARCanvasWidth;
var m_resizedARCanvasX;
var m_resizedARCanvasY;
var m_resizedARCanvasHeight;

var m_canvasWidth;
var m_canvasHeight;

//3d stuff
var g_renderer;
var g_scene;
var g_camera;

var g_ARCube = null;

//var patternArray, markerRootArray, markerGroupArray;
//var sceneGroup;
//var m_sceneModels = [];
//var m_shadowARPlane = null;

var m_clock;

var m_isMouseDown = false;

var m_INTERSECTED;
var m_crosshair;

var m_stats;

var m_displaytext3DPlane;
var m_displaytext3DTexture;

var m_npcARMarkers = null;
var m_npcARMarkerVisible = false;

var g_arToolkitSource = null;
var g_arToolkitContext = null;
var m_retryAttempts = 0;	


var m_selectedExercise;
var m_selectedGender;
var m_selectedAvatarID;
var m_selectedAvatarTexture;
var m_tempSelectedAvatar;
var m_tempSelectedTexture;
var m_tempSelectedAvatarModelIndex;

const LoadingStatusEnum = {
	NOTSTARTED : 0,
	STARTED : 1,
	PROGRESSING : 2,
	COMPLETED : 3
}
		
var m_loadingManagerStatus = null;
var g_loadingError = false;
var g_loadingErrorMessage;
var m_loadingStatus = null;
var m_loadingProgressStatus = null
var m_itemsLoaded = 0;
var m_itemsTotal = 0;
var m_transition; 
		
//states
var m_GameState;
var m_RenderState;
var m_ARState;

var m_progressLoading;
	
const AnchorPointEnum = {
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
var m_cameraPortraitWidth;
var m_cameraPortraitHeight;



const ToggleStateEnum = {
  NONE: 0,
  FULLSCREENSTATE: 1,
  WINDOWEDSCREENSTATE: 2,
  VIDEOPLAYERSTATE: 3,
  VRSTATE: 4,
  NOSLEEP: 5,
  MOTION: 6,
  SPEECH: 7
};
	
const RenderStateEnum = {
  NORENDER: 0,
  RENDERALL: 1,
  RENDERPAGE: 2
};

const GameStateEnum = {
	LOADING: 0,
	INIT: 1,
	LANDING: 2,
	ARLOADING: 3,
	ARSCAN: 4,
	ARUNLOADING: 5

};


const SpeechStatusEnum = {
	QUESTIONSAY: 0,
	QUESTIONEND: 1,
	ANSWERSAY: 2,
	ANSWEREND: 3
};



//content and structure read from JSON files

var dataContentReceived = false;
var dataStructureReceived = false;
var g_Content;
var g_Structure;

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

var m_loadedSide = 0;

//video stuff
var m_windowedVideoPlayer;
var m_pausedByUser = false;
var m_VideoCurrentStatus;
var m_VideoIsPresent = false;

const MediaPlayStateEnum = {
  NOTINITIALISED: 0,
  NOTPLAYING: 1,
  PLAYING: 2,
  PAUSED: 3,
  ERROR : 4,
  ENDED : 5,
  RECORDING : 6
};


//button images
var m_logoImage;
var m_startButtonImage;
var m_downloadButtonImage;
var m_backButtonImage;
var m_exitButtonImage;
var m_helpButtonImage;
var m_tickButtonImage;
var m_crossButtonImage;
var m_micButtonImage;
var m_pauseButtonImage;
var m_playButtonImage;
var m_replayButtonImage;
var m_subtitleButtonImage;
var m_rightButtonImage;
var m_leftButtonImage;
var m_waitingImagesArray = new Array;
var m_LerpedControlPts = new Array;

//maths
var TO_RADIANS = Math.PI/180;


// Physics variables
const gravityConstant = - 9.8;
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var softBodySolver;
var g_physicsWorld = null;


function init (orientation, contentid) {
	
	THREE.Cache.enabled = true;
	m_genericRelSensor  = orientation;
	m_genericRelSensor.onreading = () => {
		if (g_ARCube != null)
		{
			g_ARCube.updateRotation(m_genericRelSensor.quaternion, m_currentScreenAngle);
		}
	}
	
    m_genericRelSensor.onerror = (event) => {
    if (event.error.name == 'NotReadableError') {
        console.log("Sensor is not available.");
		}
    }
	
	
	document.getElementById("loader").style.display = "inline";
	m_GameState = GameStateEnum.LOADING;
	m_toggleStatePending.length = 0;
	m_toggleStatePending[0] = ToggleStateEnum.NONE;
	//load content and structure JSON files
	var xmlhttp = new XMLHttpRequest();
	var url;
	console.log("load contentid " + contentid);
	if (contentid != null)
	{
		url = "content/content" + contentid + ".json";
	}
	else
	{
		url = "content/content.json";
	}
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			g_Content = JSON.parse(xmlhttp.responseText);
			dataContentReceived = true;
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
			
	var xmlhttp2 = new XMLHttpRequest();
	var url2 = "content/structure.json";
				
	xmlhttp2.onreadystatechange = function () {
		if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
			g_Structure = JSON.parse(xmlhttp2.responseText);
			dataStructureReceived = true;
		}
	};
	xmlhttp2.open("GET", url2, true);
	xmlhttp2.send();
	
	var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');
	var iphoneExp = new RegExp('iPhone');			  
	g_browser = get_browser();
	var isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);
	var isInWebAppiOS = (window.navigator.standalone == true);
	console.log("navigator.userAgent " + navigator.userAgent);
	if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform === 'MacIntel'))
	{
		g_isIPhone = (iphoneExp.test(navigator.userAgent));

		g_isIOS = true;
		getAzureAuthorizationToken();
		if (typeof DeviceMotionEvent.requestPermission === 'function') {
			// iOS 13+
			m_IOSVersion = IOSVersionEnum.IOS13PLUS;
		} else {
			// non iOS 13+
			m_IOSVersion = IOSVersionEnum.IOS12ORLOWER;
		}
		
	}
	var is_firefox = navigator.userAgent.toLowerCase().indexOf('mozilla') > -1 && navigator.userAgent.toLowerCase().indexOf('gecko') > -1;
	var is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var is_explorer= typeof document !== 'undefined' && !!document.documentMode && !isEdge;
    var is_safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
	
	if (isMobile())
	{
		
		m_isMobileDevice = true;
		if (isChrome() && (testExp.test(navigator.userAgent)) )
		{
		//know it is Chrome Browser
			
			g_browserType = BrowserTypeEnum.CHROME;
			if ('webkitSpeechRecognition' in window)
			{
				g_isSpeechToTextCompatibleDevice = true;
			}
			if ('speechSynthesis' in window)
			{				
				g_isTextToSpeechCompatibleDevice = true;
			}
	
			if (!g_isIOS)
			{
				console.log("m_isFullscreenCompatibleBrowser = true");
				m_isFullscreenCompatibleBrowser = true;
			}

			if (isInWebAppChrome)
			{
				m_isHomescreen = true;
				//Its Chrome on Homescreen
			}
		}
		else
		{
		
			if (g_isIOS)
			{
				if (is_safari)
				{
					g_browserType = BrowserTypeEnum.SAFARI;
					if ('speechSynthesis' in window)
					{				
						g_isTextToSpeechCompatibleDevice = true;
					}
					//m_isSpeechCompatibleDevice = true;
					if (isInWebAppiOS)
					{
						m_isHomescreen = true;
						console.log("ios homescreen");
						//Safari Homescreen
					}
					//temporarily disable particle system in iOS 15
					if (g_browser.version > 14)
					{
						g_enableParticleSystem = false;
					}

				}
				else
				{
					if ((is_firefox) || (navigator.userAgent.toLowerCase().indexOf('firefox') > -1))
					{
						g_browserType = BrowserTypeEnum.FIREFOX;
					}

				}
			}
			else
			{
				if ((is_firefox) || (navigator.userAgent.toLowerCase().indexOf('firefox') > -1))
				{
					g_browserType = BrowserTypeEnum.FIREFOX;
					m_isFullscreenCompatibleBrowser = true;

				}
			}
		}
	}
	
	// load play, pause, replay images
	m_logoImage = new Image();
	m_logoImage.src = "assets/images/logo.png";
	
	m_startButtonImage = new Image();
	m_startButtonImage.src = "assets/images/startbutton.png";
	
	m_backButtonImage = new Image();
	//m_backButtonImage.src = "assets/images/backbutton2.png";
	m_backButtonImage.src = "assets/images/exitbutton.png";
	
	m_exitButtonImage = new Image();
	//m_exitButtonImage.src = "assets/images/exitbutton.png";
	m_exitButtonImage.src = "assets/images/backbutton2.png";
	
	m_helpButtonImage = new Image();
	m_helpButtonImage.src = "assets/images/helpbutton4.png";

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
	
	/* for(var j=0;j<8;j++){ 
		m_waitingImagesArray[j] = [];
		m_waitingImagesArray[j] = new Image();
		m_waitingImagesArray[j].onload = function() {
			
		};
		m_waitingImagesArray[j].src = "assets/images/waiting" + j + ".png"; 	
				
	} */
	
	//m_noSleep = new NoSleep();
	
	//setup canvases
	
	g_canvas2d = document.createElement('canvas');
	g_canvas2d.id = "main_canvas";
	var container = document.getElementById('container');
	container.appendChild(g_canvas2d);
	g_canvas2d.addEventListener("touchstart", handleStart, false);
	g_canvas2d.addEventListener("touchend", handleEnd, false);
	g_canvas2d.addEventListener("touchcancel", handleCancel, false);
	g_canvas2d.addEventListener("touchleave", handleEnd, false);
	g_canvas2d.addEventListener("touchmove", handleMove, false);
	m_canvas2dContext = g_canvas2d.getContext('2d');
	g_canvas2d.style.zIndex = "0";				
	
	if ((!g_isIOS) && (g_browserType == BrowserTypeEnum.CHROME))
	{
		responsiveVoice.AddEventListener("OnLoad",function(){
			console.log("ResponsiveVoice Loaded Callback") ;
			if(responsiveVoice.voiceSupport()) {
				g_isTextToSpeechCompatibleDevice = true;
				responsiveVoice.speak("", "UK English Male");	
			}
		});
	}
	
	m_ActiveClickPoints.length = 0;
	

	m_disclaimerCanvas = document.createElement('canvas');
	m_disclaimerCanvas.width = 2400;
    m_disclaimerCanvas.height = 1000;
    m_contextDisclaimerCanvas = m_disclaimerCanvas.getContext('2d');	

	
	//m_stats = new Stats();
	
	Ammo().then( function ( AmmoLib ) {

		Ammo = AmmoLib;

		update();

	} );
	
	
  }



function update() {
	
	
	switch (m_GameState) {
	case GameStateEnum.LOADING:

		if ((dataContentReceived) && (dataStructureReceived))
		{
			m_cameraPortraitWidth = g_Structure.arscanner.cameraresolution.width;
			m_cameraPortraitHeight = g_Structure.arscanner.cameraresolution.height;
			resizeCanvas();
			// resize the canvas to fill browser window dynamically
			window.addEventListener("resize", resizeCanvas, false);
			window.addEventListener("orientationchange", resizeCanvas, false);
			m_GameState = GameStateEnum.INIT;
		}
		break;
	case GameStateEnum.INIT:
		
		/* var startbutton1 = new buttonObject(m_startButtonImage, g_Structure.toplevel.startbuttonposition.x , g_Structure.toplevel.startbuttonposition.y, g_Structure.toplevel.startbuttonposition.scale, g_Structure.toplevel.startbuttonposition.rotation);
		var tapPoint = new tapItem(g_Structure.toplevel.startbuttontapcollision, startbutton1, "start", 1, false);
		m_ActiveClickPoints.push(tapPoint);
		*/
		
		m_ActiveClickPoints.length = 0;
		g_canvas2d.addEventListener( 'mousedown', handleStart, false );
		g_canvas2d.addEventListener( 'mouseup', handleEnd, false );
		m_enableTouchClick = true;
		//setupButton(m_downloadButtonImage, g_Structure.toplevel.downloadbutton.x, g_Structure.toplevel.downloadbutton.y, g_Structure.toplevel.downloadbutton.radius, g_Structure.toplevel.downloadbutton.scale, g_Structure.toplevel.downloadbutton.rotation, g_Structure.toplevel.downloadbutton.type, g_Structure.toplevel.downloadbutton.scale, g_Structure.toplevel.downloadbutton.anchorpoint);
		
		if ((m_isMobileDevice) && ((g_isIOS && g_browserType == BrowserTypeEnum.SAFARI) || (!g_isIOS && g_browserType == BrowserTypeEnum.CHROME)))
		{
			
			setupButton(m_startButtonImage, g_Structure.toplevel.startbutton.x, g_Structure.toplevel.startbutton.y, g_Structure.toplevel.startbutton.radius, g_Structure.toplevel.startbutton.scale, g_Structure.toplevel.startbutton.rotation, g_Structure.toplevel.startbutton.type, g_Structure.toplevel.startbutton.scale, g_Structure.toplevel.startbutton.anchorpoint);
	
			
	/* 		if (m_isSpeechCompatibleDevice)
			{
		
				//responsiveVoice.speak("This is a test", "UK English Male");
			} */
		}
		m_clickCollisonValue = -1;
		m_currentTouchState = TouchStateEnum.NONE;
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
				if (m_isFullscreenCompatibleBrowser)
				{
					m_toggleStatePending.push(ToggleStateEnum.FULLSCREENSTATE);
					//m_toggleStatePending[0] = ToggleStateEnum.FULLSCREENSTATE;
					//m_toggleStatePending[1] = ToggleStateEnum.NOSLEEP;
					m_screenTogglePending = true;
				}
				
				if (m_IOSVersion == IOSVersionEnum.IOS13PLUS)
				{
					m_toggleStatePending.push(ToggleStateEnum.MOTION);
				}
				
				m_enableTouchClick = false;
				g_canvas2d.removeEventListener( 'mousedown', handleStart, false );
				g_canvas2d.removeEventListener( 'mouseup', handleEnd, false );
				console.log("start");
				m_loadingManagerStatus = LoadingStatusEnum.NOTSTARTED;
				//m_loadingComplete = false;
				g_loadingError = false;
				g_loadingErrorMessage = "";
				m_transition = 0;
				m_lerpValue = 0;
				m_LerpedAlpha.length = 0;
				m_LerpedAlpha[0] = 0;
				m_progressLoading = "0%";
				m_loadingStatus = "Initialising AR Camera";
				m_loadingProgressStatus = "";
				m_GameState = GameStateEnum.ARLOADING;
				m_transition = 0;
				break;
			}
			
			m_clickCollisonValue = -1;
			m_currentTouchState = TouchStateEnum.NONE;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.ARLOADING:
		
		switch (m_transition) {
		case 0:
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
				if ((g_isIOS) && (g_browserType == BrowserTypeEnum.SAFARI))
				{
					console.log("set m_transition to 3, visitedbefore");	
					m_transition = 3;
				}
				else
				{
					if ((m_visitedBefore) || (!g_isTextToSpeechCompatibleDevice))
					//if (m_visitedBefore)
					{
						console.log("set m_transition to 3, visitedbefore");	
						m_transition = 3;
					}
					else
					{
						console.log("set m_transition to 1, not visitedbefore");	
						m_transition = 1;
					}
				}
			}
			break;
		case 1:
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
				if (m_cameraStream == null)
				{
					var promise = navigator.mediaDevices.getUserMedia(userMediaConstraints).then(function success(stream) {
						if ((m_GameState == GameStateEnum.ARLOADING) && (m_transition == 1))
						{	
							console.log("m_cameraStream = stream closing");	
							m_cameraStream = stream;
							m_transition = 2;
						}
					}).catch(function(error) {
				
						console.log("Error : " + error);
					
						m_transition = 1;
					});

				}
			}
			break;	
		case 2:
			
			if (m_cameraStream != null)
			{
				let tracks = m_cameraStream.getTracks();

				tracks.forEach(function(track) {
					track.stop();
				});
				
				m_cameraStream = null;
				
				m_retryAttempts = 0;					
				m_transition = 3;
			}
			break;
		case 3:
			
			if (g_arToolkitSource == null)
			{
				console.log("m_transition == 3 setup");
				try {
				setupARCamera();
				}
				catch(err) {
					g_loadingErrorMessage = "Error loading AR Camera";
					if (g_arToolkitSource != null)
					{
						unloadARContext();
						unloadARCamera();
					}
					m_transition = 0;
				}
				setCookie("visitedbefore", "true", 30);	
				m_visitedBefore = true;
				g_loadingErrorMessage = "";
				m_transition = 4;
			}
			break;
		case 4:
			if( !g_arToolkitSource.ready === false)
			{
				
				m_canvas3d = document.createElement('canvas');
			
				m_canvas3d.width = m_cameraPortraitWidth;
				m_canvas3d.height = m_cameraPortraitHeight;
				m_canvas3d.style.position = 'absolute'
				m_canvas3d.style.top = '0px'
				m_canvas3d.style.left = '0px'
				m_canvas3d.style.zIndex = "1";
				
				//storedHemisphereLightIntensities.length = 0;
				//storedAmbientLightIntensities.length = 0;
	
				g_renderer	= new THREE.WebGLRenderer({
					canvas: m_canvas3d,
					antialias	: true,
					alpha: true
				});		
				
				g_renderer.setSize( m_cameraPortraitWidth, m_cameraPortraitHeight );
				g_renderer.gammaInput = false; // do false
				g_renderer.gammaOutput = true; 
				g_renderer.gammaFactor = 2.2;
				g_camera = new THREE.PerspectiveCamera( 45, m_cameraPortraitWidth / m_cameraPortraitHeight, 1, 2000 );

	
				// creating a new scene
				g_scene = new THREE.Scene();
				g_camera.position.set( 0, 0, 0 );
				g_scene.add(g_camera);
				
			
				// create an atToolkitContext
				loadARContext();
				
				m_ActiveClickPoints.length = 0;
				if (g_Structure.arscanner.hasOwnProperty('backbutton'))
				{
					setupButton(m_backButtonImage, g_Structure.arscanner.backbutton.x, g_Structure.arscanner.backbutton.y, g_Structure.arscanner.backbutton.radius, g_Structure.arscanner.backbutton.scale, g_Structure.arscanner.backbutton.rotation, g_Structure.arscanner.backbutton.type, g_Structure.arscanner.backbutton.scale, g_Structure.arscanner.backbutton.anchorpoint);
				}
				if (g_Structure.arscanner.hasOwnProperty('exitbutton'))
				{
					setupButton(m_exitButtonImage, g_Structure.arscanner.exitbutton.x, g_Structure.arscanner.exitbutton.y, g_Structure.arscanner.exitbutton.radius, g_Structure.arscanner.exitbutton.scale, g_Structure.arscanner.exitbutton.rotation, g_Structure.arscanner.exitbutton.type, g_Structure.arscanner.exitbutton.scale, g_Structure.arscanner.exitbutton.anchorpoint);
				}
				if (g_Structure.arscanner.hasOwnProperty('helpbutton'))
				{
					setupButton(m_helpButtonImage, g_Structure.arscanner.helpbutton.x, g_Structure.arscanner.helpbutton.y, g_Structure.arscanner.helpbutton.radius, g_Structure.arscanner.helpbutton.scale, g_Structure.arscanner.helpbutton.rotation, g_Structure.arscanner.helpbutton.type, g_Structure.arscanner.helpbutton.scale, g_Structure.arscanner.helpbutton.anchorpoint);						
				}

		
				//load manager
				if (g_loadingManager == null)
				{
		
					g_loadingManager = new THREE.LoadingManager();
					g_loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
						m_loadingManagerStatus = LoadingStatusEnum.STARTED;
						console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
						m_loadingProgressStatus = "Started loading file: " + itemsLoaded + " of " + itemsTotal + " files.";
						m_progressLoading = (Math.floor((itemsLoaded / itemsTotal) * 100)) + "%";
						m_itemsLoaded = itemsLoaded;
						m_itemsTotal = itemsTotal;
						
					};

					g_loadingManager.onLoad = function ( ) {
						m_loadingManagerStatus = LoadingStatusEnum.COMPLETED;
						console.log( 'Loading complete!');
						//m_loadingComplete = true;
						m_loadingProgressStatus = "Loading complete.";
						m_progressLoading = "100%";
						

					};
					g_loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
						m_loadingManagerStatus = LoadingStatusEnum.PROGRESSING;
						console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
						m_progressLoading = (Math.floor((itemsLoaded / itemsTotal) * 100)) + "%";
						m_itemsLoaded = itemsLoaded;
						m_itemsTotal = itemsTotal;
						
					};
					g_loadingManager.onError = function ( url ) {

						console.log( 'There was an error loading ' + url );
						g_loadingErrorMessage = "Error loading " + url;
						g_loadingError = true;
						m_lerpValue = 0;
						m_transition = 5;
					};
				}
				if (g_ARCube == null)
				{
					g_ARCube = new ArCube();
				}
				m_lerpValue = 0;
				m_transition = 6;
				m_loadedSide = 0;
			}
			break;
		case 5:
			//error handling
			console.log("AR Loading 5 ");
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
			break;
		case 6:
			if (((m_loadingManagerStatus == LoadingStatusEnum.COMPLETED) || (m_loadingManagerStatus == LoadingStatusEnum.NOTSTARTED)) && ( g_arToolkitSource.ready) && (!g_loadingError))
			{
				if (g_ARCube != null)
				{
					m_loadingManagerStatus = LoadingStatusEnum.NOTSTARTED;
					g_loadingError = false;
					g_loadingErrorMessage = "";
					m_loadingProgressStatus = "Loading complete.";
					m_progressLoading = "0%";
					if (m_loadedSide < g_ARCube.getNumSides())
					{

						m_loadingStatus = "Loading Side " + (m_loadedSide + 1) + " of " + g_ARCube.getNumSides() + "\n" + m_loadingProgressStatus;
						g_ARCube.loadSideStages(m_loadedSide);
						m_loadedSide++;
					}
					else
					{
						g_ARCube.loadAssets();
						m_transition = 7;
					}
				}
			}
			else
			{
				if ((g_loadingError) && (m_loadingManagerStatus == LoadingStatusEnum.COMPLETED))
				{
					m_lerpValue = 0;
					m_transition = 5;
				}
				
			}
			m_loadingProgressStatus = "Started loading file: " + m_itemsLoaded + " of " + m_itemsTotal + " files.";
			m_loadingStatus = "Loading Side " + (m_loadedSide + 1) + " of " + g_ARCube.getNumSides() + "\n" + m_loadingProgressStatus;
			break;
		case 7:
			if (((m_loadingManagerStatus == LoadingStatusEnum.COMPLETED) || (m_loadingManagerStatus == LoadingStatusEnum.NOTSTARTED)) && ( g_arToolkitSource.ready) && (!g_loadingError))
			{
				console.log("loadstates");
				g_ARCube.loadStates();
				//g_ARCube.addObjectReferences();
				m_loadingProgressStatus = "Loading complete.";
				m_loadingStatus = "Loading Assets\n" + m_loadingProgressStatus;
				m_lerpValue = 0;
				m_transition = 8;
			}
			else
			{
				m_loadingProgressStatus = "Started loading file: " + m_itemsLoaded + " of " + m_itemsTotal + " files.";
				m_loadingStatus = "Loading Assets\n" + m_loadingProgressStatus;
			}
			break;
		case 8:
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
				console.log("AR Loading 7");
				g_ARCube.init();
				document.getElementById("loader").style.display = "none";
				m_enableTouchClick = true;
				m_currentTouchState = TouchStateEnum.NONE;
				//m_enabledMic = true;
				m_lerpValue = 0;
				resizeCanvas();
				m_genericRelSensor.start();
				m_GameState = GameStateEnum.ARSCAN;
			}
			break;
		}
		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.ARSCAN:
		
		
		if( !g_arToolkitSource.ready === false)
		{
			
			g_arToolkitContext.update( g_arToolkitSource.domElement );
			
			g_scene.visible = g_camera.visible
		}
		
		
	 	/* if ((g_ARCube.getCubeState() == CubeStateEnum.ACTIVE) || (g_ARCube.getCubeState() == CubeStateEnum.INACTIVE))
		{
			if (!m_enableTouchClick)
			{
				m_enableTouchClick = true;
			}
		}
		else
		{
			m_enableTouchClick = false;
		}  */
		
		if (m_clickCollisonValue > -1)
		{
			switch (m_ActiveClickPoints[m_clickCollisonValue].itemtype) {
			case "back":
				//g_ARCube.closing();
				m_GameState = GameStateEnum.ARUNLOADING;
				m_enableTouchClick = false;
				if (m_isFullscreenCompatibleBrowser)
				{
					m_toggleStatePending[0] = ToggleStateEnum.WINDOWEDSCREENSTATE;
					m_screenTogglePending = true;
				}
				break;
			case "exit":
				if (g_ARCube.getCubeState() == CubeStateEnum.ACTIVE)
				{
					if (g_ARCube.isHelpTextDisplayed())
					{
						g_ARCube.setHelpToggle(false);
					}
					else
					{
						g_ARCube.setCubeState(CubeStateEnum.CLOSING);
					}
				}
				break;
			case "help":
				if (m_currentTouchState == TouchStateEnum.END)
				{
					if (g_ARCube.getCubeState() == CubeStateEnum.ACTIVE)
					{
						g_ARCube.setHelpToggle(null);
					}
				}
				break;	
			}
/* 			if (m_ActiveClickPoints[m_clickCollisonValue].itemtype == "back")
			{
				if (g_ARCube.getCubeState() == CubeStateEnum.ACTIVE)
				{
					g_ARCube.setCubeState(CubeStateEnum.CLOSING);
				}
				else
				{
					if ((g_ARCube.getCubeState() != CubeStateEnum.CLOSING) && (g_ARCube.getCubeState() != CubeStateEnum.OPENING) && (g_ARCube.getCubeState() != CubeStateEnum.INITOPENING))
					{
						
						m_GameState = GameStateEnum.ARUNLOADING;
						m_enableTouchClick = false;
						if (m_isFullscreenCompatibleBrowser)
						{
							m_toggleStatePending[0] = ToggleStateEnum.WINDOWEDSCREENSTATE;
							m_screenTogglePending = true;
						}
					}
				}

				
			} */
	
			m_clickCollisonValue = -1;
			m_currentTouchState = TouchStateEnum.NONE;
			
		}
		
	
		g_ARCube.update();

		m_RenderState = RenderStateEnum.RENDERALL;
		break;
	case GameStateEnum.ARUNLOADING:
		document.getElementById("loader").style.display = "inline";
		
		
		console.log( "before", g_renderer.info.memory );
		m_ARMarkerVisibleCount = 0;
		m_ActiveClickPoints.length = 0;
		setupButton(m_backButtonImage, g_Structure.arscanner.backbutton.x, g_Structure.arscanner.backbutton.y, g_Structure.arscanner.backbutton.radius, g_Structure.arscanner.backbutton.scale, g_Structure.arscanner.backbutton.rotation, g_Structure.arscanner.backbutton.type, g_Structure.arscanner.backbutton.scale, g_Structure.arscanner.backbutton.anchorpoint);		
		m_enableTouchClick = false;	
		m_lerpValue = 0;


		m_genericRelSensor.stop();
		
		
		g_loadingManager = null;
	
		unloadARContext();
		unloadARCamera();
		
		g_ARCube.dispose();
		g_ARCube = null;
		
		
		
		
		//remove three.js stuff
		
		g_scene.remove(g_camera);
		g_camera = null;
		g_scene.dispose();
		g_scene = null;
		
		

			
		if (g_renderer != null)
		{
			g_renderer.renderLists.dispose();
			g_renderer.dispose();
			g_renderer.forceContextLoss(); 
			console.log( "after", g_renderer.info.memory);
			g_renderer.context=undefined;
			g_renderer.domElement=undefined;
			g_renderer = null;
			THREE.Cache.clear(); 
		}
		//canvases
		m_canvas3d = null;
		
		
		
		
	
		
		document.getElementById("loader").style.display = "none";
		m_currentTouchState = TouchStateEnum.NONE;
		m_enableTouchClick = true;		
		m_GameState = GameStateEnum.INIT;
		
		m_RenderState = RenderStateEnum.RENDERALL;
		
		break;
		
	}
	
	if (m_GameState != GameStateEnum.LOADING)
	{
		render();
	}
		

	requestAnimFrame(update);	
}



function render() { 

	if (m_stats != null)
	{
		m_stats.begin();
	}
	
	if (m_RenderState == RenderStateEnum.RENDERALL)
	{
		if (g_canvas2d != null)
		{
			m_canvas2dContext = g_canvas2d.getContext('2d');
			m_canvas2dContext.clearRect(0, 0, g_canvas2d.width, g_canvas2d.height);
		}
		switch (m_GameState) {
			
		case GameStateEnum.LANDING:	
		
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (g_isCurrentLandscape)
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
					}
					else
					{
						drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
					}
				}
											
			} 
			drawAutoScaledImage(m_canvas2dContext, m_logoImage, g_Structure.toplevel.logo.x, g_Structure.toplevel.logo.y, g_Structure.toplevel.logo.rotation, g_Structure.toplevel.logo.anchorpoint, g_Structure.toplevel.logo.alignment, 1.0, g_Structure.toplevel.logo.minscale, g_Structure.toplevel.logo.maxscale);
			//var textposx = (m_canvas2d.width / 2) + (g_Structure.toplevel.instructions.x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			//var textposy = m_canvas2d.height - ((m_canvas2d.height / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - g_Structure.toplevel.instructions.y));
			
			if (m_isMobileDevice)
			{
				if (g_isIOS)
				{
					if (g_browserType == BrowserTypeEnum.SAFARI)
					{
						if (m_isHomescreen)
						{
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.instructions.text, g_Structure.toplevel.instructions.font1, g_Structure.toplevel.instructions.font2, g_Structure.toplevel.instructions.colour1, g_Structure.toplevel.instructions.colour2, g_Structure.toplevel.instructions.lineheight1, g_Structure.toplevel.instructions.lineheight2, g_Structure.toplevel.instructions.portraitmaxwidth, g_Structure.toplevel.instructions.landscapemaxwidth, g_Structure.toplevel.instructions.x, g_Structure.toplevel.instructions.y, g_Structure.toplevel.instructions.rotation,   g_Structure.toplevel.instructions.alignment, g_Structure.toplevel.instructions.anchor, null, null, g_Structure.toplevel.instructions.anchorpoint);
						}
						else
						{
							drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.iosinstructions.text, g_Structure.toplevel.iosinstructions.font1, g_Structure.toplevel.iosinstructions.font2, g_Structure.toplevel.iosinstructions.colour1, g_Structure.toplevel.iosinstructions.colour2, g_Structure.toplevel.iosinstructions.lineheight1, g_Structure.toplevel.iosinstructions.lineheight2, g_Structure.toplevel.iosinstructions.portraitmaxwidth, g_Structure.toplevel.iosinstructions.landscapemaxwidth, g_Structure.toplevel.iosinstructions.x, g_Structure.toplevel.iosinstructions.y, g_Structure.toplevel.iosinstructions.rotation,   g_Structure.toplevel.iosinstructions.alignment, g_Structure.toplevel.iosinstructions.anchor, null, null, g_Structure.toplevel.iosinstructions.anchorpoint); 							
						}
					}
					else
					{
						drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.iosnosafariprompt.text, g_Structure.toplevel.iosnosafariprompt.font1, g_Structure.toplevel.iosnosafariprompt.font2, g_Structure.toplevel.iosnosafariprompt.colour1, g_Structure.toplevel.iosnosafariprompt.colour2, g_Structure.toplevel.iosnosafariprompt.lineheight1, g_Structure.toplevel.iosnosafariprompt.lineheight2, g_Structure.toplevel.iosnosafariprompt.portraitmaxwidth, g_Structure.toplevel.iosnosafariprompt.landscapemaxwidth, g_Structure.toplevel.iosnosafariprompt.x, g_Structure.toplevel.iosnosafariprompt.y, g_Structure.toplevel.iosnosafariprompt.rotation,   g_Structure.toplevel.iosnosafariprompt.alignment, g_Structure.toplevel.iosnosafariprompt.anchor, null, null, g_Structure.toplevel.iosnosafariprompt.anchorpoint); 	
					}
				}
				else
				{
					if (g_browserType == BrowserTypeEnum.CHROME)
					{
						drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.instructions.text, g_Structure.toplevel.instructions.font1, g_Structure.toplevel.instructions.font2, g_Structure.toplevel.instructions.colour1, g_Structure.toplevel.instructions.colour2, g_Structure.toplevel.instructions.lineheight1, g_Structure.toplevel.instructions.lineheight2, g_Structure.toplevel.instructions.portraitmaxwidth, g_Structure.toplevel.instructions.landscapemaxwidth, g_Structure.toplevel.instructions.x, g_Structure.toplevel.instructions.y, g_Structure.toplevel.instructions.rotation, g_Structure.toplevel.instructions.alignment, g_Structure.toplevel.instructions.anchor, null, null, g_Structure.toplevel.instructions.anchorpoint); 						
					}
					else
					{
						drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.androidunknownprompt.text, g_Structure.toplevel.androidunknownprompt.font1, g_Structure.toplevel.androidunknownprompt.font2, g_Structure.toplevel.androidunknownprompt.colour1, g_Structure.toplevel.androidunknownprompt.colour2, g_Structure.toplevel.androidunknownprompt.lineheight1, g_Structure.toplevel.androidunknownprompt.lineheight2, g_Structure.toplevel.androidunknownprompt.portraitmaxwidth, g_Structure.toplevel.androidunknownprompt.landscapemaxwidth, g_Structure.toplevel.androidunknownprompt.x, g_Structure.toplevel.androidunknownprompt.y, g_Structure.toplevel.androidunknownprompt.rotation,   g_Structure.toplevel.androidunknownprompt.alignment, g_Structure.toplevel.androidunknownprompt.anchor, null, null, g_Structure.toplevel.androidunknownprompt.anchorpoint); 	
					}
				}
			}
			else
			{
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_Structure.toplevel.desktopprompt.text, g_Structure.toplevel.desktopprompt.font1, g_Structure.toplevel.desktopprompt.font2, g_Structure.toplevel.desktopprompt.colour1, g_Structure.toplevel.desktopprompt.colour2, g_Structure.toplevel.desktopprompt.lineheight1, g_Structure.toplevel.desktopprompt.lineheight2, g_Structure.toplevel.desktopprompt.portraitmaxwidth, g_Structure.toplevel.desktopprompt.landscapemaxwidth, g_Structure.toplevel.desktopprompt.x, g_Structure.toplevel.desktopprompt.y, g_Structure.toplevel.desktopprompt.rotation,   g_Structure.toplevel.desktopprompt.alignment, g_Structure.toplevel.desktopprompt.anchor, null, null, g_Structure.toplevel.desktopprompt.anchorpoint); 				
			}
			

			break;
		case GameStateEnum.ARLOADING:

			//m_canvas2dContext.drawImage(g_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
			drawRotatedRectangle(m_canvas2dContext, g_canvas2d.height, g_canvas2d.width, "#000000", (g_canvas2d.width / 2), (g_canvas2d.height / 2), 0, m_LerpedAlpha[0]);
			
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_progressLoading, g_Structure.toplevel.loadingprogress.font, g_Structure.toplevel.loadingprogress.font, g_Structure.toplevel.loadingprogress.fontcolour, g_Structure.toplevel.loadingprogress.fontcolour, g_Structure.toplevel.loadingprogress.lineheight, g_Structure.toplevel.loadingprogress.lineheight, g_Structure.toplevel.loadingprogress.maxwidth, null, g_Structure.toplevel.loadingprogress.x, g_Structure.toplevel.loadingprogress.y, g_Structure.toplevel.loadingprogress.rotation,   g_Structure.toplevel.loadingprogress.alignment, g_Structure.toplevel.loadingprogress.anchor, null, null, g_Structure.toplevel.loadingprogress.anchorpoint);
			//drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_progressLoading, "bold 30px Arial", "bold 20px Arial", "#ffffff", "#ffffff", 100, 100, 800, null, (m_canvas2d.width / 2) , (m_canvas2d.height / 2), 0,  "center", "center", null, null, "CENTRE"); 				
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, m_loadingStatus, g_Structure.toplevel.loadingstatus.font1, g_Structure.toplevel.loadingstatus.font2, g_Structure.toplevel.loadingstatus.colour1, g_Structure.toplevel.loadingstatus.colour2, g_Structure.toplevel.loadingstatus.lineheight1, g_Structure.toplevel.loadingstatus.lineheight2, g_Structure.toplevel.loadingstatus.portraitmaxwidth, g_Structure.toplevel.loadingstatus.landscapemaxwidth, g_Structure.toplevel.loadingstatus.x, g_Structure.toplevel.loadingstatus.y, g_Structure.toplevel.loadingstatus.rotation,   g_Structure.toplevel.loadingstatus.alignment, g_Structure.toplevel.loadingstatus.anchor, null, null, g_Structure.toplevel.loadingstatus.anchorpoint); 				
			
			
			if (g_loadingError)
			{
				drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_loadingErrorMessage, g_Structure.toplevel.errormessage.font, g_Structure.toplevel.errormessage.font, g_Structure.toplevel.errormessage.fontcolour, g_Structure.toplevel.errormessage.fontcolour, g_Structure.toplevel.errormessage.lineheight, g_Structure.toplevel.errormessage.lineheight, g_Structure.toplevel.errormessage.maxwidth, null, g_Structure.toplevel.errormessage.x, g_Structure.toplevel.errormessage.y, g_Structure.toplevel.errormessage.rotation,   g_Structure.toplevel.errormessage.alignment, g_Structure.toplevel.errormessage.anchor, null, null, g_Structure.toplevel.errormessage.anchorpoint);	
/* 				if (g_isCurrentLandscape)
				{
					var points = calculateLandscapePts(g_Structure.arscanner.errormessage.x , g_Structure.arscanner.errormessage.y, g_Structure.arscanner.errormessage.anchorpoint)
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_loadingErrorMessage, g_Structure.arscanner.errormessage.font, g_Structure.arscanner.errormessage.font, g_Structure.arscanner.errormessage.fontcolour, g_Structure.arscanner.errormessage.fontcolour, g_Structure.arscanner.errormessage.lineheight, g_Structure.arscanner.errormessage.lineheight, g_Structure.arscanner.errormessage.maxwidth, points[0] , points[1], g_Structure.arscanner.errormessage.rotation,   g_Structure.arscanner.errormessage.alignment, g_Structure.arscanner.errormessage.anchor, null, null); 	
				}
				else
				{ */
					//drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_loadingErrorMessage, g_Structure.arscanner.errormessage.font, g_Structure.arscanner.errormessage.font, g_Structure.arscanner.errormessage.fontcolour, g_Structure.arscanner.errormessage.fontcolour, g_Structure.arscanner.errormessage.lineheight, g_Structure.arscanner.errormessage.lineheight, g_Structure.arscanner.errormessage.portraitmaxwidth, null, g_Structure.arscanner.errormessage.x , g_Structure.arscanner.errormessage.y, g_Structure.arscanner.errormessage.rotation,  g_Structure.arscanner.errormessage.alignment, g_Structure.arscanner.errormessage.anchor, null, null, g_Structure.arscanner.errormessage.anchorpoint); 	
				//}
	
			}
			break;			
		case GameStateEnum.ARSCAN:
		
			m_canvas2dContext.drawImage(g_arToolkitSource.domElement, m_resizedARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizedARCanvasHeight, 0, 0, g_canvas2d.width, g_canvas2d.height);	
			g_renderer.render( g_scene, g_camera );
			m_canvas2dContext.drawImage(m_canvas3d, m_resizedARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizedARCanvasHeight, 0, 0, g_canvas2d.width, g_canvas2d.height);	
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					switch (m_ActiveClickPoints[i].itemtype.toLowerCase()) {
					 case "help":
						if ((g_ARCube.getCubeState() == CubeStateEnum.ACTIVE) && (g_ARCube.isIntroTextDisplayed() == false))
						{
							if (g_isCurrentLandscape)
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							}
							else
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							}
						}
					case "exit":	
						if (g_ARCube.getCubeState() == CubeStateEnum.ACTIVE)
						{
							if (g_isCurrentLandscape)
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
							}
							else
							{
								drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
							}
						}
						break;
					default:
						if (g_isCurrentLandscape)
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.landscape_posx, m_ActiveClickPoints[i].buttonObject.landscape_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);
						}
						else
						{
							drawRotatedImage(m_canvas2dContext, m_ActiveClickPoints[i].buttonObject.Image, m_ActiveClickPoints[i].buttonObject.portrait_posx, m_ActiveClickPoints[i].buttonObject.portrait_posy ,m_ActiveClickPoints[i].buttonObject.rotation, m_ActiveClickPoints[i].buttonObject.scale, 1.0);						
						}
						break;
					}
				}							
			}
			
 			if ((g_ARCube.getCubeState() == CubeStateEnum.ACTIVE) && (g_ARCube.isIntroTextDisplayed() == false))
			{
				if (g_ARCube.isHelpTextDisplayed())
				{	
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_ARCube.getHelpText(), g_Structure.arscanner.helpcaption.font1, g_Structure.arscanner.helpcaption.font2, g_Structure.arscanner.helpcaption.colour1, g_Structure.arscanner.helpcaption.colour2, g_Structure.arscanner.helpcaption.lineheight1, g_Structure.arscanner.helpcaption.lineheight2, g_Structure.arscanner.helpcaption.portraitmaxwidth, g_Structure.arscanner.helpcaption.landscapemaxwidth, g_Structure.arscanner.helpcaption.x, g_Structure.arscanner.helpcaption.y, g_Structure.arscanner.helpcaption.rotation,   g_Structure.arscanner.helpcaption.alignment, g_Structure.arscanner.helpcaption.anchor, null, null, g_Structure.arscanner.helpcaption.anchorpoint); 		
				}
			}
			
			if (g_ARCube.isIntroTextDisplayed())
			{
					drawPagewithTwoFontsTwoColours(m_canvas2dContext, g_ARCube.getIntroText(), g_Structure.arscanner.introcaption.font1, g_Structure.arscanner.introcaption.font2, g_Structure.arscanner.introcaption.colour1, g_Structure.arscanner.introcaption.colour2, g_Structure.arscanner.introcaption.lineheight1, g_Structure.arscanner.introcaption.lineheight2, g_Structure.arscanner.introcaption.portraitmaxwidth, g_Structure.arscanner.introcaption.landscapemaxwidth, g_Structure.arscanner.introcaption.x, g_Structure.arscanner.introcaption.y, g_Structure.arscanner.introcaption.rotation,   g_Structure.arscanner.introcaption.alignment, g_Structure.arscanner.introcaption.anchor, null, null, g_Structure.arscanner.introcaption.anchorpoint); 	
			}
			
			g_ARCube.drawScreenButtons();
			
			//KEEP THIS AS IT HAS EULER ANGLES STUFF
			
			/* let adjustedcubeeuler = new THREE.Euler().setFromQuaternion(g_ARCube.getAdjustedCubeWorldQuaternion(), 'YXZ', true);
			var textrotation = "phone euler x deg " + THREE.Math.radToDeg(g_ARCube.getSensorEulerXAngle()) + "\nphone Euler y deg " + THREE.Math.radToDeg(g_ARCube.getSensorEulerYAngle()) + "\nTracked " + g_ARCube.getTrackedFace() + "\n\n" + g_ARCube.getTopFaceName() + " x deg " + THREE.Math.radToDeg(g_ARCube.getAdjustedCubeEuler().x) + "\nCube Euler y deg " + THREE.Math.radToDeg(g_ARCube.getAdjustedCubeEuler().y) + "\nCube Euler z deg " + THREE.Math.radToDeg(g_ARCube.getAdjustedCubeEuler().z) + "\n\nAngle deg " + THREE.Math.radToDeg(g_ARCube.getRotationAngle()) + "\n\nAdjusted Cube x deg " + THREE.Math.radToDeg(adjustedcubeeuler.x) + "\nAdjusted Cube y deg " + THREE.Math.radToDeg(adjustedcubeeuler.y) + "\nAdjusted Cube z deg " + THREE.Math.radToDeg(adjustedcubeeuler.z) + "\nForward Face " + g_ARCube.getForwardFaceName() ;
			var textposx = (m_canvas2dContext.canvas.width / 2) + (g_Structure.toplevel.instructions.x - (DEFAULTPORTRAITCANVASWIDTH / 2));
			var textposy = m_canvas2dContext.canvas.height - ((m_canvas2dContext.canvas.height / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - g_Structure.toplevel.instructions.y));
			//drawPagewithTwoFontsTwoColours(m_canvas2dContext, textrotation, g_Structure.toplevel.instructions.font1, g_Structure.toplevel.instructions.font2, "#ff0000", "#ff0000", g_Structure.toplevel.instructions.lineheight1, g_Structure.toplevel.instructions.lineheight2, g_Structure.toplevel.instructions.maxwidth, textposx, textposy, g_Structure.toplevel.instructions.rotation,   g_Structure.toplevel.instructions.alignment, g_Structure.toplevel.instructions.anchor, null, null, g_Structure.toplevel.instructions.anchorpoint); 	
			drawPagewithTwoFontsTwoColours(m_canvas2dContext, textrotation, g_Structure.toplevel.instructions.font1, g_Structure.toplevel.instructions.font2, "#ff0000", "#ff0000", g_Structure.toplevel.instructions.lineheight1, g_Structure.toplevel.instructions.lineheight2, g_Structure.toplevel.instructions.portraitmaxwidth, g_Structure.toplevel.instructions.landscapemaxwidth, g_Structure.toplevel.instructions.x, g_Structure.toplevel.instructions.y, g_Structure.toplevel.instructions.rotation,   g_Structure.toplevel.instructions.alignment, g_Structure.toplevel.instructions.anchor, null, null, g_Structure.toplevel.instructions.anchorpoint); 	
			 */
			break;
		case GameStateEnum.ARUNLOADING:

			m_canvas2dContext.drawImage(g_arToolkitSource.domElement, m_resizedARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizedARCanvasHeight, 0, 0, g_canvas2d.width, g_canvas2d.height);	
			
			for(var i=0;i<m_ActiveClickPoints.length;i++)
			{
				if ((m_ActiveClickPoints[i].buttonObject != null))
				{
					if (g_isCurrentLandscape)
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

		
		}
	}
	
	if (m_stats != null)
	{
		m_stats.end();
	}
	
	m_RenderState = RenderStateEnum.NORENDER;
}



function initPhysics() {

	// Physics configuration

	collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
	dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	broadphase = new Ammo.btDbvtBroadphase();
	solver = new Ammo.btSequentialImpulseConstraintSolver();
	softBodySolver = new Ammo.btDefaultSoftBodySolver();
	g_physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
	g_physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
	g_physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

	//transformAux1 = new Ammo.btTransform();

}

function setupARCamera()
{
	g_arToolkitSource = new ArToolkitSource({
		sourceType : 'webcam',
		sourceWidth: m_cameraPortraitWidth,
		sourceHeight: m_cameraPortraitHeight,
		// resolution displayed for the source 
		displayWidth: m_cameraPortraitWidth,
		displayHeight: m_cameraPortraitHeight,
		append: g_isIOS,
		muted : g_isIOS
	});
	
	
	g_arToolkitSource.init(function onReady(){
		onResize();
	})		
}

function unloadARCamera()
{
		//stop webcam 
	
	let stream = g_arToolkitSource.domElement.srcObject;
	let tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	
	
	if (g_arToolkitContext != null)
	{
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		console.log("remove m_arToolkitContext");
		g_arToolkitContext.removeAllMarkers();
		g_arToolkitContext = null;
	}
	
	if (g_isIOS)
	{
		document.body.removeChild(g_arToolkitSource.domElement);
	}
	g_arToolkitSource.domElement.srcObject = null;
	g_arToolkitSource.domElement = null;

	g_arToolkitSource = null;
}


function loadARContext(){
	// create atToolkitContext
	console.log("add m_arToolkitContext");
	
	// create an atToolkitContext
	ArToolkitContext.baseURL = '../';
	g_arToolkitContext = null;
	g_arToolkitContext = new ArToolkitContext({
		cameraParametersUrl: "data/data/camera_para.dat",
		detectionMode: 'mono',
		maxDetectionRate: g_Structure.arscanner.cameraresolution.maxdetectionrate,
		// The two following settings adjusts the resolution. Higher is better (less flickering) but slower
		canvasWidth: m_cameraPortraitWidth,
		canvasHeight: m_cameraPortraitHeight
	});
	
	g_arToolkitContext.init(() => {
		g_camera.projectionMatrix.copy(g_arToolkitContext.getProjectionMatrix());
	});
			
	if( g_arToolkitSource.ready)
	{
		onResize();
		g_arToolkitContext.update( g_arToolkitSource.domElement );
	}
}

function unloadARContext()
{
	if (g_arToolkitContext != null)
	{
		console.log("remove m_arToolkitContext");
		g_arToolkitContext.removeAllMarkers();
		//m_arToolkitContext.arController.canvas = null;
		//m_arToolkitContext.arController = null;
		g_arToolkitContext = null;
	}

}




function onResize(){

    g_arToolkitSource.onResize()	
	if (m_canvas3d != null)
	{
		g_arToolkitSource.copySizeTo(m_canvas3d)	
	}
	if ( g_arToolkitContext != null)
	{
		if( g_arToolkitContext.arController !== null )
		{
			g_arToolkitSource.copySizeTo(g_arToolkitContext.arController.canvas)	
		}    
	}	
} 






function applyMatrixOfMesh(mesh) { // Apply Matrix so that intersect of raycaster works properly
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();
}



function calculateAnchorPoint(portraitposx, portraitposy, typeofanchor)
{
	
	var portraitCanvasWidth;
	var portraitCanvasHeight;
	var landscapeCanvasWidth;
	var landscapeCanvasHeight;
	var landscapex, landscapey, portraitx, portraity, anchortype, scale;
	
	if (g_isCurrentLandscape)
	{
		portraitCanvasWidth = g_canvas2d.height;
		portraitCanvasHeight = g_canvas2d.width;
		landscapeCanvasHeight = g_canvas2d.height;
		landscapeCanvasWidth = g_canvas2d.width;
		//scale = (portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT);
		var sourceAspect = DEFAULTPORTRAITCANVASHEIGHT / DEFAULTPORTRAITCANVASWIDTH;
		var screenAspect = landscapeCanvasWidth / landscapeCanvasHeight;
	
		if (sourceAspect > screenAspect)
		{
			
			scale = (landscapeCanvasWidth / DEFAULTPORTRAITCANVASHEIGHT);
			console.log("source scale " + scale);
		}
		else
		{
			scale = (landscapeCanvasHeight / DEFAULTPORTRAITCANVASWIDTH);
			console.log("screen scale" + scale);
		}
		if (scale > 2)
		{
			scale = 2;
		}
		else if (scale < 1)
		{
			scale = 1;
		}
	}
	else
	{
		portraitCanvasWidth = g_canvas2d.width;
		portraitCanvasHeight = g_canvas2d.height;
		landscapeCanvasHeight = g_canvas2d.width;
		landscapeCanvasWidth = g_canvas2d.height;
		//scale = (portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT);
		var sourceAspect = DEFAULTPORTRAITCANVASWIDTH / DEFAULTPORTRAITCANVASHEIGHT;
		var screenAspect = portraitCanvasWidth / portraitCanvasHeight;
	
		if (sourceAspect > screenAspect)
		{
			scale = (portraitCanvasWidth / DEFAULTPORTRAITCANVASWIDTH);
		}
		else
		{
			scale = (portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT);
		}
		
	}

	switch (typeofanchor.toUpperCase()) {
		case "TOPLEFT":
			portraitx = portraitposx;
			portraity = portraitposy;
			landscapex = portraitx;
			landscapey = portraity;
			anchortype = AnchorPointEnum.TOPLEFT;
			break;
		case "TOPRIGHT":
			portraitx = portraitposx + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = portraitposy;
			landscapex = portraitposx + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			landscapey = portraitposy;
			anchortype = AnchorPointEnum.TOPRIGHT;
			break;
		case "TOPCENTRE":
			portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
			portraity = portraitposy;
			landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2)); 
			landscapey = portraitposy;
			anchortype = AnchorPointEnum.TOPCENTRE;
			break;
		case "BOTTOMLEFT":
			portraitx = portraitposx;
			portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
			landscapex = portraitposx;
			landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
			anchortype = AnchorPointEnum.BOTTOMLEFT;
			break;
		case "BOTTOMRIGHT":
			portraitx = portraitposx + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = portraitCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
			landscapex = portraitposx + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			landscapey = landscapeCanvasHeight - (DEFAULTPORTRAITCANVASHEIGHT - portraitposy);
			anchortype = AnchorPointEnum.BOTTOMRIGHT;
			break;
		case "BOTTOMCENTRE":
			portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
			portraity = portraitCanvasHeight - ((portraitCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - portraitposy));
			landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
			landscapey = landscapeCanvasHeight - ((landscapeCanvasHeight / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - portraitposy));
			anchortype = AnchorPointEnum.BOTTOMCENTRE;
			break;
		case "CENTRE":
			portraitx = (portraitCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
			portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = (landscapeCanvasWidth / 2) + (portraitposx - (DEFAULTPORTRAITCANVASWIDTH / 2));
			landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			anchortype = AnchorPointEnum.CENTRE;
			break;
		case "CENTRELEFT":
			portraitx = portraitposx;
			portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = portraitposx;
			landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			anchortype = AnchorPointEnum.CENTRELEFT;
			break;
		case "CENTRERIGHT":
			portraitx = portraitposx + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = (portraitCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			landscapex = portraitposx + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			landscapey = (landscapeCanvasHeight / 2) + (portraitposy - (DEFAULTPORTRAITCANVASHEIGHT / 2));
			anchortype = AnchorPointEnum.CENTRERIGHT;			
			break;
	}
	
	return [landscapex, landscapey, portraitx, portraity, anchortype, scale]; 
	
}

function setupButton(buttonimage, portraitposx, portraitposy, radius, scale, rotation, typeofbutton, value, typeofanchor)
{
	
	var points = calculateAnchorPoint(portraitposx, portraitposy, typeofanchor);
	
	var landscapex = points[0];
	var landscapey = points[1];
	var portraitx = points[2];
	var portraity = points[3];

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
	if (g_isCurrentLandscape)
	{
		portraitCanvasWidth = g_canvas2d.height;
		portraitScaledWidth = 360 / g_canvas2d.height 
		portraitCanvasHeight = g_canvas2d.width;
		portraitScaledHeight = 640 / g_canvas2d.width ;
		landscapeCanvasHeight = g_canvas2d.height;
		landscapeCanvasWidth = g_canvas2d.width;
	}
	else
	{
		portraitCanvasWidth = g_canvas2d.width;
		portraitScaledWidth = 360 / g_canvas2d.width;
		portraitCanvasHeight = g_canvas2d.height;
		portraitScaledHeight = 640 / g_canvas2d.height;
		landscapeCanvasHeight = g_canvas2d.width;
		landscapeCanvasWidth = g_canvas2d.height;
	}
	
	
	
	for(var i=0;i<m_ActiveClickPoints.length;i++)
	{
		var landscapex, landscapey, portraitx, portraity;
		
		
		
		switch (m_ActiveClickPoints[i].tapObjectDefault.defaulttypeofanchor) {
		case AnchorPointEnum.TOPLEFT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x;
			portraity = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			landscapex = portraitx;
			landscapey = portraity;
			break;
		case AnchorPointEnum.TOPRIGHT:
			portraitx = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (portraitCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
			portraity = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_y;
			landscapex = m_ActiveClickPoints[i].tapObjectDefault.defaultportrait_x + (landscapeCanvasWidth - DEFAULTPORTRAITCANVASWIDTH);
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


//asset loader

function AssetLoader(assetid, assettype, func, item) {
	this.AssetID = assetid;
	this.AssetType = assettype;
	this.AssetFunctionArray = new Array;
	this.AssetFunctionArray.push(func);
	this.AssetFunctionParameter = new Array;
	this.AssetFunctionParameter.push(item);
	this.Asset = null;
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


function XYZrange(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
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
	var screenAspect = g_canvas2d.width / g_canvas2d.height;
	
	if( screenAspect == sourceAspect )
	{
		m_resizedARCanvasX = 0;
		m_resizedARCanvasY = 0;
		m_resizedARCanvasWidth = sourcewidth;
		m_resizedARCanvasHeight = sourceheight;
		
	}
	else
	{
		//	source width 640 height 480
		if( screenAspect < sourceAspect )
		{
		// compute m_resizedARCanvasWidth and sx
			m_resizedARCanvasWidth = screenAspect * sourceheight; 
			m_resizedARCanvasX = Math.floor((sourcewidth - m_resizedARCanvasWidth) / 2);
			m_resizedARCanvasHeight = sourceheight;
			m_resizedARCanvasY = 0;
		}
		else
		{
			m_resizedARCanvasWidth = sourcewidth; 
			m_resizedARCanvasX = 0;
			m_resizedARCanvasHeight =  sourcewidth / screenAspect;
			m_resizedARCanvasY = Math.floor((sourceheight - m_resizedARCanvasHeight) / 2);
	
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
	
	if (g_isCurrentLandscape)
	{
		portraitCanvasWidth = g_canvas2d.height;
		portraitCanvasHeight = g_canvas2d.width;
		landscapeCanvasHeight = g_canvas2d.height;
		landscapeCanvasWidth = g_canvas2d.width;
	}
	else
	{
		portraitCanvasWidth = g_canvas2d.width;
		portraitCanvasHeight = g_canvas2d.height;
		landscapeCanvasHeight = g_canvas2d.width;
		landscapeCanvasWidth = g_canvas2d.height;
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

function drawRotatedImageWidthHeight(image, x, y, angle, width, height, alpha) { 
 
	// save the current co-ordinate system 
	// before we screw with it
	m_canvas2dContext.beginPath();
	
	m_canvas2dContext.save(); 
	
	m_canvas2dContext.globalAlpha = alpha;
	// move to the middle of where we want to draw our image
	m_canvas2dContext.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	m_canvas2dContext.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	m_canvas2dContext.drawImage(image, -(width / 2), -(height / 2),  width, height);
 
	// and restore the co-ords to how they were when we began
	m_canvas2dContext.restore();
	
	m_canvas2dContext.closePath();
	
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

function drawAutoScaledImage(ctx, image, posx, posy, angle, typeofanchor, alignment, alpha, minscale, maxscale) { 

	var values = calculateAnchorPoint(posx, posy, typeofanchor);
	var landscapex = values[0];
	var landscapey = values[1];
	var portraitx = values[2];
	var portraity = values[3];
	var anchortype = values[4];
	var scale = values[5];	
	if (scale > maxscale)
	{
		scale = maxscale;
	}
	if (scale < minscale)
	{
		scale = minscale;
	}
	switch (alignment.toUpperCase()) {
		case "TOPLEFT":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex + ((image.width * scale)/2);
				landscapey = landscapey + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx + ((image.width * scale)/2);
				portraity = portraity + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
		case "TOPRIGHT":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex - ((image.width * scale)/2);
				landscapey = landscapey + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx - ((image.width * scale)/2);
				portraity = portraity + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
		case "TOPCENTRE":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex;
				landscapey = landscapey + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx;
				portraity = portraity + ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
		case "BOTTOMLEFT":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex + ((image.width * scale)/2);
				landscapey = landscapey - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx + ((image.width * scale)/2);
				portraity = portraity - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
		case "BOTTOMRIGHT":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex - ((image.width * scale)/2);
				landscapey = landscapey - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx - ((image.width * scale)/2);
				portraity = portraity - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
		case "BOTTOMCENTRE":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex;
				landscapey = landscapey - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx;
				portraity = portraity - ((image.height * scale)/2);
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
		case "CENTRE":
			if (g_isCurrentLandscape)
			{
				landscapex = landscapex;
				landscapey = landscapey;
				drawRotatedImage(ctx, image, landscapex, landscapey, angle, scale, 1.0);
			}
			else
			{
				portraitx = portraitx;
				portraity = portraity;
				drawRotatedImage(ctx, image, portraitx, portraity, angle, scale, 1.0);
			}	
			break;
	}

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

/* function drawPagewithTwoFontsTwoColours(ctx, text, font1, font2, colour1, colour2, lineHeight, lineHeight2, maxWidth, posx , posy, rotation,  textalign, textanchor, bckcolour, bckframe)
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
 } */
 
 function drawPagewithTwoFontsTwoColours(ctx, text, font1, font2, colour1, colour2, lineHeight, lineHeight2, portraitWidth, landscapeWidth, posx , posy, rotation,  textalign, textanchor, bckcolour, bckframe, typeofanchor)
{
	m_contextDisclaimerCanvas.height = 1000;
	m_contextDisclaimerCanvas.width = 2400;
    //var x = m_contextDisclaimerCanvas.width / 2;
    //var y = m_contextDisclaimerCanvas.height / 2;
	var x, y;
	if (textalign == "left")
	{	
		//x = m_contextDisclaimerCanvas.width / 2;
		x = 0;
		y = 0;
	}
	if (textalign == "right")
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
	var maxWidth = portraitWidth;

	if ((g_isCurrentLandscape) && (landscapeWidth != null))
	{
		maxWidth = landscapeWidth;
	}
	
	var values = calculateAnchorPoint(posx, posy, typeofanchor);
	var landscapex = values[0];
	var landscapey = values[1];
	var portraitx = values[2];
	var portraity = values[3];
	var anchortype = values[4];
	var scale = values[5];	
	var scaledfont1, scaledfont2, scaledMaxWidth, scaledLineHeight1, scaledLineHeight2;
	//using scale replace font size
	if (scale != 1)
	{
		var font1size = font1.match(/\d/g);
		font1size = parseInt(font1size.join(""));
		var font1sizescaled = Math.round(font1size * scale);
		//scaledfont1 = font1.replace(/\ (\d+)\px/,' ' + font1sizescaled + 'px');
		scaledfont1 = font1.replace(font1size, font1sizescaled);
		
		var font2size = font2.match(/\d/g);
		font2size = parseInt(font2size.join(""));
		var font2sizescaled = Math.round(font2size * scale);
		scaledfont2 = font2.replace(font2size, font2sizescaled);
		//scaledfont2 = font2.replace(/\ (\d+)\px/,' ' + font2sizescaled + 'px');
		//console.log("font1size " + font1size + " scale " + scale + " font1sizescaled " + font1sizescaled + " font1 " + scaledfont1);
		scaledMaxWidth = Math.round(maxWidth * scale);
		scaledLineHeight1 = Math.round(lineHeight * scale);
		scaledLineHeight2 = Math.round(lineHeight2 * scale);
	}
	else
	{
		scaledfont1 = font1;
		scaledfont2 = font2;
		scaledMaxWidth = maxWidth;
		scaledLineHeight1 = lineHeight;
		scaledLineHeight2 = lineHeight2;
	
	}
	var dimensions;
	if (bckcolour != null)
	{	
		var n = text.search('\b');
		if (n != -1)
		{
			var convtext = text.replace('\b', '');
			dimensions = wrapTextAlignwithBackgroundColours(m_contextDisclaimerCanvas, convtext, colour1, colour2, x, y, scaledMaxWidth, scaledLineHeight1, scaledLineHeight2, scaledfont1, scaledfont2, textalign, textanchor, bckcolour, bckframe);
		}
		else
		{
			dimensions = wrapTextAlignwithFontsColours(m_contextDisclaimerCanvas, text, colour1, colour2, x, y, scaledMaxWidth, scaledLineHeight1, scaledLineHeight2, scaledfont1, scaledfont2, textalign, textanchor);
		}
	}
	else
	{
		dimensions = wrapTextAlignwithFontsColours(m_contextDisclaimerCanvas, text, colour1, colour2, x, y, scaledMaxWidth, scaledLineHeight1, scaledLineHeight2, scaledfont1, scaledfont2, textalign, textanchor);
	}
	
	switch (anchortype) {
	case AnchorPointEnum.TOPLEFT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex + ((m_contextDisclaimerCanvas.height / 2) - (scaledMaxWidth ));
			landscapey = landscapey;
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth));
			portraity = portraity;
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	case AnchorPointEnum.TOPRIGHT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex + ((m_contextDisclaimerCanvas.height / 2) - (scaledMaxWidth ));
			landscapey = landscapey;
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth));
			portraity = portraity;
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	case AnchorPointEnum.TOPCENTRE:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex + ((m_contextDisclaimerCanvas.height / 2) - (scaledMaxWidth ));
			landscapey = landscapey;
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth));
			portraity = portraity;
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	case AnchorPointEnum.BOTTOMLEFT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex;
			landscapey = landscapey + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx;
			portraity = portraity + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	case AnchorPointEnum.BOTTOMRIGHT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			landscapey = landscapey + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			portraity = portraity + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	case AnchorPointEnum.BOTTOMCENTRE:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			landscapey = landscapey + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			portraity = portraity + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}
		break;
	case AnchorPointEnum.CENTRE:
		if (g_isCurrentLandscape)
		{
			//landscapex = landscapex + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			landscapex = landscapex;
			//landscapey = landscapey + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			landscapey = landscapey  + (m_contextDisclaimerCanvas.height / 2) - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			//portraitx = portraitx + ( (m_contextDisclaimerCanvas.width / 2) - (scaledMaxWidth / 2));
			portraitx = portraitx;
			//portraity = portraity + (m_contextDisclaimerCanvas.height / 2) - dimensions[1];
			portraity = portraity + (m_contextDisclaimerCanvas.height / 2) - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}
		break;
	case AnchorPointEnum.CENTRELEFT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex;
			landscapey = landscapey - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx;
			portraity = portraity - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}
		break;
	case AnchorPointEnum.CENTRERIGHT:
		if (g_isCurrentLandscape)
		{
			landscapex = landscapex;
			landscapey = landscapey - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, landscapex, landscapey, rotation, 1.0, 1.0);
		}
		else
		{
			portraitx = portraitx;
			portraity = portraity - (dimensions[1] / 2);
			drawRotatedImage(ctx, m_disclaimerCanvas, portraitx, portraity, rotation, 1.0, 1.0);
		}	
		break;
	}
	
	
	//drawRotatedImage(ctx, m_disclaimerCanvas, posx, posy, rotation, 1, 1.0);
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
			//y2 = ((context.height) / 2) ;
			y2 = linespacing;			
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

function get_browser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }


function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
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


/* function disposeSceneMesh (obj) {
	if (obj != null)
	{
		if (obj instanceof THREE.Mesh) {
			if (obj.geometry) {
				obj.geometry.dispose();
			}
			if (obj.material) {
				var materialArray;
				if (obj.material instanceof THREE.MeshFaceMaterial || obj.material instanceof THREE.MultiMaterial) {
					materialArray = obj.material.materials;
				}
				else if(obj.material instanceof Array) {
					materialArray = obj.material;
				}
				if(materialArray) {
					materialArray.forEach(function (mtrl, idx) {
						if (mtrl.map) mtrl.map.dispose();
						if (mtrl.lightMap) mtrl.lightMap.dispose();
						if (mtrl.bumpMap) mtrl.bumpMap.dispose();
						if (mtrl.normalMap) mtrl.normalMap.dispose();
						if (mtrl.specularMap) mtrl.specularMap.dispose();
						if (mtrl.envMap) mtrl.envMap.dispose();
						mtrl.dispose();
					});
				}
				else {
					if (obj.material.map) obj.material.map.dispose();
					if (obj.material.lightMap) obj.material.lightMap.dispose();
					if (obj.material.bumpMap) obj.material.bumpMap.dispose();
					if (obj.material.normalMap) obj.material.normalMap.dispose();
					if (obj.material.specularMap) obj.material.specularMap.dispose();
					if (obj.material.envMap) obj.material.envMap.dispose();
					obj.material.dispose();
				}
			}
		}
	}
} */


/* function  disposeSceneMesh (object) {

	object.traverse(obj => {
		 
		if (obj instanceof THREE.Mesh) {
			  
			if (obj.material) {
				if (Array.isArray(obj.material)) {
					obj.material.forEach(material => {
						material.dispose();
						if(material.map){
							material.map.dispose()
							material.map = null
						}
						if(material.lightMap){
							material.lightMap.dispose()
							material.lightMap = null
						}
						if(material.aoMap){
							material.aoMap.dispose()
							material.aoMap = null
						}
						if(material.emissiveMap){
							material.emissiveMap.dispose()
							material.emissiveMap = null
						}
						if(material.bumpMap){
							material.bumpMap.dispose()
							material.bumpMap = null
						}
						if(material.normalMap){
							material.normalMap.dispose()
							material.normalMap = null
						}
						if(material.displacementMap){
							material.displacementMap.dispose()
							material.displacementMap = null
						}
						if(material.roughnessMap){
							material.roughnessMap.dispose()
							material.roughnessMap = null
						}
						if(material.metalnessMap){
							material.metalnessMap.dispose()
							material.metalnessMap = null
						}
						if(material.alphaMap){
							material.alphaMap.dispose()
							material.alphaMap = null
						}
						if(material.envMaps){
							material.envMaps.dispose()
							material.envMaps = null
						}
						if(material.envMap){
							material.envMap.dispose()
							material.envMap = null
						}
						if(material.specularMap){
							material.specularMap.dispose()
							material.specularMap = null
						}
						if(material.gradientMap){
							material.gradientMap.dispose()
							material.gradientMap = null
						}
					});
				}
				else {
					obj.material.dispose();
					if(obj.material.map){
						obj.material.map.dispose()
						obj.material.map = null
					}
					if(obj.material.lightMap){
						obj.material.lightMap.dispose()
						obj.material.lightMap = null
					}
					if(obj.material.aoMap){
						obj.material.aoMap.dispose()
						obj.material.aoMap = null
					}
					if(obj.material.emissiveMap){
						obj.material.emissiveMap.dispose()
						obj.material.emissiveMap = null
					}
					if(obj.material.bumpMap){
						obj.material.bumpMap.dispose()
						obj.material.bumpMap = null
					}
					if(obj.material.normalMap){
						obj.material.normalMap.dispose()
						obj.material.normalMap = null
					}
					if(obj.material.displacementMap){
						obj.material.displacementMap.dispose()
						obj.material.displacementMap = null
					}
					if(obj.material.roughnessMap){
						obj.material.roughnessMap.dispose()
						obj.material.roughnessMap = null
					}
					if(obj.material.metalnessMap){
						obj.material.metalnessMap.dispose()
						obj.material.metalnessMap = null
					}
					if(obj.material.alphaMap){
						obj.material.alphaMap.dispose()
						obj.material.alphaMap = null
					}
					if(obj.material.envMaps){
						obj.material.envMaps.dispose()
						obj.material.envMaps = null
					}
					if(obj.material.envMap){
						obj.material.envMap.dispose()
						obj.material.envMap = null
					}
					if(obj.material.specularMap){
						obj.material.specularMap.dispose()
						obj.material.specularMap = null
					}
					if(obj.material.gradientMap){
						obj.material.gradientMap.dispose()
						obj.material.gradientMap = null
					}
				}
			}  

			if(obj.geometry){
				obj.geometry.dispose()
			}
			if(obj.texture){
				obj.texture.dispose()
				obj.texture = {}
			}
			if(obj.bufferGeometry){
				obj.bufferGeometry.dispose()
			}

		}
	 })

}	 */

function disposeObjectMesh (obj)
{
	if (obj !== null)
	{

		if (obj.children != null)
		{
			for (var i = 0; i < obj.children.length; i++)
			{
				disposeObjectMesh(obj.children[i]);
			}
		}
		if (obj.geometry)
		{
			obj.geometry.dispose();
			obj.geometry = undefined;
		}
		if (obj.BufferGeometry)
		{
			obj.BufferGeometry.dispose();
			obj.BufferGeometry = undefined;

		}			
		
		if (obj.material)
		{
			if ( Array.isArray( obj.material ) ) {

				for ( var m = 0; m < obj.material.length; m ++ ) {
					console.log("(obj.material[m]) type " + (obj.material[m]).type);
					if ((obj.material[m]).map)
					{
						(obj.material[m]).map.dispose();
						(obj.material[m]).map = undefined;
					}
					if ((obj.material[m]).lightMap)
					{
						(obj.material[m]).lightMap.dispose();
						(obj.material[m]).lightMap = undefined;
					}
					if ((obj.material[m]).bumpMap)
					{
						(obj.material[m]).bumpMap.dispose();
						(obj.material[m]).bumpMap = undefined;
					}
					if ((obj.material[m]).normalMap)
					{
						(obj.material[m]).normalMap.dispose();
						(obj.material[m]).normalMap = undefined;
					}
					if ((obj.material[m]).specularMap)
					{
						(obj.material[m]).specularMap.dispose();
						(obj.material[m]).specularMap = undefined;
					}
					if ((obj.material[m]).envMap)
					{
						(obj.material[m]).envMap.dispose();
						(obj.material[m]).envMap = undefined;
					}
					
					if ((obj.material[m]).alphaMap)
					{
						(obj.material[m]).alphaMap.dispose();
						(obj.material[m]).alphaMap = undefined;
					}
					if ((obj.material[m]).aoMap)
						{
						(obj.material[m]).aoMap.dispose();
						(obj.material[m]).aoMap = undefined;
					}
					if ((obj.material[m]).displacementMap)
					{
						(obj.material[m]).displacementMap.dispose();
						(obj.material[m]).displacementMap = undefined;
					}
					if ((obj.material[m]).emissiveMap)
					{
						(obj.material[m]).emissiveMap.dispose();
						(obj.material[m]).emissiveMap = undefined;
					}
					if ((obj.material[m]).gradientMap)
					{
						(obj.material[m]).gradientMap.dispose();
						(obj.material[m]).gradientMap = undefined;
					}
					if ((obj.material[m]).metalnessMap)
					{
						(obj.material[m]).metalnessMap.dispose();
						(obj.material[m]).metalnessMap = undefined;
					}
					if ((obj.material[m]).roughnessMap)
					{
						(obj.material[m]).roughnessMap.dispose();
						(obj.material[m]).roughnessMap = undefined;
					}
					if ((obj.material[m]).clearcoatMap)
					{
						(obj.material[m]).clearcoatMap.dispose();
						(obj.material[m]).clearcoatMap = undefined;
					}
					if ((obj.material[m]).clearcoatNormalMap)
					{
						(obj.material[m]).clearcoatNormalMap.dispose();
						(obj.material[m]).clearcoatNormalMap = undefined;
					}
					if ((obj.material[m]).clearcoatRoughnessMap)
					{
						(obj.material[m]).clearcoatRoughnessMap.dispose();
						(obj.material[m]).clearcoatRoughnessMap = undefined;
					}
					(obj.material[m]).dispose();
					(obj.material[m]) = undefined;
				}
			} else {
				
				if (obj.material.map)
				{
					console.log("dispose material map type " + obj.material.type);
					obj.material.map.dispose();
					obj.material.map = undefined;
				}
				if (obj.material.lightMap)
				{
					console.log("dispose material lightmap type " + obj.material.type);
					obj.material.lightMap.dispose();
					obj.material.lightMap = undefined;
				}
				if (obj.material.bumpMap)
				{
					console.log("dispose material bumpmap type " + obj.material.type);
					obj.material.bumpMap.dispose();
					obj.material.bumpMap = undefined;
				}
				if (obj.material.normalMap)
				{
					console.log("dispose material normalmap type " + obj.material.type);
					obj.material.normalMap.dispose();
					obj.material.normalMap = undefined;
				}
				if (obj.material.specularMap)
				{
					console.log("dispose material specularmap type " + obj.material.type);
					obj.material.specularMap.dispose();
					obj.material.specularMap = undefined;
				}
				if (obj.material.envMap)
				{
					console.log("dispose material envmap type " + obj.material.type);
					obj.material.envMap.dispose();
					obj.material.envMap = undefined;
				}
				if (obj.material.alphaMap)
				{
					console.log("dispose material alphamap type " + obj.material.type);
					obj.material.alphaMap.dispose();
					obj.material.alphaMap = undefined;
				}
				if (obj.material.aoMap)
				{
					console.log("dispose material aomap type " + obj.material.type);
					obj.material.aoMap.dispose();
					obj.material.aoMap = undefined;
				}
				if (obj.material.displacementMap)
				{
					console.log("dispose material displacemnt map type " + obj.material.type);
					obj.material.displacementMap.dispose();
					obj.material.displacementMap = undefined;
				}
				if (obj.material.emissiveMap)
				{
					console.log("dispose material emmisvemap type " + obj.material.type);
					obj.material.emissiveMap.dispose();
					obj.material.emissiveMap = undefined;
				}
				if (obj.material.gradientMap)
				{
					console.log("dispose material gradientmap type " + obj.material.type);
					obj.material.gradientMap.dispose();
					obj.material.gradientMap = undefined;
				}
				if (obj.material.metalnessMap)
				{
					console.log("dispose material metalmap type " + obj.material.type);
					obj.material.metalnessMap.dispose();
					obj.material.metalnessMap = undefined;
				}
				if (obj.material.roughnessMap)
				{
					console.log("dispose material roughmap type " + obj.material.type);
					obj.material.roughnessMap.dispose();
					obj.material.roughnessMap = undefined;
				}
				if (obj.material.clearcoatMap)
				{
					obj.material.clearcoatMap.dispose();
					obj.material.clearcoatMap = undefined;
				}
				if (obj.material.clearcoatNormalMap)
				{
					obj.material.clearcoatNormalMap.dispose();
					obj.material.clearcoatNormalMap = undefined;
				}
				if (obj.material.clearcoatRoughnessMap)
				{
					obj.material.clearcoatRoughnessMap.dispose();
					obj.material.clearcoatRoughnessMap = undefined;
				}
				console.log("dispose material type " + obj.material.type);
				obj.material.dispose();
				obj.material = undefined;
			}
			
		}
	}
	obj = undefined;
}; 

/* function disposeObjectMesh (obj)
{
	if (obj.scene != undefined)
	{
		console.log("should be gltf");
		disposeHierarchy (obj.scene, disposeNode);
	}
	else
	{
		console.log("should be fbx");
		disposeHierarchy (obj, disposeNode);
	}

	function disposeNode (node)
	{
		if (node instanceof THREE.Mesh)
		{
			if (node.geometry)
			{
				console.log("dispose geometry");
				node.geometry.dispose ();
			}

			if (node.material)
			{
				if (node.material instanceof THREE.MeshFaceMaterial)
				{
					console.log("dispose node.facematerials");
					$.each (node.material.materials, function (idx, mtrl)
					{
						if (mtrl.map)               mtrl.map.dispose();
						if (mtrl.lightMap)          mtrl.lightMap.dispose();
						if (mtrl.bumpMap)           mtrl.bumpMap.dispose();
						if (mtrl.normalMap)         mtrl.normalMap.dispose();
						if (mtrl.specularMap)       mtrl.specularMap.dispose();
						if (mtrl.envMap)            mtrl.envMap.dispose();
						if (mtrl.alphaMap)          mtrl.alphaMap.dispose();
						if (mtrl.aoMap)             mtrl.aoMap.dispose();
						if (mtrl.displacementMap)   mtrl.displacementMap.dispose();
						if (mtrl.emissiveMap)       mtrl.emissiveMap.dispose();
						if (mtrl.gradientMap)       mtrl.gradientMap.dispose();
						if (mtrl.metalnessMap)      mtrl.metalnessMap.dispose();
						if (mtrl.roughnessMap)      mtrl.roughnessMap.dispose();

						mtrl.dispose ();    // disposes any programs associated with the material
					});
				}
				else
				{
					console.log("dispose node.materials");
					if (node.material.map) 
					{
						if (typeof (node.material.map.dispose) === "function")
						{
							console.log("dispose node.material.map object " + node.material.map.image);
							node.material.map.dispose();
						}
						else
						{
							
							console.log("dispose node.material.map2 " + typeof node.material.map);
							console.log("dispose node.material.map2 object " + node.material.map.image);
						}
					}
					if (node.material.lightMap)
					{
						node.material.lightMap.dispose();
					}
					if (node.material.bumpMap)          node.material.bumpMap.dispose();
					if (node.material.normalMap)        node.material.normalMap.dispose();
					if (node.material.specularMap)      node.material.specularMap.dispose();
					if (node.material.envMap)           node.material.envMap.dispose();
					if (node.material.alphaMap)         node.material.alphaMap.dispose();
					if (node.material.aoMap)            node.material.aoMap.dispose();
					if (node.material.displacementMap)  node.material.displacementMap.dispose();
					if (node.material.emissiveMap)      node.material.emissiveMap.dispose();
					if (node.material.gradientMap)      node.material.gradientMap.dispose();
					if (node.material.metalnessMap)     node.material.metalnessMap.dispose();
					if (node.material.roughnessMap)     node.material.roughnessMap.dispose();
					
					if (typeof (node.material.dispose) === "function")
					{
						console.log("dispose node.material function " + typeof node.material);
						node.material.dispose ();   // disposes any programs associated with the material
					}
				}
			}
		}
		else
		{
			if (node.Textures)
			{
				console.log("node textures " + typeof node);
			}
			else
			{
				console.log("node not textures " + typeof node);
			}				
		}
	}   // disposeNode

	function disposeHierarchy (node, callback)
	{
		if (node.children != undefined)
		{
			for (var i = node.children.length - 1; i >= 0; i--)
			{
				var child = node.children[i];
				disposeHierarchy (child, callback);
				callback (child);
			}
		}
		
	}

} */


function applyMatrixOfMesh(mesh) { // Apply Matrix so that intersect of raycaster works properly
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);

    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();
}



function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


function roundDecimalPlaces(num, decimals)
{
	let places = Math.pow(10, decimals)
	return (Math.round((num + Number.EPSILON) * places) / places);
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

function isMobile() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
 ){
    return true;
  }
 else {
    return false;
  }
}	


function collisionDetection(touchx, touchy)
{
	var collisionDetected = false;
	for (var i = 0; i < m_ActiveClickPoints.length; i++) {
		var dx, dy;
		if (g_isCurrentLandscape)
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
			collisionDetected = true;
			break;
		}

	}
	if ((!collisionDetected) && (m_GameState == GameStateEnum.ARSCAN) && (g_ARCube != null))
	{
		var touch2dposition = new THREE.Vector2(touchx, touchy);
		collisionDetected = g_ARCube.screenButtonCollisionDetection(touch2dposition, ButtonStateEnum.FIRSTTOUCHED);
	}
	if ((!collisionDetected) && (m_GameState == GameStateEnum.ARSCAN) && (g_ARCube != null))
	{
		var touchposition = new THREE.Vector2();
		//m_canvas2dContext.drawImage(g_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, m_canvas2d.height);	
		touchposition.x = ((m_resizedARCanvasX + (touchx * (m_resizedARCanvasWidth / g_canvas2d.width))) / m_canvas3d.width) * 2 - 1;
		touchposition.y = - ((m_resizedARCanvasY + (touchy * (m_resizedARCanvasHeight / g_canvas2d.height))) / m_canvas3d.height) * 2 + 1;
		g_ARCube.touchEvent(touchposition);
	}
					
}


function ongoingDetection(touchx, touchy)
{
	var collisionDetected = false;
	for (var i = 0; i < m_ActiveClickPoints.length; i++) {
		var dx, dy;
		if (g_isCurrentLandscape)
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
			collisionDetected = true;
			break;
		}

	}
	if ((!collisionDetected) && (m_GameState == GameStateEnum.ARSCAN) && (g_ARCube != null))
	{
		var touch2dposition = new THREE.Vector2(touchx, touchy);
		collisionDetected = g_ARCube.screenButtonCollisionDetection(touch2dposition, ButtonStateEnum.TOUCHCONTINUE);
	}
	if ((!collisionDetected) && (m_GameState == GameStateEnum.ARSCAN) && (g_ARCube != null))
	{
		var touch3dposition = new THREE.Vector2();
		//m_canvas2dContext.drawImage(g_arToolkitSource.domElement, m_resizeARCanvasX, m_resizedARCanvasY, m_resizedARCanvasWidth, m_resizeARCanvasHeight, 0, 0, m_canvas2d.width, g_canvas2d.height);	
		touch3dposition.x = ((m_resizedARCanvasX + (touchx * (m_resizedARCanvasWidth / g_canvas2d.width))) / m_canvas3d.width) * 2 - 1;
		touch3dposition.y = - ((m_resizedARCanvasY + (touchy * (m_resizedARCanvasHeight / g_canvas2d.height))) / m_canvas3d.height) * 2 + 1;
		g_ARCube.touchEventMove(touch3dposition);
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




function resizeCanvas() {
 
	
	if (g_canvas2d != null)
	{
		
		
		
		g_canvas2d.width = window.innerWidth;
		g_canvas2d.height = window.innerHeight;
		
		document.getElementById("loader").style.left = window.innerWidth / 2;
		document.getElementById("loader").style.top = window.innerHeight / 2;
	
		m_canvasWidth = g_canvas2d.width;
		m_canvasHeight = g_canvas2d.height;
		
		
	
		if (g_isIOS)
		{
			console.log("resize event width " + g_canvas2d.width + " height " + g_canvas2d.height + " angle " + window.orientation);
			if (window.orientation == -90)
			{
				m_currentScreenAngle = 270;
			}
			else
			{
				m_currentScreenAngle = window.orientation; 
			}
		}
		else
		{
			console.log("resize event width " + g_canvas2d.width + " height " + g_canvas2d.height + " angle " + screen.orientation.angle);
			m_currentScreenAngle = screen.orientation.angle;
		}
		
		if (g_canvas2d.width > g_canvas2d.height)
		{
			g_isCurrentLandscape = true;
			
			resizeARCanvas(m_cameraPortraitWidth, m_cameraPortraitHeight)

			if ((m_canvas3d != null) && (g_renderer != null))
			{
				//console.log("g_arToolkitSource.domElement.videoWidth " + g_arToolkitSource.domElement.videoWidth);
				//console.log("g_arToolkitSource.domElement.videoHeight " + g_arToolkitSource.domElement.videoHeight);
				m_canvas3d.width = m_cameraPortraitWidth;
				m_canvas3d.height = m_cameraPortraitHeight;
				g_camera.aspect = m_canvas3d.width / m_canvas3d.height;
				g_camera.updateProjectionMatrix();
				g_renderer.setSize( m_cameraPortraitWidth, m_cameraPortraitHeight );

			}
		}
		else
		{
				g_isCurrentLandscape = false;
				resizeARCanvas(m_cameraPortraitHeight, m_cameraPortraitWidth)

				if ((m_canvas3d != null) && (g_renderer != null))
				{

					if (g_arToolkitSource != null)
					{
						g_arToolkitSource.onResize()	
						g_arToolkitSource.copySizeTo(g_renderer.domElement)	
						if( g_arToolkitContext.arController !== null ){
							g_arToolkitSource.copySizeTo(g_arToolkitContext.arController.canvas)	
						}
					}
					
					//console.log("g_arToolkitSource.domElement.videoWidth " + g_arToolkitSource.domElement.videoWidth);
					//console.log("g_arToolkitSource.domElement.videoHeight " + g_arToolkitSource.domElement.videoHeight);
					m_canvas3d.width = m_cameraPortraitHeight;
					m_canvas3d.height = m_cameraPortraitWidth;
					g_camera.aspect = m_canvas3d.width / m_canvas3d.height;
					g_camera.updateProjectionMatrix();
					g_renderer.setSize( m_cameraPortraitHeight, m_cameraPortraitWidth );
				}

		}
		if (!screenfull.isFullscreen)
		{
			resizeButtons();
		}
				
		
	}
	
	if ((g_ARCube != null) && (m_GameState != GameStateEnum.ARUNLOADING))
	{
		g_ARCube.resizeScreenButtons();
	}	
	
	m_RenderState = RenderStateEnum.RENDERALL
   
}

function nearestPowerOf2(n) {
  return 1 << 31 - Math.clz32(n);
}

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

//audio - microphone recording

function getAzureAuthorizationToken()
{
	if (authorizationEndpoint) {
		var tokenrequest = new XMLHttpRequest();
		tokenrequest.open("GET", authorizationEndpoint);
		tokenrequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		tokenrequest.send("");
		tokenrequest.onload = function() {
			var token = JSON.parse(atob(this.responseText.split(".")[1]));
			g_serviceRegion = token.region;
			g_authorizationToken = this.responseText;
			console.log("authorizationToken " + this.responseText);
			if (g_azureVoiceNames.length == 0)
			{
				getAzureVoiceNames();
			}
		}
	}
}

function getAzureVoiceNames()
{
	var request = new XMLHttpRequest();
	request.open('GET',
			'https://' + g_serviceRegion + ".tts.speech." +
			(g_serviceRegion.startsWith("china") ? "azure.cn" : "microsoft.com") +
					"/cognitiveservices/voices/list", true);
	request.setRequestHeader("Authorization", "Bearer " + g_authorizationToken);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			const response = this.response;
			const data = JSON.parse(response);
			data.forEach((voice, index) => {
				g_azureVoiceNames.push(voice.Name);	
			});
		} else {
			console.log("cannot get voice list, code: " + this.status);
		}
	};

	request.send()
}
      


// video events

function videoPlay()
{
	m_VideoCurrentStatus = MediaPlayStateEnum.PLAYING;
	
	
}

function videoPause()
{
	m_VideoCurrentStatus = MediaPlayStateEnum.PAUSED;
	
}

function videoEnded()
{
	m_VideoCurrentStatus = MediaPlayStateEnum.NOTPLAYING;
	
	
}


function addError(text) {
	console.log("addError.text = " + text);

}

function unloadEvent(evt) {


	m_genericRelSensor.stop();
	unloadARContext();
	unloadARCamera();
	m_genericRelSensor = null;
	if (g_ARCube != null)
	{
		g_ARCube.dispose();
		g_ARCube = null;
	}

	
	//remove three.js stuff
	if (g_scene != null)
	{
		g_scene.remove(g_camera);
		g_camera = null;
		g_scene.dispose();
		g_scene = null;
	}
	console.log( "after", g_renderer.info.memory );
		
	if (g_renderer != null)
	{
		g_renderer.renderLists.dispose();
		g_renderer.dispose();
		g_renderer.forceContextLoss(); 
		g_renderer.context=undefined;
		g_renderer.domElement=undefined;
		g_renderer = null;
		THREE.Cache.clear(); 
	}
	//canvases
	m_canvas3d = null;
	g_loadingManager = null;

	g_Content = null;
	g_Structure = null;
	
}


//touch events

function handleStart(evt) {


	m_currentTouchState = TouchStateEnum.START;
	var touches = evt.changedTouches;
	var offset = findPos(g_canvas2d);
	//m_PreviousInteractionTime = Date.now();
	//m_previousDeltaRotation = 0;
	if (touches === undefined)
	{
		console.log("evt.x " + evt.x + " evt.y " + evt.y);
		if (evt.x - offset.x > 0 && evt.x - offset.x < parseFloat(g_canvas2d.width) && evt.y - offset.y > 0 && evt.y - offset.y < parseFloat(g_canvas2d.height)) {
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
			if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(g_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(g_canvas2d.height)) {
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
	m_currentTouchState = TouchStateEnum.MOVE;
	var touches = evt.changedTouches;
	var offset = findPos(g_canvas2d);
	/* m_PreviousInteractionTime = Date.now(); */
	for (var i = 0; i < touches.length; i++) {
		if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(g_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(g_canvas2d.height)) {
			evt.preventDefault();
			var idx = ongoingTouchIndexById(touches[i].identifier);
			if (m_enableTouchClick)
			{
				console.log("handleMove");
				ongoingDetection(touches[i].clientX - offset.x,touches[i].clientY - offset.y);

			}
			if (idx >= 0) {

				ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
				
			}
		}
	}
}


function handleEnd(evt) {

	m_currentTouchState = TouchStateEnum.END;
	//need to put fullscreen toggle here to work
	//if ((m_enableFullScreenToggle) && (m_screenTogglePending))
	for (var i = 0; i < m_toggleStatePending.length; i++) {
		switch (m_toggleStatePending[i]) {
		case ToggleStateEnum.FULLSCREENSTATE:
			if (!screenfull.isFullscreen)
				//screenfull.toggle(document.getElementById('container'));
				screenfull.request(document.getElementById('container'));
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
				
				case MediaPlayStateEnum.PLAYING:
					m_pausedByUser = true;
					m_windowedVideoPlayer.pause();
					break;
				case MediaPlayStateEnum.PAUSED:
					m_windowedVideoPlayer.play();
					break;
				case MediaPlayStateEnum.NOTPLAYING:
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
				console.log("touch " + g_renderer.domElement);
				m_controls.update();
				var container = document.getElementById("container");
				container.appendChild(m_canvasVR);
				m_vrDisplay.requestPresent([{source: g_renderer.domElement}]);
				if (g_canvas2d != null)
				{
					console.log("im deleting canvas2d");
					var container = document.getElementById("container");
					g_canvas2d.removeEventListener("touchstart", handleStart, false);
					g_canvas2d.removeEventListener("touchend", handleEnd, false);
					g_canvas2d.removeEventListener("touchcancel", handleCancel, false);
					g_canvas2d.removeEventListener("touchleave", handleEnd, false);
					g_canvas2d.removeEventListener("touchmove", handleMove, false);	
					console.log("remove g_canvas2d");
					container.removeChild(g_canvas2d);
					g_canvas2d = null;
					m_canvas2dContext = null;
				}
				resizeCanvas();
								
				window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
				window.addEventListener('vrdisplayconnect', onVRDisplayConnect);
				m_GameState = GameStateEnum.VR;
				
			}
			break;
		case ToggleStateEnum.MOTION:
			if (m_IOSVersion == IOSVersionEnum.IOS13PLUS)
			{	
				DeviceMotionEvent.requestPermission()
				.then(response => {
					if (response == 'granted') {
						console.log("Motion Granted");
						window.addEventListener('devicemotion', (e) => {
						// do something with e
						})
					}
				})
				.catch(console.error)
				
				DeviceOrientationEvent.requestPermission()
				.then(response => {
					if (response == 'granted') {
						console.log("Orientation Granted");
						window.addEventListener('deviceorientation', (e) => {
						// do something with e
						})
					}
				})
				.catch(console.error)
			}

			break; 
		case ToggleStateEnum.SPEECH:
			//responsiveVoice.speak(' ');	
			//responsiveVoice.speak();
			
			break;

		}
	}
	m_toggleStatePending.length = 0;
	m_toggleStatePending[0] = ToggleStateEnum.NONE;

	if (g_canvas2d != null)
	{
		var touches = evt.changedTouches;
		var offset = findPos(g_canvas2d);
		if (touches === undefined)
		{
			evt.preventDefault();
		}
		else
		{
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(g_canvas2d.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(g_canvas2d.height)) {
					evt.preventDefault();
					var idx = ongoingTouchIndexById(touches[i].identifier);

					if ((m_GameState == GameStateEnum.ARSCAN) && (g_ARCube != null))
					{
						g_ARCube.touchEventEnd();
						g_ARCube.screenButtonCollisionDetection(null, ButtonStateEnum.NOTTOUCHED);

					}
					
					if (idx >= 0) {
					//m_rotationStarted = false;
					//m_move360Started = false;
						//manualControl = false;

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
	m_currentTouchState = TouchStateEnum.END;
	//console.log("touchcancel.");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		//m_rotationStarted = false;
		//m_move360Started = false;
		//manualControl = false;
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


