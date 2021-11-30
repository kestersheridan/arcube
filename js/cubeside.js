const PhysicsControlTypeEnum = {
  STATIC: 0,
  CUBE: 1
};




const CubeSideStateEnum = {
  NOTACTIVE: 0,
  OPENWITHOUTCONTENT: 1,
  OPENWITHCONTENT: 2,
  OPENED: 3,
  FULLFILMENT: 4,
  CHEER: 5
};


const SideFaceTypeEnum = {
	TOPFACE : 0,
	BOTTOMFACE : 1,
	FRONTFACE : 2,
	BACKFACE : 3,
	LEFTFACE : 4,
	RIGHTFACE : 5
}

const ObjectTypeEnum = {
	MODEL : 0,
	GROUP : 1,
	CHARACTER : 2,
	WAYPOINT : 3,
	MESHBUTTON : 4,
	STATE : 5,
	CLASSSTATE : 6,
	CLASS : 7,
	VIDEOTEXTURE : 8,
	COLOURCHANGE : 9,
	MESHLABEL : 10,
	PARTICLEEMITTER : 11,
	CUBESIDE : 12,
	ACTION : 13,
	AUDIOCLIP : 14,
	SCREENBUTTON : 15,
	DIALOGENGINE : 16,
	TEXTTOSPEECH : 17,
	SPEECHTOTEXT : 18,
	PARENTOBJECT : 19,
	PHYSICSBODY : 20,
	PHYSICSCONSTRAINT : 21,
	STAGE : 22,
	LIGHT : 23
}

const ObjectPropertyTypeEnum = {
	POSITION : 0,
	POSITIONX : 1,
	POSITIONY : 2,
	POSITIONZ : 3,
	ROTATION : 4,
	ROTATIONX : 5,
	ROTATIONY : 6,
	ROTATIONZ : 7,
	USERDATA : 8
	
}
	
