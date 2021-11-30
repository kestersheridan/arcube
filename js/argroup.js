ARGroup = function(item, parentobject, parentcube, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.moveClock = new THREE.Clock(false);
	this.userData = null;
	this.classUID = null;
	this.parentObject = parentobject;
	this.isTopNode = true;
	this.storedVisible = true;
	this.parentNode = null;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.parentCube = parentcube;
	if (this.parentObject.getType() == ObjectTypeEnum.GROUP)
	{
		this.parentNode = this.parentObject;
	}
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialStoredRotation = new THREE.Vector3(0, 0, 0);
	this.currentPosition = new THREE.Vector3(0, 0, 0);
	this.pendingTranslation = new THREE.Vector3(0, 0, 0);
	this.targetPosition = new THREE.Vector3(0, 0, 0);
	this.isTargetPositionPending = false;
	this.moveSpeed = 1;
	this.currentWorldPosition = new THREE.Vector3(0, 0, 0);
	this.currentRotation = new THREE.Vector3(0, 0, 0);
	this.maxPosition = null; 
	this.minPosition = null;
	this.objectGroup = new THREE.Group();
	
	this.childModels = new Array;
	this.childAddedRuntimeModels = new Array;
	this.childParticleSystems = new Array;
	this.childGroups = new Array;
	this.childLights = new Array;
	this.audioClipsArray = new Array;
	this.dynamicVolumeObjects = new Array;
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.GROUP);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	
	if (item.hasOwnProperty('visible'))
	{
		this.storedVisible = item.visible;
	}
	this.objectGroup.visible = this.storedVisible;
	if (item.hasOwnProperty('rotx'))
	{
		this.initialStoredRotation.x = THREE.Math.degToRad(item.rotx);
	}
	if (item.hasOwnProperty('roty'))
	{
		this.initialStoredRotation.y = THREE.Math.degToRad(item.roty);
	}
	if (item.hasOwnProperty('rotz'))
	{
		this.initialStoredRotation.z = THREE.Math.degToRad(item.rotz);
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
	//this.objectGroup.position.copy( this.initialStoredPosition );
	//this.objectGroup.rotation.setFromVector3( this.initialStoredRotation );
	
	
	if (item.hasOwnProperty('minpos'))
	{	
		this.minPosition = new THREE.Vector3(0, 0, 0);
		if (item.minpos.hasOwnProperty('x'))
		{
			this.minPosition.x = item.minpos.x;
		}
		if (item.minpos.hasOwnProperty('y'))
		{
			this.minPosition.y = item.minpos.y;
		}
		if (item.minpos.hasOwnProperty('z'))
		{
			this.minPosition.z = item.minpos.z;
		}
	}	
	
	if (item.hasOwnProperty('maxpos'))
	{
		this.maxPosition = new THREE.Vector3(0, 0, 0);
		if (item.maxpos.hasOwnProperty('x'))
		{
			this.maxPosition.x = item.maxpos.x;
		}
		if (item.maxpos.hasOwnProperty('y'))
		{
			this.maxPosition.y = item.maxpos.y;
		}
		if (item.maxpos.hasOwnProperty('z'))
		{
			this.maxPosition.z = item.maxpos.z;
		}
	}
	
	if (item.hasOwnProperty('models'))
	{
		if (item.models.length > 0)
		{
			for (let i = 0; i < item.models.length; i++)
			{
				var model = new ARModel(item.models[i], _this, parentcube, this.parentSide, this.parentStage);
				this.childModels.push(model);
			}
			
		}
	}
	
	if (item.hasOwnProperty('groups'))
	{
		if (item.groups.length > 0)
		{
			for (let i = 0; i < item.groups.length; i++)
			{
				var group = new ARGroup(item.groups[i].group, _this, parentcube, this.parentSide, this.parentStage);
				this.childGroups.push(group);
			}
		}
	}
	
	if (item.hasOwnProperty('particles'))
	{
		if (item.particles.length > 0)
		{
			for (let i = 0; i < item.particles.length; i++)
			{
				if (g_enableParticleSystem)
				{
					var particle = new ARParticleSystem(item.particles[i].particle, _this, parentcube, this.parentSide, this.parentStage);
					this.childParticleSystems.push(particle);
				}
			}
		}
	}
	
	if (item.hasOwnProperty('audioclips'))
	{
		if (item.audioclips.length > 0)
		{
			for (let i = 0; i < item.audioclips.length; i++)
			{
				if (item.audioclips[i].hasOwnProperty('audioclip'))
				{
					var audioclip = new ARAudio(item.audioclips[i].audioclip, this.parentSide);
					this.audioClipsArray.push(audioclip);
					if (audioclip.isDynamicVolume())
					{
						this.dynamicVolumeObjects.push(audioclip);
					}
				}
			}
		}
	}
	
	
	if (item.hasOwnProperty('lights'))
	{
		if (item.lights.length > 0)
		{
			for (let i = 0; i < item.lights.length; i++)
			{
				var light = new ARLight(item.lights[i], _this, parentcube, this.parentSide, this.parentStage);
				this.childLights.push(light);
			}
			
		}
	}
	
	if (item.hasOwnProperty('physics'))
	{
		this.physicsObject = new ARPhysicsObject(item.physics, _this, this.parentCube, this.parentSide, this.parentStage, this.UID, null, null, this.initialStoredPosition, this.initialStoredRotation);
		if ((this.childModels.length > 0) && (this.parentObject.getType() == ObjectTypeEnum.STAGE) && (this.physicsObject.cubeControlled()) && (this.physicsObject.getEnabled()))
		{
			this.parentObject.getPhysicsObject3D().add(this.objectGroup);
		}
		else
		{
			this.parentObject.getObject3D().add(this.objectGroup);
		}
	}
	else
	{
		this.parentObject.getObject3D().add(this.objectGroup);
	}
}


