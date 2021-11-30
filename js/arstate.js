const StateTypeEnum = {
	ON : 0,
	OFF : 1,
	ONOFF : 2
}

const StateStatusEnum = {
	CHECKING : 0,
	ACTIONING : 1,
	ACTIONED : 2
}

const StateValueEnum = {
	NONE : 0,
	ON : 1,
	OFF : 2
}

const ConditionTypeEnum = {
	AND : 0,
	OR : 1,
	NONE : 2
}

const StateStageTypeEnum = {
	STAGEUPDATE : 0,
	STAGECLOSING : 1,
	STAGEOPENING : 2,
	STAGETIMEOUT : 3
}



ARState = function(item, parentside, parentobject, statestagetype, objecttype = ObjectTypeEnum.STATE, classobject = null, classuid = null, classtype = null) {
	var _this = this;
	this.parentSide = parentside;
	this.parentObject = parentobject;
	this.UID = null;
	this.stateOrder = 1;
	this.currentActionOrder = 1;
	this.maxOnActionOrder = 1;
	this.maxOffActionOrder = 1;
	this.stateType = StateTypeEnum.ON;
	this.currentStatus = StateStatusEnum.CHECKING;
	this.currentStateValue = StateValueEnum.NONE;
	this.conditionType = ConditionTypeEnum.AND;
	this.stateStageType = statestagetype;
	this.objectType = objecttype;
	this.classObject = classobject;
	this.classUID = classuid;
	this.classType = classtype;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.STATE);
	}
	if (item.hasOwnProperty('order'))
	{
		this.stateOrder = item.order;
	}
	this.arConditionsArray = new Array;
	this.arOnActionsArray = new Array;
	this.arOffActionsArray = new Array;
	
	if (item.hasOwnProperty('type'))
	{
		switch (item.type.toLowerCase()) {
		case "on":
			this.stateType = StateTypeEnum.ON; 
			break;
		case "off":
			this.stateType = StateTypeEnum.OFF; 
			break;
		case "onoff":
			this.stateType = StateTypeEnum.ONOFF; 
			break;			
		}
	}
	
	if (item.hasOwnProperty('conditiontype'))
	{
		switch (item.conditiontype.toLowerCase()) {
		case "and":
			this.conditionType = ConditionTypeEnum.AND;
			break;
		case "or":
			this.conditionType = ConditionTypeEnum.OR;
			break;	
		}
	}

	
	if (item.hasOwnProperty('conditions'))
	{
		if (item.conditions.length > 0)
		{
			for (let i = 0; i < item.conditions.length; i++)
			{
				if (item.conditions[i].condition.hasOwnProperty('ios'))
				{
					if ((item.conditions[i].condition.ios == g_isIOS))
					{
						var arcondition = new ARCondition(item.conditions[i].condition, this.parentSide, _this);
						this.arConditionsArray.push(arcondition);
					}
				}
				else
				{
					var arcondition = new ARCondition(item.conditions[i].condition, this.parentSide, _this);
					this.arConditionsArray.push(arcondition);
				}
			}
		}
	}
	else
	{
		this.conditionType = ConditionTypeEnum.NONE;
	}
	
	if (item.hasOwnProperty('onactions'))
	{
		if (item.onactions.length > 0)
		{
			for (let i = 0; i < item.onactions.length; i++)
			{
				if (item.onactions[i].action.hasOwnProperty('ios'))
				{
					if ((item.onactions[i].action.ios == g_isIOS))
					{
						var aronaction = new ARAction(item.onactions[i].action, this.parentSide, this.parentObject, _this, this.stateStageType);
						if (aronaction.getActionOrder() > this.maxOnActionOrder)
						{
							this.maxOnActionOrder = aronaction.getActionOrder();
						}
						this.arOnActionsArray.push(aronaction);
					}
				}
				else
				{
					var aronaction = new ARAction(item.onactions[i].action, this.parentSide, this.parentObject, _this, this.stateStageType);
					if (aronaction.getActionOrder() > this.maxOnActionOrder)
					{
						this.maxOnActionOrder = aronaction.getActionOrder();
					}
					this.arOnActionsArray.push(aronaction);
				}
			}			
		}
	}
	
	if (item.hasOwnProperty('offactions'))
	{
		if (item.offactions.length > 0)
		{
			for (let i = 0; i < item.offactions.length; i++)
			{
				if (item.offactions[i].action.hasOwnProperty('ios'))
				{
					if ((item.offactions[i].action.ios == g_isIOS))
					{
						var aroffaction = new ARAction(item.offactions[i].action, this.parentSide, this.parentObject, _this, this.stateStageType);
						if (aroffaction.getActionOrder() > this.maxOffActionOrder)
						{
							this.maxOffActionOrder = aroffaction.getActionOrder();
						}				
						this.arOffActionsArray.push(aroffaction);
					}
				}
				else
				{
					var aroffaction = new ARAction(item.offactions[i].action, this.parentSide, this.parentObject, _this, this.stateStageType);
					if (aroffaction.getActionOrder() > this.maxOffActionOrder)
					{
						this.maxOffActionOrder = aroffaction.getActionOrder();
					}				
					this.arOffActionsArray.push(aroffaction);
				}
			}			
		}
	}
}

