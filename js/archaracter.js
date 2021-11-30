const AnimationCrossFadeTypeEnum = {
	IMMEDIATE : 0,
	AFTERCURRENTLOOP : 1
}

ARCharacter = function(item, parentobject, parentcube, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.parentObject = parentobject;
	this.parentCube = parentcube;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.storedVisible = true;
	this.model = null;
	this.lookatHelper = null;
	this.loadedModel = null;
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialStoredRotation = new THREE.Vector3(0, 0, 0);
	this.currentPosition = new THREE.Vector3(0, 0, 0);
	this.currentRotation = new THREE.Vector3(0, 0, 0);
	this.currentWorldRotation = new THREE.Vector3(0, 0, 0);
	this.currentRotatedModelUp = new THREE.Vector3(0,0,0);
	this.currentWorldQuaternion = new THREE.Quaternion();
	this.modelPitchStored = null;
	this.modelYawStored = null;
	this.modelRollStored = null;
	//this.isCurrentCameraOverride = false;
	//this.isNextCameraOverride = null;
	//this.nextCameraOverrideAnimationID = null;	
	//this.nextCameraOverrideAnimationName = null;
	//this.cameraOverride = null;
	//this.cameraOverridesMap = new Map();	
	this.mixer = null; 
	this.clock = null;
	this.buttonArray = new Array;
	this.arStatesArray = new Array;
	this.actions = new Array;
	
	this.currentStateOrder = 1;
	this.textToSpeech = null; 
	this.speechToText = null; 
	this.dialogEngine = null; 
	this.currentAnimationName = null;
	this.currentAnimation = null;
	this.currentAnimationID = null;
	this.nextAnimationName = null;
	this.nextAnimation = null;
	this.nextAnimationID = null;
	this.defaultAnimationID = 0;
	this.setWeight = function( action, weight ) {

		action.enabled = true;
		action.setEffectiveTimeScale( 1 );
		action.setEffectiveWeight( weight );

	};
	
	
	function cameraOrientatedObject(orientatedbones, speed)
	{
		
		this.orientatedBones = orientatedbones;
		this.turnSpeed = speed;
	}

	this.modelTextureLoaded = function(texture, model)
	{
		
		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				let oldtexture = child.material.map;
				oldtexture.dispose();
				var oldmaterial = child.material;
				texture.encoding = THREE.sRGBEncoding;
				texture.flipY = false;
				var new_material = child.material.clone();
				let oldtexture2 = new_material.map;
				oldtexture2.dispose();
				child.material = new_material;
				child.material.map = texture;
				oldmaterial.dispose();
				child.material.needsUpdate = true; 
			}
			
		});	

	};

	this.modelLoaded = function(loadedmodel, modelitem, clone, filetype) {

		
		if (clone)
		{
			if (filetype == AssetFileTypeEnum.GLB)
			{
				_this.model = THREE.SkeletonUtils.clone(loadedmodel.scene);
			}
			else
			{
				_this.model = THREE.SkeletonUtils.clone(loadedmodel);
			}
		}
		else
		{
			if (filetype == AssetFileTypeEnum.GLB)
			{
				_this.loadedModel = loadedmodel;
				_this.model = loadedmodel.scene;
			}
			else
			{
				_this.model = loadedmodel;
			}
		}
		_this.model.traverse( function ( child ) {
			if ( child.isMesh )
			{
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if (child instanceof THREE.Bone) {
				//console.log("bone name " + child.name);
			}
		} );
		
		if (_this.UID != null)
		{
			_this.model.name = _this.UID;
		}
		
		if (_this.buttonArray != null)
		{
			for (let i = 0; i < _this.buttonArray.length; i++)
			{
				if (_this.buttonArray[i].getNodeName() != null)
				{
					_this.buttonArray[i].setButtonMesh(_this.model);
				}
			}
		}
		
		if (modelitem.hasOwnProperty('takes'))
		{
			if (modelitem.takes.length > 0)
			{
				
				 _this.mixer = new THREE.AnimationMixer( _this.model );
				_this.clock = new THREE.Clock();
				var animations = loadedmodel.animations;
				var defaultclipfound = false;
				
	 			for (let i = 0; i < modelitem.takes.length; i++)
				{
					var overrideentry = null;
					var	addcameraentry = null;
					var action = null;
					
					if ((modelitem.takes[i].take.hasOwnProperty('cameraoveride')) || (modelitem.takes[i].take.hasOwnProperty('addcamera'))) 
					{
						if (modelitem.takes[i].take.hasOwnProperty('cameraoveride'))
						{
							let clip = THREE.AnimationClip.findByName( animations, modelitem.takes[i].take.id).clone();
							//action = _this.mixer.clipAction( (THREE.AnimationClip.findByName( animations, modelitem.takes[i].take.id)).clone() );
							var overridebones = new Array;
							if (modelitem.takes[i].take.cameraoveride.hasOwnProperty('bones'))
							{
								
								_this.model.traverse( function ( child ) {
									if (child.isBone) {
										for (let j = 0; j < modelitem.takes[i].take.cameraoveride.bones.length; j++)
										{
											if (modelitem.takes[i].take.cameraoveride.bones[j].hasOwnProperty('bone'))
											{
												if (child.name == modelitem.takes[i].take.cameraoveride.bones[j].bone.name)
												{
													let x = null;
													let y = null;
													let z = null;
													//console.log(modelitem.takes[i].take.name + " cameraoveride add entry for " + child.name);
													if (modelitem.takes[i].take.cameraoveride.bones[j].bone.hasOwnProperty('x'))
													{
														if ((modelitem.takes[i].take.cameraoveride.bones[j].bone.x.hasOwnProperty('min')) && (modelitem.takes[i].take.cameraoveride.bones[j].bone.x.hasOwnProperty('min')))
														{
															x = modelitem.takes[i].take.cameraoveride.bones[j].bone.x;
														}
													}
													if (modelitem.takes[i].take.cameraoveride.bones[j].bone.hasOwnProperty('y'))
													{
														if ((modelitem.takes[i].take.cameraoveride.bones[j].bone.y.hasOwnProperty('min')) && (modelitem.takes[i].take.cameraoveride.bones[j].bone.y.hasOwnProperty('min')))
														{
															y = modelitem.takes[i].take.cameraoveride.bones[j].bone.y;
														}
													}
													if (modelitem.takes[i].take.cameraoveride.bones[j].bone.hasOwnProperty('z'))
													{
														if ((modelitem.takes[i].take.cameraoveride.bones[j].bone.z.hasOwnProperty('min')) && (modelitem.takes[i].take.cameraoveride.bones[j].bone.z.hasOwnProperty('min')))
														{
															z = modelitem.takes[i].take.cameraoveride.bones[j].bone.z;
														}
													}
													
													var xyz = new XYZrange(x, y, z);
													var entry = [child, xyz];
													overridebones.push(entry);
													break;
												}
											}
										}
										
									}

								} );
								
							}
							
							//for (let j = 0; j < action.getClip().tracks.length; j++)
							for (let j = 0; j < clip.tracks.length; j++)
							{
								for (let k = 0; k < overridebones.length; k++)
								{
									//console.log("search action track name " +  action.getClip().tracks[j].name);
									if (clip.tracks[j].name.includes(overridebones[k][0].name + '.position'))
									{
										//console.log("splice action track name " +  clip.tracks[j].name + " position");
										clip.tracks.splice(j, 1);
										j--;
									}
									if (clip.tracks[j].name.includes(overridebones[k][0].name + '.quaternion'))
									{		
										//console.log("splice action track name " +  clip.tracks[j].name + " quaternion");
										clip.tracks.splice(j, 1);
										j--;							
										break;
									}
									if (clip.tracks[j].name.includes(overridebones[k][0].name + '.scale'))
									{								
										//console.log("splice action track name " +  clip.tracks[j].name + " scale");
										clip.tracks.splice(j, 1);
										j--;
										break;
									}														
								}
							}
							var turnspeed = 1;
							if (modelitem.takes[i].take.cameraoveride.hasOwnProperty('turnspeed'))
							{
								turnspeed = modelitem.takes[i].take.cameraoveride.turnspeed;
							}
							if (overridebones != null)
							{
								overrideentry = new cameraOrientatedObject(overridebones, turnspeed);
							}
							action = _this.mixer.clipAction( clip );
						}
						
						//add camera direction to existing selected bones movement
						if (modelitem.takes[i].take.hasOwnProperty('addcamera'))
						{
							var addcamerabones = new Array;
							if (modelitem.takes[i].take.addcamera.hasOwnProperty('bones'))
							{
								_this.model.traverse( function ( child ) {
									if (child.isBone) {
										for (let j = 0; j < modelitem.takes[i].take.addcamera.bones.length; j++)
										{
											if (modelitem.takes[i].take.addcamera.bones[j].hasOwnProperty('bone'))
											{
												if (child.name == modelitem.takes[i].take.addcamera.bones[j].bone.name)
												{
													let x = null;
													let y = null;
													let z = null;
													if (modelitem.takes[i].take.addcamera.bones[j].bone.hasOwnProperty('x'))
													{
														if ((modelitem.takes[i].take.addcamera.bones[j].bone.x.hasOwnProperty('min')) && (modelitem.takes[i].take.addcamera.bones[j].bone.x.hasOwnProperty('min')))
														{
															x = modelitem.takes[i].take.addcamera.bones[j].bone.x;
														}
													}
													if (modelitem.takes[i].take.addcamera.bones[j].bone.hasOwnProperty('y'))
													{
														if ((modelitem.takes[i].take.addcamera.bones[j].bone.y.hasOwnProperty('min')) && (modelitem.takes[i].take.addcamera.bones[j].bone.y.hasOwnProperty('min')))
														{
															y = modelitem.takes[i].take.addcamera.bones[j].bone.y;
														}
													}
													if (modelitem.takes[i].take.addcamera.bones[j].bone.hasOwnProperty('z'))
													{
														if ((modelitem.takes[i].take.addcamera.bones[j].bone.z.hasOwnProperty('min')) && (modelitem.takes[i].take.addcamera.bones[j].bone.z.hasOwnProperty('min')))
														{
															z = modelitem.takes[i].take.addcamera.bones[j].bone.z;
														}
													}
													var xyz = new XYZrange(x, y, z);
													var entry = [child, xyz];
													addcamerabones.push(entry);
													break;
												}
											}
										}
										
									}

								} );
							}
							var turnspeed = 1;
							if (modelitem.takes[i].take.addcamera.hasOwnProperty('turnspeed'))
							{
								turnspeed = modelitem.takes[i].take.addcamera.turnspeed;
							}
							if (addcamerabones != null)
							{
								addcameraentry = new cameraOrientatedObject(addcamerabones, turnspeed);
								//this.cameraOverridesMap.set(modelitem.takes[i].take.name, entry);
							}
							action = _this.mixer.clipAction( THREE.AnimationClip.findByName( animations, modelitem.takes[i].take.id) );
						}
					}
					else
					{
						action = _this.mixer.clipAction( THREE.AnimationClip.findByName( animations, modelitem.takes[i].take.id) );
					}
					if (action != null)
					{
						
						if (modelitem.takes[i].take.hasOwnProperty('default'))
						{
							if (modelitem.takes[i].take.default)
							{
								_this.currentAnimation = action;
								
								
								_this.currentAnimationName = modelitem.takes[i].take.name;
								_this.currentAnimationID = i;
								_this.defaultAnimationID = i;
								_this.setWeight( action, 1.0 );
								defaultclipfound = true;
							}
							else
							{
								_this.setWeight( action, 0.0 );
							}
						}
						else
						{
							_this.setWeight( action, 0.0 );
						}
						var entry = [modelitem.takes[i].take.name, action, overrideentry, addcameraentry ];
						_this.actions.push(entry); 
					}
					

				}
				if (!defaultclipfound)
				{
					if (_this.actions.length > 0)
					{
						_this.currentAnimation = _this.actions[0][1];
						_this.currentAnimationName = _this.actions[0][0];
						_this.currentAnimationID = 0;
						_this.defaultAnimationID = 0;
						_this.setWeight( _this.actions[0][1], 1.0  );		
					}
				}
				if (_this.actions.length > 0)
				{
					(_this.actions).forEach( function ( entry ) {

						entry[1].play();

					} ); 
				}						
			}
			
			
		}
		
		if (modelitem.hasOwnProperty('material'))
		{
			var loader = new AjaxTextureLoader(g_loadingManager);
			loader.load( "assets/textures/" + modelitem.material, function( texture ) {	
				_this.modelTextureLoaded(texture, _this.model);
			});
		}
		if (modelitem.hasOwnProperty('materialid'))
		{
			_this.parentCube.setupAssetLoader(modelitem.materialid, AssetLoaderTypeEnum.TEXTURE, _this.modelTextureLoaded, _this.model);
		}
		
		
		if (modelitem.hasOwnProperty('rotx'))
		{
			_this.initialStoredRotation.x = THREE.Math.degToRad(modelitem.rotx);
		}
		if (modelitem.hasOwnProperty('roty'))
		{
			_this.initialStoredRotation.y = THREE.Math.degToRad(modelitem.roty);
		}
		if (modelitem.hasOwnProperty('rotz'))
		{
			_this.initialStoredRotation.z = THREE.Math.degToRad(modelitem.rotz);
		}
		if (modelitem.hasOwnProperty('x'))
		{
			_this.initialStoredPosition.x = modelitem.x;
		}	
		if (modelitem.hasOwnProperty('y'))
		{
			_this.initialStoredPosition.y = modelitem.y;
		}
		if (modelitem.hasOwnProperty('z'))
		{
			_this.initialStoredPosition.z = modelitem.z;
		}
		if (modelitem.hasOwnProperty('visible'))
		{
			_this.storedVisible = modelitem.visible;
		}
		_this.model.visible = _this.storedVisible;
		_this.parentObject.getObject3D().add( _this.model );
		_this.lookatHelper = new THREE.Object3D();
		_this.parentObject.getObject3D().add( _this.lookatHelper );

	}; 

	
	if (item.hasOwnProperty('uid'))
	{
		_this.UID = item.uid;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.CHARACTER);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		_this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	
	if (item.hasOwnProperty('meshbuttons'))
	{
		if (item.meshbuttons.length > 0)
		{
			for (let i = 0; i < item.meshbuttons.length; i++)
			{
				if (item.meshbuttons[i].hasOwnProperty('meshbutton'))
				{
					
					var arbutton = new ARMeshButton(item.meshbuttons[i].meshbutton, this.parentSide, this.parentStage);
					this.buttonArray.push(arbutton);
				}
			}
		}
	}
	
	if (item.hasOwnProperty('texttospeech'))
	{
		this.textToSpeech = new TextToSpeech(item.texttospeech, this.parentSide);
	}
	
	if (item.hasOwnProperty('speechtotext'))
	{
		this.speechToText = new SpeechToText(item.speechtotext, this.parentSide);
	}
	
	if (item.hasOwnProperty('dialogengine'))
	{
		this.dialogEngine = new DialogEngine(item.dialogengine, this.parentSide);
	}
	
	if (item.hasOwnProperty('fbx'))
	{
		var loader = new THREE.FBXLoader(g_loadingManager);
		loader.load( 'assets/models/' + item.fbx, function ( object ) {

			_this.modelLoaded(object, item, false, AssetFileTypeEnum.FBX);

		})
	}
	
	if (item.hasOwnProperty('glb'))
	{
		var loader = new THREE.GLTFLoader(g_loadingManager);
		loader.load( 'assets/models/' + item.glb , function ( gltf ) {

			//_this.modelLoaded(gltf.scene, item, false);
			_this.modelLoaded(gltf, item, false, AssetFileTypeEnum.GLB);

		})
	}

	if (item.hasOwnProperty('modelid'))
	{
		
		parentcube.setupAssetLoader(item.modelid, AssetLoaderTypeEnum.MODEL, _this.modelLoaded, item);
	}
	
	
	this.loadStates = function() {
		if (item.hasOwnProperty('states'))
		{
			if (item.states.length > 0)
			{
				for (let i = 0; i < item.states.length; i++)
				{
					if (item.states[i].state.hasOwnProperty('ios'))
					{
						if (item.states[i].state.ios == g_isIOS)
						{
							//console.log("character state uid " + item.uid);
							var arstate = new ARState(item.states[i].state, _this.parentSide, _this, false);
							_this.arStatesArray.push(arstate);
						}
					}
					else
					{
						//console.log("character state uid " + item.uid);
						var arstate = new ARState(item.states[i].state, _this.parentSide, _this, false);
						_this.arStatesArray.push(arstate);
					}
				}
			}
		}
	}
	

	
	
}

