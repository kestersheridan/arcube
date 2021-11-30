const WaypointButtonStateEnum = {
	HIDDEN : 0,
	CURRENT : 1,
	ACTIVE : 2,
	CLICKED : 3,
	NOTACTIVE : 4,
	TRANSITION : 5
}

const WaypointRotationStateEnum = {
	BEYOND : 0,
	BEHIND : 1
	
}


ARWaypoint = function(item, parentgroup, parentcube, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.order = 0;
	this.parentGroup = parentgroup;
 	this.waypointmodel = null;
	this.defaultTexture = null;
	this.clickTexture = null;
	this.parentCube = parentcube;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.touched = false;
	this.branch = 0;
	this.joinBranches = new Array;
	this.isDisplayable = false;
	this.disabledColour = new THREE.Color();
	this.transitionColour = new THREE.Color();
	this.disabledColour.set(g_Structure.arscanner.waypoint.disabledcolour);
	this.enabledColour = new THREE.Color()
	this.enabledColour.set(g_Structure.arscanner.waypoint.enabledcolour);
	this.enabledOpacity = g_Structure.arscanner.waypoint.enabledopacity;
	this.disabledOpacity = g_Structure.arscanner.waypoint.disabledopacity;
	this.modelRadius = g_Structure.arscanner.waypoint.radius;
	this.previousState = null;
	this.transition = 0; 
	this.nextState = null;
	this.lerpValue;
	this.lerpedValues  = new Array;
	this.isEnabled = true;
	this.storedEnabled = true;
	this.currentState = WaypointButtonStateEnum.HIDDEN;
	this.defaultStoredState = WaypointButtonStateEnum.HIDDEN;
	this.defaultColour = new THREE.Color();
	this.defaultColour.set(g_Structure.arscanner.waypoint.disabledcolour);
	this.defaultOpacity = g_Structure.arscanner.waypoint.disabledopacity;
	this.defaultVisiblity = true;
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialStoredRotations = new Array;
	this.initialStoredRotations[0] = new THREE.Vector3(0, 0, 0);
	this.transitionClock = new THREE.Clock();
	this.currentRotationState = WaypointRotationStateEnum.BEYOND;
	this.nextRotationState = null;
	this.defaultRotationState = this.currentRotationState;
	this.transitionSpeed = g_Structure.arscanner.waypoint.transitionspeed;
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.WAYPOINT);
	}
	if (item.hasOwnProperty('order'))
	{
		if (item.order != 0)
		{
			this.order = item.order - 1;
		}
	}
	if (item.hasOwnProperty('branch'))
	{
		if (item.branch != 0)
		{
			this.branch = item.branch - 1;
		}
	}
	if (item.hasOwnProperty('enabled'))
	{
		this.isEnabled = item.enabled;
		this.storedEnabled = item.enabled;
		this.defaultVisiblity = this.isEnabled;
	}
	if (item.hasOwnProperty('rotx'))
	{
		this.initialStoredRotations[0].x = THREE.Math.degToRad(item.rotx);
	}
	if (item.hasOwnProperty('roty'))
	{
		this.initialStoredRotations[0].y = THREE.Math.degToRad(item.roty);
	}
	
	if (item.hasOwnProperty('rotz'))
	{
		this.initialStoredRotations[0].z = THREE.Math.degToRad(item.rotz);
	}
	if (item.hasOwnProperty('rotx2'))
	{
		if (this.initialStoredRotations.length == 1)
		{
			this.initialStoredRotations[1] = new THREE.Vector3(0, 0, 0);
		}
		this.initialStoredRotations[1].x = THREE.Math.degToRad(item.rotx2);
	}
	if (item.hasOwnProperty('roty2'))
	{
		if (this.initialStoredRotations.length == 1)
		{
			this.initialStoredRotations[1] = new THREE.Vector3(0, 0, 0);
		}
		this.initialStoredRotations[1].y = THREE.Math.degToRad(item.roty2);
	}
	
	if (item.hasOwnProperty('rotz2'))
	{
		if (this.initialStoredRotations.length == 1)
		{
			this.initialStoredRotations[1] = new THREE.Vector3(0, 0, 0);
		}
		this.initialStoredRotations[1].z = THREE.Math.degToRad(item.rotz2);
	}
	
	if (item.hasOwnProperty('x'))
	{
		this.initialStoredPosition.x = item.x;
	}	
	if (item.hasOwnProperty('y'))
	{
		this.initialStoredPosition.y = item.y;
	}
	if (item.hasOwnProperty('z'))
	{
		this.initialStoredPosition.z = item.z;
	}
	if (item.hasOwnProperty('join'))
	{
		for (let i = 0; i < item.join.length; i++)
		{
			if (item.join[i].hasOwnProperty('branch'))
			{
				console.log("add item.join.branch i " + i + " branch " + item.join[i].branch);
				this.joinBranches.push(item.join[i].branch - 1);
			}
		}			
	}
	
	this.changeMaterialColourOpacity = function(colour, opacity)
	{
		if ( Array.isArray( _this.waypointmodel.material ) )
		{
			for (let i = 0; i < _this.waypointmodel.material.length; i++)
			{
				if (colour != null)
				{
					(_this.waypointmodel.material[i]).color.setHex( colour );
				}
				if (opacity != null)
				{
					(_this.waypointmodel.material[i]).opacity = opacity;
				}
				//(_this.waypointmodel.material[i]).needsUpdate = true;
			}
		}
		else
		{
			if (colour != null)
			{
				_this.waypointmodel.material.color.setHex( colour );
			}
			if (opacity != null)
			{
				_this.waypointmodel.material.opacity = opacity;
			}
			//_this.waypointmodel.material.needsUpdate = true;
		}
		
	}
	
	this.switchTexture = function(clicktype) {
		var texture = _this.defaultTexture;
		if (clicktype)
		{
			texture = _this.clickTexture;
		}

		if (texture != null)
		{

			if ( Array.isArray( _this.waypointmodel.material ) )
			{
				//(_this.waypointmodel.material[1]).map = null;
				(_this.waypointmodel.material[1]).map = texture;
				(_this.waypointmodel.material[1]).needsUpdate = true;
			}
			else
			{
				//_this.waypointmodel.material.map = null;
				_this.waypointmodel.material.map = texture;
				_this.waypointmodel.material.needsUpdate = true;
			}
		}
	};
	
	
	this.clickTextureLoaded = function(loadedtexture) {
		loadedtexture.encoding = THREE.sRGBEncoding;
		loadedtexture.anisotropy = 16;
		_this.clickTexture = loadedtexture;

	};
	
	
	this.textureLoaded = function(loadedtexture, model) {
		loadedtexture.encoding = THREE.sRGBEncoding;
		loadedtexture.anisotropy = 16;
		_this.defaultTexture = loadedtexture;
		if ( Array.isArray( model.material ) )
		{
			(model.material[1]).map = null;
			(model.material[1]).map = loadedtexture;
			(model.material[1]).needsUpdate = true;
		}
		else
		{
			model.material.map = null;
			model.material.map = loadedtexture;
			model.material.needsUpdate = true;
		}
	};
	
	if ((item.hasOwnProperty('materialid')) || (item.hasOwnProperty('material')))
	{
		this.isDisplayable = true;
		this.currentState = WaypointButtonStateEnum.NOTACTIVE;
		this.defaultStoredState = WaypointButtonStateEnum.NOTACTIVE;
		var geometry = new THREE.CylinderBufferGeometry( _this.modelRadius, _this.modelRadius, g_Structure.arscanner.waypoint.height, 32 );
		//var material = new THREE.MeshStandardMaterial( {color: _this.disabledColour, opacity: _this.disabledOpacity, transparent: true } );
		var material = new THREE.MeshStandardMaterial( {color: g_Structure.arscanner.waypoint.disabledcolour, opacity: g_Structure.arscanner.waypoint.disabledopacity, transparent: true } );
		const materials = [
			material,
			//new THREE.MeshStandardMaterial( { color: _this.disabledColour, opacity: _this.disabledOpacity, transparent: true } ),
			new THREE.MeshStandardMaterial( { color: g_Structure.arscanner.waypoint.disabledcolour, opacity: g_Structure.arscanner.waypoint.disabledopacity, transparent: true } ),
			material
		];
		_this.waypointmodel = new THREE.Mesh( geometry, materials );
		_this.waypointmodel.name = this.order + "," + this.branch;
		_this.waypointmodel.receiveShadow = true;
		_this.waypointmodel.visible = _this.defaultVisiblity;
		_this.parentGroup.add( _this.waypointmodel );
		_this.waypointmodel.position.copy( _this.initialStoredPosition );
		_this.waypointmodel.rotation.setFromVector3( _this.initialStoredRotations[_this.currentRotationState] );
		if (item.hasOwnProperty('material'))
		{
			var loader = new AjaxTextureLoader(g_loadingManager);
			loader.load( "assets/textures/" + item.material, function( texture ) {	
				_this.textureLoaded(texture, _this.waypointmodel);
			});
		}
		if (item.hasOwnProperty('materialid'))
		{
			_this.parentCube.setupAssetLoader(item.materialid, AssetLoaderTypeEnum.TEXTURE, _this.textureLoaded, _this.waypointmodel);
		}
		if (item.hasOwnProperty('clickmaterial'))
		{
			var loader = new AjaxTextureLoader(g_loadingManager);
			loader.load( "assets/textures/" + item.clickmaterial, function( texture ) {	
				_this.clickTextureLoaded(texture, _this.clickTexture);
			});
		}
		if (item.hasOwnProperty('clickmaterialid'))
		{
			_this.parentCube.setupAssetLoader(item.clickmaterialid, AssetLoaderTypeEnum.TEXTURE, _this.clickTextureLoaded, null);
		}
	}
	
	
}

