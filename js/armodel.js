

const MaterialTypeEnum = {
  STANDARDMATERIAL: 0,
  FACEMATERIAL: 1,
  SIDEMATERIAL: 2,
  FRONTBACKMATERIAL: 3,
  FRONTMATERIAL: 4,
  BACKMATERIAL: 5,
  LEFTMATERIAL: 6,
  RIGHTMATERIAL: 7,
  MIRRORMATERIAL: 8,
  FACECOLOUR: 9,
  SIDECOLOUR: 10,
  FRONTBACKCOLOUR: 11,
  FRONTCOLOUR: 12,
  BACKCOLOUR: 13,
  LEFTCOLOUR: 14,
  RIGHTCOLOUR: 15
};



ARModel = function(item, parentobject, parentcube, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.moveClock = new THREE.Clock(false);
	this.userData = null;
	this.classUID = null;
	this.model = null;
	this.physicsObject = null;
	this.physicsPresent = false;
	this.physicsShapeType = null;
	this.loadedModel = null;
	this.textures = new Array;
	this.parentObject = parentobject;
	this.parentSide = parentside;
	this.parentCube = parentcube;
	this.parentStage = parentstage;
	this.buttonArray = new Array;
	this.videoTextureArray = new Array;
	this.colourChangeArray = new Array;
	this.meshLabelsArray = new Array;
	this.audioClipsArray = new Array;
	this.lightsArray = new Array;
	this.dynamicVolumeObjects = new Array;
	this.maxPosition = null; 
	this.minPosition = null;
	this.pendingTranslation = new THREE.Vector3(0, 0, 0);
	this.targetPosition = new THREE.Vector3(0, 0, 0);
	this.isTargetPositionPending = false;
	this.moveSpeed = 1;
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialRopeStoredPositions = [];
	this.initialStoredRotation = new THREE.Vector3(0, 0, 0);
	this.initialStoredScale = new THREE.Vector3(1, 1, 1);
	this.storedVisible = true;
	this.currentPosition = new THREE.Vector3(0, 0, 0);
	this.currentWorldPosition = new THREE.Vector3(0, 0, 0);
	this.currentRotation = new THREE.Vector3(0, 0, 0);
	this.castShadow = true;
	this.receiveShadow = true;
	this.materialType = MaterialTypeEnum.STANDARDMATERIAL;
	this.textureRepeatWrapX = 1;
	this.textureRepeatWrapY = 1;
	
	/* this.modelTextureLoaded = function(texture, model)
	{
		_this.texture = texture;
		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				// apply texture
				var oldtexture = child.material.map;
				oldtexture.dispose();
				child.material.map = null;
				child.material.map = texture;
				child.material.needsUpdate = true;
			
			}
		});	

	}; */
	
	/* this.modelTextureLoaded = function(texture, model)
	{
		
		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				let oldtexture = child.material.map;
				oldtexture.dispose();
				var oldmaterial = child.material;
				texture.encoding = THREE.sRGBEncoding;
				texture.flipY = false;
				var new_material = child.material.clone();
				let oldtexture = new_material.map;
				oldtexture.dispose();
				child.material = new_material;
				child.material.map = texture;
				oldmaterial.dispose();
				child.material.needsUpdate = true; 
			}
		});	

	}; */

	
	
	this.getMeshElement = function(name)
	{
		var childmesh = null;
		_this.model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				if (child.name == name)
				{
					childmesh = child;
				}
			}
		});
		
		return childmesh;	

	};
	
	this.setMeshElementTexture = function(nodename, newtexture, oldtexture)
	{
		var success = false;
		_this.model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				if (child.name == name)
				{
					childmesh = child;
					oldtexture = child.material.map;
					child.material.map = null;
					child.material.map = newtexture;
					child.material.needsUpdate = true;
					success = true;
				}
			}
		});
		
		return success;	

	};
	

	
	/* this.geometryTextureLoaded = function(loadedtexture, model) {
		
		model.material.map = null;
		model.material.map = loadedtexture;
		_this.texture = loadedtexture;
		model.material.needsUpdate = true;
	}; */
	
	this.geometryTextureLoaded = function(loadedtexture, model) {
		loadedtexture.encoding = THREE.sRGBEncoding;
		loadedtexture.anisotropy = 16;
		if ((_this.textureRepeatWrapX > 1) || (_this.textureRepeatWrapY > 1))
		{
			loadedtexture.wrapS = THREE.RepeatWrapping;
			loadedtexture.wrapT = THREE.RepeatWrapping;
			loadedtexture.repeat.set( _this.textureRepeatWrapX, _this.textureRepeatWrapY );
		}
		_this.textures.push(loadedtexture);
		if ( Array.isArray( model.material ) )
		{
			switch (_this.materialType) {
			case MaterialTypeEnum.STANDARDMATERIAL:
				for ( var m = 0; m < model.material.length; m ++ ) {
					if ((model.material[m]).map)
					{
						(model.material[m]).map = null;
						(model.material[m]).map = loadedtexture;
						(model.material[m]).needsUpdate = true;
					}
				}
				break;
			case MaterialTypeEnum.FACEMATERIAL:
				switch (_this.physicsShapeType) {
				case PhysicsTypeEnum.RIGIDBODY_BOX:
					(model.material[2]).map = null;
					(model.material[2]).map = loadedtexture;
					(model.material[2]).needsUpdate = true;
					(model.material[3]).map = null;
					(model.material[3]).map = loadedtexture;
					(model.material[3]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CONE:
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
					break;			
				}
				break;
			case MaterialTypeEnum.SIDEMATERIAL:
				switch (_this.physicsShapeType) {
				case PhysicsTypeEnum.RIGIDBODY_BOX:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
					(model.material[4]).map = null;
					(model.material[4]).map = loadedtexture;
					(model.material[4]).needsUpdate = true;
					(model.material[5]).map = null;
					(model.material[5]).map = loadedtexture;
					(model.material[5]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					break;			
				case PhysicsTypeEnum.RIGIDBODY_CONE:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					break;
				}
				break;
			case MaterialTypeEnum.FRONTBACKMATERIAL:
				switch (_this.physicsShapeType) {
				case PhysicsTypeEnum.RIGIDBODY_BOX:
					(model.material[4]).map = null;
					(model.material[4]).map = loadedtexture;
					(model.material[4]).needsUpdate = true;
					(model.material[5]).map = null;
					(model.material[5]).map = loadedtexture;
					(model.material[5]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
					(model.material[2]).map = null;
					(model.material[2]).map = loadedtexture;
					(model.material[2]).needsUpdate = true;
					break;			
				case PhysicsTypeEnum.RIGIDBODY_CONE:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					break;
				}
				break;
			case MaterialTypeEnum.FRONTMATERIAL:
				switch (_this.physicsShapeType) {
				case PhysicsTypeEnum.RIGIDBODY_BOX:
					(model.material[4]).map = null;
					(model.material[4]).map = loadedtexture;
					(model.material[4]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
					break;			
				case PhysicsTypeEnum.RIGIDBODY_CONE:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					break;
				}
				break;
			case MaterialTypeEnum.BACKMATERIAL:
				switch (_this.physicsShapeType) {
				case PhysicsTypeEnum.RIGIDBODY_BOX:
					(model.material[5]).map = null;
					(model.material[5]).map = loadedtexture;
					(model.material[5]).needsUpdate = true;
					break;
				case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
					(model.material[2]).map = null;
					(model.material[2]).map = loadedtexture;
					(model.material[2]).needsUpdate = true;
					break;			
				case PhysicsTypeEnum.RIGIDBODY_CONE:
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
					break;
				}
				break;
			case MaterialTypeEnum.RIGHTMATERIAL:
				if (_this.physicsShapeType == PhysicsTypeEnum.RIGIDBODY_BOX)
				{
					(model.material[0]).map = null;
					(model.material[0]).map = loadedtexture;
					(model.material[0]).needsUpdate = true;
				}					
				break;	
			case MaterialTypeEnum.LEFTMATERIAL:	
				if (_this.physicsShapeType == PhysicsTypeEnum.RIGIDBODY_BOX)
				{
					(model.material[1]).map = null;
					(model.material[1]).map = loadedtexture;
					(model.material[1]).needsUpdate = true;
				}
				break;	
			}
		}
		else
		{
			model.material.map = null;
			model.material.map = loadedtexture;
			model.material.needsUpdate = true;
		}
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
				child.castShadow = _this.castShadow;
				child.receiveShadow = _this.receiveShadow;
			}

		} );

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
		
		if (_this.UID != null)
		{
			_this.model.name = _this.UID;
		}
		
		
		var scaledmodel = false;
		if (modelitem.hasOwnProperty('scalex'))
		{
			_this.initialStoredScale.x = modelitem.scalex;
			scaledmodel = true;
		}
		if (modelitem.hasOwnProperty('scaley'))
		{
			_this.initialStoredScale.y = modelitem.scaley;
			scaledmodel = true;
		}
		if (modelitem.hasOwnProperty('scalez'))
		{
			_this.initialStoredScale.z = modelitem.scalez;
			scaledmodel = true;
		}
		if (scaledmodel)
		{
			_this.model.scale.copy(_this.initialStoredScale);
		}
		
		if (modelitem.hasOwnProperty('visible'))
		{
			_this.storedVisible = modelitem.visible;
		}
		_this.model.visible = _this.storedVisible;
		
		_this.parentObject.getObject3D().add( _this.model );
		_this.model.position.copy( _this.initialStoredPosition );
		_this.model.rotation.setFromVector3( _this.initialStoredRotation );
		
		
		if (_this.physicsObject != null)
		{
			if (_this.physicsObject.isModelRequired())
			{
				_this.physicsObject.setupModel(_this.model);
			}
		}
		
		if (_this.buttonArray != null)
		{
			for(let i=0;i<_this.buttonArray.length;i++)
			{
				if (_this.buttonArray[i].getNodeName() != null)
				{
					var childmesh = _this.getMeshElement(_this.buttonArray[i].getNodeName());
					if ( childmesh != null)
					{
						_this.buttonArray[i].setButtonMesh(childmesh);
					}
					else
					{
						_this.buttonArray[i].setButtonMesh(_this.model);
					}
				}
				/* else
				{
					_this.buttonArray[i].setButtonMesh(childmesh, _this.model.name);
				} */
			}
		}
		
		if (_this.videoTextureArray != null)
		{
			for(let i=0;i<_this.videoTextureArray.length;i++)
			{
				if (_this.videoTextureArray[i].getNodeName() != null)
				{
					var childmesh = _this.getMeshElement(_this.videoTextureArray[i].getNodeName());
					if ( childmesh != null)
					{
						_this.videoTextureArray[i].setup(childmesh);
					}
					else
					{
						_this.videoTextureArray[i].setup(_this.model);
					}
				}
				else
				{
					_this.videoTextureArray[i].setup(_this.model);
				} 
			}
		}
		
		if (_this.colourChangeArray != null)
		{
			for(let i=0;i<_this.colourChangeArray.length;i++)
			{
				if (_this.colourChangeArray[i].getNodeName() != null)
				{
					var childmesh = _this.getMeshElement(_this.colourChangeArray[i].getNodeName());
					if ( childmesh != null)
					{
						_this.colourChangeArray[i].setup(childmesh);
					}
					else
					{
						_this.colourChangeArray[i].setup(_this.model);
					}
				}
				else
				{
					_this.colourChangeArray[i].setup(_this.model);
				} 
			}
		}
		
		if (_this.meshLabelsArray != null)
		{
			for(let i=0;i<_this.meshLabelsArray.length;i++)
			{
				if (_this.meshLabelsArray[i].getNodeName() != null)
				{
					var childmesh = _this.getMeshElement(_this.meshLabelsArray[i].getNodeName());
					if ( childmesh != null)
					{
						_this.meshLabelsArray[i].setup(childmesh);
					}
					else
					{
						_this.meshLabelsArray[i].setup(_this.model);
					}
				}
				else
				{
					_this.meshLabelsArray[i].setup(_this.model);
				} 
			}
		}
		
		if (_this.lightsArray != null)
		{
			for(let i=0;i<_this.lightsArray.length;i++)
			{
				if (_this.lightsArray[i].getNodeName() != null)
				{
					var childmesh = _this.getMeshElement(_this.lightsArray[i].getNodeName());
					if ( childmesh != null)
					{
						_this.lightsArray[i].setup(childmesh);
					}
				}
			}
		}
		
	}; 
	
	
	if (item.hasOwnProperty('model'))
	{
		if (item.model.hasOwnProperty('uid'))
		{
			
			_this.UID = item.model.uid;
			_this.parentSide.setUIDObjectMap(item.model.uid, _this, ObjectTypeEnum.MODEL);
		}
		else
		{
			if (_this.parentObject.getType() != ObjectTypeEnum.STAGE)
			{
				_this.UID = _this.parentObject.getUID();
				_this.parentSide.setUIDObjectMap(_this.UID, _this, ObjectTypeEnum.MODEL);
			}
			
		}
		if (item.model.hasOwnProperty('userdata'))
		{
			this.userData = item.model.userdata;
		}
		
		if (item.model.hasOwnProperty('class'))
		{
			_this.classUID = item.model.class;
			_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
		}
		
		if (item.model.hasOwnProperty('castshadow'))
		{
			this.castShadow = item.model.castshadow;
		}

		if (item.model.hasOwnProperty('receiveshadow'))
		{
			this.receiveShadow = item.model.receiveshadow;
		}
		
		if (item.model.hasOwnProperty('fbx'))
		{
			var loader = new THREE.FBXLoader(g_loadingManager);
			loader.load( 'assets/models/' + item.model.fbx, function ( object ) {
				model = object;
				_this.modelLoaded(model, item.model , false, AssetFileTypeEnum.FBX);

			}	)
		}
		
		if (item.model.hasOwnProperty('glb'))
		{
			var loader = new THREE.GLTFLoader(g_loadingManager);
			loader.load( 'assets/models/' + item.model.glb , function ( gltf ) {
					//model = gltf.scene;
					model = gltf;
					_this.modelLoaded(model, item.model , false, AssetFileTypeEnum.GLB);

			}	)
		}
		if (item.model.hasOwnProperty('modelid'))
		{
			_this.parentCube.setupAssetLoader(item.model.modelid, AssetLoaderTypeEnum.MODEL, this.modelLoaded, item.model);
		}
		
		if (item.model.hasOwnProperty('rotx'))
		{
			_this.initialStoredRotation.x = THREE.Math.degToRad(item.model.rotx);
		}
		if (item.model.hasOwnProperty('roty'))
		{
			_this.initialStoredRotation.y = THREE.Math.degToRad(item.model.roty);
		}
		if (item.model.hasOwnProperty('rotz'))
		{
			_this.initialStoredRotation.z = THREE.Math.degToRad(item.model.rotz);
		}
		if (item.model.hasOwnProperty('x'))
		{
			_this.initialStoredPosition.x = item.model.x;
		}	
		if (item.model.hasOwnProperty('y'))
		{
			_this.initialStoredPosition.y = item.model.y;
		}
		if (item.model.hasOwnProperty('z'))
		{
			_this.initialStoredPosition.z = item.model.z;
		}
		
		if (item.model.hasOwnProperty('minpos'))
		{	
			this.minPosition = new THREE.Vector3(0, 0, 0);
			if (item.model.minpos.hasOwnProperty('x'))
			{
				this.minPosition.x = item.model.minpos.x;
			}
			if (item.model.minpos.hasOwnProperty('y'))
			{
				this.minPosition.y = item.model.minpos.y;
			}
			if (item.model.minpos.hasOwnProperty('z'))
			{
				this.minPosition.z = item.model.minpos.z;
			}
		}	

		if (item.model.hasOwnProperty('maxpos'))
		{
			this.maxPosition = new THREE.Vector3(0, 0, 0);
			if (item.model.maxpos.hasOwnProperty('x'))
			{
				this.maxPosition.x = item.model.maxpos.x;
			}
			if (item.model.maxpos.hasOwnProperty('y'))
			{
				this.maxPosition.y = item.model.maxpos.y;
			}
			if (item.model.maxpos.hasOwnProperty('z'))
			{
				this.maxPosition.z = item.model.maxpos.z;
			}
		}
		
		if (item.model.hasOwnProperty('physics'))
		{
			this.physicsPresent = true;
			/* var physicsshape = PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH;
			if (item.model.physics.hasOwnProperty('mass'))
			{
				if (item.model.physics.mass > 0)
				{
					physicsshape = PhysicsTypeEnum.RIGIDBODY_CONVEXHULL;	
				}
			}
			else
			{
				if (this.parentSide.getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
				{
					physicsshape = PhysicsTypeEnum.RIGIDBODY_CONVEXHULL;
				}
			}
			this.physicsObject = new ARPhysicsObject(item.model.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, physicsshape, null, this.initialStoredPosition, this.initialStoredRotation);  */
			if (item.model.physics.hasOwnProperty('type'))
			{
				this.physicsObject = new ARPhysicsObject(item.model.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, null, null, this.initialStoredPosition, this.initialStoredRotation);
			}
			else
			{
				this.physicsObject = new ARPhysicsObject(item.model.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, PhysicsTypeEnum.RIGIDBODY_CONVEXHULL, null, this.initialStoredPosition, this.initialStoredRotation);
			}
		}
		
		if (item.model.hasOwnProperty('videotextures'))
		{
			if (item.model.videotextures.length > 0)
			{
				for (let i = 0; i < item.model.videotextures.length; i++)
				{
					if (item.model.videotextures[i].hasOwnProperty('videotexture'))
					{
						var arvideotexture = new ARVideoTexture(item.model.videotextures[i].videotexture, this.parentSide, this.parentStage);
						this.videoTextureArray.push(arvideotexture);
						if (arvideotexture.isDynamicVolume())
						{
							this.dynamicVolumeObjects.push(arvideotexture);
						}
					}
				}
			}
			
		} 
		
		if (item.model.hasOwnProperty('meshbuttons'))
		{
			if (item.model.meshbuttons.length > 0)
			{
				for (let i = 0; i < item.model.meshbuttons.length; i++)
				{
					if (item.model.meshbuttons[i].hasOwnProperty('meshbutton'))
					{
						var arbutton = new ARMeshButton(item.model.meshbuttons[i].meshbutton, this.parentSide, this.parentStage);
						this.buttonArray.push(arbutton);
					}
				}
			}
		}
		
		if (item.model.hasOwnProperty('colourchanges'))
		{
			if (item.model.colourchanges.length > 0)
			{
				for (let i = 0; i < item.model.colourchanges.length; i++)
				{
					if (item.model.colourchanges[i].hasOwnProperty('colourchange'))
					{
						var arcolourchange = new ARColourChange(item.model.colourchanges[i].colourchange, this.parentSide, this.parentStage);
						this.colourChangeArray.push(arcolourchange);
					}
				}
			}
			
		}
		
		if (item.model.hasOwnProperty('meshlabels'))
		{
			if (item.model.meshlabels.length > 0)
			{
				for (let i = 0; i < item.model.meshlabels.length; i++)
				{
					if (item.model.meshlabels[i].hasOwnProperty('meshlabel'))
					{
						var armeshlabel = new ARMeshLabel(item.model.meshlabels[i].meshlabel, this.parentSide, this.parentStage);
						this.meshLabelsArray.push(armeshlabel);
					}
				}
			}
			
		}
		
		if (item.model.hasOwnProperty('audioclips'))
		{
			if (item.model.audioclips.length > 0)
			{
				for (let i = 0; i < item.model.audioclips.length; i++)
				{
					if (item.model.audioclips[i].hasOwnProperty('audioclip'))
					{
						var audioclip = new ARAudio(item.model.audioclips[i].audioclip, this.parentSide);
						this.audioClipsArray.push(audioclip);
						if (audioclip.isDynamicVolume())
						{
							this.dynamicVolumeObjects.push(audioclip);
						}
					}
				}
			}
		}
		
		if (item.model.hasOwnProperty('lights'))
		{
			if (item.model.lights.length > 0)
			{
				for (let i = 0; i < item.model.lights.length; i++)
				{
					if (item.model.lights[i].hasOwnProperty('light'))
					{
						var light = new ARLight(item.model.lights[i].light, _this, this.parentCube, this.parentSide, this.parentStage);
						this.lightsArray.push(light);
					}
				}
			}
		}		
		
	}
	
	if (item.hasOwnProperty('geometry'))
	{
		var geometry = null;
		var height = 0;
		
		var physicsdimensions = null;
		
		switch (item.geometry.type.toLowerCase()) {
		case 'plane':
			this.physicsShapeType = PhysicsTypeEnum.RIGIDBODY_PLANE;
			break;
		case 'box':
			this.physicsShapeType = PhysicsTypeEnum.RIGIDBODY_BOX;
			break;
		case 'sphere':
			this.physicsShapeType = PhysicsTypeEnum.RIGIDBODY_SPHERE;
			break;
		case 'cylinder':
			this.physicsShapeType = PhysicsTypeEnum.RIGIDBODY_CYLINDER;
			break;
		case 'cone':
			this.physicsShapeType = PhysicsTypeEnum.RIGIDBODY_CONE;
			break;
		case 'rope':
			this.physicsShapeType = PhysicsTypeEnum.SOFTBODY_ROPE;
			break;
		case 'cloth':
			this.physicsShapeType = PhysicsTypeEnum.SOFTBODY_CLOTH;
			break;			
		}
		
		if (this.physicsShapeType != PhysicsTypeEnum.SOFTBODY_ROPE)
		{

			var scaledmodel = false;
			if (item.geometry.hasOwnProperty('scalex'))
			{
				_this.initialStoredScale.x = item.geometry.scalex;
				scaledmodel = true;
			}
			if (item.geometry.hasOwnProperty('scaley'))
			{
				_this.initialStoredScale.y = item.geometry.scaley;
				scaledmodel = true;
			}
			if (item.geometry.hasOwnProperty('scalez'))
			{
				_this.initialStoredScale.z = item.geometry.scalez;
				scaledmodel = true;
			}
			
			var colour = new THREE.Color( 0xffffff );
			var colour2 = new THREE.Color( 0xffffff );
			var materials;
			let materialfilename = null;
			let materialfileid = null;
			
			if (item.geometry.hasOwnProperty('tiletexturex'))
			{
				this.textureRepeatWrapX = item.geometry.tiletexturex;
			}
			if (item.geometry.hasOwnProperty('tiletexturey'))
			{
				this.textureRepeatWrapY = item.geometry.tiletexturey;;
			}
			if (item.geometry.hasOwnProperty('colour'))
			{
				if (item.geometry.colour.toLowerCase() == "shadowonly")
				{
					var shadowopacity = 0.2;
					if (item.geometry.hasOwnProperty('opacity'))
					{
						shadowopacity = item.geometry.opacity;
					}
					this.materialType = MaterialTypeEnum.SHADOWMATERIAL;
					materials = new THREE.ShadowMaterial( { opacity: shadowopacity } );
				}
				else
				{
					colour = item.geometry.colour;
				}
			}
			if (this.materialType != MaterialTypeEnum.SHADOWMATERIAL)
			{
				if (item.geometry.hasOwnProperty('facematerial'))
				{
					materialfilename = item.geometry.facematerial;
					this.materialType = MaterialTypeEnum.FACEMATERIAL;
				}
				if (item.geometry.hasOwnProperty('facematerialid'))
				{
					materialfileid = item.geometry.facematerialid;
					this.materialType = MaterialTypeEnum.FACEMATERIAL;
				}
				if (item.geometry.hasOwnProperty('sidematerial'))
				{
					materialfilename = item.geometry.sidematerial;
					this.materialType = MaterialTypeEnum.SIDEMATERIAL;
				}
				if (item.geometry.hasOwnProperty('sidematerialid'))
				{
					materialfileid = item.geometry.sidematerialid;
					this.materialType = MaterialTypeEnum.SIDEMATERIAL;
				}
				if (item.geometry.hasOwnProperty('frontbackmaterial'))
				{
					materialfilename = item.geometry.frontbackmaterial;
					this.materialType = MaterialTypeEnum.FRONTBACKMATERIAL;
				}
				if (item.geometry.hasOwnProperty('frontbackmaterialid'))
				{
					materialfileid = item.geometry.frontbackmaterialid;
					this.materialType = MaterialTypeEnum.FRONTBACKMATERIAL;
				}
				if (item.geometry.hasOwnProperty('frontmaterial'))
				{
					materialfilename = item.geometry.frontmaterial;
					this.materialType = MaterialTypeEnum.FRONTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('frontmaterialid'))
				{
					materialfileid = item.geometry.frontmaterialid;
					this.materialType = MaterialTypeEnum.FRONTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('backmaterial'))
				{
					materialfilename = item.geometry.backmaterial;
					this.materialType = MaterialTypeEnum.BACKMATERIAL;
				}
				if (item.geometry.hasOwnProperty('backmaterialid'))
				{
					materialfileid = item.geometry.backmaterialid;
					this.materialType = MaterialTypeEnum.BACKMATERIAL;
				}
				if (item.geometry.hasOwnProperty('leftmaterial'))
				{
					materialfilename = item.geometry.leftmaterial;
					this.materialType = MaterialTypeEnum.LEFTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('leftmaterialid'))
				{
					materialfileid = item.geometry.leftmaterialid;
					this.materialType = MaterialTypeEnum.LEFTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('rightmaterial'))
				{
					materialfilename = item.geometry.rightmaterial;
					this.materialType = MaterialTypeEnum.RIGHTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('rightmaterialid'))
				{
					materialfileid = item.geometry.rightmaterialid;
					this.materialType = MaterialTypeEnum.RIGHTMATERIAL;
				}
				if (item.geometry.hasOwnProperty('facecolour'))
				{
					colour2 = item.geometry.facecolour;
					this.materialType = MaterialTypeEnum.FACECOLOUR;
				}
				if (item.geometry.hasOwnProperty('sidecolour'))
				{
					colour2 = item.geometry.sidecolour;
					this.materialType = MaterialTypeEnum.SIDECOLOUR
				}
				if (item.geometry.hasOwnProperty('frontbackcolour'))
				{
					colour2 = item.geometry.frontbackcolour;
					this.materialType = MaterialTypeEnum.FRONTBACKCOLOUR
				}
				if (item.geometry.hasOwnProperty('frontcolour'))
				{
					colour2 = item.geometry.frontcolour;
					this.materialType = MaterialTypeEnum.FRONTCOLOUR
				}
				if (item.geometry.hasOwnProperty('backcolour'))
				{
					colour2 = item.geometry.backcolour;
					this.materialType = MaterialTypeEnum.BACKCOLOUR
				}
				if (item.geometry.hasOwnProperty('leftcolour'))
				{
					colour2 = item.geometry.leftcolour;
					this.materialType = MaterialTypeEnum.LEFTCOLOUR
				}
				if (item.geometry.hasOwnProperty('rightcolour'))
				{
					colour2 = item.geometry.rightcolour;
					this.materialType = MaterialTypeEnum.RIGHTCOLOUR
				}
				if (this.materialType == MaterialTypeEnum.STANDARDMATERIAL)
				{
					if (item.geometry.hasOwnProperty('material'))
					{
						materialfilename = item.geometry.material;
					}
					if (item.geometry.hasOwnProperty('materialid'))
					{
						materialfileid = item.geometry.materialid;
					}
					if ((this.physicsShapeType == PhysicsTypeEnum.SOFTBODY_CLOTH) || (item.geometry.hasOwnProperty('doublesided')))
					{
						materials = new THREE.MeshLambertMaterial( { color: colour, side: THREE.DoubleSide } );
					}
					else
					{
						materials = new THREE.MeshStandardMaterial( { color: colour } );
					}
				}
			}
			
			switch (this.physicsShapeType) {
			case PhysicsTypeEnum.RIGIDBODY_PLANE:
			case PhysicsTypeEnum.SOFTBODY_CLOTH:
				let widthsegments = 1;
				let heightsegments = 1;

				if (item.geometry.hasOwnProperty('widthsegments'))
				{
					widthsegments = item.geometry.widthsegments;
				}
				if (item.geometry.hasOwnProperty('heightsegments'))
				{
					heightsegments = item.geometry.heightsegments;
				}
				if ((item.geometry.hasOwnProperty('width')) && (item.geometry.hasOwnProperty('height')))
				{
					height = item.geometry.height;
					physicsdimensions = new THREE.Vector2(item.geometry.width, item.geometry.height);
					geometry = new THREE.PlaneBufferGeometry( item.geometry.width, item.geometry.height, widthsegments, heightsegments );
				}

				break;					
			case PhysicsTypeEnum.RIGIDBODY_BOX:
				height = item.geometry.height;
				geometry = new THREE.BoxBufferGeometry( item.geometry.width, height, item.geometry.depth );
				physicsdimensions = new THREE.Vector3(item.geometry.width * _this.initialStoredScale.x, item.geometry.height * _this.initialStoredScale.y, item.geometry.depth * _this.initialStoredScale.z);
				if ((this.materialType != MaterialTypeEnum.STANDARDMATERIAL) && (this.materialType != MaterialTypeEnum.SHADOWMATERIAL))
				{
					var material = new THREE.MeshStandardMaterial( { color: colour } );
					switch (this.materialType) {
					case MaterialTypeEnum.FACEMATERIAL:
					case MaterialTypeEnum.FACECOLOUR:
						materials = [
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material,
									material
								];
					
						break;
					case MaterialTypeEnum.SIDEMATERIAL:
					case MaterialTypeEnum.SIDECOLOUR:
						materials = [
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
						break;
					case MaterialTypeEnum.FRONTBACKMATERIAL:
					case MaterialTypeEnum.FRONTBACKCOLOUR:
						materials = [
									material,
									material,
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
						break;
					case MaterialTypeEnum.FRONTMATERIAL:
					case MaterialTypeEnum.FRONTCOLOUR:
						materials = [
									material,
									material,
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material
									
								];
						break;
					case MaterialTypeEnum.BACKMATERIAL:
					case MaterialTypeEnum.BACKCOLOUR:
						materials = [
									material,
									material,
									material,
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
						break;
					case MaterialTypeEnum.RIGHTMATERIAL:	
					case MaterialTypeEnum.RIGHTCOLOUR:
						materials = [
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material,
									material,
									material,
									material,
									material
								];
						break;	
					case MaterialTypeEnum.LEFTMATERIAL:	
					case MaterialTypeEnum.LEFTCOLOUR:
						materials = [
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material,
									material,
									material,
									material
								];
						break;	
					}
				}
				break;
			case PhysicsTypeEnum.RIGIDBODY_SPHERE:
				var widthseg = 32;
				if (item.geometry.hasOwnProperty('widthseg'))
				{
					widthseg = item.geometry.widthseg;
				}
				var heightseg = 32;
				if (item.geometry.hasOwnProperty('heightseg'))
				{
					heightseg = item.geometry.heightseg;
				}
				height = (item.geometry.radius * 2);
				geometry = new THREE.SphereBufferGeometry( item.geometry.radius, widthseg, heightseg ); 
				physicsdimensions = item.geometry.radius * _this.initialStoredScale.x;
				materials = new THREE.MeshStandardMaterial( { color: colour } );
				break;	
			case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
				var radialseg = 32;
				if (item.geometry.hasOwnProperty('radialseg'))
				{
					radialseg = item.geometry.radialseg;
				}
				height = item.geometry.height;
				if (item.geometry.hasOwnProperty('radius'))
				{
					geometry = new THREE.CylinderBufferGeometry( item.geometry.radius, item.geometry.radius, height, radialseg, 1 );
					physicsdimensions = new THREE.Vector3(item.geometry.radius * _this.initialStoredScale.x, item.geometry.height * _this.initialStoredScale.y, item.geometry.radius * _this.initialStoredScale.x);
				}
				else
				{
					if ((item.geometry.hasOwnProperty('topradius')) && (item.geometry.hasOwnProperty('bottomradius')))
					{
						geometry = new THREE.CylinderBufferGeometry( item.geometry.topradius, item.geometry.bottomradius, height, radialseg, 1 );	
						physicsdimensions = new THREE.Vector3(item.geometry.topradius * _this.initialStoredScale.x, item.geometry.height * _this.initialStoredScale.y, item.geometry.bottomradius * _this.initialStoredScale.x);
					}
				}
				if ((this.materialType != MaterialTypeEnum.STANDARDMATERIAL) && (this.materialType != MaterialTypeEnum.SHADOWMATERIAL))
				{
					var material = new THREE.MeshStandardMaterial( { color: colour } );
					switch (this.materialType) {
					case MaterialTypeEnum.SIDEMATERIAL:
					case MaterialTypeEnum.SIDECOLOUR:
					
						materials = [
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material,
									material
								];
						break;
					case MaterialTypeEnum.FRONTBACKMATERIAL:
					case MaterialTypeEnum.FRONTBACKCOLOUR:
						materials = [
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
						break;
					case MaterialTypeEnum.FACEMATERIAL:
					case MaterialTypeEnum.FACECOLOUR:
					case MaterialTypeEnum.FRONTMATERIAL:
					case MaterialTypeEnum.FRONTCOLOUR:
						materials = [
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material
									
								];
						break;
					case MaterialTypeEnum.BACKMATERIAL:
					case MaterialTypeEnum.BACKCOLOUR:
						materials = [
									material,
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
						break;
					}
				}
	
				break;
			case PhysicsTypeEnum.RIGIDBODY_CONE:
				var radialseg = 32;
				if (item.geometry.hasOwnProperty('radialseg'))
				{
					radialseg = item.geometry.radialseg;
				}
				height = item.geometry.height;
				geometry = new THREE.ConeBufferGeometry( item.geometry.radius, height, radialseg, 2 );
				physicsdimensions = new THREE.Vector2(item.geometry.radius * _this.initialStoredScale.x, item.geometry.height * _this.initialStoredScale.y);
				if ((this.materialType != MaterialTypeEnum.STANDARDMATERIAL) && (this.materialType != MaterialTypeEnum.SHADOWMATERIAL))
				{
					var material = new THREE.MeshStandardMaterial( { color: colour } );
					switch (this.materialType) {
					
					case MaterialTypeEnum.FACEMATERIAL:
					case MaterialTypeEnum.FACECOLOUR:
						materials = [
									material,
									new THREE.MeshStandardMaterial( { color: colour2 } )
								];
					
						break;
					case MaterialTypeEnum.SIDEMATERIAL:
					case MaterialTypeEnum.SIDECOLOUR:
					case MaterialTypeEnum.FRONTBACKMATERIAL:
					case MaterialTypeEnum.FRONTBACKCOLOUR:
						materials = [
									new THREE.MeshStandardMaterial( { color: colour2 } ),
									material
								];
						break;
					
					}
				}
				break;
			}

			if (geometry != null)
			{
				this.model = new THREE.Mesh( geometry, materials );	
				
				if (item.geometry.hasOwnProperty('uid'))
				{
					this.UID = item.geometry.uid;
					this.parentSide.setUIDObjectMap(this.UID, this, ObjectTypeEnum.MODEL);
					this.model.name = this.UID;
				}
				else
				{
					if (this.parentObject.getType() != ObjectTypeEnum.STAGE)
					{
						this.UID = this.parentObject.getUID();
						this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.MODEL);
						this.model.name = this.UID;
					}
					
				}
				if (item.geometry.hasOwnProperty('userdata'))
				{
					this.userData = item.geometry.userdata;
				}
				if (item.geometry.hasOwnProperty('class'))
				{
					this.classUID = item.geometry.class;
					_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
				}
				if (item.geometry.hasOwnProperty('rotx'))
				{
					this.initialStoredRotation.x = THREE.Math.degToRad(item.geometry.rotx);
				}
				if (item.geometry.hasOwnProperty('roty'))
				{
					this.initialStoredRotation.y = THREE.Math.degToRad(item.geometry.roty);
				}
				if (item.geometry.hasOwnProperty('rotz'))
				{
					this.initialStoredRotation.z = THREE.Math.degToRad(item.geometry.rotz);
				}

				if (scaledmodel)
				{
					_this.model.scale.copy(_this.initialStoredScale);
				}
				
				if (item.geometry.hasOwnProperty('visible'))
				{
					_this.storedVisible = item.geometry.visible;
				}
				_this.model.visible = _this.storedVisible;
				
				
				if (item.geometry.hasOwnProperty('x'))
				{
					this.initialStoredPosition.x = item.geometry.x;
				}	
				if (item.geometry.hasOwnProperty('y'))
				{
					if (scaledmodel)
					{
						this.initialStoredPosition.y = item.geometry.y + ((height * _this.initialStoredScale.y) / 2) ;
					}
					else
					{
						this.initialStoredPosition.y = item.geometry.y + (height / 2);
					}
				}
				else
				{
					if (scaledmodel)
					{
						this.initialStoredPosition.y = ((height * _this.initialStoredScale.y) / 2);
					}
					else
					{
						this.initialStoredPosition.y = (height / 2);
					}
				}
				if (item.geometry.hasOwnProperty('z'))
				{
					this.initialStoredPosition.z = item.geometry.z;
				}
				
				if (item.geometry.hasOwnProperty('minpos'))
				{	
					this.minPosition = new THREE.Vector3(0, 0, 0);
					if (item.geometry.minpos.hasOwnProperty('x'))
					{
						this.minPosition.x = item.geometry.minpos.x;
					}
					if (item.geometry.minpos.hasOwnProperty('y'))
					{
						this.minPosition.y = item.geometry.minpos.y;
					}
					if (item.geometry.minpos.hasOwnProperty('z'))
					{
						this.minPosition.z = item.geometry.minpos.z;
					}
				}	

				if (item.geometry.hasOwnProperty('maxpos'))
				{
					this.maxPosition = new THREE.Vector3(0, 0, 0);
					if (item.geometry.maxpos.hasOwnProperty('x'))
					{
						this.maxPosition.x = item.geometry.maxpos.x;
					}
					if (item.geometry.maxpos.hasOwnProperty('y'))
					{
						this.maxPosition.y = item.geometry.maxpos.y;
					}
					if (item.geometry.maxpos.hasOwnProperty('z'))
					{
						this.maxPosition.z = item.geometry.maxpos.z;
					}
				}
				
				this.model.position.copy( this.initialStoredPosition );
				this.model.rotation.setFromVector3( this.initialStoredRotation );
				
				

				if (item.geometry.hasOwnProperty('meshbuttons'))
				{
					if (item.geometry.meshbuttons.length > 0)
					{
						for (let i = 0; i < item.geometry.meshbuttons.length; i++)
						{
							if (item.geometry.meshbuttons[i].hasOwnProperty('meshbutton'))
							{
								var arbutton = new ARMeshButton(item.geometry.meshbuttons[i].meshbutton, this.parentSide, this.parentStage);
								if (arbutton.getNodeName() != null)
								{
									arbutton.setButtonMesh(this.model);
									this.buttonArray.push(arbutton);
								}
							}
						}
					}
					
				}
				
				if (item.geometry.hasOwnProperty('videotextures'))
				{
					if (item.geometry.videotextures.length > 0)
					{
						for (let i = 0; i < item.geometry.videotextures.length; i++)
						{
							if (item.geometry.videotextures[i].hasOwnProperty('videotexture'))
							{
								var arvideotexture = new ARVideoTexture(item.geometry.videotextures[i].videotexture, this.parentSide, this.parentStage);
								arvideotexture.setup(this.model);
								this.videoTextureArray.push(arvideotexture);
								if (arvideotexture.isDynamicVolume())
								{
									this.dynamicVolumeObjects.push(arvideotexture);
								}
							}
						}
					}
					
				} 
				
				if (item.geometry.hasOwnProperty('colourchanges'))
				{
					if (item.geometry.colourchanges.length > 0)
					{
						for (let i = 0; i < item.geometry.colourchanges.length; i++)
						{
							if (item.geometry.colourchanges[i].hasOwnProperty('colourchange'))
							{
								var arcolourchange = new ARColourChange(item.geometry.colourchanges[i].colourchange, this.parentSide, this.parentStage);
								this.colourChangeArray.push(arcolourchange);
							}
						}
					}
					
				}
				
				
				if (item.geometry.hasOwnProperty('meshlabels'))
				{
					if (item.geometry.meshlabels.length > 0)
					{
						for (let i = 0; i < item.geometry.meshlabels.length; i++)
						{
							if (item.geometry.meshlabels[i].hasOwnProperty('meshlabel'))
							{
								var armeshlabel = new ARMeshLabel(item.geometry.meshlabels[i].meshlabel, this.parentSide, this.parentStage);
								this.meshLabelsArray.push(armeshlabel);
							}
						}
					}
					
				}

				if (item.geometry.hasOwnProperty('audioclips'))
				{
					if (item.geometry.audioclips.length > 0)
					{
						for (let i = 0; i < item.geometry.audioclips.length; i++)
						{
							if (item.geometry.audioclips[i].hasOwnProperty('audioclip'))
							{
								var audioclip = new ARAudio(item.geometry.audioclips[i].audioclip, this.parentSide);
								_this.audioClipsArray.push(audioclip);
								if (audioclip.isDynamicVolume())
								{
									this.dynamicVolumeObjects.push(audioclip);
								}
							}
						}
					}
				}
				
				if (item.geometry.hasOwnProperty('lights'))
				{
					if (item.geometry.lights.length > 0)
					{
						for (let i = 0; i < item.geometry.lights.length; i++)
						{
							if (item.geometry.lights[i].hasOwnProperty('light'))
							{
								var light = new ARLight(item.geometry.lights[i].light, _this, this.parentCube, this.parentSide, this.parentStage);
								this.lightsArray.push(light);
							}
						}
					}
				}		


				/* if (item.geometry.hasOwnProperty('physics'))
				{
					this.physicsObject = new ARColourChange(this.initialStoredPosition, )
				}	 */	
				if (item.geometry.hasOwnProperty('physics'))
				{
					this.physicsPresent = true;
					this.physicsObject = new ARPhysicsObject(item.geometry.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, this.physicsShapeType, physicsdimensions, this.initialStoredPosition, this.initialStoredRotation); 
					if ((this.parentObject.getType() == ObjectTypeEnum.STAGE) && (this.physicsObject.cubeControlled()) && (this.physicsObject.getEnabled()))
					{
						this.parentObject.getPhysicsObject3D().add(this.model);
					}
					else
					{
						this.parentObject.getObject3D().add(this.model);
					}
				}
				else
				{
					this.parentObject.getObject3D().add(this.model);
				}

				if (item.geometry.hasOwnProperty('castshadow'))
				{
					this.castShadow = item.geometry.castshadow;
				}

				if (item.geometry.hasOwnProperty('receiveshadow'))
				{
					this.receiveShadow = item.geometry.receiveshadow;
				}
				this.model.receiveShadow = this.receiveShadow;
				this.model.castShadow = this.castShadow;			
				if (materialfilename != null)
				{
					var loader = new AjaxTextureLoader(g_loadingManager);
						loader.load( "assets/textures/" + materialfilename, function( texture ) {	
						_this.geometryTextureLoaded(texture, _this.model);
					});
				} 
				if (materialfileid != null)
				{
					_this.parentCube.setupAssetLoader(materialfileid, AssetLoaderTypeEnum.TEXTURE, this.geometryTextureLoaded, this.model);
				}

			}
		}
		else
		{
			
				var ropeNumSegments = 10;
				var ropeLength = 1;
				var ropeMass = 3;
				var colour = new THREE.Color( 0xffffff );
				if (item.geometry.hasOwnProperty('colour'))
				{
					colour = item.geometry.colour;
				}
				
				if (item.geometry.hasOwnProperty('x'))
				{
					this.initialStoredPosition.x = item.geometry.x;
				}	
				if (item.geometry.hasOwnProperty('y'))
				{
					this.initialStoredPosition.y = item.geometry.y;
				}
				if (item.geometry.hasOwnProperty('z'))
				{
					this.initialStoredPosition.z = item.geometry.z;
				}	
				if (item.geometry.hasOwnProperty('segments'))
				{
					ropeNumSegments = item.geometry.segments;
				}
				if (item.geometry.hasOwnProperty('length'))
				{
					ropeLength = item.geometry.length;
				}			

				const segmentLength = ropeLength / ropeNumSegments;
				const ropeGeometry = new THREE.BufferGeometry();
				const ropeMaterial = new THREE.LineBasicMaterial( { color: colour } );
				const ropeIndices = [];

				for ( let i = 0; i < ropeNumSegments + 1; i ++ ) {

					this.initialRopeStoredPositions.push( this.initialStoredPosition.x, this.initialStoredPosition.y + i * segmentLength, this.initialStoredPosition.z );
				}

				for ( let i = 0; i < ropeNumSegments; i ++ ) {

					ropeIndices.push( i, i + 1 );
				}

				ropeGeometry.setIndex( new THREE.BufferAttribute( new Uint16Array( ropeIndices ), 1 ) );
				ropeGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.initialRopeStoredPositions ), 3 ) );
				ropeGeometry.computeBoundingSphere();
				this.model = new THREE.LineSegments( ropeGeometry, ropeMaterial );
				this.model.castShadow = true;
				this.model.receiveShadow = true;
				this.parentObject.getObject3D().add( this.model );
				if (item.geometry.hasOwnProperty('uid'))
				{
					this.UID = item.geometry.uid;
					this.parentSide.setUIDObjectMap(this.UID, this, ObjectTypeEnum.MODEL);
					this.model.name = this.UID;
				}
				if (item.geometry.hasOwnProperty('userdata'))
				{
					this.userData = item.geometry.userdata;
				}
				
				if (item.geometry.hasOwnProperty('class'))
				{
					this.classUID = item.geometry.class;
					this.parentSide.setUIDObjectMap(this.UID, this, ObjectTypeEnum.CLASS, this.classUID);
				}
				if (item.geometry.hasOwnProperty('physics'))
				{
					this.physicsPresent = true;
					this.physicsObject = new ARPhysicsObject(item.geometry.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, this.physicsShapeType, null, this.initialStoredPosition, null, ropeLength, ropeNumSegments); 
				}
			
		}
	}
	
}


ARModel.prototype.constructor = ARModel;


ARModel.prototype.initialise = function(){
	this.moveClock.start();
	this.isTargetPositionPending = false;
	this.pendingTranslation.set(0,0,0);
	this.targetPosition.set(0,0,0);

	if (this.physicsShapeType != PhysicsTypeEnum.SOFTBODY_ROPE)
	{
		this.model.position.copy( this.initialStoredPosition );
		this.model.rotation.setFromVector3( this.initialStoredRotation );
		this.currentPosition.copy(this.initialStoredPosition);
		this.currentRotation.copy(this.initialStoredRotation);
		for (let i = 0; i < this.colourChangeArray.length; i++)
		{
			this.colourChangeArray[i].initialise();
		}
		for (let i = 0; i < this.meshLabelsArray.length; i++)
		{
			this.meshLabelsArray[i].initialise();
		}
		for (let i = 0; i < this.lightsArray.length; i++)
		{
			this.lightsArray[i].initialise();
		}
		for (let i = 0; i < this.buttonArray.length; i++)
		{
			this.buttonArray[i].initialise();
		}
		this.model.visible = this.storedVisible;
	}
	else
	{
	// Update rope

/*  		const ropePositions = this.model.geometry.attributes.position.array;
		const numVerts = ropePositions.length / 3;

		let indexFloat = 0;

		for ( let i = 0; i < numVerts; i ++ ) {


			ropePositions[ indexFloat ++ ] = this.initialRopeStoredPositions[i].x;
			ropePositions[ indexFloat ++ ] = this.initialRopeStoredPositions[i].y;
			ropePositions[ indexFloat ++ ] = this.initialRopeStoredPositions[i].z;

		} */
		this.model.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.initialRopeStoredPositions ), 3 ) );	
		this.model.geometry.attributes.position.needsUpdate = true;  
		this.model.visible = this.storedVisible;
	}
}