ARCharacter.prototype.constructor = ARCharacter;


ARCharacter.prototype.initialise = function(){

	this.model.position.copy( this.initialStoredPosition );
	this.model.rotation.setFromVector3( this.initialStoredRotation );
	this.model.visible = this.storedVisible;
	this.prepareCrossFadeByID(this.defaultAnimationID, 0.1, AnimationCrossFadeTypeEnum.IMMEDIATE);
	this.currentPosition.copy(this.initialStoredPosition);
	this.currentRotation.copy(this.initialStoredRotation);
	this.nextAnimationName = null;
	this.nextAnimation = null;
	this.nextAnimationID = null;
	this.modelPitchStored = null;
	this.modelYawStored = null;
	this.modelRollStored = null;
	if (this.buttonArray != null)
	{
		for (let i = 0; i < this.buttonArray.length; i++)
		{
			this.buttonArray[i].initialise();
		}
	}
	this.currentStateOrder = 1;
	for (let i = 0; i < this.arStatesArray.length; i++)
	{
		this.arStatesArray[i].initialise();
	}
	//this.isCurrentCameraOverride = false;
	//this.cameraOverride = this.cameraOverridesMap.get(this.actions[this.defaultAnimationID][0]);
	//if (this.cameraOverride != undefined)
	//{
		//console.log("this.cameraOverride found " + this.actions[this.defaultAnimationID][0] + " length " + this.cameraOverride.overrideBones.length); 
	//	this.isCurrentCameraOverride = true;
	//}
	//this.isNextCameraOverride = null;
	//this.nextCameraOverrideAnimation = null;
}	

