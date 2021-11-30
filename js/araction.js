
const ActionTypeEnum = {
	ENABLED : 0,
	POSITION : 1,
	POSITIONX : 2,
	POSITIONY : 3,
	POSITIONZ : 4,
	ROTATION : 5,
	ROTATIONX : 6,
	ROTATIONY : 7,
	ROTATIONZ : 8,
	STATEORDER : 9,
	PLAYNOW : 10,
	PLAYAFTER : 11,
	PLAYNEXT : 12,
	VISIBLE : 13,
	ACTIVEMULTIPLIER : 14,
	ADDVELOCITY : 15,
	VELOCITY : 16,
	VELOCITYX : 17,
	VELOCITYY : 18,
	VELOCITYZ : 19,
	ACCELERATION : 20,
	ACCELERATIONX : 21,
	ACCELERATIONY : 22,
	ACCELERATIONZ : 23,
	RADIUSSCALE : 24,
	RADIUSSCALEX : 25,
	RADIUSSCALEY : 26,
	RADIUSSCALEZ : 27,
	VOLUME : 28,
	PLAY : 29,
	PAUSE : 30,
	ADDMODEL : 31,
	ADDCHARACTER : 32,
	ADDGROUP : 33,
	ADDCLASS : 34,
	SPEAK : 35,
	LISTEN : 36,
	INPUT : 37,
	INPUTUID : 38,
	STOP : 39,
	ANGLE : 40,
	ADDANGLE : 41,
	MOVEX : 42,
	MOVEY : 43,
	MOVEZ : 44,
	MOVE : 45,
	CANCELMOVE : 46,
	VALUE : 47,
	REMOVEPHYSICS : 48,
	ADDLOCALPHYSICS : 49,
	ADDINITPHYSICS : 50,
	ADDPHYSICSAT : 51,
	ADDPHYSICSGROUP : 52,
	REMOVEPHYSICSGROUP : 53,
	ADDCONSTRAINT : 54,
	FORWARDIMPULSE : 55,
	UPIMPULSE : 56,
	MASS : 57
}