ARModel.prototype.calcBoundingBoxHeight = function(){	
	
	
	var height = 0;
	if (this.model != null)
	{
		var boundingBox = new THREE.Box3().setFromObject(this.model);
		var boundingboxsize = new THREE.Vector3(0,0,0);
		if (this.parentObject.getType() == ObjectTypeEnum.GROUP)
		{
			let mat = new THREE.Matrix4();
			mat.makeRotationFromEuler(this.parentObject.getObject3D().rotation);
			boundingBox.applyMatrix4(mat);
		}
		boundingBox.getSize(boundingboxsize);
		height = ( boundingboxsize.y + boundingBox.min.y);
	}
	return height;

}

ARModel.prototype.calcBoundingBoxMinMaxPosZ = function(){	
	
	
	var minmaxpos = [0,0];
	if (this.model != null)
	{
		var boundingBox = new THREE.Box3().setFromObject(this.model);
		var boundingboxsize = new THREE.Vector3(0,0,0);
		if (this.parentObject.getType() == ObjectTypeEnum.GROUP)
		{
			let mat = new THREE.Matrix4();
			mat.makeRotationFromEuler(this.parentObject.getObject3D().rotation);
			boundingBox.applyMatrix4(mat);
		}
		boundingBox.getSize(boundingboxsize);
		minmaxpos = [boundingBox.min.z, boundingBox.max.z];
	}
	return minmaxpos;

}