ARWaypoint.prototype.constructor = ARWaypoint;

ARWaypoint.prototype.getType = function(){
	return ObjectTypeEnum.WAYPOINT; 
}

ARWaypoint.prototype.getOrder = function(){
	return this.order; 
}

ARWaypoint.prototype.getBranch = function(){
	return this.branch; 
}

ARWaypoint.prototype.getInitialPosition = function(){	
	return this.initialStoredPosition;
}

ARWaypoint.prototype.getCurrentPosition = function(){	
	return this.initialStoredPosition;
}

ARWaypoint.prototype.getCurrentPositionX = function(){	
	return this.initialStoredPosition.x;
}

ARWaypoint.prototype.getCurrentPositionY = function(){	
	return this.initialStoredPosition.y;
}

ARWaypoint.prototype.getCurrentPositionZ = function(){	
	return this.initialStoredPosition.z;
}

ARWaypoint.prototype.getCurrentRotation = function(){	
	return this.initialStoredRotations[this.currentRotationState];
}

ARWaypoint.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.initialStoredRotations[this.currentRotationState].x);
}

ARWaypoint.prototype.getModelRadius = function(){	
	return this.modelRadius;
}

ARWaypoint.prototype.getCurrentRotationAngleY = function(){
	var result = THREE.Math.radToDeg(this.initialStoredRotations[this.currentRotationState].y);
	if (result == -180)
	{
		return -result;
	}
	else
	{
		return result;
	}

}

