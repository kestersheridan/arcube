

const GeometryFrameTypeEnum = {
  SHORTSIDE: 0,
  LONGSIDE: 1,
  SIDEPANEL: 2
};

const CubeStateEnum = {
  NOTACTIVE: 0,
  INITOPENING: 1,
  OPENING: 2,
  TRANSITION2ACTIVE : 3,
  ACTIVE: 4,
  CLOSING: 5,
  TRANSITION2TIMEOUT : 6,
  TIMEDOUT: 7
};

ArCube = function() {
		
		var _this = this;
		this.lerpValue;
		this.lerpedValues  = new Array;
		
		this.boxClock = new THREE.Clock();
		this.timeoutClick = new THREE.Clock(false);
		
		this.openLidSpeed = g_Structure.arscanner.cubesettings.openspeed;
		this.flipStageSpeed = g_Structure.arscanner.cubesettings.flipspeed;
		this.elevationStageSpeed = g_Structure.arscanner.cubesettings.elevationspeed;
		this.inactiveTimeout = g_Structure.arscanner.cubesettings.timeout;
		this.boxLiftSpeed = g_Structure.arscanner.cubesettings.boxliftspeed;
		this.playerRaycaster = new THREE.Raycaster();
		this.cubeSides = new Array;
		this.cubeSides.length = 0;
		this.markerRootArray  = [];
		this.markerGroupArray = [];
		this.sceneGroup = new THREE.Group();
		this.cubefacesGroup = new THREE.Group();
		this.sceneLightsGroup = null;
		this.storedHemisphereLightIntensities = [];
		this.storedAmbientLightIntensities = [];
		this.sceneGroup.add(this.cubefacesGroup);
		this.markerScale = g_Content.cube.markerscale;
		this.renderScale = g_Content.cube.renderscale;
		this.sceneGroup.scale.set((this.renderScale)/2, (this.renderScale)/2, (this.renderScale)/2);
		this.cubeWidth = g_Content.cube.cubesize;
		this.frameDepth = g_Content.cube.framedepth;
		this.assetLoaders = new Array;
		this.assetModelTextures = new Array;
		this.distanceRatio = 0;
		this.touchedCubeSide = null;
		this.touchedCubeSideIsBox = null;
		
		this.activeCubeFaces = new Array;
		this.activeCubeStages = new Array;
		this.updateStageCounter = 0;
		
		this.currentCubeState = CubeStateEnum.NOTACTIVE;
		this.previousCubeState = CubeStateEnum.NOTACTIVE;
		this.frameMesh = null;
		
		this.topFace = null;
		this.forwardFace = null;
		this.physicsFrontFace = null;
		
		this.isVisible = false;
		this.previousVisibleState = false;
		this.storedVisibleFace = null;
		
		this.sensorEuler = new THREE.Euler();
		this.sensorAdjustedQuaternion = new THREE.Quaternion();
		
		this.cubeEuler = new THREE.Euler(0, 0, 0, 'YXZ');
		this.adjustedCubeEuler = new THREE.Euler(0, 0, 0, 'YXZ');
		this.adjustedCubeEulerXZ = new THREE.Euler(0, 0, 0, 'YXZ');
		this.adjustedCubeRotationQuat = new THREE.Quaternion();
		this.medianCubeRotationQuat = new THREE.Quaternion();
		this.medianCubeEulerXZ = new THREE.Euler(0, 0, 0, 'YXZ');
		this.prevMedianCubeEulerXZ = new THREE.Euler(0, 0, 0, 'YXZ');
		this.lerpMedianCubeEulerXZ = new THREE.Euler(0, 0, 0, 'YXZ');
		this.arrayCubeEulerX = new Array;
		this.arrayCubeEulerZ = new Array;
		this.MEDIANDATASET = 10;
		this.MAXANGLE = 10;
		this.CUBECONTROLCOUNT = 15;
		this.transitionCubeControl = false;
		this.cubeControlActive = false;
		this.cubeControlActiveCounter = 0;
		
		
		this.adjustedCameraUp = new THREE.Vector3();
		
		this.cubeWorldQuaternion = new THREE.Quaternion();
		this.cameraWorldQuaternion = new THREE.Quaternion();
		this.cubeWorldPositionVector = new THREE.Vector3();
		this.adjustedCubeWorldQuaternion = new THREE.Quaternion();
		this.cameraLookAtMatrix = new THREE.Matrix4();
		
		this.sensorEulerXAngle = 0;
		this.sensorEulerXAngle = 0;
		this.deltaSensorEulerXAngle = 0;
		this.deltaSensorEulerYAngle = 0;
		this.trackedFace = null;
		
		this.adjustedCameraLookAtQuaternion = new THREE.Quaternion();
		
		this.cameraLookAtMatrix = new THREE.Matrix4();
		
		this.cameraWorldUpVector = new THREE.Vector3();
		this.cameraWorldPositionVector = new THREE.Vector3();
		this.cameraWorldQuaternion = new THREE.Quaternion();
		this.rotationHelper = null;
		this.transition = 0; 
		this.liftEntranceTypePresent = false;
		
		this.displayHelp = false;
		this.displayHelpTimer = new THREE.Clock(false);
		this.displayHelpTimeout = g_Structure.arscanner.helpcaption.timeout;
		
		this.displayIntrotext = false;
		this.displayIntroTimer = new THREE.Clock(false);
		this.displayIntroTimeout = g_Structure.arscanner.introcaption.timeout;
		
		//lights
		
		if (g_Content.cube.hasOwnProperty('lights'))
		{
			for (let i = 0; i < g_Content.cube.lights.length; i++)
			{
				if (_this.sceneLightsGroup == null)
				{
					_this.sceneLightsGroup = new THREE.Group();
					g_scene.add(this.sceneLightsGroup);
				}
							
				switch (g_Content.cube.lights[i].light.type.toLowerCase()) {
				case "hemisphere":
					var skycolour = 0xffffff;
					var groundcolour = 0xffffff;
					var intensity = 1;
					if (g_Content.cube.lights[i].light.hasOwnProperty('skycolour'))
					{
						skycolour = g_Content.cube.lights[i].light.skycolour
									
					}
					if (g_Content.cube.lights[i].light.hasOwnProperty('groundcolour'))
					{
						groundcolour = g_Content.cube.lights[i].light.groundcolour;
						console.log("hemisphere groundcolour " + groundcolour);
					}
					if (g_Content.cube.lights[i].light.hasOwnProperty('intensity'))
					{
						intensity = g_Content.cube.lights[i].light.intensity;
						console.log("hemisphere intensity " + intensity);
					}
					_this.sceneLightsGroup.add( new THREE.HemisphereLight( skycolour, groundcolour, intensity) );
					_this.storedHemisphereLightIntensities.push(intensity);

					break;
				case "ambient":
					_this.sceneLightsGroup.add( new THREE.AmbientLight( g_Content.cube.lights[i].light.colour ) );
					var intensity = 1;
					_this.storedAmbientLightIntensities.push(intensity);
					break;
				case "directional":
					var colour = 0xffffff;
					var intensity = 1;
					if (g_Content.cube.lights[i].light.hasOwnProperty('colour'))
					{
						colour = g_Content.cube.lights[i].light.colour;
						console.log("directional colour " + colour);
					}
					if (g_Content.cube.lights[i].light.hasOwnProperty('intensity'))
					{
						intensity = g_Content.cube.lights[i].light.intensity;
						console.log("directional intensity " + intensity);
					}
					var light = new THREE.DirectionalLight( colour, intensity );
					light.position.set( g_Content.cube.lights[i].light.x, g_Content.cube.lights[i].light.y, g_Content.cube.lights[i].light.z );
								
					if ((!g_renderer.shadowMap.enabled) && (g_Content.cube.lights[i].light.castshadow))
					{
								
						g_renderer.shadowMap.enabled = true;
						if (g_Content.cube.lights[i].light.hasOwnProperty('softshadow'))
						{
							if (g_Content.cube.lights[i].light.SoftShadow)
								g_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
						}
					}
								
					light.castShadow = g_Content.cube.lights[i].light.castshadow;
					light.shadow.camera.zoom = g_Content.cube.lights[i].light.shadowCamZoom;
					if (!g_Content.cube.lights[i].light.hasOwnProperty('shadowmapsize'))
					{
						light.shadow.mapSize.width = 512;  // default
						light.shadow.mapSize.height = 512; // default
					}
					else
					{
						light.shadow.mapSize.width = g_Content.cube.lights[i].light.shadowmapsize;  
						light.shadow.mapSize.height = g_Content.cube.lights[i].light.shadowmapsize; 
					}
					_this.sceneLightsGroup.add( light );
					light.target.position.set( g_Content.cube.lights[i].light.targetx, g_Content.cube.lights[i].light.targety, g_Content.cube.lights[i].light.targetz );
					_this.sceneLightsGroup.add( light.target );
					var helper = new THREE.CameraHelper( light.shadow.camera );
					break;
				case "lensflare":
				// lensflare
	
					var loader = new THREE.TextureLoader(g_loadingManager);
					var texture0 = loader.load( "assets/textures/lensflare/lensflare0.png" );
					var texture3 = loader.load( "assets/textures/lensflare/lensflare3.png" );
					var lensflare = new THREE.Lensflare();
					lensflare.position.set( g_Content.cube.lights[i].light.x, g_Content.cube.lights[i].light.y, g_Content.cube.lights[i].light.z );
					lensflare.addElement( new THREE.LensflareElement( texture0, 700, 0 ) );
					lensflare.addElement( new THREE.LensflareElement( texture3, 60, 0.6 ) );
					lensflare.addElement( new THREE.LensflareElement( texture3, 70, 0.7 ) );
					lensflare.addElement( new THREE.LensflareElement( texture3, 120, 0.9 ) );
					lensflare.addElement( new THREE.LensflareElement( texture3, 70, 1 ) );
					_this.sceneLightsGroup.add( lensflare );

					break;
				}
			}		
		}
		
		
		if (g_Content.cube.sides.length > 0)
		{
			for (let i = 0; i < g_Content.cube.sides.length; i++)
			{
				//error thrown here if pattern not loaded
				var cubeside = new CubeSide(_this.sceneGroup,  _this.cubefacesGroup, _this.cubeWidth, _this.markerScale, g_Content.cube.holewidth, g_Content.cube.framedepth, g_Content.cube.lidsegments, g_Content.cube.sides[i].side, _this);
				_this.cubeSides.push(cubeside);
				
			}	
	
		}
		
/* 		this.loadSideContent = function(value) {
			_this.cubeSides[i].loadContent(g_Content.cube.sides[value].side.content);
		} */
		
		
		/* if (_this.cubeSides != null)
		{
			for (let i = 0; i < _this.cubeSides.length; i++)
			{
				_this.cubeSides[i].loadContent(g_Content.cube.sides[i].side.content);
			}
		} */
		
		
		
		//load reusable assets
		this.loadAssetLoader = function() {
			if (_this.assetLoaders.length > 0)
			{
				for (let i = 0; i < _this.assetLoaders.length; i++)
				{
					switch (_this.assetLoaders[i].AssetType) {
					case AssetLoaderTypeEnum.MODEL:
						for (let j = 0; j < g_Content.reusable.models.length; j++)
						{
							if (_this.assetLoaders[i].AssetID == g_Content.reusable.models[j].model.id)
							{
								if (g_Content.reusable.models[j].model.hasOwnProperty('fbx'))
								{
									var loader = new THREE.FBXLoader(g_loadingManager);
									loader.load( 'assets/models/' + g_Content.reusable.models[j].model.fbx, function ( object ) {
										_this.assetLoaders[i].Asset = object;
										
										object.traverse(function (child) {
											if (child instanceof THREE.Mesh) {

												// delete texture
												var texture = child.material.map;
												if (texture != undefined)
												{
													_this.assetModelTextures.push(texture);
												}
											}
										});
										
										for (let k = 0; k < _this.assetLoaders[i].AssetFunctionArray.length; k++)
										{
											
											_this.assetLoaders[i].AssetFunctionArray[k](_this.assetLoaders[i].Asset, _this.assetLoaders[i].AssetFunctionParameter[k], true, AssetFileTypeEnum.FBX);
										}
										
									})
								}

								if (g_Content.reusable.models[j].model.hasOwnProperty('glb'))
								{
									var loader = new THREE.GLTFLoader(g_loadingManager);
									loader.load( 'assets/models/' + g_Content.reusable.models[j].model.glb , function ( gltf ) {
										//_this.assetLoaders[i].Asset = gltf.scene;
										_this.assetLoaders[i].Asset = gltf
										gltf.scene.traverse(function (child) {
											if (child instanceof THREE.Mesh) {

												// delete texture
												var texture = child.material.map;
												if (texture != undefined)
												{
													_this.assetModelTextures.push(texture);
												}
											}
										});
										for (let k = 0; k < _this.assetLoaders[i].AssetFunctionArray.length; k++)
										{
											_this.assetLoaders[i].AssetFunctionArray[k](_this.assetLoaders[i].Asset, _this.assetLoaders[i].AssetFunctionParameter[k], true, AssetFileTypeEnum.GLB);
										}
										
									})
								}
								break;
							}
						}
						break;
					case AssetLoaderTypeEnum.TEXTURE:
						for (let j = 0; j < g_Content.reusable.textures.length; j++)
						{
							if (_this.assetLoaders[i].AssetID == g_Content.reusable.textures[j].texture.id)
							{
								var loader = new AjaxTextureLoader(g_loadingManager);
								loader.load( "assets/textures/" + g_Content.reusable.textures[j].texture.file , function( texture ) {
									_this.assetLoaders[i].Asset = texture;	
									for (let k = 0; k < _this.assetLoaders[i].AssetFunctionArray.length; k++)
									{
										_this.assetLoaders[i].AssetFunctionArray[k](_this.assetLoaders[i].Asset, _this.assetLoaders[i].AssetFunctionParameter[k]);
									}
								});
								break;
							}
						}
						break;
					}
				}
			
			}
		}
		
		
		_this.rotationHelper = new THREE.Object3D();
		_this.sceneGroup.add( _this.rotationHelper );

		//create frame for box
		var bufferGeometry = new THREE.BufferGeometry();
		
		
		var framewidth = (_this.cubeWidth - g_Content.cube.holewidth) / 2;
		
	
		var rotationsX = [0,0,Math.PI / 2,-Math.PI / 2,0,0,-Math.PI / 2,Math.PI / 2,0,0,0,0,0,0,0,0,0,0,0,0];
		var rotationsY = [Math.PI / 2,Math.PI / 2,Math.PI / 2,Math.PI / 2,-Math.PI / 2,-Math.PI / 2,-Math.PI / 2,-Math.PI / 2,0,Math.PI,0,Math.PI,0,0,0,0,0,0,0,0];
		var rotationsZ = [0,Math.PI,0,0,0,Math.PI,0,0,0,0,Math.PI,Math.PI,0,0,0,0,0,0,0,0];
		var translations = [new THREE.Vector3(0,-(_this.cubeWidth / 2), (_this.cubeWidth / 2)), new THREE.Vector3(0,(_this.cubeWidth / 2), (_this.cubeWidth / 2)),
							new THREE.Vector3(-(_this.cubeWidth / 2),0, (_this.cubeWidth / 2)),new THREE.Vector3((_this.cubeWidth / 2),0, (_this.cubeWidth / 2)),
							new THREE.Vector3(0,-(_this.cubeWidth / 2), -(_this.cubeWidth / 2)),new THREE.Vector3(0,(_this.cubeWidth / 2), -(_this.cubeWidth / 2)),
							new THREE.Vector3(-(_this.cubeWidth / 2),0, -(_this.cubeWidth / 2)),new THREE.Vector3((_this.cubeWidth / 2),0, -(_this.cubeWidth / 2)),
							new THREE.Vector3(-(_this.cubeWidth / 2),-(_this.cubeWidth / 2), 0),new THREE.Vector3((_this.cubeWidth / 2),-(_this.cubeWidth / 2), 0),
							new THREE.Vector3((_this.cubeWidth / 2),(_this.cubeWidth / 2), 0),new THREE.Vector3(-(_this.cubeWidth / 2),(_this.cubeWidth / 2), 0),
							new THREE.Vector3(-(_this.cubeWidth / 2),(_this.cubeWidth / 2) - framewidth, (_this.cubeWidth / 2)),
							new THREE.Vector3((_this.cubeWidth / 2) - framewidth ,(_this.cubeWidth / 2) - framewidth, (_this.cubeWidth / 2)),
							new THREE.Vector3(-(_this.cubeWidth / 2),-(_this.cubeWidth / 2), (_this.cubeWidth / 2)),
							new THREE.Vector3((_this.cubeWidth / 2) - framewidth ,-(_this.cubeWidth / 2), (_this.cubeWidth / 2)),
							new THREE.Vector3(-(_this.cubeWidth / 2),(_this.cubeWidth / 2) - framewidth, -(_this.cubeWidth / 2) + this.frameDepth),
							new THREE.Vector3((_this.cubeWidth / 2) - framewidth ,(_this.cubeWidth / 2) - framewidth, -(_this.cubeWidth / 2) + this.frameDepth),
							new THREE.Vector3(-(_this.cubeWidth / 2),-(_this.cubeWidth / 2), -(_this.cubeWidth / 2) + this.frameDepth),
							new THREE.Vector3((_this.cubeWidth / 2) - framewidth ,-(_this.cubeWidth / 2), -(_this.cubeWidth / 2) + this.frameDepth)];


		var vector = new THREE.Vector3();
		var rotationvector = new THREE.Vector3();
		
		var shortsidefaceGeometry = createFrameGeometry(g_Content.cube.holewidth, GeometryFrameTypeEnum.SHORTSIDE);
		var longsidefaceGeometry = createFrameGeometry(g_Content.cube.holewidth, GeometryFrameTypeEnum.LONGSIDE);
		var sidepanelfaceGeometry = createFrameGeometry(g_Content.cube.holewidth, GeometryFrameTypeEnum.SIDEPANEL);
		var geometry = new THREE.Geometry();
		var singleGeometry = new THREE.Geometry();
		
		
		for ( var i = 0; i < rotationsX.length; i ++ ) {

			if (i < 8)
			{
				geometry.copy( shortsidefaceGeometry );
			}
			else if ((i > 7) && (i < 12))
			{
				geometry.copy( longsidefaceGeometry );
			}
			else if (i > 11)
			{
				geometry.copy( sidepanelfaceGeometry );
			}
			geometry.rotateX(rotationsX[i]);
			geometry.rotateY(rotationsY[i]);
			geometry.rotateZ(rotationsZ[i]);
			geometry.translate( translations[i].x, translations[i].y, translations[i].z );
			
			singleGeometry.merge(geometry, geometry.matrix);


		}
		singleGeometry.computeFaceNormals();
		singleGeometry.computeFlatVertexNormals();

		var colour = new THREE.Color( 0xffffff );
		if (g_Content.cube.hasOwnProperty('framecolour'))
		{
			colour = g_Content.cube.framecolour;
		}
		
		var material = new THREE.MeshStandardMaterial( { color: colour } );

		this.frameMesh = new THREE.Mesh( singleGeometry, material );
		this.frameMesh.castShadow = true;
		this.frameMesh.receiveShadow = true;
		this.frameMesh.name = "boxframe";

		_this.cubefacesGroup.add(this.frameMesh);
		
		function createFrameGeometry(holesize, frametype){

			var geometry = null;
			var framewidth = (_this.cubeWidth - holesize) / 2;
			var frameShape = new THREE.Shape();
		
			switch (frametype) {
				case GeometryFrameTypeEnum.SHORTSIDE:

					frameShape.moveTo( 0,0 );
					frameShape.lineTo( 0, framewidth );
					frameShape.lineTo( _this.frameDepth, framewidth );
					frameShape.lineTo( _this.frameDepth, _this.frameDepth );
					frameShape.lineTo( framewidth, _this.frameDepth );
					frameShape.lineTo( framewidth, 0 );
					frameShape.lineTo( 0, 0 );

					var extrudeSettings = {
						amount: holesize,
						bevelEnabled: false,
						curveSegments: 40,
						material: 0,
						extrudeMaterial: 1
					};
	
					geometry = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
		
					geometry.computeBoundingBox();
					geometry.computeVertexNormals();
					geometry.translate( 0, 0, -(holesize / 2) );
					break;
				case GeometryFrameTypeEnum.LONGSIDE:

					frameShape.moveTo( 0,0 );
					frameShape.lineTo( 0, framewidth );
					frameShape.lineTo( _this.frameDepth, framewidth );
					frameShape.lineTo( _this.frameDepth, _this.frameDepth );
					frameShape.lineTo( framewidth, _this.frameDepth );
					frameShape.lineTo( framewidth, 0 );
					frameShape.lineTo( 0, 0 );
					var extrudelength = _this.cubeWidth - (_this.frameDepth * 2); 
					var extrudeSettings = {
						amount: extrudelength,
						bevelEnabled: false,
						curveSegments: 40,
						material: 0,
						extrudeMaterial: 1
					};

					geometry = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
		
					geometry.computeBoundingBox();
					geometry.computeVertexNormals();
					geometry.translate( 0, 0, -(extrudelength / 2) );
					break;
				case GeometryFrameTypeEnum.SIDEPANEL:

					frameShape.moveTo( 0,0 );
					frameShape.lineTo( 0, framewidth );
					frameShape.lineTo( framewidth, framewidth );
					frameShape.lineTo( framewidth, 0 );
					frameShape.lineTo( 0, 0 );

					var extrudeSettings = {
						amount: _this.frameDepth,
						bevelEnabled: false,
						curveSegments: 40,
						material: 0,
						extrudeMaterial: 1
					};

					geometry = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
		
					geometry.computeBoundingBox();
					geometry.computeVertexNormals();
					geometry.translate( 0, 0, -(_this.frameDepth) );
					break;
			}
			return geometry;
		};
		
		return;
	}
	
	 
  