CubeSide = function(scenegroup, cubefacesgroup, cubewidth, scale, holewidth, framedepth, totallidsegments, item, parentcube) {

	var _this = this;

	this.parentCube = parentcube;
	this.sceneGroup = scenegroup;
	this.storedPosX = 0;
	this.storedPosY = 0;
	this.storedPosZ = 0;
	this.storedCounter = 0;
	this.numLids = 1;
	this.segmentsPerLid = totallidsegments;
	this.leftLidArray = new Array;
	this.rightLidArray = new Array;
	this.boxLid = null;
	this.arStagesArray = new Array;
	this.texturesArray = new Array;
	this.arStatesArray = new Array;
	this.arClassStatesArray = new Array;
	this.currentStateOrder = 1;
	this.arOpeningStatesArray = new Array;
	this.arOpeningClassStatesArray = new Array;
	this.openingStatePending = false;
	this.openingStatePresent = false;
	this.currentOpeningStateOrder = 1;
	this.pendingOpeningStateOrder = null;
	this.arClosingStatesArray = new Array;
	this.arClosingClassStatesArray = new Array;
	this.closingStatePending = false;
	this.closingStatePresent = false;
	this.currentClosingStateOrder = 1;
	this.arTimeoutStatesArray = new Array;
	this.arTimeoutClassStatesArray = new Array;
	this.timeoutStatePending = false;
	this.timeoutStatePresent = false;
	this.currentTimeoutStateOrder = 1;
	this.sideFacetype = null;
	this.markerControls = null;
	this.topAligned = item.content.topaligned; 
	this.boxType = false;
	this.physicsControlType = PhysicsControlTypeEnum.STATIC;
	this.cubeControlEnabled = false;
	if (item.content.hasOwnProperty('boxtype'))
	{
		//boxtype - all sides will open at once to reveal contents inside box (i.e. avatar, or scene)
		this.boxType = item.content.boxtype; 
	}
	if (item.content.hasOwnProperty('physicscontrol'))
	{
		switch (item.content.physicscontrol.toLowerCase()) {
		case "static":
			this.physicsControlType = PhysicsControlTypeEnum.STATIC;
			break;
		case "cube":
			this.physicsControlType = PhysicsControlTypeEnum.CUBE;
			break;	
		}
	}
	
	if ( totallidsegments % 2 == 0) {
		this.numLids = 2;
		this.segmentsPerLid = totallidsegments / 2;
	}
	
	this.cubeWidth = cubewidth;
	this.lidsegmentwidth = holewidth / totallidsegments;
	this.defaultStageStartPosY = (this.cubeWidth / 2) - this.lidsegmentwidth;
	this.storedSideRotation = null;
	
	this.currentCubeSideState = CubeSideStateEnum.NOTACTIVE;
	this.cube = null;
	//group used by face
	this.sidefaceGroup =  new THREE.Group();

	this.cubefacesgroup = cubefacesgroup;
	this.sidefaceWorldUpVector = new THREE.Vector3();
	this.sidefaceGroupUp = new THREE.Vector3();
	this.adjustedSideFaceWorldUpVector = new THREE.Vector3();
	
	this.physicsClock = new THREE.Clock();
	
	//temp storage of points to memory of object created used by states
	this.uidWaypointMap = new Map();
	this.uidModelMap = new Map();
	this.uidCharacterMap = new Map();
	this.uidGroupMap = new Map();
	this.uidStateMap = new Map();
	this.uidClassMap = new Map();
	this.uidMeshButtonMap = new Map();
	this.uidScreenButtonMap = new Map();
	this.uidVideoTextureMap = new Map();
	this.uidColourChangeMap = new Map();
	this.uidMeshLabelMap = new Map();
	this.uidParticleEmitterMap = new Map();
	this.uidAudioClipMap = new Map();
	this.uidActionMap = new Map();
	this.uidDialogEngineMap = new Map();
	this.uidTextToSpeechMap = new Map();
	this.uidSpeechToTextMap = new Map();
	this.uidPhysicsBodyMap = new Map();
	this.uidPhysicsConstraintMap = new Map();
	this.uidLightMap = new Map();
	this.uidStageMap = new Map();
	this.referenceObjectArray = new Array;
	this.videoTexturePresent = false;
	this.meshLabelPresent = false;
	this.physicsPresent = false;
	this.audioPresent = false;
	this.voicePresent = false;
	this.listeningPresent = false;
	
	this.helpText = "";
	if (item.content.hasOwnProperty('helptext'))
	{
		this.helpText = item.content.helptext; 	
	}
	this.introText = "";		
	if (item.content.hasOwnProperty('introtext'))
	{
		this.introText = item.content.introtext; 	
	}
	
	if (item.content.hasOwnProperty('screenbuttons'))
	{
		if (item.content.screenbuttons.length > 0)
		{
			for (let i = 0; i < item.content.screenbuttons.length; i++)
			{
				if (item.content.screenbuttons[i].hasOwnProperty('screenbutton'))
				{
					var screenbutton = new ScreenButton(item.content.screenbuttons[i].screenbutton, _this); 
				}
			}
		}
	}
	
	//group used for face
	this.sceneGroup.add(this.sidefaceGroup);
	
	var rotation;
	
	switch (item.face.orientation.toLowerCase()) {
		
	case "top":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.TOPFACE;
		rotation = new THREE.Vector3(0,0,0);
		this.storedSideRotation = new THREE.Vector3(0,0,0);
		break;
	case "bottom":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.BOTTOMFACE;
		rotation = new THREE.Vector3(Math.PI,0,0);
		this.storedSideRotation = new THREE.Vector3(Math.PI,0,0);
		break;
	case "front":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.FRONTFACE;
		rotation = new THREE.Vector3(-Math.PI/2,0,0);
		this.storedSideRotation = new THREE.Vector3(Math.PI/2, 0,0);
		break;
	case "right":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.RIGHTFACE;
		rotation = new THREE.Vector3(-Math.PI/2,Math.PI/2,0);
		this.storedSideRotation = new THREE.Vector3(Math.PI/2,0, Math.PI/2);
		break;
	case "left":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.LEFTFACE;
		rotation = new THREE.Vector3(0,-Math.PI/2,Math.PI/2);
		this.storedSideRotation = new THREE.Vector3(Math.PI/2, 0, -Math.PI/2);
		break;
	case "back":
		_this.sidefaceGroup.name = item.face.name;
		_this.sideFacetype = SideFaceTypeEnum.BACKFACE;
		rotation = new THREE.Vector3(Math.PI/2, 0, Math.PI);
		this.storedSideRotation = new THREE.Vector3(-Math.PI/2,Math.PI,0);
		break;
	}	

	createLidGeometry();
	
	_this.sidefaceGroup.rotation.setFromVector3( this.storedSideRotation );
	
	
	this.loadStages = function() {
		if (item.content.stages.length > 0)
		{
			for (let i = 0; i < item.content.stages.length; i++)
			{
				var arstage = new ARStage(item.content.stages[i], _this.boxType, _this.sceneGroup, _this.storedSideRotation, holewidth, framedepth, cubewidth, _this.lidsegmentwidth, parentcube, _this); 
				_this.arStagesArray.push(arstage);
			}
		}
		if (_this.physicsPresent)
		{
			
			for (const [key, value] of _this.uidPhysicsBodyMap) {
				if (value.getEnabled())
				{
					value.addAnchors();
				}
			}
			
			//add constraints
			for (const [key, value] of _this.uidPhysicsConstraintMap) {
				value.createConstraint();
			}
			
			
		}
	}
	
	this.loadStates = function() {
		if (item.content.hasOwnProperty('states'))
		{
			if (item.content.states.length > 0)
			{
				for (let i = 0; i < item.content.states.length; i++)
				{
					if (item.content.states[i].hasOwnProperty('state'))
					{
						if (item.content.states[i].state.hasOwnProperty('ios'))
						{
							if (item.content.states[i].state.ios == g_isIOS)
							{
								var arstate = new ARState(item.content.states[i].state, _this, _this, StateStageTypeEnum.STAGEUPDATE);
								_this.arStatesArray.push(arstate);
							}
						}
						else
						{
							var arstate = new ARState(item.content.states[i].state, _this, _this, StateStageTypeEnum.STAGEUPDATE);
							_this.arStatesArray.push(arstate);
						}
					}
					if (item.content.states[i].hasOwnProperty('classstate'))
					{
						var arclassstate = new ARClassState(item.content.states[i].classstate, _this, _this, StateStageTypeEnum.STAGEUPDATE);
							_this.arClassStatesArray.push(arclassstate);
						
					}
				}
			}
		}
		
		if (item.content.hasOwnProperty('openingstates'))
		{
			if (item.content.openingstates.length > 0)
			{
				for (let i = 0; i < item.content.openingstates.length; i++)
				{
					if (item.content.openingstates[i].hasOwnProperty('state'))
					{
						if (item.content.openingstates[i].state.hasOwnProperty('ios'))
						{
							if (item.content.openingstates[i].state.ios == g_isIOS)
							{
								var arstate = new ARState(item.content.openingstates[i].state, _this, _this, StateStageTypeEnum.STAGEOPENING);
								if (!this.openingStatePresent)
								{
									this.openingStatePending = true; 
									this.openingStatePresent = true;
								}
								_this.arOpeningStatesArray.push(arstate);
							}
						}
						else
						{
							var arstate = new ARState(item.content.openingstates[i].state, _this, _this, StateStageTypeEnum.STAGEOPENING);
							if (!this.openingStatePresent)
							{
								this.openingStatePending = true; 
								this.openingStatePresent = true;
							}
							_this.arOpeningStatesArray.push(arstate);
						}
					}
					if (item.content.openingstates[i].hasOwnProperty('classstate'))
					{
						var arclassstate = new ARClassState(item.content.openingstates[i].classstate, _this, _this, StateStageTypeEnum.STAGEOPENING);
						if (!this.openingStatePresent)
						{
							this.openingStatePending = true; 
							this.openingStatePresent = true;
						}
						_this.arOpeningClassStatesArray.push(arclassstate);
						
					}
				}

			}
			
		}
		
		
		if (item.content.hasOwnProperty('closingstates'))
		{
			if (item.content.closingstates.length > 0)
			{
				for (let i = 0; i < item.content.closingstates.length; i++)
				{
					if (item.content.closingstates[i].hasOwnProperty('state'))
					{
						if (item.content.closingstates[i].state.hasOwnProperty('ios'))
						{
							if (item.content.closingstates[i].state.ios == g_isIOS)
							{
								var arstate = new ARState(item.content.closingstates[i].state, _this, _this, StateStageTypeEnum.STAGECLOSING);
								if (!this.closingStatePresent)
								{
									this.closingStatePending = true; 
									this.closingStatePresent = true;
								}
								_this.arClosingStatesArray.push(arstate);
							}
						}
						else
						{
							var arstate = new ARState(item.content.closingstates[i].state, _this, _this, StateStageTypeEnum.STAGECLOSING);
							if (!this.closingStatePresent)
							{
								this.closingStatePending = true; 
								this.closingStatePresent = true;
							}
							_this.arClosingStatesArray.push(arstate);
						}
					}
				
					if (item.content.closingstates[i].hasOwnProperty('classstate'))
					{
						var arclassstate = new ARClassState(item.content.closingstates[i].classstate, _this, _this, StateStageTypeEnum.STAGECLOSING);
						if (!this.closingStatePresent)
						{
							this.closingStatePending = true; 
							this.closingStatePresent = true;
						}
						_this.arClosingClassStatesArray.push(arclassstate);
					}
				}
			}
			
		}
		if (item.content.hasOwnProperty('timeoutstates'))
		{
			if (item.content.timeoutstates.length > 0)
			{
				for (let i = 0; i < item.content.timeoutstates.length; i++)
				{
					if (item.content.timeoutstates[i].hasOwnProperty('state'))
					{
						if (item.content.timeoutstates[i].state.hasOwnProperty('ios'))
						{
							if (item.content.timeoutstates[i].state.ios == g_isIOS)
							{
								var arstate = new ARState(item.content.timeoutstates[i].state, _this, _this, StateStageTypeEnum.STAGETIMEOUT);
								if (!this.timeoutStatePresent)
								{
									this.timeoutStatePending = true; 
									this.timeoutStatePresent = true;
								}
								_this.arTimeoutStatesArray.push(arstate);
							}
						}
						else
						{
							var arstate = new ARState(item.content.timeoutstates[i].state, _this, _this, StateStageTypeEnum.STAGETIMEOUT);
							if (!this.timeoutStatePresent)
							{
								this.timeoutStatePending = true; 
								this.timeoutStatePresent = true;
							}
							_this.arTimeoutStatesArray.push(arstate);
						}
					}
				
					if (item.content.timeoutstates[i].hasOwnProperty('classstate'))
					{
						var arclassstate = new ARClassState(item.content.timeoutstates[i].classstate, _this, _this, StateStageTypeEnum.STAGETIMEOUT);
						if (!this.timeoutStatePresent)
						{
							this.timeoutStatePending = true; 
							this.timeoutStatePresent = true;
						}
						_this.arTimeoutClassStatesArray.push(arclassstate);
					}
				}
			}
			
		}
		
		for (let i = 0; i < this.arStagesArray.length; i++)
		{
			this.arStagesArray[i].loadStates();
		}
	}
	
	
	this.markerName = null;

	if (item.hasOwnProperty('face'))
	{
		this.markerName = item.face.name;
	}

	//_this.sideContentGroup.rotation.setFromVector3( this.storedSideRotation );
	
	
	this.sidefaceGroupUp.copy( this.sidefaceGroup.up ).applyEuler(this.sidefaceGroup.rotation);
	this.cubefacesgroup.add(this.sidefaceGroup);

	this.markerconfidence = 0.6;

	if (item.face.hasOwnProperty('markerconfidence'))
	{
		_this.markerconfidence = item.face.markerconfidence;
	}


	this.markerRoot = new THREE.Group();	
	g_scene.add(this.markerRoot);
	
	//error thrown here
	try {
		this.markerControls = new THREEx.ArMarkerControls(g_arToolkitContext, this.markerRoot, {
				type : 'pattern',
				patternUrl : "data/data/" + item.face.pattern,
				minConfidence : _this.markerconfidence
			});
	}
	catch(err) {
		console.log( 'There was an error loading AR Cube');
		g_loadingErrorMessage = "Error loading AR Cube";
		g_loadingError = true;
	}
	
	console.log("this.markerControls " + this.markerControls + " this.markerControls.confidenceLevel " + this.markerControls.confidenceLevel);
	this.markerGroup = new THREE.Group();	

	this.markerGroup.position.y = -(scale / 2) ;
	this.markerGroup.rotation.setFromVector3( rotation );
	
	this.markerRoot.add( this.markerGroup );
	this.markerGroup.add( this.sceneGroup );
	
	function createLidGeometry(){
		
		
		var loader = new AjaxTextureLoader(g_loadingManager);
		loader.load( "assets/textures/" + item.face.texture + ".jpg", function( texture ) {
			
			//var segmentwidth = holewidth / totallidsegments;
			var xOffset = 0;
			var yOffset = 0;
			var  height = 1;
			var width = 1 / totallidsegments;
			
			texture.encoding = THREE.sRGBEncoding;
			texture.anisotropy = 16;
			
			_this.texturesArray.push(texture);
			
			var lidgeometry = new THREE.BoxBufferGeometry( holewidth, framedepth, holewidth );
			var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
			const materials = [
				material,
				material,
				new THREE.MeshStandardMaterial({map: texture}),
				material,
				material,
				material
			];
			_this.boxLid = new THREE.Mesh( lidgeometry, materials );
			_this.boxLid.name = item.face.name;
			_this.boxLid.castShadow = true;
			_this.boxLid.receiveShadow = true;
			_this.sidefaceGroup.add( _this.boxLid );	
			_this.boxLid.position.y = (_this.cubeWidth / 2) - (framedepth / 2);	
			_this.boxLid.visible = true;			
		
			var positionx = 0 - (holewidth / 2) - (_this.lidsegmentwidth);

			for(let i=0;i<_this.segmentsPerLid;i++)
			{
			
				var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
				const materials = [
					material,
					material,
					new THREE.MeshStandardMaterial({map: texture}),
					material,
					material,
					material
				];
				var localaxis = new THREE.Vector3((_this.lidsegmentwidth / 2), 0, 1).normalize();
				var geometry = new THREE.BoxGeometry( _this.lidsegmentwidth, framedepth, holewidth );
				geometry.faceVertexUvs[0][4][0].set(xOffset, height);
				geometry.faceVertexUvs[0][4][1].set(xOffset, yOffset);
				geometry.faceVertexUvs[0][4][2].set(xOffset + width, yOffset + height);
			
				geometry.faceVertexUvs[0][5][0].set(xOffset, yOffset)
				geometry.faceVertexUvs[0][5][1].set(xOffset + width, yOffset)
				geometry.faceVertexUvs[0][5][2].set(xOffset + width, yOffset + height)
			
				geometry.uvsNeedUpdate = true;

				var segement = new THREE.Mesh( geometry, materials );
				segement.castShadow = true;
				segement.receiveShadow = true;
				segement.name = item.face.name;
				var pivot =  new THREE.Group();
				_this.leftLidArray.push([segement, pivot]);
				positionx = positionx + _this.lidsegmentwidth;
				pivot.add(segement);
				if (i == 0)
				{
					_this.sidefaceGroup.add( pivot );
					pivot.position.y = (_this.cubeWidth / 2) - (framedepth / 2);
					pivot.position.x = positionx;
					pivot.visible = false;
				}
				else
				{
					_this.leftLidArray[i - 1][1].add(pivot);
					pivot.position.x = _this.lidsegmentwidth;
				}
				segement.position.x = (_this.lidsegmentwidth / 2);

			

				xOffset = xOffset + width;
			}

			if (_this.numLids == 2)
			{	
				
				positionx = 0 + (holewidth / 2) + (_this.lidsegmentwidth);
				xOffset = 1 - width;
				for(let i=0;i<_this.segmentsPerLid;i++)
				{
					var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
					const materials = [
						material,
						material,
						new THREE.MeshStandardMaterial({map: texture,}),
						material,
						material,
						material
					];
					var geometry = new THREE.BoxGeometry( _this.lidsegmentwidth, framedepth, holewidth );
					geometry.faceVertexUvs[0][4][0].set(xOffset, height);
					geometry.faceVertexUvs[0][4][1].set(xOffset, yOffset);
					geometry.faceVertexUvs[0][4][2].set(xOffset + width, yOffset + height);
				
					geometry.faceVertexUvs[0][5][0].set(xOffset, yOffset)
					geometry.faceVertexUvs[0][5][1].set(xOffset + width, yOffset)
					geometry.faceVertexUvs[0][5][2].set(xOffset + width, yOffset + height)
					geometry.uvsNeedUpdate = true;
					var segement = new THREE.Mesh( geometry, materials );
					segement.castShadow = true;
					segement.receiveShadow = true;
					segement.name = item.face.name;
				
				
					var pivot =  new THREE.Group();
					_this.rightLidArray.push([segement, pivot]);
					positionx = positionx - _this.lidsegmentwidth;

					pivot.add(segement);
					if (i == 0)
					{
						_this.sidefaceGroup.add( pivot );
						pivot.position.y = (_this.cubeWidth / 2) - (framedepth / 2);
						pivot.position.x = positionx;
						pivot.visible = false;
					}
					else
					{
						_this.rightLidArray[i - 1][1].add(pivot);
						pivot.position.x = - _this.lidsegmentwidth;
					}
					segement.position.x = -(_this.lidsegmentwidth / 2);
					xOffset = xOffset - width;
				}
			}
			
		
		} );

	};
	
	return;

}	
	
	
CubeSide.prototype.constructor = CubeSide; 

