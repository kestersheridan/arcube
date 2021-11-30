const EntranceTypeEnum = {
	NONE : 0,
	LIFT : 1,
	HALFLIFT : 2,
	FULLFLIP : 3,
	HALFFLIP : 4,
	STATICBOTTOM : 5,
	STATICCENTRE : 6
}

const StageTypeEnum = {
	TOPSTAGE : 0,
	BOTTOMSTAGE : 1,
	FRONTSTAGE : 2,
	BACKSTAGE : 3,
	LEFTSTAGE : 4,
	RIGHTSTAGE : 5,
	BOXSTAGE : 6
}

const WaypointsStateEnum = {
	NOTTOUCHED : 0,
	TOUCHED : 1,
	TRANSITION : 2
}

ARStage = function(item, boxtype, scenegroup, storedrotation, holewidth, framedepth, cubewidth, lidsegmentwidth, parentcube, parentside) {
	
	var _this = this;
	
	this.UID = null;
	this.stagePlatforms = new Array;
	this.stageTextures = new Array;
	this.storedRotation = storedrotation;
	this.sideStageRotation =  new THREE.Group();
	this.stageelevation =  new THREE.Group();
	this.stage =  new THREE.Group();
	this.physicsGroup =  null;
	this.isCubeCorrection =  false;
	this.waypointsGroup =  new THREE.Group();
	this.sceneGroup = scenegroup;
	this.parentCube = parentcube;
	this.parentSide = parentside;
	this.sideStagePivot = new THREE.Group();
	this.sideStagePivot.add(this.stage);
	this.stage.add(this.waypointsGroup);
	this.waypointsPresent = false;
	this.waypointCharacter = null;
	this.currentWaypoint = null;
	this.defaultStartingWaypoint = null;
	this.previousWaypoint = null;
	this.nextWaypoint = null;
	this.startAngle = null;
	this.endAngle = null;
	this.startPosition = new THREE.Vector3(0,0,0);
	this.endPosition = new THREE.Vector3(0,0,0);
	this.distanceRatio = 0;
	this.rotationRatio = 0;
	this.waypointClicked = null;
	this.waypointJoin = null;
	this.waypointJoinPassed = null;
	this.walkSpeed = 400.0;
	this.climbUpSpeed = 600.0;
	this.climbDownSpeed = 600.0;
	this.turnSpeed = 2.0;
	this.totalLength = null;
	this.moveSpeed = null;
	this.stopActionName = null;
	this.forwardActionName = null;
	this.leftActionName = null;
	this.rightActionName = null;
	this.upActionName = null;
	this.downActionName = null;
	this.stopActionID = null;
	this.forwardActionID = null;
	this.leftActionID = null;
	this.rightActionID = null;
	this.upActionID = null;
	this.downActionID = null;
	this.waypointsInitialised = false;
	this.currentWaypointsState = WaypointsStateEnum.NOTTOUCHED; 
	this.waypointClock = new THREE.Clock();
	
	this.lerpValue;
	this.lerpedValues  = new Array;
	this.transition = 0; 
	this.stage.position.z = -(holewidth / 2);

	this.stageelevation.add(this.sideStagePivot);
	this.sideStagePivot.position.z = (holewidth / 2);
	this.sideStageRotation.add(this.stageelevation);
	this.stageStartPosY = 0;
	this.stageEndWidthPosY = 0;
	this.entrancePosZ = null;
	this.holeWidth = holewidth;
	this.frameDepth = framedepth;
	this.cubeWidth = cubewidth;
	this.lidSegmentWidth = lidsegmentwidth;
	this.entranceType = EntranceTypeEnum.NONE;
	
	this.isBoxType = boxtype;

	
	this.sceneGroup.add(this.sideStageRotation);
	
	this.storedStageRotation = new THREE.Vector3(0,0,0);
	this.storedStagePivotRotation = new THREE.Vector3(0,0,0);
	
	this.sideStageRotation.rotation.setFromVector3( this.storedRotation );
	
	this.arModels = new Array;
	this.arLights = new Array;
	this.arPhysicsObjects = new Array;
	this.arParticleSystems = new Array;
	this.arGroups = new Array;
	this.arAudioClips = new Array;
	this.arCharacters = new Array;
	this.arWaypoints = new Array;
	this.arBranches = new Array;
	this.arInteractableModels = new Array;
	this.arMeshButtonsReference = new Array;
	this.interactableModelsPresent = false;
	this.childAddedRuntimeObjects = new Array;
	this.childAddedRuntimePhysicsObjects = new Array;
	
	
	this.stagetype = null;
	
	
	if (item.hasOwnProperty('topstage'))
	{
		this.stagetype = StageTypeEnum.TOPSTAGE;
		createStage(item.topstage);
	}
	if (item.hasOwnProperty('frontstage'))
	{
		this.stagetype = StageTypeEnum.FRONTSTAGE;
		createStage(item.frontstage);
	}
	if (item.hasOwnProperty('backstage'))
	{
		this.stagetype = StageTypeEnum.BACKSTAGE;
		createStage(item.backstage);
	}
	if (item.hasOwnProperty('leftstage'))
	{
		this.stagetype = StageTypeEnum.LEFTSTAGE;
		createStage(item.leftstage);
	}
	if (item.hasOwnProperty('rightstage'))
	{
		this.stagetype = StageTypeEnum.RIGHTSTAGE;
		createStage(item.rightstage);
	}
	if (item.hasOwnProperty('bottomstage'))
	{
		this.stagetype = StageTypeEnum.BOTTOMSTAGE;
		createStage(item.bottomstage);
	}
	if (item.hasOwnProperty('boxstage'))
	{
		this.stagetype = StageTypeEnum.BOXSTAGE;
		createStage(item.boxstage);
	}
	

	
	 
	
	//create stageplatform
	
	function createStage(stage){
			
		var maxHeight = 0;
		var waypointcharacteruid = null;
		
		this.textureLoaded = function(loadedtexture, model) {
			loadedtexture.encoding = THREE.sRGBEncoding;
			loadedtexture.anisotropy = 16;
			_this.stageTextures.push(loadedtexture);
			if ( Array.isArray( model.material ) )
			{
				for ( var m = 0; m < model.material.length; m ++ ) {
					if ((model.material[m]).map)
					{
						(model.material[m]).map = null;
						(model.material[m]).map = loadedtexture;
						(model.material[m]).needsUpdate = true;
					}
				}
			}
			else
			{
				model.material.map = null;
				model.material.map = loadedtexture;
				model.material.needsUpdate = true;
			}
		};
		
		this.textureFaceLoaded = function(loadedtexture, model) {
			loadedtexture.encoding = THREE.sRGBEncoding;
			loadedtexture.anisotropy = 16;
			_this.stageTextures.push(loadedtexture);
			if ( Array.isArray( model.material ) )
			{
				
				(model.material[2]).map = null;
				(model.material[2]).map = loadedtexture;
				(model.material[2]).needsUpdate = true;
				(model.material[3]).map = null;
				(model.material[3]).map = loadedtexture;
				(model.material[3]).needsUpdate = true;
			}
			else
			{
				
				model.material.map = null;
				model.material.map = loadedtexture;
				model.material.needsUpdate = true;
			}
		};
		
		this.textureFrontFaceLoaded = function(loadedtexture, model) {
			loadedtexture.encoding = THREE.sRGBEncoding;
			loadedtexture.anisotropy = 16;
			_this.stageTextures.push(loadedtexture);
			if ( Array.isArray( model.material ) )
			{
				
				(model.material[2]).map = null;
				(model.material[2]).map = loadedtexture;
				(model.material[2]).needsUpdate = true;
			}
			else
			{
				
				model.material.map = null;
				model.material.map = loadedtexture;
				model.material.needsUpdate = true;
			}
		};
		
		if (stage.hasOwnProperty('uid'))
		{
			_this.UID = stage.uid;
			_this.parentSide.setUIDObjectMap(_this.UID, _this, ObjectTypeEnum.STAGE);
		}
		
		if (stage.hasOwnProperty('entrancetype'))
		{
			switch (stage.entrancetype.toLowerCase()) {
			case "lift":
				_this.entranceType = EntranceTypeEnum.LIFT;
				break;
			case "halflift":
				_this.entranceType = EntranceTypeEnum.HALFLIFT;
				if (stage.hasOwnProperty('entranceposz'))
				{
					_this.entrancePosZ = stage.entranceposz;
				}
				break;	
			case "fullflip":
				_this.entranceType = EntranceTypeEnum.FULLFLIP;
				break;
			case "halfflip":
				_this.entranceType = EntranceTypeEnum.HALFFLIP;
				break;
			case "staticbottom":
				_this.entranceType = EntranceTypeEnum.STATICBOTTOM;
				break;
			case "staticcentre":
				_this.entranceType = EntranceTypeEnum.STATICCENTRE;
				break;
			}
		}
		
		if (!_this.isBoxType)
		{
			
			var platformpresent = true;
			var physicspresent = false;
			if (stage.hasOwnProperty('platform'))
			{
				platformpresent = stage.platform;
			}
			if (stage.hasOwnProperty('physics'))
			{
				physicspresent = true;	
			}
			if (platformpresent)
			{
				var stageplatformdepth;
				var stageplatform;
				
				var colour = new THREE.Color( 0xffffff );
				if (stage.hasOwnProperty('stagecolour'))
				{
					colour = stage.stagecolour;
				}
				
				
				switch (_this.entranceType) {
				case EntranceTypeEnum.LIFT:
					stageplatformdepth = framedepth;
					break;
				case EntranceTypeEnum.FULLFLIP:
					stageplatformdepth = framedepth * 2;
					break;
				case EntranceTypeEnum.HALFFLIP:
					stageplatformdepth = framedepth * 2;
					var wallcolour = new THREE.Color( 0xffffff );
					if (stage.hasOwnProperty('wallcolour'))
					{
						wallcolour = stage.wallcolour;
					}
					var wallmaterial = new THREE.MeshStandardMaterial( { color: wallcolour } );
					var wallheight = holewidth - (framedepth / 2);
					var wallgeometry = new THREE.BoxBufferGeometry( holewidth, wallheight, (framedepth * 2) );
					var stagewall = new THREE.Mesh( wallgeometry, wallmaterial );
					var stagewallphysics = null;
					stagewall.castShadow = true;
					stagewall.receiveShadow = true;
					stagewall.name = "stageplatform";
					_this.stage.add( stagewall );
					//stagewall.position.set(0, (wallheight / 2) + framedepth, -((holewidth / 2) + framedepth));
					stagewall.position.set(0, (wallheight / 2) + (framedepth / 2), -((holewidth / 2) + framedepth));
					if (physicspresent)
					{
						
						stagewallphysics = new ARPhysicsObject(stage.physics, _this, _this.parentCube, _this.parentSide, _this, _this.UID + "wall", PhysicsTypeEnum.RIGIDBODY_BOX, new THREE.Vector3(holewidth, wallheight, (framedepth * 2)), stagewall.position);
					}						
					_this.stagePlatforms.push((stagewall, stagewallphysics));
					if (stage.hasOwnProperty('wallmaterial'))
					{
						var loader = new AjaxTextureLoader(g_loadingManager);
						loader.load( "assets/textures/" + stage.wallmaterial, function( texture ) {
							texture.encoding = THREE.sRGBEncoding;
							texture.anisotropy = 16;								
							_this.textureLoaded(texture, stagewall);
						});
					} 
					if (stage.hasOwnProperty('wallmaterialid'))
					{
						_this.parentCube.setupAssetLoader(stage.wallmaterialid, AssetLoaderTypeEnum.TEXTURE, this.textureLoaded, stagewall);
					}
					break;

				}
				
				var geometry = new THREE.BoxBufferGeometry( holewidth, stageplatformdepth, holewidth );
				var material = new THREE.MeshStandardMaterial( { color: colour } );
				if ((stage.hasOwnProperty('stagefacematerialid')) || (stage.hasOwnProperty('stagefacematerial')))
				{
					const materials = [
							material,
							material,
							new THREE.MeshStandardMaterial( { color: 0xffffff } ),
							new THREE.MeshStandardMaterial( { color: 0xffffff } ),
							material,
							material
						];
					stageplatform = new THREE.Mesh( geometry, materials );
				}
				else if ((stage.hasOwnProperty('stagefrontmaterialid')) || (stage.hasOwnProperty('stagefrontmaterial')))
				{
					const materials = [
							material,
							material,
							new THREE.MeshStandardMaterial( { color: 0xffffff } ),
							material,
							material,
							material
						];
					stageplatform = new THREE.Mesh( geometry, materials );
				}
				else
				{
					stageplatform = new THREE.Mesh( geometry, material );
				}
				stageplatform.castShadow = true;
				stageplatform.receiveShadow = true;
				stageplatform.name = "stageplatform";
				_this.stage.add( stageplatform );
				stageplatform.position.y = -(stageplatformdepth / 2);
				var stagephysics = null;
				if (physicspresent)
				{
					
					stagephysics = new ARPhysicsObject(stage.physics, _this, _this.parentCube, _this.parentSide, _this, _this.UID, PhysicsTypeEnum.RIGIDBODY_BOX, new THREE.Vector3(holewidth, stageplatformdepth, holewidth), stageplatform.position);
				}
				_this.stagePlatforms.push((stageplatform, stagephysics));
				if (stage.hasOwnProperty('stagematerial'))
				{
					var loader = new AjaxTextureLoader(g_loadingManager);
					loader.load( "assets/textures/" + stage.stagematerial, function( texture ) {	
						texture.encoding = THREE.sRGBEncoding;
						texture.anisotropy = 16;
						this.textureLoaded(texture, stageplatform);
					});
				} 
				if (stage.hasOwnProperty('stagematerialid'))
				{
					_this.parentCube.setupAssetLoader(stage.stagematerialid, AssetLoaderTypeEnum.TEXTURE, this.textureLoaded, stageplatform);
				} 
				if (stage.hasOwnProperty('stagefacematerial'))
				{
					var loader = new AjaxTextureLoader(g_loadingManager);
					loader.load( "assets/textures/" + stage.stagefacematerial, function( texture ) {	
						texture.encoding = THREE.sRGBEncoding;
						texture.anisotropy = 16;
						this.textureFaceLoaded(texture, stageplatform);
					});
				} 
				if (stage.hasOwnProperty('stagefacematerialid'))
				{
					_this.parentCube.setupAssetLoader(stage.stagefacematerialid, AssetLoaderTypeEnum.TEXTURE, this.textureFaceLoaded, stageplatform);
				}
				if (stage.hasOwnProperty('stagefrontmaterial'))
				{
					var loader = new AjaxTextureLoader(g_loadingManager);
					loader.load( "assets/textures/" + stage.stagefrontmaterial, function( texture ) {	
						texture.encoding = THREE.sRGBEncoding;
						texture.anisotropy = 16;
						this.textureFrontFaceLoaded(texture, stageplatform);
					});
				} 
				if (stage.hasOwnProperty('stagefrontmaterialid'))
				{
					_this.parentCube.setupAssetLoader(stage.stagefrontmaterialid, AssetLoaderTypeEnum.TEXTURE, this.textureFrontFaceLoaded, stageplatform);
				}				
				
			}
		}
		else
		{
			if (_this.entranceType == EntranceTypeEnum.LIFT)
			{
				var isMirror = false;
				var stageplatform;
				var stageplatformdepth = framedepth;
				var colour = new THREE.Color( 0xffffff );
				if (stage.hasOwnProperty('boxcolour'))
				{
					colour = stage.boxcolour;
				}
				var geometry = new THREE.PlaneBufferGeometry( holewidth, holewidth, 32 );
				var bias = 0.003
				if (stage.hasOwnProperty('clipbias'))
				{
					bias = stage.clipbias;
				}
				if (stage.hasOwnProperty('mirror'))
				{
					isMirror = stage.mirror;
				}
				if (isMirror)
				{
					stageplatform = new THREE.Reflector( geometry, {
						clipBias: bias,
						textureWidth: m_canvas3d.width * g_renderer.getPixelRatio(),
						textureHeight: m_canvas3d.height * g_renderer.getPixelRatio(),
						color: colour
					} );
				}
				else
				{
					var material = new THREE.MeshStandardMaterial( {color: colour, side: THREE.FrontSide} );
					stageplatform = new THREE.Mesh( geometry, material );
					var receiveshadow = true;
					if (stage.hasOwnProperty('shadows'))
					{
						receiveshadow = stage.shadows;
					}
					stageplatform.receiveShadow = receiveshadow;
				}
				stageplatform.name = "stageplatform";
				_this.stage.add( stageplatform );
				stageplatform.position.y = -(stageplatformdepth);
				stageplatform.rotation.x = Math.PI / 2;
				var stagephysics = null;
				if (stage.hasOwnProperty('physics'))
				{
					stagephysics = new ARPhysicsObject(stage.physics, _this, _this.parentCube, _this.parentSide, _this, _this.UID, PhysicsTypeEnum.RIGIDBODY_BOX, new THREE.Vector3(holewidth, stageplatformdepth, holewidth), stageplatform.position);
				}
				_this.stagePlatforms.push((stageplatform, stagephysics));
				if ((stage.hasOwnProperty('boxfacematerial')) && (!isMirror))
				{
					var loader = new AjaxTextureLoader(g_loadingManager);
					loader.load( "assets/textures/" + stage.boxfacematerial, function( texture ) {	
						texture.encoding = THREE.sRGBEncoding;
						texture.anisotropy = 16;
						this.textureLoaded(texture, stageplatform);
					});
				} 
				if ((stage.hasOwnProperty('boxfacematerialid')) && (!isMirror))
				{
					_this.parentCube.setupAssetLoader(stage.boxfacematerialid, AssetLoaderTypeEnum.TEXTURE, this.textureLoaded, stageplatform);
				} 
			}
		}
			
		if (stage.hasOwnProperty('content'))
		{			
			if (stage.content.length > 0)
			{
				for (let i = 0; i < stage.content.length; i++)
				{
					
					if ((stage.content[i].hasOwnProperty('geometry')) || (stage.content[i].hasOwnProperty('model')))
					{
						
						var model = new ARModel(stage.content[i], _this, parentcube, _this.parentSide, _this);
						_this.arModels.push(model);
					}
					if (stage.content[i].hasOwnProperty('light'))
					{
						var light = new ARLight(stage.content[i], _this, parentcube, _this.parentSide, _this);
						_this.arLights.push(light);
					}
					if (stage.content[i].hasOwnProperty('character'))
					{
						var character = new ARCharacter(stage.content[i].character, _this, parentcube, _this.parentSide, _this); 
						_this.arCharacters.push(character);
					}
					
					if (stage.content[i].hasOwnProperty('physics'))
					{
						var physicsobject = new ARPhysicsObject(stage.content[i].physics, null, _this.parentCube, _this.parentSide, _this);
						//var physicsobject = new ARPhysicsObject(stage.content[i].physics, _this.stage, parentcube, _this.parentSide, _this); 
						_this.arPhysicsObjects.push(physicsobject);
					}
					
					if (stage.content[i].hasOwnProperty('group'))
					{
						var group = new ARGroup(stage.content[i].group, _this, parentcube, _this.parentSide, _this);
						_this.arGroups.push(group);
					}
					
					if (stage.content[i].hasOwnProperty('particle'))
					{
						if (g_enableParticleSystem)
						{
							var particle = new ARParticleSystem(stage.content[i].particle, _this, parentcube, _this.parentSide, _this);
							_this.arParticleSystems.push(particle);
						}
					}
					
					if (stage.content[i].hasOwnProperty('audioclips'))
					{
						if (stage.content[i].audioclips.length > 0)
						{
							for (let j = 0; j < stage.content[i].audioclips.length; j++)
							{
								if (stage.content[i].audioclips[j].hasOwnProperty('audioclip'))
								{
									var audioclip = new ARAudio(stage.content[i].audioclips[j].audioclip, _this.parentSide);
									_this.arAudioClips.push(audioclip);
								}
							}
						}
					}
					
 					if (stage.content[i].hasOwnProperty('waypoints'))
					{
						_this.waypointsPresent = true; 
						waypointcharacteruid = stage.content[i].waypoints.characteruid;
						_this.stopActionName = stage.content[i].waypoints.stopclip;
						_this.forwardActionName = stage.content[i].waypoints.forwardclip;
						_this.leftActionName = stage.content[i].waypoints.leftclip;
						_this.rightActionName = stage.content[i].waypoints.rightclip;
						_this.upActionName = stage.content[i].waypoints.upclip;
						_this.downActionName = stage.content[i].waypoints.downclip;
						if (stage.content[i].waypoints.hasOwnProperty('walkspeed'))
						{
							_this.walkSpeed = stage.content[i].waypoints.walkspeed;
						}
						if (stage.content[i].waypoints.hasOwnProperty('upspeed'))
						{
							_this.climbUpSpeed = stage.content[i].waypoints.upspeed;
						}
						if (stage.content[i].waypoints.hasOwnProperty('downspeed'))
						{
							_this.climbDownSpeed = stage.content[i].waypoints.downspeed;
						}
						if (stage.content[i].waypoints.hasOwnProperty('turnspeed'))
						{
							_this.turnSpeed = stage.content[i].waypoints.turnspeed;
						}
						
						for (let j = 0; j < stage.content[i].waypoints.points.length; j++)
						{
							var waypoint = new ARWaypoint(stage.content[i].waypoints.points[j].waypoint, _this.waypointsGroup, parentcube, _this.parentSide, _this);
							//_this.arWaypoints[waypoint.getOrder()][waypoint.getBranch()] = waypoint;
							if (_this.arWaypoints[waypoint.getOrder()] == undefined)
							{
								var branch = new Array;
								branch[waypoint.getBranch()] = waypoint;
								_this.arWaypoints[waypoint.getOrder()] = branch;
							}
							else
							{
								_this.arWaypoints[waypoint.getOrder()][waypoint.getBranch()] = waypoint;
							}
							
							if (!_this.arBranches.includes(waypoint.getBranch()))
							{
								
								_this.arBranches.push(waypoint.getBranch());
							}
						}

					} 
				}
			}
		}
		
		if (_this.waypointsPresent)
		{
			for (let i = 0; i < _this.arCharacters.length; i++)
			{
				if (_this.arCharacters[i].getUID() == waypointcharacteruid)
				{
					_this.waypointCharacter = _this.arCharacters[i];
	
					break;
				}
			}
		}
		
		
		_this.stage.visible = false;
		


	}
	
	
	
	
	return;
}

