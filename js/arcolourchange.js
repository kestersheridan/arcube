const ColourChangeTypeEnum = {
	ONOFF : 0,
	ON : 1
}

const MeshLableTypeEnum = {
	STATIC : 0,
	SIDESCROLLER : 1
}

const LightTypeEnum = {
	POINT : 0,
	SPOTLIGHT : 1
}

ARColourChange = function(item, parentside, parentstage) {
 	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.nodeName = null;
	this.isEnabled = false;
	this.storedEnabled = false;
	this.colourChangeType = ColourChangeTypeEnum.ON;
	this.colourChangerTimer = new THREE.Clock();
	this.defaultStoredColour = new THREE.Color();
	this.useDefaultOffColour = true;
	this.onColour = new THREE.Color();
	this.offColour = new THREE.Color();
	this.duration = 2;
	this.isOnColour = false;
	this.meshMaterial = null;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.COLOURCHANGE);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	
	if (item.hasOwnProperty('nodename'))
	{
		this.nodeName = item.nodename;
	}
	
	if (item.hasOwnProperty('oncolour'))
	{
		this.onColour.set(item.oncolour);
	}
	
	if (item.hasOwnProperty('offcolour'))
	{
		this.offColour.set(item.offcolour);
		this.useDefaultOffColour = false;
	}
	
	if (item.hasOwnProperty('duration'))
	{
		this.duration = item.duration;
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.isEnabled = item.enabled;
		this.storedEnabled = this.isEnabled; 
	}
	
	if (item.hasOwnProperty('type'))
	{
		if (item.type.toLowerCase() == "onoff")
		{
			this.colourChangeType = ColourChangeTypeEnum.ONOFF;
		}
	}
}

ARColourChange.prototype.constructor = ARColourChange;

ARColourChange.prototype.getNodeName = function(){
	return this.nodeName;
}

ARColourChange.prototype.getType = function(){
	return ObjectTypeEnum.COLOURCHANGE;
}

ARColourChange.prototype.getUID = function(){	
	return this.UID;
}

ARColourChange.prototype.getUserData = function(){	
	return this.userData
}

ARColourChange.prototype.setup = function(mesh){
	this.meshMaterial = mesh.material;
	if (this.useDefaultOffColour)
	{
		this.offColour.setHex(this.meshMaterial.color.getHex());
	}
	
	if (this.isEnabled)
	{
		this.meshMaterial.color.setHex( this.onColour.getHex() );
		this.defaultStoredColour.copy(this.onColour);
	}
	else
	{
		this.meshMaterial.color.setHex( this.offColour.getHex() );
		this.defaultStoredColour.copy(this.offColour);
	}
	

}

ARColourChange.prototype.initialise = function(){
	this.isEnabled = this.storedEnabled;
	this.meshMaterial.color.setHex( this.defaultStoredColour.getHex() );
	
}

ARColourChange.prototype.update = function(){
	if (this.colourChangeType == ColourChangeTypeEnum.ONOFF)
	{
		if (this.isEnabled)
		{
			if (this.colourChangerTimer.getElapsedTime() > this.duration)
			{
				if (this.isOnColour)
				{

					this.isOnColour = false;
					this.meshMaterial.color.setHex( this.offColour.getHex() );
				}
				else
				{

					this.meshMaterial.color.setHex( this.onColour.getHex() );
					this.isOnColour = true;
				}
				this.colourChangerTimer.start();
			}
			
		}
	}
	
}

ARColourChange.prototype.setEnabled = function(value){
	if (this.isEnabled != value)
	{
		this.isEnabled = value;
		switch (this.colourChangeType) {
		case ColourChangeTypeEnum.ON:
			if (this.isEnabled)
			{
				this.meshMaterial.color.setHex( this.onColour.getHex() );
			}
			else
			{
				this.meshMaterial.color.setHex( this.offColour.getHex() );
			}
			break;
		case ColourChangeTypeEnum.ONFF:
			if (this.isEnabled)
			{

				this.colourChangerTimer.start();
				this.meshMaterial.color.setHex( this.offColour.getHex() );
				this.isOnColour = false;
			}
			else
			{
				this.colourChangerTimer.stop();
				this.meshMaterial.color.setHex( this.offColour.getHex() );
			}
			break;	
		}
	}	
}