ARCharacter.prototype.loadStates = function(){

	this.loadStates();
}

ARCharacter.prototype.calcBoundingBoxHeight = function(){	
	
	var height = 0;
	if (this.model != null)
	{
		var boundingBox = new THREE.Box3().setFromObject(this.model);
		var boundingboxsize = new THREE.Vector3(0,0,0);
		boundingBox.getSize(boundingboxsize);
		height = ( boundingboxsize.y + boundingBox.min.y);
	}
	return height;

}

ARCharacter.prototype.calcBoundingBoxMinMaxPosZ = function(){	
	
	
	var minmaxpos = [0,0];
	if (this.model != null)
	{
		var boundingBox = new THREE.Box3().setFromObject(this.model);
		minmaxpos[0] = boundingBox.min.z;
		minmaxpos[1] = boundingBox.max.z;
	}
	return minmaxpos;

}

ARCharacter.prototype.getUID = function(){
	return this.UID;
}

ARCharacter.prototype.getUserData = function(){	
	return this.userData
}

ARCharacter.prototype.getType = function(){	
	return ObjectTypeEnum.CHARACTER;
}

ARCharacter.prototype.getCurrentAnimationName = function(){
	return this.currentAnimationName;
}

ARCharacter.prototype.getCurrentAnimationID = function(){
	return this.currentAnimationID;
}		

