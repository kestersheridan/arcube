ARParticleEmitter = function(item, parentside) {
	
	var _this = this;
	this.parentSide = parentside;
	//this.particleGroup = null;
	this.emitter = null;
	this.UID = null;
	this.initialStoredPositionValue = null; 
	this.initialPositionRadiusScale = null;
	this.initialStoredVelocityValue = null;
	this.initialStoredAccelerationValue = null;
	this.initialStoredSizeValues = null;
	this.currentPositionValue = new THREE.Vector3(0,0,0); 
	this.currentVelocityValue = new THREE.Vector3(0,0,0);
	this.currentAccelerationValue = new THREE.Vector3(0,0,0);
	this.currentRadiusScaleValue = new THREE.Vector3(0,0,0);
	this.currentSizeValues = null;
	this.initialActiveMultiplier = 1;
	this.storedEnabled = true;
	this.isEnabled = true;
	
	if (item.hasOwnProperty('uid'))
	{
		console.log("particle emitter set uid " + item.uid);
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.PARTICLEEMITTER);
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.isEnabled = item.enabled;
		this.storedEnabled = item.enabled;
	}
	
	this.setVectorValues = function(item, valuevector, spreadvector, distributiontype)
	{
		if (item.hasOwnProperty('value'))
		{
			
			var values = item.value.split(",");
			
			valuevector = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
			console.log("valuevector x" + valuevector.x + " y " + valuevector.y + " z " + valuevector.z);
		}
		if (item.hasOwnProperty('spread'))
		{
			console.log("spread " + item.spread);
			var values = item.spread.split(",");
			spreadvector = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.hasOwnProperty('distribution'))
		{
			console.log("distribution " + item.distribution);
			switch (item.distribution.toLowerCase()) {
			case 'sphere':
				distributiontype = SPE.distributions.SPHERE;
				break;
			case 'box':
				distributiontype = SPE.distributions.BOX;
				break;
			case 'disc':
				distributiontype = SPE.distributions.DISC;
				break;	
			}
		}
	}
	
	//set up values
	
	var positionSpread = null;
	var positionDistribution = null;
	var positionRadius = 10;
	
	var velocitySpread = null;
	var	velocityDistribution = null;
	var accelerationSpread = null;
	var accelerationDistribution = null;
	var rotationAxis = null;
	var rotationAxisSpread = null;
	var rotationAngle = 0;
	var particlecount = 100;
	var maxage = 2;
	
	var sizespreads = null;
	var opacityvalues = null;
	var opacityspreads = null;
	var wigglevalue = 0;
	var wigglespread = 0;
	var colourvalues = null;
	var colourspreads = null;
	 
	if (item.hasOwnProperty('maxage'))
	{
		maxage = item.maxage;
	}
	if (item.hasOwnProperty('position'))
	{
		if (item.position.hasOwnProperty('value'))
		{
			var values = item.position.value.split(",");
			this.initialStoredPositionValue = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
			this.currentPositionValue.copy(this.initialStoredPositionValue)
		}
		if (item.position.hasOwnProperty('spread'))
		{
			var values = item.position.spread.split(",");
			positionSpread = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.position.hasOwnProperty('distribution'))
		{
			switch (item.position.distribution.toLowerCase()) {
			case 'sphere':
				positionDistribution = SPE.distributions.SPHERE;
				break;
			case 'box':
				positionDistribution = SPE.distributions.BOX;
				break;
			case 'disc':
				positionDistribution = SPE.distributions.DISC;
				break;	
			}
		}
		if (item.position.hasOwnProperty('radius'))
		{
			positionRadius = item.position.radius;
		}
		if (item.position.hasOwnProperty('radiusscale'))
		{
			var values = item.position.radiusscale.split(",");
			this.initialPositionRadiusScale = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
			this.currentRadiusScaleValue.copy(this.initialPositionRadiusScale);
		}
	}
	if (item.hasOwnProperty('velocity'))
	{
		if (item.velocity.hasOwnProperty('value'))
		{
			var values = item.velocity.value.split(",");
			this.initialStoredVelocityValue = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
			this.currentVelocityValue.copy(this.initialStoredVelocityValue);
		}
		if (item.velocity.hasOwnProperty('spread'))
		{
			var values = item.velocity.spread.split(",");
			velocitySpread = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.velocity.hasOwnProperty('distribution'))
		{
			switch (item.velocity.distribution.toLowerCase()) {
			case 'sphere':
				velocityDistribution = SPE.distributions.SPHERE;
				break;
			case 'box':
				velocityDistribution = SPE.distributions.BOX;
				break;
			case 'disc':
				velocityDistribution = SPE.distributions.DISC;
				break;	
			}
		}
	}
	if (item.hasOwnProperty('acceleration'))
	{
		if (item.acceleration.hasOwnProperty('value'))
		{
			var values = item.acceleration.value.split(",");
			this.initialStoredAccelerationValue = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
			this.currentAccelerationValue.copy(this.initialStoredAccelerationValue);
		}
		if (item.acceleration.hasOwnProperty('spread'))
		{
			var values = item.acceleration.spread.split(",");
			accelerationSpread = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.acceleration.hasOwnProperty('distribution'))
		{
			switch (item.acceleration.distribution.toLowerCase()) {
			case 'sphere':
				accelerationDistribution = SPE.distributions.SPHERE;
				break;
			case 'box':
				accelerationDistribution = SPE.distributions.BOX;
				break;
			case 'disc':
				accelerationDistribution = SPE.distributions.DISC;
				break;	
			}
		}
	}
	if (item.hasOwnProperty('rotation'))
	{
		if (item.rotation.hasOwnProperty('axis'))
		{
			var values = item.rotation.axis.split(",");
			rotationAxis = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.rotation.hasOwnProperty('axisspread'))
		{
			var values = item.rotation.axisspread.split(",");
			rotationAxisSpread = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
		}
		if (item.rotation.hasOwnProperty('angle'))
		{
			rotationAngle = THREE.Math.degToRad(item.rotation.angle);
		}
	}
	if (item.hasOwnProperty('particlecount'))
	{
		particlecount = item.particlecount;
	}
	if (item.hasOwnProperty('size'))
	{
		if (item.size.hasOwnProperty('values'))
		{
			if (item.size.values.length > 0)
			{
				this.initialStoredSizeValues = new Array;
				for (let i = 0; i < item.size.values.length; i++)
				{
					var value = item.size.values[i].value;
					this.initialStoredSizeValues.push(value);

				}
				this.currentSizeValues = this.initialStoredSizeValues.slice();
			}
		}
		if (item.size.hasOwnProperty('spreads'))
		{
			if (item.size.spreads.length > 0)
			{
				sizespreads = new Array;
				for (let i = 0; i < item.size.spreads.length; i++)
				{
					var spread = item.size.spreads[i].spread;
					sizespreads.push(spread);
				}
			}
		}
	}
	if (item.hasOwnProperty('opacity'))
	{
		if (item.opacity.hasOwnProperty('values'))
		{
			if (item.opacity.values.length > 0)
			{
				opacityvalues = new Array;
				for (let i = 0; i < item.opacity.values.length; i++)
				{
					var value = item.opacity.values[i].value;
					opacityvalues.push(value);
				}
			}
		}
		if (item.opacity.hasOwnProperty('spreads'))
		{
			if (item.opacity.spreads.length > 0)
			{
				opacityspreads = new Array;
				for (let i = 0; i < item.opacity.spreads.length; i++)
				{
					var spread = item.opacity.spreads[i].spread;
					opacityspreads.push(spread);
				}
			}
		}
	}
	if (item.hasOwnProperty('wiggle'))
	{
		if (item.wiggle.hasOwnProperty('value'))
		{
			wigglevalue = item.wiggle.value;
		}
		if (item.wiggle.hasOwnProperty('spread'))
		{
			wigglespread = item.wiggle.spread;
		}
	}
	
	if (item.hasOwnProperty('colours'))
	{
		if (item.colours.hasOwnProperty('values'))
		{
			if (item.colours.values.length > 0)
			{
				colourvalues = new Array;
				for (let i = 0; i < item.colours.values.length; i++)
				{
					var values = item.colours.values[i].colour.split(",");
					if (values.length == 3)
					{
						var colour = new THREE.Color(Number(values[0]), Number(values[1]), Number(values[2]));
						colourvalues.push(colour);
					}
					else
					{
						var colour = new THREE.Color(item.colours.values[i].colour);
						colourvalues.push(colour);
					}
				}
			}
		}
		if (item.colours.hasOwnProperty('spreads'))
		{
			if (item.colours.spreads.length > 0)
			{
				colourspreads = new Array;
				for (let i = 0; i < item.colours.spreads.length; i++)
				{
					var values = item.colours.spreads[i].spread.split(",");
					var spread = new THREE.Vector3(Number(values[0]), Number(values[1]), Number(values[2]));
					colourspreads.push(spread);
				}
			}
		}
	}
	if (item.hasOwnProperty('activemultiplier'))
	{	
		this.initialActiveMultiplier = item.activemultiplier;
	}
	//console.log("positionDistribution " + positionDistribution + " positionSpread " + positionSpread + " positionradius " + positionradius);
	
	
	
	this.emitter = new SPE.Emitter({
		
		
/* 		particleCount: 750,
                maxAge: {
                    value: 3,
                },
                position: {
					distribution: SPE.distributions.SPHERE,
					
                    value: new THREE.Vector3( 0, -0.6, -0.3 ),
                    spread: new THREE.Vector3( 0.1, 0, 0.1 ),
					radius : 0.04
                }, */
		particleCount: particlecount,	
		maxAge: { value: maxage },
		position: {
			distribution: positionDistribution,
			value: this.currentPositionValue,
			spread: positionSpread,
			radius : positionRadius,
			radiusScale : this.currentRadiusScaleValue
		},
		velocity: {
			distribution: velocityDistribution,
            value: this.currentVelocityValue,
			spread: velocitySpread
        }, 
		acceleration: {
			distribution: accelerationDistribution,
            value: this.currentAccelerationValue,
			spread: accelerationSpread
		},
 		 rotation: {
			axis: rotationAxis,
			axisSpread: rotationAxisSpread,
			angle: rotationAngle
		},
		wiggle: {
			value : wigglevalue,
			spread: wigglespread
        },
        size: {
			value: this.currentSizeValues,
            spread: sizespreads
		},
		color: {
			value: colourvalues,
			spread : colourspreads
		},
		opacity: {
			value: opacityvalues
		},
		activeMultiplier: this.initialActiveMultiplier
		
		});
	

}