ARStage.prototype.constructor = ARStage; 

ARStage.prototype.getType = function(){
	return ObjectTypeEnum.STAGE;
}

ARStage.prototype.initialiseContent = function(){
	
	if (this.childAddedRuntimeObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimeObjects.length; i++)
		{
			this.childAddedRuntimeObjects[i][0].add(this.childAddedRuntimeObjects[i][1]);
			this.childAddedRuntimeObjects[i][0] = null;
			this.childAddedRuntimeObjects[i][1] = null;
		}
		this.childAddedRuntimeObjects.length = 0;
	}
	
	if (this.childAddedRuntimePhysicsObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimePhysicsObjects.length; i++)
		{
			this.childAddedRuntimePhysicsObjects[i][0].add(this.childAddedRuntimePhysicsObjects[i][1]);
			this.childAddedRuntimePhysicsObjects[i][0] = null;
			this.childAddedRuntimePhysicsObjects[i][1] = null;
			this.childAddedRuntimePhysicsObjects[i][2] = null;
		}
		this.childAddedRuntimePhysicsObjects.length = 0;
	}
	
	if (this.isCubeCorrection)
	{
		this.physicsGroup.position.set( 0, 0, 0 );
		this.physicsGroup.rotation.setFromVector3( new THREE.Vector3( 0, 0, 0 ) );	
	}
	
	
	if (this.arModels != null)
	{
		for (let i = 0; i < this.arModels.length; i++)
		{
			this.arModels[i].initialise();
		}
	}
	
	if (this.arLights != null)
	{
		for (let i = 0; i < this.arLights.length; i++)
		{
			this.arLights[i].initialise();
		}
	}
	
	if (this.arGroups != null)
	{
		for (let i = 0; i < this.arGroups.length; i++)
		{
			this.arGroups[i].initialise();
		}
	}
	
	if (this.arCharacters != null)
	{
		for (let i = 0; i < this.arCharacters.length; i++)
		{
			this.arCharacters[i].initialise();
		}
	}
	
	for (let i = 0; i < this.arParticleSystems.length; i++)
	{
		this.arParticleSystems[i].initialise();
	}
	
	
	if ((this.waypointsPresent) && (this.waypointCharacter != null))
	{
		if (!this.waypointsInitialised)
		{
			this.waypointClicked = null;
			this.currentWaypointsState = WaypointsStateEnum.NOTTOUCHED; 
			this.stopActionID = this.waypointCharacter.getActionID(this.stopActionName);
			this.forwardActionID = this.waypointCharacter.getActionID(this.forwardActionName);
			this.leftActionID = this.waypointCharacter.getActionID(this.leftActionName);
			this.rightActionID = this.waypointCharacter.getActionID(this.rightActionName);
			this.upActionID = this.waypointCharacter.getActionID(this.upActionName);
			this.downActionID = this.waypointCharacter.getActionID(this.downActionName);
			this.currentWaypoint = null;
			this.previousWaypoint = null;
			this.nextWaypoint = null;
			
			for (let i = 0; i < this.arWaypoints.length; i++)
			{
				
				for (let j = 0; j < this.arWaypoints[i].length; j++)
				{
					if (this.arWaypoints[i][j] != undefined)
					{
						if (this.waypointCharacter.getCurrentPosition().equals(this.arWaypoints[i][j].getInitialPosition())) 	
						{
							this.currentWaypoint = [i,j];
							this.defaultStartingWaypoint = [i,j];
							this.arWaypoints[i][j].initialiseState(WaypointButtonStateEnum.CURRENT, null);
							i = this.arWaypoints.length;
							break;
						}
					}
				}
			}
			
			if (this.currentWaypoint != null)
			{
				let branches = this.arBranches.slice(0);
				if ((this.currentWaypoint[0] >= 0) && (this.currentWaypoint[0] < (this.arWaypoints.length - 1)))
				{
					for (let i = (this.currentWaypoint[0] + 1); i < this.arWaypoints.length; i++)
					{
						for (j = 0; j < branches.length; )
						{
							let found = false;
							if (this.arWaypoints[i][(branches[j])] != undefined)
							{
								if (this.arWaypoints[i][(branches[j])].getState() != WaypointButtonStateEnum.HIDDEN)
								{
									
									this.arWaypoints[i][(branches[j])].initialiseState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEYOND);
									found = true;
								}
							}
							if (found)
							{
								branches.splice(j, 1);
								if (branches.length == 0)
								{
									i = this.arWaypoints.length;
									break;
								}
								else
								{
									(j == 0) ? j++ : j--;
								}
							}
							else
							{
								j++;
							}
						}
					}
				}
				if (this.currentWaypoint[0] > 0)
				{
					let branches = this.arBranches.slice(0);
					for (let i = (this.currentWaypoint[0] - 1); i >= 0; i--)
					{
						
						for (j = 0; j < branches.length; )
						{
							let found = false;
							if (this.arWaypoints[i][(branches[j])] != undefined)
							{
								if (this.arWaypoints[i][(branches[j])].getState() != WaypointButtonStateEnum.HIDDEN)
								{
									
									this.arWaypoints[i][(branches[j])].initialiseState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEHIND);
									found = true;
								}
							}
							if (found)
							{
								branches.splice(j, 1);
								if (branches.length == 0)
								{
									i = this.arWaypoints.length;
									break;
								}
								else
								{
									(j == 0) ? j++ : j--;
								}
							}
							else
							{
								j++;
							}
						}
					}
					
				}
			}
			this.waypointsInitialised = true;
		}
		else
		{
			this.currentWaypointsState = WaypointsStateEnum.NOTTOUCHED; 
			this.waypointClicked = null;
			this.previousWaypoint = null;
			this.nextWaypoint = null;
			this.currentWaypoint = this.defaultStartingWaypoint;
			this.waypointCharacter.prepareCrossFadeByID(this.stopActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
			for (let i = 0; i < this.arWaypoints.length; i++)
			{
				for (let j = 0; j < this.arWaypoints[i].length; j++)
				{
					if (this.arWaypoints[i][j] != undefined)
					{
						this.arWaypoints[i][j].resetInitialState();
					}
				}
			}
		}
		
	}
}