ArCube.prototype.constructor = ArCube;  

ArCube.prototype.loadSideStages = function(value){
	if (value < this.cubeSides.length)
	{
		this.cubeSides[value].loadStages()
	}
}

ArCube.prototype.loadAssets = function(){
	this.loadAssetLoader();
}

ArCube.prototype.loadStates = function(){
	console.log(" ArCube loadstates");
	for(let i=0;i<this.cubeSides.length;i++)
	{
		this.cubeSides[i].loadStates();
	}
}

/* ArCube.prototype.addObjectReferences = function(){
	console.log(" ArCube addObjectReferences");
	for(let i=0;i<this.cubeSides.length;i++)
	{
		this.cubeSides[i].addObjectReferences();
	}
} */

  
ArCube.prototype.init = function(){
	var _this = this;
	for(let i=0;i<_this.cubeSides.length;i++)
	{
		_this.cubeSides[i].setupStages();
		
	} 
}

ArCube.prototype.setupAssetLoader = function(assetid, assettype, func, item){
	var _this = this;
	if (_this.assetLoaders.length > 0)
	{
		var index = null;
		for (let i = 0; i < _this.assetLoaders.length; i++)
		{
			if ((_this.assetLoaders[i].AssetID == assetid) && (_this.assetLoaders[i].AssetType == assettype))
			{
				_this.assetLoaders[i].AssetFunctionArray.push(func);
				_this.assetLoaders[i].AssetFunctionParameter.push(item);
				index = i;
				break;
			}
		}
		if (index == null)
		{
			var assetloader = new AssetLoader(assetid, assettype, func, item);
			_this.assetLoaders.push(assetloader);
		}
		
	}
	else
	{
		var assetloader = new AssetLoader(assetid, assettype, func, item);
		_this.assetLoaders.push(assetloader);
	}
}	


ArCube.prototype.closing = function() {
	var _this = this;
	if (this.currentCubeState != CubeStateEnum.NOTACTIVE)
	{		
		if (this.displayIntrotext)
		{
			this.displayIntroTimer.stop();
			this.displayIntrotext = false;
		}
		if (this.displayHelp)
		{
			this.displayHelp = false;
			this.displayHelpTimer.stop();
		}
		if (this.touchedCubeSide != null)
		{
			for(let i=0;i< _this.activeCubeStages.length;i++)
			{
				switch (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0])) {
				case EntranceTypeEnum.LIFT:
				case EntranceTypeEnum.HALFLIFT:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[i][0]), _this.activeCubeStages[i][0])
					break;
				case EntranceTypeEnum.FULLFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, 180, _this.activeCubeStages[i][0]);
					break;
				case EntranceTypeEnum.HALFFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(0, 0, 0, _this.activeCubeStages[i][0]);
					break;
				}
				_this.cubeSides[this.touchedCubeSide].setStageVisiblity(false, _this.activeCubeStages[i][0]);
			}
			if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()))
			{
				_this.cubeSides[this.touchedCubeSide].pauseMediaPlayback();
			}
		}
		for(let i=0;i< _this.activeCubeFaces.length;i++)
		{
			_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(0)
			_this.cubeSides[_this.activeCubeFaces[i]].setBoxLidVisibility(true);
			_this.cubeSides[_this.activeCubeFaces[i]].setLidSegmentVisibility(false);
		}
		_this.activeCubeFaces.length = 0;
		_this.touchedCubeSideContentType = null;
		_this.touchedCubeSide = null;
		_this.boxClock.stop();
		_this.currentCubeState = CubeStateEnum.NOTACTIVE;	
	}	
	if (_this.timeoutClick.running)
	{
		_this.timeoutClick.stop();
	}
}
  
