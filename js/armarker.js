var MarkerStateEnum = {
  IDLE: 0,
  READY: 1,
  LISTEN: 2,
  TALK: 3,
  FULLFILMENT: 4,
  CHEER: 5
};

var ARAvatarMarkerType = {
	SELECTION: 0,
	MAIN: 1
};


ArMarker = function(manager, scene, artoolkitcontext, marker, textureindex, avatartype){
	var _this = this
	
	this.prop = null;
	this.currentAnimation = null;
	this.marker = marker;
	this.manager = manager;
	this.avatarType = avatartype;
	
	this.apiClient = null;
	this.recognition = null;
	this.recognizedText = null;	
	this.timer = null;
	this.recognizing = false;
	
	this.storedVisibleState = false;
	this.storedPosX = 0;
	this.storedPosY = 0;
	this.storedPosZ = 0;
	this.storedCounter = 0;
	
	this.subtitleLines = new Array;
	this.subtitleFontColours = new Array;
	
	this.playerSubtitleColour = this.marker.subtitlecolour;
	
	this.idleAction = [];
	this.talkAction = [];
	this.cheerAction = [];
	this.idleAction.length = 1;
	this.talkAction.length = 1;
	this.cheerAction.length = 1;
	this.fullfilmentActions = null;
	this.idleWeight = null;
	this.talkWeight = null;
	this.cheerWeight = null;
	this.fullfilmentWeight = null;
	this.actions = [[],[]];
	this.setWeight = function( action, weight ) {

					action.enabled = true;
					action.setEffectiveTimeScale( 1 );
					action.setEffectiveWeight( weight );

	};

	
	this.singleStepMode = false;
	
	this.shadowARPlane = null;
	this.isPlayer = false;
	//this.playerRaycaster = null;
	
		// build markerControls
	this.markerRoot = new THREE.Group;
	this.markerRoot.name = _this.marker.name;
	this.scene = scene;
	this.scene.add(this.markerRoot)
	this.markerconfidence = 0.6;
	
	if (_this.marker.hasOwnProperty('markerconfidence'))
	{
		_this.markerconfidence = _this.marker.markerconfidence;
	}
	
	this.markerControls = new THREEx.ArMarkerControls(artoolkitcontext, this.markerRoot, {
				type : 'pattern',
				//patternUrl : THREEx.ArToolkitContext.baseURL + "../data/data/" + _this.marker.pattern,
				patternUrl : THREEx.ArToolkitContext.baseURL + "../campress/data/data/" + _this.marker.pattern,
				minConfidence : _this.markerconfidence
			});
	
	
	/* if (_this.marker.markertype.toLowerCase() == "player")
	{
		console.log("add raycaster");
		this.playerRaycaster = new THREE.Raycaster();
		
	} */
	
	console.log("Constructor of ArMarker name = " + this.markerRoot.name );
	
	this.currentModel = 0;
	this.meshes = [];
	this.mixers = [];
	this.clocks = [];
	this.clips = [];
	this.IDs = [];
	this.meshes.length = 1;
	this.mixers.length = 1;
	this.clocks.length = 1;
	this.IDs.length = 1;
	
	this.idletakes = [];
	this.talktakes = [];
	this.idletakes.length = 1;
	this.talktakes.length = 1;
	
	

	if (_this.marker.hasOwnProperty('model'))
	{
		var loader1 = new THREE.FBXLoader(manager);
		loader1.load( 'assets/models/' + _this.marker.model, function ( object ) {
			
			_this.meshes[0] = object;
			var mixer = new THREE.AnimationMixer( object );
			_this.mixers[0] = mixer;
			var clips = object.animations;
			var clock = new THREE.Clock();
			_this.clocks[0] = clock;
			_this.currentState = MarkerStateEnum.IDLE;
			_this.currentAnimation = "idle";
			switch (_this.avatarType) {
			case ARAvatarMarkerType.MAIN:
				
				var idleclip = THREE.AnimationClip.findByName( clips, _this.marker.idletake );
				var talkclip = THREE.AnimationClip.findByName( clips, _this.marker.talktake );
				
				_this.idleAction[0] = _this.mixers[0].clipAction( idleclip );
				_this.talkAction[0] = _this.mixers[0].clipAction( talkclip );
				
				_this.actions[0] = [ _this.idleAction[0], _this.talkAction[0] ];
				
 				
				
				_this.setWeight( _this.idleAction[0], 1.0 );
				_this.setWeight( _this.talkAction[0], 0.0 );

				
				(_this.actions[0]).forEach( function ( action ) {
					
					action.play();

				} ); 
				break;
			case ARAvatarMarkerType.SELECTION:
				var idleclip = THREE.AnimationClip.findByName( clips, _this.marker.idletake );
				var cheerclip = THREE.AnimationClip.findByName( clips, _this.marker.cheertake );
				
				_this.idleAction[0] = _this.mixers[0].clipAction( idleclip );
				_this.cheerAction[0] = _this.mixers[0].clipAction( cheerclip );
				
				_this.actions[0] = [ _this.idleAction[0], _this.cheerAction[0] ];
				
 				
				
				_this.setWeight( _this.idleAction[0], 1.0 );
				_this.setWeight( _this.cheerAction[0], 0.0 );


				(_this.actions[0]).forEach( function ( action ) {

					action.play();

				} ); 
				break;
			}
			

			object.traverse( function ( child ) {
			
				if ( child.isMesh ) {

					child.castShadow = true;
					child.receiveShadow = true;

				}

			} );

			_this.markerRoot.add( object ); 
			
			if ((textureindex != 0) && (textureindex < _this.marker.textures.length))
			{
				console.log(" replace texture = " + 'assets/textures/' + _this.marker.textures[textureindex].texture.filename);
				onReplaceTexture(0, 'assets/textures/' + _this.marker.textures[textureindex].texture.filename);
			}
		

		});
	}
	
	if (_this.marker.hasOwnProperty('prop'))
	{
		var loader1 = new THREE.FBXLoader(manager);
		loader1.load( 'assets/models/' + _this.marker.prop, function ( object ) {
			_this.prop = object;

			object.traverse( function ( child ) {

				if ( child.isMesh ) {

					child.castShadow = true;
					child.receiveShadow = true;

				}

			} );

			_this.markerRoot.add( object ); 
		});
	}
	
	if (_this.marker.hasOwnProperty('shadowplanesize'))
	{
		var planeGeometry = new THREE.PlaneBufferGeometry( _this.marker.shadowplanesize, _this.marker.shadowplanesize );
		planeGeometry.rotateX( - Math.PI / 2 );
		var shadowopacity = 0.2;
		if (_this.marker.hasOwnProperty('shadowplaneopacity'))
		{
			shadowopacity = _this.marker.shadowplaneopacity;
		}
		var planeMaterial = new THREE.ShadowMaterial( { opacity: shadowopacity } );
		_this.shadowARPlane = new THREE.Mesh( planeGeometry, planeMaterial );
		_this.shadowARPlane.receiveShadow = true;
		_this.markerRoot.add( _this.shadowARPlane );
	}
	
 	//check if maker needs dialog flow set if not then player
	if ((_this.marker.hasOwnProperty('APIAItoken')) && (_this.marker.hasOwnProperty('voice')))
	//if (( _this.parametersAPIAItoken != null) && ( _this.parameters.voice != null))
	{
			console.log("_this.marker.APIAItoken " + _this.marker.APIAItoken);
		
			this.apiClient = new ApiAi.ApiAiClient({accessToken: _this.marker.APIAItoken});
		
		
			console.log("this.apiClient " + this.apiClient);
			//voice stuff

			this.recognition = new webkitSpeechRecognition();
			
			this.recognition.continuous = false;
			this.recognition.onstart = function() {
				_this.recognizing = true;
				_this.recognizedText = null;
			};
			this.recognition.onresult = function(ev) {
				_this.recognizedText = ev["results"][0][0]["transcript"];

 				_this.addUserItem(_this.recognizedText);
				_this.recognizing = false;

				let promise = _this.apiClient.textRequest(_this.recognizedText);

				promise
				.then(handleResponse)
				.catch(handleError);

				function handleResponse(serverResponse) {
					window.clearTimeout(_this.timer);
					// Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
					_this.timer = window.setTimeout(function() { _this.startListening(); }, 5000);

					const speech = serverResponse["result"]["fulfillment"]["speech"];
	  
					var msg = new SpeechSynthesisUtterance(speech);
	  
					_this.addBotItem(speech);
 
				}
				function handleError(serverError) {
					console.log("Error from api.ai server: ", serverError);
				} 
			};
   
			this.recognition.onerror = function(ev) {
				console.log("Speech recognition error", ev);
				_this.recognizing = false;
			};
			this.recognition.onend = function() {
				console.log("Speech recognition onend");
				_this.recognizing = false;
				gotoReadyState();
			};
	}
	

	
	this.addBotItem = function(text) {
	
		window.clearTimeout(_this.timer);
		console.log("addBotItem.text = " + text);
	 	var parameters = {
			onstart: voiceStartCallback,
			onend: voiceEndCallback,
			onerror: voiceErrorCallback
		}
		//_this.recognition.stop();
		//_this.recognition.start();
		responsiveVoice.speak(text, _this.marker.voice, parameters);
		if (_this.subtitleLines.length == 2)
		{
			_this.subtitleLines.shift();
			_this.subtitleFontColours.shift();
		}
		_this.subtitleLines.push(text);
		_this.subtitleFontColours.push(_this.marker.subtitlecolour);
  
		function voiceStartCallback() {
			console.log("Voice started");
		};
 
		function voiceEndCallback() {
			console.log("Voice ended");
			
			_this.startListening();
		};
 
		function voiceErrorCallback() {
			console.log("Voice error");
			
			_this.startListening();
		}; 
  
	};
	
	
	
	this.addUserItem = function(text) {
		console.log("addUserItem.text = " + text);
		window.clearTimeout(_this.timer);
		if (_this.subtitleLines.length == 2)
		{
			_this.subtitleLines.shift();
			_this.subtitleFontColours.shift();
		}
		_this.subtitleLines.push(text.charAt(0).toUpperCase() + text.slice(1));
		_this.subtitleFontColours.push(this.playerSubtitleColour);
  
	};


	function addError(text) {
		console.log("addError.text = " + text);
	};


	this.stopListening = function () {
		if (_this.recognition != null)
		{
			_this.recognition.abort();
		}
	};
	
	this.startListening = function () {
		gotoListeningState();
		if (!_this.recognizing)
		{
			_this.recognition.start();
		}
	};
  
	function gotoListeningState() {
		_this.currentState = MarkerStateEnum.LISTEN;
		//m_enabledMic = false;
		//m_showWaiting = true;
	};

	function gotoReadyState() {
		_this.currentState = MarkerStateEnum.TALK;
		//m_enabledMic = true;
		//m_showWaiting = false;
	}; 
	
	
	function onReplaceTexture(modelindex, texturefile) {
		var textureLoader = new THREE.TextureLoader();
		textureLoader.setCrossOrigin("anonymous");
		textureLoader.load(texturefile, function (texture) {

			// mesh is a group contains multiple sub-objects. Traverse and apply texture to all. 
			_this.meshes[modelindex].traverse(function (child) {
				if (child instanceof THREE.Mesh) {

				// apply texture
				child.material.map = texture
				child.material.needsUpdate = true;
				}
			});

		});
	};
	
	return;
}