ARStage.prototype.loadStates = function()
{
	
	if (this.arCharacters != null)
	{
		for (let i = 0; i < this.arCharacters.length; i++)
		{
			this.arCharacters[i].loadStates();
		}
	}
	
}

ARStage.prototype.calcStageStartPosition = function(){
	var _this = this;
	switch (_this.entranceType) {
	case EntranceTypeEnum.LIFT:
		var maxHeight = 0;
		
		for (let i = 0; i < _this.arModels.length; i++)
		{
			
			var boundingBoxHeight = _this.arModels[i].calcBoundingBoxHeight();
			if (boundingBoxHeight > maxHeight)
			{
				maxHeight = boundingBoxHeight;
			}
		}


		for (let i = 0; i < _this.arCharacters.length; i++)
		{
			var boundingBoxHeight = _this.arCharacters[i].calcBoundingBoxHeight();
			if (boundingBoxHeight > maxHeight)
			{
				maxHeight = boundingBoxHeight;
			}
		}
		
		for (let i = 0; i < _this.arGroups.length; i++)
		{
			var boundingBoxHeight = _this.arGroups[i].calcMaxBoundingBoxHeight();
			if (boundingBoxHeight > maxHeight)
			{
				maxHeight = boundingBoxHeight;
			}
		}

		_this.stageStartPosY = (_this.cubeWidth / 2) - maxHeight - _this.lidSegmentWidth;
		break;
	case EntranceTypeEnum.HALFLIFT:
		var maxPosZ = 0;
		var minPosZ = 0;
		for (let i = 0; i < _this.arModels.length; i++)
		{
			
			var boundingBoxWidth = _this.arModels[i].calcBoundingBoxMinMaxPosZ();
			if (boundingBoxWidth[1] > maxPosZ)
			{
				maxPosZ = boundingBoxWidth[1];
			}
			if (boundingBoxWidth[0] < minPosZ)
			{
				minPosZ = boundingBoxWidth[0];
			}
		}


		for (let i = 0; i < _this.arCharacters.length; i++)
		{
			var boundingBoxWidth = _this.arCharacters[i].calcBoundingBoxMinMaxPosZ();
			if (boundingBoxWidth[1] > maxPosZ)
			{
				maxPosZ = boundingBoxWidth[1];
			}
			if (boundingBoxWidth[0] < minPosZ)
			{
				minPosZ = boundingBoxWidth[0];
			}
		}
		
		for (let i = 0; i < _this.arGroups.length; i++)
		{
			var boundingBoxWidth = _this.arGroups[i].calcMaxBoundingBoxMinMaxPosZ();
			if (boundingBoxWidth[1] > maxPosZ)
			{
				maxPosZ = boundingBoxWidth[1];
			}
			if (boundingBoxWidth[0] < minPosZ)
			{
				minPosZ = boundingBoxWidth[0];
			}
		}
		
		_this.storedStagePivotRotation.x = THREE.Math.degToRad(-90);
		_this.sideStagePivot.rotation.setFromVector3( _this.storedStagePivotRotation );
		//_this.stageStartPosY = (_this.cubeWidth / 2) + maxPosZ + _this.lidSegmentWidth;
		_this.stageStartPosY = ((_this.cubeWidth ) - (_this.lidSegmentWidth * 2)) - maxPosZ;
		//_this.stageStartPosY = ((_this.cubeWidth )) - maxPosZ;
		if (_this.entrancePosZ != null)
		{
			//_this.stageEndWidthPosY = (Math.abs(maxPosZ - _this.entrancePosZ)) + (_this.cubeWidth );
			_this.stageEndWidthPosY = _this.entrancePosZ + _this.cubeWidth - _this.lidSegmentWidth;
		}
		else
		{
			//_this.stageEndWidthPosY = (Math.abs(maxPosZ - minPosZ)) + (_this.cubeWidth );
			_this.stageEndWidthPosY = _this.cubeWidth - minPosZ - _this.lidSegmentWidth;
		}
		break;
	case EntranceTypeEnum.HALFFLIP:
		_this.stageStartPosY = (_this.cubeWidth / 2) - _this.lidSegmentWidth;
		_this.storedStageRotation.x = THREE.Math.degToRad(-180);
		_this.stage.rotation.setFromVector3( _this.storedStageRotation );

		break;		
	case EntranceTypeEnum.FULLFLIP:
		_this.stageStartPosY = (_this.cubeWidth / 2) - _this.lidSegmentWidth;
		_this.storedStageRotation.z = THREE.Math.degToRad(180);
		_this.stage.rotation.setFromVector3( _this.storedStageRotation );

		break;
	case EntranceTypeEnum.STATICCENTRE:
		_this.stageStartPosY = 0;
		break;
	case EntranceTypeEnum.STATICBOTTOM:
	case EntranceTypeEnum.NONE:
	default:
		_this.stageStartPosY = -(_this.cubeWidth / 2);
		break;
	}
	_this.stageelevation.position.y = _this.stageStartPosY;	
}