ARGroup.prototype.constructor = ARGroup;


ARGroup.prototype.initialise = function(){
	this.moveClock.start();
	this.isTargetPositionPending = false;
	this.pendingTranslation.set(0,0,0);
	this.targetPosition.set(0,0,0);

	this.objectGroup.position.copy( this.initialStoredPosition );
	this.objectGroup.rotation.setFromVector3( this.initialStoredRotation );
	this.objectGroup.visible = this.storedVisible;
	this.currentPosition.copy(this.initialStoredPosition);
	this.currentRotation.copy(this.initialStoredRotation);
	if (this.childAddedRuntimeModels != null)
	{
		for (let i = 0; i < this.childAddedRuntimeModels.length; i++)
		{
			this.childAddedRuntimeModels[i][0].add(this.childAddedRuntimeModels[i][1]);
			this.childAddedRuntimeModels[i][0] = null;
			this.childAddedRuntimeModels[i][1] = null;
		}
		this.childAddedRuntimeModels.length = 0;
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			this.childGroups[i].initialise();
		}
	}
	
	if (this.childModels != null)
	{
		for (let i = 0; i < this.childModels.length; i++)
		{
			this.childModels[i].initialise();
		}
	}
	
	if (this.childLights != null)
	{
		for (let i = 0; i < this.childLights.length; i++)
		{
			this.childLights[i].initialise();
		}
	}
	
	if (this.childParticleSystems != null)
	{
		for (let i = 0; i < this.childParticleSystems.length; i++)
		{
			this.childParticleSystems[i].initialise();
		}
	}
	
}

ARGroup.prototype.addObject3D = function(objectvalue){

	var entry = [objectvalue.getParentObject().getObject3D(), objectvalue.getObject3D()];
	this.childAddedRuntimeModels.push(entry);
	this.objectGroup.attach(objectvalue.getObject3D());
}

ARGroup.prototype.getVisibilty = function(){	
	return this.objectGroup.visible;
}