ARWaypoint.prototype.isJoin = function(){
	if (this.joinBranches.length > 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

ARWaypoint.prototype.isJoinFor = function(value){
	if (this.joinBranches.length > 0)
	{
		return this.joinBranches.includes(value);
	}
	else
	{
		return false;
	}
}



ARWaypoint.prototype.getRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.initialStoredRotations[this.currentRotationState].z);
}

ARWaypoint.prototype.switchRotationState = function(rotationstate){
	
	if (this.currentRotationState != rotationstate)
	{
		this.currentRotationState = rotationstate;
		if (this.initialStoredRotations.length > 1)
		{	
			if (this.isDisplayable)
			{
				this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
			}
		}
	}

}

ARWaypoint.prototype.setVisibility = function(value){

	if (this.isDisplayable)
	{
		this.waypointmodel.visible = value;
	}
}

ARWaypoint.prototype.getVisibility = function(){

	if (this.isDisplayable)
	{
		return this.waypointmodel.visible;
	}
	else
	{
		return false;
	}
}	


ARWaypoint.prototype.IsEnabled = function(){

	return this.isEnabled; 
}

ARWaypoint.prototype.setEnabled = function(value){

	if (this.isEnabled != value)
	{
		this.isEnabled = value; 
		if (this.isDisplayable)
		{
			this.waypointmodel.visible = this.isEnabled;
			this.parentStage.updateWaypoints();
		}
	}
}


