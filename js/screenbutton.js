ScreenButton = function(item, parentside) {
	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.storedInitialEnabledState = false;
	this.isEnabled = false;
	this.isCurrentlyRendered = false;
	this.storedInitialVisibleState = false;
	this.isVisible = false;
	this.parentSide = parentside;
	this.scaledPosition = new THREE.Vector2( 0, 0 );
	this.position = new THREE.Vector2( 0, 0 );
	this.angle = 0;
	this.alpha = 1.0;
	this.radius = 0;
	this.scaledRadius = 0;
	this.defaultScale = 1;
	this.scaledScale = 1;
	this.anchorType = AnchorPointEnum.TOPLEFT;
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
	this.buttonImage = null;
	this.buttonImages = new Array;
	this.multipleImageMode = false;
	this.currentImageNum = null;
	this.transitionSpeed = 1.0;
	this.transitionClock = new THREE.Clock(false);
	this.arStatesRefArray = new Array;
	
	this.resize = function() {
		
		var scale, diffradius;
		(g_isCurrentLandscape) ? scale = g_canvas2d.width / DEFAULTPORTRAITCANVASHEIGHT : scale = g_canvas2d.height / DEFAULTPORTRAITCANVASHEIGHT; 
		_this.scaledRadius = Math.round(_this.radius * scale);
		if (_this.scaledRadius % 2)
		{
			_this.scaledRadius = _this.scaledRadius + 1;
		}
		diffradius = Math.round((_this.scaledRadius - _this.radius) / 2); 
		
		
		switch (_this.anchorType) {
		case AnchorPointEnum.TOPLEFT:
			_this.scaledPosition.x = Math.round(_this.position.x - diffradius);
			_this.scaledPosition.y = Math.round(_this.position.y - diffradius);
			break;		
		case AnchorPointEnum.TOPRIGHT:
			_this.scaledPosition.x = Math.round(_this.position.x + (g_canvas2d.width - DEFAULTPORTRAITCANVASWIDTH) - diffradius);
			_this.scaledPosition.y = Math.round(_this.position.y - diffradius);
			break;		
		case AnchorPointEnum.TOPCENTRE:
			_this.scaledPosition.x = Math.round((g_canvas2d.width / 2) + (_this.position.x - (DEFAULTPORTRAITCANVASWIDTH / 2)) - diffradius); 
			_this.scaledPosition.y = Math.round(_this.position.y - diffradius);
			break;
		case AnchorPointEnum.BOTTOMLEFT:
			_this.scaledPosition.x = Math.round(_this.position.x - diffradius);
			_this.scaledPosition.y = Math.round(g_canvas2d.height - (DEFAULTPORTRAITCANVASHEIGHT - _this.position.y) - diffradius);
			break;	
		case AnchorPointEnum.BOTTOMRIGHT:
			_this.scaledPosition.x = Math.round(_this.position.x + (g_canvas2d.width - DEFAULTPORTRAITCANVASWIDTH) - diffradius);
			_this.scaledPosition.y = Math.round(g_canvas2d.height - (DEFAULTPORTRAITCANVASHEIGHT - _this.position.y) - diffradius);
			break;
		case AnchorPointEnum.BOTTOMCENTRE:
			_this.scaledPosition.x = Math.round((g_canvas2d.width / 2) + (_this.position.x - (DEFAULTPORTRAITCANVASWIDTH / 2)) - diffradius);
			//_this.scaledPosition.y = Math.round(g_canvas2d.height - ((g_canvas2d.height / DEFAULTPORTRAITCANVASHEIGHT) * (DEFAULTPORTRAITCANVASHEIGHT - _this.position.y)) - diffradius);
			_this.scaledPosition.y = Math.round(g_canvas2d.height - (DEFAULTPORTRAITCANVASHEIGHT - _this.position.y) - diffradius);
			break;
		case AnchorPointEnum.CENTRE:
			_this.scaledPosition.x = Math.round((g_canvas2d.width / 2) + (_this.position.x - (DEFAULTPORTRAITCANVASWIDTH / 2)) - diffradius);
			_this.scaledPosition.y = Math.round((g_canvas2d.height / 2) + (_this.position.y - (DEFAULTPORTRAITCANVASHEIGHT / 2)) - diffradius);
			break;
		case AnchorPointEnum.CENTRELEFT:
			_this.scaledPosition.x = Math.round(_this.position.x - diffradius);
			_this.scaledPosition.y = Math.round((g_canvas2d.height / 2) + (_this.position.y - (DEFAULTPORTRAITCANVASHEIGHT / 2)) - diffradius);
			break;
		case AnchorPointEnum.CENTRERIGHT:
			_this.scaledPosition.x = Math.round(_this.position.x + (g_canvas2d.width - DEFAULTPORTRAITCANVASWIDTH) - diffradius);
			_this.scaledPosition.y = Math.round((g_canvas2d.height / 2) + (_this.position.y - (DEFAULTPORTRAITCANVASHEIGHT / 2)) - diffradius);
			break;
		}
		
	}
	
	
	if (item.hasOwnProperty('uid'))
	{
		_this.UID = item.uid;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.SCREENBUTTON);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		_this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('class'))
	{
		this.classUID = item.class;
		_this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.CLASS, this.classUID);
	}
	
	if (item.hasOwnProperty('images'))
	{
		if (item.images.length > 0)
		{
			this.multipleImageMode = true;
			this.currentImageNum = 0;
			for (let i = 0; i < item.images.length; i++)
			{
				if (item.images[i].hasOwnProperty('img'))
				{
					var loader = new THREE.FileLoader(g_loadingManager);
					loader.setResponseType ( 'blob' );
					
					loader.load( 'assets/images/' + item.images[i].img, function ( blob ) {
						var objUrl = URL.createObjectURL(blob);
						var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

						image.onload = ()=> {
							URL.revokeObjectURL(objUrl);
							_this.buttonImages.push(image);
							document.body.removeChild(image);
						};
						image.src = objUrl;
						image.style.visibility = 'hidden';
						document.body.appendChild(image);
					})
				}
			}
		}
	
	}
	
	if (item.hasOwnProperty('img'))
	{	
		var loader = new THREE.FileLoader(g_loadingManager);
		loader.setResponseType ( 'blob' );
		
		loader.load( 'assets/images/' + item.img, function ( blob ) {
			var objUrl = URL.createObjectURL(blob);
			var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

            image.onload = ()=> {
                URL.revokeObjectURL(objUrl);
				_this.buttonImage = image;
                document.body.removeChild(image);
            };
            image.src = objUrl;
            image.style.visibility = 'hidden';
            document.body.appendChild(image);
		})
	}
	
	if (item.hasOwnProperty('speed'))
	{
		this.transitionSpeed = item.speed;
	}
	
	if (item.hasOwnProperty('angle'))
	{
		this.angle = item.angle;
	}
	
	if (item.hasOwnProperty('alpha'))
	{
		this.alpha = item.alpha;
	}
	
	if (item.hasOwnProperty('anchorpoint'))
	{
		switch (item.anchorpoint.toUpperCase()) {
		case "TOPLEFT":
			this.anchorType = AnchorPointEnum.TOPLEFT;
			break;
		case "TOPRIGHT":
			this.anchorType = AnchorPointEnum.TOPRIGHT;
			break;
		case "TOPCENTRE":
			this.anchorType = AnchorPointEnum.TOPCENTRE;
			break;
		case "BOTTOMLEFT":
			this.anchorType = AnchorPointEnum.BOTTOMLEFT;
			break;
		case "BOTTOMRIGHT":
			this.anchorType = AnchorPointEnum.BOTTOMRIGHT;
			break;
		case "BOTTOMCENTRE":
			this.anchorType = AnchorPointEnum.BOTTOMCENTRE;
			break;
		case "CENTRE":
			this.anchorType = AnchorPointEnum.CENTRE;
			break;
		case "CENTRELEFT":
			this.anchorType = AnchorPointEnum.CENTRELEFT;
			break;
		case "CENTRERIGHT":
			this.anchorType = AnchorPointEnum.CENTRERIGHT;			
			break;
		}
	}
	
	if (item.hasOwnProperty('radius'))
	{
		this.radius = item.radius;
	}	
	
	if (item.hasOwnProperty('x'))
	{
		this.position.x = item.x;
	}	
	if (item.hasOwnProperty('y'))
	{
		this.position.y = item.y;
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.storedInitialEnabledState = item.enabled;
		this.isEnabled = item.enabled;
	}
	
	if (item.hasOwnProperty('visible'))
	{
		this.storedInitialVisibleState = item.visible;
		this.isVisible = item.visible;
		if (!this.isVisible)
		{
			this.storedInitialEnabledState = false;
			this.isEnabled = false;
		}
	}
	
	console.log("screen button x " + _this.position.x + " y " + _this.position.y + " scaleradius " + _this.radius);
	
	this.resize();
}