ARModel.prototype.getUID = function(){	
	return this.UID;
}

ARModel.prototype.getUserData = function(){	
	return this.userData
}

ARModel.prototype.getObject3D = function(){
	return this.model;
}

ARModel.prototype.getParentObject = function(){
	return this.parentObject;
}

ARModel.prototype.getInitialPosition = function(){	
	return this.initialStoredPosition;
}

ARModel.prototype.getInitialRotation = function(){	
	return this.initialStoredRotation;
}

ARModel.prototype.getVisibilty = function(){	
	return this.model.visible;
}

ARModel.prototype.setVisibilty = function(value){	
	this.model.visible = value;
}




ARModel.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.currentRotation.x);
}

ARModel.prototype.getCurrentRotationAngleY = function(){	
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

ARModel.prototype.getCurrentRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.currentRotation.z);
}


ARModel.prototype.setCurrentRotationAngleX = function(value, fromPhysics = false){
	this.currentRotation.x = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
}

ARModel.prototype.setCurrentRotationAngleY = function(value, fromPhysics = false){	
	this.currentRotation.y = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
}

ARModel.prototype.setCurrentRotationAngleZ = function(value, fromPhysics = false){	
	this.currentRotation.z = THREE.Math.degToRad(value);	
	this.model.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
}

ARModel.prototype.getCurrentPosition = function(){	
	return this.currentPosition;
}