/* CubeSide.prototype.loadContent = function(){
	
	this.topAligned = item.topaligned; 
	
	if (item.hasOwnProperty('boxtype'))
	{
		this.boxType = item.boxtype; 
	}
	
	if (item.hasOwnProperty('helptext'))
	{
		this.helpText = item.helptext; 	
	}
			
	if (item.hasOwnProperty('introtext'))
	{
		this.introText = item.introtext; 	
	}
	
	
	if (item.stages.length > 0)
	{
		for (let i = 0; i < item.stages.length; i++)
		{
			var arstage = new ARStage(item.stages[i], this.boxType, this.sceneGroup, this.storedSideRotation, this.holeWidth, this.frameDepth, this.cubeWidth, this.lidsegmentwidth, this.parentCube, this); 
			this.arStagesArray.push(arstage);
		}
	}
	
	if (item.hasOwnProperty('states'))
	{
		if (item.states.length > 0)
		{
			for (let i = 0; i < item.states.length; i++)
			{
				var arstate = new ARState(item.states[i].state, this);
				this.arStatesArray.push(arstate);
			}

		}
		if (this.referenceObjectArray.length > 0)
		{
			for (let i = 0; i < item.states.length; i++)
			{
				this.referenceObjectArray[i][0].addReference(this.referenceObjectArray[i][1], this.referenceObjectArray[i][2]);	
			}
		}
	}
	
	
	
} */

CubeSide.prototype.loadStages = function(){
	
	this.loadStages();
}

/* CubeSide.prototype.loadStates = function(){
	console.log("CubeSide loadstates");
	this.loadStates();
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		this.arStagesArray[i].loadStates();
	}
} */
  