ARStage.prototype.getStageStartPosY = function(){
	
	return this.stageStartPosY;
}

ARStage.prototype.getStageEndWidthPosY = function(){

	return this.stageEndWidthPosY;
}

ARStage.prototype.getStoredRotation = function(){
	return this.storedRotation;
}

ARStage.prototype.setStageRotation = function(valuex, valuey, valuez){
	this.storedStageRotation.set(THREE.Math.degToRad(valuex), THREE.Math.degToRad(valuey), THREE.Math.degToRad(valuez));
	this.stage.rotation.setFromVector3( this.storedStageRotation );
}

ARStage.prototype.setStagePivotRotation = function(valuex, valuey, valuez){
	this.storedStagePivotRotation.set(THREE.Math.degToRad(valuex), THREE.Math.degToRad(valuey), THREE.Math.degToRad(valuez));
	this.sideStagePivot.rotation.setFromVector3( this.storedStagePivotRotation );
}

ARStage.prototype.setStageElevation = function(value){
	
	this.stageelevation.position.setY(value);
}

ARStage.prototype.isWaypointsPresent = function(){

	return this.waypointsPresent; 

}

ARStage.prototype.getWaypointsGroup = function(){

	return this.waypointsGroup; 

}

ARStage.prototype.getObject3D = function(){
	return this.stage;
}