ARParticleEmitter.prototype.constructor = ARParticleEmitter;

ARParticleEmitter.prototype.initialise = function(){
	if (this.initialStoredPositionValue != null)
	{
		this.emitter.position.value = this.emitter.position.value.copy( this.initialStoredPositionValue );
		console.log("initialise this.initialStoredPositionValue x " + this.initialStoredPositionValue.x + " y " + this.initialStoredPositionValue.y + " z " + this.initialStoredPositionValue.z);
		console.log("initialise emitter x " + this.emitter.position.value.x + " y " + this.emitter.position.value.y + " z " + this.emitter.position.value.z);
	}
	if (this.initialStoredVelocityValue != null)
	{
		this.emitter.velocity.value = this.emitter.velocity.value.copy( this.initialStoredVelocityValue );
	}
	if (this.initialStoredAccelerationValue != null)
	{
		this.emitter.acceleration.value = this.emitter.acceleration.value.copy( this.initialStoredAccelerationValue );
	}
	if (this.initialPositionRadiusScale != null)
	{
		this.emitter.position.radiusScale = this.emitter.position.radiusScale.copy(this.initialPositionRadiusScale);
	}
	if (this.initialStoredSizeValues != null)
	{
		this.emitter.size.value = this.initialStoredSizeValues.slice();
	}
	this.currentPositionValue.copy(this.emitter.position.value); 
	this.currentVelocityValue.copy(this.emitter.velocity.value);
	this.currentAccelerationValue.copy(this.emitter.acceleration.value);
	this.currentRadiusScaleValue.copy(this.emitter.position.radiusScale);
	this.emitter.activeMultiplier = this.initialActiveMultiplier;
	this.currentSizeValues = this.emitter.size.value.slice();
	
	this.isEnabled = this.storedEnabled;
	if (this.isEnabled)
	{
		this.emitter.enable();
		this.emitter.reset();
	}
	else
	{
		this.emitter.disable();
	}
	
}