CubeSide.prototype.getIsVisible = function(){
	
	return this.markerRoot.visible;
}

CubeSide.prototype.isTimeoutStatePending = function(){
	return this.timeoutStatePending;
}

CubeSide.prototype.isClosingStatePending = function(){
	return this.closingStatePending;
}

CubeSide.prototype.isOpeningStatePending = function(){
	return this.openingStatePending;
}
	
CubeSide.prototype.getMarkerConfidence = function(){
	if ( this.markerRoot.visible )
	{
		return this.markerControls.confidenceLevel();
	}
	else
	{
		return null;
	}
}


CubeSide.prototype.addReferenceStateObject = function(object, uid, num){
	var entry = [object, uid, num];
	this.referenceObjectArray.push(entry);
}
	
CubeSide.prototype.getCubeFace = function(){
	return this.cube;
}
	
CubeSide.prototype.getSideFaceGroupName = function(){	
	return this.sidefaceGroup.name;
}
	
CubeSide.prototype.getSideFaceType = function(){	
	return this.sideFacetype;
}

CubeSide.prototype.getDefaultStageStartPosY = function(){	
	return this.defaultStageStartPosY	
}
	
CubeSide.prototype.getMarkerName = function(){	
		return this.markerName;
}

CubeSide.prototype.getHelpText = function(){	
	return this.helpText;
}

CubeSide.prototype.getIntroText = function(){	
	return this.introText;
}
	
CubeSide.prototype.getStagesArray = function(){		
		return this.arStagesArray;
}

CubeSide.prototype.getPhysicsControlType = function(){		
	return this.physicsControlType;
}

CubeSide.prototype.isTopAligned = function(){
		return this.topAligned;
}
	
CubeSide.prototype.setAdjustedWorldUpVector = function(param){	
		this.adjustedSideFaceWorldUpVector.copy(param);
	}
	
CubeSide.prototype.getAdjustedWorldUpVector = function(){	
		return this.adjustedSideFaceWorldUpVector;
	}
	
CubeSide.prototype.getWorldUpVector = function(){	
		return this.sidefaceWorldUpVector;
	}
	
CubeSide.prototype.getSidefaceVectorUp = function(){	
		return this.sidefaceGroupUp;
	}
	
CubeSide.prototype.setUIDObjectMap = function(uid, object, objecttype, classuid = null){		

	switch (objecttype) {
	case ObjectTypeEnum.MODEL:
		this.uidModelMap.set(uid, object);
		break;
	case ObjectTypeEnum.GROUP:
		this.uidGroupMap.set(uid, object);
		break;
	case ObjectTypeEnum.CHARACTER:
		this.uidCharacterMap.set(uid, object);
		break;
	case ObjectTypeEnum.WAYPOINT:
		this.uidWaypointMap.set(uid, object);
		break;
	case ObjectTypeEnum.STATE:
		this.uidStateMap.set(uid, object);
		break;
	case ObjectTypeEnum.MESHBUTTON:
		this.uidMeshButtonMap.set(uid, object);
		break;
	case ObjectTypeEnum.VIDEOTEXTURE:
		this.videoTexturePresent = true;
		this.uidVideoTextureMap.set(uid, object);
		break;
	case ObjectTypeEnum.COLOURCHANGE:
		this.uidColourChangeMap.set(uid, object);
		break;
	case ObjectTypeEnum.MESHLABEL:
		this.meshLabelPresent = true;
		this.uidMeshLabelMap.set(uid, object);
		break;		
	case ObjectTypeEnum.PARTICLEEMITTER:
		this.uidParticleEmitterMap.set(uid, object);
		break;
	case ObjectTypeEnum.ACTION:
		this.uidActionMap.set(uid, object);
		break;
	case ObjectTypeEnum.AUDIOCLIP:
		this.audioPresent = true;
		this.uidAudioClipMap.set(uid, object);
		break;
	case ObjectTypeEnum.SCREENBUTTON:
		this.uidScreenButtonMap.set(uid, object);	
		break;
	case ObjectTypeEnum.DIALOGENGINE:
		this.uidDialogEngineMap.set(uid, object);	
		break;
	case ObjectTypeEnum.TEXTTOSPEECH:
		this.voicePresent = true;
		this.uidTextToSpeechMap.set(uid, object);	
		break;
	case ObjectTypeEnum.SPEECHTOTEXT:
		this.listeningPresent = true;
		this.uidSpeechToTextMap.set(uid, object);	
		break;
	case ObjectTypeEnum.PHYSICSBODY:
		this.physicsPresent = true;
		this.uidPhysicsBodyMap.set(uid, object);	
		break;
	case ObjectTypeEnum.LIGHT:
		this.uidLightMap.set(uid, object);	
		break;	
	case ObjectTypeEnum.PHYSICSCONSTRAINT:
		this.physicsPresent = true;
		this.uidPhysicsConstraintMap.set(uid, object);	
		break;		
	case ObjectTypeEnum.STAGE:
		this.uidStageMap.set(uid, object);
		break;	
	case ObjectTypeEnum.CLASS:
		if (classuid != null)
		{
			let classentry = this.uidClassMap.get(classuid);
			if (classentry == undefined)
			{
				let classmap = new Map();
				classmap.set(uid, object);
				this.uidClassMap.set(classuid, classmap);
			}
			else
			{
				classentry.set(uid, object);	
			}
		}
		break;
	}
	
}

CubeSide.prototype.getUIDObjectMap = function(uid, objecttype, classuid = null){		

	var objectentry = null;
	switch (objecttype) {
	case ObjectTypeEnum.MODEL:
		objectentry = this.uidModelMap.get(uid);
		break;
	case ObjectTypeEnum.GROUP:
		objectentry = this.uidGroupMap.get(uid);
		break;
	case ObjectTypeEnum.CHARACTER:
		objectentry = this.uidCharacterMap.get(uid);
		break;
	case ObjectTypeEnum.WAYPOINT:
		objectentry = this.uidWaypointMap.get(uid);
		break;
	case ObjectTypeEnum.STATE:
		objectentry = this.uidStateMap.get(uid);
		break;
	case ObjectTypeEnum.MESHBUTTON:
		objectentry = this.uidMeshButtonMap.get(uid);
		break;	
	case ObjectTypeEnum.VIDEOTEXTURE:
		objectentry = this.uidVideoTextureMap.get(uid);
		break;
	case ObjectTypeEnum.COLOURCHANGE:
		objectentry = this.uidColourChangeMap.get(uid);
		break;	
	case ObjectTypeEnum.MESHLABEL:
		objectentry = this.uidMeshLabelMap.get(uid);
		break;		
	case ObjectTypeEnum.PARTICLEEMITTER:
		objectentry = this.uidParticleEmitterMap.get(uid);
		break;
	case ObjectTypeEnum.ACTION:
		objectentry = this.uidActionMap.get(uid);
		break;
	case ObjectTypeEnum.AUDIOCLIP:
		objectentry = this.uidAudioClipMap.get(uid);
		break;
	case ObjectTypeEnum.SCREENBUTTON:
		objectentry = this.uidScreenButtonMap.get(uid);	
		break;
	case ObjectTypeEnum.DIALOGENGINE:
		objectentry = this.uidDialogEngineMap.get(uid);	
		break;
	case ObjectTypeEnum.TEXTTOSPEECH:
		objectentry = this.uidTextToSpeechMap.get(uid);	
		break;
	case ObjectTypeEnum.SPEECHTOTEXT:
		objectentry = this.uidSpeechToTextMap.get(uid);	
		break;
	case ObjectTypeEnum.LIGHT:
		objectentry = this.uidLightMap.get(uid);	
		break;		
	case ObjectTypeEnum.PHYSICSBODY:
		objectentry = this.uidPhysicsBodyMap.get(uid);	
		break;
	case ObjectTypeEnum.PHYSICSCONSTRAINT:
		objectentry = this.uidPhysicsConstraintMap.get(uid);	
		break;	
	case ObjectTypeEnum.STAGE:
		objectentry = this.uidStageMap.get(uid);	
	case ObjectTypeEnum.CLASS:
		if (classuid != null)
		{
			let classentry = this.uidClassMap.get(classuid);
			if (classentry != undefined)
			{
				if (uid != null)
				{
					objectentry = classentry.get(uid);
				}
				else
				{
					objectentry = classentry;
				}
			}
		}
		break;		
	}
	return objectentry;	

}