ARCharacter.prototype.getObject3D = function(){
	return this.model;
}

ARCharacter.prototype.getParentObject = function(){
	return this.parentObject;
}

ARCharacter.prototype.getEffectiveWeightByName = function(value){
	
	var action = null;
	if (this.actions.length > 0)
	{
		for (let i = 0; i < this.actions.length; i++)
		{
			if (this.actions[i][0] == value)
			{
				action = this.actions[i][1];
				break;
			}
		}
	}
	if (action != null)
	{
		return action.getEffectiveWeight();
		
	}
	else
	{
		return null;
	}
	
}

ARCharacter.prototype.getCurrentStateOrder = function(){
	
	return this.currentStateOrder;
}

ARCharacter.prototype.setCurrentStateOrder = function(value){
	
	this.currentStateOrder = value;
}

ARCharacter.prototype.getInitialPosition = function(){	
	return this.initialStoredPosition;
}

ARCharacter.prototype.getInitialRotation = function(){	
	return this.initialStoredRotation;
}

ARCharacter.prototype.getVisibilty = function(){	
	return this.model.visible;
}

ARCharacter.prototype.setVisibilty = function(value){	
	this.model.visible = value;
}

ARCharacter.prototype.getCurrentPositionX = function(){	
	return this.currentPosition.x;
}