ARModel.prototype.getCurrentPositionX = function(){	
	return this.currentPosition.x;
}

ARModel.prototype.getCurrentPositionY = function(){	
	return this.currentPosition.y;
}

ARModel.prototype.getCurrentPositionZ = function(){	
	return this.currentPosition.z;
}

ARModel.prototype.setCurrentPosition = function(value, fromPhysics = false){	
	this.currentPosition.copy(value);
	this.model.position.copy( this.currentPosition );
	this.isTargetPositionPending = false;	
}

ARModel.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez, fromPhysics = false){	
	if (valuex != null) {this.currentPosition.x = valuex;}
	if (valuey != null) { this.currentPosition.y = valuey;}
	if (valuez != null) {this.currentPosition.z = valuez;}
	this.model.position.copy( this.currentPosition );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
	this.isTargetPositionPending = false;	
}

ARModel.prototype.setCurrentRotation = function(value, fromPhysics = false){	
	this.currentRotation.copy(value);
	this.model.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
}

ARModel.prototype.getCurrentQuaternion = function()
{
	return this.model.quaternion;
}

ARModel.prototype.setCurrentQuaternion = function(value, fromPhysics = false){	
	this.model.quaternion.set( value.x(), value.y(), value.z(), value.w() );
	this.model.rotation.toVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
	}
}

