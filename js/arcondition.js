const ComparisonTypeEnum = {
	EQUAL : 0,
	NOTEQUAL : 1,
	GREATER : 2,
	LESS : 3,
	PRESSED : 4,
	PLAYING : 5,
	ENDED : 6,
	ENABLED : 7
}

const ComparisonPropertyTypeEnum = {
	POSITION : 1,
	POSITIONX : 2,
	POSITIONY : 3,
	POSITIONZ : 4,
	ROTATION : 5,
	ROTATIONX : 6,
	ROTATIONY : 7,
	ROTATIONZ : 8,
	VALUE : 9,
	FIRSTCONTACT : 10,
	CONTACT : 11,
	ANGLE : 12,
	VELOCITY : 13
}

ARCondition = function(item, parentside, parentstate) {
	var _this = this;
	this.parentSide = parentside;
	this.parentState = parentstate;
	this.object1 = null;
	this.object1Type = null;
	this.object2 = null;
	this.object2Type = null;
	this.comparisonType = null;
	this.comparisonProperty = null;
	this.comparisonValue = null;
	this.evaluation = false;
	
 	if (item.hasOwnProperty('character1'))
	{
		switch (item.character1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.character1, ObjectTypeEnum.CHARACTER);
			break;
		}
		this.object1Type = ObjectTypeEnum.CHARACTER;		
	}
	if (item.hasOwnProperty('model1'))
	{
		switch (item.model1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.model1, ObjectTypeEnum.MODEL);
			break;
		}
		this.object1Type = ObjectTypeEnum.MODEL;
	}
	if (item.hasOwnProperty('group1'))
	{
		switch (item.group1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.group1, ObjectTypeEnum.GROUP);
			break;
		}
		this.object1Type = ObjectTypeEnum.GROUP;
	}
	if (item.hasOwnProperty('waypoint1'))
	{
		switch (item.waypoint1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.waypoint1, ObjectTypeEnum.WAYPOINT);
			break;
		}
		this.object1Type = ObjectTypeEnum.WAYPOINT;
	}
	if (item.hasOwnProperty('meshbutton1'))
	{
		switch (item.meshbutton1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.meshbutton1, ObjectTypeEnum.MESHBUTTON);
			break;
		}
		this.object1Type = ObjectTypeEnum.MESHBUTTON;
		this.object1.addStateReference(this.parentState);
		
	}
	if (item.hasOwnProperty('screenbutton1'))
	{
		switch (item.screenbutton1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.screenbutton1, ObjectTypeEnum.SCREENBUTTON);
			break;
		}
		this.object1Type = ObjectTypeEnum.SCREENBUTTON;
		this.object1.addStateReference(this.parentState);
	}
	if (item.hasOwnProperty('state1'))
	{
		//this.object1 = this.parentSide.getUIDObjectMap(item.state1, ObjectTypeEnum.STATE);
		this.parentSide.addReferenceStateObject(_this, item.state1, 1);
		this.object1Type = ObjectTypeEnum.STATE;
	}
	if (item.hasOwnProperty('action1'))
	{
		this.parentSide.addReferenceStateObject(_this, item.action1, 1);
		this.object1Type = ObjectTypeEnum.ACTION;
	}
	if (item.hasOwnProperty('videotexture1'))
	{
		switch (item.videotexture1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.videotexture1, ObjectTypeEnum.VIDEOTEXTURE);
			break;
		}
		this.object1Type = ObjectTypeEnum.VIDEOTEXTURE;
	}
	if (item.hasOwnProperty('physics1'))
	{
		switch (item.physics1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.physics1, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.object1Type = ObjectTypeEnum.PHYSICSBODY;
	}
	
	if (item.hasOwnProperty('physicsbody1'))
	{
		switch (item.physicsbody1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.physicsbody1, ObjectTypeEnum.PHYSICSBODY);
			break;
		}
		this.object1Type = ObjectTypeEnum.PHYSICSBODY;
	}
	
	if (item.hasOwnProperty('physicsconstraint1'))
	{
		switch (item.physicsconstraint1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.physicsconstraint1, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.object1Type = ObjectTypeEnum.PHYSICSCONSTRAINT;
	}
	
	if (item.hasOwnProperty('constraint1'))
	{
		switch (item.constraint1.toLowerCase()) {
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
			this.object1 = this.parentSide.getUIDObjectMap(item.constraint1, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.object1Type = ObjectTypeEnum.PHYSICSCONSTRAINT;
	}
	
	if (item.hasOwnProperty('character2'))
	{
		switch (item.character2.toLowerCase()) {
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
		this.object2Type = ObjectTypeEnum.CHARACTER;
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
		this.object2Type = ObjectTypeEnum.MODEL;
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
		this.object2Type = ObjectTypeEnum.GROUP;
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
		this.object2Type = ObjectTypeEnum.WAYPOINT;
	}
	if (item.hasOwnProperty('meshbutton2'))
	{
		switch (item.meshbutton2.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.MESHBUTTON);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.meshbutton2, ObjectTypeEnum.MESHBUTTON);
			break;
		}
		this.object2Type = ObjectTypeEnum.MESHBUTTON;
		this.object2.addStateReference(this.parentState);
	}
	if (item.hasOwnProperty('screenbutton2'))
	{
		switch (item.screenbutton2.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.SCREENBUTTON);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.screenbutton2, ObjectTypeEnum.SCREENBUTTON);
			break;
		}
		this.object2Type = ObjectTypeEnum.SCREENBUTTON;
		this.object2.addStateReference(this.parentState);
	}
	if (item.hasOwnProperty('state2'))
	{
		this.parentSide.addReferenceStateObject(_this, item.state2, 2);
		this.object2Type = ObjectTypeEnum.STATE;
	}
	if (item.hasOwnProperty('action2'))
	{
		this.parentSide.addReferenceStateObject(_this, item.action2, 2);
		this.object2Type = ObjectTypeEnum.ACTION;
	}
	if (item.hasOwnProperty('videotexture2'))
	{
		switch (item.videotexture2.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.VIDEOTEXTURE);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.videotexture2, ObjectTypeEnum.VIDEOTEXTURE);
			break;
		}
		this.object2Type = ObjectTypeEnum.VIDEOTEXTURE;
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
		this.object2Type = ObjectTypeEnum.PHYSICSBODY;
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
		this.object2Type = ObjectTypeEnum.PHYSICSBODY;
	}
	
	if (item.hasOwnProperty('physicsconstraint2'))
	{
		switch (item.physicsconstraint2.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSCONSTRAINT);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.physicsconstraint2, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.object2Type = ObjectTypeEnum.PHYSICSCONSTRAINT;
	}
	
	if (item.hasOwnProperty('constraint2'))
	{
		switch (item.constraint2.toLowerCase()) {
		case "classitem":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentState.getClassObject();
			}
			break;
		case "classitemuid":
			if (this.parentState.getObjectType() == ObjectTypeEnum.CLASSSTATE)
			{
				this.object2 = this.parentSide.getUIDObjectMap(this.parentState.getClassUID(), ObjectTypeEnum.PHYSICSCONSTRAINT);
			}
			break;
		default:
			this.object2 = this.parentSide.getUIDObjectMap(item.constraint2, ObjectTypeEnum.PHYSICSCONSTRAINT);
			break;
		}
		this.object2Type = ObjectTypeEnum.PHYSICSCONSTRAINT;
	}
	
 	if (item.hasOwnProperty('value'))
	{
		this.comparisonValue = item.value;
	}
	
	if (item.hasOwnProperty('equal'))
	{
		this.comparisonType = ComparisonTypeEnum.EQUAL;
		setComparisonProperty(item.equal);
	}
	
	if (item.hasOwnProperty('notequal'))
	{
		this.comparisonType = ComparisonTypeEnum.NOTEQUAL;
		setComparisonProperty(item.notequal);
	}
	if (item.hasOwnProperty('greater'))
	{
		this.comparisonType = ComparisonTypeEnum.GREATER;
		setComparisonProperty(item.greater);
	}
	if (item.hasOwnProperty('less'))
	{
		this.comparisonType = ComparisonTypeEnum.LESS;
		setComparisonProperty(item.less);
	}
	if (item.hasOwnProperty('pressed'))
	{
		this.comparisonType = ComparisonTypeEnum.PRESSED;
		this.comparisonValue = item.pressed;
	}

	if (item.hasOwnProperty('playing'))
	{
		this.comparisonType = ComparisonTypeEnum.PLAYING;
		this.comparisonValue = item.playing;
	}

	if (item.hasOwnProperty('ended'))
	{
		this.comparisonType = ComparisonTypeEnum.ENDED;
		this.comparisonValue = item.ended;
	}	

	if (item.hasOwnProperty('enabled'))
	{
		this.comparisonType = ComparisonTypeEnum.ENABLED;
		this.comparisonValue = item.enabled;
	}	
	
	
	
	function setComparisonProperty(value){
		switch (value.toLowerCase()) {
		case "position":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.POSITION;
			break;
		case "positionx":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.POSITIONX;
			break;
		case "positiony":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.POSITIONY;
			break;			
		case "positionz":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.POSITIONZ;
			break;
		case "rotation":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.ROTATION;
			break;
		case "rotationx":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.ROTATIONX;
			break;
		case "rotationy":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.ROTATIONY;
			break;	
		case "rotationz":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.ROTATIONZ;
			break;	
		case "value":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.VALUE;
			break;
		case "firstcontact":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.FIRSTCONTACT;
			break;
		case "contact":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.CONTACT;
			break;
		case "velocity":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.VELOCITY;
			break;
		case "angle":
			_this.comparisonProperty = ComparisonPropertyTypeEnum.ANGLE;
			break;	
		}
	}; 
	
}

