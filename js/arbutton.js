

ARMeshButton = function(item, parentside, parentstage) {
	var _this = this;
	this.UID = null;
	this.userData = null;
	this.classUID = null;
	this.storedInitialEnabledState = false;
	this.isEnabled = false;
	this.parentSide = parentside;
	this.parentStage = parentstage;
	this.nodeName = null;
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
	this.arStatesRefArray = new Array;

	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.MESHBUTTON);
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
	
	if (item.hasOwnProperty('nodename'))
	{
		this.nodeName = item.nodename;
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.storedInitialEnabledState = item.enabled;
	}
}

ARMeshButton.prototype.constructor = ARMeshButton;


ARMeshButton.prototype.setButtonMesh = function(mesh){
	
/* 	if (this.nodeName != null)
	{ */		
		this.parentStage.addInteractableModel(mesh, this.nodeName, this );
	/* }
	else
	{
		this.parentStage.addInteractableModel(mesh, modelname, this );
	} */
}

ARMeshButton.prototype.initialise = function(){
	
	this.isEnabled = this.storedInitialEnabledState;
	this.buttonState = ButtonStateEnum.NOTTOUCHED;
}

ARMeshButton.prototype.isEnabled = function(){
	return this.isEnabled;
}

ARMeshButton.prototype.setEnabled = function(value){
	console.log("button " + this.UID + " enabled " + value);
	if (this.isEnabled != value)
	{
		this.isEnabled = value; 
		this.buttonState = ButtonStateEnum.NOTTOUCHED;
	}

}

ARMeshButton.prototype.addStateReference = function(ref){
	this.arStatesRefArray.push(ref);
}

ARMeshButton.prototype.isTouched = function(){
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

ARMeshButton.prototype.getNodeName = function(){
	return this.nodeName;
}

ARMeshButton.prototype.setButtonState = function(value){
	
	if ((this.isEnabled) && (this.buttonState != value))
	{
		
		switch (value) {
		case ButtonStateEnum.NOTTOUCHED:

			this.buttonState = ButtonStateEnum.NOTTOUCHED;
			break;
		case ButtonStateEnum.FIRSTTOUCHED:

			if (this.buttonState == ButtonStateEnum.NOTTOUCHED)
			{

				this.buttonState = ButtonStateEnum.FIRSTTOUCHED;
				this.arStatesRefArray.forEach(function(item){
					item.checkActive()
				})
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
	
}		
		
ARMeshButton.prototype.getButtonState = function(){
	
	return this.buttonState;
}	

ARMeshButton.prototype.getType = function(){
	
	return ObjectTypeEnum.MESHBUTTON;
}

ARMeshButton.prototype.getUID = function(){	
	return this.UID;
}	

ARMeshButton.prototype.getUserData = function(){	
	return this.userData
}

ARMeshButton.prototype.update = function(){

	
}

ARMeshButton.prototype.dispose = function(){
	this.UID = null;
	this.userData = null;
	this.storedInitialEnabledState = null;
	this.isEnabled = null;
	this.parentSide = null;
	this.nodeName = null;
	this.buttonState = null;
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