ARColourChange.prototype.dispose = function(){
	this.UID = null;
	this.classUID = null;
	this.parentSide = null;
	this.parentStage = null;
	this.nodeName = null;
	this.meshMaterial.dispose();
	this.meshMaterial = null;
	this.colourChangeType = null;
	this.colourChangerTimer.stop();
	this.colourChangerTimer = null;
	this.defaultStoredColour = null;
	this.useDefaultOffColour = null;
	this.onColour = null;
	this.offColour = null;
}



ARMeshLabel = function(item, parentside, parentstage) {
 	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.nodeName = null;
	this.labelContext = null;
	this.textContext = null;
	this.backgroundColour = "#ffffff";
	this.labelText = "";
	this.leftScrollText = "";
	this.rightScrollText = "";
	this.initialisedStoredText = "";
	this.currentLabelText = "";
	this.pendingLabelText = "";
	this.pendingCanvasCounter = 0;
	this.pendingCanvasWidth = 0;
	this.scrollPointer = 0;
	this.labelFont = "bold 20px Arial";
	this.labelFontColour = "#000000";
	this.labelTextPosX = 10;
	this.labelTextPosY = 10;
	this.lineHeight = 100;
	this.textAlignment = "left";
	this.textAnchor = "top";
	this.maxWidth = 400;
	this.labelType = MeshLableTypeEnum.STATIC;
	this.scrollSpeed = 1;
	this.textContext2 = null;
	this.textCanvasWidth = 1024;
	this.textCanvasHeight = 1024;
	this.textCanvasSegmentPosX = 0;
	this.textCanvasSegmentWidth = 0;
	this.textCanvasSegmentPosY = 0;
	this.textCanvasSegmentHeight = 0;
	this.lerpValue = 0;
	this.transition = 0;
	this.startOnOpening = false;
	this.isEnabled = false;
	this.lerpedValues  = new Array;
	this.scrollClock = new THREE.Clock();
	this.labelCanvasWidth = 0;
	this.contextPointer1 = null;
	this.contextPointer2 = null;
	this.pointer1 = 1;
	this.pointer2 = 2;
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.MESHLABEL);
	}
	if (item.hasOwnProperty('type'))
	{
		switch (item.type.toLowerCase()) {
		case "static":
			this.labelType = MeshLableTypeEnum.STATIC;
			break;
		case "sidescroll":
		case "sidescroller":
			this.labelType = MeshLableTypeEnum.SIDESCROLLER;
			if (item.hasOwnProperty('speed'))
			{
				this.scrollSpeed = item.speed;
			}
			break;
		}
	}
	if (item.hasOwnProperty('startonopening'))
	{
		this.startOnOpening = item.startonopening;
	}

	if (item.hasOwnProperty('width'))
	{
		this.textCanvasWidth = item.width;
	}
	if (item.hasOwnProperty('height')) this.textCanvasHeight = item.height;
	if (item.hasOwnProperty('x'))  this.labelTextPosX = item.x;
	if (item.hasOwnProperty('y')) this.labelTextPosY = item.y;
	if (item.hasOwnProperty('lineheight'))	this.lineHeight = item.lineheight;
	if (item.hasOwnProperty('font')) this.labelFont = item.font;
	if (item.hasOwnProperty('fontcolour')) this.labelFontColour = item.fontcolour;
	if (item.hasOwnProperty('alignment')) this.textAlignment = item.alignment;
	if (item.hasOwnProperty('anchor')) this.textAnchor = item.anchor;
	if (item.hasOwnProperty('text')) this.initialisedStoredText = item.text;
	if (item.hasOwnProperty('userdata')) this.userData = item.userdata;
	if (item.hasOwnProperty('bkgcolour')) this.backgroundColour = item.bkgcolour;
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	if (item.hasOwnProperty('nodename')) this.nodeName = item.nodename;
	
	this.textContext = document.createElement('canvas').getContext('2d');
	this.textContext.font = this.labelFont;
	this.maxWidth = this.textContext.measureText(this.initialisedStoredText).width;
	this.textContext.canvas.width = this.maxWidth + this.labelTextPosX;
	this.textContext.canvas.height = this.textCanvasHeight;
	this.labelContext = document.createElement('canvas').getContext('2d');
	switch (this.labelType) {
	case MeshLableTypeEnum.STATIC:
		this.labelContext.canvas.width = nearestPowerOf2(this.textCanvasWidth);
		this.labelCanvasWidth = this.labelContext.canvas.width;
		this.labelContext.canvas.height = nearestPowerOf2(this.textCanvasHeight);
		break;
	case MeshLableTypeEnum.SIDESCROLLER:
		this.textContext2 = document.createElement('canvas').getContext('2d');
		this.textContext2.canvas.width = this.textContext.canvas.width;
		this.textContext2.canvas.height = this.textContext.canvas.height;
		this.labelContext.canvas.width = nearestPowerOf2((this.textCanvasWidth));
		this.labelContext.canvas.height = nearestPowerOf2(this.textCanvasHeight);
		this.labelCanvasWidth = this.labelContext.canvas.width;
		break;
	}	
	this.labeltexture = new THREE.CanvasTexture(this.labelContext.canvas);
	


 
	
}