ARGroup.prototype.setVisibilty = function(value){	
	this.objectGroup.visible = value;
}

ARGroup.prototype.getType = function(){	
	return ObjectTypeEnum.GROUP;
}

ARGroup.prototype.getUID = function(){	
	return this.UID;
}

ARGroup.prototype.getUserData = function(){	
	return this.userData;
}

ARGroup.prototype.getObject3D = function(){	
	return this.objectGroup;
}

ARGroup.prototype.getParentObject = function(){
	return this.parentObject;
}

ARGroup.prototype.getCurrentPositionX = function(){	
	return this.currentPosition.x;
}

ARGroup.prototype.getCurrentPositionY = function(){	
	return this.currentPosition.y;
}

ARGroup.prototype.getCurrentPositionZ = function(){	
	return this.currentPosition.z;
}

ARGroup.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.currentRotation.x);
}

ARGroup.prototype.getCurrentRotationAngleY = function(){	
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

ARGroup.prototype.getCurrentRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.currentRotation.z);
}

ARGroup.prototype.setCurrentRotationAngleX = function(value, fromPhysics = false){
	this.currentRotation.x = THREE.Math.degToRad(value);	
	this.objectGroup.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
	}
}

ARGroup.prototype.setCurrentRotationAngleY = function(value, fromPhysics = false){	
	this.currentRotation.y = THREE.Math.degToRad(value);	
	this.objectGroup.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
	}
}

ARGroup.prototype.setCurrentRotationAngleZ = function(value, fromPhysics = false){	
	this.currentRotation.z = THREE.Math.degToRad(value);	
	this.objectGroup.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
	}
}

ARGroup.prototype.getCurrentPosition = function(){	
	return this.currentPosition;
}

ARGroup.prototype.setCurrentPosition = function(value, fromPhysics = false){	
	this.currentPosition.copy(value);
	this.objectGroup.position.copy( this.currentPosition );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
	this.isTargetPositionPending = false;	
}

ARGroup.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez, fromPhysics = false){	
	if (valuex != null) { this.currentPosition.x = valuex;}
	if (valuey != null) { this.currentPosition.y = valuey;}
	if (valuez != null) { this.currentPosition.z = valuez;}
	this.objectGroup.position.copy( this.currentPosition );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
	this.isTargetPositionPending = false;	
}

ARGroup.prototype.setCurrentRotation = function(value, fromPhysics = false){	
	this.currentRotation.copy(value);
	this.objectGroup.rotation.setFromVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
	}
}

ARGroup.prototype.getCurrentQuaternion = function()
{
	return this.objectGroup.quaternion;
}

ARGroup.prototype.setCurrentQuaternion = function(value, fromPhysics = false){	
	this.objectGroup.quaternion.set( value.x(), value.y(), value.z(), value.w() );
	this.objectGroup.rotation.toVector3( this.currentRotation );
	if ((this.physicsPresent) && (!fromPhysics))
	{
		
		
	}
}

ARGroup.prototype.getCurrentRotation = function(){	
	return this.currentRotation;
}

ARGroup.prototype.GetCumulativeStoredPosY = function(){
	var cumulativeStoredPosY = this.initialStoredPosition.y;
	if (!this.isTopNode)
	{
		cumulativeStoredPosY = this.initialStoredPosition.y + this.parentNode.GetCumulativeStoredPosY();
	}
	return cumulativeStoredPosY;
}

ARGroup.prototype.GetCumulativeStoredPosZ = function(){
	var cumulativeStoredPosZ = this.initialStoredPosition.z;
	if (!this.isTopNode)
	{
		cumulativeStoredPosZ = this.initialStoredPosition.z + this.parentNode.GetCumulativeStoredPosZ();
	}
	return cumulativeStoredPosZ;
}

ARGroup.prototype.cancelTranslation = function(){
	this.isTargetPositionPending = false;
	
}