ArCube.prototype.update = function(){
		var _this = this;
		
		
		if (this.displayIntrotext)
		{
			if (this.displayIntroTimer.getElapsedTime() > this.displayIntroTimeout)
			{
				this.displayIntroTimer.stop();
				this.displayIntrotext = false;
			}
		}
		
		checkCubeVisible();
		
		switch (_this.currentCubeState) {
		case CubeStateEnum.NOTACTIVE:
			if (_this.timeoutClick.running)
			{
				_this.timeoutClick.stop();
			}
			calculateCubeOrientation();
			break;		
		case CubeStateEnum.INITOPENING:
			this.displayIntrotext = true;
			this.displayIntroTimer.start();
			this.displayHelp = false;
			this.activeCubeFaces.length = 0;
			this.activeCubeStages.length = 0;
			this.transition = 0;
			_this.touchedCubeSideIsBox = _this.cubeSides[this.touchedCubeSide].isBoxType();
			var bottomfacetype = null;
			var bottomfaceid = null;
			var backfacetype = null;
			var backfaceid = null;
			var leftfacetype = null;
			var leftfaceid = null;
			var rightfacetype = null;
			var rightfaceid = null;
			var topfacetype = null;
			var topfaceid = null;
			var frontfacetype = null;
			var frontfaceid = null;
			if (_this.cubeSides[this.touchedCubeSide].isTopAligned())
			{
				switch (_this.cubeSides[_this.topFace].getSideFaceType()) {
				case SideFaceTypeEnum.TOPFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.FRONTFACE:
						backfacetype = SideFaceTypeEnum.BACKFACE;
						leftfacetype = SideFaceTypeEnum.LEFTFACE;
						rightfacetype = SideFaceTypeEnum.RIGHTFACE;
						break;
					case SideFaceTypeEnum.BACKFACE:
						backfacetype = SideFaceTypeEnum.FRONTFACE;
						leftfacetype = SideFaceTypeEnum.RIGHTFACE;
						rightfacetype = SideFaceTypeEnum.LEFTFACE;
						break;
					case SideFaceTypeEnum.LEFTFACE:
						backfacetype = SideFaceTypeEnum.RIGHTFACE;
						leftfacetype = SideFaceTypeEnum.BACKFACE;
						rightfacetype = SideFaceTypeEnum.FRONTFACE;
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						backfacetype = SideFaceTypeEnum.LEFTFACE;
						leftfacetype = SideFaceTypeEnum.FRONTFACE;
						rightfacetype = SideFaceTypeEnum.BACKFACE;
						break;
					}
					bottomfacetype = SideFaceTypeEnum.BOTTOMFACE;
					break;
				case SideFaceTypeEnum.BOTTOMFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.FRONTFACE:
						backfacetype = SideFaceTypeEnum.BACKFACE;
						leftfacetype = SideFaceTypeEnum.RIGHTFACE;
						rightfacetype = SideFaceTypeEnum.LEFTFACE;
						break;
					case SideFaceTypeEnum.BACKFACE:
						backfacetype = SideFaceTypeEnum.FRONTFACE;
						leftfacetype = SideFaceTypeEnum.LEFTFACE;
						rightfacetype = SideFaceTypeEnum.RIGHTFACE;
						break;
					case SideFaceTypeEnum.LEFTFACE:
						backfacetype = SideFaceTypeEnum.RIGHTFACE;
						leftfacetype = SideFaceTypeEnum.FRONTFACE;
						rightfacetype = SideFaceTypeEnum.BACKFACE;
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						backfacetype = SideFaceTypeEnum.LEFTFACE;
						leftfacetype = SideFaceTypeEnum.BACKFACE;
						rightfacetype = SideFaceTypeEnum.FRONTFACE;
						break;
					}
					bottomfacetype = SideFaceTypeEnum.TOPFACE;
					break;
				case SideFaceTypeEnum.FRONTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
						backfacetype = SideFaceTypeEnum.BOTTOMFACE;
						leftfacetype = SideFaceTypeEnum.RIGHTFACE;
						rightfacetype = SideFaceTypeEnum.LEFTFACE;
						break;
					case SideFaceTypeEnum.BOTTOMFACE:
						backfacetype = SideFaceTypeEnum.TOPFACE;
						leftfacetype = SideFaceTypeEnum.LEFTFACE;
						rightfacetype = SideFaceTypeEnum.RIGHTFACE;
						break;
					case SideFaceTypeEnum.LEFTFACE:
						backfacetype = SideFaceTypeEnum.RIGHTFACE;
						leftfacetype = SideFaceTypeEnum.TOPFACE;
						rightfacetype = SideFaceTypeEnum.BOTTOMFACE;
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						backfacetype = SideFaceTypeEnum.LEFTFACE;
						leftfacetype = SideFaceTypeEnum.BOTTOMFACE;
						rightfacetype = SideFaceTypeEnum.TOPFACE;
						break;
					}
					bottomfacetype = SideFaceTypeEnum.BACKFACE;
					break;
				case SideFaceTypeEnum.BACKFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
						backfacetype = SideFaceTypeEnum.BOTTOMFACE;
						leftfacetype = SideFaceTypeEnum.LEFTFACE;
						rightfacetype = SideFaceTypeEnum.RIGHTFACE;
						break;
					case SideFaceTypeEnum.BOTTOMFACE:
						backfacetype = SideFaceTypeEnum.TOPFACE;
						leftfacetype = SideFaceTypeEnum.RIGHTFACE;
						rightfacetype = SideFaceTypeEnum.LEFTFACE;
						break;
					case SideFaceTypeEnum.LEFTFACE:
						backfacetype = SideFaceTypeEnum.RIGHTFACE;
						leftfacetype = SideFaceTypeEnum.BOTTOMFACE;
						rightfacetype = SideFaceTypeEnum.TOPFACE;
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						backfacetype = SideFaceTypeEnum.LEFTFACE;
						leftfacetype = SideFaceTypeEnum.TOPFACE;
						rightfacetype = SideFaceTypeEnum.BOTTOMFACE;
						break;
					}
					bottomfacetype = SideFaceTypeEnum.FRONTFACE;
					break;
				case SideFaceTypeEnum.LEFTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
						backfacetype = SideFaceTypeEnum.BOTTOMFACE;
						leftfacetype = SideFaceTypeEnum.FRONTFACE;
						rightfacetype = SideFaceTypeEnum.BACKFACE;
						break;
					case SideFaceTypeEnum.FRONTFACE:
						backfacetype = SideFaceTypeEnum.BACKFACE;
						leftfacetype = SideFaceTypeEnum.BOTTOMFACE;
						rightfacetype = SideFaceTypeEnum.TOPFACE;
						break;
					case SideFaceTypeEnum.BACKFACE:
						backfacetype = SideFaceTypeEnum.FRONTFACE;
						leftfacetype = SideFaceTypeEnum.TOPFACE;
						rightfacetype = SideFaceTypeEnum.BOTTOMFACE;
						break;
					case SideFaceTypeEnum.BOTTOMFACE:
						backfacetype = SideFaceTypeEnum.TOPFACE;
						leftfacetype = SideFaceTypeEnum.BACKFACE;
						rightfacetype = SideFaceTypeEnum.FRONTFACE;
						break;
					}					
					bottomfacetype = SideFaceTypeEnum.RIGHTFACE;
					break;
				case SideFaceTypeEnum.RIGHTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
						backfacetype = SideFaceTypeEnum.BOTTOMFACE;
						leftfacetype = SideFaceTypeEnum.BACKFACE;
						rightfacetype = SideFaceTypeEnum.FRONTFACE;
						break;
					case SideFaceTypeEnum.FRONTFACE:
						backfacetype = SideFaceTypeEnum.BACKFACE;
						leftfacetype = SideFaceTypeEnum.TOPFACE;
						rightfacetype = SideFaceTypeEnum.BOTTOMFACE;
						break;
					case SideFaceTypeEnum.BACKFACE:
						backfacetype = SideFaceTypeEnum.FRONTFACE;
						leftfacetype = SideFaceTypeEnum.BOTTOMFACE;
						rightfacetype = SideFaceTypeEnum.TOPFACE;
						break;
					case SideFaceTypeEnum.BOTTOMFACE:
						backfacetype = SideFaceTypeEnum.TOPFACE;
						leftfacetype = SideFaceTypeEnum.FRONTFACE;
						rightfacetype = SideFaceTypeEnum.BACKFACE;
						break;
					}					
					bottomfacetype = SideFaceTypeEnum.LEFTFACE;
					break;						
				}
				topfacetype = _this.cubeSides[_this.topFace].getSideFaceType();
				topfaceid = _this.topFace;
				frontfacetype = _this.cubeSides[_this.forwardFace].getSideFaceType();
				frontfaceid = _this.forwardFace;
				
			}
			else
			{
				topfacetype = _this.cubeSides[this.touchedCubeSide].getSideFaceType();
				topfaceid = this.touchedCubeSide;
				switch (topfacetype) {
				case SideFaceTypeEnum.TOPFACE:
					frontfacetype = SideFaceTypeEnum.FRONTFACE;
					backfacetype = SideFaceTypeEnum.BACKFACE;
					leftfacetype = SideFaceTypeEnum.LEFTFACE;
					rightfacetype = SideFaceTypeEnum.RIGHTFACE;
					bottomfacetype = SideFaceTypeEnum.BOTTOMFACE;
					break;
				case SideFaceTypeEnum.BOTTOMFACE:
					frontfacetype = SideFaceTypeEnum.FRONTFACE;
					backfacetype = SideFaceTypeEnum.BACKFACE;
					leftfacetype = SideFaceTypeEnum.RIGHTFACE;
					rightfacetype = SideFaceTypeEnum.LEFTFACE;
					bottomfacetype = SideFaceTypeEnum.TOPFACE;
					break;
				case SideFaceTypeEnum.FRONTFACE:
					frontfacetype = SideFaceTypeEnum.TOPFACE;
					backfacetype = SideFaceTypeEnum.BOTTOMFACE;
					leftfacetype = SideFaceTypeEnum.LEFTFACE;
					rightfacetype = SideFaceTypeEnum.RIGHTFACE;
					bottomfacetype = SideFaceTypeEnum.BACKFACE;
					break;
				case SideFaceTypeEnum.BACKFACE:
					frontfacetype = SideFaceTypeEnum.TOPFACE;
					backfacetype = SideFaceTypeEnum.BOTTOMFACE;
					leftfacetype = SideFaceTypeEnum.LEFTFACE;
					rightfacetype = SideFaceTypeEnum.RIGHTFACE;
					bottomfacetype = SideFaceTypeEnum.FRONTFACE;
					break;
				case SideFaceTypeEnum.LEFTFACE:
					frontfacetype = SideFaceTypeEnum.TOPFACE;
					backfacetype = SideFaceTypeEnum.BACKFACE;
					leftfacetype = SideFaceTypeEnum.BOTTOMFACE;
					rightfacetype = SideFaceTypeEnum.TOPFACE;
					bottomfacetype = SideFaceTypeEnum.RIGHTFACE;
					break;
				case SideFaceTypeEnum.RIGHTFACE:
					frontfacetype = SideFaceTypeEnum.FRONTFACE;
					backfacetype = SideFaceTypeEnum.BACKFACE;
					leftfacetype = SideFaceTypeEnum.TOPFACE;
					rightfacetype = SideFaceTypeEnum.BOTTOMFACE;
					bottomfacetype = SideFaceTypeEnum.LEFTFACE;
					break;
				}
			}
			for(let i=0;i< _this.cubeSides.length;i++)
			{
				if (_this.cubeSides[i].getSideFaceType() == backfacetype)
				{
					backfaceid = i;
				}
				if (_this.cubeSides[i].getSideFaceType() == leftfacetype)
				{
					leftfaceid = i;
				}
				if (_this.cubeSides[i].getSideFaceType() == rightfacetype)
				{
					rightfaceid = i;
				}
				
				if (_this.cubeSides[i].getSideFaceType() == bottomfacetype)
				{
					bottomfaceid = i;
				}
				if (frontfaceid == null)
				{
					if (_this.cubeSides[i].getSideFaceType() == frontfacetype)
					{
						frontfaceid = i;
					}	
				}
			}
		
			if (_this.touchedCubeSideIsBox)
			{
				this.activeCubeFaces = [topfaceid, frontfaceid, leftfaceid, backfaceid, rightfaceid, bottomfaceid];
			} 
			for(let i=0;i< _this.cubeSides[this.touchedCubeSide].getStagesArray().length;i++)
			{
				var entry = [_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getStageUID(), _this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getStageType()];
				this.activeCubeStages.push(entry);
				if (!this.touchedCubeSideIsBox)
				{
					switch (_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getStageType()) {
					case StageTypeEnum.TOPSTAGE:
						this.activeCubeFaces.push(topfaceid);
						break;
					case StageTypeEnum.FRONTSTAGE:
						this.activeCubeFaces.push(frontfaceid);
						break;
					case StageTypeEnum.BACKSTAGE:
						this.activeCubeFaces.push(backfaceid);
						break;
					case StageTypeEnum.BOTTOMSTAGE:
						this.activeCubeFaces.push(bottomfaceid);
						break;
					case StageTypeEnum.LEFTSTAGE:
						this.activeCubeFaces.push(leftfaceid);
						break;
					case StageTypeEnum.RIGHTSTAGE:
						this.activeCubeFaces.push(rightfaceid);
						break;
					}
				}
			}
			console.log("_this.activeCubeStages.length " + _this.activeCubeStages.length); 
			for(let i=0;i< _this.activeCubeStages.length;i++)
			{
				console.log("init opening rotation " + i ); 
				var faceid;
				switch (_this.activeCubeStages[i][1]) {
				case StageTypeEnum.TOPSTAGE:
					faceid = topfaceid;
					break;
				case StageTypeEnum.FRONTSTAGE:
					faceid = frontfaceid;
					break;
				case StageTypeEnum.BACKSTAGE:
					faceid = backfaceid;
					break;
				case StageTypeEnum.BOTTOMSTAGE:
					faceid = bottomfaceid;
					break;
				case StageTypeEnum.LEFTSTAGE:
					faceid = leftfaceid;
					break;
				case StageTypeEnum.RIGHTSTAGE:
					faceid = rightfaceid;
					break;
				case StageTypeEnum.BOXSTAGE:
					faceid = topfaceid;
					break;					
				}
				this.cubeSides[this.touchedCubeSide].setSideStageRotation(calculateContentRotation(faceid), (_this.activeCubeStages[i])[0]);
				
				
/* 				if (_this.activeCubeStages[i] == StageTypeEnum.BOXSTAGE)
				{
					_this.cubeSides[this.touchedCubeSide].setSideStageRotation(calculateContentRotation(topfaceid), _this.activeCubeStages[i]);
				}
				else
				{
					_this.cubeSides[this.touchedCubeSide].setSideStageRotation(calculateContentRotation(this.activeCubeFaces[i]), _this.activeCubeStages[i]);
				} */
				_this.cubeSides[this.touchedCubeSide].initialiseStages();
				if (_this.touchedCubeSideIsBox)
				{
					_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[i][0]);		
				}
				else
				{
					if (i == 0)
					{
						_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[0][0]);		
					}
				}
			}
			for(let i=0;i< _this.activeCubeFaces.length;i++)
			{
				if (_this.touchedCubeSideIsBox)
				{
					_this.cubeSides[this.activeCubeFaces[i]].setBoxLidVisibility(false);
					_this.cubeSides[this.activeCubeFaces[i]].setLidSegmentVisibility(true);
				}
				else
				{
					_this.cubeSides[this.activeCubeFaces[0]].setBoxLidVisibility(false);
					_this.cubeSides[this.activeCubeFaces[0]].setLidSegmentVisibility(true);
					break;
				}
			}
			_this.liftEntranceTypePresent = false;
			_this.transition = 0;
			_this.updateStageCounter = 0;
			 
			_this.boxClock.start();
			if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
			{
				_this.transitionCubeControl = false;
				_this.cubeControlActive = false;
				_this.cubeControlActiveCounter = 0;
				_this.arrayCubeEulerX.length = 0;
				_this.arrayCubeEulerZ.length = 0;
				_this.medianCubeEulerXZ.set(0, 0, 0, 'YXZ');
				_this.prevMedianCubeEulerXZ.set(0, 0, 0, 'YXZ');
				_this.lerpMedianCubeEulerXZ.set(0, 0, 0, 'YXZ');
				_this.medianCubeRotationQuat.setFromEuler(_this.medianCubeEulerXZ);	
			}
			_this.currentCubeState = CubeStateEnum.OPENING;
			break;
		case CubeStateEnum.OPENING:
			if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
			{
				calculateCubeOrientation(false);
			}
			_this.cubeSides[this.touchedCubeSide].update();
			if (_this.updateStageCounter < _this.activeCubeStages.length)
			{
				switch (_this.transition) {
				case 0:
					if ((_this.lerpValue < 1) )
					{
						_this.lerpedValues.length = 0;
						var C = [0];
						var D = [90];
						_this.lerpedValues = lerp(C, D, _this.lerpValue);
						if (_this.touchedCubeSideIsBox)
						{
							for(let i=0;i< _this.activeCubeFaces.length;i++)
							{
								_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(_this.lerpedValues[0]);
								
							}
						}
						else
						{
							_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].openCloseLid(_this.lerpedValues[0]);
						}
						_this.lerpValue = _this.boxClock.getElapsedTime() / _this.openLidSpeed;
					}
					else
					{
						if (_this.touchedCubeSideIsBox)
						{
							for(let i=0;i< _this.activeCubeFaces.length;i++)
							{
								_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(90);
							}
							
							for(let i=0;i< _this.activeCubeStages.length;i++)
							{
								if (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0]) == EntranceTypeEnum.LIFT)
								{
									_this.liftEntranceTypePresent = true;
									break;
								}
							}
							if (!_this.liftEntranceTypePresent)
							{
								_this.lerpValue = 0;
								_this.boxClock.stop();
								//_this.currentCubeState = CubeStateEnum.ACTIVE;
								if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
								{
									_this.cubeSides[this.touchedCubeSide].addPhysicsObjects();
								}
								_this.currentCubeState = CubeStateEnum.TRANSITION2ACTIVE;
							}
							else
							{
								_this.lerpValue = 0;
								_this.boxClock.start();
								_this.transition = 1;
							}
						}
						else
						{
							_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].openCloseLid(90);
							_this.lerpValue = 0;
							_this.boxClock.start();
							
							switch (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[_this.updateStageCounter][0])) {
							case EntranceTypeEnum.LIFT:
								this.distanceRatio = (1 / (Math.abs((_this.cubeWidth / 2) - _this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[_this.updateStageCounter][0])))) * 100;
								_this.transition = 2;
								break;
							case EntranceTypeEnum.HALFLIFT:
								this.distanceRatio = (1 / (Math.abs((_this.cubeSides[this.touchedCubeSide].getStageEndWidthPosY(_this.activeCubeStages[_this.updateStageCounter][0])) - _this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[_this.updateStageCounter][0])))) * 100;
								_this.transition = 3;
								break;
							case EntranceTypeEnum.FULLFLIP:
								_this.transition = 4;
								break;
							case EntranceTypeEnum.HALFFLIP:
								_this.transition = 5;
								break;
							default:
								_this.transition = 2;
								break;
							}							
						}
					}
					break;
				//BOX SIDELIFT	
				case 1:	
					if ((_this.lerpValue < 1) )
					{
						for(let i=0;i< _this.activeCubeStages.length;i++)
						{
							if (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0]) == EntranceTypeEnum.LIFT)
							{
								_this.lerpedValues.length = 0;
								var C = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[i][0])];
								var D = [(_this.cubeWidth / 2)];
								_this.lerpedValues = lerp(C, D, _this.lerpValue);
								_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[i][0]);
							}
						}
						_this.lerpValue = _this.boxClock.getElapsedTime() / _this.boxLiftSpeed;
					}
					else
					{
						for(let i=0;i< _this.activeCubeStages.length;i++)
						{
							if (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0]) == EntranceTypeEnum.LIFT)
							{
								_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeWidth / 2), _this.activeCubeStages[i][0]);
							}
						}
						_this.lerpValue = 0;
						_this.boxClock.stop();
						//_this.currentCubeState = CubeStateEnum.ACTIVE;
						if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
						{
							_this.cubeSides[this.touchedCubeSide].addPhysicsObjects();
						}
						_this.currentCubeState = CubeStateEnum.TRANSITION2ACTIVE;
					}
					break;
				//LIFT	
				case 2:
					if ((_this.lerpValue < 1) )
					{
						_this.lerpedValues.length = 0;
						var C = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[_this.updateStageCounter][0])];
						var D = [(_this.cubeWidth / 2)];
						_this.lerpedValues = lerp(C, D, _this.lerpValue);
						_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.lerpValue = this.distanceRatio * (_this.boxClock.getElapsedTime() / _this.elevationStageSpeed);
					}
					else
					{
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
		 				_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeWidth / 2), _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
						_this.updateStageCounter++;
						if (_this.updateStageCounter < _this.activeCubeStages.length)
						{
							_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[_this.updateStageCounter][0]);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setBoxLidVisibility(false);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setLidSegmentVisibility(true);
						}
						_this.transition = 0;
						_this.lerpValue = 0;
						_this.boxClock.start();
					}
					break;
				//HALFLIFT	
				case 3:
					if ((_this.lerpValue < 1) )
					{
						_this.lerpedValues.length = 0;
						var C = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[_this.updateStageCounter][0])];
						//var D = [(_this.cubeWidth)];
						var D = [(_this.cubeSides[this.touchedCubeSide].getStageEndWidthPosY(_this.activeCubeStages[_this.updateStageCounter][0]))];
						_this.lerpedValues = lerp(C, D, _this.lerpValue);
						_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.lerpValue = this.distanceRatio * (_this.boxClock.getElapsedTime() / _this.elevationStageSpeed);
					}
					else
					{
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
		 				//_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeWidth), _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeSides[this.touchedCubeSide].getStageEndWidthPosY(_this.activeCubeStages[_this.updateStageCounter][0])), _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
						_this.updateStageCounter++;
						if (_this.updateStageCounter < _this.activeCubeStages.length)
						{
							_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[_this.updateStageCounter][0]);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setBoxLidVisibility(false);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setLidSegmentVisibility(true);
						}
						_this.transition = 0;
						_this.lerpValue = 0;
						_this.boxClock.start();
					}
					break;	
				//FULLFLIP
				case 4: 
					if ((_this.lerpValue < 1) )
					{
						_this.lerpedValues.length = 0;
						var C = [_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), 180];
						var D = [(_this.cubeWidth / 2), 0];
						_this.lerpedValues = lerp(C, D, _this.lerpValue);
						_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, _this.lerpedValues[1], _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.lerpValue = _this.boxClock.getElapsedTime() / _this.flipStageSpeed;
					}
					else
					{
						_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeWidth / 2), _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, 0, _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
						_this.updateStageCounter++;
						if (_this.updateStageCounter < _this.activeCubeStages.length)
						{
							_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[_this.updateStageCounter][0]);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setBoxLidVisibility(false);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setLidSegmentVisibility(true);
						}
						_this.transition = 0;
						_this.lerpValue = 0;
						_this.boxClock.start();
					}
					break;
				//HALFFLIP
				case 5: 
					if ((_this.lerpValue < 1) )
					{
						_this.lerpedValues.length = 0;
						var C = [_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), 0];
						var D = [(_this.cubeWidth / 2), 90];
						_this.lerpedValues = lerp(C, D, _this.lerpValue);
						_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(_this.lerpedValues[1], 0, 0, _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.lerpValue = _this.boxClock.getElapsedTime() / _this.flipStageSpeed;
					}
					else
					{
						_this.cubeSides[this.touchedCubeSide].setStageElevation((_this.cubeWidth / 2), _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(90,0,  0, _this.activeCubeStages[_this.updateStageCounter][0]);
						_this.cubeSides[(_this.activeCubeFaces[_this.updateStageCounter])].setLidSegmentVisibility(false);
						_this.updateStageCounter++;
						if (_this.updateStageCounter < _this.activeCubeStages.length)
						{
							_this.cubeSides[this.touchedCubeSide].setStageVisiblity(true, _this.activeCubeStages[_this.updateStageCounter][0]);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setBoxLidVisibility(false);
							_this.cubeSides[this.activeCubeFaces[_this.updateStageCounter]].setLidSegmentVisibility(true);
						}
						_this.transition = 0;
						_this.lerpValue = 0;
						_this.boxClock.start();
					}
					break;					
				}
			}
			else
			{
				_this.updateStageCounter = 0;
				_this.lerpValue = 0;
				_this.boxClock.stop();
				//start content like videos etc
				
				if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
				{
					_this.cubeSides[this.touchedCubeSide].addPhysicsObjects();
				}
				 
				_this.currentCubeState = CubeStateEnum.TRANSITION2ACTIVE;
			}
			break;
		case CubeStateEnum.TRANSITION2ACTIVE:
			_this.cubeSides[this.touchedCubeSide].update();
			if (!_this.cubeSides[this.touchedCubeSide].isOpeningStatePending())
			{
				if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()))
				{
					_this.cubeSides[this.touchedCubeSide].activeMediaPlayback();
				}
				if (_this.cubeSides[this.touchedCubeSide].isMeshLabelPresent())
				{
					_this.cubeSides[this.touchedCubeSide].activeMeshLabelScroll();
				}
				if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					_this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(true);
				}
				_this.currentCubeState = CubeStateEnum.ACTIVE;
			}
			break;
		case CubeStateEnum.ACTIVE:
			if (_this.displayHelp)
			{
				if (_this.displayHelpTimer.getElapsedTime() > _this.displayHelpTimeout)
				{
					_this.displayHelpTimer.stop();
					_this.displayHelp = false;
					if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
					{
						_this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(true);
					}
				}
			}
			else
			{
				if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					calculateCubeOrientation(false);
				}
				_this.cubeSides[this.touchedCubeSide].update();
			}
			break;
		case CubeStateEnum.TRANSITION2TIMEOUT:
			_this.cubeSides[this.touchedCubeSide].update();
			if (!_this.cubeSides[this.touchedCubeSide].isTimeoutStatePending())
			{
				if (_this.isVisible)
				{
					_this.cubeSides[this.touchedCubeSide].initialiseStages(false); 
					_this.cubeControlActive = false;
					_this.cubeControlActiveCounter = 0
					_this.arrayCubeEulerX.length = 0;
					_this.arrayCubeEulerZ.length = 0;
					_this.currentCubeState = CubeStateEnum.ACTIVE;
				}
				else
				{
					if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
					{
						_this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(false);
					}
					_this.currentCubeState = CubeStateEnum.TIMEDOUT;
				}
			}
			break;
		case CubeStateEnum.TIMEDOUT:
			if (this.displayIntrotext)
			{
				this.displayIntroTimer.stop();
				this.displayIntrotext = false;
			}
			if (this.displayHelp)
			{
				this.displayHelp = false;
				this.displayHelpTimer.stop();
			}
			for(let i=0;i< _this.activeCubeStages.length;i++)
			{
				switch (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0])) {
				case EntranceTypeEnum.LIFT:
				case EntranceTypeEnum.HALFLIFT:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[i][0]), _this.activeCubeStages[i][0])
					break;
				case EntranceTypeEnum.FULLFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, 180, _this.activeCubeStages[i][0]);
					break;
				case EntranceTypeEnum.HALFFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(0, 0, 0, _this.activeCubeStages[i][0]);
					break;
				}
				_this.cubeSides[this.touchedCubeSide].setStageVisiblity(false, _this.activeCubeStages[i][0]);
			}
			if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()))
			{
				_this.cubeSides[this.touchedCubeSide].pauseMediaPlayback();
			}
			if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
			{
				//_this.cubeSides[this.touchedCubeSide].initialisePhysics();
				_this.cubeSides[this.touchedCubeSide].removePhysicsObjects();
			}
			if (_this.cubeSides[this.touchedCubeSide].isMeshLabelPresent())
			{
				_this.cubeSides[this.touchedCubeSide].pauseMeshLabelScroll();
			}
			
			for(let i=0;i< _this.activeCubeFaces.length;i++)
			{
				_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(0)
				_this.cubeSides[_this.activeCubeFaces[i]].setBoxLidVisibility(true);
				_this.cubeSides[_this.activeCubeFaces[i]].setLidSegmentVisibility(false);
			}
			_this.activeCubeFaces.length = 0;
			_this.touchedCubeSideContentType = null;
			_this.touchedCubeSide = null;
			_this.boxClock.stop();
			_this.currentCubeState = CubeStateEnum.NOTACTIVE;			
			break;
		case CubeStateEnum.CLOSING:	
			if (this.displayIntrotext)
			{
				this.displayIntroTimer.stop();
				this.displayIntrotext = false;
			}
			if (_this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
			{
				_this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(false);
			}
			_this.cubeSides[this.touchedCubeSide].update();
			console.log("isClosingStatePending() " + _this.cubeSides[this.touchedCubeSide].isClosingStatePending());
			if (!_this.cubeSides[this.touchedCubeSide].isClosingStatePending())
			{
				if (_this.updateStageCounter < _this.activeCubeStages.length)
				{
					var index = _this.activeCubeStages.length - _this.updateStageCounter - 1;
					switch (_this.transition) {
					case 0:
						if (_this.touchedCubeSideIsBox)
						{
							
							if (!_this.liftEntranceTypePresent)
							{
								_this.transition = 6;
							}
							else
							{
								_this.lerpValue = 0;
								_this.boxClock.start();
								_this.transition = 1;
							}
						}
						else
						{
							_this.cubeSides[_this.activeCubeFaces[index]].setBoxLidVisibility(false);
							_this.cubeSides[(_this.activeCubeFaces[index])].setLidSegmentVisibility(true);
							switch (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[index][0])) {
							case EntranceTypeEnum.LIFT:
								this.distanceRatio = (1 / (Math.abs((_this.cubeWidth / 2) - _this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0])))) * 100;
								_this.transition = 2;
								break;
							case EntranceTypeEnum.HALFLIFT:
								this.distanceRatio = (1 / (Math.abs((_this.cubeSides[this.touchedCubeSide].getStageEndWidthPosY(_this.activeCubeStages[index][0])) - _this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0])))) * 100;
								_this.transition = 3;
								break;
							case EntranceTypeEnum.FULLFLIP:
								_this.transition = 4;
								break;
							case EntranceTypeEnum.HALFFLIP:
								_this.transition = 5;
								break;
							default:
								_this.transition = 2;
								break;
							}							
						}
						break;
					//box lift
					case 1:	
						if ((_this.lerpValue < 1) )
						{
							for(let i=0;i< _this.activeCubeStages.length;i++)
							{
								if (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0]) == EntranceTypeEnum.LIFT)
								{
									_this.lerpedValues.length = 0;
									var C = [(_this.cubeWidth / 2)];
									var D = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0])];
									_this.lerpedValues = lerp(C, D, _this.lerpValue);
									_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[i][0]);
								}
							}
							_this.lerpValue = _this.boxClock.getElapsedTime() / _this.boxLiftSpeed;
						}
						else
						{
							for(let i=0;i< _this.activeCubeStages.length;i++)
							{
								if (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0]) == EntranceTypeEnum.LIFT)
								{
									_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0]), _this.activeCubeStages[i][0])
									
								}
							}
							_this.lerpValue = 0;
							_this.boxClock.start();
							_this.transition = 6;
						}
						break;
					//lift	
					case 2:
						if ((_this.lerpValue < 1) )
						{
							_this.lerpedValues.length = 0;
							var C = [(_this.cubeWidth / 2)];
							var D = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0])];
							_this.lerpedValues = lerp(C, D, _this.lerpValue);
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[index][0])
							_this.lerpValue = this.distanceRatio * (_this.boxClock.getElapsedTime() / _this.elevationStageSpeed);
						}
						else
						{
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0]), _this.activeCubeStages[index][0])
							_this.lerpValue = 0;
							_this.boxClock.start();
							_this.transition = 6;
						}
						break;
					//halflift	
					case 3:
						if ((_this.lerpValue < 1) )
						{
							_this.lerpedValues.length = 0;
							
							var C = [(_this.cubeSides[this.touchedCubeSide].getStageEndWidthPosY(_this.activeCubeStages[index][0]))];
							var D = [_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0])];
							_this.lerpedValues = lerp(C, D, _this.lerpValue);
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[index][0])
							_this.lerpValue = this.distanceRatio * (_this.boxClock.getElapsedTime() / _this.elevationStageSpeed);
						}
						else
						{
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[index][0]), _this.activeCubeStages[index][0])
							_this.lerpValue = 0;
							_this.boxClock.start();
							_this.transition = 6;
						}
						break;						
					//fullflip
					case 4:
						if ((_this.lerpValue < 1) )
						{
							_this.lerpedValues.length = 0;
							
							var C = [(_this.cubeWidth / 2), 0];
							var D = [_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), 180];
							_this.lerpedValues = lerp(C, D, _this.lerpValue);
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[index][0]);
							_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, _this.lerpedValues[1], _this.activeCubeStages[index][0]);
							_this.lerpValue = _this.boxClock.getElapsedTime() / _this.flipStageSpeed;
						}
						else
						{
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[index][0]);
							_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, 180, _this.activeCubeStages[index][0]);

							_this.transition = 6;
							_this.lerpValue = 0;
							_this.boxClock.start();
						}
						break;
					//halfflip	
					case 5:
						if ((_this.lerpValue < 1) )
						{
							_this.lerpedValues.length = 0;
							
							var C = [(_this.cubeWidth / 2), 90];
							var D = [_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), 0];
							_this.lerpedValues = lerp(C, D, _this.lerpValue);
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.lerpedValues[0], _this.activeCubeStages[index][0]);
							_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(_this.lerpedValues[1], 0, 0, _this.activeCubeStages[index][0]);
							_this.lerpValue = _this.boxClock.getElapsedTime() / _this.flipStageSpeed;
						}
						else
						{
							_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[index][0]);
							_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(0, 0, 0, _this.activeCubeStages[index][0]);

							_this.transition = 6;
							_this.lerpValue = 0;
							_this.boxClock.start();
						}
						break;
					case 6:
						if ((_this.lerpValue < 1) )
						{
							_this.lerpedValues.length = 0;
							var C = [90];
							var D = [0];
							_this.lerpedValues = lerp(C, D, _this.lerpValue);
							if (_this.touchedCubeSideIsBox)
							{
								for(let i=0;i< _this.activeCubeFaces.length;i++)
								{
									_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(_this.lerpedValues[0])
								}
							}
							else
							{
								_this.cubeSides[(_this.activeCubeFaces[index])].openCloseLid(_this.lerpedValues[0]);
								
							}
							_this.lerpValue = _this.boxClock.getElapsedTime() / _this.openLidSpeed;
						}
						else
						{
							if (_this.touchedCubeSideIsBox)
							{
								for(let i=0;i< _this.activeCubeFaces.length;i++)
								{
									_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(0)
									_this.cubeSides[_this.activeCubeFaces[i]].setBoxLidVisibility(true);
									_this.cubeSides[_this.activeCubeFaces[i]].setLidSegmentVisibility(false);
								}
								_this.activeCubeFaces.length = 0;
								_this.lerpValue = 0;
								for(let i=0;i< _this.activeCubeStages.length;i++)
								{
									_this.cubeSides[this.touchedCubeSide].setStageVisiblity(false, _this.activeCubeStages[i][0]);		
								}
								if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()) || (_this.cubeSides[this.touchedCubeSide].isListeningPresent()))
								{
									_this.cubeSides[this.touchedCubeSide].pauseMediaPlayback();
								}
								if (_this.cubeSides[this.touchedCubeSide].isMeshLabelPresent())
								{
									_this.cubeSides[this.touchedCubeSide].pauseMeshLabelScroll();
								}
								_this.touchedCubeSideContentType = null;
								_this.boxClock.stop();
								_this.touchedCubeSide = null;
								_this.currentCubeState = CubeStateEnum.NOTACTIVE; 
							}
							else
							{
								_this.cubeSides[(_this.activeCubeFaces[index])].openCloseLid(0);
								_this.cubeSides[_this.activeCubeFaces[index]].setLidSegmentVisibility(false);
								_this.cubeSides[(_this.activeCubeFaces[index])].setBoxLidVisibility(true);
								_this.lerpValue = 0;
								_this.transition = 0;
								_this.cubeSides[this.touchedCubeSide].setStageVisiblity(false, _this.activeCubeStages[index][0]);
								_this.updateStageCounter++;
								if (_this.updateStageCounter < _this.activeCubeStages.length)
								{
									var tempindex = _this.activeCubeStages.length - _this.updateStageCounter - 1;								
									_this.cubeSides[_this.activeCubeFaces[tempindex]].setBoxLidVisibility(false);
									_this.cubeSides[(_this.activeCubeFaces[tempindex])].setLidSegmentVisibility(true);
								}
								_this.boxClock.start();
							}
						}
						break;
					}
				}
				else
				{
					if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()) || (_this.cubeSides[this.touchedCubeSide].isListeningPresent()))
					{
						_this.cubeSides[this.touchedCubeSide].pauseMediaPlayback();
					}
					if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
					{
						_this.cubeSides[this.touchedCubeSide].removePhysicsObjects();
					}
					if (_this.cubeSides[this.touchedCubeSide].isMeshLabelPresent())
					{
						_this.cubeSides[this.touchedCubeSide].pauseMeshLabelScroll();
					}
					_this.updateStageCounter = 0;
					_this.lerpValue = 0;
					_this.activeCubeFaces.length = 0;
					_this.touchedCubeSideContentType = null;
					_this.touchedCubeSide = null;
					_this.boxClock.stop();
					_this.currentCubeState = CubeStateEnum.NOTACTIVE; 
				}
			}
			else
			{
				this.boxClock.start();
			}
			break;
		}


		_this.previousCubeState	= _this.currentCubeState;


		
		function calculateContentRotation(selectedside)
		{
			//var rotation = _this.cubeSides[_this.topFace].getFaceRotation();
			var rotation = _this.cubeSides[selectedside].getFaceRotation();
			if (_this.topFace == selectedside)
			{
				switch (_this.cubeSides[_this.topFace].getSideFaceType()) {
				case SideFaceTypeEnum.TOPFACE:
					//front face is front
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.BACKFACE:
						console.log("calculateContentRotation 1");
						rotation.add( new THREE.Vector3(0,Math.PI,0));
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 2");
						rotation.add( new THREE.Vector3(0,-(Math.PI / 2),0));
						break;
					case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 3");
						rotation.add( new THREE.Vector3(0,Math.PI / 2,0));
						break;
					}
					break;
				case SideFaceTypeEnum.BOTTOMFACE:
					//then back face is front
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.FRONTFACE:
						console.log("calculateContentRotation 4");
						rotation.add( new THREE.Vector3(0,Math.PI,0));
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 5");
						rotation.add( new THREE.Vector3(0,-(Math.PI / 2),0));
						break;
					case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 6");
						rotation.add( new THREE.Vector3(0,(Math.PI / 2),0));
						break;					
					}
					break;
				case SideFaceTypeEnum.FRONTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 7");
						rotation.add( new THREE.Vector3(0,Math.PI,0));
						break;
					case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 8");
						rotation.add( new THREE.Vector3(0,-(Math.PI / 2),0));
						break;	
					case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 9");
						rotation.add( new THREE.Vector3(0,(Math.PI / 2),0));
						
						break;	
					}
					break;
				case SideFaceTypeEnum.BACKFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 10");
						rotation.add( new THREE.Vector3(0,-(Math.PI / 2),0));
						break;	
					case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 11");
						rotation.add( new THREE.Vector3(0,(Math.PI / 2),0));
						break;
					case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 12");
						rotation.add( new THREE.Vector3(0,(Math.PI),0));
						break;					
					}
					break;

				case SideFaceTypeEnum.LEFTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.BACKFACE:
						console.log("calculateContentRotation 13");
						rotation.add( new THREE.Vector3((Math.PI /2), 0,0));
						break;	
					case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 14");
						rotation.add( new THREE.Vector3((Math.PI), 0,0));
						break;	
					case SideFaceTypeEnum.FRONTFACE:
						console.log("calculateContentRotation 15");
						rotation.add( new THREE.Vector3(-(Math.PI / 2), 0,0));
						break;	
					}
					break;
			
				case SideFaceTypeEnum.RIGHTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.BACKFACE:
						console.log("calculateContentRotation 16");
						rotation.add( new THREE.Vector3((Math.PI /2), 0,0));
						break;	
					case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 17");
						rotation.add( new THREE.Vector3((Math.PI), 0,0));
						break;	
					case SideFaceTypeEnum.FRONTFACE:
						console.log("calculateContentRotation 18");
						rotation.add( new THREE.Vector3(-(Math.PI / 2), 0,0));
						break;	
					}
					break;
				}
			}
			else
			{
				switch (_this.cubeSides[_this.topFace].getSideFaceType()) {
				case SideFaceTypeEnum.LEFTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.BACKFACE:
					case SideFaceTypeEnum.TOPFACE:
					case SideFaceTypeEnum.BOTTOMFACE:
					case SideFaceTypeEnum.FRONTFACE:
						switch (_this.cubeSides[selectedside].getSideFaceType()) {
						case SideFaceTypeEnum.TOPFACE:
							console.log("calculateContentRotation 19");
							rotation.add( new THREE.Vector3(0, -(Math.PI /2),0));
							break;
						case SideFaceTypeEnum.BOTTOMFACE:
						console.log("calculateContentRotation 20");
							rotation.add( new THREE.Vector3(0, -(Math.PI /2),0));
							break;
						case SideFaceTypeEnum.FRONTFACE:
						console.log("calculateContentRotation 21");
							rotation.add( new THREE.Vector3(0, -(Math.PI /2),0));
							break;
						case SideFaceTypeEnum.BACKFACE:
						console.log("calculateContentRotation 22");
							rotation.add( new THREE.Vector3(0, (Math.PI /2),0));
							break;
						}
						break;
					}
					break;
				case SideFaceTypeEnum.RIGHTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.BACKFACE:
					case SideFaceTypeEnum.TOPFACE:
					case SideFaceTypeEnum.BOTTOMFACE:
					case SideFaceTypeEnum.FRONTFACE:
						switch (_this.cubeSides[selectedside].getSideFaceType()) {
						case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 23");
							rotation.add( new THREE.Vector3(0, (Math.PI /2),0));
							break;
						case SideFaceTypeEnum.BOTTOMFACE:
						console.log("calculateContentRotation 24");
							rotation.add( new THREE.Vector3(0, (Math.PI /2),0));
							break;
						case SideFaceTypeEnum.FRONTFACE:
						console.log("calculateContentRotation 25");
							rotation.add( new THREE.Vector3(0, (Math.PI /2),0));
							break;
						case SideFaceTypeEnum.BACKFACE:
						console.log("calculateContentRotation 26");
							rotation.add( new THREE.Vector3(0, -(Math.PI /2),0));
							break;
						}
						break;
					}

					break;						
				 case SideFaceTypeEnum.BOTTOMFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.FRONTFACE:
					case SideFaceTypeEnum.LEFTFACE:
					case SideFaceTypeEnum.RIGHTFACE:
					case SideFaceTypeEnum.BACKFACE:
						switch (_this.cubeSides[selectedside].getSideFaceType()) {
						case SideFaceTypeEnum.FRONTFACE:
							console.log("calculateContentRotation 27");
							rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						case SideFaceTypeEnum.LEFTFACE:
							console.log("calculateContentRotation 28");
							rotation.add( new THREE.Vector3((Math.PI), 0 ,0));
							//rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						case SideFaceTypeEnum.RIGHTFACE:
							console.log("calculateContentRotation 29");
							rotation.add( new THREE.Vector3(-(Math.PI), 0 ,0));
							//rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						case SideFaceTypeEnum.BACKFACE:
							console.log("calculateContentRotation 30");
							rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						}
						break;
					}

					break; 
					
				case SideFaceTypeEnum.BACKFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
					case SideFaceTypeEnum.LEFTFACE:
					case SideFaceTypeEnum.RIGHTFACE:
					case SideFaceTypeEnum.BOTTOMFACE:
						switch (_this.cubeSides[selectedside].getSideFaceType()) {
						case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 31");
							rotation.add( new THREE.Vector3(0, 0,0));
							break;
						case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 32");
							rotation.add( new THREE.Vector3(-(Math.PI / 2),0 , 0));
							break;
						case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 33");
							rotation.add( new THREE.Vector3(-(Math.PI / 2), 0 ,0));
							break;
						case SideFaceTypeEnum.BOTTOMFACE:
						console.log("calculateContentRotation 34");
							rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						}
						break;
					}

					break; 
					
				case SideFaceTypeEnum.FRONTFACE:
					switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
					case SideFaceTypeEnum.TOPFACE:
					case SideFaceTypeEnum.LEFTFACE:
					case SideFaceTypeEnum.RIGHTFACE:
					case SideFaceTypeEnum.BOTTOMFACE:
						switch (_this.cubeSides[selectedside].getSideFaceType()) {
						case SideFaceTypeEnum.TOPFACE:
						console.log("calculateContentRotation 35");
							rotation.add( new THREE.Vector3(0, (Math.PI),0));
							break;
						case SideFaceTypeEnum.LEFTFACE:
						console.log("calculateContentRotation 36");
							rotation.add( new THREE.Vector3((Math.PI / 2),0 , 0));
							break;
						case SideFaceTypeEnum.RIGHTFACE:
						console.log("calculateContentRotation 37");
							rotation.add( new THREE.Vector3((Math.PI / 2), 0 ,0));
							break;
						case SideFaceTypeEnum.BOTTOMFACE:
						console.log("calculateContentRotation 38");
							rotation.add( new THREE.Vector3(0, 0,0));
							break;
						}
						break;
					}

					break; 
				}

			}
			return rotation;
		}
		
		
		function checkCubeVisible()
		{
			var candidateFace = null;
			var candidateConfidence = null;
			for(let i=0;i<_this.cubeSides.length;i++)
			{
				if (_this.cubeSides[i].getIsVisible())
				{
					if (candidateFace == null)
					{
						candidateFace = i;
						candidateConfidence = _this.cubeSides[i].getMarkerConfidence();
					}
					else if (_this.cubeSides[i].getMarkerConfidence() > candidateConfidence) 
					{
						candidateFace = i;
						candidateConfidence = _this.cubeSides[i].getMarkerConfidence();
					}
				}
			}
			if (candidateFace != null)
			{
				_this.isVisible = true;
				_this.trackedFace = candidateFace;
				_this.cubeSides[candidateFace].updateSceneGroup(true);
			
			}
			else
			{
				_this.trackedFace = null;
				_this.isVisible = false;
			}

			if (_this.currentCubeState != CubeStateEnum.NOTACTIVE)
			{
				if (_this.previousVisibleState != _this.isVisible)
				{
					console.log("visiblity here");
					if (!_this.isVisible)
					{
						_this.cubeControlActive = false;
						_this.cubeControlActiveCounter = 0
						_this.arrayCubeEulerX.length = 0;
						_this.arrayCubeEulerZ.length = 0;
						console.log("timeout started");
						_this.timeoutClick.start();
						if (_this.touchedCubeSide != null)
						{
							if ((_this.cubeSides[_this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[_this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[_this.touchedCubeSide].isVoicePresent()))
							{
								_this.cubeSides[_this.touchedCubeSide].mediaDeactivate();
							}
							if (_this.cubeSides[_this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
							{
								_this.cubeSides[_this.touchedCubeSide].setCubeControlEnabled(false);
							}
						}
					}
					else
					{
						if ((_this.isVisible) && (_this.timeoutClick.running))
						{
							console.log("timeout stoped");
							_this.timeoutClick.stop();
							if (_this.touchedCubeSide != null)
							{
								if ((_this.cubeSides[_this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[_this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[_this.touchedCubeSide].isVoicePresent()))
								{
									_this.cubeSides[_this.touchedCubeSide].mediaReactivate();
								}
								if (_this.cubeSides[_this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
								{
									_this.cubeSides[_this.touchedCubeSide].setCubeControlEnabled(true);
								}
							}
						}
					}
				}
				else
				{
					if ((_this.timeoutClick.running) && (!_this.isVisible))
					{
						if (_this.timeoutClick.getElapsedTime() > _this.inactiveTimeout)
						{
							console.log("timeout fired");
							_this.timeoutClick.stop();
							_this.currentCubeState = CubeStateEnum.TRANSITION2TIMEOUT;
						}
					}
				}
			}
			
			_this.previousVisibleState = _this.isVisible;
			
		}	
		
		function calculateCubeOrientation(blnCalcSides = true)
		{
			if (_this.isVisible)
			{
				
				//calculate 
				_this.cubefacesGroup.getWorldPosition(_this.cubeWorldPositionVector);
				g_camera.getWorldPosition(_this.cameraWorldPositionVector);
			
				var axisxangle = new THREE.Vector3(_this.cubeWorldPositionVector.x + 10,_this.cubeWorldPositionVector.y ,_this.cubeWorldPositionVector.z);
			
				_this.cubefacesGroup.worldToLocal(axisxangle);
				axisxangle.normalize();
				var xaxisquat = new THREE.Quaternion().setFromAxisAngle(axisxangle, _this.sensorEulerXAngle);
			
				var axiszangle = new THREE.Vector3(_this.cubeWorldPositionVector.x,_this.cubeWorldPositionVector.y ,_this.cubeWorldPositionVector.z - 10);
			
				_this.cubefacesGroup.worldToLocal(axiszangle);
				axiszangle.normalize();
				var zaxisquat = new THREE.Quaternion().setFromAxisAngle(axiszangle, _this.sensorEulerYAngle);
			
			
			
				var cubequat = new THREE.Quaternion().multiplyQuaternions(zaxisquat, xaxisquat);
				cubequat.normalize();
				_this.rotationHelper.setRotationFromQuaternion(cubequat);
			
				_this.rotationHelper.getWorldQuaternion(_this.adjustedCubeWorldQuaternion);
				_this.cubefacesGroup.getWorldQuaternion( _this.cubeWorldQuaternion );
				
				if (blnCalcSides)
				{
					let storedtopangle = 0;
					let upside = 0;
					let topangle = 0;
				
					let storedforwardangle = 0;
					let forwardside = 0;
					let forwardangle = 0;
				
					let frontside = null;
					let topside = null;
					for(let i=0;i< _this.cubeSides.length;i++)
					{
						_this.cubeSides[i].setAdjustedWorldUpVector(new THREE.Vector3().copy(_this.cubeSides[i].getSidefaceVectorUp()).applyQuaternion( _this.adjustedCubeWorldQuaternion ));
						if (_this.cubeSides[i].getSideFaceType() == SideFaceTypeEnum.FRONTFACE)
						{
							frontside = i;
						}
						if (_this.cubeSides[i].getSideFaceType() == SideFaceTypeEnum.TOPFACE)
						{
							topside = i;
						}
						//check to see which is closest to upright
						let upVector = new THREE.Vector3(0,1,0);
						topangle = Math.abs(_this.cubeSides[i].getAdjustedWorldUpVector().angleTo(upVector));
					
						//check to see which is closet to forward
					
						let forwardVector = new THREE.Vector3(0,0,1);
						forwardangle = Math.abs(_this.cubeSides[i].getAdjustedWorldUpVector().angleTo(forwardVector));
					
						if (i == 0)
						{
							storedtopangle = topangle;
							upside = i;
						}
						else if ((i != 0) && (topangle < storedtopangle))
						{
							storedtopangle = topangle;
							upside = i;
						}

						if (i == 0)
						{
							storedforwardangle = forwardangle;
							forwardside = i;
						}
						else if ((i != 0) && (forwardangle < storedforwardangle))
						{
							storedforwardangle = forwardangle;
							forwardside = i;
						}								
					}
					_this.topFace = upside;
					_this.forwardFace = forwardside;
				
				
					//calculate for physics by rotating cube so removing y rotation
					if ((_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.TOPFACE) || (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.BOTTOMFACE))
					{
						_this.physicsFrontFace = frontside;
					}
					else
					{
						_this.physicsFrontFace = topside;
					}

					let rotateangle = 0;
					if (_this.cubeWorldPositionVector.isVector3 && _this.cameraWorldPositionVector.isVector3)
					{
						let dircam = new THREE.Vector3();
						dircam.subVectors(new THREE.Vector3(_this.cameraWorldPositionVector.x, 0, _this.cameraWorldPositionVector.z), new THREE.Vector3(_this.cubeWorldPositionVector.x , 0, _this.cubeWorldPositionVector.z) ).normalize();
						let dircube = new THREE.Vector3(_this.cubeSides[_this.physicsFrontFace].getAdjustedWorldUpVector().x, 0, _this.cubeSides[_this.physicsFrontFace].getAdjustedWorldUpVector().z).normalize();
						if ((dircam.x != 0) && (dircam.z != 0) && (dircube.x != 0) && (dircube.z != 0))
						{
							rotateangle = dircube.angleTo(dircam);
							let cross = new THREE.Vector3().crossVectors(dircube, dircam);
							if (cross.y < 0) rotateangle = -rotateangle;
						}
					}
				
				
					let vectorup = new THREE.Vector3().copy(_this.cubeSides[_this.topFace].getAdjustedWorldUpVector()).applyAxisAngle(new THREE.Vector3(0 ,1 ,0 ), rotateangle);
				
					_this.adjustedCubeEuler.setFromVector3(vectorup, 'YXZ');
					_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.z), 0, -(_this.adjustedCubeEuler.x), 'YXZ');
					_this.adjustedCubeRotationQuat.setFromEuler(_this.adjustedCubeEulerXZ);				
				 
					_this.cubeEuler.setFromVector3(_this.cubeSides[_this.topFace].getWorldUpVector(), 'YXZ');

				}
			
				else
				{
					for(let i=0;i< _this.cubeSides.length;i++)
					{
						_this.cubeSides[i].setAdjustedWorldUpVector(new THREE.Vector3().copy(_this.cubeSides[i].getSidefaceVectorUp()).applyQuaternion( _this.adjustedCubeWorldQuaternion ));
								
					}
					let rotateangle = 0;
					if (_this.cubeWorldPositionVector.isVector3 && _this.cameraWorldPositionVector.isVector3)
					{
						let dircam = new THREE.Vector3();
						dircam.subVectors(new THREE.Vector3(_this.cameraWorldPositionVector.x, 0, _this.cameraWorldPositionVector.z), new THREE.Vector3(_this.cubeWorldPositionVector.x , 0, _this.cubeWorldPositionVector.z) ).normalize();
						let dircube = new THREE.Vector3(_this.cubeSides[_this.physicsFrontFace].getAdjustedWorldUpVector().x, 0, _this.cubeSides[_this.physicsFrontFace].getAdjustedWorldUpVector().z).normalize();
						if ((dircam.x != 0) && (dircam.z != 0) && (dircube.x != 0) && (dircube.z != 0))
						{
							rotateangle = dircube.angleTo(dircam);
							let cross = new THREE.Vector3().crossVectors(dircube, dircam);
							if (cross.y < 0) rotateangle = -rotateangle;
						}
					}
					
					var axisyangle = new THREE.Vector3(_this.cubeWorldPositionVector.x,_this.cubeWorldPositionVector.y + 1,_this.cubeWorldPositionVector.z);
				
					let vectorup = new THREE.Vector3().copy(_this.cubeSides[_this.topFace].getAdjustedWorldUpVector()).applyAxisAngle(new THREE.Vector3(0 ,1 ,0 ), rotateangle);
				
					_this.adjustedCubeEuler.setFromVector3(vectorup, 'YXZ');
					
					if (_this.arrayCubeEulerX.length == _this.MEDIANDATASET)
					{
						_this.arrayCubeEulerX.shift();
						_this.arrayCubeEulerX.push(_this.adjustedCubeEuler.x);
						_this.arrayCubeEulerZ.shift();
						_this.arrayCubeEulerZ.push(_this.adjustedCubeEuler.z);
					}
					else
					{
						_this.arrayCubeEulerX.push(_this.adjustedCubeEuler.x);
						_this.arrayCubeEulerZ.push(_this.adjustedCubeEuler.z);
					}
					
					if (!_this.cubeControlActive)
					{
						if (_this.cubeControlActiveCounter < _this.MEDIANDATASET)
						{
							_this.cubeControlActiveCounter++;
						}
						else
						{
							_this.cubeControlActiveCounter = 0;
							_this.cubeControlActive = true;
						}
					}
					let medianx = 0;
					let medianz = 0;
					if (_this.cubeControlActive)
					{
						medianx = median(_this.arrayCubeEulerX);
						medianz = median(_this.arrayCubeEulerZ);

						switch (_this.cubeSides[_this.topFace].getSideFaceType()) {
						case SideFaceTypeEnum.TOPFACE:
						case SideFaceTypeEnum.BOTTOMFACE:
							switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
							case SideFaceTypeEnum.FRONTFACE:
								_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.z), 0, -(_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set((medianz), 0, -(medianx), 'YXZ');
								break;
							case SideFaceTypeEnum.RIGHTFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.TOPFACE)
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								break;
							case SideFaceTypeEnum.LEFTFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.TOPFACE)
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								break;
							case SideFaceTypeEnum.BACKFACE:
								_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.z), 0, (_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set(-(medianz), 0, (medianx), 'YXZ');
								break;
							}
							break;
						case SideFaceTypeEnum.FRONTFACE:
						case SideFaceTypeEnum.BACKFACE:
							switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
							case SideFaceTypeEnum.TOPFACE:
								_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.z), 0, -(_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set((medianz), 0, -(medianx), 'YXZ');
								break;
							case SideFaceTypeEnum.RIGHTFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.FRONTFACE)
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								break;
							case SideFaceTypeEnum.LEFTFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.FRONTFACE)
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								break;
							case SideFaceTypeEnum.BOTTOMFACE:
								_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.z), 0, (_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set(-(medianz), 0, (medianx), 'YXZ');
								break;
							}
							break;
						case SideFaceTypeEnum.LEFTFACE:	
						case SideFaceTypeEnum.RIGHTFACE:
							switch (_this.cubeSides[_this.forwardFace].getSideFaceType()) {
							case SideFaceTypeEnum.FRONTFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.RIGHTFACE)
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								break;
							case SideFaceTypeEnum.TOPFACE:
								_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.z), 0, -(_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set((medianz), 0, -(medianx), 'YXZ');
								break;
							case SideFaceTypeEnum.BOTTOMFACE:
								_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.z), 0, (_this.adjustedCubeEuler.x), 'YXZ');
								_this.medianCubeEulerXZ.set(-(medianz), 0, (medianx), 'YXZ');
								break;
							case SideFaceTypeEnum.BACKFACE:
								if (_this.cubeSides[_this.topFace].getSideFaceType() == SideFaceTypeEnum.RIGHTFACE)
								{
									_this.adjustedCubeEulerXZ.set((_this.adjustedCubeEuler.x), 0, (_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set((medianx), 0, (medianz), 'YXZ');
								}
								else
								{
									_this.adjustedCubeEulerXZ.set(-(_this.adjustedCubeEuler.x), 0, -(_this.adjustedCubeEuler.z), 'YXZ');
									_this.medianCubeEulerXZ.set(-(medianx), 0, -(medianz), 'YXZ');
								}
								break;
							}
							break;
						}	
				
						_this.adjustedCubeRotationQuat.setFromEuler(_this.adjustedCubeEulerXZ);	
						_this.medianCubeRotationQuat.setFromEuler(_this.medianCubeEulerXZ);						
					    _this.prevMedianCubeEulerXZ.copy(_this.medianCubeEulerXZ);
						_this.cubeEuler.setFromVector3(_this.cubeSides[_this.topFace].getWorldUpVector(), 'YXZ');
					
					}

				}
			}
		}
	}
	