ARCondition.prototype.constructor = ARCondition;

ARCondition.prototype.addReference = function(uid, num){
	
	switch (num) {
	case 1:
		switch (this.object1Type) {
		case ObjectTypeEnum.STATE:
			this.object1 = this.parentSide.getUIDObjectMap(uid, ObjectTypeEnum.STATE);
			break;
		case ObjectTypeEnum.ACTION:
			this.object1 = this.parentSide.getUIDObjectMap(uid, ObjectTypeEnum.ACTION);
			break;		
		}
		break;
	case 2:
		switch (this.object2Type) {
		case ObjectTypeEnum.STATE:
			this.object2 = this.parentSide.getUIDObjectMap(uid, ObjectTypeEnum.STATE);
			break;
		case ObjectTypeEnum.ACTION:
			this.object2 = this.parentSide.getUIDObjectMap(uid, ObjectTypeEnum.ACTION);
			break;			
		}
		break;
	}	
}



ARCondition.prototype.checkCondition = function(){
 	if ((this.object1 != null) && (this.object2 != null))
	{
		if ((this.object1Type != ObjectTypeEnum.STATE) && (this.object2Type != ObjectTypeEnum.STATE))
		{
			switch (this.comparisonProperty) {
			case ComparisonPropertyTypeEnum.POSITION:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentPosition().equals(this.object2.getCurrentPosition())) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					((this.object1.getCurrentPosition().x != this.object2.getCurrentPosition().x) && (this.object1.getCurrentPosition().y != this.object2.getCurrentPosition().y) && (this.object1.getCurrentPosition().z != this.object2.getCurrentPosition().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					((this.object1.getCurrentPosition().x > this.object2.getCurrentPosition().x) && (this.object1.getCurrentPosition().y > this.object2.getCurrentPosition().y) && (this.object1.getCurrentPosition().z > this.object2.getCurrentPosition().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					((this.object1.getCurrentPosition().x < this.object2.getCurrentPosition().x) && (this.object1.getCurrentPosition().y < this.object2.getCurrentPosition().y) && (this.object1.getCurrentPosition().z < this.object2.getCurrentPosition().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.POSITIONX:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentPositionX() == this.object2.getCurrentPositionX()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getCurrentPositionX() != this.object2.getCurrentPositionX()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentPositionX() > this.object2.getCurrentPositionX()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getCurrentPositionX() < this.object2.getCurrentPositionX()) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.POSITIONY:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentPositionY() == this.object2.getCurrentPositionY()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getCurrentPositionY() != this.object2.getCurrentPositionY()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentPositionY() > this.object2.getCurrentPositionY()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getCurrentPositionY() < this.object2.getCurrentPositionY()) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.POSITIONZ:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentPositionZ() == this.object2.getCurrentPositionZ()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getPositionZ() != this.object2.getCurrentPositionZ()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentPositionZ() > this.object2.getCurrentPositionZ()) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getPositionZ() < this.object2.getPositionZ()) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;			
			case ComparisonPropertyTypeEnum.ROTATION:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentRotation().equals(this.object2.getCurrentRotation())) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					((this.object1.getCurrentRotation().x != this.object2.getCurrentRotation().x) && (this.object1.getCurrentRotation().y != this.object2.getCurrentRotation().y) && (this.object1.getCurrentRotation().z != this.object2.getCurrentRotation().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					((this.object1.getCurrentRotation().x > this.object2.getCurrentRotation().x) && (this.object1.getCurrentRotation().y > this.object2.getCurrentRotation().y) && (this.object1.getCurrentRotation().z > this.object2.getCurrentRotation().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					((this.object1.getCurrentRotation().x < this.object2.getCurrentRotation().x) && (this.object1.getCurrentRotation().y < this.object2.getCurrentRotation().y) && (this.object1.getCurrentRotation().z < this.object2.getCurrentRotation().z)) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.ROTATIONX:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentRotation().x == this.object2.getCurrentRotation().x) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getCurrentRotation().x != this.object2.getCurrentRotation().x) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentRotation().x > this.object2.getCurrentRotation().x) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getCurrentRotation().x < this.object2.getCurrentRotation().x) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.ROTATIONY:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentRotation().y == this.object2.getCurrentRotation().y) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getCurrentRotation().y != this.object2.getCurrentRotation().y) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentRotation().y > this.object2.getCurrentRotation().y) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getCurrentRotation().y < this.object2.getCurrentRotation().y) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.ROTATIONZ:
				switch (this.comparisonType) {
				case ComparisonTypeEnum.EQUAL:
					(this.object1.getCurrentRotation().z == this.object2.getCurrentRotation().z) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.NOTEQUAL:
					(this.object1.getCurrentRotation().z != this.object2.getCurrentRotation().z) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.GREATER:
					(this.object1.getCurrentRotation().z > this.object2.getCurrentRotation().z) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonTypeEnum.LESS:
					(this.object1.getCurrentRotation().z < this.object2.getCurrentRotation().z) ? this.evaluation = true : this.evaluation = false; 
					break;
				}
				break;
			case ComparisonPropertyTypeEnum.FIRSTCONTACT:
				if ((this.object1Type == ObjectTypeEnum.PHYSICSBODY) && (this.object2Type == ObjectTypeEnum.PHYSICSBODY))
				{
					switch (this.comparisonType) {
					case ComparisonTypeEnum.EQUAL:
						(this.object1.checkFirstContactPair(this.object2)) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.NOTEQUAL:
						(!(this.object1.checkFirstContactPair(this.object2))) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
				}
				break;
			case ComparisonPropertyTypeEnum.CONTACT:
				if ((this.object1Type == ObjectTypeEnum.PHYSICSBODY) && (this.object2Type == ObjectTypeEnum.PHYSICSBODY))
				{
					switch (this.comparisonType) {
					case ComparisonTypeEnum.EQUAL:
						(this.object1.checkContactPair(this.object2)) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.NOTEQUAL:
						(!(this.object1.checkContactPair(this.object2))) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
				}
				break;
			case ComparisonPropertyTypeEnum.ANGLE:
				if ((this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT) && (this.object2Type == ObjectTypeEnum.PHYSICSCONSTRAINT))
				{
					switch (this.comparisonType) {
					case ComparisonTypeEnum.EQUAL:
						(this.object1.getJointAngle() == this.object2.getJointAngle()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.NOTEQUAL:
						(this.object1.getJointAngle() != this.object2.getJointAngle()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.GREATER:
						(this.object1.getJointAngle() > this.object2.getJointAngle()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.LESS:
						(this.object1.getJointAngle() < this.object2.getJointAngle()) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
				}
				break;
			case ComparisonPropertyTypeEnum.VELOCITY:
				if ((this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT) && (this.object2Type == ObjectTypeEnum.PHYSICSCONSTRAINT))
				{
					switch (this.comparisonType) {
					case ComparisonTypeEnum.EQUAL:
						(this.object1.getJointVelocity() == this.object2.getJointVelocity()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.NOTEQUAL:
						(this.object1.getJointVelocity() != this.object2.getJointVelocity()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.GREATER:
						(this.object1.getJointVelocity() > this.object2.getJointVelocity()) ? this.evaluation = true : this.evaluation = false; 
						break;
					case ComparisonTypeEnum.LESS:
						(this.object1.getJointVelocity() < this.object2.getJointVelocity()) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
				}
				break;				
			}
		}
		
	}
	else
	{
		if ((this.object1 != null) && (this.object2 == null) && (this.comparisonValue != null))
		{
			switch (this.comparisonType) {
			case ComparisonTypeEnum.EQUAL:
				switch (this.comparisonProperty) {
				case ComparisonPropertyTypeEnum.POSITIONX:
					(this.object1.getCurrentPositionX() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONY:	
					(this.object1.getCurrentPositionY() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONZ:
					(this.object1.getCurrentPositionZ() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;	
				case ComparisonPropertyTypeEnum.ROTATIONX:
					(this.object1.getCurrentRotationAngleX() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONY:
					(this.object1.getCurrentRotationAngleY() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONZ:
					(this.object1.getCurrentRotationAngleZ() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.VALUE:
					switch (this.object1Type) {
					case ObjectTypeEnum.STATE:
						break;
					case ObjectTypeEnum.CHARACTER:
						(this.object1.getCurrentAnimationName() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
					break;
				case ComparisonPropertyTypeEnum.ANGLE:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointAngle() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				case ComparisonPropertyTypeEnum.VELOCITY:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointVelocity() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				}
				break;
			case ComparisonTypeEnum.NOTEQUAL:
				switch (this.comparisonProperty) {
				case ComparisonPropertyTypeEnum.POSITIONX:
					(this.object1.getCurrentPositionX() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONY:
					(this.object1.getCurrentPositionY() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONZ:
					(this.object1.getCurrentPositionZ() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONX:
					(this.object1.getCurrentRotationAngleX() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 

					break;
				case ComparisonPropertyTypeEnum.ROTATIONY:
					(this.object1.getCurrentRotationAngleY() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 

					break;
				case ComparisonPropertyTypeEnum.ROTATIONZ:
					(this.object1.getCurrentRotationAngleZ() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 

					break;
				case ComparisonPropertyTypeEnum.VALUE:
					switch (this.object1Type) {
					case ObjectTypeEnum.STATE:
						break;
					case ObjectTypeEnum.CHARACTER:
						(this.object1.getCurrentAnimationName() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
						break;
					}
					break;
				case ComparisonPropertyTypeEnum.ANGLE:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointAngle() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				case ComparisonPropertyTypeEnum.VELOCITY:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointVelocity() != this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;					
				}
				break;
			case ComparisonTypeEnum.GREATER:
				switch (this.comparisonProperty) {
				case ComparisonPropertyTypeEnum.POSITIONX:
					(this.object1.getCurrentPositionX() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONY:	
					(this.object1.getCurrentPositionY() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONZ:	
					(this.object1.getCurrentPositionZ() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONX:
					(this.object1.getCurrentRotationAngleX() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONY:
					(this.object1.getCurrentRotationAngleY() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONZ:
					(this.object1.getCurrentRotationAngleZ() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ANGLE:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointAngle() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				case ComparisonPropertyTypeEnum.VELOCITY:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointVelocity() > this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;	
				}
				break;
			case ComparisonTypeEnum.LESS:
				switch (this.comparisonProperty) {
				case ComparisonPropertyTypeEnum.POSITIONX:
					(this.object1.getCurrentPositionX() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONY:	
					(this.object1.getCurrentPositionY() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.POSITIONZ:
					(this.object1.getCurrentPositionZ() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONX:
					(this.object1.getCurrentRotationAngleX() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONY:
					(this.object1.getCurrentRotationAngleY() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ROTATIONZ:
					(this.object1.getCurrentRotationAngleZ() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ComparisonPropertyTypeEnum.ANGLE:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointAngle() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				case ComparisonPropertyTypeEnum.VELOCITY:
					if (this.object1Type == ObjectTypeEnum.PHYSICSCONSTRAINT)
					{
						(this.object1.getJointVelocity() < this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 
					}
					break;
				}
				break;
			case ComparisonTypeEnum.PRESSED:
				switch (this.object1Type) {
				case ObjectTypeEnum.SCREENBUTTON:
				case ObjectTypeEnum.MESHBUTTON:
				


					if (this.object1.isTouched() == this.comparisonValue)
					{

						this.evaluation = true;
					}
					else
					{
						this.evaluation = false; 
					}	
					break;
				}
				break;
			case ComparisonTypeEnum.PLAYING:
				switch (this.object1Type) {
				case ObjectTypeEnum.VIDEOTEXTURE:
					(this.object1.getChapterPlayingStatus(this.comparisonValue) == ChapterPlayStateEnum.PLAYING) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ObjectTypeEnum.CHARACTER:
					if ((this.object1.getCurrentAnimationName() == this.comparisonValue) && (this.object1.getEffectiveWeightByName(this.comparisonValue) == 1))
					{
						this.evaluation = true;
					}
					else
					{
						this.evaluation = false;
					}
					break;				
				}
				break;
			case ComparisonTypeEnum.ENDED:			
				switch (this.object1Type) {
				case ObjectTypeEnum.VIDEOTEXTURE:
					(this.object1.getChapterPlayingStatus(this.comparisonValue) == ChapterPlayStateEnum.ENDED) ? this.evaluation = true : this.evaluation = false; 
					break;
				case ObjectTypeEnum.CHARACTER:
					if ((this.object1.getCurrentAnimationName() != this.comparisonValue) && (this.object1.getEffectiveWeightByName(this.comparisonValue) == 0))
					{
						this.evaluation = true;
					}
					else
					{
						this.evaluation = false;
					}
					break;
				}
				break;
			case ComparisonTypeEnum.ENABLED:		
				switch (this.object1Type) {
				case ObjectTypeEnum.WAYPOINT:
					(this.object1.IsEnabled() == this.comparisonValue) ? this.evaluation = true : this.evaluation = false; 

					break;
				}
				break;
			}
			

		}
	} 
	return this.evaluation;
}

ARCondition.prototype.initialise = function(){
	
	this.evaluation = false;
}

ARCondition.prototype.getEvaluation = function(){
	
	return this.evaluation;
}

ARCondition.prototype.dispose = function(){
	this.parentSide = null;
	this.parentState = null;
	this.object1 = null;
	this.object1Type = null;
	this.object2 = null;
	this.object2Type = null;
	this.comparisonType = null;
	this.comparisonProperty = null;
	this.comparisonValue = null;
	this.evaluation = null;
}