CubeSide.prototype.getUIDClassMap = function(classuid){
	var objectentry = null;
	if (classuid != null)
	{
		objectentry = this.uidClassMap.get(classuid);
		if (objectentry == undefined)
		{
			objectentry = null;
		}
	}
	return objectentry;
	
}



/* CubeSide.prototype.addObjectReferences = function(){		

	if (this.referenceObjectArray.length > 0)
	{
		for (let i = 0; i < this.referenceObjectArray.length; i++)
		{
			this.referenceObjectArray[i][0] = this.getUIDObjectMap(this.referenceObjectArray[i][0], this.referenceObjectArray[i][1], this.referenceObjectArray[i][2], true );
			console.log("add object reference " + this.referenceObjectArray[i][0] + " " + this.referenceObjectArray[i][1] + " " + this.referenceObjectArray[i][2]);
		}
		this.referenceObjectArray.length = 0;
	}	

} */	
	
CubeSide.prototype.setCubeSideState = function(value){
	
	this.currentCubeSideState = value;
}

CubeSide.prototype.getCubeSideState = function(){
	
	return this.currentCubeSideState;
}

CubeSide.prototype.getCurrentStateOrder = function(){
	
	return this.currentStateOrder;
}

CubeSide.prototype.setCurrentStateOrder = function(value){
	
	this.currentStateOrder = value;
}

CubeSide.prototype.setCurrentClosingStateOrder = function(value){
	
	this.currentClosingStateOrder = value;
}

CubeSide.prototype.getCurrentClosingStateOrder = function(){
	
	return this.currentClosingStateOrder;
}

CubeSide.prototype.setCurrentOpeningStateOrder = function(value){
	
	this.currentOpeningStateOrder = value;
}

CubeSide.prototype.getCurrentOpeningStateOrder = function(){
	
	return this.currentOpeningStateOrder;
}

CubeSide.prototype.setCurrentTimeoutStateOrder = function(value){
	
	this.currentTimeoutStateOrder = value;
}

CubeSide.prototype.getCurrentTimeoutStateOrder = function(){
	
	return this.currentTimeoutStateOrder;
}

CubeSide.prototype.isBoxType = function(){
	return this.boxType;
}

CubeSide.prototype.isPhysicsPresent = function(){
	return this.physicsPresent;
}

CubeSide.prototype.isVideoTexturePresent = function(){
	return this.videoTexturePresent;
}

CubeSide.prototype.isMeshLabelPresent = function(){
	return this.meshLabelPresent;
}

CubeSide.prototype.isAudioPresent = function(){
	return this.audioPresent;
}

CubeSide.prototype.isVoicePresent = function(){
	return this.voicePresent;
}

CubeSide.prototype.isListeningPresent = function(){
	return this.listeningPresent;
}

CubeSide.prototype.initialisePhysics = function(){
	if (this.physicsPresent)
	{
		this.physicsClock.start();
		for (const [key, value] of this.uidPhysicsBodyMap) {
			value.initialisePhysicsObject();
		}
		for (const [key, value] of this.uidPhysicsConstraintMap) {
			value.initialisePhysicsObject();
		}
	}

}

CubeSide.prototype.addPhysicsObjects = function(){
	if (this.physicsPresent)
	{
		for (const [key, value] of this.uidPhysicsBodyMap) {
			if (value.getEnabled())
			{
				value.addPhysicsObject();
			}
		}
		for (const [key, value] of this.uidPhysicsConstraintMap) {
			if (value.getEnabled())
			{
				value.addPhysicsObject();
			}
		}
	}

}

CubeSide.prototype.removePhysicsObjects = function(){
	if (this.physicsPresent)
	{
		this.physicsClock.stop();
		for (const [key, value] of this.uidPhysicsBodyMap) {
			value.removePhysicsObject();
		}
		for (const [key, value] of this.uidPhysicsConstraintMap) {
			value.removePhysicsObject();
		}
	}

}

CubeSide.prototype.initialiseMediaPlayback = function(){
	
	if (this.videoTexturePresent)
	{
		for (const [key, value] of this.uidVideoTextureMap) {
			value.InitialisePlayback();
		}
	}
	if (this.audioPresent)
	{
		for (const [key, value] of this.uidAudioClipMap) {
			value.InitialisePlayback();
		}
	}
	if ((this.voicePresent) && (g_isIOS))
	{
		for (const [key, value] of this.uidTextToSpeechMap) {
			value.InitialisePlayback();
		}
	}

}

CubeSide.prototype.initialiseAudioPlayback = function(){
	if ((this.voicePresent) && (g_isIOS))
	{
		for (const [key, value] of this.uidTextToSpeechMap) {
			value.InitialisePlayback();
		}
	}
	
}

CubeSide.prototype.activeMeshLabelScroll = function(){
	if (this.meshLabelPresent)
	{
		for (const [key, value] of this.uidMeshLabelMap) {
			value.StartScroll();
		}
	}

}

CubeSide.prototype.pauseMeshLabelScroll = function(){
	if (this.meshLabelPresent)
	{
		for (const [key, value] of this.uidMeshLabelMap) {
			value.PauseScroll();
		}
	}

}

CubeSide.prototype.activeMediaPlayback = function(){
	if (this.videoTexturePresent)
	{
		for (const [key, value] of this.uidVideoTextureMap) {
			value.StartActivePlayback();
		}
	}
	if (this.audioPresent)
	{
		for (const [key, value] of this.uidAudioClipMap) {
			value.StartActivePlayback();
		}
	}
}

CubeSide.prototype.pauseMediaPlayback = function(){
	if (this.videoTexturePresent)
	{
		for (const [key, value] of this.uidVideoTextureMap) {
			value.pause();
		}
	}
	if (this.audioPresent)
	{
		for (const [key, value] of this.uidAudioClipMap) {
			value.pause();
		}
	}
	if (this.voicePresent)
	{
		for (const [key, value] of this.uidTextToSpeechMap) {
			value.cancel();
		}
	}
	if (this.listeningPresent)
	{
		for (const [key, value] of this.uidSpeechToTextMap) {
			value.abort();
		}
	}
}

CubeSide.prototype.mediaDeactivate = function(){
	if (this.videoTexturePresent)
	{
		for (const [key, value] of this.uidVideoTextureMap) {
			value.deactivate();
		}
	}
	if (this.audioPresent)
	{
		for (const [key, value] of this.uidAudioClipMap) {
			value.deactivate();
		}
	}
	if (this.voicePresent)
	{
		for (const [key, value] of this.uidTextToSpeechMap) {
			value.deactivate();
		}
	}
}

CubeSide.prototype.mediaReactivate = function(){
	if (this.videoTexturePresent)
	{
		for (const [key, value] of this.uidVideoTextureMap) {
			value.reactivate();
		}
	}
	if (this.audioPresent)
	{
		for (const [key, value] of this.uidAudioClipMap) {
			value.reactivate();
		}
	}
	if (this.voicePresent)
	{
		for (const [key, value] of this.uidTextToSpeechMap) {
			value.reactivate();
		}
	}
}

CubeSide.prototype.drawScreenButtons = function(){
	if (this.uidScreenButtonMap != null)
	{
		
		for (const [key, value] of this.uidScreenButtonMap) {
			value.renderButton();
		}
	}
}

CubeSide.prototype.setScreenButtonsCurrentRenderState = function(value){
	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.setCurrentRendered(value);
		}
	}
}