ARCharacter.prototype.getCurrentPositionY = function(){	
	return this.currentPosition.y;
}

ARCharacter.prototype.getCurrentPositionZ = function(){	
	return this.currentPosition.z;
}

ARCharacter.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.currentRotation.x);
}

ARCharacter.prototype.getCurrentRotationAngleY = function(){	
	//return THREE.Math.radToDeg(this.currentRotation.y);
	var result = THREE.Math.radToDeg(this.currentRotation.y);
	if (result == -180)
	{
		return -result;
	}
	else
	{
		if (result == 360)
		{
			return 0;
		}
		else
		{
			return result;
		}
	}
}

ARCharacter.prototype.getCurrentRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.currentRotation.z);
}


ARCharacter.prototype.setCurrentRotationAngleX = function(value){
	this.currentRotation.x = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
}

ARCharacter.prototype.setCurrentRotationAngleY = function(value){	
	this.currentRotation.y = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
}

ARCharacter.prototype.setCurrentRotationAngleZ = function(value){	
	this.currentRotation.z = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
}

ARCharacter.prototype.getCurrentPosition = function(){	
	return this.currentPosition;
}

ARCharacter.prototype.setCurrentPosition = function(value){	
	this.currentPosition.copy(value);
	this.model.position.copy( this.currentPosition );

}