ARModel.prototype.getCurrentRotation = function(){	
	return this.currentRotation;
}

ARModel.prototype.cancelTranslation = function(){
	this.isTargetPositionPending = false;
	
}

ARModel.prototype.translateObject = function(value, speed = null){
	
	if ((speed != null) && (this.moveSpeed != speed))
	{
		this.moveSpeed = speed;
	}
	if (!this.isTargetPositionPending)
	{
		this.targetPosition.copy(this.currentPosition);
	}
	this.targetPosition.add(value);
	this.isTargetPositionPending = true;
	if ((this.maxPosition != null) && (this.minPosition != null))
	{
		if (this.targetPosition.x > this.maxPosition.x)
		{
			this.targetPosition.x = this.maxPosition.x;
		}
		else if (this.targetPosition.x < this.minPosition.x)
		{
			this.targetPosition.x = this.minPosition.x;
		}
		if (this.targetPosition.y > this.maxPosition.y)
		{
			this.targetPosition.y = this.maxPosition.y;
		}
		else if (this.targetPosition.y < this.minPosition.y)
		{
			this.targetPosition.y = this.minPosition.y;
		}
		if (this.targetPosition.z > this.maxPosition.z)
		{
			this.targetPosition.z = this.maxPosition.z;
		}
		else if (this.targetPosition.z < this.minPosition.z)
		{
			this.targetPosition.z = this.minPosition.z;
		}
	}
}		