ARMeshLabel.prototype.constructor = ARMeshLabel;



ARMeshLabel.prototype.initialise = function(){
	this.labelText = "";
	this.pendingLabelText = "";
	this.pendingCanvasCounter = 0;
	this.currentLabelText = this.initialisedStoredText;
	switch (this.labelType) {
	case MeshLableTypeEnum.STATIC:
		if ((this.characterLength != null) && (this.currentLabelText.length > this.characterLength))
		{
			this.labelText += this.currentLabelText.substring(0, this.characterLength);
		}
		else
		{
			this.labelText += this.currentLabelText;	
		}
		this.textCanvasSegmentPosX = 0;
		this.textCanvasSegmentWidth = this.textContext.canvas.width;
		this.textCanvasSegmentPosY = 0;
		this.textCanvasSegmentHeight = this.textContext.canvas.height;
		break;
	case MeshLableTypeEnum.SIDESCROLLER:
		this.textCanvasSegmentPosX = 0;
		this.textCanvasSegmentWidth = this.textCanvasWidth;
		this.textCanvasSegmentPosY = 0;
		this.textCanvasSegmentHeight = this.textContext.canvas.height;
		this.labelText = "";
		this.labelText += this.currentLabelText;
		this.textContext.font = this.labelFont;
		this.maxWidth = this.textContext.measureText(this.initialisedStoredText).width;
		this.textContext.canvas.width = this.maxWidth + this.labelTextPosX;
		this.textContext.canvas.height = this.textCanvasHeight;
		this.textContext2.canvas.width = this.maxWidth + this.labelTextPosX;
		this.textContext2.canvas.height = this.textCanvasHeight;
		this.textContext2.fillStyle = this.backgroundColour;
		this.textContext2.fillRect(0, 0, this.textContext2.canvas.width, this.textContext2.canvas.height);
		wrapTextAlignwithFontsColours(this.textContext2, this.labelText, this.labelFontColour, this.labelFontColour, this.labelTextPosX, this.labelTextPosY, this.maxWidth, this.lineHeight, this.lineHeight, this.labelFont, this.labelFont, this.textAlignment, this.textAnchor); 		
		this.lerpValue = 0;
		this.transition = 0;
		this.contextPointer1 = this.textContext;
		this.contextPointer2 = this.textContext2;
		this.pointer1 = 1;
		this.pointer2 = 2;
		if (this.startOnOpening)
		{
			this.scrollClock.start();
			this.isEnabled = true;			
		}
		else
		{
			this.isEnabled = false;
		}
		break;
	}
	this.textContext.fillStyle = this.backgroundColour;
	this.textContext.fillRect(0, 0, this.textContext.canvas.width, this.textContext.canvas.height);
	wrapTextAlignwithFontsColours(this.textContext, this.labelText, this.labelFontColour, this.labelFontColour, this.labelTextPosX, this.labelTextPosY, this.maxWidth, this.lineHeight, this.lineHeight, this.labelFont, this.labelFont, this.textAlignment, this.textAnchor); 	
	this.labelContext.drawImage(this.textContext.canvas, this.textCanvasSegmentPosX, this.textCanvasSegmentPosY, this.textCanvasSegmentWidth, this.textCanvasSegmentHeight, 0, 0, this.labelContext.canvas.width, this.labelContext.canvas.height);
	
}