ARStage.prototype.getPhysicsObject3D = function(){
	if (this.physicsGroup == null)
	{
		this.physicsGroup = new THREE.Group();
		this.stage.add(this.physicsGroup);
		this.isCubeCorrection = true;
	}
	return this.physicsGroup;
}

ARStage.prototype.cubeCorrection = function(){
	return this.isCubeCorrection;
}

ARStage.prototype.isAudioPresent = function(){
	return this.isAudioPresent;
}

ARStage.prototype.isInteractableModelsPresent = function(){
	return this.interactableModelsPresent;
}

ARStage.prototype.getInteractableModelsGroup = function(){
	return this.arInteractableModels;
}


ARStage.prototype.addInteractableModel = function(value, key, object){
	
	if (!this.interactableModelsPresent)
	{
		this.interactableModelsPresent = true;
	}
	this.arInteractableModels.push(value);
	var entry = [key, object];
	this.arMeshButtonsReference.push(entry);
}

ARStage.prototype.setInteractableModelTouchedStart = function(intersectobject){
	
	for(let i=0;i<this.arMeshButtonsReference.length;i++)
	{
		if (intersectobject != null)
		{
			var touched = false;
			if (this.arMeshButtonsReference[i][0] == intersectobject.name)
			{
				touched = true;
			}
			else if (this.arMeshButtonsReference[i][0] == intersectobject.parent.name)
			{
				touched = true;
			}	
			else if (this.arMeshButtonsReference[i][0] == intersectobject.parent.parent.name)
			{
				touched = true;
			}
			(touched) ? this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.FIRSTTOUCHED) : this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED); 			
		}
		else
		{
			this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
		}
		
		
/* 		if (objectname != null)
		{
			if ((this.arMeshButtonsReference[i][0] == objectname) || (this.arMeshButtonsReference[i][0] == parentname))
			{
				this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.FIRSTTOUCHED);
			}
			else
			{
				this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
			}
		}
		else
		{
			this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
		} */
	}
	
}

ARStage.prototype.setInteractableModelTouchedMove = function(intersectobject){
	for(let i=0;i<this.arMeshButtonsReference.length;i++)
	{
		if (intersectobject != null)
		{
			var touched = false;
			if (this.arMeshButtonsReference[i][0] == intersectobject.name)
			{
				touched = true;
			}
			else if (this.arMeshButtonsReference[i][0] == intersectobject.parent.name)
			{
				touched = true;
			}	
			else if (this.arMeshButtonsReference[i][0] == intersectobject.parent.parent.name)
			{
				touched = true;
			}	
			(touched) ? this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.TOUCHCONTINUE) : this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED); 
		}
		else
		{
			this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
		}
		/* if (objectname != null)
		{
			if ((this.arMeshButtonsReference[i][0] == objectname) || (this.arMeshButtonsReference[i][0] == parentname))
			{
				this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.TOUCHCONTINUE);
			}
			else
			{
				this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
			}
		}
		else
		{
			this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
		} */
	}
}

ARStage.prototype.setInteractableModelTouchedEnd = function(){


	for(let i=0;i<this.arMeshButtonsReference.length;i++)
	{
		this.arMeshButtonsReference[i][1].setButtonState(ButtonStateEnum.NOTTOUCHED);
	}
	
}

ARStage.prototype.updateWaypoints = function(){
	
	let waypointfinds = new Array;
	for (let i = 0; i < this.arBranches.length; i++)
	{
		waypointfinds.push(false);
	}
	if (this.waypointClicked != null)
	{
		if ((this.waypointClicked[0] >= 0) && (this.waypointClicked[0] < (this.arWaypoints.length - 1)))
		{
			
			for (let i = (this.waypointClicked[0] + 1); i < this.arWaypoints.length; i++)
			{
				for (let j = 0; j < this.arWaypoints[i].length; j++)
				{
					if (this.arWaypoints[i][j] != undefined)
					{
						if (this.arWaypoints[i][j].getState() != WaypointButtonStateEnum.HIDDEN)
						{
							if (!waypointfinds[j])
							{
								this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEYOND);
								waypointfinds[j] = true;
							}
							else
							{
								this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.NOTACTIVE, WaypointRotationStateEnum.BEYOND);
							}
							
						}								
					}
				}
			}
		}
		
		for (let i = 0; i < waypointfinds.length; i++)
		{
			waypointfinds[i] = false;
		}
		
		if (this.waypointClicked[0] > 0)
		{
			for (let i = (this.waypointClicked[0] - 1); i >= 0; i--)
			{
				for (let j = 0; j < this.arWaypoints[i].length; j++)
				{
					if (this.arWaypoints[i][j] != undefined)
					{
						if (this.arWaypoints[i][j].getState() != WaypointButtonStateEnum.HIDDEN)
						{
							if (!waypointfinds[j])
							{
								this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEHIND);
								waypointfinds[j] = true;
							}
							else
							{
								this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.NOTACTIVE, WaypointRotationStateEnum.BEHIND);
							}
							
						}
					}
				}
			}
			
		}
		
		if (this.waypointClicked[1] != this.currentWaypoint[1])
		{
			for (let i = 0; i < this.arWaypoints.length; i++)
			{
				for (let j = 0; j < this.arWaypoints[i].length; j++)
				{
					if ((this.arWaypoints[i][j].isJoinFor(this.waypointClicked[1])) && (this.arWaypoints[i][j].isJoinFor(this.currentWaypoint[1])))
					{
						this.waypointJoin = [i, j];
						this.waypointJoinPassed = false;
						i = this.arWaypoints.length;
						break;
					}
				}
			}
		}
		else
		{
			if (this.waypointJoin != null)
			{
				this.waypointJoin.length = 0;
			}
			this.waypointJoinPassed = null;
		}
	}
	
}