ArCube.prototype.updateRotation = function(sensorrotation, screenangle){	
		var _this = this;
		let quaternion = new THREE.Quaternion(sensorrotation[0], sensorrotation[1],
                                                      sensorrotation[2], sensorrotation[3]);
 			let euler = new THREE.Euler(0, 0, 0);

            // Order of rotations must be adapted depending on orientation
            // for portrait ZYX, for landscape ZXY
            let angleOrder = null;
			screenangle === 0 ? angleOrder = 'ZYX' : angleOrder = 'ZXY';
            euler.setFromQuaternion(quaternion, angleOrder);
			var sensoreulerx = 0;
			var sensoreulery = 0;
			
			if (screenangle === 0)
			{
				if ((euler.x >=  0) && (euler.x <= Math.PI))
				{
					sensoreulerx = euler.x  - (Math.PI / 2);
					sensoreulery = euler.y;
				}
				else
				{
					sensoreulerx = -(euler.x + (Math.PI / 2));
					sensoreulery = -euler.y;
				}
				

			}
			else if (screenangle === 90)
			{
				sensoreulerx = -euler.y - (Math.PI / 2);
				sensoreulery = euler.x;
				
			}
			else if (screenangle === 270)
			{
				sensoreulerx = euler.y - (Math.PI / 2);
				sensoreulery = -euler.x;

			}
			
			
			_this.deltaSensorEulerXAngle = _this.sensorEulerXAngle - sensoreulerx;
			_this.deltaSensorEulerYAngle = _this.sensorEulerYAngle - sensoreulery;
			_this.sensorEulerXAngle = sensoreulerx;
			_this.sensorEulerYAngle = sensoreulery;

	}