CubeSide.prototype.resizeScreenButtons = function(){
	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.resizeButton();
		}
	}
}

CubeSide.prototype.screenButtonCollisionDetection = function(touchposition, touchtype){
	
	var istouched = false;
	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.collisionDetection(touchposition, touchtype);
			if (value.isTouched())
			{
				istouched = true;
			}
		}

	}
	return istouched;
	
}

CubeSide.prototype.getFaceRotation = function(){
	
	return this.storedSideRotation.clone();
}

CubeSide.prototype.getStageStartPosY = function(stageuid){
	
	var posy = 0;
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{

			posy = this.arStagesArray[i].getStageStartPosY();
			break;
		}
	}
	return posy;
}


CubeSide.prototype.getStageEntranceType = function(stageuid){
	
	
	var entrancetype = EntranceTypeEnum.NONE;
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			
			entrancetype = this.arStagesArray[i].getEntranceType();
			break;
		}
	}
	return entrancetype;
}


CubeSide.prototype.setLidSegmentVisibility = function(value){
	
	if (this.leftLidArray.length > 0)
	{
		this.leftLidArray[0][1].visible = value;
	}
	if (this.numLids == 2)
	{
		this.rightLidArray[0][1].visible = value;

	}
	
}

CubeSide.prototype.setBoxLidVisibility = function(value){
	
	if (this.boxLid != null)
	{
		this.boxLid.visible = value;
	}

}

CubeSide.prototype.initialiseStages = function(allstates = true){
	this.cubeControlEnabled = false;
	if (allstates)
	{
		if (this.openingStatePresent)
		{
			this.openingStatePending = true;
			for (let i = 0; i < this.arOpeningStatesArray.length; i++)
			{
				this.arOpeningStatesArray[i].initialise();
			}
			for (let i = 0; i < this.arOpeningClassStatesArray.length; i++)
			{
				this.arOpeningClassStatesArray[i].initialise();
			}
			this.currentOpeningStateOrder = 1;		
		}
		
		for (let i = 0; i < this.arStagesArray.length; i++)
		{
			this.arStagesArray[i].initialiseContent();
		}
		this.currentStateOrder = 1;
		for (let i = 0; i < this.arStatesArray.length; i++)
		{
			this.arStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arClassStatesArray.length; i++)
		{
			this.arClassStatesArray[i].initialise();
		}
	}
	
	if (this.closingStatePresent)
	{
		this.closingStatePending = true;
		for (let i = 0; i < this.arClosingStatesArray.length; i++)
		{
			this.arClosingStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arClosingClassStatesArray.length; i++)
		{
			this.arClosingClassStatesArray[i].initialise();
		}
		this.currentClosingStateOrder = 1;		
	}
	if (this.timeoutStatePresent)
	{
		this.timeoutStatePending = true;
		for (let i = 0; i < this.arTimeoutStatesArray.length; i++)
		{
			this.arTimeoutStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arTimeoutClassStatesArray.length; i++)
		{
			this.arTimeoutClassStatesArray[i].initialise();
		}
		this.currentTimeoutStateOrder = 1;		
	}

	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.initialise();
		}
	}
	
}

CubeSide.prototype.getCubeControlEnabled = function(){
	return this.cubeControlEnabled;
}

CubeSide.prototype.setCubeControlEnabled = function(value){
	this.cubeControlEnabled = value;
}
	
//used for initial orientating of side and its contents 
CubeSide.prototype.setSideStageRotation = function(rotation, stageuid){
	

	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{

			this.arStagesArray[i].setSideStageRotation( rotation );
			break;
		}
	}
}

//used for flipping stage when side pressed etc
CubeSide.prototype.setStageRotation = function(rotx, roty, rotz, stageuid){
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			this.arStagesArray[i].setStageRotation( rotx, roty, rotz );
			break;
		}
	}
}

CubeSide.prototype.setStagePivotRotation = function(rotx, roty, rotz, stageuid){
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			this.arStagesArray[i].setStagePivotRotation( rotx, roty, rotz );
			break;
		}
	}
}

CubeSide.prototype.setStageVisiblity = function(visiblity, stageuid){
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			this.arStagesArray[i].setStageVisiblity( visiblity );
			break;
		}
	}
}

CubeSide.prototype.getStageEndWidthPosY = function(stageuid){
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			return this.arStagesArray[i].getStageEndWidthPosY();
			break;
		}
	}
}

CubeSide.prototype.setStageElevation = function(value, stageuid){
	
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		if (this.arStagesArray[i].getStageUID() == stageuid)
		{
			this.arStagesArray[i].setStageElevation( value );
			break;
		}
	}
}

CubeSide.prototype.setupStages = function(){
	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		this.arStagesArray[i].initialiseContent();
		this.arStagesArray[i].calcStageStartPosition();
	}
	for (let i = 0; i < this.arStatesArray.length; i++)
	{
		this.arStatesArray[i].initialise();
	}
	for (let i = 0; i < this.arClassStatesArray.length; i++)
	{
		this.arClassStatesArray[i].initialise();
	}
	if (this.closingStatePresent)
	{
		this.closingStatePending = true;
		for (let i = 0; i < this.arClosingStatesArray.length; i++)
		{
			this.arClosingStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arClosingClassStatesArray.length; i++)
		{
			this.arClosingClassStatesArray[i].initialise();
		}
		this.currentClosingStateOrder = 1;		
	}
	if (this.timeoutStatePresent)
	{
		this.timeoutStatePending = true;
		for (let i = 0; i < this.arTimeoutStatesArray.length; i++)
		{
			this.arTimeoutStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arTimeoutClassStatesArray.length; i++)
		{
			this.arTimeoutClassStatesArray[i].initialise();
		}
		this.currentTimeoutStateOrder = 1;		
	}
	if (this.openingStatePresent)
	{
		this.openingStatePending = true;
		for (let i = 0; i < this.arOpeningStatesArray.length; i++)
		{
			this.arOpeningStatesArray[i].initialise();
		}
		for (let i = 0; i < this.arOpeningClassStatesArray.length; i++)
		{
			this.arOpeningClassStatesArray[i].initialise();
		}
		this.currentOpeningStateOrder = 1;		
	}
	
	this.currentStateOrder = 1;
}
	