ARStage.prototype.setWaypointTouched = function(value){
	
 	var values = value.split(",");
	var order = parseInt(values[0]);
	var branch = parseInt(values[1]);
	if (this.currentWaypointsState == WaypointsStateEnum.NOTTOUCHED)
	{
		var waypointfound = false;
		for(let i=0;i<this.arWaypoints.length;i++)
		{
			for (let j = 0; j < this.arWaypoints[i].length; j++)
			{
				if (this.arWaypoints[i][j] != undefined)
				{
					if ((this.arWaypoints[i][j].getOrder() == order) && (this.arWaypoints[i][j].getBranch() == branch) && (this.arWaypoints[i][j].getState() == WaypointButtonStateEnum.ACTIVE))
					{
						this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.CLICKED, null);
						this.currentWaypointsState = WaypointsStateEnum.TOUCHED;
						this.previousWaypoint = [this.currentWaypoint[0], this.currentWaypoint[1]];
						this.waypointClicked = [i,j];
						waypointfound = true;
						break;
					}
				}
			}
		}
		if (waypointfound)
		{
			let waypointfinds = new Array;
			for (let i = 0; i < this.arBranches.length; i++)
			{
				waypointfinds.push(false);
			}
			
			if ((this.waypointClicked[0] >= 0) && (this.waypointClicked[0] < (this.arWaypoints.length - 1)))
			{
				
				for (let i = (this.waypointClicked[0] + 1); i < this.arWaypoints.length; i++)
				{
					for (let j = 0; j < this.arWaypoints[i].length; j++)
					{
						if (this.arWaypoints[i][j] != undefined)
						{
							if (this.arWaypoints[i][j].getState() != WaypointButtonStateEnum.HIDDEN)
							{
								if (!waypointfinds[j])
								{
									this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEYOND);
									waypointfinds[j] = true;
								}
								else
								{
									this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.NOTACTIVE, WaypointRotationStateEnum.BEYOND);
								}
								
							}								
						}
					}
				}
			}
			
			for (let i = 0; i < waypointfinds.length; i++)
			{
				waypointfinds[i] = false;
			}
			
			if (this.waypointClicked[0] > 0)
			{
				for (let i = (this.waypointClicked[0] - 1); i >= 0; i--)
				{
					for (let j = 0; j < this.arWaypoints[i].length; j++)
					{
						if (this.arWaypoints[i][j] != undefined)
						{
							if (this.arWaypoints[i][j].getState() != WaypointButtonStateEnum.HIDDEN)
							{
								if (!waypointfinds[j])
								{
									this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.ACTIVE, WaypointRotationStateEnum.BEHIND);
									waypointfinds[j] = true;
								}
								else
								{
									this.arWaypoints[i][j].switchState(WaypointButtonStateEnum.NOTACTIVE, WaypointRotationStateEnum.BEHIND);
								}
								
							}
						}
					}
				}
				
			}
			
			if (this.waypointClicked[1] != this.currentWaypoint[1])
			{
				for (let i = 0; i < this.arWaypoints.length; i++)
				{
					for (let j = 0; j < this.arWaypoints[i].length; j++)
					{
						if ((this.arWaypoints[i][j].isJoinFor(this.waypointClicked[1])) && (this.arWaypoints[i][j].isJoinFor(this.currentWaypoint[1])))
						{
							this.waypointJoin = [i, j];
							this.waypointJoinPassed = false;
							i = this.arWaypoints.length;
							break;
						}
					}
				}
			}
			else
			{
				if (this.waypointJoin != null)
				{
					this.waypointJoin.length = 0;
				}
				this.waypointJoinPassed = null;
			} 
			
		}
	}
}

ARStage.prototype.setStageVisiblity = function(visiblity){
	
	this.stage.visible = visiblity;
}

ARStage.prototype.getStageVisiblity = function(){
	
	return this.stage.visible;
}
ARStage.prototype.getStageType = function(){

	return this.stagetype;
}

ARStage.prototype.getStageUID = function(){

	return this.UID;
}

ARStage.prototype.getEntranceType = function(){

	return this.entranceType;
}

ARStage.prototype.setSideStageRotation = function(rotation){
	
	this.sideStageRotation.rotation.setFromVector3( rotation );
}

ARStage.prototype.addObject3D = function(objectvalue){
	var entry = [objectvalue.getParentObject().getObject3D(), objectvalue.getObject3D()];
	this.childAddedRuntimeObjects.push(entry);
	this.stage.attach(objectvalue.getObject3D());
}

ARStage.prototype.addPhysicsObject3D = function(objectvalue){
	if (this.physicsGroup == null)
	{
		this.physicsGroup = new THREE.Group();
		this.stage.add(this.physicsGroup);
		this.isCubeCorrection = true;
	}
	if ((objectvalue.getParentObject().getType() == ObjectTypeEnum.GROUP) || (objectvalue.getParentObject().getType() == ObjectTypeEnum.MODEL))
	{
		var entry = [(objectvalue.getParentObject()).getParentObject().getObject3D(), objectvalue.getParentObject(), new THREE.Matrix4().copy((objectvalue.getParentObject()).getObject3D().matrix)];
		this.childAddedRuntimePhysicsObjects.push(entry);
		this.physicsGroup.attach((objectvalue.getParentObject()).getObject3D());
	}
}

ARStage.prototype.removePhysicsObject3D = function(id){
	for (let i = 0; i < this.childAddedRuntimePhysicsObjects.length; i++)
	{
		
		if (this.childAddedRuntimePhysicsObjects[i][1].getUID() == id)
		{
			this.childAddedRuntimePhysicsObjects[i][0].attach(this.childAddedRuntimePhysicsObjects[i][1].getObject3D());
			this.childAddedRuntimePhysicsObjects[i][1].getObject3D().matrix.copy(this.childAddedRuntimePhysicsObjects[i][2]);
			this.childAddedRuntimePhysicsObjects[i][0] = null;
			this.childAddedRuntimePhysicsObjects[i][1] = null;
			this.childAddedRuntimePhysicsObjects[i][2] = null;
			this.childAddedRuntimePhysicsObjects[i] = null;
			this.childAddedRuntimePhysicsObjects.splice(i,1);
			break;
		}
	}
	
}