ArCube.prototype.getIntroText = function(){
	
	return this.cubeSides[this.touchedCubeSide].getIntroText();
}

ArCube.prototype.isIntroTextDisplayed = function(){	
	return this.displayIntrotext;
	
}

ArCube.prototype.getNumSides = function(){
	
	return this.cubeSides.length;
}

ArCube.prototype.getCubeControlActive = function(){

	return this.cubeControlActive;
}

ArCube.prototype.getHelpText = function(){	

	return this.cubeSides[this.touchedCubeSide].getHelpText();
}

ArCube.prototype.isHelpTextDisplayed = function(){
	if (this.displayIntrotext)
	{
		return false;
	}
	else
	{		
		return this.displayHelp;
	}	
}

ArCube.prototype.setHelpToggle = function(value){	
	if (this.displayIntrotext)
	{
		this.displayHelp = false;
		this.displayHelpTimer.stop();
	}
	else
	{
		if (value == null)
		{
			if (!this.displayHelp)
			{
				this.displayHelp = true;
				if (this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(false);
				}
				this.displayHelpTimer.start();
			}
			else
			{
				if (this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(true);
				}
				this.displayHelp = false;
				this.displayHelpTimer.stop();
			}
		}
		else
		{
			if (value == false)
			{
				if (this.cubeSides[this.touchedCubeSide].getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					this.cubeSides[this.touchedCubeSide].setCubeControlEnabled(true);
				}
				this.displayHelp = false;
				this.displayHelpTimer.stop();
			}
		}
	}
}
	