ARMeshLabel.prototype.update = function(){
	
	if (this.isEnabled)
	{
		switch (this.labelType) {
		case MeshLableTypeEnum.SIDESCROLLER:
			switch (this.transition) {
			case 0:
				if ((this.lerpValue < 1) )
				{
					let distanceRatio = (1 / (this.contextPointer1.canvas.width - this.textCanvasWidth)) * 100;
					this.lerpedValues.length = 0;
					var C = [0];
					var D = [this.contextPointer1.canvas.width - this.textCanvasWidth];
					this.lerpedValues = lerp(C, D, this.lerpValue);
					this.textCanvasSegmentPosX = parseInt(this.lerpedValues[0]);
					this.labelContext.clearRect(0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.labelContext.drawImage(this.contextPointer1.canvas, this.textCanvasSegmentPosX, this.textCanvasSegmentPosY, this.textCanvasSegmentWidth, this.textCanvasSegmentHeight, 0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.lerpValue = distanceRatio * (this.scrollClock.getElapsedTime() / this.scrollSpeed);
					this.labeltexture.needsUpdate = true;
				}
				else
				{
					this.textCanvasSegmentPosX = this.contextPointer1.canvas.width - this.textCanvasWidth;
					this.labelContext.clearRect(0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.labelContext.drawImage(this.contextPointer1.canvas, this.textCanvasSegmentPosX, this.textCanvasSegmentPosY, this.textCanvasSegmentWidth, this.textCanvasSegmentHeight, 0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.labeltexture.needsUpdate = true;
					this.transition = 1;
					this.scrollClock.start();
					this.lerpValue = 0;
				}
				if (this.pendingCanvasCounter > 0)
				{
					if ((this.pendingCanvasCounter == 3) || (this.pendingCanvasCounter == this.pointer2))
					{
						this.contextPointer2.canvas.width = this.pendingCanvasWidth;
						this.contextPointer2.fillStyle = this.backgroundColour;
						this.contextPointer2.fillRect(0, 0, this.contextPointer2.canvas.width, this.contextPointer2.canvas.height);
						wrapTextAlignwithFontsColours(this.contextPointer2, this.pendingLabelText, this.labelFontColour, this.labelFontColour, this.labelTextPosX, this.labelTextPosY, this.maxWidth, this.lineHeight, this.lineHeight, this.labelFont, this.labelFont, this.textAlignment, this.textAnchor);
						this.pendingCanvasCounter -= this.pointer2;
						if (this.pendingCanvasCounter == 0)
						{
							this.labelText = this.pendingLabelText;
						}
					}							
				}
				break;
			case 1:
			
				if ((this.lerpValue < 1) )
				{
					let distanceRatio = (1 / this.textCanvasSegmentWidth) * 100;
					this.lerpedValues.length = 0;
					var C = [(this.contextPointer1.canvas.width - this.textCanvasWidth), this.textCanvasSegmentWidth,0, this.labelCanvasWidth, 0];
					var D = [this.contextPointer1.canvas.width, 0,this.textCanvasSegmentWidth, 0, this.labelCanvasWidth];
					this.lerpedValues = lerp(C, D, this.lerpValue);
					this.labelContext.clearRect(0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					if ((parseInt(this.lerpedValues[3])) > 0)
					{						
						this.labelContext.drawImage(this.contextPointer1.canvas, parseInt(this.lerpedValues[0]), this.textCanvasSegmentPosY, parseInt(this.lerpedValues[1]), this.textCanvasSegmentHeight, 0, 0, parseInt(this.lerpedValues[3]), this.labelContext.canvas.height);
					}
					if ((parseInt(this.lerpedValues[4])) > 0)
					{
						this.labelContext.drawImage(this.contextPointer2.canvas, 0, this.textCanvasSegmentPosY, parseInt(this.lerpedValues[2]), this.textCanvasSegmentHeight, parseInt(this.lerpedValues[3]), 0, parseInt(this.lerpedValues[4]), this.labelContext.canvas.height);
					}
					this.lerpValue = distanceRatio * (this.scrollClock.getElapsedTime() / this.scrollSpeed);
					this.labeltexture.needsUpdate = true;
				}
				else
				{
					this.labelContext.clearRect(0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.labelContext.drawImage(this.contextPointer2.canvas, 0, this.textCanvasSegmentPosY, this.textCanvasSegmentWidth, this.textCanvasSegmentHeight, 0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
					this.labeltexture.needsUpdate = true;
					this.scrollClock.start();
					this.lerpValue = 0;
					this.transition = 0;
					if (this.pendingCanvasCounter > 0)
					{
						if ((this.pendingCanvasCounter == 3) || (this.pendingCanvasCounter == this.pointer1))
						{
							this.contextPointer1.canvas.width = this.pendingCanvasWidth;
							this.contextPointer1.fillStyle = this.backgroundColour;
							this.contextPointer1.fillRect(0, 0, this.contextPointer1.canvas.width, this.contextPointer1.canvas.height);
							wrapTextAlignwithFontsColours(this.contextPointer1, this.pendingLabelText, this.labelFontColour, this.labelFontColour, this.labelTextPosX, this.labelTextPosY, this.maxWidth, this.lineHeight, this.lineHeight, this.labelFont, this.labelFont, this.textAlignment, this.textAnchor);
							this.pendingCanvasCounter -= this.pointer1;
							if (this.pendingCanvasCounter == 0)
							{
								this.labelText = this.pendingLabelText;
							}
						}
					}
					if (this.pointer1 == 1)
					{
						this.pointer1 = 2;
						this.pointer2 = 1;
						this.contextPointer1 = this.textContext2;
						this.contextPointer2 = this.textContext;
					}
					else
					{
						this.pointer1 = 1;
						this.pointer2 = 2;
						this.contextPointer1 = this.textContext;
						this.contextPointer2 = this.textContext2;
					}

				}
				break;			
			}
		}
	}
}

ARMeshLabel.prototype.setText = function(caption){
	
	switch (this.labelType) {
	case MeshLableTypeEnum.STATIC:
		this.labelText = caption;
		this.textContext.fillStyle = this.backgroundColour;
		this.textContext.fillRect(0, 0, this.textContext.canvas.width, this.textContext.canvas.height);
		wrapTextAlignwithFontsColours(this.textContext, this.labelText, this.labelFontColour, this.labelFontColour, this.labelTextPosX, this.labelTextPosY, this.maxWidth, this.lineHeight, this.lineHeight, this.labelFont, this.labelFont, this.textAlignment, this.textAnchor); 	
		this.labelContext.drawImage(this.textContext.canvas, this.textCanvasSegmentPosX, this.textCanvasSegmentPosY, this.textCanvasSegmentWidth, this.textCanvasSegmentHeight, 0, 0, this.labelCanvasWidth, this.labelContext.canvas.height);
		this.labeltexture.needsUpdate = true;
		break;
	case MeshLableTypeEnum.SIDESCROLLER:
		if (this.pendingCanvasCounter == 0)
		{
			this.pendingLabelText = caption;
			this.pendingCanvasCounter = 3;
			this.textContext.font = this.labelFont;
			let textwidth = this.textContext.measureText(caption).width;
			if (textwidth > this.maxWidth)
			{
				this.maxWidth = textwidth;
			}
			this.pendingCanvasWidth = textwidth + this.labelTextPosX;
		}
		break;
	}
	
}

ARMeshLabel.prototype.StartScroll = function(){
	
	if ((!this.startOnOpening) && (this.labelType == MeshLableTypeEnum.SIDESCROLLER))
	{	
		this.scrollClock.start();
		this.isEnabled = true;
	}
}

ARMeshLabel.prototype.PauseScroll = function(){
	
	if (this.labelType == MeshLableTypeEnum.SIDESCROLLER)
	{	
		this.scrollClock.stop();
		this.isEnabled = false;
	}
}

ARMeshLabel.prototype.setup = function(mesh){
	mesh.material = new THREE.MeshStandardMaterial({
	  map: this.labeltexture,
	});
	this.meshMaterial = mesh.material; 
}

ARMeshLabel.prototype.getNodeName = function(){
	return this.nodeName;
}

ARMeshLabel.prototype.getType = function(){
	return ObjectTypeEnum.MESHLABEL;
}

ARMeshLabel.prototype.getUID = function(){	
	return this.UID;
}

ARMeshLabel.prototype.getUserData = function(){	
	return this.userData
}


ARMeshLabel.prototype.dispose = function(){
	this.UID = null;
	this.parentSide = null;
	this.parentStage = null;
	this.userData = null;
	this.classUID = null;
	this.nodeName = null;
	this.meshMaterial.dispose();
	this.meshMaterial = null;
	this.labelText = null;
	this.initialisedStoredText = null;
	this.currentLabelText = null;
	this.previousStoredText = null;
}


ARLight = function(item, parentobject, parentcube, parentside, parentstage) {
 	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.parentObject = parentobject;
	this.parentSide = parentside;
	this.parentCube = parentcube;
	this.parentStage = parentstage;
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialStoredRotation = new THREE.Vector3(0, 0, 0);
	this.currentPosition = new THREE.Vector3(0, 0, 0);
	this.currentRotation = new THREE.Vector3(0, 0, 0);
	this.lightType = LightTypeEnum.POINT;
	this.light = null;
	this.lightColour = new THREE.Color( 0xffffff )
	this.enabledMatColour = new THREE.Color( 0xffffff );
	this.enabledEmissiveColour = new THREE.Color( 0xffffff );
	this.enabledEmissiveIntensity = 0;
	this.isEnabled = false;
	this.storedEnabled = false;
	this.initialLightPower = 0;
	this.nodeName = null;
	this.meshMaterial = null;
	this.materialEnabled = false;
	this.isAdded = false;
	this.lightDecay = 1;
	this.lightDistance = 0;
	this.lightIntensity = 1;
	this.lightAngle = Math.PI/3;
	this.lightPower = 4 * Math.PI;
	this.lightPenumbra = 0;
	this.mapSize = 512;
	this.meshObject = null;
	this.disabledMaterial = null;
	this.enabledMaterial = null;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.LIGHT);
	}
	else
	{
		if (this.parentObject.getType() != ObjectTypeEnum.STAGE)
		{
			this.UID = this.parentObject.getUID();
			this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.LIGHT);
		}
	}
	if (this.parentObject.getType() == ObjectTypeEnum.MODEL)
	{
		if (item.hasOwnProperty('nodename')) this.nodeName = item.nodename;
	}
	
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.isEnabled = item.enabled;
		this.storedEnabled = this.isEnabled; 
	}
	
	if (item.hasOwnProperty('penumbra'))
	{
		this.lightPenumbra = Math.min(Math.max((item.penumbra), 0), 1);
	}
	
	if (item.hasOwnProperty('emissivecolour'))
	{
		this.enabledEmissiveColour.set( item.emissivecolour );
	}
	
	if (item.hasOwnProperty('materialcolour'))
	{
		this.enabledMatColour.set(item.materialcolour);
	}
	
	if (item.hasOwnProperty('lightcolour'))
	{
		this.lightColour.set(item.colour);	
	}
	
	if (item.hasOwnProperty('angle'))
	{
		this.lightAngle = THREE.Math.degToRad(item.angle);
		if (this.lightAngle > Math.PI/2) this.lightAngle = Math.PI/2;
	}
	
	if (item.hasOwnProperty('mapsize'))
	{
		this.mapSize = item.mapsize;
	}
	
	if (item.hasOwnProperty('intensity'))
	{
		this.lightIntensity = item.intensity;
	}
	if (item.hasOwnProperty('power'))
	{
		this.initialLightPower = item.power;
	}
	
	if (item.hasOwnProperty('type'))
	{
		switch (item.type.toLowerCase()) {
		case "point":
			this.lightType = LightTypeEnum.POINT;
			break;
		case "spotlight":
			this.lightType = LightTypeEnum.SPOTLIGHT;
			break;
		}
	}
	
	switch (this.lightType) {
	case LightTypeEnum.POINT:	
		this.light = new THREE.PointLight( this.lightColour, this.lightIntensity, this.lightDistance, this.lightDecay );
		this.light.castShadow = true;
		break;
	case LightTypeEnum.SPOTLIGHT:
		this.light = new THREE.SpotLight( this.lightColour, this.lightIntensity, this.lightDistance, this.lightAngle, this.lightPenumbra, this.lightDecay );
		this.light.castShadow = true;
		break;
	}

	this.light.shadow.mapSize.width = this.mapSize; 
	this.light.shadow.mapSize.height = this.mapSize;
	
	this.initialLightPower = this.light.power;
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
		_this.initialStoredPosition.x = item.x;
	}	
	if (item.hasOwnProperty('y'))
	{
		this.initialStoredPosition.y = item.y;
	}
	if (item.hasOwnProperty('z'))
	{
		this.initialStoredPosition.z = item.z;
	}
}

ARLight.prototype.constructor = ARMeshLabel;

ARLight.prototype.initialise = function(){
	this.light.power = this.initialLightPower;
	this.isEnabled = this.storedEnabled;
	if (this.isEnabled)
	{
		if (!this.isAdded)
		{
			this.parentObject.getObject3D().add(this.light);
			this.isAdded = true;
		}
		if (this.materialEnabled)
		{
			this.meshObject.material = this.enabledMaterial;
			this.enabledMaterial.emissiveIntensity = this.light.intensity / Math.pow( 0.02, 2.0 );
			this.meshObject.material.needsUpdate = true; 
		}
	}
	else
	{
		if (this.isAdded)
		{
			this.parentObject.getObject3D().remove(this.light);
			this.isAdded = false;
		}
		if (this.materialEnabled)
		{
			this.meshObject.material = this.disabledMaterial;
			this.meshObject.material.needsUpdate = true; 
		}
	}
	this.light.position.copy( this.initialStoredPosition );
	this.light.rotation.setFromVector3( this.initialStoredRotation );
	this.currentPosition.copy(this.initialStoredPosition);
	this.currentRotation.copy(this.initialStoredRotation);
}

ARLight.prototype.getNodeName = function(){
	return this.nodeName;
}

ARLight.prototype.setup = function(mesh){
	this.meshObject = mesh;
	this.disabledMaterial = mesh.material.clone();
	this.enabledMaterial = new THREE.MeshStandardMaterial( {
					emissive: this.enabledEmissiveColour,
					emissiveIntensity: 1,
					color: this.enabledMatColour
				} );
	this.materialEnabled = true;
}


ARLight.prototype.getObject3D = function(){
	return this.light;
}

ARLight.prototype.getParentObject = function(){
	return this.parentObject;
}

ARLight.prototype.getInitialPosition = function(){	
	return this.initialStoredPosition;
}

ARLight.prototype.getInitialRotation = function(){	
	return this.initialStoredRotation;
}


ARLight.prototype.getCurrentPositionX = function(){	
	return this.currentPosition.x;
}

ARLight.prototype.getCurrentPositionY = function(){	
	return this.currentPosition.y;
}

ARLight.prototype.getCurrentPositionZ = function(){	
	return this.currentPosition.z;
}


ARLight.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.currentRotation.x);
}