//ArMarker.prototype = Object.create( THREEx.ArBaseControls.prototype );
ArMarker.prototype.constructor = ArMarker;

ArMarker.prototype.addMesh = function(filename, item, index, textureindex){
	var _this = this
	
	console.log("item.model " + item.model);
		var loader1 = new THREE.FBXLoader(this.manager);
		loader1.load( 'assets/models/' + filename, function ( object ) {
			_this.IDs[index] = item.id
			var clock = new THREE.Clock();
			
			_this.clocks[index] = clock;
			_this.meshes[index] = object;
			var mixer = new THREE.AnimationMixer( object );
			var clips = object.animations;
			_this.mixers[index] = mixer;
			_this.currentAnimation = "idle";
			_this.currentState = MarkerStateEnum.IDLE;
			
			switch (_this.avatarType) {
			case ARAvatarMarkerType.MAIN:
				
				var idleclip = THREE.AnimationClip.findByName( clips, item.idletake );
				var talkclip = THREE.AnimationClip.findByName( clips, item.talktake );
				
				_this.idleAction[index] = _this.mixers[index].clipAction( idleclip );
				_this.talkAction[index] = _this.mixers[index].clipAction( talkclip );
				
				_this.actions[index] = [ _this.idleAction[index], _this.talkAction[index] ];
				
				
				_this.setWeight( _this.idleAction[index], 1.0 );
				_this.setWeight( _this.talkAction[index], 0 );
				

				(_this.actions[index]).forEach( function ( action ) {

					action.play();

				} ); 
				
				break;
			case ARAvatarMarkerType.SELECTION:
				var idleclip = THREE.AnimationClip.findByName( clips, item.idletake );
				var cheerclip = THREE.AnimationClip.findByName( clips, item.cheertake );
				
				//_this.idleAction[index] = null;
				//_this.cheerAction[index] = null;
				
				_this.idleAction[index] = _this.mixers[index].clipAction( idleclip );
				_this.cheerAction[index] = _this.mixers[index].clipAction( cheerclip );
				_this.actions[index] = [ _this.idleAction[index], _this.cheerAction[index] ];
				
				_this.setWeight( _this.idleAction[index], 1.0 );
				_this.setWeight( _this.cheerAction[index], 0.0 );

				(_this.actions[index]).forEach( function ( action ) {
					action.play();

				} ); 
				break;
			}
			
			
			
	
			object.traverse( function ( child ) {

				if ( child.isMesh ) {

					child.castShadow = true;
					child.receiveShadow = true;

				}

			} );

			_this.markerRoot.add( object ); 
			//object.visible = false;
			object.visible = true;
			//console.log("item.textures.length " + item.textures.length);
			if ((textureindex != 0) && (textureindex < item.textures.length))
			{
				
				var texturefile = 'assets/textures/' + item.textures[textureindex].texture.filename;
				var textureLoader = new THREE.TextureLoader();
				textureLoader.setCrossOrigin("anonymous");
				textureLoader.load(texturefile, function (texture) {

					// mesh is a group contains multiple sub-objects. Traverse and apply texture to all. 
					_this.meshes[index].traverse(function (child) {
						if (child instanceof THREE.Mesh) {

							// apply texture
							child.material.map = texture
							child.material.needsUpdate = true;
							
						}
					});
				});
				
			} 
		});
	
	
	
}