ArCube.prototype.getIsVisible = function(){
		var _this = this;	
		return _this.isVisible;
	}

ArCube.prototype.getSensorEulerXAngle = function(){	
		var _this = this;
		return _this.sensorEulerXAngle;
	}
	
ArCube.prototype.getSensorEulerYAngle = function(){	
		return this.sensorEulerYAngle;
	}
	
ArCube.prototype.getAdjustedCubeEuler = function(){	
		return this.adjustedCubeEuler;
	}
	
ArCube.prototype.getCubeEuler = function(){	
		return this.cubeEuler;
	}
	
ArCube.prototype.getCubeRotation = function(){		
	return this.adjustedCubeRotationQuat;
}

ArCube.prototype.getMedianCubeRotation = function(){		
	return this.medianCubeRotationQuat;
}
	
ArCube.prototype.getTrackedFace = function(){	
		var _this = this;
		if (_this.trackedFace != null)
		{ 
			return _this.cubeSides[_this.trackedFace].getSideFaceGroupName();
		}
		else
		{
			return _this.trackedFace;
		}
	}
	
ArCube.prototype.getTopFaceName = function(){	
		var _this = this;
		if (_this.topFace != null)
		{
			return _this.cubeSides[_this.topFace].getSideFaceGroupName();
		}
		else
		{
			return null;
		}
	}
	