ARLight.prototype.getCurrentRotationAngleY = function(){	

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

ARLight.prototype.getCurrentRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.currentRotation.z);
}


ARLight.prototype.setCurrentRotationAngleX = function(value){
	this.currentRotation.x = THREE.Math.degToRad(value);	
	this.light.rotation.setFromVector3( this.currentRotation );
}

ARLight.prototype.setCurrentRotationAngleY = function(value){	
	this.currentRotation.y = THREE.Math.degToRad(value);	
	this.light.rotation.setFromVector3( this.currentRotation );
}

ARLight.prototype.setCurrentRotationAngleZ = function(value){	
	this.currentRotation.z = THREE.Math.degToRad(value);	
	this.light.rotation.setFromVector3( this.currentRotation );
}

ARLight.prototype.getCurrentPosition = function(){	
	return this.currentPosition;
}

ARLight.prototype.setCurrentPosition = function(value){	
	this.currentPosition.copy(value);
	this.light.position.copy( this.currentPosition );
}

ARLight.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez){	
	if (valuex != null) {this.currentPosition.x = valuex;}
	if (valuey != null) { this.currentPosition.y = valuey;}
	if (valuez != null) {this.currentPosition.z = valuez;}
	this.light.position.copy( this.currentPosition );

}

ARLight.prototype.setCurrentRotation = function(value){	
	this.currentRotation.copy(value);
	this.light.rotation.setFromVector3( this.currentRotation );

}