ARCharacter.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez){	
	if (valuex != null) { this.currentPosition.x = valuex;}
	if (valuey != null) { this.currentPosition.y = valuey;}
	if (valuez != null) { this.currentPosition.z = valuez;}
	this.model.position.copy( this.currentPosition );

}

ARCharacter.prototype.setCurrentRotation = function(value){	
	this.currentRotation.copy(value);
	this.model.rotation.setFromVector3( this.currentRotation );
}

ARCharacter.prototype.getCurrentRotation = function(){	
	return this.currentRotation;
}

ARCharacter.prototype.getActionID = function(value){	
	var actionid = null;
	if (this.actions.length > 0)
	{
		for (let i = 0; i < this.actions.length; i++)
		{
			if (this.actions[i][0] == value)
			{
				actionid = i;
				break;
			}
		}
	}
	return actionid;
}

ARCharacter.prototype.prepareCrossFadeByName = function( endActionName, defaultDuration, crossfadetype, cameraoverride = false ) {

	var _this = this;
	this.singleStepMode = false;
	this.unPauseAllActions();
	var endAction = null;
	var endActionName = null;
	var endActionID = null;
	if (_this.actions.length > 0)
	{
		for (let i = 0; i < _this.actions.length; i++)
		{
			if (_this.actions[i][0] == endActionName)
			{
				endAction = _this.actions[i][1];
				endActionID = i;
				break;
			}
		}
	}
	if (endAction != null)
	{
		switch (crossfadetype) {
		case AnimationCrossFadeTypeEnum.IMMEDIATE:
			this.executeCrossFade( _this.currentAnimation, endAction, defaultDuration );
			break;
		case AnimationCrossFadeTypeEnum.AFTERCURRENTLOOP:
			this.synchronizeCrossFade( _this.currentAnimation, endAction, defaultDuration );
			break;
		}
		_this.currentAnimation = endAction;
		_this.currentAnimationName = endActionName;
		_this.currentAnimationID = endActionID;	

		this.nextCameraOverride = cameraoverride;
		if (this.nextCameraOverride)
		{
			this.nextCameraOverrideAnimation = endActionName;		
		
		}
	}


}