ArCube.prototype.getForwardFaceName = function(){	
		var _this = this;
		if (_this.forwardFace != null)
		{
			return _this.cubeSides[_this.forwardFace].getSideFaceGroupName();
		}
		else
		{
			return null;
		}
	}
	
ArCube.prototype.getCubeWorldQuaternion = function(){	
		return this.cubeWorldQuaternion;
	}
	
ArCube.prototype.getAdjustedCubeWorldQuaternion = function(){	
		return this.adjustedCubeWorldQuaternion;
	}
	
ArCube.prototype.getAdjustedCameraLookAtQuaternion = function(){	
		return this.adjustedCameraLookAtQuaternion;
	}
	
ArCube.prototype.getRotationAngle = function(){	
	
		return this.rotationAngle;
	}
	
	
ArCube.prototype.setCubeState = function(value){
	
	if ((this.currentCubeState == CubeStateEnum.ACTIVE) && (value == CubeStateEnum.CLOSING))
	{
		this.lerpValue = 0;
		this.lerpedValues.length = 0;
		this.lerpedValues[0] = 0;
		this.transition = 0;
		this.updateStageCounter = 0;
		this.currentCubeState = value;
		this.boxClock.start();
	}
}

ArCube.prototype.getCubeState = function(){
	
	return this.currentCubeState;
}
	
ArCube.prototype.drawScreenButtons = function(){
	if (this.currentCubeState == CubeStateEnum.ACTIVE)
	{
		if ((!this.displayIntrotext) && (!this.displayHelp) && (this.isVisible))
		{
			this.cubeSides[this.touchedCubeSide].drawScreenButtons();
		}
		else
		{
			this.cubeSides[this.touchedCubeSide].setScreenButtonsCurrentRenderState(false);
		}
	}
}

ArCube.prototype.resizeScreenButtons = function(){
	
	if (this.cubeSides != null)
	{
		for (let i = 0; i < this.cubeSides.length; i++)
		{
			this.cubeSides[i].resizeScreenButtons();
		}
	}
}


ArCube.prototype.screenButtonCollisionDetection = function(touchposition, touchtype){
	
	var istouched = false;
	if (this.currentCubeState == CubeStateEnum.ACTIVE)
	{
		if ((!this.displayIntrotext) && (!this.displayHelp) && (this.isVisible))
		{
			istouched = this.cubeSides[this.touchedCubeSide].screenButtonCollisionDetection(touchposition, touchtype);
		}
	}
	return istouched;
}	
	