ArMarker.prototype.showModel = function(index){

	this.currentModel = index;		
	for(var i=0;i<this.meshes.length;i++)
	{
		if (this.meshes[i] != null)
		{
			if (i == index)
			{
			
				this.meshes[i].visible = true;
			}
			else
			{
				this.meshes[i].visible = false;
			}
		}
	}
	
}

ArMarker.prototype.getModelsNum = function(){
		
	 return this.meshes.length;
}


ArMarker.prototype.setModelsNum = function(value){
	console.log("setModelsNum " + value);
	this.clocks.length = value;
	this.mixers.length = value;	
	this.meshes.length = value;
	this.IDs.length = value;
	this.idletakes.length = value;
	this.talktakes.length = value;
	this.idleAction.length = value;
	this.talkAction.length = value;
	this.cheerAction.length = value;
	
}


ArMarker.prototype.getModelID = function(value){
	if (value < this.IDs.length)
	{
		return this.IDs[value];
	}
	return null;
}

ArMarker.prototype.currentState = function(){
	return this.currentState;
}


ArMarker.prototype.prepareCrossFade = function( startAction, endAction, defaultDuration ) {

		var _this = this;
		this.singleStepMode = false;
		this.unPauseAllActions();

		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop
		console.log("_this.currentModel " + _this.currentModel);
		console.log("_this.idleAction[_this.currentModel] " + _this.idleAction[_this.currentModel]);
		if (( startAction === _this.idleAction[_this.currentModel] ) && (_this.avatarType == ARAvatarMarkerType.SELECTION)) {
			console.log("executeCrossFade ");
			this.executeCrossFade( startAction, endAction, defaultDuration );

		} else {

			this.synchronizeCrossFade( startAction, endAction, defaultDuration );

		} 
		//if ( startAction === this.idleAction ) {

			//this.executeCrossFade( startAction, endAction, defaultDuration );

		//} else {

			//this.synchronizeCrossFade( startAction, endAction, defaultDuration );

		//}

	}