ARGroup.prototype.translateObject = function(value, speed = null){
	
	
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

ARGroup.prototype.calcMaxBoundingBoxHeight = function(){	
	
	var maxHeight = 0;

	if (this.childModels != null)
	{
		for (let i = 0; i < this.childModels.length; i++)
		{
			
			var boundingBoxHeight;
			if (this.isTopNode)
			{
				boundingBoxHeight = this.childModels[i].calcBoundingBoxHeight() + this.initialStoredPosition.y;
			}
			else
			{	
				boundingBoxHeight = this.childModels[i].calcBoundingBoxHeight() + this.parentNode.GetCumulativeStoredPosY();
			}
			if (boundingBoxHeight > maxHeight)
			{
				maxHeight = boundingBoxHeight;
			}
		}
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			var boundingBoxHeight = this.childGroups[i].calcMaxBoundingBoxHeight();
			if (boundingBoxHeight > maxHeight)
			{
				maxHeight = boundingBoxHeight;
			}
		}
	}
	return maxHeight;

}


ARGroup.prototype.calcMaxBoundingBoxMinMaxPosZ = function(){	
	
	var minmaxPosZ = [0, 0];

	if (this.childModels != null)
	{
		for (let i = 0; i < this.childModels.length; i++)
		{
			
			var boundingBoxMaxPosZ;
			var boundingBoxMinPosZ;
			if (this.isTopNode)
			{
				boundingBoxMinPosZ = (this.childModels[i].calcBoundingBoxMinMaxPosZ())[0] + this.initialStoredPosition.z;
				boundingBoxMaxPosZ = (this.childModels[i].calcBoundingBoxMinMaxPosZ())[1] + this.initialStoredPosition.z;
			}
			else
			{
				boundingBoxMinPosZ = (this.childModels[i].calcBoundingBoxMaxPosZ())[0] + this.parentNode.GetCumulativeStoredPosZ();				
				boundingBoxMaxPosZ = (this.childModels[i].calcBoundingBoxMaxPosZ())[1] + this.parentNode.GetCumulativeStoredPosZ();
			}
			if (boundingBoxMaxPosZ > minmaxPosZ[1])
			{
				minmaxPosZ[1] = boundingBoxMaxPosZ;
			}
			if (boundingBoxMinPosZ < minmaxPosZ[0])
			{
				minmaxPosZ[0] = boundingBoxMinPosZ;
			}
		}
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			//var boundingBoxPosZ = this.childGroups[i].calcBoundingBoxMinMaxPosZ();
			var boundingBoxPosZ = this.childGroups[i].calcMaxBoundingBoxMinMaxPosZ();
			if (boundingBoxPosZ[1] > minmaxPosZ[1])
			{
				minmaxPosZ[1] = boundingBoxPosZ[1];
			}
			if (boundingBoxPosZ[0] < minmaxPosZ[0])
			{
				minmaxPosZ[0] = boundingBoxPosZ[0];
			}
		}
	}
	return minmaxPosZ;

}

ARGroup.prototype.update = function(){
	var _this = this;
	let delta = this.moveClock.getDelta();
	if (this.isTargetPositionPending)
	{
		moveObject(delta);
		
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			this.childGroups[i].update();
		}
	}
	
	if (this.childModels != null)
	{
		for (let i = 0; i < this.childModels.length; i++)
		{
			this.childModels[i].update();
		}
	}

	if (this.childParticleSystems != null)
	{
		for (let i = 0; i < this.childParticleSystems.length; i++)
		{
			this.childParticleSystems[i].update();
		}
		
	}
	
	if (this.dynamicVolumeObjects.length > 0)
	{
		this.objectGroup.getWorldPosition(this.currentWorldPosition);
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
		/* let distance = _this.currentPosition.distanceTo(_this.targetPosition);
		_this.pendingTranslation.x = ((_this.targetPosition.x - _this.currentPosition.x) / distance) * (_this.speed * delta);
		_this.pendingTranslation.y = ((_this.targetPosition.y - _this.currentPosition.y) / distance) * (_this.speed * delta);
		_this.pendingTranslation.z = ((_this.targetPosition.z - _this.currentPosition.z) / distance) * (_this.speed * delta);
		_this.pendingTranslation.add(_this.currentPosition);
		distance = _this.pendingTranslation.distanceTo(_this.targetPosition);
		if (distance < 0.003)
		{
			_this.pendingTranslation.copy(_this.targetPosition);
			_this.isTargetPositionPending = false;
		} */
		_this.currentPosition.copy(_this.pendingTranslation);
		_this.objectGroup.position.copy( _this.currentPosition );	
		_this.pendingTranslation.set(0, 0, 0);		
	}
}