ARCharacter.prototype.prepareCrossFadeByID = function( endActionid, defaultDuration, crossfadetype, cameraoverride = false ) {

	var _this = this;
	this.singleStepMode = false;
	this.unPauseAllActions();

	switch (crossfadetype) {
	case AnimationCrossFadeTypeEnum.IMMEDIATE:
		this.executeCrossFade( _this.currentAnimation, this.actions[endActionid][1], defaultDuration );
		break;
	case AnimationCrossFadeTypeEnum.AFTERCURRENTLOOP:
		this.synchronizeCrossFade( _this.currentAnimation, this.actions[endActionid][1], defaultDuration );
		break;
	}
	_this.currentAnimation = _this.actions[endActionid][1];
	_this.currentAnimationName = _this.actions[endActionid][0];	
	_this.currentAnimationID = endActionid;	
	this.nextCameraOverride = cameraoverride;
	this.nextCameraOverrideAnimationID = endActionid;	
	this.nextCameraOverrideAnimationName = _this.actions[endActionid][0];		
	

}

ARCharacter.prototype.synchronizeCrossFade	= function ( startAction, endAction, duration ) {

	var _this = this;
	_this.mixer.addEventListener( 'loop', onLoopFinished );

	function onLoopFinished( event ) {

		if ( event.action === startAction ) {

			_this.mixer.removeEventListener( 'loop', onLoopFinished );

			_this.executeCrossFade( startAction, endAction, duration );

		}

	}

}

ARCharacter.prototype.unPauseAllActions = function() {
	var _this = this;
		
	if (_this.actions.length > 0)
	{
		(_this.actions).forEach( function ( entry ) {

			entry[1].paused = false;

		} ); 
	}					

}

ARCharacter.prototype.executeCrossFade = function ( startAction, endAction, duration ) {

	// Not only the start action, but also the end action must get a weight of 1 before fading
	// (concerning the start action this is already guaranteed in this place)
	var _this = this;
	_this.setWeight( endAction, 1 );
	endAction.time = 0;

	// Crossfade with warping - you can also try without warping by setting the third parameter to false

	startAction.crossFadeTo( endAction, duration, true );

}	