ARModel.prototype.getType = function(){	
	return ObjectTypeEnum.MODEL;
}

ARModel.prototype.update = function(){
	var _this = this;
	let delta = this.moveClock.getDelta();
	if (this.isTargetPositionPending)
	{
		moveObject(delta);
		
	}
	if (this.dynamicVolumeObjects.length > 0)
	{
		this.model.getWorldPosition(this.currentWorldPosition);
		//distance to orgin as camera is always at origin
		var distance = this.currentWorldPosition.distanceTo(new THREE.Vector3(0,0,0));
		var scale = 1;
		if (distance > g_Structure.arscanner.audiosettings.distances.novolume)
		{
			scale = 0;
		}
		else
		{
			if ((distance > g_Structure.arscanner.audiosettings.distances.maxvolume) && (distance < g_Structure.arscanner.audiosettings.distances.novolume))
			{
				scale = Math.round((1 - ((distance - g_Structure.arscanner.audiosettings.distances.maxvolume) / (g_Structure.arscanner.audiosettings.distances.novolume - g_Structure.arscanner.audiosettings.distances.maxvolume))) * 10) / 10;	
			}
		}
		for (let i = 0; i < this.dynamicVolumeObjects.length; i++)
		{
			this.dynamicVolumeObjects[i].setVolume(null, scale);
		}
	}
	
	for(let i=0;i<this.videoTextureArray.length;i++)
	{
		this.videoTextureArray[i].update();
	}
	for(let i=0;i<this.colourChangeArray.length;i++)
	{
		this.colourChangeArray[i].update();
	}
	for(let i=0;i<this.meshLabelsArray.length;i++)
	{
		this.meshLabelsArray[i].update();
	}
	
	function moveObject(delta)
	{
		var pendingx = true;
		var pendingy = true;
		var pendingz = true;

		if (_this.targetPosition.x != _this.currentPosition.x)
		{
			let distance = Math.abs(_this.targetPosition.x - _this.currentPosition.x);
			let interval = ((_this.targetPosition.x - _this.currentPosition.x) / distance) * ((1 / _this.moveSpeed) * delta);
			if (Math.abs(interval) > distance)
			{
				_this.pendingTranslation.x = (_this.targetPosition.x - _this.currentPosition.x);
				pendingx = false;
			}
			else
			{
				_this.pendingTranslation.x = interval;
			}
		}
		else
		{
			pendingx = false;
		}
		if (_this.targetPosition.y != _this.currentPosition.y)
		{
			let distance = Math.abs(_this.targetPosition.y - _this.currentPosition.y);
			let interval = ((_this.targetPosition.y - _this.currentPosition.y) / distance) * ((1 / _this.moveSpeed) * delta);
			if (Math.abs(interval) > distance)
			{
				_this.pendingTranslation.y = (_this.targetPosition.y - _this.currentPosition.y);
				 pendingy = false;
			}
			else
			{
				_this.pendingTranslation.y = interval;
			}
		}
		else
		{
			 pendingy = false;
		}
		if (_this.targetPosition.z != _this.currentPosition.z)
		{
			let distance = Math.abs(_this.targetPosition.z - _this.currentPosition.z);
			let interval = ((_this.targetPosition.z - _this.currentPosition.z) / distance) * ((1 / _this.moveSpeed) * delta);
			if (Math.abs(interval) > distance)
			{
				_this.pendingTranslation.z = (_this.targetPosition.z - _this.currentPosition.z);
				 pendingy = false;
			}
			else
			{
				_this.pendingTranslation.z = interval;
			}
		}
		else
		{
			pendingy = false;
		}
		if ((!pendingx) && (!pendingy) && (!pendingz))
		{
			_this.isTargetPositionPending = false;
		}
		_this.pendingTranslation.add(_this.currentPosition);
		_this.currentPosition.copy(_this.pendingTranslation);
		_this.model.position.copy( _this.currentPosition );	
		_this.pendingTranslation.set(0, 0, 0);		
	}
}