ARGroup.prototype.removeFromParent = function(){
	
	
	if (this.childModels != null)
	{
		for (let i = 0; i < this.childModels.length; i++)
		{
			this.childModels[i].removeFromParent();
		}
	}
	
	if (this.childLights != null)
	{
		for (let i = 0; i < this.childLights.length; i++)
		{
			this.childLights[i].removeFromParent();
		}
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			this.childGroups[i].removeFromParent();
		}
	}
	
	if (this.childParticleSystems != null)
	{
		for (let i = 0; i < this.childParticleSystems.length; i++)
		{
			this.childParticleSystems[i].removeFromParent();
		}
	}
	
	if (this.childAddedRuntimeModels != null)
	{
		for (let i = 0; i < this.childAddedRuntimeModels.length; i++)
		{
			this.objectGroup.remove(this.childAddedRuntimeModels[i][1]);
		}
	}
	this.parentObject.getObject3D().remove(this.objectGroup);
}


ARGroup.prototype.dispose = function(){
	
	if (this.childModels != null)
	{

		for (let i = 0; i < this.childModels.length; i++)
		{
			this.childModels[i].dispose();
			this.childModels[i] = null;
		}
		this.childModels.length = 0;
	}
	
	if (this.childLights != null)
	{

		for (let i = 0; i < this.childLights.length; i++)
		{
			this.childLights[i].dispose();
			this.childLights[i] = null;
		}
		this.childLights.length = 0;
	}
	
	if (this.childGroups != null)
	{
		for (let i = 0; i < this.childGroups.length; i++)
		{
			this.childGroups[i].dispose();
			this.childGroups[i] = null;
		}
		this.childGroups.length = 0;
	}
	
	if (this.childParticleSystems != null)
	{
		for (let i = 0; i < this.childParticleSystems.length; i++)
		{
			this.childParticleSystems[i].dispose();
			this.childParticleSystems[i] = null;
		}
		this.childParticleSystems.length = 0;
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
	
	if (this.physicsObject != null)
	{
		this.physicsObject.dispose();
		this.physicsObject = null;
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
	
	if (this.childAddedRuntimeModels != null)
	{
		for (let i = 0; i < this.childAddedRuntimeModels.length; i++)
		{
			this.childAddedRuntimeModels[i][0] = null;
			this.childAddedRuntimeModels[i][1] = null;
		}
		this.childAddedRuntimeModels.length = 0;
		this.childAddedRuntimeModels = null;
	}
	if (this.moveClock.running)
	{
		this.moveClock.stop();
	}
	this.moveClock = null;
	this.UID = null;
	this.userData = null;
	this.parentObject = null;
	this.isTopNode = null;
	this.storedVisible = null;
	this.parentNode = null;
	this.parentSide = null;
	this.parentStage = null;
	this.parentNode = null;
	this.initialStoredPosition = null;
	this.initialStoredRotation = null;
	this.currentPosition = null;
	this.targetPosition = null;
	this.pendingTranslation = null;
	this.currentWorldPosition = null;
	this.currentRotation = null;
	this.objectGroup = null;
}