ScreenButton.prototype.constructor = ScreenButton;

ScreenButton.prototype.initialise = function(){
	
	this.isVisible = this.storedInitialVisibleState;
	this.isEnabled = this.storedInitialEnabledState;
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
	this.isCurrentlyRendered = false;
	if (this.multipleImageMode)
	{
		this.currentImageNum = 0;
		if (this.isVisible)
		{
			this.transitionClock.start();
		}
	}
}

ScreenButton.prototype.addStateReference = function(ref){
	this.arStatesRefArray.push(ref);
}

ScreenButton.prototype.isEnabled = function(){
	return this.isEnabled;
}



ScreenButton.prototype.getType = function(){
	return ObjectTypeEnum.SCREENBUTTON;
}

ScreenButton.prototype.getIsVisible = function(){
	return this.isVisible;
}



ScreenButton.prototype.setIsVisible = function(value){
	
	if (this.isVisible != value)
	{
		if (this.multipleImageMode)
		{
			
			if (!this.isVisible)
			{
				console.log("not visible but will be! this.transitionClock.start()");
				this.transitionClock.start();
				this.currentImageNum = 0;
			}
			else
			{
				console.log("is visible but not much longer! this.transitionClock.stop()");
				if (this.transitionClock.running)
				{
					this.transitionClock.stop();
				}
				this.currentImageNum = 0;
			}
		}
		this.isVisible = value;
	}
	if (!this.isVisible)
	{
		this.isEnabled = false;
	}
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
}