CubeSide.prototype.updateSceneGroup = function(param){		
	if (param)
	{
		if ( this.markerRoot.visible )
		{
			//console.log("Confidence " + this.markerControls.confidenceLevel());
			this.markerGroup.add( this.sceneGroup );
			this.storedPosX = this.markerRoot.position.x;
			this.storedPosY = this.markerRoot.position.y;
			this.storedPosZ = this.markerRoot.position.z;
			this.storedCounter = 0;
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		if (this.storedCounter < 4)
		{
			this.markerRoot.position.set(this.storedPosX, this.storedPosY, this.storedPosZ);
			this.markerRoot.visible = true;
			this.storedCounter++;
			return true;
		}
		else
		{
			return false;
		}
		
	}
}
  
CubeSide.prototype.openCloseLid = function(value){
	var _this = this;
	
	var angle = 0;
	for(let i=0;i<_this.leftLidArray.length;i++)
	{
		if (i == 0)
		{
			angle = -value;
		}
		else
		{
			if (i % 2)
			{
				angle = value * 2;
			}
			else
			{
				angle = -(value * 2);
			}
		}
		_this.leftLidArray[i][1].rotation.z = THREE.Math.degToRad(angle);
	}
	

	if (_this.numLids == 2)
	{
		for(let i=0;i<_this.rightLidArray.length;i++)
		{	
			if (i == 0)
			{
				angle = value;
			}
			else
			{
				if (i % 2)
				{
					angle = -(value * 2);
				}
				else
				{
					angle = value * 2;
				}
			}
			_this.rightLidArray[i][1].rotation.z = THREE.Math.degToRad(angle);
		}
	}
}	
  
CubeSide.prototype.update = function(){		

	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.update();
		}
	}

	for (let i = 0; i < this.arStagesArray.length; i++)
	{
		this.arStagesArray[i].update();
	}
	if (this.physicsPresent)
	{
		if (this.uidPhysicsConstraintMap != null)
		{
			for (const [key, value] of this.uidPhysicsConstraintMap) {
				if (value.getEnabled())
				{
					value.applyJointMovement();
				}
			}
		}
		
		let deltaTime = this.physicsClock.getDelta();
		// Step world
		g_physicsWorld.stepSimulation( deltaTime, 10 );
		if (this.uidPhysicsBodyMap != null)
		{
			for (const [key, value] of this.uidPhysicsBodyMap) {
				value.update();
			}
		}
		if ((this.physicsControlType == PhysicsControlTypeEnum.CUBE) && (this.cubeControlEnabled) && (this.parentCube.getCubeState() == CubeStateEnum.ACTIVE) && (this.parentCube.getCubeControlActive()))
		{
			for (let i = 0; i < this.arStagesArray.length; i++)
			{
				if (this.arStagesArray[i].cubeCorrection())
				{
					//this.arStagesArray[i].getPhysicsObject3D().quaternion.copy(this.parentCube.getCubeRotation().conjugate());
					this.arStagesArray[i].getPhysicsObject3D().quaternion.copy(this.parentCube.getMedianCubeRotation().conjugate());
				}
			}
			
		}
	}
	
	
	if (this.parentCube.getCubeState() == CubeStateEnum.ACTIVE)
	{
		for (let i = 0; i < this.arStatesArray.length; i++)
		{
			if (this.arStatesArray[i].getStateOrder() == this.currentStateOrder)
			{
				this.arStatesArray[i].update();
			}
		}
		for (let i = 0; i < this.arClassStatesArray.length; i++)
		{
			this.arClassStatesArray[i].update();
		}
		
		
		
		/* if (this.physicsPresent)
		{
			if (this.uidPhysicsConstraintMap != null)
			{
				for (const [key, value] of this.uidPhysicsConstraintMap) {
					value.applyJointMovement();
				}
			}
			
			let deltaTime = this.physicsClock.getDelta();
			// Step world
            g_physicsWorld.stepSimulation( deltaTime, 10 );
			if (this.uidPhysicsBodyMap != null)
			{
				for (const [key, value] of this.uidPhysicsBodyMap) {
					value.update();
				}
			}
		} */
	}
	
	
	
	if (this.parentCube.getCubeState() == CubeStateEnum.TRANSITION2ACTIVE)
	{
		if (this.openingStatePending)
		{
			var result = false;
			for (let i = 0; i < this.arOpeningStatesArray.length; i++)
			{
				if (this.arOpeningStatesArray[i].getStateOrder() == this.currentOpeningStateOrder)
				{
					
					this.arOpeningStatesArray[i].update();
				}
				if ((this.arOpeningStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arOpeningStatesArray[i].getStateOrder() >= this.currentOpeningStateOrder))
				{
					result = true;
				}
			}
			for (let i = 0; i < this.arOpeningClassStatesArray.length; i++)
			{
				this.arOpeningClassStatesArray[i].update();
				if (this.arOpeningClassStatesArray[i].isActioning())
				{
					result = true;
				}
			}
			this.openingStatePending = result;
		}
	}
	
	
	
	if (this.parentCube.getCubeState() == CubeStateEnum.CLOSING)
	{
		if (this.closingStatePending)
		{
			var result = false;
			for (let i = 0; i < this.arClosingStatesArray.length; i++)
			{
				if (this.arClosingStatesArray[i].getStateOrder() == this.currentClosingStateOrder)
				{
					this.arClosingStatesArray[i].update();
					
				}

				if ((this.arClosingStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arClosingStatesArray[i].getStateOrder() >= this.currentClosingStateOrder))
				{
					result = true;
				}
			}
			for (let i = 0; i < this.arClosingClassStatesArray.length; i++)
			{
				this.arClosingClassStatesArray[i].update();
				if (this.arClosingClassStatesArray[i].isActioning())
				{
					result = true;
				}
			}
			this.closingStatePending = result;
		}
	}

	if (this.parentCube.getCubeState() == CubeStateEnum.TRANSITION2TIMEOUT)
	{
		if (this.timeoutStatePending)
		{
			var result = false;
			for (let i = 0; i < this.arTimeoutStatesArray.length; i++)
			{
				if (this.arTimeoutStatesArray[i].getStateOrder() == this.currentTimeoutStateOrder)
				{
					this.arTimeoutStatesArray[i].update();
					
				}

				if ((this.arTimeoutStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arTimeoutStatesArray[i].getStateOrder() >= this.currentTimeoutStateOrder))
				{
					result = true;
				}
			}
			for (let i = 0; i < this.arTimeoutClassStatesArray.length; i++)
			{
				this.arTimeoutClassStatesArray[i].update();
				if (this.arTimeoutClassStatesArray[i].isActioning())
				{
					result = true;
				}
			}
			this.timeoutStatePending = result;
		}
	}


}