ARWaypoint.prototype.switchState = function(value, rotationvalue){
	
	if ((this.currentState != value) && (this.currentState != WaypointButtonStateEnum.HIDDEN) && (this.isEnabled))
	{
		this.previousState = this.currentState;
		this.nextState = value;
		this.nextRotationState = rotationvalue;
		this.currentState = WaypointButtonStateEnum.TRANSITION;
		this.lerpValue = 0;
		this.transition = 0;
		this.transitionClock.start();
	}
}

ARWaypoint.prototype.getState = function(){
	
	return this.currentState;
}

ARWaypoint.prototype.initialiseState = function(value, rotationstate){
	
	this.nextState = null;
	this.previousState = null;
	this.lerpValue = 0;
	this.transition = 0;
	this.transitionClock.stop();
	if (this.currentState != WaypointButtonStateEnum.HIDDEN)
	{
		switch (value) {
		case WaypointButtonStateEnum.CURRENT:
			//console.log("waypt initialiseState WaypointButtonStateEnum.CURRENT");
			this.waypointmodel.visible = false;
			this.currentState = WaypointButtonStateEnum.CURRENT;
			this.defaultStoredState = WaypointButtonStateEnum.CURRENT;
			this.defaultColour.copy(this.enabledColour);
			this.defaultOpacity = this.enabledOpacity;
			this.defaultVisiblity = false;
			if (this.waypointmodel.visible != this.defaultVisiblity)
			{
				this.waypointmodel.visible = this.defaultVisiblity;
			}
			break;
		case WaypointButtonStateEnum.ACTIVE:
			//console.log("waypt initialiseState WaypointButtonStateEnum.ENABLED");
			this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
			this.currentState = WaypointButtonStateEnum.ACTIVE;
			this.defaultStoredState = WaypointButtonStateEnum.ACTIVE;
			if (this.initialStoredRotations.length > 1)
			{	
				this.currentRotationState = rotationstate;
				this.defaultRotationState = rotationstate;
				this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
			}
			this.defaultColour.copy(this.enabledColour);
			this.defaultOpacity = this.enabledOpacity;
			this.defaultVisiblity = true;
			if (this.waypointmodel.visible != this.defaultVisiblity)
			{
				this.waypointmodel.visible = this.defaultVisiblity;
			}
			break;	
		case WaypointButtonStateEnum.NOTACTIVE:
			//console.log("waypt initialiseState WaypointButtonStateEnum.DISABLED");
			/* if (!this.waypointmodel.visible)
			{
				this.waypointmodel.visible = true;
			} */
			
			this.changeMaterialColourOpacity(this.disabledColour.getHex(), this.disabledOpacity);
			this.currentState = WaypointButtonStateEnum.NOTACTIVE;
			this.defaultStoredState = WaypointButtonStateEnum.NOTACTIVE;
			if (this.initialStoredRotations.length > 1)
			{	
				this.currentRotationState = rotationstate;
				this.defaultRotationState = rotationstate;
				this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
			}
			this.defaultColour.copy(this.disabledColour);
			this.defaultOpacity = this.disabledOpacity;
			this.defaultVisiblity = this.isEnabled;
			if (this.waypointmodel.visible != this.defaultVisiblity)
			{
				this.waypointmodel.visible = this.defaultVisiblity;
			}
			break;
		}
	}
	
}


ARWaypoint.prototype.resetInitialState = function(){
	
	this.nextState = null;
	this.previousState = null;
	this.lerpValue = 0;
	this.transition = 0;
	this.transitionClock.stop();
	if (this.currentState != WaypointButtonStateEnum.HIDDEN)
	{
		this.isEnabled = this.storedEnabled;
		this.currentState = this.defaultStoredState;
		this.currentRotationState = this.defaultRotationState;
		this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
		this.changeMaterialColourOpacity(this.defaultColour.getHex(), this.defaultOpacity);
		this.waypointmodel.visible = this.defaultVisiblity;
		this.waypointmodel.scale.y = 1;
		this.switchTexture(false);
	}
	
}