ARCharacter.prototype.update = function(){	
	
	if ((this.mixer != null) && (this.clock != null))
	{
		this.mixer.update(this.clock.getDelta());
		if (this.isNextCameraOverride != null)
		{
			if ((this.getCurrentAnimationName() == this.nextCameraOverrideAnimationName) && (this.getEffectiveWeightByName(this.nextCameraOverrideAnimationName) == 1))
			{
				if (isNextCameraOverride)
				{
					this.cameraOverride = this.cameraOverridesMap.get(this.nextCameraOverrideAnimationName);
					if (this.cameraOverride != undefined)
					{
						this.isCurrentCameraOverride = this.isNextCameraOverride;
						
					}
					else
					{
						this.isCurrentCameraOverride = false;
					}
				}
				else
				{
					this.isCurrentCameraOverride = this.isNextCameraOverride;
				}
				this.isNextCameraOverride = null;
			}
		}
		if (this.isCurrentCameraOverride)
		{
			this.model.getWorldDirection(this.currentWorldRotation);
			let directionz = new THREE.Vector3( this.currentWorldRotation.x, 0, this.currentWorldRotation.z );
			let directiony = new THREE.Vector3(  0, this.currentWorldRotation.y, this.currentWorldRotation.z );
			var anglez = (THREE.Math.radToDeg( directionz.angleTo( new THREE.Vector3( 0, 0, 1 )))) * Math.sign((new THREE.Vector3().crossVectors(directionz, new THREE.Vector3( 0, 0, 1 ))).y);
			var angley = (THREE.Math.radToDeg( directiony.angleTo( new THREE.Vector3( 0, 0, 1 )))) * Math.sign((new THREE.Vector3().crossVectors(directiony, new THREE.Vector3( 0, 0, 1 ))).x);
			//console.log("anglez " + anglez + " angley " + angley );
			
			for (let i = 0; i < this.cameraOverride.overrideBones.length; i++)
			{
				this.cameraOverride.overrideBones[0][0].rotation.y = THREE.Math.degToRad(angley);
				//this.cameraOverride.overrideBones[0][0].rotation.x = THREE.Math.degToRad(anglez);
			}
			/* for (let i = 0; i < this.overrideBones.length; i++)
			{
				let boneWorldRotation = new THREE.Vector3(0, 0, 0);
				this.overrideBones[i][0].getWorldDirection(boneWorldRotation);
				
				let directionz = new THREE.Vector3( boneWorldRotation.x, 0, boneWorldRotation.z );
				let directiony = new THREE.Vector3(  0, boneWorldRotation.y, boneWorldRotation.z );
				var anglez = (THREE.Math.radToDeg( directionz.angleTo( new THREE.Vector3( 0, 0, 1 )))) * Math.sign((new THREE.Vector3().crossVectors(directionz, new THREE.Vector3( 0, 0, 1 ))).y);
				var angley = (THREE.Math.radToDeg( directiony.angleTo( new THREE.Vector3( 0, 0, 1 )))) * Math.sign((new THREE.Vector3().crossVectors(directiony, new THREE.Vector3( 0, 0, 1 ))).x);
				//console.log("bone name " + this.overrideBones[i][0].name + "anglez " + anglez + " angley " + angley );
				console.log("bone name " + this.overrideBones[i][0].name + " rotation x " + THREE.Math.radToDeg(this.overrideBones[i][0].rotation.x) + " rotation y " + THREE.Math.radToDeg(this.overrideBones[i][0].rotation.y) + " rotation z " + THREE.Math.radToDeg(this.overrideBones[i][0].rotation.z));
			} */
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
	}
	
}

ARCharacter.prototype.removeFromParent = function(){
	
	this.parentObject.getObject3D().remove( this.model );
}


ARCharacter.prototype.dispose = function(){
	
	
	if (this.actions != null)
	{
		this.mixer.stopAllAction();
		for (let i = 0; i < this.actions.length; i++)
		{
			this.actions[i][0] = null;
			if (this.actions[i][1] != null)
			{
				//this.actions[i][1].stop();
				this.mixer.uncacheAction(this.actions[i][1].getClip())
				this.mixer.uncacheClip(this.actions[i][1].getClip())
				this.actions[i][1] = null;
			}
			if (this.actions[i][2] != null)
			{
				for (let j = 0; j < this.actions[i][2].orientatedBones; j++)
				{
					this.actions[i][2].orientatedBones[j] = null;
				}
				this.actions[i][2].turnSpeed = null;
				this.actions[i][2] = null;
			}
			if (this.actions[i][3] != null)
			{
				for (let j = 0; j < this.actions[i][3].orientatedBones; j++)
				{
					this.actions[i][3].orientatedBones[j] = null;
				}
				this.actions[i][3].turnSpeed = null;
				this.actions[i][3] = null;
			}
		}
		this.actions.length = 0;
		this.actions = null;
	}
	if (this.mixer != null)
	{
		this.mixer.uncacheRoot(this.model);
	}
	/* if (this.cameraOverride != undefined)
	{
		this.cameraOverride.overrideBones = null;
		this.cameraOverride.speed = null;
		this.cameraOverride = null;
	}
	if (this.cameraOverridesMap != null)
	{
		for (const [key, value] of this.cameraOverridesMap) {
			if (value.overrideBones != null)
			{
				for(let i=0;i<value.overrideBones.length;i++)
				{
					value.overrideBones[i][0] = null;
					value.overrideBones[i][1] = null;
				}
				value.overrideBones.length = 0;
			}
			
			value.overrideBones = null;
			value.turnSpeed = null;
		}
		this.cameraOverridesMap.clear();
		this.cameraOverridesMap = null;
	} */
	
	if (this.model != null)
	{
		disposeObjectMesh(this.model);
		this.loadedModel = null;
		this.model = null;
	}
	

	this.mixer = null;
	this.clock = null;
	
	if (this.buttonArray != null)
	{
		for(let i=0;i<this.buttonArray.length;i++)
		{
			this.buttonArray[i].dispose();
			this.buttonArray[i] = null;
		}
		this.buttonArray.length = 0;
		this.buttonArray = null;
	}
	
	if (this.textToSpeech != null)
	{
		this.textToSpeech.dispose();
		this.textToSpeech = null;
	}
	
	if (this.speechToText != null)
	{
		this.speechToText.dispose();
		this.speechToText = null;
	}
	
	if (this.dialogEngine != null)
	{
		this.dialogEngine.dispose();
		this.dialogEngine = null;
	}
	
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
	
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.initialStoredPosition = null;
	this.initialStoredRotation = null;
	this.currentPosition = null;
	this.parentObject = null;
}