ARStage.prototype.update = function(){
	
 	/* if (this.isCubeCorrection)
	{
		this.physicsGroup.quaternion.copy(this.parentCube.getCubeRotation().conjugate());
	} */
	 
 	for (let i = 0; i < this.arCharacters.length; i++)
	{
		this.arCharacters[i].update();
	}
	
	for (let i = 0; i < this.arModels.length; i++)
	{
		this.arModels[i].update();
	}
	
	
	for (let i = 0; i < this.arGroups.length; i++)
	{
		this.arGroups[i].update();
	}
	
	for (let i = 0; i < this.arParticleSystems.length; i++)
	{
		this.arParticleSystems[i].update();
	}
	
	if (this.waypointsPresent)
	{	
		switch (this.currentWaypointsState) {
		case WaypointsStateEnum.TOUCHED:
			this.currentWaypointsState = WaypointsStateEnum.TRANSITION;
			this.transition = 0; 
			this.lerpValue = 0;
			
			break;
		case WaypointsStateEnum.TRANSITION:

			if ((this.currentWaypoint[0] == this.waypointClicked[0]) && (this.currentWaypoint[1] == this.waypointClicked[1]) )
			{
				this.waypointClock.stop();
				this.transition = 0; 
				
				this.waypointCharacter.prepareCrossFadeByID(this.stopActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
				this.currentWaypointsState = WaypointsStateEnum.NOTTOUCHED;
			}
			else
			{
				switch (this.transition) {
				case 0:
					if (this.waypointJoinPassed == null)
					{
						if (this.currentWaypoint[0] < this.waypointClicked[0])
						{
							this.nextWaypoint = [this.currentWaypoint[0] + 1, this.currentWaypoint[1]];
						}
						else
						{
							this.nextWaypoint = [this.currentWaypoint[0] - 1, this.currentWaypoint[1]];
						}
					}
					else
					{
						if (!this.waypointJoinPassed)
						{
							if (this.currentWaypoint[0] < this.waypointJoin[0])
							{
								this.nextWaypoint = [this.currentWaypoint[0] + 1, this.currentWaypoint[1]];
							}
							else
							{
								this.nextWaypoint = [this.currentWaypoint[0] - 1, this.currentWaypoint[1]];
							}
							if (this.nextWaypoint[0] == this.waypointJoin[0])
							{
								this.nextWaypoint[1] = this.waypointJoin[1];
								this.waypointJoinPassed = true;
							}
						}
						else
						{
							if ((this.currentWaypoint[0] == this.waypointJoin[0]) && (this.currentWaypoint[1] == this.waypointJoin[1]))
							{
								if (this.currentWaypoint[0] < this.waypointClicked[0])
								{
									this.nextWaypoint = [this.currentWaypoint[0] + 1, this.waypointClicked[1]];
								}
								else
								{
									this.nextWaypoint = [this.currentWaypoint[0] - 1, this.waypointClicked[1]];
								}
								this.waypointJoinPassed = null;
							}
						}
					}
					
					
						/* else
						{
							if ((this.currentWaypoint[0] == this.waypointJoin[0]) && (this.currentWaypoint[1] == this.waypointJoin[1]) )
							{
								this.waypointJoinPassed = true;
								if (this.currentWaypoint[0] < this.waypointClicked[0])
								{
									this.nextWaypoint = [this.currentWaypoint[0] + 1, this.currentWaypoint[1]];
								}
								else
								{
									this.nextWaypoint = [this.currentWaypoint[0] - 1, this.currentWaypoint[1]];
								}
							}
							else
							{
								if (this.currentWaypoint[0] < this.waypointJoin[0])
								{
									this.nextWaypoint = [this.currentWaypoint[0] + 1, this.currentWaypoint[1]];
								}
								else
								{
									this.nextWaypoint = [this.currentWaypoint[0] - 1, this.currentWaypoint[1]];
								}
							}
						}
					} */
					var dir1 = new THREE.Vector3(); 
					dir1.subVectors( new THREE.Vector3( this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionX(), 0, this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionZ() ) , new THREE.Vector3(this.waypointCharacter.getCurrentPositionX(), 0, this.waypointCharacter.getCurrentPositionZ()) ).normalize();
					var angle = THREE.Math.radToDeg(dir1.angleTo( new THREE.Vector3( 0, 0, 1 )));
					console.log("case 0: angle " + angle);
					if (angle == -180)
					{
						angle = 180;
					}
					
					var signed = Math.sign((new THREE.Vector3().crossVectors(dir1, new THREE.Vector3( 0, 0, 1 ))).y); 
					if (signed > 0)
					{
						angle = angle + 180;
						console.log("case 0: +ve signed " + signed + " angle " + angle);
					}
					else
					{
						console.log("case 0: -ve signed " + signed + " angle " + angle);
					}

					this.startAngle = this.waypointCharacter.getCurrentRotationAngleY();
					this.endAngle = angle;
				
					var diffangle = this.startAngle - this.endAngle;
					console.log("case 0: this.startAngle " + this.startAngle + " this.endAngle " + this.endAngle + " diffangle " + diffangle);
					if (Math.abs(diffangle) > 180)
					{
						if (Math.sign(diffangle) == 1)
						{
							this.endAngle = 360 - Math.abs(this.endAngle);
							console.log("case 0: diffangle +ve this.endAngle " + this.endAngle);
						}
						else
						{
							this.endAngle = Math.abs(this.endAngle) - 360;
							console.log("case 0: diffangle -ve this.endAngle " + this.endAngle);
						}
						diffangle = this.startAngle - this.endAngle;
					}

					this.rotationRatio = Math.abs((1 / diffangle) * 100);

 					if (diffangle != 0)
					{
						
						if (this.endAngle > this.startAngle)
						{
							this.waypointCharacter.prepareCrossFadeByID(this.leftActionID, 0.2, AnimationCrossFadeTypeEnum.IMMEDIATE);
						}
						else
						{
							this.waypointCharacter.prepareCrossFadeByID(this.rightActionID, 0.2, AnimationCrossFadeTypeEnum.IMMEDIATE);
						}
						this.transition = 1;
						this.waypointClock.start();

					}
					else
					{
						if (this.waypointCharacter.getCurrentPositionY() == this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							if (this.waypointCharacter.getCurrentAnimationID() != this.forwardActionID)
							{
								this.moveSpeed = this.walkSpeed;
								this.waypointCharacter.prepareCrossFadeByID(this.forwardActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
							}
						}
						if (this.waypointCharacter.getCurrentPositionY() > this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							if (this.waypointCharacter.getCurrentAnimationID() != this.downActionID)
							{
								this.moveSpeed = this.climbDownSpeed;
								this.waypointCharacter.prepareCrossFadeByID(this.downActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
							}
						}
						if (this.waypointCharacter.getCurrentPositionY() < this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							if (this.waypointCharacter.getCurrentAnimationID() != this.upActionID)
							{
								this.moveSpeed = this.climbUpSpeed;
								this.waypointCharacter.prepareCrossFadeByID(this.upActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
							}
						}
						this.startPosition.copy(this.waypointCharacter.getCurrentPosition());
						this.endPosition.copy(this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getInitialPosition());
						this.totalLength = this.startPosition.distanceTo(this.endPosition);
						this.distanceRatio = (1 / this.totalLength) * 100;
						this.lerpValue = 0;
						this.waypointClock.start();
						this.transition = 2;
					} 
					
					break;
				case 1:
					//need to rotate character first to face correct direction as position of next waypoint
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.startAngle];
						var D = [this.endAngle];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointCharacter.setCurrentRotationAngleY(this.lerpedValues[0]);
						this.lerpValue = this.rotationRatio * (this.waypointClock.getElapsedTime() / this.turnSpeed);
					}
					else
					{
						
						this.waypointCharacter.setCurrentRotationAngleY(this.endAngle);
						if (this.waypointCharacter.getCurrentPositionY() == this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							this.moveSpeed = this.walkSpeed;
							this.waypointCharacter.prepareCrossFadeByID(this.forwardActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
						}
						if (this.waypointCharacter.getCurrentPositionY() > this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							this.moveSpeed = this.climbDownSpeed;
							this.waypointCharacter.prepareCrossFadeByID(this.downActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
						}
						if (this.waypointCharacter.getCurrentPositionY() < this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentPositionY())
						{
							this.moveSpeed = this.climbUpSpeed;
							this.waypointCharacter.prepareCrossFadeByID(this.upActionID, 0.4, AnimationCrossFadeTypeEnum.IMMEDIATE);
						}
						this.startPosition.copy(this.waypointCharacter.getCurrentPosition());
						this.endPosition.copy(this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getInitialPosition());
						this.totalLength = this.startPosition.distanceTo(this.endPosition);
						this.distanceRatio = (1 / this.totalLength) * 100;
						this.lerpValue = 0;
						this.waypointClock.start();
						this.transition = 2;
					}
					break;
				case 2:
					//move character forward
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.startPosition.x, this.startPosition.y, this.startPosition.z];
						var D = [this.endPosition.x, this.endPosition.y, this.endPosition.z];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointCharacter.setCurrentPositionXYZ(this.lerpedValues[0],this.lerpedValues[1], this.lerpedValues[2]);

						if (!this.arWaypoints[this.previousWaypoint[0]][this.previousWaypoint[1]].getVisibility())
						{
							var distancefromprevious = this.waypointCharacter.getCurrentPosition().distanceTo(this.arWaypoints[this.previousWaypoint[0]][this.previousWaypoint[1]].getInitialPosition());
							
							if (distancefromprevious > this.arWaypoints[this.previousWaypoint[0]][this.previousWaypoint[1]].getModelRadius())
							{
								this.arWaypoints[this.previousWaypoint[0]][this.previousWaypoint[1]].setVisibility(true);
							}
						}
						if ((this.waypointClicked[0] == this.nextWaypoint[0]) && (this.waypointClicked[1] == this.nextWaypoint[1]))
						{
							var distancetotarget = this.waypointCharacter.getCurrentPosition().distanceTo(this.endPosition);
							if (distancetotarget < this.arWaypoints[this.waypointClicked[0]][this.waypointClicked[1]].getModelRadius())
							{
								//add previous target
								if (this.arWaypoints[this.waypointClicked[0]][this.waypointClicked[1]].getVisibility())
								{
									this.arWaypoints[this.waypointClicked[0]][this.waypointClicked[1]].setVisibility(false);
								}
							}
						}
						this.lerpValue = this.distanceRatio * (this.waypointClock.getElapsedTime() / this.moveSpeed);
						 
					}
					else
					{
						
						
						this.waypointCharacter.setCurrentPositionXYZ(this.endPosition.x, this.endPosition.y, this.endPosition.z);
						if ((this.waypointCharacter.getCurrentRotation().equals(this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentRotation())) || (this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getState() == WaypointButtonStateEnum.HIDDEN ))
						{
							console.log("case 2 next hidden");
							this.currentWaypoint = [this.nextWaypoint[0],this.nextWaypoint[1]];
							
							this.lerpValue = 0;
							this.transition = 0;
						}
						else
						{
							console.log("case 2 going to rotate to waypoint");
							this.startAngle = this.waypointCharacter.getCurrentRotationAngleY();
							this.endAngle = this.arWaypoints[this.nextWaypoint[0]][this.nextWaypoint[1]].getCurrentRotationAngleY();
							
							var diffangle = this.startAngle - this.endAngle;
							if (Math.abs(diffangle) > 180)
							{
								if (Math.sign(diffangle) == 1)
								{
									this.endAngle = 360 - Math.abs(this.endAngle);
								}
								else
								{
									this.endAngle = Math.abs(this.endAngle) - 360;
								}
								diffangle = this.startAngle - this.endAngle;
							}
							this.rotationRatio = Math.abs((1 / diffangle) * 100);
							if (this.endAngle > this.startAngle)
							{
								this.waypointCharacter.prepareCrossFadeByID(this.leftActionID, 0.2, AnimationCrossFadeTypeEnum.IMMEDIATE);
							}
							else
							{
								this.waypointCharacter.prepareCrossFadeByID(this.rightActionID, 0.2, AnimationCrossFadeTypeEnum.IMMEDIATE);
							} 
							this.waypointClock.start();
							this.lerpValue = 0;
							this.transition = 3;
						}
					}
					break;
				case 3:
					//rotate character to same direction as waypoint rotation
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.startAngle];
						var D = [this.endAngle];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointCharacter.setCurrentRotationAngleY(this.lerpedValues[0]);
						this.lerpValue = this.rotationRatio * (this.waypointClock.getElapsedTime() / this.turnSpeed);
					}
					else
					{
						this.waypointCharacter.setCurrentRotationAngleY(this.endAngle);
	
						this.currentWaypoint = [this.nextWaypoint[0], this.nextWaypoint[1]];
 						
						this.lerpValue = 0;
						this.transition = 0;
					}
					break;
				case 4:
					break;
				}
			}
			
			break;
		case WaypointsStateEnum.NOTTOUCHED:
			
			break;
		}
		for (let i = 0; i < this.arWaypoints.length; i++)
		{
			for (let j = 0; j < this.arWaypoints[i].length; j++)
			{
				if (this.arWaypoints[i][j] != undefined)
				{
					this.arWaypoints[i][j].update();
				}
			}
		}
	}  
	
}