ARParticleEmitter.prototype.getEmitter = function(){
	
	return this.emitter;
}

ARParticleEmitter.prototype.getType = function(){
	
	return ObjectTypeEnum.PARTICLEEMITTER;
}

ARParticleEmitter.prototype.getCurrentPosition = function(){
	return this.emitter.position.value;
}

ARParticleEmitter.prototype.getCurrentPositionX = function(){
	return this.emitter.position.value.x;
}

ARParticleEmitter.prototype.getCurrentPositionY = function(){
	return this.emitter.position.value.y;
}

ARParticleEmitter.prototype.getCurrentPositionZ = function(){
	return this.emitter.position.value.z;
}

ARParticleEmitter.prototype.getCurrentVelocity = function(){
	return this.emitter.velocity.value;
}

ARParticleEmitter.prototype.getCurrentVelocityX = function(){
	return this.emitter.velocity.value.x;
}

ARParticleEmitter.prototype.getCurrentVelocityY = function(){
	return this.emitter.velocity.value.y;
}

ARParticleEmitter.prototype.getCurrentVelocityZ = function(){
	return this.emitter.velocity.value.z;
}

ARParticleEmitter.prototype.getActiveMultiplier = function(){
	return this.emitter.activeMultiplier;	
}

ARParticleEmitter.prototype.getCurrentAcceleration = function(){
	return this.emitter.acceleration.value;
}