ScreenButton.prototype.resizeButton = function(){
	
	this.resize();
}

ScreenButton.prototype.collisionDetection = function(touchposition, touchtype){
	if ((this.isEnabled) && (this.isCurrentlyRendered) && (touchtype != ButtonStateEnum.NOTTOUCHED))
	{
		var dx = this.scaledPosition.x - touchposition.x;
		var dy = this.scaledPosition.y - touchposition.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
					
		if (distance < (this.scaledRadius / 2) + 5) {
			// collision detected!
			console.log("collision detected!");
			switch (touchtype) {
			case ButtonStateEnum.FIRSTTOUCHED:

				if (this.buttonState == ButtonStateEnum.NOTTOUCHED)
				{
					this.buttonState = ButtonStateEnum.FIRSTTOUCHED;
					if (this.arStatesRefArray != null)
					{
						this.arStatesRefArray.forEach(function(item){
							item.checkActive()
						})
					}
				}
				break;
			case ButtonStateEnum.TOUCHCONTINUE:

				if (this.buttonState == ButtonStateEnum.FIRSTTOUCHED)
				{
					this.buttonState = ButtonStateEnum.TOUCHCONTINUE;
				}
				else
				{
					this.buttonState = ButtonStateEnum.FIRSTTOUCHED;
				}
				break;				
			}
		}
		else
		{
			this.buttonState = ButtonStateEnum.NOTTOUCHED;
		}
	}
	else
	{
		this.buttonState = ButtonStateEnum.NOTTOUCHED;
	}
}

ScreenButton.prototype.getCurrentRendered = function(){
	return this.isCurrentlyRendered;
}


ScreenButton.prototype.setCurrentRendered = function(value){
	/* if (this.isVisible)
	{ */
		this.isCurrentlyRendered = value;
	//}
}


ScreenButton.prototype.update = function(){		
	if ((this.isVisible))
	{
		if (this.transitionClock.getElapsedTime() > this.transitionSpeed)
		{
			if (this.currentImageNum < (this.buttonImages.length - 1))
			{
				this.currentImageNum++;
			}
			else
			{
				this.currentImageNum = 0;
			}
			this.transitionClock.start();
		}
	}
	else
	{
		if (this.transitionClock.running)
		{
			this.transitionClock.stop();
		}
	}
}

ScreenButton.prototype.renderButton = function(){
	if ((this.isVisible))
	{
		if (this.multipleImageMode)
		{
			
			if (this.buttonImages[this.currentImageNum] != null)
			{
				drawRotatedImageWidthHeight(this.buttonImages[this.currentImageNum], this.scaledPosition.x, this.scaledPosition.y, this.angle, this.scaledRadius, this.scaledRadius, this.alpha)
			}
		}
		else
		{
			if (this.buttonImage != null)
			{
				drawRotatedImageWidthHeight(this.buttonImage, this.scaledPosition.x, this.scaledPosition.y, this.angle, this.scaledRadius, this.scaledRadius, this.alpha)
			}
		}
		this.isCurrentlyRendered = true;
	}
	else
	{
		this.isCurrentlyRendered = false;
	}
}

ScreenButton.prototype.setEnabled = function(value){
	console.log("button " + this.UID + " enabled " + value);
	if (this.isEnabled != value)
	{
		this.isEnabled = value; 
		if ((this.isEnabled) && (!this.isVisible))
		{
			this.setIsVisible(true);
		}
		
	}
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
}

ScreenButton.prototype.isTouched = function(){
	if ((this.buttonState == ButtonStateEnum.FIRSTTOUCHED) || (this.buttonState == ButtonStateEnum.TOUCHCONTINUE))
	{
		console.log("button " + this.UID + " isTouched");
		return true;
	}
	else
	{
		return false;
	}
}



		
ScreenButton.prototype.getButtonState = function(){
	
	return this.buttonState;
}

ScreenButton.prototype.getUID = function(){	
	return this.UID;
}

ScreenButton.prototype.getUserData = function(){	
	return this.userData
}	

ScreenButton.prototype.dispose = function(){
	this.UID = null;
	this.userData = null;
	this.storedInitialEnabledState = null;
	this.isEnabled = null;
	this.parentSide = null;
	this.buttonState = null;
	this.transitionClock = null;
	if (this.buttonImage != null)
	{
		//this.buttonImage.dispose();
		this.buttonImage = null;
	}
	if (this.buttonImages != null)
	{
		for(let i=0;i<this.buttonImages.length;i++)
		{
			this.buttonImages[i] = null;
		}
		this.buttonImages.length = 0;
		this.buttonImages = null;
	}
	if (this.arStatesRefArray != null)
	{
		for(let i=0;i<this.arStatesRefArray.length;i++)
		{
			this.arStatesRefArray[i] = null;
		}
		this.arStatesRefArray.length = 0;
		this.arStatesRefArray = null;
	}
}