ArMarker.prototype.synchronizeCrossFade	= function ( startAction, endAction, duration ) {

		var _this = this;
		this.mixers[this.currentModel].addEventListener( 'loop', onLoopFinished );

		function onLoopFinished( event ) {

			if ( event.action === startAction ) {

					_this.mixers[_this.currentModel].removeEventListener( 'loop', onLoopFinished );

					_this.executeCrossFade( startAction, endAction, duration );

			}

		}

	}

ArMarker.prototype.unPauseAllActions = function() {
	var _this = this;
		
		(_this.actions[_this.currentModel]).forEach( function ( action ) {

			action.paused = false;

		} );

	}

ArMarker.prototype.executeCrossFade = function ( startAction, endAction, duration ) {

		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)
		var _this = this;
		_this.setWeight( endAction, 1 );
		endAction.time = 0;

		// Crossfade with warping - you can also try without warping by setting the third parameter to false

		startAction.crossFadeTo( endAction, duration, true );

	}


ArMarker.prototype.changeState = function(value){
	var _this = this
	switch (value) {
			
		case MarkerStateEnum.IDLE:
		
			//this.currentAnimation = "idle";
			if (this.currentState != MarkerStateEnum.IDLE)
			{
				switch (this.currentState) {
					case MarkerStateEnum.TALK:
						console.log(_this.marker.markertype + ": change state talk to idle ");
						this.prepareCrossFade( _this.talkAction[_this.currentModel], _this.idleAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.IDLE;					
						this.stopListening();
						this.subtitleLines.length = 0;
						this.subtitleFontColours.length = 0;
						break;
					case MarkerStateEnum.LISTEN:
						console.log(_this.marker.markertype + ": change state listen to idle ");
						this.prepareCrossFade( _this.talkAction[_this.currentModel], _this.idleAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.IDLE;
						this.subtitleLines.length = 0;
						this.subtitleFontColours.length = 0;
						this.stopListening();						
						break;
					case MarkerStateEnum.READY:
						console.log(_this.marker.markertype + ": change state ready to idle ");
						this.prepareCrossFade( _this.talkAction[_this.currentModel], _this.idleAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.IDLE;					
						this.subtitleLines.length = 0;
						this.subtitleFontColours.length = 0;
						break;
				}
			}
			break;
		case MarkerStateEnum.READY:
		
			//this.currentAnimation = "idle";
			if (this.currentState != MarkerStateEnum.READY)
			{
				switch (this.currentState) {
					case MarkerStateEnum.IDLE:
						console.log(_this.marker.markertype + ": change state talk to idle ");
						this.prepareCrossFade( _this.idleAction[_this.currentModel], _this.talkAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.READY;			
						break;

				}
			}
			break;
		case MarkerStateEnum.TALK:
			if (this.currentState != MarkerStateEnum.TALK)
			{
				switch (this.currentState) {
					case MarkerStateEnum.IDLE:
						console.log(_this.marker.markertype + ": change state idle to talk ");
						this.prepareCrossFade( _this.idleAction[_this.currentModel], _this.talkAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.TALK;					
						break;
					case MarkerStateEnum.LISTEN:
						console.log(_this.marker.markertype + ": change state listen to talk ");
						this.currentState = MarkerStateEnum.TALK;					
						break;
				}

			}
			break;
		case MarkerStateEnum.LISTEN:
			if (this.currentState != MarkerStateEnum.LISTEN)
			{
				switch (this.currentState) {
					case MarkerStateEnum.IDLE:
						console.log(_this.marker.markertype + ": change state idle to listen ");
						this.prepareCrossFade( _this.idleAction[_this.currentModel], _this.talkAction[_this.currentModel], 1.0 );
						this.currentState = MarkerStateEnum.LISTEN;					
						break;
					case MarkerStateEnum.TALK:
						console.log(_this.marker.markertype + ": change state talk to listen ");
						this.currentState = MarkerStateEnum.LISTEN;					
						break;
					case MarkerStateEnum.READY:
						console.log(_this.marker.markertype + ": change state talk to listen ");
						//this.prepareCrossFade( _this.idleAction, _this.talkAction, 1.0 );
						this.currentState = MarkerStateEnum.LISTEN;					
						break;
				}

			}
			break;
		case MarkerStateEnum.CHEER:
			if (this.currentState != MarkerStateEnum.CHEER)
			{
				switch (this.currentState) {
					case MarkerStateEnum.IDLE:
						console.log(_this.marker.markertype + ": change state idle to cheer ");
						this.prepareCrossFade( _this.idleAction[_this.currentModel], _this.cheerAction[_this.currentModel], 0.2 );
						this.currentState = MarkerStateEnum.CHEER;					
						break;

				}

			}
			break;
	}
}


ArMarker.prototype.startConversation = function () {
	console.log("startConversation()");
	if ((this.currentState == MarkerStateEnum.READY) || (this.currentState == MarkerStateEnum.TALK))
	{
		//gotoListeningState();
		
		this.startListening();
	}
}


 ArMarker.prototype.replaceTexture = function(modelindex, texturename){
	var _this = this
	
	if (modelindex < _this.meshes.length)
	{
		var texturefile = 'assets/textures/' + texturename;
		var textureLoader = new THREE.TextureLoader();
				textureLoader.setCrossOrigin("anonymous");
				textureLoader.load(texturefile, function (texture) {

					// mesh is a group contains multiple sub-objects. Traverse and apply texture to all. 
					_this.meshes[modelindex].traverse(function (child) {
						if (child instanceof THREE.Mesh) {

							// apply texture
							var oldtexture = child.material.map;
							oldtexture.dispose();
							child.material.map = null;
							child.material.map = texture;
							child.material.needsUpdate = true;
							
						}
					});
					
					document.getElementById("loader").style.display = "none";
					m_enableTouchClick = true;
				});
				
				return true;
			
	}
	return false;
} 


ArMarker.prototype.stopConversation = function(){
	this.stopListening();	
	
}




ArMarker.prototype.isVisible = function(){
	if (this.markerRoot.visible)
	{
		if (this.meshes[this.currentModel].visible)
		{
		//console.log("this.meshes[this.currentModel].visible = " + this.meshes[this.currentModel].visible);
		//console.log(" this.markerRoot.position.x = " + this.markerRoot.position.x + " y " + this.markerRoot.position.y + " z " + this.markerRoot.position.z);
		}
	}
	return this.markerRoot.visible;
}

ArMarker.prototype.getPosition = function(){
	return this.markerRoot.position;
}

ArMarker.prototype.distanceFrom = function(position){
	var length = this.markerRoot.position.distanceTo(position);
	return length;
}

ArMarker.prototype.angleFacing = function(position){
	
	//direction of vector from this object to the one passed in
	var dir1 = new THREE.Vector3(); 
	dir1.subVectors( position, this.markerRoot.position ).normalize();
	
	//direction this object is facing
	var matrix = new THREE.Matrix4();
	matrix.extractRotation( this.markerRoot.matrix );

	var direction = new THREE.Vector3( 0, 0, 1 );
	direction = (direction.applyMatrix4( matrix )).normalize();
	var angle = direction.angleTo(dir1);;
	return angle * (180 / Math.PI);
	
}

ArMarker.prototype.setSubtitleColour = function(value){
	this.playerSubtitleColour = value;
}

ArMarker.prototype.getSubtitleColour = function(){
	return this.playerSubtitleColour;
}

ArMarker.prototype.getSubtitles = function(){
	return [this.subtitleLines, this.subtitleFontColours];
}

ArMarker.prototype.update = function(){
	var _this = this	
	
	for(var i=0;i<_this.mixers.length;i++)
	{
		if ((_this.mixers[i] != null) && (_this.clocks[i] != null))
		{
			_this.mixers[i].update(_this.clocks[i].getDelta());
		}
	}
	//m_debugtext = "marker " + _this.markerRoot.visible + " model " + _this.meshes[_this.currentModel].visible; 
	//m_debugtext = "marker " + _this.markerRoot.visible + "marker x:" + _this.markerRoot.position.x + " y:" + _this.markerRoot.position.y + " z:" + _this.markerRoot.position.z;
	//check model is set to visible if marker visible
	//console.log("plane " + m_shadowARPlane.visible  );
	if (_this.markerRoot.visible)
	{
		
		_this.meshes[_this.currentModel].visible = true;
		_this.storedPosX = _this.markerRoot.position.x;
		_this.storedPosY = _this.markerRoot.position.y;
		_this.storedPosZ = _this.markerRoot.position.z;
		_this.storedVisibleState =  _this.markerRoot.visible;
		_this.storedCounter = 0;
		if (_this.prop != null)
			_this.prop.visible = true;
	}
	else
	{
		if (_this.storedVisibleState)
		{
			
			_this.markerRoot.position.set(_this.storedPosX, _this.storedPosY, _this.storedPosZ);
			_this.markerRoot.visible = true;
			_this.storedCounter++;
			if (_this.storedCounter > 2)
			{
				_this.storedVisibleState = false;
				_this.storedCounter = 0;
			}
			
		}
	}
}

ArMarker.prototype.dispose = function(){
	
	//var _this = this
	//this.context.removeMarker(this)
	console.log("destructor of ArMarker name = " + this.markerRoot.name );
	
	this.marker = null;
	this.manager = null; 
	for(var i=0;i<this.actions.length;i++)
	{
		if (this.actions[i] != null)
		{
 
			(this.actions[i]).forEach( function ( action ) {
				if (action != null)
				action.stop();

			} );
			this.actions[i].length = 0;
			this.actions[i] = null;
		}
	}
	
	for (var i = this.markerRoot.children.length - 1; i >= 0; i--) {
			this.markerRoot.remove(this.markerRoot.children[i]);
	}
		
	//remove three.js stuff
	
	this.scene.remove(this.markerRoot);
	this.markerRoot = null;
	//this.mesh = null;
	
	if (this.shadowARPlane != null)
	{
		disposeSceneMesh(this.shadowARPlane);
		this.shadowARPlane = null;
	}
	
	for(var i=0;i<this.meshes.length;i++)
	{
		disposeSceneMesh(this.meshes[i]);
		this.meshes[i] = null;
		this.mixers[i] = null;
		this.clocks[i] = null;
	}
	this.meshes.length = 0;
	this.mixers.length = 0;
	this.clocks.length = 0;
	this.IDs.length = 0;
	this.idletakes.length = 0;
	this.talktakes.length = 0;
	this.meshes = null;
	this.mixers = null;
	this.clocks = null;
	this.IDs = null;
	if (this.prop != null)
	{
		disposeSceneMesh(this.prop);
		this.prop = null;
	}
	this.markerControls.dispose();
	if (this.recognition != null)
	{
		this.apiClient = null;
		this.recognition.abort();
		this.recognition = null;
		this.recognizedText = null;
	}
	
	this.markerControls = null;
	// TODO remove the event listener if needed
	// unloadMaker ???
	
	
}