ARState.prototype.constructor = ARState;

ARState.prototype.initialise = function(){
	
	if (this.conditionType != ConditionTypeEnum.NONE)
	{
		for (let i = 0; i < this.arConditionsArray.length; i++)
		{
			this.arConditionsArray[i].initialise();
		}
	}
	
	for(let i=0;i<this.arOffActionsArray.length;i++)
	{
		this.arOffActionsArray[i].initialise();
	}

	for(let i=0;i<this.arOnActionsArray.length;i++)
	{
		this.arOnActionsArray[i].initialise();
	}

	this.currentStatus = StateStatusEnum.CHECKING;
	this.currentActionOrder = 1;
	this.currentStateValue = StateValueEnum.NONE;
}

ARState.prototype.getCurrentStatus = function(){
	
	return this.currentStatus;
}

ARState.prototype.getStateOrder = function(){
	
	return this.stateOrder;
}

ARState.prototype.getClassObject = function(){
 
	return this.classObject;
}

ARState.prototype.getClassUID = function(){
	
	return this.classUID;
}

ARState.prototype.getClassType = function(){
	return this.classType
}	
	

ARState.prototype.getStateType = function(){
	
	return this.stateType;
}

ARState.prototype.getObjectType = function(){
	
	return this.objectType;
}

ARState.prototype.update = function(){

	switch (this.currentStatus) {
	case StateStatusEnum.CHECKING:
		
		var onResultsCount = 0;
		var offResultsCount = 0;
		for (let i = 0; i < this.arConditionsArray.length; i++)
		{
			if (this.arConditionsArray[i].checkCondition())
			{
				onResultsCount++;
			}
			else
			{
				offResultsCount++;
			}
		}
		switch (this.stateType) {
		case StateTypeEnum.ON:
			switch (this.conditionType) {
			case ConditionTypeEnum.AND:
				if ((onResultsCount == this.arConditionsArray.length) && (this.arOnActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					
					this.currentActionOrder = 1;
					this.currentStateValue = StateValueEnum.ON;
					this.currentStatus = StateStatusEnum.ACTIONING;
				}
				break;
			case ConditionTypeEnum.OR:
				if ((onResultsCount > 0) && (this.arOnActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					
					this.currentActionOrder = 1;
					this.currentStateValue = StateValueEnum.ON;
					this.currentStatus = StateStatusEnum.ACTIONING;
				}
				break;
			case ConditionTypeEnum.NONE:
				this.currentActionOrder = 1;
				this.currentStateValue = StateValueEnum.ON;
				this.currentStatus = StateStatusEnum.ACTIONING;
				break;
			}			
			break;			
		case StateTypeEnum.OFF:
			switch (this.conditionType) {
			case ConditionTypeEnum.AND:
				if ((offResultsCount == this.arConditionsArray.length) && (this.arOffActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					
					this.currentActionOrder = 1;
					this.currentStateValue = StateValueEnum.OFF;
					this.currentStatus = StateStatusEnum.ACTIONING;
				}
				break;
			case ConditionTypeEnum.OR:
				if ((offResultsCount > 0) && (this.arOffActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					
					this.currentActionOrder = 1;
					this.currentStateValue = StateValueEnum.OFF;
					this.currentStatus = StateStatusEnum.ACTIONING;
				}
				break;
			case ConditionTypeEnum.NONE:
				this.currentActionOrder = 1;
				this.currentStateValue = StateValueEnum.OFF;
				this.currentStatus = StateStatusEnum.ACTIONING;
				break;				
			}
			break;
		case StateTypeEnum.ONOFF:
			switch (this.conditionType) {
			case ConditionTypeEnum.AND:
				if ((onResultsCount == this.arConditionsArray.length) && (this.arOnActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					if (this.currentStateValue != StateValueEnum.ON)
					{
						
						this.currentActionOrder = 1;
						this.currentStateValue = StateValueEnum.ON;
						this.currentStatus = StateStatusEnum.ACTIONING;
					}
				}
				else
				{				
					if ((this.currentStateValue != StateValueEnum.OFF)  && (this.arConditionsArray.length > 0))
					{
						
						this.currentActionOrder = 1;
						this.currentStateValue = StateValueEnum.OFF;
						this.currentStatus = StateStatusEnum.ACTIONING;
					}
				}
				break;
			case ConditionTypeEnum.OR:
				if ((onResultsCount > 0) && (this.arOnActionsArray.length > 0) && (this.arConditionsArray.length > 0))
				{
					if (this.currentStateValue != StateValueEnum.ON)
					{
						
						this.currentActionOrder = 1;
						this.currentStateValue = StateValueEnum.ON;
						this.currentStatus = StateStatusEnum.ACTIONING;
					}
				}
				else
				{				
					if ((this.currentStateValue != StateValueEnum.OFF) && (this.arConditionsArray.length > 0))
					{
						
						this.currentActionOrder = 1;
						this.currentStateValue = StateValueEnum.OFF;
						this.currentStatus = StateStatusEnum.ACTIONING;
					}
				}
				break;
			}			
			break;			
		}
		break;
	case StateStatusEnum.ACTIONING:
		switch (this.currentStateValue) {
		case StateValueEnum.ON:
			var completed = true;
			for(let i=0;i<this.arOnActionsArray.length;i++)
			{
				if (this.arOnActionsArray[i].getActionOrder() == this.currentActionOrder)
				{
					if (!this.arOnActionsArray[i].getActionComplete())
					{
						this.arOnActionsArray[i].update();
						completed = false;
					}
				}
			}
			if (completed)
			{
				if (this.currentActionOrder == this.maxOnActionOrder)
				{
					this.currentStatus = StateStatusEnum.ACTIONED;
				}
				else
				{
					this.currentActionOrder++;
				}
			}
			break;			
		case StateValueEnum.OFF:
			var completed = true;
			for(let i=0;i<this.arOffActionsArray.length;i++)
			{
				if (this.arOffActionsArray[i].getActionOrder() == this.currentActionOrder)
				{
					if (!this.arOffActionsArray[i].getActionComplete())
					{
						this.arOffActionsArray[i].update();
						completed = false;
					}
				}
			}
			if (completed)
			{
				if (this.currentActionOrder == this.maxOffActionOrder)
				{
					this.currentStatus = StateStatusEnum.ACTIONED;
				}
				else
				{
					this.currentActionOrder++;
				}
			}
			break;			
		}		
		break;
	case StateStatusEnum.ACTIONED:
		if (this.stateType == StateTypeEnum.ONOFF)
		{
			
			this.currentStatus = StateStatusEnum.CHECKING;
			if (this.currentStateValue == StateValueEnum.OFF)
			{
				for(let i=0;i<this.arOffActionsArray.length;i++)
				{
					this.arOffActionsArray[i].initialise();
				}
			}
			if (this.currentStateValue == StateValueEnum.ON)
			{
				for(let i=0;i<this.arOnActionsArray.length;i++)
				{
					this.arOnActionsArray[i].initialise();
				}
			}
			this.currentStateValue = StateValueEnum.NONE;
			this.currentActionOrder = 1;
			
		}
		else
		{
			console.log("actioned");
		}			
		break;		
	}
}

ARState.prototype.setActive = function(){
	if (this.currentStatus != StateStatusEnum.ACTIONING)
	{
		
		this.currentActionOrder = 1;
		this.currentStateValue = StateValueEnum.ON;
		this.currentStatus = StateStatusEnum.ACTIONING;
	}
	
}

ARState.prototype.checkActive = function(){
	
	if ((this.currentStatus == StateStatusEnum.CHECKING) && (this.parentObject.getCurrentStateOrder == this.stateOrder))
	{
		update();
	}
}

ARState.prototype.dispose = function(){
	
	if (this.arConditionsArray != null)
	{
		for(let i=0;i<this.arConditionsArray.length;i++)
		{
			this.arConditionsArray[i].dispose();
			this.arConditionsArray[i] = null;
		}
		this.arConditionsArray.length = 0;
		this.arConditionsArray = null;
	}
	
	if (this.arOnActionsArray != null)
	{
		for(let i=0;i<this.arOnActionsArray.length;i++)
		{
			this.arOnActionsArray[i].dispose();
			this.arOnActionsArray[i] = null;
		}
		this.arOnActionsArray.length = 0;
		this.arOnActionsArray = null;
	}
	
	if (this.arOffActionsArray != null)
	{
		for(let i=0;i<this.arOffActionsArray.length;i++)
		{
			this.arOffActionsArray[i].dispose();
			this.arOffActionsArray[i] = null;
		}
		this.arOffActionsArray.length = 0;
		this.arOffActionsArray = null;
	}
	
	this.parentSide = null;
	this.parentObject = null;
	this.UID = null;
	this.stateOrder = null;
	this.currentActionOrder = null;
	this.maxOnActionOrder = null;
	this.maxOffActionOrder = null;
	this.stateType = null;
	this.currentStatus = null;
	this.currentStateValue = null;
	this.conditionType = null;
	this.stateStageType = null;
	
}


ARClassState = function(item, parentside, parentobject, statestagetype) {
	
	var _this = this;
	this.parentSide = parentside;
	this.parentObject = parentobject;
	this.classType = null;
	this.arStatesArray = new Array;
	this.stateStageType = statestagetype;
	if (item.hasOwnProperty('type'))
	{
		this.classType = item.type;
		var classobject = this.parentSide.getUIDClassMap(this.classType);
		if (classobject != null)
		{
			for (const [key, value] of classobject) {
				if (item.state.hasOwnProperty('ios'))
				{
					if (item.state.ios == g_isIOS)
					{
						
						var arstate = new ARState(item.state, this.parentSide, this.parentObject, this.stateStageType, ObjectTypeEnum.CLASSSTATE, value, key, this.classType);
						_this.arStatesArray.push(arstate);
					}
				}
				else
				{
					var arstate = new ARState(item.state, this.parentSide, this.parentObject, this.stateStageType, ObjectTypeEnum.CLASSSTATE, value, key, this.classType);
					_this.arStatesArray.push(arstate);
				}
			}			
		}
	}

	
}

ARClassState.prototype.constructor = ARClassState;

ARClassState.prototype.initialise = function(){
	for (let i = 0; i < this.arStatesArray.length; i++)
	{
		this.arStatesArray[i].initialise();
	}
}

ARClassState.prototype.update = function(){
	for (let i = 0; i < this.arStatesArray.length; i++)
	{
		switch (this.stateStageType) {
		case StateStageTypeEnum.STAGEOPENING:
			if (this.arStatesArray[i].getStateOrder() == this.parentSide.getCurrentOpeningStateOrder())
			{
				this.arStatesArray[i].update();
			}
			break;
		case StateStageTypeEnum.STAGEUPDATE: 
			if (this.arStatesArray[i].getStateOrder() == this.parentSide.getCurrentStateOrder())
			{
				this.arStatesArray[i].update();
			}
			break;
		case StateStageTypeEnum.STAGECLOSING: 
			if (this.arStatesArray[i].getStateOrder() == this.parentSide.getCurrentClosingStateOrder())
			{
				this.arStatesArray[i].update();
			}
			break;
		case StateStageTypeEnum.STAGETIMEOUT: 
			if (this.arStatesArray[i].getStateOrder() == this.parentSide.getCurrentTimeoutStateOrder())
			{
				this.arStatesArray[i].update();
			}
			break;	
		}

	}
}

ARClassState.prototype.isActioning = function(){
	
	for (let i = 0; i < this.arStatesArray.length; i++)
	{
		switch (this.stateStageType) {
		case StateStageTypeEnum.STAGEOPENING:
			if ((this.arStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arStatesArray[i].getStateOrder() >= this.parentSide.getCurrentOpeningStateOrder()))
			{
				return true;
			}
			break;
		case StateStageTypeEnum.STAGEUPDATE:
			if ((this.arStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arStatesArray[i].getStateOrder() >= this.parentSide.getCurrentStateOrder()))
			{
				return true;
			}
			break;
		case StateStageTypeEnum.STAGECLOSING: 		
			if ((this.arStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arStatesArray[i].getStateOrder() >= this.parentSide.getCurrentClosingStateOrder()))
			{
				return true;
			}
			break;
		case StateStageTypeEnum.STAGETIMEOUT: 		
			if ((this.arStatesArray[i].getCurrentStatus() == StateStatusEnum.ACTIONING) && (this.arStatesArray[i].getStateOrder() >= this.parentSide.getCurrentTimeoutStateOrder()))
			{
				return true;
			}
			break;	
		}
	}
	return false;
}

ARClassState.prototype.dispose = function(){
	this.parentSide = null;
	this.parentObject = null;
	this.classType = null;
	this.stateStageType = null;
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
}