ARStage.prototype.removeFromParent = function(){
	
	if (this.childAddedRuntimeObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimeObjects.length; i++)
		{
			this.stage.remove(this.childAddedRuntimeObjects[i][1]);
		}
	}
	
	if (this.childAddedRuntimePhysicsObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimePhysicsObjects.length; i++)
		{
			this.physicsGroup.remove(this.childAddedRuntimePhysicsObjects[i][1]);
		}
	}
	
	if (this.physicsGroup == null)
	{
		this.stage.remove(this.physicsGroup);
	}
	
	this.stage.remove(this.waypointsGroup);
	this.stageelevation.remove(this.stage);
	this.sideStageRotation.remove(this.stageelevation);
	this.sceneGroup.remove(this.sideStageRotation);
	
	if (this.stagePlatforms != null)
	{
		for (let i = 0; i < this.stagePlatforms.length; i++)
		{
			this.stage.remove( this.stagePlatforms[i][0] );
			disposeObjectMesh(this.stagePlatforms[i][0]);
			if (this.stagePlatforms[i][1] != null )
			{
				this.stagePlatforms[i][1].dispose();
				this.stagePlatforms[i][1] = null;
			}
			this.stagePlatforms[i][0] = null;
		}
		this.stagePlatforms.length = 0;
		this.stagePlatforms = null;
	}
	
	if (this.arModels != null)
	{
		for (let i = 0; i < this.arModels.length; i++)
		{
			if (this.arModels[i] != null)
			{
				this.arModels[i].removeFromParent();
			}
		}
	}
	
	if (this.arLights != null)
	{
		for (let i = 0; i < this.arLights.length; i++)
		{
			if (this.arLights[i] != null)
			{
				this.arLights[i].removeFromParent();
			}
		}
	}

	if (this.arCharacters != null)
	{
		for (let i = 0; i < this.arCharacters.length; i++)
		{
			this.arCharacters[i].removeFromParent();
		}
	}	
	
	if (this.arGroups != null)
	{
		for (let i = 0; i < this.arGroups.length; i++)
		{
			this.arGroups[i].removeFromParent();
		}
	}
	
	if (this.arParticleSystems != null)
	{
		for (let i = 0; i < this.arParticleSystems.length; i++)
		{
			this.arParticleSystems[i].removeFromParent();
		}
	}
	
	if (this.arWaypoints != null)
	{
		for (let i = 0; i < this.arWaypoints.length; i++)
		{
			for (let j = 0; j < this.arWaypoints[i].length; j++)
			{
				if (this.arWaypoints[i][j] != undefined)
				{
					this.arWaypoints[i][j].removeFromParent();
				}
			}
		}
	}
}



ARStage.prototype.dispose = function(){
	//var _this = this;
	
	
	if (this.stageTextures != null)
	{
		for (let i = 0; i < this.stageTextures.length; i++)
		{
			this.stageTextures[i].dispose();
			this.stageTextures[i] = null;
		}
		this.stageTextures.length = 0;
		this.stageTextures = null;
	}
	
	if (this.childAddedRuntimeObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimeObjects.length; i++)
		{
			this.childAddedRuntimeObjects[i][0] = null;
			this.childAddedRuntimeObjects[i][1] = null;
		}
		this.childAddedRuntimeObjects.length = 0;
		this.childAddedRuntimeObjects = null;
	}
	
	if (this.childAddedRuntimePhysicsObjects != null)
	{
		for (let i = 0; i < this.childAddedRuntimePhysicsObjects.length; i++)
		{
			this.childAddedRuntimePhysicsObjects[i][0] = null;
			this.childAddedRuntimePhysicsObjects[i][1] = null;
		}
		this.childAddedRuntimePhysicsObjects.length = 0;
		this.childAddedRuntimePhysicsObjects = null;
	}
	
	if (this.arModels != null)
	{
		for (let i = 0; i < this.arModels.length; i++)
		{
			if (this.arModels[i] != null)
			{
				this.arModels[i].dispose();
				this.arModels[i] = null;
			}
		}
		this.arModels.length = 0;
		this.arModels = null;
	}	

	if (this.arLights != null)
	{
		for (let i = 0; i < this.arLights.length; i++)
		{
			if (this.arLights[i] != null)
			{
				this.arLights[i].dispose();
				this.arLights[i] = null;
			}
		}
		this.arLights.length = 0;
		this.arLights = null;
	}	
	
	if (this.arCharacters != null)
	{
		for (let i = 0; i < this.arCharacters.length; i++)
		{
			this.arCharacters[i].dispose();
			this.arCharacters[i] = null;
		}
		this.arCharacters.length = 0;
		this.arCharacters = null;
	}
	
	if (this.arPhysicsObjects != null)
	{
		for (let i = 0; i < this.arPhysicsObjects.length; i++)
		{
			this.arPhysicsObjects[i].dispose();
			this.arPhysicsObjects[i] = null;
		}
		this.arPhysicsObjects.length = 0;
		this.arPhysicsObjects = null;
	}
	
	if (this.arGroups != null)
	{
		for (let i = 0; i < this.arGroups.length; i++)
		{
			this.arGroups[i].dispose();
			this.arGroups[i] = null;
		}
		this.arGroups.length = 0;
		this.arGroups = null;
	}
	
	if (this.arParticleSystems != null)
	{
		for (let i = 0; i < this.arParticleSystems.length; i++)
		{
			this.arParticleSystems[i].dispose();
			this.arParticleSystems[i] = null;
		}
		this.arParticleSystems.length = 0;
		this.arParticleSystems = null;
	}
	
	if (this.arWaypoints != null)
	{
		for (let i = 0; i < this.arWaypoints.length; i++)
		{
			for (let j = 0; j < this.arWaypoints[i].length; j++)
			{
				if (this.arWaypoints[i][j] != undefined)
				{
					this.arWaypoints[i][j].dispose();
					this.arWaypoints[i][j] = null;
				}
			}
		}
		this.arWaypoints.length = 0;
		this.arWaypoints = null;
	}
	
	if (this.arMeshButtonsReference != null)
	{
		for (let i = 0; i < this.arMeshButtonsReference.length; i++)
		{
			this.arMeshButtonsReference[i][0] = null;
			this.arMeshButtonsReference[i][1] = null;
		}
		this.arMeshButtonsReference.length = 0;
		this.arMeshButtonsReference = null;
	}
	
	if (this.arAudioClips != null)
	{
		if (this.arAudioClips.length > 0)
		{
			for (let i = 0; i < this.arAudioClips.length; i++)
			{
				this.arAudioClips[i].dispose();
				this.arAudioClips[i] = null;
			}
			this.arAudioClips.length = 0;
			this.arAudioClips = null;
		}
	}

	
	this.physicsGroup = null;
	this.waypointsGroup = null;
	this.waypointClock = null;
	this.stage = null;
	this.stageelevation = null;
	this.sideStageRotation = null;
	this.waypointCharacter = null;
	this.lerpedValues.length = 0;
	this.lerpedValues = null;
	this.stopAction = null;
	this.forwardAction = null;
	this.leftAction = null;
	this.rightAction = null;
	this.upAction = null;
	this.downAction = null;
	this.UID = null;
}