ArCube.prototype.touchEvent = function(touchposition){	
	var _this = this;
	if (this.isVisible)
	{
		_this.playerRaycaster.setFromCamera( touchposition, g_camera );
		console.log("touch event");
		switch (this.currentCubeState) {	
		case CubeStateEnum.NOTACTIVE:
			var touchedside = null;
			if (_this.cubeSides.length > 0)
			{
				console.log("this.cubefacesGroup " + _this.cubefacesGroup.children.length);
				console.log("touchx " + touchposition.x);
				console.log("touchy " + touchposition.y);
				var intersectsMarkers = _this.playerRaycaster.intersectObjects( _this.cubefacesGroup.children, true );
				if ( intersectsMarkers.length > 0 ) {
					
					console.log("intersects " + intersectsMarkers[ 0 ].object.name );
					console.log("intersects parent " + intersectsMarkers[ 0 ].object.parent.name);
					for(let i=0;i<_this.cubeSides.length;i++)
					{
						
						if ((_this.cubeSides[i].getMarkerName() == intersectsMarkers[ 0 ].object.name) || (_this.cubeSides[i].getMarkerName() == intersectsMarkers[ 0 ].object.parent.name)) 
						{
							_this.lerpValue = 0;
							_this.lerpedValues.length = 0;
							_this.lerpedValues[0] = 0;
							_this.currentCubeState = CubeStateEnum.INITOPENING;
							console.log("found side " + i + " " + _this.cubeSides[i].getMarkerName());
							touchedside = i;
							break;
						}
					}
				}	
			}
			this.touchedCubeSide = touchedside;
			break;
		case CubeStateEnum.ACTIVE:
			if (!_this.displayHelp)
			{
				if (this.touchedCubeSide != null)
				{
					for(let i=0;i< _this.cubeSides[this.touchedCubeSide].getStagesArray().length;i++)
					{
						//waypoints
						if (_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].isWaypointsPresent())
						{
							var intersectsMarkers = _this.playerRaycaster.intersectObjects( _this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getWaypointsGroup().children, true );
							if ( intersectsMarkers.length > 0 ) {
								_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setWaypointTouched(intersectsMarkers[ 0 ].object.name);
								//console.log("intersects " + intersectsMarkers[ 0 ].object.name );
								//console.log("intersects parent " + intersectsMarkers[ 0 ].object.parent.name);
							}
						}
						//buttons within models
						if (_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].isInteractableModelsPresent())
						{
							var intersectsMarkers = _this.playerRaycaster.intersectObjects( _this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getInteractableModelsGroup(), true );
							if ( intersectsMarkers.length > 0 ) {
								console.log("intersects " + intersectsMarkers[ 0 ].object.name );
								console.log("intersects object parent " + intersectsMarkers[ 0 ].object.parent.name);
								console.log("intersects parent parent name " + intersectsMarkers[ 0 ].object.parent.parent.name);
								_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setInteractableModelTouchedStart(intersectsMarkers[ 0 ].object);
							}
							else
							{
								_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setInteractableModelTouchedStart(null);
							}
							
						}
					}
				}
			}
			break;
		}
	}
}
	
ArCube.prototype.touchEventMove = function(touchposition){

	var _this = this;
	_this.playerRaycaster.setFromCamera( touchposition, g_camera );
	console.log("touchmove event");
	switch (this.currentCubeState) {
	case CubeStateEnum.ACTIVE:
		if (!_this.displayHelp)
		{
			if (this.touchedCubeSide != null)
			{
				for(let i=0;i< _this.cubeSides[this.touchedCubeSide].getStagesArray().length;i++)
				{
					//buttons within models
					if (_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].isInteractableModelsPresent())
					{
						var intersectsMarkers = _this.playerRaycaster.intersectObjects( _this.cubeSides[this.touchedCubeSide].getStagesArray()[i].getInteractableModelsGroup(), true );
						if ( intersectsMarkers.length > 0 ) {
							console.log("touchmove " + intersectsMarkers[ 0 ].object.name );
							console.log("touchmove parent " + intersectsMarkers[ 0 ].object.parent.name);
							
							_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setInteractableModelTouchedMove(intersectsMarkers[ 0 ].object);
						}
						else
						{
							_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setInteractableModelTouchedMove(null);
						}
					}
				}
			}
		}
		break;
	}
}

ArCube.prototype.touchEventEnd = function(){

	var _this = this;
	console.log("touchend event");
	switch (this.currentCubeState) {	
	case CubeStateEnum.OPENING:
		console.log("touchend event CubeStateEnum.NOTACTIVE");
		if (this.touchedCubeSide != null)
		{
			//if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()))
			if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()))
			{
				console.log("CubeStateEnum.OPENING video or audio present");
				_this.cubeSides[this.touchedCubeSide].initialiseMediaPlayback();
			}
			else
			{
				console.log("CubeStateEnum.OPENING no video or audio");
			}
			if (_this.cubeSides[this.touchedCubeSide].isPhysicsPresent())
			{
				_this.cubeSides[this.touchedCubeSide].initialisePhysics();
			}
		}
		break;
	case CubeStateEnum.ACTIVE:
		if (!_this.displayHelp)
		{
			if (this.touchedCubeSide != null)
			{
				if ((g_isIOS) && (_this.cubeSides[this.touchedCubeSide].isVoicePresent()))
				{
					_this.cubeSides[this.touchedCubeSide].initialiseAudioPlayback();
				}
				console.log("touchend event CubeStateEnum.ACTIVE");
				for(let i=0;i< _this.cubeSides[this.touchedCubeSide].getStagesArray().length;i++)
				{
					//buttons within models
					if (_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].isInteractableModelsPresent())
					{
						_this.cubeSides[this.touchedCubeSide].getStagesArray()[i].setInteractableModelTouchedEnd();	
					}
				}
			}
		}
		break;
	}			

}	
  
ArCube.prototype.dispose = function(){
	var _this = this;
	
	if (this.currentCubeState != CubeStateEnum.NOTACTIVE)
	{		
		if (this.displayIntrotext)
		{
			this.displayIntroTimer.stop();
			this.displayIntrotext = false;
		}
		if (this.displayHelp)
		{
			this.displayHelp = false;
			this.displayHelpTimer.stop();
		}
		if (this.touchedCubeSide != null)
		{
			for(let i=0;i< _this.activeCubeStages.length;i++)
			{
				switch (_this.cubeSides[this.touchedCubeSide].getStageEntranceType(_this.activeCubeStages[i][0])) {
				case EntranceTypeEnum.LIFT:
				case EntranceTypeEnum.HALFLIFT:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getStageStartPosY(_this.activeCubeStages[i][0]), _this.activeCubeStages[i][0])
					break;
				case EntranceTypeEnum.FULLFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStageRotation(0, 0, 180, _this.activeCubeStages[i][0]);
					break;
				case EntranceTypeEnum.HALFFLIP:
					_this.cubeSides[this.touchedCubeSide].setStageElevation(_this.cubeSides[this.touchedCubeSide].getDefaultStageStartPosY(), _this.activeCubeStages[i][0]);
					_this.cubeSides[this.touchedCubeSide].setStagePivotRotation(0, 0, 0, _this.activeCubeStages[i][0]);
					break;
				}
				_this.cubeSides[this.touchedCubeSide].setStageVisiblity(false, _this.activeCubeStages[i][0]);
			}
			if ((_this.cubeSides[this.touchedCubeSide].isVideoTexturePresent()) || (_this.cubeSides[this.touchedCubeSide].isAudioPresent()) || (_this.cubeSides[this.touchedCubeSide].isVoicePresent()))
			{
				_this.cubeSides[this.touchedCubeSide].pauseMediaPlayback();
			}
		}
		for(let i=0;i< _this.activeCubeFaces.length;i++)
		{
			_this.cubeSides[(_this.activeCubeFaces[i])].openCloseLid(0)
			_this.cubeSides[_this.activeCubeFaces[i]].setBoxLidVisibility(true);
			_this.cubeSides[_this.activeCubeFaces[i]].setLidSegmentVisibility(false);
		}
		_this.activeCubeFaces.length = 0;
		_this.touchedCubeSideContentType = null;
		_this.touchedCubeSide = null;
		_this.boxClock.stop();
		_this.currentCubeState = CubeStateEnum.NOTACTIVE;	
	}	
	if (_this.timeoutClick.running)
	{
		_this.timeoutClick.stop();
	}
		
	//remove assetLoaders

	
	if (_this.assetModelTextures != null)
	{
		for (let i = 0; i < _this.assetModelTextures.length; i++)
		{
			_this.assetModelTextures[i].dispose();
			_this.assetModelTextures[i] = null;
		}
		_this.assetModelTextures.length = 0;
		_this.assetModelTextures = null;
	}	
		
	//dispose lights	
		 
	_this.storedHemisphereLightIntensities.length = 0;
	_this.storedAmbientLightIntensities.length = 0;

	if (_this.sceneLightsGroup != null)
	{
		for (var i = _this.sceneLightsGroup.children.length - 1; i >= 0; i--) {
			const light = _this.sceneLightsGroup.children[i];
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
				disposeObjectMesh(light);
			}
			_this.sceneLightsGroup.remove(light);
		}
	}
	g_scene.remove(_this.sceneLightsGroup);
	_this.sceneLightsGroup = null;
	
	if (_this.frameMesh != null)
	{
		_this.sceneGroup.remove( _this.frameMesh );
		disposeObjectMesh(_this.frameMesh);
		_this.frameMesh = null;
	}
	
	if (_this.rotationHelper != null)
	{
		_this.sceneGroup.remove( _this.rotationHelper );
		disposeObjectMesh(_this.rotationHelper);
		_this.rotationHelper = null;
	}
		
		
		/* const cleanMaterial = material => {
			console.log('dispose material!')
			material.dispose()

			// dispose textures
			for (const key of Object.keys(material)) {
				const value = material[key]
				if (value && typeof value === 'object' && 'minFilter' in value) {
					console.log('dispose texture!')
					value.dispose()
				}
			}
		}
		
		g_scene.traverse(object => {
			if (!object.isMesh) return
			
			console.log('dispose geometry!')
			if (object.geometry != undefined)
			{
				object.geometry.dispose()
			}
			if (object.material != undefined)
			{
				if (object.material.isMaterial) {
					cleanMaterial(object.material)
				} else {
					// an array of materials
					for (const material of object.material) cleanMaterial(material)
				}
			}
			
		}) */

		
		
		/* if (_this.cubeSides != null)
		{  
			for(var i=0;i<_this.cubeSides.length;i++)
			{ 
				_this.cubeSides[i].removeFromParent();
				_this.cubeSides[i].deallocateResources();
				_this.cubeSides[i].dispose();
				_this.cubeSides[i] = null;
			}
			_this.cubeSides.length = 0;
			_this.cubeSides = null;
		} */
		
		if (_this.cubeSides != null)
		{  
			for(var i=0;i<_this.cubeSides.length;i++)
			{
				_this.cubeSides[i].dispose();
				_this.cubeSides[i] = null;
			}
			_this.cubeSides.length = 0;
			_this.cubeSides = null;
		}
		
		this.lerpedValues.length = 0;
		this.lerpedValues = null;
		_this.playerRaycaster = null;
		_this.sceneGroup = null;
		
		if (_this.assetLoaders != null)
		{
			for (let i = 0; i < _this.assetLoaders.length; i++)
			{
				switch (_this.assetLoaders[i].AssetType) {
				case AssetLoaderTypeEnum.MODEL:
					if (_this.assetLoaders[i].Asset != null)
					{
						console.log("dispose mesh Asset ID " + _this.assetLoaders[i].AssetID);
						disposeObjectMesh(_this.assetLoaders[i].Asset);
						_this.assetLoaders[i].Asset = null;
					}
					_this.assetLoaders[i].AssetID = null;
					_this.assetLoaders[i].AssetType = null;
					_this.assetLoaders[i].AssetFunctionArray.length = 0;
					_this.assetLoaders[i].AssetFunctionArray = null;
					_this.assetLoaders[i].AssetFunctionParameter.length = 0;
					_this.assetLoaders[i].AssetFunctionParameter = null;
					break;
				case AssetLoaderTypeEnum.TEXTURE:
					if (_this.assetLoaders[i].Asset != null)
					{
						console.log("dispose textures Asset ID " + _this.assetLoaders[i].AssetID);
						_this.assetLoaders[i].Asset.dispose();
						_this.assetLoaders[i].Asset = null;
					}
					_this.assetLoaders[i].AssetID = null;
					_this.assetLoaders[i].AssetType = null;
					_this.assetLoaders[i].AssetFunctionArray.length = 0;
					_this.assetLoaders[i].AssetFunctionArray = null;
					_this.assetLoaders[i].AssetFunctionParameter.length = 0;
					_this.assetLoaders[i].AssetFunctionParameter = null;
					break;
				}
			}
			_this.assetLoaders.length = 0;
			_this.assetLoaders = null;
		}
		
		const cleanMaterial = material => {
			console.log('dispose material!')
			material.dispose()

			// dispose textures
			for (const key of Object.keys(material)) {
				const value = material[key]
				if (value && typeof value === 'object' && 'minFilter' in value) {
					console.log('dispose texture!')
					value.dispose()
				}
			}
		}
		
		g_scene.traverse(object => {
			//if (!object.isMesh) return
			
			//console.log('dispose geometry!')
			if (object.geometry != undefined)
			{
				object.geometry.dispose()
			}
			if (object.material != undefined)
			{
				if (object.material.isMaterial) {
					cleanMaterial(object.material)
				} else {
					// an array of materials
					for (const material of object.material) cleanMaterial(material)
				}
			}
			
		})
	}
	
	
	