ARParticleEmitter.prototype.getCurrentAccelerationX = function(){
	return this.emitter.acceleration.value.x;
}

ARParticleEmitter.prototype.getCurrentAccelerationY = function(){
	return this.emitter.acceleration.value.y;
}

ARParticleEmitter.prototype.getCurrentAccelerationZ = function(){
	return this.emitter.acceleration.value.z;
}

ARParticleEmitter.prototype.getCurrentRadiusScale = function(){
	return this.emitter.position.radiusScale;
}

ARParticleEmitter.prototype.getCurrentRadiusScaleX = function(){
	return this.emitter.position.radiusScale.x;
}

ARParticleEmitter.prototype.getCurrentRadiusScaleY = function(){
	return this.emitter.position.radiusScale.y;
}

ARParticleEmitter.prototype.getCurrentRadiusScaleZ = function(){
	return this.emitter.position.radiusScale.z;
}

ARParticleEmitter.prototype.getActiveMultiplier = function(){
	return this.emitter.activeMultiplier;	
}

ARParticleEmitter.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez){	
	if (valuex != null) { this.currentPositionValue.x = valuex;}
	if (valuey != null) { this.currentPositionValue.y = valuey;}
	if (valuez != null) { this.currentPositionValue.z = valuez;}
	this.emitter.position.value = this.emitter.position.value.copy(this.currentPositionValue); 
	
}

ARParticleEmitter.prototype.setCurrentVelocityXYZ = function(valuex, valuey, valuez){
	if (valuex != null) { this.currentVelocityValue.x = valuex;}
	if (valuey != null) { this.currentVelocityValue.y = valuey;}
	if (valuez != null) { this.currentVelocityValue.z = valuez;}
	this.emitter.velocity.value = this.emitter.velocity.value.copy(this.currentVelocityValue);

}

ARParticleEmitter.prototype.setCurrentAccelerationXYZ = function(valuex, valuey, valuez){
	if (valuex != null) { this.currentAccelerationValue.x = valuex;}
	if (valuey != null) { this.currentAccelerationValue.y = valuey;}
	if (valuez != null) { this.currentAccelerationValue.z = valuez;}
	this.emitter.acceleration.value = this.emitter.acceleration.value.copy(this.currentAccelerationValue);
	

}	

ARParticleEmitter.prototype.setCurrentRadiusScaleXYZ = function(valuex, valuey, valuez){
	if (valuex != null) { this.currentRadiusScaleValue.x = valuex;}
	if (valuey != null) { this.currentRadiusScaleValue.y = valuey;}
	if (valuez != null) { this.currentRadiusScaleValue.z = valuez;}
	this.emitter.position.radiusScale = this.emitter.position.radiusScale.copy(this.currentRadiusScaleValue);

}		