CubeSide.prototype.removeFromParent = function(){		

	this.markerGroup.remove( this.sceneGroup );
	this.markerRoot.remove(this.markerGroup);
	g_scene.remove(this.markerRoot);
	
	if (this.boxLid != null)
	{
		this.sidefaceGroup.remove( this.boxLid );
		disposeSceneMesh(this.boxLid);			
	}
	this.boxLid = null;

	if (this.leftLidArray != null)
	{
		for(let i=0;i<this.leftLidArray.length;i++)
		{
			this.leftLidArray[i][1].remove(this.leftLidArray[i][0])

			disposeSceneMesh(this.leftLidArray[i][0]);
			
			if (i == 0)
			{
				this.sidefaceGroup.remove( this.leftLidArray[i][1] );
			}
			else
			{
				this.leftLidArray[i - 1][1].remove(this.leftLidArray[i][1]);
			}
			this.leftLidArray[i][0] = null; 
		}
	}
	this.leftLidArray.length = 0;
	this.leftLidArray = null;

	if (this.rightLidArray != null)
	{
		for(let i=0;i<this.rightLidArray.length;i++)
		{
			this.rightLidArray[i][1].remove(this.rightLidArray[i][0])

			disposeSceneMesh(this.rightLidArray[i][0]);
			
			if (i == 0)
			{
				this.sidefaceGroup.remove( this.rightLidArray[i][1] );
			}
			else
			{
				this.rightLidArray[i - 1][1].remove(this.rightLidArray[i][1]);
			}
			this.rightLidArray[i][0] = null; 
		}
	} 
	this.rightLidArray.length = 0;
	this.rightLidArray = null;
	
	if (this.arStagesArray != null)
	{
		for(let i=0;i<this.arStagesArray.length;i++)
		{
			this.arStagesArray[i].removeFromParent();
		}
	}

	//group used for face
	this.sceneGroup.remove(this.sidefaceGroup);
	this.cubefacesgroup.remove(this.sidefaceGroup);
}


  
CubeSide.prototype.dispose = function(){		  
  
		
		//this.marker = null;
		//this.manager = null; 
	
		/* for (var i = this.markerRoot.children.length - 1; i >= 0; i--) {
			this.markerRoot.remove(this.markerRoot.children[i]);
		} */
	
		
	this.uidWaypointMap.clear();
	this.uidWaypointMap = null;
	this.uidModelMap.clear();
	this.uidModelMap = null;
	this.uidCharacterMap.clear();
	this.uidCharacterMap = null;
	this.uidGroupMap.clear();
	this.uidGroupMap = null;
	this.uidStateMap.clear();
	this.uidStateMap = null;
	this.uidMeshButtonMap.clear();
	this.uidMeshButtonMap = null;
	if (this.uidScreenButtonMap != null)
	{
		for (const [key, value] of this.uidScreenButtonMap) {
			value.dispose();
		}
	}
	this.uidScreenButtonMap.clear();
	this.uidScreenButtonMap = null;
	this.uidVideoTextureMap.clear();
	this.uidVideoTextureMap = null;
	this.uidColourChangeMap.clear();
	this.uidColourChangeMap = null;
	this.uidMeshLabelMap.clear();
	this.uidMeshLabelMap = null;
	if (this.uidParticleEmitterMap != null)
	{
		for (const [key, value] of this.uidParticleEmitterMap) {
			value.setEnabled(false);
		}
	}
	this.uidParticleEmitterMap.clear();
	this.uidParticleEmitterMap = null;
	this.uidAudioClipMap.clear();
	this.uidAudioClipMap = null;
	this.uidActionMap.clear();
	this.uidActionMap = null;
	this.uidDialogEngineMap.clear();
	this.uidDialogEngineMap = null;
	this.uidTextToSpeechMap.clear();
	this.uidTextToSpeechMap = null;
	this.uidSpeechToTextMap.clear();
	this.uidSpeechToTextMap = null;
	this.uidLightMap.clear();
	this.uidLightMap = null;
	if (this.uidPhysicsBodyMap != null)
	{
		for (const [key, value] of this.uidPhysicsBodyMap) {
			value.dispose();
		}
	}
	this.uidPhysicsBodyMap.clear();
	this.uidPhysicsBodyMap = null;
	if (this.uidPhysicsConstraintMap != null)
	{
		for (const [key, value] of this.uidPhysicsConstraintMap) {
			value.dispose();
		}
	}
	this.uidPhysicsConstraintMap.clear();
	this.uidPhysicsConstraintMap = null;
	this.uidStageMap.clear();
	this.uidStageMap = null;
	this.physicsClock.stop();
	this.physicsClock = null;	
	
	if (this.referenceObjectArray != null)
	{
		if (this.referenceObjectArray.length > 0)
		{
			for (let i = 0; i < this.referenceObjectArray.length; i++)
			{
				this.referenceObjectArray[i] = null;
			}
			this.referenceObjectArray.length = 0;
			this.referenceObjectArray = null;
		}
	}
	this.videoTexturePresent = null;
	this.audioPresent = null;
	this.voicePresent = null;
	this.listeningPresent = null;
	this.helpText = null;
	this.introText = null;		
	
	//remove states
	if (this.arStatesArray != null)
	{
		for(let i=0;i<this.arStatesArray.length;i++)
		{
			this.arStatesArray[i].dispose();
			this.arStatesArray[i] = null;
		}
		this.arStatesArray.length = 0;
		this.arStatesArray = null;
	}
	if (this.arClassStatesArray != null)
	{
		for(let i=0;i<this.arClassStatesArray.length;i++)
		{
			this.arClassStatesArray[i].dispose();
			this.arClassStatesArray[i] = null;
		}
		this.arClassStatesArray.length = 0;
		this.arClassStatesArray = null;
	}
	
	if (this.arClosingStatesArray != null)
	{
		for(let i=0;i<this.arClosingStatesArray.length;i++)
		{
			this.arClosingStatesArray[i].dispose();
			this.arClosingStatesArray[i] = null;
		}
		this.arClosingStatesArray.length = 0;
		this.arClosingStatesArray = null;
	}
	
	if (this.arClosingClassStatesArray != null)
	{
		for(let i=0;i<this.arClosingClassStatesArray.length;i++)
		{
			this.arClosingClassStatesArray[i].dispose();
			this.arClosingClassStatesArray[i] = null;
		}
		this.arClosingClassStatesArray.length = 0;
		this.arClosingClassStatesArray = null;
	}
	
	if (this.arOpeningStatesArray != null)
	{
		for(let i=0;i<this.arOpeningStatesArray.length;i++)
		{
			this.arOpeningStatesArray[i].dispose();
			this.arOpeningStatesArray[i] = null;
		}
		this.arOpeningStatesArray.length = 0;
		this.arOpeningStatesArray = null;
	}
	
	if (this.arOpeningClassStatesArray != null)
	{
		for(let i=0;i<this.arOpeningClassStatesArray.length;i++)
		{
			this.arOpeningClassStatesArray[i].dispose();
			this.arOpeningClassStatesArray[i] = null;
		}
		this.arOpeningClassStatesArray.length = 0;
		this.arOpeningClassStatesArray = null;
	}
	
	if (this.arTimeoutStatesArray != null)
	{
		for(let i=0;i<this.arTimeoutStatesArray.length;i++)
		{
			this.arTimeoutStatesArray[i].dispose();
			this.arTimeoutStatesArray[i] = null;
		}
		this.arTimeoutStatesArray.length = 0;
		this.arTimeoutStatesArray = null;
	}
	
	if (this.arTimeoutClassStatesArray != null)
	{
		for(let i=0;i<this.arTimeoutClassStatesArray.length;i++)
		{
			this.arTimeoutClassStatesArray[i].dispose();
			this.arTimeoutClassStatesArray[i] = null;
		}
		this.arTimeoutClassStatesArray.length = 0;
		this.arTimeoutClassStatesArray = null;
	}
	
	//remove groups 
	this.markerGroup.remove( this.sceneGroup );
	this.markerRoot.remove(this.markerGroup);
	g_scene.remove(this.markerRoot);
	//group used for face
	this.sceneGroup.remove(this.sidefaceGroup);
	this.cubefacesgroup.remove(this.sidefaceGroup);	
	
	if (this.boxLid != null)
	{
		this.sidefaceGroup.remove( this.boxLid );
		disposeObjectMesh(this.boxLid);			
	}
	this.boxLid = null;

	if (this.leftLidArray != null)
	{
		for(let i=0;i<this.leftLidArray.length;i++)
		{
			this.leftLidArray[i][1].remove(this.leftLidArray[i][0])

			disposeObjectMesh(this.leftLidArray[i][0]);
			
			if (i == 0)
			{
				this.sidefaceGroup.remove( this.leftLidArray[i][1] );
			}
			else
			{
				this.leftLidArray[i - 1][1].remove(this.leftLidArray[i][1]);
			}
			this.leftLidArray[i][0] = null; 
		}
	}
	this.leftLidArray.length = 0;
	this.leftLidArray = null;

	if (this.rightLidArray != null)
	{
		for(let i=0;i<this.rightLidArray.length;i++)
		{
			this.rightLidArray[i][1].remove(this.rightLidArray[i][0])

			disposeObjectMesh(this.rightLidArray[i][0]);
			
			if (i == 0)
			{
				this.sidefaceGroup.remove( this.rightLidArray[i][1] );
			}
			else
			{
				this.rightLidArray[i - 1][1].remove(this.rightLidArray[i][1]);
			}
			this.rightLidArray[i][0] = null; 
		}
	} 
	this.rightLidArray.length = 0;
	this.rightLidArray = null;
	
	if (this.texturesArray != null)
	{
		for(let i=0;i<this.texturesArray.length;i++)
		{
			this.texturesArray[i].dispose();
			this.texturesArray[i] = null;
		}
		this.texturesArray.length = 0;
		this.texturesArray = null;
	}
	
	//dispose stages
	if (this.arStagesArray != null)
	{
		for(let i=0;i<this.arStagesArray.length;i++)
		{
			this.arStagesArray[i].removeFromParent();
			this.arStagesArray[i].dispose();
			this.arStagesArray[i] = null;
		}
		this.arStagesArray.length = 0;
		this.arStagesArray = null;
	}

  
}
  
	
	
	/* static applyMatrixOfMesh(mesh) { // Apply Matrix so that intersect of raycaster works properly
		mesh.updateMatrix();
		mesh.geometry.applyMatrix(mesh.matrix);

		mesh.position.set(0, 0, 0);
		mesh.rotation.set(0, 0, 0);
		mesh.updateMatrix();
	} */
  