ARLight.prototype.setCurrentQuaternion = function(value){	
	this.light.quaternion.set( value.x(), value.y(), value.z(), value.w() );
	this.light.rotation.toVector3( this.currentRotation );
}

ARLight.prototype.getCurrentRotation = function(){	
	return this.currentRotation;
}

ARLight.prototype.translateObject = function(value, scaledFactor = 1){	
	value.multiplyScalar(scaledFactor);
	this.currentPosition.add(value);
	if ((this.maxPosition != null) && (this.minPosition != null))
	{
		if (this.currentPosition.x > this.maxPosition.x)
		{
			this.currentPosition.x = this.maxPosition.x;
		}
		else if (this.currentPosition.x < this.minPosition.x)
		{
			this.currentPosition.x = this.minPosition.x;
		}
		if (this.currentPosition.y > this.maxPosition.y)
		{
			this.currentPosition.y = this.maxPosition.y;
		}
		else if (this.currentPosition.y < this.minPosition.y)
		{
			this.currentPosition.y = this.minPosition.y;
		}
		if (this.currentPosition.z > this.maxPosition.z)
		{
			this.currentPosition.z = this.maxPosition.z;
		}
		else if (this.currentPosition.z < this.minPosition.z)
		{
			this.currentPosition.z = this.minPosition.z;
		}
	}
	this.light.position.copy( this.currentPosition );				
}