ARParticleEmitter.prototype.setActiveMultiplier = function(value){
	this.emitter.activeMultiplier = value;
}

ARParticleEmitter.prototype.setEnabled = function(value){
	if (this.isEnabled != value)
	{
		
		this.isEnabled = value;
		if (this.isEnabled)
		{
			console.log("set Partcile emitter enabled");
			this.emitter.enable();
		}
		else
		{
			console.log("set Partcile emitter disabled");
			this.emitter.disable();
		}
	}
}

ARParticleEmitter.prototype.dispose = function(){
	this.isEnabled = false;
	this.emitter.disable();
	this.UID = null;

}



ARParticleSystem = function(item, parentobject, parentcube, parentside, parentstage) {
	var _this = this;
 	
	this.parentObject = parentobject;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.parentCube = parentcube;
	this.emitterArray = new Array;
	this.particleGroup = null;
	this.particleTexture = null;
	this.enabled = false;
	this.clock = new THREE.Clock();
	
	
	
	this.textureLoaded = function (texture, entry)
	{
		_this.particleTexture = texture;
		
		var blendingtype = THREE.NormalBlending;
		if (entry.hasOwnProperty('blending'))
		{
			switch (entry.blending.toLowerCase()) {
			case 'additive':
				
				blendingtype = THREE.AdditiveBlending;
				break;
			case 'subtractive':
				blendingtype = THREE.SubtractiveBlending;
				break;
			case 'multiply':
				blendingtype = THREE.MultiplyBlending;
				break;	
			}
		}
		 _this.particleGroup = new SPE.Group({
			texture: {
				value: _this.particleTexture
			},
			blending: blendingtype
		});
		
		if (_this.emitterArray != null)
		{
			for (let i = 0; i < _this.emitterArray.length; i++)
			{
				_this.particleGroup.addEmitter(_this.emitterArray[i].getEmitter());
			}
		}
        _this.parentObject.getObject3D().add( _this.particleGroup.mesh ); 
	}
	
	if (item.hasOwnProperty('emitters'))
	{
		for (let i = 0; i < item.emitters.length; i++)
		{
			
			var emitter = new ARParticleEmitter(item.emitters[i].emitter, _this.parentSide);
			_this.emitterArray.push(emitter);
		}
	}
	
	if (item.hasOwnProperty('texture'))
	{
		var loader = new AjaxTextureLoader(g_loadingManager);
			loader.load( "assets/textures/" + item.texture, function( texture ) {	
			_this.textureLoaded(texture, item);
		});
	} 
	if (item.hasOwnProperty('textureid'))
	{
		_this.parentCube.setupAssetLoader(item.textureid, AssetLoaderTypeEnum.TEXTURE, this.textureLoaded, item);
	}
	
}

ARParticleSystem.prototype.constructor = ARParticleSystem;

ARParticleSystem.prototype.initialise = function(){
	
	for (let i = 0; i < this.emitterArray.length; i++)
	{
		
		this.emitterArray[i].initialise();
	}
	
}

ARParticleSystem.prototype.removeFromParent = function(){
	
	if (this.particleGroup.mesh != null)
	{
		this.parentObject.getObject3D().remove( this.particleGroup.mesh ); 
	}
}

ARParticleSystem.prototype.update = function(){
	
	this.particleGroup.tick( this.clock.getDelta() );
}



ARParticleSystem.prototype.dispose = function(){

	this.parentObject = null;
	this.parentSide = null;
	this.parentStage = null;
	this.parentCube = null;
	if (this.emitterArray != null)
	{
		for (let i = 0; i < this.emitterArray.length; i++)
		{
			this.emitterArray[i].dispose();
			this.emitterArray[i] = null;
		}
		this.emitterArray.length = 0;
		this.emitterArray = null;
	}
	
	this.enabled = false;
	this.clock = null;
	if (this.particleGroup.mesh != null)
	{
		disposeObjectMesh(this.particleGroup.mesh);
	}
	this.particleGroup = null;
	if (this.particleTexture != null)
	{
		this.particleTexture.dispose();
		this.particleTexture = null;
	}

}