ARModel.prototype.removeFromParent = function(){
	
	this.parentObject.getObject3D().remove( this.model );
}



ARModel.prototype.dispose = function(){
	
	/* if (this.loadedModel != null)
	{
		console.log("dispose loadedmodel " + this.UID);
		disposeObjectMesh(this.loadedModel);
		this.loadedModel = null;
		this.model = null;
	}
	else
	{ */
		if (this.model != null)
		{
			disposeObjectMesh(this.model);
			this.loadedModel = null;
			this.model = null;
		}
	//}
	
	if (this.physicsObject != null)
	{
		this.physicsObject.dispose();
		this.physicsObject = null;
	}
	
	if (this.textures != null)
	{
		for (let i = 0; i < this.textures.length; i++)
		{
			this.textures[i].dispose();
			this.textures[i] = null;
		}
		this.textures.length = 0;
		this.textures = null;
	}
	
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
	
	if (this.colourChangeArray != null)
	{
		for(let i=0;i<this.colourChangeArray.length;i++)
		{
			this.colourChangeArray[i].dispose();
			this.colourChangeArray[i] = null;
		}
		this.colourChangeArray.length = 0;
		this.colourChangeArray = null;
	}
	
	if (this.meshLabelsArray != null)
	{
		for(let i=0;i<this.meshLabelsArray.length;i++)
		{
			this.meshLabelsArray[i].dispose();
			this.meshLabelsArray[i] = null;
		}
		this.meshLabelsArray.length = 0;
		this.meshLabelsArray = null;
	}
	
	if (this.videoTextureArray != null)
	{
		for(let i=0;i<this.videoTextureArray.length;i++)
		{
			this.videoTextureArray[i].dispose();
			this.videoTextureArray[i] = null;
		}
		this.videoTextureArray.length = 0;
		this.videoTextureArray = null;
	}
	
	if (this.audioClipsArray != null)
	{
		for(let i=0;i<this.audioClipsArray.length;i++)
		{
			this.audioClipsArray[i].dispose();
			this.audioClipsArray[i] = null;
		}
		this.audioClipsArray.length = 0;
		this.audioClipsArray = null;
	}
	
	if (this.lightsArray != null)
	{
		for(let i=0;i<this.lightsArray.length;i++)
		{
			this.lightsArray[i].dispose();
			this.lightsArray[i] = null;
		}
		this.lightsArray.length = 0;
		this.lightsArray = null;
	}
	
	if (this.dynamicVolumeObjects != null)
	{
		for(let i=0;i<this.dynamicVolumeObjects.length;i++)
		{
			this.dynamicVolumeObjects[i] = null;
		}
		this.dynamicVolumeObjects.length = 0;
		this.dynamicVolumeObjects = null;
	}
	if (this.moveClock.running)
	{
		this.moveClock.stop();
	}
	this.moveClock = null;

	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.targetPosition = null;
	this.pendingTranslation = null;
	this.initialStoredPosition = null;
	this.initialStoredRotation = null;
	this.parentObject = null;
}