ARLight.prototype.setEnabled = function(value){
	if (this.isEnabled != value)
	{
		this.isEnabled = value;
		if (this.isEnabled)
		{
			if (!this.isAdded)
			{
				this.parentObject.getObject3D().add(this.light);
				this.isAdded = true;
			}
			if (this.materialEnabled)
			{
				this.meshObject.material = this.enabledMaterial;
				this.enabledMaterial.emissiveIntensity = this.light.intensity / Math.pow( 0.02, 2.0 );
				this.meshObject.material.needsUpdate = true; 
			}
		}
		else
		{
			if (this.isAdded)
			{
				this.parentObject.getObject3D().remove(this.light);
				this.isAdded = false;
			}
			if (this.materialEnabled)
			{
				this.meshObject.material = this.disabledMaterial;
				this.meshObject.material.needsUpdate = true; 
			}
		}
	}	
}

ARLight.prototype.isEnabled = function(){
	return this.isEnabled;
}


ARLight.prototype.getPower = function(){
	
	return this.light.power;
}

ARLight.prototype.setPower = function(value){
	
	this.light.power = value;
	this.enabledMaterial.emissiveIntensity = this.light.intensity / Math.pow( 0.02, 2.0 );
}

ARLight.prototype.removeFromParent = function(){
	
	this.parentObject.remove( this.light );
}

ARLight.prototype.getUID = function(){	
	return this.UID;
}

ARLight.prototype.getType = function(){
	return ObjectTypeEnum.LIGHT;
}

ARLight.prototype.getUserData = function(){	
	return this.userData
}


ARLight.prototype.dispose = function(){
	this.UID = null;
	this.parentSide = null;
	this.parentStage = null;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.initialStoredPosition = null;
	this.initialStoredRotation = null;
	this.currentPosition = null;
	this.currentRotation = null;
	this.lightType = null;
	if (this.isAdded)
	{
		this.parentObject.remove(this.light);
	}
		if ( this.light.shadow && this.light.shadow.map ) {

		this.light.shadow.map.dispose();
	}
	if (this.light.type == 'Lensflare')
	{
		this.light.dispose();
	}
	else
	{
		disposeObjectMesh(this.light);
	}
	this.light = null;
	this.meshObject = null;
	this.disabledMaterial.dispose();
	this.disabledMaterial = null;
	this.enabledMaterial.dispose();
	this.enabledMaterial = null;

}