ARWaypoint.prototype.update = function(){
	
	if (this.currentState == WaypointButtonStateEnum.TRANSITION)
	{
		switch (this.nextState) {
		case WaypointButtonStateEnum.CLICKED:
			//console.log("waypt update WaypointButtonStateEnum.CLICKED");
			switch (this.transition) {
			case 0:
				//this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
				this.switchTexture(true);
				this.transition = 1;
				break;
			case 1:
				if (this.lerpValue < 1) 
				{
					this.lerpedValues.length = 0;
					var C = [1];
					//var D = [0.05];
					var D = [0.15];
					this.lerpedValues = lerp(C, D, this.lerpValue);
					this.waypointmodel.scale.y = this.lerpedValues[0];
					this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
				}
				else
				{
					//this.waypointmodel.scale.y = 0.05;
					this.waypointmodel.scale.y = 0.15;
					this.transitionClock.stop();
					this.lerpValue = 0;
					this.transition = 2;
				}
				break;
			case 2:
				if (this.waypointmodel.visible == false)
				{
					this.switchTexture(false);
					this.currentState = WaypointButtonStateEnum.CURRENT;
					this.nextState = null;
				}
				break;
			}
			break;
 		case WaypointButtonStateEnum.ACTIVE:
			//console.log("waypt update WaypointButtonStateEnum.ENABLED");
			switch (this.previousState) {
			case WaypointButtonStateEnum.CURRENT:
				switch (this.transition) {
				case 0:
					this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
					this.waypointmodel.scale.y = 0.01;
					this.transition = 1;
					this.lerpValue = 0;
					this.currentRotationState = this.nextRotationState;
					if (this.initialStoredRotations.length > 1)
					{	
						this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
					}
					break;
				case 1:
					if (this.waypointmodel.visible)
					{
						this.transition = 2;
					}
					break;
				case 2:
					if (this.lerpValue < 1) 
					{
						this.lerpedValues.length = 0;
						var C = [0.01];
						var D = [1];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointmodel.scale.y = this.lerpedValues[0];
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.waypointmodel.scale.y = 1;
						this.transitionClock.stop();
						this.currentState = WaypointButtonStateEnum.ACTIVE;
						this.nextState = null;
						this.lerpValue = 0;
					}
					break;
				}
				break;
			case WaypointButtonStateEnum.NOTACTIVE:
				
				switch (this.transition) {
				case 0:
					this.changeMaterialColourOpacity(this.disabledColour.getHex(), this.disabledOpacity);
					this.waypointmodel.scale.y = 1.0;
					this.transition = 1;
					this.lerpValue = 0;
					break;
				case 1:
					if (this.lerpValue < 1) 
					{
						this.lerpedValues.length = 0;
						var C = [1];
						var D = [0.01];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointmodel.scale.y = this.lerpedValues[0];
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.waypointmodel.scale.y = 0.01;
						this.transitionClock.stop();
						this.lerpValue = 0;
						this.transition = 2;
					}
					break;
				case 2:
					this.waypointmodel.visible = false;
					this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
					this.currentRotationState = this.nextRotationState;
					if (this.initialStoredRotations.length > 1)
					{	
						this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
					}
					this.waypointmodel.visible = true;
					this.transitionClock.start();
					this.transition = 3;
					break;				
				case 3:
					if (this.lerpValue < 1) 
					{
						/* this.lerpedValues.length = 0;
						var C = [this.disabledColour.r, this.disabledColour.g, this.disabledColour.b , this.disabledOpacity];
						var D = [this.enabledColour.r, this.enabledColour.g, this.enabledColour.b , this.enabledOpacity];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.transitionColour.r = this.lerpValue[0];
						this.transitionColour.g = this.lerpValue[1];
						this.transitionColour.b = this.lerpValue[2];
						this.changeMaterialColourOpacity(this.transitionColour.getHex(), this.lerpValue[3]);
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed; */
						this.lerpedValues.length = 0;
						var C = [0.01];
						var D = [1];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointmodel.scale.y = this.lerpedValues[0];
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.waypointmodel.scale.y = 1.0;
						this.transitionClock.stop();
						//this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
						this.currentState = WaypointButtonStateEnum.ACTIVE;
						this.nextState = null;
						this.lerpValue = 0;
					}
					break;
				}
				break;
			}
			break;	
		case WaypointButtonStateEnum.NOTACTIVE:	
			//console.log("waypt update WaypointButtonStateEnum.DISABLED");
			switch (this.previousState) {
			case WaypointButtonStateEnum.ACTIVE:
				switch (this.transition) {
				case 0:
					//this.changeMaterialColourOpacity(this.enabledColour.getHex(), this.enabledOpacity);
					this.waypointmodel.scale.y = 1.0;
					this.transition = 1;
					break;
				case 1:
					if (this.lerpValue < 1) 
					{
						this.lerpedValues.length = 0;
						var C = [1];
						var D = [0.01];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointmodel.scale.y = this.lerpedValues[0];
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.waypointmodel.scale.y = 0.01;
						this.transitionClock.stop();
						this.lerpValue = 0;
						this.transition = 2;
					}
					break;
				case 2:
					this.waypointmodel.visible = false;
					this.changeMaterialColourOpacity(this.disabledColour.getHex(), this.disabledOpacity);
					this.currentRotationState = this.nextRotationState;
					if (this.initialStoredRotations.length > 1)
					{	
						this.waypointmodel.rotation.setFromVector3( this.initialStoredRotations[this.currentRotationState] );
					}
					this.waypointmodel.visible = true;
					this.transitionClock.start();
					this.transition = 3;
					break;	
				case 3:
					if (this.lerpValue < 1) 
					{
						this.lerpedValues.length = 0;
						var C = [0.01];
						var D = [1];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.waypointmodel.scale.y = this.lerpedValues[0];
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.waypointmodel.scale.y = 1.0;
						this.transitionClock.stop();
						this.currentState = WaypointButtonStateEnum.NOTACTIVE;
						this.nextState = null;
						this.lerpValue = 0;
					}
					break;


					
				/* case 1:
					if (this.lerpValue < 1) 
					{
						this.lerpedValues.length = 0;
						var C = [this.enabledColour.r, this.enabledColour.g, this.enabledColour.b , this.enabledOpacity];
						var D = [this.disabledColour.r, this.disabledColour.g, this.disabledColour.b , this.disabledOpacity];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.transitionColour.r = this.lerpValue[0];
						this.transitionColour.g = this.lerpValue[1];
						this.transitionColour.b = this.lerpValue[2];
						
						this.changeMaterialColourOpacity(this.transitionColour.getHex(), this.lerpValue[3]);
						this.lerpValue = this.transitionClock.getElapsedTime() / this.transitionSpeed;
					}
					else
					{
						this.transitionClock.stop();
						this.changeMaterialColourOpacity(this.disabledColour.getHex(), this.disabledOpacity);
						this.currentState = WaypointButtonStateEnum.DISABLED;
						this.nextState = null;
						this.lerpValue = 0;
					}
					break; */
				}
				break;
			}
			break; 
		}
	}
}


ARWaypoint.prototype.removeFromParent = function(){
	
	if (this.isDisplayable)
	{
		if (this.waypointmodel != null)
		{
			this.parentGroup.remove( this.waypointmodel );
		}
	}
}



ARWaypoint.prototype.dispose = function(){
	
	if (this.initialStoredRotations != null)
	{
		for (let i = 0; i < this.initialStoredRotations.length; i++)
		{
			this.initialStoredRotations[i] = null;
		}
		this.initialStoredRotations.length = 0;
	}
	
		if (this.defaultTexture != null)
	{
		this.defaultTexture.dispose();
		this.defaultTexture = null;
	}
	
	if (this.clickTexture != null)
	{
		this.clickTexture.dispose();
		this.clickTexture = null;
	}
	
	if (this.isDisplayable)
	{
		if (this.waypointmodel != null)
		{
			disposeObjectMesh(this.waypointmodel);
			this.waypointmodel = null;
		}
	}
	
	this.currentState = null;
	this.currentRotationState = null;
	this.UID = null;
	this.order = null;
	this.branch = null;
	this.initialStoredPosition = null;
	this.initialStoredRotation = null;
	this.parentCube = null;
	this.parentSide = null;
	this.parentStage = null;
}