ARAction = function(item, parentside, parentobject, parentstate, statestagetype) {
	var _this = this;
	this.UID = null;
	this.parentSide = parentside;
	this.parentObject = parentobject;
	this.parentState = parentstate;
	this.actionOrder = 1;
	this.object1 = null;
	this.object1Array = new Array;
	this.objectType1 = null;
	this.object2 = null;
	this.object2Array = new Array;
	this.objectType2 = null;
	this.objectPropertyType2 = null;
	this.actionType = null;
	this.actionStartValue = null;
	this.actionValue = null;
	this.offsetValue = null;
	this.startStateCallbackUID = null;
	this.endStateCallbackUID = null;
	this.errorStateCallbackUID = null;
	this.resultStateCallbackUID = null;
	this.timeoutStateCallbackUID = null;
	this.lerpValue;
	this.lerpedValues  = new Array;
	this.transition = 0; 	
	this.actionClock = new THREE.Clock();
	this.isCumulativeSpeed = false;
	this.cumulativeSpeed = 10;
	this.duration = 0.4;
	this.afterValue = null;
	this.cumulativeSpeedStart = null;
	this.cumulativeSpeedEnd = null;
	this.lerpSpeedValue;
	this.lerpedSpeedValues  = new Array;
	this.actionSpeed = 10;
	this.isSpeedPresent = false;
	this.isActionComplete = false;
	this.initialiseSuccess = true;
	this.scaleFactor = 1;
	this.stateStageType = statestagetype;
	this.constantSpeed = false;
	this.distanceRatio = 0;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.ACTION);
	}
	if (item.hasOwnProperty('character'))
	{
		switch (item.character.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.CHARACTER);
			}
			break;
		default:
			if (item.character.toLowerCase().indexOf('classall:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.CHARACTER) this.object1Array.push(value);
					}
				}
			}
			else if (item.character.toLowerCase().indexOf('classalluid:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.CHARACTER);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			else
			{
				this.object1 = this.parentSide.getUIDObjectMap(item.character, ObjectTypeEnum.CHARACTER);
			}
			break;
		}
		this.objectType1 = ObjectTypeEnum.CHARACTER;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('model'))
	{
		switch (item.model.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.MODEL) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.MODEL);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MODEL);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.model, ObjectTypeEnum.MODEL);
			break;
		}
		this.objectType1 = ObjectTypeEnum.MODEL;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('light'))
	{
		switch (item.light.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.LIGHT) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.LIGHT);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.LIGHT);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.light, ObjectTypeEnum.LIGHT);
			break;
		}
		this.objectType1 = ObjectTypeEnum.LIGHT;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	/* if (item.hasOwnProperty('physics'))
	{
		switch (item.physics.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;	
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.physics, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	} */
	
	if (item.hasOwnProperty('physics'))
	{
		switch (item.physics.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			if ((item.physics.toLowerCase()).indexOf('classall:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.physics.substring(9));
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			else if ((item.physics.toLowerCase()).indexOf('classalluid:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.physics.substring(12));
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			else
			{
				this.object1 = this.parentSide.getUIDObjectMap(item.physics, ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('physicsbody'))
	{
		switch (item.physicsbody.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;		
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.physicsbody, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('physicsconstraint'))
	{
		switch (item.physicsconstraint.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSCONSTRAINT) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSCONSTRAINT);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSCONSTRAINT);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.physicsconstraint, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSCONSTRAINT;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('constraint'))
	{
		this.object1 = this.parentSide.getUIDObjectMap(item.constraint, ObjectTypeEnum.PHYSICSCONSTRAINT);
		this.objectType1 = ObjectTypeEnum.PHYSICSCONSTRAINT;
		if (this.object1 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('stage'))
	{
		this.object1 = this.parentSide.getUIDObjectMap(item.stage, ObjectTypeEnum.STAGE);
		this.objectType1 = ObjectTypeEnum.STAGE;
		if (this.object1 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('group'))
	{
		switch (item.group.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.GROUP) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.GROUP);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.GROUP);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.group, ObjectTypeEnum.GROUP);
			break;
		}
		this.objectType1 = ObjectTypeEnum.GROUP;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('waypoint'))
	{
		switch (item.waypoint.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.WAYPOINT) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.WAYPOINT);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.WAYPOINT);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.waypoint, ObjectTypeEnum.WAYPOINT);
			break;
		}
		this.objectType1 = ObjectTypeEnum.WAYPOINT;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('state'))
	{
		this.object1 = this.parentSide.getUIDObjectMap(item.state, ObjectTypeEnum.STATE);
		this.objectType1 = ObjectTypeEnum.STATE;
		if (this.object1 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('meshbutton'))
	{
		switch (item.meshbutton.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.MESHBUTTON) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.MESHBUTTON);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MESHBUTTON);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.meshbutton, ObjectTypeEnum.MESHBUTTON);
			break;
		}
		this.objectType1 = ObjectTypeEnum.MESHBUTTON;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('screenbutton'))
	{
		switch (item.screenbutton.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.SCREENBUTTON) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.SCREENBUTTON);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.SCREENBUTTON);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.screenbutton, ObjectTypeEnum.SCREENBUTTON);
			break;
		}
		this.objectType1 = ObjectTypeEnum.SCREENBUTTON;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('videotexture'))
	{
		switch (item.videotexture.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					if (value.getType() == ObjectTypeEnum.VIDEOTEXTURE) this.object1Array.push(value);
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.VIDEOTEXTURE);
						if (object != undefined) this.object1Array.push(object);
					}
				}
			}
			break;				
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.VIDEOTEXTURE);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.videotexture, ObjectTypeEnum.VIDEOTEXTURE);
			break;
		}
		this.objectType1 = ObjectTypeEnum.VIDEOTEXTURE;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('colourchange'))
	{
		switch (item.colourchange.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					if (value.getType() == ObjectTypeEnum.COLOURCHANGE) this.object1Array.push(value);
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.COLOURCHANGE);
						if (object != undefined) this.object1Array.push(object);
					}
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.COLOURCHANGE);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.colourchange, ObjectTypeEnum.COLOURCHANGE);
			break;
		}
		this.objectType1 = ObjectTypeEnum.COLOURCHANGE;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('meshlabel'))
	{
		switch (item.meshlabel.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					if (value.getType() == ObjectTypeEnum.MESHLABEL) this.object1Array.push(value);
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.MESHLABEL);
						if (object != undefined) this.object1Array.push(object);
					}
				}
			}
			break;				
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MESHLABEL);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.meshlabel, ObjectTypeEnum.MESHLABEL);
			break;
		}
		this.objectType1 = ObjectTypeEnum.MESHLABEL;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('particleemitter'))
	{
		switch (item.particleemitter.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					if (value.getType() == ObjectTypeEnum.PARTICLEEMITTER) this.object1Array.push(value);
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PARTICLEEMITTER);
						if (object != undefined) this.object1Array.push(object);
					}
				}
			}
			break;					
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PARTICLEEMITTER);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.particleemitter, ObjectTypeEnum.PARTICLEEMITTER);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PARTICLEEMITTER;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('audioclip'))
	{
		switch (item.audioclip.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.AUDIOCLIP) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.AUDIOCLIP);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;					
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.AUDIOCLIP);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.audioclip, ObjectTypeEnum.AUDIOCLIP);
			break;
		}
		this.objectType1 = ObjectTypeEnum.AUDIOCLIP;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('texttospeech'))
	{
		switch (item.texttospeech.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.TEXTTOSPEECH) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.TEXTTOSPEECH);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;			
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.TEXTTOSPEECH);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.texttospeech, ObjectTypeEnum.TEXTTOSPEECH);
			break;
		}
		this.objectType1 = ObjectTypeEnum.TEXTTOSPEECH;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('speechtotext'))
	{
		switch (item.speechtotext.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.SPEECHTOTEXT) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.SPEECHTOTEXT);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;				
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.SPEECHTOTEXT);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.speechtotext, ObjectTypeEnum.SPEECHTOTEXT);
			break;
		}
		this.objectType1 = ObjectTypeEnum.SPEECHTOTEXT;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('dialogengine'))
	{
		switch (item.dialogengine.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.DIALOGENGINE) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.DIALOGENGINE);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;					
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.DIALOGENGINE);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.dialogengine, ObjectTypeEnum.DIALOGENGINE);
			break;
		}
		this.objectType1 = ObjectTypeEnum.DIALOGENGINE;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	if (item.hasOwnProperty('class'))
	{
		this.object1 = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.class);
		this.objectType1 = ObjectTypeEnum.CLASS;
		if (this.object1 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('speed'))
	{
		if ((item.speed.hasOwnProperty('start')) && (item.speed.hasOwnProperty('end')))
		{
			this.isCumulativeSpeed = true;
			this.cumulativeSpeedStart = item.speed.start;
			this.cumulativeSpeedEnd = item.speed.end;
			if (item.speed.hasOwnProperty('accumulator'))
			{
				this.cumulativeSpeed = item.speed.accumulator;
			}
		}
		else
		{
			this.isSpeedPresent = true;
			this.actionSpeed = item.speed;
		}
		if (item.hasOwnProperty('constantspeed'))
		{
			this.constantSpeed = item.constantspeed;
		}
	}
	
	
	if (item.hasOwnProperty('order'))
	{
		this.actionOrder = item.order;
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.actionType = ActionTypeEnum.ENABLED;
		this.actionValue = item.enabled;
	}
	
	if (item.hasOwnProperty('stateorder'))
	{
		this.actionType = ActionTypeEnum.STATEORDER;
		this.actionValue = item.stateorder;
		this.objectType1 = ObjectTypeEnum.PARENTOBJECT;
	}
	
	if (item.hasOwnProperty('position'))
	{
		this.actionType = ActionTypeEnum.POSITION;
		if ((item.position.hasOwnProperty('x')) && (item.position.hasOwnProperty('Y')) && (item.position.hasOwnProperty('z')))
		{
			this.actionValue = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
		}
		else
		{
			var values = item.position.split(",");
			if (values.length == 2)
			{
				this.actionValue = new THREE.Vector3(values[0], values[1], values[2]);
			}
			else
			{
				this.initialiseSuccess = false;
			}
		}
	}
	
	if (item.hasOwnProperty('pos'))
	{
		if ((item.pos.hasOwnProperty('x')) && (item.pos.hasOwnProperty('y')) && (item.pos.hasOwnProperty('z')))
		{
			this.actionValue = new THREE.Vector3(item.pos.x, item.pos.y, item.pos.z);
		}
		else
		{
			var entry = item.pos;
			var values = entry.split(",");
			if (values.length == 2)
			{
				this.actionValue = new THREE.Vector3(values[0], values[1], values[2]);
			}
			else
			{
				this.initialiseSuccess = false;
			}
		}
		

	}
	
	if (item.hasOwnProperty('x'))
	{
		this.actionType = ActionTypeEnum.POSITIONX;
		this.actionValue = item.x;
	}
	
	if (item.hasOwnProperty('y'))
	{
		this.actionType = ActionTypeEnum.POSITIONY;
		this.actionValue = item.y;
	}
	
	if (item.hasOwnProperty('z'))
	{
		this.actionType = ActionTypeEnum.POSITIONZ;
		this.actionValue = item.z;
	}
	
	if (item.hasOwnProperty('rotation'))
	{
		this.actionType = ActionTypeEnum.ROTATION;
		var values = item.rotation.split(",");
		if (values.length == 2)
		{
			this.actionValue = new THREE.Vector3(values[0], values[1], values[2]);
		}
		else
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('rotx'))
	{
		this.actionType = ActionTypeEnum.ROTATIONX;
		this.actionValue = item.rotx;
	}
	
	if (item.hasOwnProperty('roty'))
	{
		this.actionType = ActionTypeEnum.ROTATIONY;
		this.actionValue = item.roty;
	}
	
	if (item.hasOwnProperty('rotz'))
	{
		this.actionType = ActionTypeEnum.ROTATIONZ;
		this.actionValue = item.rotz;
	}
	
	if (item.hasOwnProperty('playnow'))
	{
		this.actionType = ActionTypeEnum.PLAYNOW;
		this.actionValue = item.playnow;
	}
	
	if (item.hasOwnProperty('playafter'))
	{
		this.actionType = ActionTypeEnum.PLAYAFTER;
		this.actionValue = item.playafter;
	}
	
	if (item.hasOwnProperty('visible'))
	{
		this.actionType = ActionTypeEnum.VISIBLE;
		this.actionValue = item.visible;
	}
	
	if (item.hasOwnProperty('activemultiplier'))
	{
		this.actionType = ActionTypeEnum.ACTIVEMULTIPLIER;
		this.actionValue = item.activemultiplier;
	}
	
	if (item.hasOwnProperty('velocity'))
	{
		this.actionType = ActionTypeEnum.VELOCITY;
		this.actionValue = item.velocity;
	}
	
	if (item.hasOwnProperty('addvelocity'))
	{
		this.actionType = ActionTypeEnum.ADDVELOCITY;
		this.actionValue = item.addvelocity;
	}
	
	if (item.hasOwnProperty('velocityx'))
	{
		this.actionType = ActionTypeEnum.VELOCITYX;
		this.actionValue = item.velocityx;
	}
	
	if (item.hasOwnProperty('velocityy'))
	{
		this.actionType = ActionTypeEnum.VELOCITYY;
		this.actionValue = item.velocityy;
	}
	
	if (item.hasOwnProperty('velocityz'))
	{
		this.actionType = ActionTypeEnum.VELOCITYZ;
		this.actionValue = item.velocityz;
	}
	
	if (item.hasOwnProperty('acceleration'))
	{
		this.actionType = ActionTypeEnum.ACCELERATION;
		this.actionValue = item.acceleration;
	}
	
	if (item.hasOwnProperty('accelerationx'))
	{
		this.actionType = ActionTypeEnum.ACCELERATIONX;
		this.actionValue = item.accelerationx;
	}
	
	if (item.hasOwnProperty('accelerationy'))
	{
		this.actionType = ActionTypeEnum.ACCELERATIONY;
		this.actionValue = item.accelerationy;
	}
	
	if (item.hasOwnProperty('accelerationz'))
	{
		this.actionType = ActionTypeEnum.ACCELERATIONZ;
		this.actionValue = item.accelerationz;
	}
	
	if (item.hasOwnProperty('radiusscale'))
	{
		this.actionType = ActionTypeEnum.RADIUSSCALE;
		this.actionValue = item.radiusscale;
	}
	
	if (item.hasOwnProperty('radiusscalex'))
	{
		this.actionType = ActionTypeEnum.RADIUSSCALEX;
		this.actionValue = item.radiusscalex;
	}
	
	if (item.hasOwnProperty('radiusscaley'))
	{
		this.actionType = ActionTypeEnum.RADIUSSCALEY;
		this.actionValue = item.radiusscaley;
	}
	
	if (item.hasOwnProperty('radiusscalez'))
	{
		this.actionType = ActionTypeEnum.RADIUSSCALEZ;
		this.actionValue = item.radiusscalez;
	}
	
	if (item.hasOwnProperty('volume'))
	{
		this.actionType = ActionTypeEnum.VOLUME;
		this.actionValue = item.volume;
	}
	
	if (item.hasOwnProperty('play'))
	{
		this.actionType = ActionTypeEnum.PLAY;
		this.actionValue = item.play;
		if (this.objectType1 == ObjectTypeEnum.CHARACTER)
		{
			if (item.hasOwnProperty('after'))
			{
				this.afterValue = item.after;
				this.actionType = ActionTypeEnum.PLAYAFTER;
			}
		}
	}
	
	if (item.hasOwnProperty('playnext'))
	{
		this.actionType = ActionTypeEnum.PLAYNEXT;
		this.actionValue = item.playnext;
	}
	
	if (item.hasOwnProperty('pause'))
	{
		this.actionType = ActionTypeEnum.PAUSE;
		this.actionValue = item.pause;
	}
	
	if (item.hasOwnProperty('mass'))
	{
		this.actionType = ActionTypeEnum.MASS;
		this.actionValue = item.mass;
	}
	
	if (item.hasOwnProperty('addmodel'))
	{
		this.actionType = ActionTypeEnum.ADDMODEL;
		switch (item.addmodel.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MODEL);
			}
			break;
		default:
			this.actionValue = this.parentSide.getUIDObjectMap(item.addmodel, ObjectTypeEnum.MODEL);
			break;
		}
		
	}
	
	if (item.hasOwnProperty('addcharacter'))
	{
		
		this.actionType = ActionTypeEnum.ADDCHARACTER;
		switch (item.addcharacter.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.CHARACTER);
			}
			break;
		default:
			this.actionValue = this.parentSide.getUIDObjectMap(item.addcharacter, ObjectTypeEnum.CHARACTER);
			break;
		}
	}
	
	if (item.hasOwnProperty('addgroup'))
	{
		this.actionType = ActionTypeEnum.ADDGROUP;
		switch (item.addgroup.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.GROUP);
			}
			break;
		default:
			this.actionValue = this.parentSide.getUIDObjectMap(item.addgroup, ObjectTypeEnum.GROUP);
			break;
		}
	}
	
/* 	if (item.hasOwnProperty('addphysicsgroup'))
	{
		this.actionType = ActionTypeEnum.ADDPHYSICSGROUP;
		switch (item.addphysicsgroup.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object2Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object2Array.push(object);
				}
			}
			break;		
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.addphysicsgroup, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object2 == null) && (this.object2Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
		
		
	} */
	
	if (item.hasOwnProperty('addphysicsgroup'))
	{
		this.actionType = ActionTypeEnum.ADDPHYSICSGROUP;
		switch (item.addphysicsgroup.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			if ((item.addphysicsgroup.toLowerCase()).indexOf('classall:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addphysicsgroup.substring(9));
				if (classobject != undefined)
				{
					
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object2Array.push(value);
					}
				}
			}
			else if ((item.addphysicsgroup.toLowerCase()).indexOf('classalluid:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addphysicsgroup.substring(12));
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object2Array.push(object);
				}
			}
			else
			{
				this.object2 = this.parentSide.getUIDObjectMap(item.addphysicsgroup, ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		}
		this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object2 == null) && (this.object2Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	
	if (item.hasOwnProperty('removephysicsgroup'))
	{
		this.actionType = ActionTypeEnum.REMOVEPHYSICSGROUP;
		switch (item.removephysicsgroup.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			if ((item.removephysicsgroup.toLowerCase()).indexOf('classall:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.removephysicsgroup.substring(9));
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object2Array.push(value);
					}
				}
			}
			else if ((item.removephysicsgroup.toLowerCase()).indexOf('classalluid:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.removephysicsgroup.substring(12));
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object2Array.push(object);
				}
			}
			else
			{
				this.object2 = this.parentSide.getUIDObjectMap(item.removephysicsgroup, ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		}
		if ((this.object2 == null) && (this.object2Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('addphysicsat'))
	{
		this.actionType = ActionTypeEnum.ADDPHYSICSAT;
		if (item.addphysicsat.hasOwnProperty('position'))
		{
			this.actionValue = new THREE.Vector3(0, 0, 0);
			if (item.addphysicsat.position.hasOwnProperty('x'))
			{
				this.actionValue.x = item.addphysicsat.position.x; 
			}
			if (item.addphysicsat.position.hasOwnProperty('y'))
			{
				this.actionValue.y = item.addphysicsat.position.y;
			}
			if (item.addphysicsat.position.hasOwnProperty('z'))
			{
				this.actionValue.z = item.addphysicsat.position.z;
			}
			this.initialiseSuccess = true;
		}
		else
		{
			switch (item.addphysicsat.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MODEL);
				}
				break;
			default:
				if ((item.addphysicsat.toLowerCase()).indexOf('classall:') != -1)
				{
					var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addphysicsat.substring(9));
					if (classobject != undefined)
					{
						for (const [key, value] of classobject) {
							if (value.getType() == ObjectTypeEnum.MODEL) this.object2Array.push(value);
						}
					}
				}
				else if ((item.addphysicsat.toLowerCase()).indexOf('classalluid:') != -1)
				{
					var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addphysicsat.substring(12));
					for (const [key, value] of classobject) {
						var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.MODEL);
						if (object != undefined) this.object2Array.push(object);
					}
				}
				else
				{
					this.object2 = this.parentSide.getUIDObjectMap(item.addphysicsat, ObjectTypeEnum.MODEL);
				}
				break;
			}
			this.objectType2 = ObjectTypeEnum.MODEL;
			if ((this.object2 == null) && (this.object2Array.length == 0))
			{
				this.initialiseSuccess = false;
			}
		}
	}
	
	/* if (item.hasOwnProperty('removephysicsgroup'))
	{
		this.actionType = ActionTypeEnum.REMOVEPHYSICSGROUP;
		switch (item.removephysicsgroup.toLowerCase()) {
			case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentState.getClassObject().getUID();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.actionValue = this.parentState.getClassUID();
			}
			break;
		default:
			this.actionValue = item.removephysicsgroup;
			break;
		}
	} */
	
	
	if (item.hasOwnProperty('addclass'))
	{
		this.actionType = ActionTypeEnum.ADDCLASS;
		this.actionValue = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addclass);
	}
	
	
	if (item.hasOwnProperty('removephysics'))
	{
		this.actionType = ActionTypeEnum.REMOVEPHYSICS;
		switch (item.removephysics.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.removephysics, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if (this.object1 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
/* 	if (item.hasOwnProperty('addlocalphysics'))
	{
		this.actionType = ActionTypeEnum.ADDLOCALPHYSICS;
		switch (item.addlocalphysics.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;		
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.addlocalphysics, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	} */
	
	if (item.hasOwnProperty('addlocalphysics'))
	{
		this.actionType = ActionTypeEnum.ADDLOCALPHYSICS;
		switch (item.addlocalphysics.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			if ((item.addlocalphysics.toLowerCase()).indexOf('classall:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addlocalphysics.substring(9));
				if (classobject != undefined)
				{
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			else if ((item.addlocalphysics.toLowerCase()).indexOf('classalluid:') != -1)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, item.addlocalphysics.substring(12));
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			else
			{
				this.object1 = this.parentSide.getUIDObjectMap(item.addlocalphysics, ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('addinitphysics'))
	{
		this.actionType = ActionTypeEnum.ADDINITPHYSICS;
		switch (item.addinitphysics.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSBODY) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSBODY);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;		
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.addinitphysics, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSBODY;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('addconstraint'))
	{
		this.actionType = ActionTypeEnum.ADDCONSTRAINT;
		switch (item.addconstraint.toLowerCase()) {
		case "classall":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				if (classobject != undefined)
				{				
					for (const [key, value] of classobject) {
						if (value.getType() == ObjectTypeEnum.PHYSICSCONSTRAINT) this.object1Array.push(value);
					}
				}
			}
			break;
		case "classalluid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				var classobject = this.parentSide.getUIDObjectMap(null, ObjectTypeEnum.CLASS, this.parentState.getClassType());
				for (const [key, value] of classobject) {
					var object = this.parentSide.getUIDObjectMap(key, ObjectTypeEnum.PHYSICSCONSTRAINT);
					if (object != undefined) this.object1Array.push(object);
				}
			}
			break;		
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object1 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSCONSTRAINT);
			}
			break;
		default:
			this.object1 = this.parentSide.getUIDObjectMap(item.addconstraint, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.objectType1 = ObjectTypeEnum.PHYSICSCONSTRAINT;
		if ((this.object1 == null) && (this.object1Array.length == 0))
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('forwardimpulse'))
	{
		this.actionType = ActionTypeEnum.FORWARDIMPULSE;
		switch (item.forwardimpulse.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.forwardimpulse, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
		if (this.object2 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
	if (item.hasOwnProperty('upimpulse'))
	{
		this.actionType = ActionTypeEnum.UPIMPULSE;
		switch (item.upimpulse.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.upimpulse, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
		if (this.object2 == null)
		{
			this.initialiseSuccess = false;
		}
	}
	
	
	

	if (item.hasOwnProperty('duration'))
	{
		this.duration = item.duration;
	}
	
	if (item.hasOwnProperty('listen'))
	{
		this.actionType = ActionTypeEnum.LISTEN;
		this.actionValue = item.enabled;
	}
	
	if (item.hasOwnProperty('speak'))
	{
		this.actionType = ActionTypeEnum.SPEAK;
		this.actionValue = item.speak;
	}
	
	if (item.hasOwnProperty('input'))
	{
		this.actionType = ActionTypeEnum.INPUT;
		this.actionValue = item.input;
	}
	
	if (item.hasOwnProperty('stop'))
	{
		this.actionType = ActionTypeEnum.STOP;
		this.actionValue = item.stop;
	}
	
	if (item.hasOwnProperty('inputuid'))
	{
		this.actionType = ActionTypeEnum.INPUTUID;
		this.actionValue = item.inputuid;
	}
	
	if (item.hasOwnProperty('angle'))
	{
		this.actionType = ActionTypeEnum.ANGLE;
		this.actionValue = item.angle;
	}
	
	if (item.hasOwnProperty('addangle'))
	{
		this.actionType = ActionTypeEnum.ADDANGLE;
		this.actionValue = item.addangle;
	}
	
	if (item.hasOwnProperty('movex'))
	{
		this.actionType = ActionTypeEnum.MOVEX;
		this.actionValue = new THREE.Vector3(item.movex, 0, 0);
	}
	
	if (item.hasOwnProperty('movey'))
	{
		this.actionType = ActionTypeEnum.MOVEY;
		this.actionValue = new THREE.Vector3(0, item.movey, 0);
	}
	
	if (item.hasOwnProperty('movez'))
	{
		this.actionType = ActionTypeEnum.MOVEZ;
		this.actionValue = new THREE.Vector3(0, 0, item.movez);
	}
	
	if (item.hasOwnProperty('move'))
	{
		if (item.move === false)
		{
			this.actionType = ActionTypeEnum.CANCELMOVE
			this.actionValue = item.move;
		}
		else
		{			
			this.actionType = ActionTypeEnum.MOVE;
			this.actionValue = new THREE.Vector3(0, 0, 0);
			if (item.move.hasOwnProperty('x'))
			{
				this.actionValue.x = item.move.x;
			}			
			if (item.move.hasOwnProperty('y'))
			{
				this.actionValue.y = item.move.y;
			}
			if (item.move.hasOwnProperty('x'))
			{
				this.actionValue.z = item.move.z;
			}
		}
	}
	
	if (item.hasOwnProperty('value'))
	{
		this.actionType = ActionTypeEnum.VALUE;
		if (item.hasOwnProperty('character2'))
		{
			switch (item.character.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.CHARACTER);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.character2, ObjectTypeEnum.CHARACTER);
				break;
			}
			this.objectType2 = ObjectTypeEnum.CHARACTER;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		if (item.hasOwnProperty('model2'))
		{
			switch (item.model2.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MODEL);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.model2, ObjectTypeEnum.MODEL);
				break;
			}
			this.objectType2 = ObjectTypeEnum.MODEL;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		if (item.hasOwnProperty('physics2'))
		{
			switch (item.physics2.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.physics2, ObjectTypeEnum.PHYSICSBODY);
				break;
			}
			this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		
		if (item.hasOwnProperty('physicsbody2'))
		{
			switch (item.physicsbody2.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSBODY);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.physicsbody2, ObjectTypeEnum.PHYSICSBODY);
				break;
			}
			this.objectType2 = ObjectTypeEnum.PHYSICSBODY;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		
		
		
		if (item.hasOwnProperty('group2'))
		{
			switch (item.group2.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.GROUP);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.group2, ObjectTypeEnum.GROUP);
				break;
			}
			this.objectType2 = ObjectTypeEnum.GROUP;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		if (item.hasOwnProperty('waypoint2'))
		{
			switch (item.waypoint2.toLowerCase()) {
			case "classitem":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentState.getClassObject();
				}
				break;
			case "classitemuid":
				if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
				{
					this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.WAYPOINT);
				}
				break;
			default:
				this.object2 = this.parentSide.getUIDObjectMap(item.waypoint2, ObjectTypeEnum.WAYPOINT);
				break;
			}
			this.objectType2 = ObjectTypeEnum.WAYPOINT;
			if (this.object2 == null)
			{
				this.initialiseSuccess = false;
			}
		}
		switch (item.value.toLowerCase()) {
		case "userdata":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.USERDATA;
			break;
		case "position":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.POSITION;
			break;
		case "posx":
		case "positionx":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.POSITIONX;
			break;
		case "posy":
		case "positiony":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.POSITIONY;
			break;
		case "posz":
		case "positionz":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.POSITIONZ;
			break;
		case "rot":
		case "rotation":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.ROTATION;
			break;
		case "rotx":
		case "rotationx":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.ROTATIONX;
			break;
		case "roty":
		case "rotationy":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.ROTATIONY;
			break;
		case "rotz":
		case "rotationz":
			this.objectPropertyType2 = ObjectPropertyTypeEnum.ROTATIONZ;
			break;			
		}
	}

	if (item.hasOwnProperty('startstate'))
	{		
		this.startStateCallbackUID = item.startstate;
	}
	if (item.hasOwnProperty('endstate'))
	{			
		this.endStateCallbackUID = item.endstate;
	}
	if (item.hasOwnProperty('errorstate'))
	{			
		this.errorStateCallbackUID = item.errorstate;
	}
	if (item.hasOwnProperty('resultstate'))
	{			
		this.resultStateCallbackUID = item.resultstate;
	}
	if (item.hasOwnProperty('timeoutstate'))
	{			
		this.timeoutStateCallbackUID = item.timeoutstate;
	}
	if (item.hasOwnProperty('scaled'))
	{			
		this.scaleFactor = item.scaled;
	}
	if (item.hasOwnProperty('scale'))
	{			
		this.scaleFactor = item.scale;
	}
	if (item.hasOwnProperty('offset'))
	{
		if (item.offset.hasOwnProperty('position'))
		{
			this.offsetValue = new THREE.Vector3(0, 0, 0);
			if (item.offset.position.hasOwnProperty('x'))
			{
				this.offsetValue.x = item.offset.position.x;
			}			
			if (item.offset.position.hasOwnProperty('y'))
			{
				this.offsetValue.y = item.offset.position.y;
			}
			if (item.offset.position.hasOwnProperty('x'))
			{
				this.offsetValue.z = item.offset.position.z;
			}
		}
		else
		{
			this.offsetValue = item.offset;
		}
	}

}

ARAction.prototype.constructor = ARAction;

ARAction.prototype.initialise = function(){
	
	this.isActionComplete = false;
	this.transition = 0; 
	this.lerpValue = 0;
	this.distanceRatio = 0;
	this.lerpSpeedValue = 0;
	this.actionStartValue = null;
	this.actionClock.stop();
}

ARAction.prototype.getActionOrder = function(){
	
	return this.actionOrder;	
}

ARAction.prototype.getActionComplete = function(){
	
	return this.isActionComplete;	
}

ARAction.prototype.update = function(){
	var _this = this;
	
	if (this.initialiseSuccess)
	{
		if (this.isCumulativeSpeed)
		{
			switch (this.transition) {
			case 0:
				this.lerpSpeedValue = 0;
				break;
			case 1:
				if ((this.lerpSpeedValue < 1) )
				{
					this.lerpedSpeedValues.length = 0;
					var C = [this.cumulativeSpeedStart];
					var D = [this.cumulativeSpeedEnd];
					this.lerpedSpeedValues = lerp(C, D, this.lerpSpeedValue);
					this.actionSpeed = this.lerpedSpeedValues[0];
					this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
				}
				else
				{
					this.actionSpeed = this.cumulativeSpeedEnd;
					this.lerpSpeedValue = 1;
				}
				break;
			}				
		}
		switch (this.objectType1) {
		case ObjectTypeEnum.CHARACTER:
		case ObjectTypeEnum.MODEL:
		case ObjectTypeEnum.GROUP:
		case ObjectTypeEnum.PHYSICSBODY:
			switch (this.actionType) {
			case ActionTypeEnum.PLAY:
				if (this.objectType1 == ObjectTypeEnum.CHARACTER)
				{
					var actionid = this.object1.getActionID(this.actionValue);
					this.object1.prepareCrossFadeByID(actionid, this.duration, AnimationCrossFadeTypeEnum.IMMEDIATE);
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.PLAYAFTER:
				if (this.objectType1 == ObjectTypeEnum.CHARACTER)
				{
					if ((this.object1.getCurrentAnimationName() == this.afterValue) && (this.object1.getEffectiveWeightByName(this.afterValue) == 1))
					{
						var actionid = this.object1.getActionID(this.actionValue);
						this.object1.prepareCrossFadeByID(actionid, this.duration, AnimationCrossFadeTypeEnum.IMMEDIATE);
						this.isActionComplete = true;
					}
				}
				break;
			case ActionTypeEnum.PLAYNEXT:
				if (this.objectType1 == ObjectTypeEnum.CHARACTER)
				{
					var actionid = this.object1.getActionID(this.actionValue);
					this.object1.prepareCrossFadeByID(actionid, this.duration, AnimationCrossFadeTypeEnum.AFTERCURRENTLOOP);
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.ADDMODEL:
			case ActionTypeEnum.ADDCHARACTER:
			case ActionTypeEnum.ADDGROUP:
				if (this.objectType1 == ObjectTypeEnum.GROUP)
				{
					this.object1.addObject3D(this.actionValue);
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.ADDCLASS:
				if (this.objectType1 == ObjectTypeEnum.GROUP)
				{				
					for (const [key, value] of this.actionValue) {
						this.object1.addObject3D(value);
					}
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.REMOVEPHYSICS:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					this.object1.removePhysicsObject();
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.ADDLOCALPHYSICS:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						this.object1.addPhysicsLocalObject();
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].addPhysicsLocalObject();
						}
						this.isActionComplete = true;		
					}
						
				}
				break;
			case ActionTypeEnum.ADDINITPHYSICS:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						this.object1.addInitialisedPhysicsObject();
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].addInitialisedPhysicsObject();
						}
						this.isActionComplete = true;		
					}
				}
			case ActionTypeEnum.ADDPHYSICSAT:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						if ((this.object2 != null) && (this.objectType2 == ObjectTypeEnum.MODEL))
						{
							var pos = new THREE.Vector3().copy(this.object2.getCurrentPosition());
							if (this.offsetValue != null)
							{
								pos.add(this.offsetValue);
							}
							if (this.object2.getParentObject().getType() == ObjectTypeEnum.GROUP)
							{
								pos.applyQuaternion(this.object2.getParentObject().getCurrentQuaternion());
							}
							else
							{
								pos.applyQuaternion(this.object2.getCurrentQuaternion());
							}
							this.object1.addInitialisedPhysicsObject(pos);
						}
						else
						{
							if (this.actionValue != null)
							{
								if (this.offsetValue != null)
								{
									this.actionValue.add(this.offsetValue);
								}
								this.object1.addInitialisedPhysicsObject(this.actionValue);
							}
						}
						this.isActionComplete = true;
					}
					else
					{
						var pos = new THREE.Vector3();
						if ((this.object2 != null) && (this.objectType2 == ObjectTypeEnum.PHYSICSBODY))
						{
							pos.copy(this.object2.getCurrentPosition());
							if (this.offsetValue != null)
							{
								this.offsetValue.applyQuaternion(this.object2.getCurrentQuaternion());
								pos.add(this.offsetValue);
							}
						}
						else
						{
							if (this.actionValue != null)
							{
								if (this.offsetValue != null)
								{
									this.actionValue.add(this.offsetValue);
								}
								pos.copy(this.actionValue);
							}
						}
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].addInitialisedPhysicsObject(pos);
						}
						this.isActionComplete = true;		
					}
				}	
				break;
			case ActionTypeEnum.FORWARDIMPULSE:
				if ((this.objectType1 == ObjectTypeEnum.PHYSICSBODY) && (this.objectType2 == ObjectTypeEnum.PHYSICSBODY))
				{
					this.object1.applyLinearVelocity(this.object2.getForwardVector(), this.scaleFactor);
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.UPIMPULSE:
				if ((this.objectType1 == ObjectTypeEnum.PHYSICSBODY) && (this.objectType2 == ObjectTypeEnum.PHYSICSBODY))
				{
					this.object1.applyLinearVelocity(this.object2.getUpVector(), this.scaleFactor);
					this.isActionComplete = true;
				}
				break;
			case ActionTypeEnum.MASS:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						this.object1.setPhysicsMass(this.actionValue);
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].setPhysicsMass(this.actionValue);
						}
						this.isActionComplete = true;		
					}
				}
				break;	
			case ActionTypeEnum.ENABLED:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						this.object1.setEnabled(this.actionValue);
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].setEnabled(this.actionValue);
						}
						this.isActionComplete = true;		
					}
				}
				break;	
			case ActionTypeEnum.POSITION:
				switch (this.transition) {
				case 0:
					this.actionStartValue.clone(this.object1.getCurrentPosition());
					if (this.constantSpeed)
					{
						let totallength = this.actionStartValue.distanceTo(this.actionValue);
						this.distanceRatio = (1 / totallength) ;						
					}
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]);
						if (this.constantSpeed)
						{
							this.lerpValue = this.distanceRatio * (this.actionClock.getElapsedTime() / this.actionSpeed);
						}
						else
						{
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
					}
					else
					{
						this.object1.setCurrentPositionXYZ(this.actionValue[0], this.actionValue[1], this.actionValue[2]);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionX();
					if (this.constantSpeed)
					{
						let totallength = Math.abs(this.actionStartValue - this.actionValue);
						this.distanceRatio = (1 / totallength) ;						
					}
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(this.lerpedValues[0], null, null);
						if (this.constantSpeed)
						{
							this.lerpValue = this.distanceRatio * (this.actionClock.getElapsedTime() / this.actionSpeed);
						}
						else
						{
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
					}
					else
					{
						this.object1.setCurrentPositionXYZ(this.actionValue, null, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionY();
					if (this.constantSpeed)
					{
						let totallength = Math.abs(this.actionStartValue - this.actionValue);
						this.distanceRatio = (1 / totallength) ;						
					}
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(null, this.lerpedValues[0], null);
						if (this.constantSpeed)
						{
							this.lerpValue = this.distanceRatio * (this.actionClock.getElapsedTime() / this.actionSpeed);
						}
						else
						{
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
					}
					else
					{
						this.object1.setCurrentPositionXYZ(null, this.actionValue, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionZ();
					if (this.constantSpeed)
					{
						let totallength = Math.abs(this.actionStartValue - this.actionValue);
						this.distanceRatio = (1 / totallength) ;						
					}
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(null, null, this.lerpedValues[0]);
						if (this.constantSpeed)
						{
							this.lerpValue = this.distanceRatio * (this.actionClock.getElapsedTime() / this.actionSpeed);
						}
						else
						{
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
					}
					else
					{
						this.object1.setCurrentPositionXYZ(null, null, this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			case ActionTypeEnum.MOVEX:
			case ActionTypeEnum.MOVEY:
			case ActionTypeEnum.MOVEZ:
			case ActionTypeEnum.MOVE:
				this.object1.translateObject(this.actionValue, this.actionSpeed);
				this.isActionComplete = true;
				break;	
			case ActionTypeEnum.CANCELMOVE:
				this.object1.cancelTranslation(this.actionValue);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.ROTATION:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRotation().clone();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRotation(new THREE.Vector3(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]));
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRotation(new THREE.Vector3(this.actionValue[0], this.actionValue[1], this.actionValue[2]));
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			case ActionTypeEnum.ROTATIONX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRotationAngleX();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRotationAngleX(this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRotationAngleX(this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.ROTATIONY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRotationAngleY();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRotationAngleY(this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRotationAngleY(this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}		
				break;
			case ActionTypeEnum.ROTATIONZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRotationAngleZ();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRotationAngleZ(this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRotationAngleZ(this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			case ActionTypeEnum.VISIBLE:
				if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
				{
					if (this.object1 != null)
					{
						this.object1.setVisibilty(this.actionValue);
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].setVisibilty(this.actionValue);
						}
						this.isActionComplete = true;					
					}
				}
				break;
			case ActionTypeEnum.VALUE:
				switch (this.objectPropertyType2) {
				case ObjectPropertyTypeEnum.POSITION:
					if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
					{
						this.object1.setCurrentPosition(this.object2.getCurrentPosition());
					}
					break;
				case ObjectPropertyTypeEnum.POSITIONX:
					if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
					{
						this.object1.setCurrentPositionXYZ(this.object2.getCurrentPositionX(), null, null);
					}
					break;
				case ObjectPropertyTypeEnum.POSITIONY:
					if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
					{
						this.object1.setCurrentPositionXYZ(null, this.object2.getCurrentPositionY(), null);
					}
					break;
				case ObjectPropertyTypeEnum.POSITIONZ:
					if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
					{
						this.object1.setCurrentPositionXYZ(null, null, this.object2.getCurrentPositionZ());
					}
					break;
				case ObjectPropertyTypeEnum.ROTATION:
					if (this.objectType1 != ObjectTypeEnum.PHYSICSBODY)
					{
						this.object1.setCurrentRotation(this.object2.getCurrentRotation());
					}
					break;
				case ObjectPropertyTypeEnum.ROTATIONX:
					this.object1.setCurrentRotationAngleX(this.object2.getCurrentRotationAngleX());
					break;
				case ObjectPropertyTypeEnum.ROTATIONY:
					this.object1.setCurrentRotationAngleY(this.object2.getCurrentRotationAngleY());
					break;
				case ObjectPropertyTypeEnum.ROTATIONZ:
					this.object1.setCurrentRotationAngleZ(this.object2.getCurrentRotationAngleZ());
					break;			
				}
				
				break;			
			}
			break;
		case ObjectTypeEnum.LIGHT:
			switch (this.actionType) {
			case ActionTypeEnum.ENABLED:
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
				break;
			}
			break;
		case ObjectTypeEnum.PHYSICSCONSTRAINT:
			switch (this.actionType) {
			case ActionTypeEnum.VELOCITY:
				if (this.isSpeedPresent)
				{
					this.object1.setJointVelocityTarget(this.actionValue, this.actionSpeed);
				}
				else
				{
					this.object1.setJointVelocityTarget(this.actionValue);
				}
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.ADDVELOCITY:
				if (this.isSpeedPresent)
				{
					this.object1.addJointVelocityTarget(this.actionValue, this.actionSpeed);
				}
				else
				{
					this.object1.addJointVelocityTarget(this.actionValue);
				}
				this.isActionComplete = true;
				break;	
			case ActionTypeEnum.ANGLE:
				if (this.isSpeedPresent)
				{
					this.object1.setJointAngleTarget(this.actionValue, this.actionSpeed);
				}
				else
				{
					this.object1.setJointAngleTarget(this.actionValue);
				}
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.ADDANGLE:
				if (this.isSpeedPresent)
				{
					this.object1.addJointAngleTarget(this.actionValue, this.actionSpeed);
				}
				else
				{
					this.object1.addJointAngleTarget(this.actionValue);
				}
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.ENABLED:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSCONSTRAINT)
				{
					if (this.object1 != null)
					{
						this.object1.setEnabled(this.actionValue);
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].setEnabled(this.actionValue);
						}
						this.isActionComplete = true;		
					}
				}
				break;
			case ActionTypeEnum.ADDCONSTRAINT:
				if (this.objectType1 == ObjectTypeEnum.PHYSICSCONSTRAINT)
				{
					if (this.object1 != null)
					{
						this.object1.addPhysicsConstraint();
						this.isActionComplete = true;
					}
					else
					{
						for (let i = 0; i < this.object1Array.length; i++)
						{
							this.object1Array[i].addPhysicsConstraint();
						}
						this.isActionComplete = true;		
					}
				}
				break;
			}
			break;
		case ObjectTypeEnum.WAYPOINT:
			if (this.actionType == ActionTypeEnum.ENABLED)
			{
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
			}
			break;
		case ObjectTypeEnum.STATE:
			break;
		case ObjectTypeEnum.MESHLABEL:
			switch (this.actionType) {
			case ActionTypeEnum.VALUE:
				switch (this.objectPropertyType2) {
				case ObjectPropertyTypeEnum.USERDATA:
					this.object1.setText(this.object2.getUserData());
					this.isActionComplete = true;
					break;
				}					
				break;	
			}
			break;		
		case ObjectTypeEnum.MESHBUTTON:
			if (this.actionType == ActionTypeEnum.ENABLED)
			{
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
			}
			break;
		case ObjectTypeEnum.SCREENBUTTON:
			switch (this.actionType) {
			case ActionTypeEnum.ENABLED:
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
				break;
			case ActionTypeEnum.VISIBLE:
				if (this.object1 != null)
				{
					this.object1.setIsVisible(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setIsVisible(this.actionValue);
					}
					this.isActionComplete = true;		
				}
				break;	
			}
			break;	
		case ObjectTypeEnum.VIDEOTEXTURE:
			switch (this.actionType) {
			case ActionTypeEnum.PLAYNOW:
				this.object1.queueNextChapter(this.actionValue, false);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.PLAYAFTER:
				this.object1.queueNextChapter(this.actionValue, true);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.VOLUME:
/* 				if (this.isSpeedPresent)
				{
					switch (this.transition) {
					case 0:
						this.actionStartValue = this.object.getVolume();
						this.lerpValue = 0;
						this.actionClock.start();
						this.transition = 1; 
						break;
					case 1:
						if ((this.lerpValue < 1) )
						{
							this.lerpedValues.length = 0;
							var C = [this.actionStartValue];
							var D = [this.actionValue];
							this.lerpedValues = lerp(C, D, this.lerpValue);
							this.object.setVolume((this.lerpedValues[0], null);
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
						else
						{
							this.object.setVolume(this.actionValue, null);
							this.lerpValue = 0;
							this.actionClock.stop();
							this.transition = 2; 
						}
						break;
					case 2:
						this.actionStartValue = null;
						this.isActionComplete = true;
						break;			
					}	
				}
				else
				{
					this.object.setVolume(this.actionValue, null);
					this.isActionComplete = true;
				} */
				if (this.isSpeedPresent)
				{
					switch (this.transition) {
					case 0:
						this.actionStartValue = this.object1.getVolume();
						this.lerpValue = 0;
						this.actionClock.start();
						this.transition = 1; 
						break;
					case 1:
						if (this.lerpValue < 1)
						{
							this.lerpedValues.length = 0;
							var C = [this.actionStartValue];
							var D = [this.actionValue];
							this.lerpedValues = lerp(C, D, this.lerpValue);
							this.object1.setVolume(this.lerpedValues[0], null);
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
						else
						{
							this.object1.setVolume(this.actionValue, null);
							this.lerpValue = 0;
							this.actionClock.stop();
							this.transition = 2; 
						}
						break;
					case 2:
						break;						
					}
				}
				else
				{
					this.object1.setVolume(this.actionValue, null);
					this.isActionComplete = true;
				}
				break;
			}
			break;
		case ObjectTypeEnum.COLOURCHANGE:
			if (this.actionType == ActionTypeEnum.ENABLED)
			{
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
			}
			break;
		case ObjectTypeEnum.PARENTOBJECT:
			if (this.actionType == ActionTypeEnum.STATEORDER)
			{
				switch (this.stateStageType) {
				case StateStageTypeEnum.STAGEOPENING:
					this.parentObject.setCurrentOpeningStateOrder(this.actionValue);
					this.isActionComplete = true;
					break;
				case StateStageTypeEnum.STAGEUPDATE: 
					this.parentObject.setCurrentStateOrder(this.actionValue);
					this.isActionComplete = true;
					break;
				case StateStageTypeEnum.STAGECLOSING:
					this.parentSide.setCurrentClosingStateOrder(this.actionValue);
					this.isActionComplete = true;
					break;
				case StateStageTypeEnum.STAGETIMEOUT:
					this.parentSide.setCurrentTimeoutStateOrder(this.actionValue);
					this.isActionComplete = true;
					break;	
				}
			}
			break;
		case ObjectTypeEnum.PARTICLEEMITTER:
			switch (this.actionType) {
			case ActionTypeEnum.ENABLED:
				if (this.object1 != null)
				{
					this.object1.setEnabled(this.actionValue);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object1Array.length; i++)
					{
						this.object1Array[i].setEnabled(this.actionValue);
					}
					this.isActionComplete = true;		
				}
				break;
			case ActionTypeEnum.POSITION:
				switch (this.transition) {
				case 0:
					this.actionStartValue.clone(this.object1.getCurrentPosition());
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentPositionXYZ(this.actionValue[0], this.actionValue[1], this.actionValue[2]);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionX();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(this.lerpedValues[0], null, null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentPositionXYZ(this.actionValue, null, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionY();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(null, this.lerpedValues[0], null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentPositionXYZ(null, this.actionValue, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.POSITIONZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentPositionZ();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentPositionXYZ(null, null, this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentPositionXYZ(null, null, this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;				
			case ActionTypeEnum.ACTIVEMULTIPLIER:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getActiveMultiplier();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setActiveMultiplier(this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setActiveMultiplier(this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			case ActionTypeEnum.VELOCITY:
				switch (this.transition) {
				case 0:
					this.actionStartValue.clone(this.object1.getCurrentVelocity());
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentVelocityXYZ(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentVelocityXYZ(this.actionValue[0], this.actionValue[1], this.actionValue[2]);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.VELOCITYX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentVelocityX();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentVelocityXYZ(this.lerpedValues[0], null, null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentVelocityXYZ(this.actionValue, null, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;			
			case ActionTypeEnum.VELOCITYY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentVelocityY();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentVelocityXYZ(null, this.lerpedValues[0], null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentVelocityXYZ(null, this.actionValue, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;			
			case ActionTypeEnum.VELOCITYZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentVelocityZ();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentVelocityXYZ(null, null, this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentVelocityXYZ(null, null, this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;			
			case ActionTypeEnum.ACCELERATION:
				switch (this.transition) {
				case 0:
					this.actionStartValue.clone(this.object1.getCurrentAcceleration());
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentAccelerationXYZ(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentAccelerationXYZ(this.actionValue[0], this.actionValue[1], this.actionValue[2]);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.ACCELERATIONX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentAccelerationX();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentAccelerationXYZ(this.lerpedValues[0], null, null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentAccelerationXYZ(this.actionValue, null, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;	
			case ActionTypeEnum.ACCELERATIONY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentAccelerationY();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentAccelerationXYZ(null, this.lerpedValues[0], null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentAccelerationXYZ(null, this.actionValue, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;	
			case ActionTypeEnum.ACCELERATIONZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentAccelerationZ();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentAccelerationXYZ(null, null, this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentAccelerationXYZ(null, null, this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			case ActionTypeEnum.RADIUSSCALE:
				switch (this.transition) {
				case 0:
					this.actionStartValue.clone(this.object1.getCurrentRadiusScale());
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue[0], this.actionStartValue[1], this.actionStartValue[2]];
						var D = [this.actionValue[0], this.actionValue[1], this.actionValue[2]];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRadiusScaleXYZ(this.lerpedValues[0], this.lerpedValues[1], this.lerpedValues[2]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRadiusScaleXYZ(this.actionValue[0], this.actionValue[1], this.actionValue[2]);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}
				break;
			case ActionTypeEnum.RADIUSSCALEX:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRadiusScaleX();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRadiusScaleXYZ(this.lerpedValues[0], null, null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRadiusScaleXYZ(this.actionValue, null, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;	
			case ActionTypeEnum.RADIUSSCALEY:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRadiusScaleY();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRadiusScaleXYZ(null, this.lerpedValues[0], null);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRadiusScaleXYZ(null, this.actionValue, null);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;	
			case ActionTypeEnum.RADIUSSCALEZ:
				switch (this.transition) {
				case 0:
					this.actionStartValue = this.object1.getCurrentRadiusScaleZ();
					this.lerpValue = 0;
					this.actionClock.start();
					this.transition = 1; 
					break;
				case 1:
					if ((this.lerpValue < 1) )
					{
						this.lerpedValues.length = 0;
						var C = [this.actionStartValue];
						var D = [this.actionValue];
						this.lerpedValues = lerp(C, D, this.lerpValue);
						this.object1.setCurrentRadiusScaleXYZ(null, null, this.lerpedValues[0]);
						this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
					}
					else
					{
						this.object1.setCurrentRadiusScaleXYZ(null, null, this.actionValue);
						this.lerpValue = 0;
						this.actionClock.stop();
						this.transition = 2; 
					}
					break;
				case 2:
					this.actionStartValue = null;
					this.isActionComplete = true;
					break;			
				}	
				break;
			}
			break;
 		case ObjectTypeEnum.AUDIOCLIP:
			switch (this.actionType) {
			case ActionTypeEnum.PLAY:
				if (Number.isInteger(this.actionValue))
				{
					this.object1.playAt(this.actionValue);
				}
				else
				{
					this.object1.play();
				}
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.PAUSE:
				this.object1.pause();
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.VOLUME:
				if (this.isSpeedPresent)
				{
					switch (this.transition) {
					case 0:
						this.actionStartValue = this.object1.getVolume();
						this.lerpValue = 0;
						this.actionClock.start();
						this.transition = 1; 
						break;
					case 1:
						if ((this.lerpValue < 1) )
						{
							this.lerpedValues.length = 0;
							var C = [this.actionStartValue];
							var D = [this.actionValue];
							this.lerpedValues = lerp(C, D, this.lerpValue);
							this.object1.setVolume(this.lerpedValues[0], null);
							this.lerpValue = this.actionClock.getElapsedTime() / this.actionSpeed;
						}
						else
						{
							this.object1.setVolume(this.actionValue, null);
							this.lerpValue = 0;
							this.actionClock.stop();
							this.transition = 2; 
						}
						break;
					case 2:
						this.actionStartValue = null;
						this.isActionComplete = true;
						break;			
					}	
				}
				else
				{
					this.object1.setVolume(this.actionValue, null);
					this.isActionComplete = true;
				}
				
			}
			break; 			
		case ObjectTypeEnum.TEXTTOSPEECH:
			switch (this.actionType) {
			case ActionTypeEnum.SPEAK:
				this.object1.speak(this.actionValue, null, this.startStateCallbackUID, this.endStateCallbackUID);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.INPUTUID:
				this.object1.speak(null, this.actionValue, this.startStateCallbackUID, this.endStateCallbackUID);
				this.isActionComplete = true;
				break;			
			}
			break;
		case ObjectTypeEnum.SPEECHTOTEXT:
			switch (this.actionType) {
			case ActionTypeEnum.LISTEN:
				this.object1.listen(this.startStateCallbackUID, this.endStateCallbackUID, this.resultStateCallbackUID, this.errorStateCallbackUID);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.STOP:
				this.object1.stopListening(this.actionValue);
				this.isActionComplete = true;			
			}				
		case ObjectTypeEnum.DIALOGENGINE:
			switch (this.actionType) {
			case ActionTypeEnum.INPUT:
				this.object1.response(this.actionValue, null, this.resultStateCallbackUID, this.timeoutStateCallbackUID, this.errorStateCallbackUID);
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.INPUTUID:
				this.object1.response(null, this.actionValue, this.resultStateCallbackUID, this.timeoutStateCallbackUID, this.errorStateCallbackUID)
				this.isActionComplete = true;
				break;	
			}
			break;
		case ObjectTypeEnum.STAGE:
			switch (this.actionType) {
			case ActionTypeEnum.ADDGROUP:
				if (this.actionValue != null)
				{
					this.object1.addObject3D(this.actionValue);
				}
				this.isActionComplete = true;
				break;
			/* case ActionTypeEnum.ADDPHYSICSGROUP:
				if (this.object2 != null)
				{
					this.object1.addPhysicsObject3D(this.object2);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object2Array.length; i++)
					{
						this.object1.addPhysicsObject3D(this.object2Array[i]);
					}
					this.isActionComplete = true;		
				}
				break;
			case ActionTypeEnum.REMOVEPHYSICSGROUP:
				if (this.object2 != null)
				{
					this.object1.removePhysicsObject3D(this.object2);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object2Array.length; i++)
					{
						this.object1.removePhysicsObject3D(this.object2Array[i]);
					}
					this.isActionComplete = true;		
				}
				break;	 */
			case ActionTypeEnum.ADDPHYSICSGROUP:
				if (this.object2 != null)
				{
					this.object1.addPhysicsObject3D(this.object2);
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object2Array.length; i++)
					{
						this.object1.addPhysicsObject3D(this.object2Array[i]);
					}
					this.isActionComplete = true;		
				}
				break;
			case ActionTypeEnum.REMOVEPHYSICSGROUP:
				if (this.object2 != null)
				{
					this.object1.removePhysicsObject3D(this.object2.getUID());
					this.isActionComplete = true;
				}
				else
				{
					for (let i = 0; i < this.object2Array.length; i++)
					{
						this.object1.removePhysicsObject3D(this.object2Array[i].getUID());
					}
					this.isActionComplete = true;		
				}
				break;	
			}
			break;
		case ObjectTypeEnum.CLASS:
			switch (this.actionType) {
			case ActionTypeEnum.ENABLED:
				for (const [key, value] of this.object1) {
					value.setEnabled(this.actionValue);
				}
				this.isActionComplete = true;
				break;
			case ActionTypeEnum.VISIBLE:
				for (const [key, value] of this.object1) {
					value.setVisiblity(this.actionValue);
				}
				this.isActionComplete = true;
				break;	
			}
			break;		
		}
		
	}
}

ARAction.prototype.dispose = function(){

	this.UID = null;
	this.parentSide = null;
	this.parentObject = null;
	this.actionOrder = null;
	this.object1 = null;
	this.objectType1 = null;
	if (this.object1Array.length > 0)
	{
		for (let i = 0; i < this.object1Array.length; i++)
		{
			this.object1Array[i] = null;
		}
	}
	this.object1Array.length = 0;
	this.object1Array = null;
	this.object2 = null;
	this.objectType2 = null;
	if (this.object2Array.length > 0)
	{
		for (let i = 0; i < this.object2Array.length; i++)
		{
			this.object2Array[i] = null;
		}
	}
	this.object2Array.length = 0;
	this.object2Array = null;
	this.actionType = null;
	this.actionStartValue = null;
	this.actionValue = null;
	this.offsetValue = null;
	this.startStateCallbackUID = null;
	this.endStateCallbackUID = null;
	this.errorStateCallbackUID = null;
	this.resultStateCallbackUID = null;
	this.timeoutStateCallbackUID = null;
	this.lerpValue = null;
	this.lerpedValues.length = 0;
	this.lerpedValues = null;
	this.transition = null; 	
	this.actionClock = null;
	this.isCumulativeSpeed = null;
	this.cumulativeSpeed = null;
	this.duration = null;
	this.afterValue = null;
	this.cumulativeSpeedStart = null;
	this.cumulativeSpeedEnd = null;
	this.lerpSpeedValue = null;
	this.lerpedSpeedValues.length = 0;
	this.lerpedSpeedValues = null;
	this.actionSpeed = null;
	this.isSpeedPresent = null;
	this.isActionComplete = null;
	this.initialiseSuccess = null;
	this.stateStageType = null;
}