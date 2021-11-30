
const PhysicsTypeEnum = {
  RIGIDBODY_PLANE: 0,
  RIGIDBODY_BOX: 1,
  RIGIDBODY_SPHERE: 2,
  RIGIDBODY_CYLINDER: 3,
  RIGIDBODY_CONE: 4,
  RIGIDBODY_CONVEXHULL: 5,
  RIGIDBODY_BVHTRIANGLEMESH: 6,
  RIGIDBODY_COMPOUNDSHAPE: 7,
  SOFTBODY_ROPE: 8,
  SOFTBODY_CLOTH: 9,
  CONSTRAINT_HINGE: 10,
  CONSTRAINT_PT2PT: 11,
  CONSTRAINT_CONETWIST: 12,
  CONSTRAINT_FIXED: 13
};

const PhysicsContactTypeEnum = {
	NONE : 0,
	CONTACT : 1
}

const ConstraintMotorTypeEnum = {
	NONE : 0,
	VELOCITY : 1,
	ANGULAR : 2
}

ARPhysicsObject = function(item, parentobject, parentcube, parentside, parentstage, uid = null, physicstype = null, dimension = null, position = null, rotation = null, length = null, segments = null)
{	
	var _this = this;
	this.UID = uid;
	this.userData = null;
	this.classUID = null;
	this.objectType = null;
	this.parentObject = parentobject;
	this.parentSide = parentside;
	this.parentCube = parentcube;
	this.parentStage = parentstage;
	this.physicsObject = null;
	this.physicsType = physicstype;
	this.physicsTransform = new Ammo.btTransform();
	this.inPhysicsWorld = false;
	this.initialStoredPosition = new THREE.Vector3(0, 0, 0);
	this.initialStoredQuaternion = new THREE.Quaternion();
	this.initialStoredRotation = new THREE.Vector3(0, 0, 0);
	this.currentPosition = new THREE.Vector3(0, 0, 0);
	this.currentRotation = new THREE.Vector3(0, 0, 0);
	this.currentEuler = new THREE.Euler(0,0,0);
	this.currentQuaternion = new THREE.Quaternion();
	this.pendingTranslation = new THREE.Vector3(0, 0, 0);
	this.targetPosition = new THREE.Vector3(0, 0, 0);
	this.pendingNewPosition = new THREE.Vector3(0, 0, 0);
	this.forwardVector = new THREE.Vector3(0, 0, 1);
	this.upVector = new THREE.Vector3(0, 1, 0);
	this.pendingNewQuaternion = new THREE.Quaternion();
	this.moveSpeed = 1;
	this.isNewPositionPending = false;
	this.isTargetPositionPending = false;
	this.isNewRotationPending = false;
	this.modelRequired = false;
	this.mass = 0;
	this.initialStoredMass = 0;
	this.margin = 0.001;
	this.friction = 0.5;
	this.rollingFriction = null;
	this.targetJointVelocity = 0;
	this.targetJointAngle = 0;
	this.startJointAngle = 0;
	this.jointSpeed = 50;
	this.jointMotorType = ConstraintMotorTypeEnum.NONE;
	this.minAngle = null;
	this.maxAngle = null;
	this.isKinematic = false;
	this.isCubeControlled = false;
	this.maxPosition = null; 
	this.minPosition = null;
	this.contactPairResult = null;
	this.contactResult = null;
	this.contactListMap = new Map();
	this.ammoTempTrans = new Ammo.btTransform();
    this.ammoTempPos = new Ammo.btVector3();
	this.localInertia = new Ammo.btVector3();
    this.ammoTempQuat = new Ammo.btQuaternion();
	this.tempQuat = new THREE.Quaternion();
	this.storedInitialEnabledState = true;
	this.isEnabled = true;
	this.moveClock = new THREE.Clock(false);
	
	if (item.hasOwnProperty('cubecontrol'))
	{
		if (this.parentSide.getPhysicsControlType() == PhysicsControlTypeEnum.CUBE)
		{
			this.isCubeControlled = item.cubecontrol;
		}			
	}
	
	if (item.hasOwnProperty('enabled'))
	{
		this.storedInitialEnabledState = item.enabled;
		this.isEnabled = this.storedInitialEnabledState; 
	}
	
	this.setupCollisionModelMesh = function(model) {
		
		var shape;
		switch (_this.physicsType) {
		case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
			shape = createConvexHullPhysicsShape(model);
			break;
		case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
			shape = createTriangleShapeByGeometry(model);
			break;
		}
		shape.setMargin( _this.margin );
		_this.localInertia.setValue( 0, 0, 0 );
		shape.calculateLocalInertia( _this.mass, _this.localInertia );
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin( new Ammo.btVector3( _this.initialStoredPosition.x, _this.initialStoredPosition.y, _this.initialStoredPosition.z ) );
		transform.setRotation( new Ammo.btQuaternion( _this.initialStoredQuaternion.x, _this.initialStoredQuaternion.y, _this.initialStoredQuaternion.z, _this.initialStoredQuaternion.w ) );
		const motionState = new Ammo.btDefaultMotionState( transform );
		const rbInfo = new Ammo.btRigidBodyConstructionInfo( _this.mass, motionState, shape, _this.localInertia );
		
		_this.physicsObject = new Ammo.btRigidBody( rbInfo );
		_this.physicsObject.setUserPointer(_this);		
		if ( _this.mass > 0 ) {
			_this.physicsObject.setActivationState( 4 );
		}
		else
		{
			if (_this.isKinematic)
			{
				_this.physicsObject.setActivationState( 4 );
				_this.physicsObject.setCollisionFlags( 2 );
			}
		}
		_this.physicsObject.setFriction( _this.friction );
		
		if (_this.rollingFriction != null)
		{
			_this.physicsObject.setRollingFriction( _this.rollingFriction );
		}
		
	}; 


	this.modelLoaded = function(loadedmodel, modelitem, clone, filetype) {
		var model;
		if (clone)
		{
			if (filetype == AssetFileTypeEnum.GLB)
			{
				model = THREE.SkeletonUtils.clone(loadedmodel.scene);
			}
			else
			{
				_model = THREE.SkeletonUtils.clone(loadedmodel);
			}
		}
		else
		{
			if (filetype == AssetFileTypeEnum.GLB)
			{
				model = loadedmodel.scene;
			}
			else
			{
				model = loadedmodel;
			}
		}
		_this.setupCollisionModelMesh(model);
		
		
	};
	
	
	this.addSoftBodyAnchors = function() {
	
		if ((_this.physicsType == PhysicsTypeEnum.SOFTBODY_ROPE) || (_this.physicsType == PhysicsTypeEnum.SOFTBODY_CLOTH))
		{
			if (item.hasOwnProperty('anchors'))
			{
				if (item.anchors.length > 0)
				{
					for (let i = 0; i < item.anchors.length; i++)
					{
						if (item.anchors[i].hasOwnProperty('anchor'))
						{
							let influence = 1;
							let linkedcollisions = true;
							if (item.anchors[i].anchor.hasOwnProperty('influence'))
							{
								influence = item.anchors[i].anchor.influence;
							}
							if (item.anchors[i].anchor.hasOwnProperty('linkedcollisions'))
							{
								linkedcollisions = item.anchors[i].anchor.linkedcollisions;
							}
							let physicsobject = _this.parentSide.getUIDObjectMap(item.anchors[i].anchor.bodyuid, ObjectTypeEnum.PHYSICSBODY);
							if (physicsobject != null)
							{
								let physicsbody = physicsobject.getPhysicsObject();
								_this.physicsObject.appendAnchor( item.anchors[i].anchor.node, physicsbody, linkedcollisions, influence );
							}
							
						}
					}
					
				}
			}
		}
	
	}

	this.addJointConstraint = function() {
		
		switch (_this.physicsType) {
		case PhysicsTypeEnum.CONSTRAINT_HINGE:
			// Hinge constraint
			if (item.hasOwnProperty('joint'))
			{
				if (item.joint.length == 2)
				{
					if ((item.joint[0].hasOwnProperty('join')) && (item.joint[1].hasOwnProperty('join')))
					{

						const pivotA = new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z );
						const pivotB = new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z );
						const axisA = new Ammo.btVector3( item.joint[0].join.axis.x, item.joint[0].join.axis.y, item.joint[0].join.axis.z );
						const axisB = new Ammo.btVector3( item.joint[1].join.axis.x, item.joint[1].join.axis.y, item.joint[1].join.axis.z );
						let physicsobjectA = _this.parentSide.getUIDObjectMap(item.joint[0].join.uid, ObjectTypeEnum.PHYSICSBODY);
						let physicsobjectB = _this.parentSide.getUIDObjectMap(item.joint[1].join.uid, ObjectTypeEnum.PHYSICSBODY);
						if ((physicsobjectA != null) && (physicsobjectA != null))
						{
							let physicsbodyA = physicsobjectA.getPhysicsObject();
							let physicsbodyB = physicsobjectB.getPhysicsObject();
							_this.physicsObject = new Ammo.btHingeConstraint( physicsbodyA, physicsbodyB, pivotA, pivotB, axisA, axisB, true );
						}
						if ((item.hasOwnProperty('minangle')) && (item.hasOwnProperty('maxangle')))
						{
							_this.minAngle = THREE.Math.degToRad(item.minangle);
							_this.maxAngle = THREE.Math.degToRad(item.maxangle);
						}
						if ((_this.minAngle != null) && (_this.maxAngle != null))
						{
							//var  softness = 0.9,
							//var biasFactor = 0.3f,
							//var relaxationFactor = 1.0f 
							//_this.physicsObject.setLimit(0, 0);							
							_this.physicsObject.setLimit(_this.minAngle, _this.maxAngle, 0.9, 0.3);
						}
						if (item.hasOwnProperty('motor'))
						{
							switch (item.motor.toLowerCase()) {
							case 'velocity':
								_this.jointMotorType = ConstraintMotorTypeEnum.VELOCITY;
								
								//_this.physicsObject.enableMotor(true);
								//_this.physicsObject.setAngularOnly(true);
								break;
							case 'angle':
							case 'angular':
								_this.jointMotorType = ConstraintMotorTypeEnum.ANGULAR;
								_this.physicsObject.enableMotor(true);
								//_this.physicsObject.setAngularOnly(true);
								break;	
							}
						}
						if (item.hasOwnProperty('startangle'))
						{
							_this.startJointAngle = item.startangle;
							_this.targetJointAngle = _this.startJointAngle;
						}
						var threshold = 100000000000;
						if (item.hasOwnProperty('threshold'))
						{
							threshold = item.threshold;
						}
						_this.physicsObject.setBreakingImpulseThreshold(threshold);
						
					}
				}
			}
			break;
		case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
			if (item.hasOwnProperty('joint'))
			{
				if (item.joint.length == 2)
				{
					if ((item.joint[0].hasOwnProperty('join')) && (item.joint[1].hasOwnProperty('join')))
					{					
						//const pivotA = new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z );
						//const pivotB = new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z );
						let physicsobjectA = _this.parentSide.getUIDObjectMap(item.joint[0].join.uid, ObjectTypeEnum.PHYSICSBODY);
						let physicsobjectB = _this.parentSide.getUIDObjectMap(item.joint[1].join.uid, ObjectTypeEnum.PHYSICSBODY);
						if ((physicsobjectA != null) && (physicsobjectA != null))
						{
							var localA = new Ammo.btTransform();
							var localB = new Ammo.btTransform();	
							localA.setIdentity();
							localB.setIdentity();
							localA.getBasis().setEulerZYX(THREE.Math.degToRad(item.joint[0].join.orientation.z), THREE.Math.degToRad(item.joint[0].join.orientation.y), THREE.Math.degToRad(item.joint[0].join.orientation.x));
							localA.setOrigin(new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z ));
							localB.getBasis().setEulerZYX(THREE.Math.degToRad(item.joint[1].join.orientation.z) ,THREE.Math.degToRad(item.joint[1].join.orientation.y) ,THREE.Math.degToRad(item.joint[1].join.orientation.x));
							localB.setOrigin(new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z ));
							let physicsbodyA = physicsobjectA.getPhysicsObject();
							let physicsbodyB = physicsobjectB.getPhysicsObject();
							_this.physicsObject = new Ammo.btConeTwistConstraint( physicsbodyA, physicsbodyB, localA, localB);
						}
					}
					if (item.hasOwnProperty('motor'))
					{
						switch (item.motor.toLowerCase()) {
						case 'velocity':
							_this.jointMotorType = ConstraintMotorTypeEnum.VELOCITY;
							break;
						case 'angle':
						case 'angular':
							_this.jointMotorType = ConstraintMotorTypeEnum.ANGULAR;
							//_this.physicsObject.enableMotor(true);
							_this.physicsObject.setAngularOnly(true);
							break;	
						}
					}
					if (item.hasOwnProperty('damping'))
					{
						_this.physicsObject.setDamping(item.damping);
					}
					if (item.hasOwnProperty('swing1'))
					{
						_this.physicsObject.setLimit(5, THREE.Math.degToRad(item.swing1));	
					}
					if (item.hasOwnProperty('swing2'))
					{
						_this.physicsObject.setLimit(4, THREE.Math.degToRad(item.swing2));	
					}
					if (item.hasOwnProperty('twist'))
					{
						_this.physicsObject.setLimit(3, THREE.Math.degToRad(item.twist));	
					}
					
					var threshold = 100000000000;
					if (item.hasOwnProperty('threshold'))
					{
						threshold = item.threshold;
					}
					_this.physicsObject.setBreakingImpulseThreshold(threshold);
				}
			}
			break;
		case PhysicsTypeEnum.CONSTRAINT_PT2PT:
			// Point 2 Point constraint
			if (item.hasOwnProperty('joint'))
			{
				if (item.joint.length == 2)
				{
					if ((item.joint[0].hasOwnProperty('join')) && (item.joint[1].hasOwnProperty('join')))
					{					
						const pivotA = new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z );
						const pivotB = new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z );
						let physicsobjectA = _this.parentSide.getUIDObjectMap(item.joint[0].join.uid, ObjectTypeEnum.PHYSICSBODY);
						let physicsobjectB = _this.parentSide.getUIDObjectMap(item.joint[1].join.uid, ObjectTypeEnum.PHYSICSBODY);
						if ((physicsobjectA != null) && (physicsobjectA != null))
						{
							let physicsbodyA = physicsobjectA.getPhysicsObject();
							let physicsbodyB = physicsobjectB.getPhysicsObject();
							_this.physicsObject = new Ammo.btPoint2PointConstraint( physicsbodyA, physicsbodyB, pivotA, pivotB);
						}
					}
					var threshold = 100000000000;
					if (item.hasOwnProperty('threshold'))
					{
						threshold = item.threshold;
					}
					_this.physicsObject.setBreakingImpulseThreshold(threshold);
				}
			}
			break;
		case PhysicsTypeEnum.CONSTRAINT_FIXED:
			// Fixed constraint
			if (item.hasOwnProperty('joint'))
			{
				if (item.joint.length == 2)
				{
					if ((item.joint[0].hasOwnProperty('join')) && (item.joint[1].hasOwnProperty('join')))
					{					
						//const pivotA = new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z );
						//const pivotB = new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z );
						let physicsobjectA = _this.parentSide.getUIDObjectMap(item.joint[0].join.uid, ObjectTypeEnum.PHYSICSBODY);
						let physicsobjectB = _this.parentSide.getUIDObjectMap(item.joint[1].join.uid, ObjectTypeEnum.PHYSICSBODY);
						if ((physicsobjectA != null) && (physicsobjectA != null))
						{
							var localA = new Ammo.btTransform();
							var localB = new Ammo.btTransform();	
							localA.setIdentity();
							localB.setIdentity();
							localA.getBasis().setEulerZYX(THREE.Math.degToRad(item.joint[0].join.orientation.z), THREE.Math.degToRad(item.joint[0].join.orientation.y), THREE.Math.degToRad(item.joint[0].join.orientation.x));
							localA.setOrigin(new Ammo.btVector3( item.joint[0].join.pivot.x, item.joint[0].join.pivot.y, item.joint[0].join.pivot.z ));
							localB.getBasis().setEulerZYX(THREE.Math.degToRad(item.joint[1].join.orientation.z) ,THREE.Math.degToRad(item.joint[1].join.orientation.y) ,THREE.Math.degToRad(item.joint[1].join.orientation.x));
							localB.setOrigin(new Ammo.btVector3( item.joint[1].join.pivot.x, item.joint[1].join.pivot.y, item.joint[1].join.pivot.z ));
							let physicsbodyA = physicsobjectA.getPhysicsObject();
							let physicsbodyB = physicsobjectB.getPhysicsObject();
							_this.physicsObject = new Ammo.btFixedConstraint( physicsbodyA, physicsbodyB, localA, localB);
						}
					}
					var threshold = 100000000000;
					if (item.hasOwnProperty('threshold'))
					{
						threshold = item.threshold;
					}
					_this.physicsObject.setBreakingImpulseThreshold(threshold);
				}
			}
			break;
				
		}
		
	};


	if (g_physicsWorld == null)
	{
		initPhysics();
	}
	//var rotateeuler = new THREE.Euler();
	if (this.UID == null)
	{
		if (item.hasOwnProperty('uid'))
		{
			this.UID = item.uid;
		}
		else
		{
			this.UID = new Date().getTime();
		}
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
	
	
	if (item.hasOwnProperty('mass'))
	{
		this.mass = item.mass;
		this.initialStoredMass = item.mass; 
	}
	if (item.hasOwnProperty('kinematic'))
	{
		if ((this.mass == 0) && (item.kinematic))
		{
			this.isKinematic = true;
		}
	}

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

	if (this.minPosition != null)
	{
		this.pendingTranslation.min(this.minPosition);		
		this.targetPosition.min(this.minPosition);
		this.pendingNewPosition.min(this.minPosition);	
	}	
	if (this.maxPosition != null)
	{
		this.pendingTranslation.max(this.maxPosition);
		this.targetPosition.max(this.maxPosition);
		this.pendingNewPosition.max(this.maxPosition);	
	}


	if (item.hasOwnProperty('margin'))
	{
		this.margin = item.margin;
	}
	
	if (item.hasOwnProperty('friction'))
	{
		this.friction = item.friction;
	}
	
	if (item.hasOwnProperty('rollingfriction'))
	{
		this.rollingFriction = item.rollingfriction
	}
	
	if (physicstype == null)
	{
		if (item.hasOwnProperty('type'))
		{
			switch (item.type.toLowerCase()) {
			case 'box':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_BOX;
				break;
			case 'sphere':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_SPHERE;
				break;	
			case 'cylinder':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_CYLINDER;
				break;
			case 'cone':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_CONE;
				break;
			case 'convex':
			case 'convexhull':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_CONVEXHULL;
				break;
			case 'bvh':
			case 'bvhtriangle':
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH;
				break;
			case 'compound':	
				this.physicsType = PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE;
				break;
			case 'cloth':
				this.physicsType = PhysicsTypeEnum.SOFTBODY_CLOTH;
				break;	
			case 'rope':
				this.physicsType = PhysicsTypeEnum.SOFTBODY_ROPE;
				break;
			case 'hinge':	
				this.physicsType = PhysicsTypeEnum.CONSTRAINT_HINGE;
				break;
			case 'conetwist':
				this.physicsType = PhysicsTypeEnum.CONSTRAINT_CONETWIST;
				break;
			case 'pt2pt':	
				this.physicsType = PhysicsTypeEnum.CONSTRAINT_PT2PT;
				break;
			case 'fixed':
				this.physicsType = PhysicsTypeEnum.CONSTRAINT_FIXED;			
				break;
			}
		}
	}
	
	if ((this.physicsType == PhysicsTypeEnum.CONSTRAINT_HINGE) || (this.physicsType == PhysicsTypeEnum.CONSTRAINT_PT2PT) || (this.physicsType == PhysicsTypeEnum.CONSTRAINT_FIXED) || (this.physicsType == PhysicsTypeEnum.CONSTRAINT_CONETWIST))
	{
		_this.objectType = ObjectTypeEnum.PHYSICSCONSTRAINT;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.PHYSICSCONSTRAINT);
	}
	else
	{
		_this.objectType = ObjectTypeEnum.PHYSICSBODY;
		_this.parentSide.setUIDObjectMap(this.UID, _this, ObjectTypeEnum.PHYSICSBODY);
	}
	
	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:

		var shape = createPrimitiveShape(this.physicsType, dimension, item);
		shape.setMargin( _this.margin );
		this.initialStoredPosition.copy(calcShapePosition(this.physicsType, dimension, position, item));
		this.initialStoredQuaternion.copy(calcShapeQuaternion(rotation, item));
		_this.localInertia.setValue( 0, 0, 0 );
		shape.calculateLocalInertia( _this.mass, _this.localInertia );
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin( new Ammo.btVector3( _this.initialStoredPosition.x, _this.initialStoredPosition.y, _this.initialStoredPosition.z ) );
		transform.setRotation( new Ammo.btQuaternion( _this.initialStoredQuaternion.x, _this.initialStoredQuaternion.y, _this.initialStoredQuaternion.z, _this.initialStoredQuaternion.w ) );
		const motionState = new Ammo.btDefaultMotionState( transform );
		const rbInfo = new Ammo.btRigidBodyConstructionInfo( _this.mass, motionState, shape, _this.localInertia );
		
		_this.physicsObject = new Ammo.btRigidBody( rbInfo ); 
		_this.physicsObject.setUserPointer(_this);
		if ( _this.mass > 0 ) {
			_this.physicsObject.setActivationState( 4 );
		}
		else
		{
			if (_this.isKinematic)
			{
				_this.physicsObject.setActivationState( 4 );
				_this.physicsObject.setCollisionFlags( 2 );
			}
		}
		_this.physicsObject.setFriction( _this.friction );
		if (_this.rollingFriction != null)
		{
			_this.physicsObject.setRollingFriction( _this.rollingFriction );
		}
		
		setupContactResultCallback();
        setupContactPairResultCallback();
		break;
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
		this.initialStoredPosition.copy(calcShapePosition(this.physicsType, null, position, item));	
		this.initialStoredQuaternion.copy(calcShapeQuaternion(rotation, item));
		this.modelRequired = true;
		if (item.hasOwnProperty('fbx'))
		{
			this.modelRequired = false;
			var loader = new THREE.FBXLoader(g_loadingManager);
			loader.load( 'assets/models/' + item.fbx, function ( object ) {
				model = object;
				_this.modelLoaded(model, item , false, AssetFileTypeEnum.FBX);

			}	)
		}
		
		if (item.hasOwnProperty('glb'))
		{

			this.modelRequired = false;
			var loader = new THREE.GLTFLoader(g_loadingManager);
			loader.load( 'assets/models/' + item.glb , function ( gltf ) {
					//model = gltf.scene;
					model = gltf;
					_this.modelLoaded(model, item , false, AssetFileTypeEnum.GLB);

			}	)
		}
		break;
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (item.hasOwnProperty('shapes'))
		{
			var compoundShape = new Ammo.btCompoundShape();
			if (item.shapes.length > 0)
			{
				for (let i = 0; i < item.shapes.length; i++)
				{
					if (item.shapes[i].hasOwnProperty('shape'))
					{
						if (item.shapes[i].shape.hasOwnProperty('type'))
						{
							var shapetype;
							switch (item.shapes[i].shape.type.toLowerCase()) {
							case 'box':
								shapetype = PhysicsTypeEnum.RIGIDBODY_BOX;
								break;
							case 'sphere':
								shapetype = PhysicsTypeEnum.RIGIDBODY_SPHERE;
								break;	
							case 'cylinder':
								shapetype = PhysicsTypeEnum.RIGIDBODY_CYLINDER;
								break;
							case 'cone':
								shapetype = PhysicsTypeEnum.RIGIDBODY_CONE;
								break;
							}
							var shape = new createPrimitiveShape(shapetype, null, item.shapes[i].shape);
							shape.setMargin(0);
							var pos = new THREE.Vector3(0, 0, 0);
							var rot = new THREE.Quaternion();
							pos.copy(calcShapePosition(shapetype, null, null, item.shapes[i].shape));
							rot.copy(calcShapeQuaternion(null, item.shapes[i].shape));
							const transform = new Ammo.btTransform();
							transform.setIdentity();
							transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
							transform.setRotation( new Ammo.btQuaternion( rot.x, rot.y, rot.z, rot.w ) );
							compoundShape.addChildShape(transform, shape);
						}
						
					}
				}
			}
			if (compoundShape.getNumChildShapes() > 0)
			{
				compoundShape.setMargin( _this.margin );
				this.initialStoredPosition.copy(calcShapePosition(this.physicsType, dimension, position, item));
				this.initialStoredQuaternion.copy(calcShapeQuaternion(rotation, item));
				_this.localInertia.setValue( 0, 0, 0 );
				compoundShape.calculateLocalInertia( _this.mass, _this.localInertia );
				const transform = new Ammo.btTransform();
				transform.setIdentity();
				transform.setOrigin( new Ammo.btVector3( _this.initialStoredPosition.x, _this.initialStoredPosition.y, _this.initialStoredPosition.z ) );
				transform.setRotation( new Ammo.btQuaternion( _this.initialStoredQuaternion.x, _this.initialStoredQuaternion.y, _this.initialStoredQuaternion.z, _this.initialStoredQuaternion.w ) );
				const motionState = new Ammo.btDefaultMotionState( transform );
				const rbInfo = new Ammo.btRigidBodyConstructionInfo( _this.mass, motionState, compoundShape, _this.localInertia );
				
				_this.physicsObject = new Ammo.btRigidBody( rbInfo ); 
				_this.physicsObject.setUserPointer(_this);
				if ( _this.mass > 0 ) {
					_this.physicsObject.setActivationState( 4 );
				}
				else
				{
					if (_this.isKinematic)
					{
						_this.physicsObject.setActivationState( 4 );
						_this.physicsObject.setCollisionFlags( 2 );
					}
				}
				_this.physicsObject.setFriction( _this.friction );
				if (_this.rollingFriction != null)
				{
					_this.physicsObject.setRollingFriction( _this.rollingFriction );
				}
				setupContactResultCallback();
				setupContactPairResultCallback();
			}
		} 
		break;
	case PhysicsTypeEnum.SOFTBODY_ROPE:	
		const softBodyHelpers = new Ammo.btSoftBodyHelpers();
		const ropeStart = new Ammo.btVector3( position.x, position.y, position.z );
		const ropeEnd = new Ammo.btVector3( position.x, position.y + length, position.z );

		_this.physicsObject = softBodyHelpers.CreateRope( g_physicsWorld.getWorldInfo(), ropeStart, ropeEnd, segments - 1, 0 );
		const sbConfig = _this.physicsObject.get_m_cfg();
		//sbConfig.set_viterations( 10 );
		//sbConfig.set_piterations( 10 );
		sbConfig.set_viterations( segments );
		sbConfig.set_piterations( segments );
		_this.physicsObject.setTotalMass( _this.mass, false );
		Ammo.castObject( _this.physicsObject, Ammo.btCollisionObject ).getCollisionShape().setMargin( _this.margin * 3 );
		// Disable deactivation
		_this.physicsObject.setActivationState( 4 );
		if (item.hasOwnProperty('stiffness'))
		{
			// Stiffness
			_this.physicsObject.get_m_materials().at( 0 ).set_m_kLST( item.stiffness );
			_this.physicsObject.get_m_materials().at( 0 ).set_m_kAST( item.stiffness );
		}
		break;
	case PhysicsTypeEnum.SOFTBODY_CLOTH:
		break;
	}
	
				

 	function createBvhTriangleShape(model) {
		var mesh = new Ammo.btTriangleMesh(true, true);
		model.traverse(child => {
			// convert the buffer geometry
			if (child.isMesh && child.geometry.isBufferGeometry) {

				const bg = child.geometry;
				var geometry = (new THREE.Geometry()).fromBufferGeometry(bg);

				var vertices = geometry.vertices;
				for (var i = 0; i < geometry.faces.length; i++) {
					var face = geometry.faces[i];
					if (face instanceof THREE.Face3) {
						mesh.addTriangle(
							new Ammo.btVector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z),
							new Ammo.btVector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z),
							new Ammo.btVector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z),
							false
						);
					} else if (face instanceof THREE.Face4) {
						mesh.addTriangle(
							new Ammo.btVector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z),
							new Ammo.btVector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z),
							new Ammo.btVector3(vertices[face.d].x, vertices[face.d].y, vertices[face.d].z),
							false
						);
						mesh.addTriangle(
							new Ammo.btVector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z),
							new Ammo.btVector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z),
							new Ammo.btVector3(vertices[face.d].x, vertices[face.d].y, vertices[face.d].z),
							false
						);
					}
				}
			}

		});
		var shape = new Ammo.btBvhTriangleMeshShape(mesh, true, true);
		return shape;
	}
	
	function createConvexHullPhysicsShape(model) {
		var tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
		var shape = new Ammo.btConvexHullShape();
		model.traverse( function ( child ) {
			// convert the buffer geometry
			if (child.isMesh && child.geometry.isBufferGeometry) {

				/* const bg = child.geometry;
				var geometry = (new THREE.Geometry()).fromBufferGeometry(bg);
				var coords = geometry.attributes.position.array; */
				
				var coords = child.geometry.getAttribute('position').array;

				for (var i = 0, il = coords.length; i < il; i+= 3) {
					tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
					var lastOne = (i >= (il - 3));
					shape.addPoint(tempBtVec3_1, lastOne);
				}
			}

		} );
		Ammo.destroy(tempBtVec3_1);
		return shape;
	}
	
	function createPrimitiveShape(type, dimensions = null, item = null) {
		var shape = null;
		switch (type) {
		case PhysicsTypeEnum.RIGIDBODY_BOX:
			if (dimensions != null)
			{
				shape = new Ammo.btBoxShape( new Ammo.btVector3( dimensions.x * 0.5, dimensions.y * 0.5, dimensions.z * 0.5 ) );
			}
			else
			{
				if ((item.hasOwnProperty('height')) && (item.hasOwnProperty('width')) && (item.hasOwnProperty('depth')))
				{
					shape = new Ammo.btBoxShape( new Ammo.btVector3( item.width * 0.5, item.height * 0.5, item.depth * 0.5 ) );
				}
			}
			break;
		case PhysicsTypeEnum.RIGIDBODY_SPHERE:
			if (dimensions != null)
			{
				shape = new Ammo.btSphereShape( dimensions );
			}
			else
			{
				if (item.hasOwnProperty('radius'))
				{
					shape = new Ammo.btSphereShape( item.radius );
				}
			}
			break;
		case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
			if (dimensions != null)
			{
				shape = new Ammo.btCylinderShape( new Ammo.btVector3( dimensions.x, dimensions.y * 0.5, dimensions.z ) );
			}
			else
			{
				if ((item.hasOwnProperty('radius')) && (item.hasOwnProperty('height')))
				{
					shape = new Ammo.btCylinderShape( new Ammo.btVector3( item.radius, item.height * 0.5, item.radius ) );
				}
			}
			break;
		case PhysicsTypeEnum.RIGIDBODY_CONE:
			if (dimensions != null)
			{
				//shape = new Ammo.btConeShape( dimension.x * 0.5, dimension.y );
				//shape = new Ammo.btConeShape( dimensions.x  * 0.5, dimensions.y );
				shape = new Ammo.btConeShape( dimensions.x, dimensions.y );
			}
			else
			{
				if ((item.hasOwnProperty('radius')) && (item.hasOwnProperty('height')))
				{
					shape = new Ammo.btConeShape( item.radius, item.height)
				}
			}
			break;
		}
		
		return shape;
	}
	
	
	function calcShapePosition(type, dimensions = null, position = null, item = null) {
		if (position == null)
		{
			var pos = new THREE.Vector3(0, 0, 0);
			if (item.hasOwnProperty('x'))
			{
				pos.x = item.x;
			}	
			var height = 0;
			switch (type) {
			case PhysicsTypeEnum.RIGIDBODY_BOX:
				if (dimensions != null)
				{
					height = dimensions.y;
				}
				else
				{
					if (item.hasOwnProperty('height'))
					{
						height = item.height;
					}
				}
				break;
			case PhysicsTypeEnum.RIGIDBODY_SPHERE:
				if (dimensions != null)
				{
					height = dimensions * 2;
				}
				else
				{
					if (item.hasOwnProperty('radius'))
					{
						height = item.radius * 2;
					}
				}
				break;
			case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
				if (dimensions != null)
				{
					height =  dimensions.y;
				}
				else
				{
					if (item.hasOwnProperty('height'))
					{
						height = item.height;
					}
				}
				break;
			case PhysicsTypeEnum.RIGIDBODY_CONE:
				if (dimensions != null)
				{
					height = dimensions.y;
				}
				else
				{
					if (item.hasOwnProperty('height'))
					{
						height =  item.height;
					}
				}
				break;
			
			}
			if (item.hasOwnProperty('y'))
			{
				pos.y = item.y + (height * 0.5);
			}
			else
			{
				pos.y = (height * 0.5);
			}
			if (item.hasOwnProperty('z'))
			{
				pos.z = item.z;
			}
			return pos;
		}
		else
		{
			return position;
		}
	}
	
	
	function calcShapeQuaternion(rotation = null, item = null) {
		var quat = new THREE.Quaternion();
		var rotateeuler = new THREE.Euler();
		
		if (rotation == null)
		{
			var rotatevector = new THREE.Vector3(0, 0, 0);
			if (item.hasOwnProperty('rotx'))
			{
				rotatevector.x = THREE.Math.degToRad(item.rotx);
			}
			if (item.hasOwnProperty('roty'))
			{
				rotatevector.y = THREE.Math.degToRad(item.roty);
			}
			if (item.hasOwnProperty('rotz'))
			{
				rotatevector.z = THREE.Math.degToRad(item.rotz);
			}
			rotateeuler.setFromVector3( rotatevector );
		}
		else
		{
			rotateeuler.setFromVector3( rotation );
		}
		quat.setFromEuler(rotateeuler);
		return quat;
	} 
	
	function setupContactResultCallback(){

		_this.contactResult = new Ammo.ConcreteContactResultCallback();
		
		_this.contactResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
			
			let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

			const distance = contactPoint.getDistance();

			if( distance > 0 ) return;

			let colWrapper0 = Ammo.wrapPointer( colObj0Wrap, Ammo.btCollisionObjectWrapper );
			let rb0 = Ammo.castObject( colWrapper0.getCollisionObject(), Ammo.btRigidBody );
			
			let colWrapper1 = Ammo.wrapPointer( colObj1Wrap, Ammo.btCollisionObjectWrapper );
			let rb1 = Ammo.castObject( colWrapper1.getCollisionObject(), Ammo.btRigidBody );

			let object0 = rb0.getUserPointer();
			let object1 = rb1.getUserPointer();

			let tag, localPos, worldPos

			if( object0.getUID() != _this.UID ){

				tag = threeObject0.userData.tag;
				localPos = contactPoint.get_m_localPointA();
				worldPos = contactPoint.get_m_positionWorldOnA();

			}
			else{

				tag = object1.userData.tag;
				localPos = contactPoint.get_m_localPointB();
				worldPos = contactPoint.get_m_positionWorldOnB();

			}
			
			let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
			let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

			
		}

	}


	function setupContactPairResultCallback(){

		_this.contactPairResult = new Ammo.ConcreteContactResultCallback();
		
		_this.contactPairResult.hasContact = false;

		_this.contactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
			
			let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

			const distance = contactPoint.getDistance();

			if( distance > 0 ) return;

			this.hasContact = true;
			
		}

	}

	
	
}


ARPhysicsObject.prototype.constructor = ARPhysicsObject;



ARPhysicsObject.prototype.createConstraint = function(){
	
	switch (this.physicsType) {
	case PhysicsTypeEnum.CONSTRAINT_HINGE:			
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:	
	case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
		this.addJointConstraint();
		break;
	case PhysicsTypeEnum.CONSTRAINT_FIXED:	
		this.addJointConstraint();
		break;	
	}
}

ARPhysicsObject.prototype.applyJointMovement = function(){

	switch (this.physicsType) {
	case PhysicsTypeEnum.CONSTRAINT_HINGE:
		switch (this.jointMotorType) {
		case ConstraintMotorTypeEnum.VELOCITY:
			this.physicsObject.enableAngularMotor( true, this.targetJointVelocity, this.jointSpeed );
			break;
		case ConstraintMotorTypeEnum.ANGULAR:
			this.physicsObject.setMotorTarget(THREE.Math.degToRad(this.targetJointAngle), this.jointSpeed);
			//this.physicsObject.setMotorTarget(THREE.Math.degToRad(45), this.jointSpeed);
			break;
		}
		break;		
	case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
		/* switch (this.jointMotorType) {
		case ConstraintMotorTypeEnum.VELOCITY:
			this.physicsObject.enableAngularMotor( true );
			break;
		case ConstraintMotorTypeEnum.ANGULAR:
			this.physicsObject.setMotorTarget(THREE.Math.degToRad(this.targetJointAngle), this.jointSpeed);
			//this.physicsObject.setMotorTarget(THREE.Math.degToRad(45), this.jointSpeed);
			break;
		} */
		break;		
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:	
		//this.addJointConstraint();
		break;
	}
}

ARPhysicsObject.prototype.setJointVelocityTarget = function(value, speed = 50){
	
	this.targetJointVelocity = value;
	this.jointSpeed = speed;
}

ARPhysicsObject.prototype.addJointVelocityTarget = function(value, speed = 50){
	
	this.targetJointVelocity = this.targetJointVelocity + value;
	this.jointSpeed = speed;
}

ARPhysicsObject.prototype.getJointVelocity  = function(){
	
	return this.targetJointVelocity;
}

ARPhysicsObject.prototype.setJointAngleTarget = function(value, speed = 50){
	
	this.targetJointAngle = value;
	this.jointSpeed = speed;
}

ARPhysicsObject.prototype.addJointAngleTarget = function(value, speed = 50){
	
	this.targetJointAngle = this.targetJointAngle + value;
	this.jointSpeed = speed;
}

ARPhysicsObject.prototype.getJointAngle  = function(){
	
	return this.targetJointAngle;
}

ARPhysicsObject.prototype.addAnchors = function(){
	
	switch (this.physicsType) {
	case PhysicsTypeEnum.SOFTBODY_ROPE:
	case PhysicsTypeEnum.SOFTBODY_CLOTH:	
		this.addSoftBodyAnchors();
		break;
	}
}



ARPhysicsObject.prototype.cubeControlled = function(){
	return this.isCubeControlled;
}

ARPhysicsObject.prototype.initialisePhysicsObject = function(pos = null){
	
	this.isNewPositionPending = false;
	this.isNewRotationPending = false;
	this.isEnabled = this.storedInitialEnabledState;
	this.isTargetPositionPending = false;
	this.pendingTranslation.set(0,0,0);
	this.targetPosition.set(0,0,0);
	this.pendingNewPosition.set(0,0,0);
	this.inPhysicsWorld = false;
    //this.physicsBody.setCollisionFlags( FLAGS.CF_KINEMATIC_OBJECT );
	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (this.mass != this.initialStoredMass)
		{
			this.physicsObject.mass = this.initialStoredMass;
			this.mass = this.initialStoredMass;
			this.physicsObject.updateMassProperties();
		}
		this.localInertia.setValue( 0, 0, 0 );
		this.physicsObject.setLinearVelocity(this.localInertia);
		this.physicsObject.setAngularVelocity(this.localInertia);
		const transform = new Ammo.btTransform();
		transform.setIdentity();
		if (pos == null)
		{
			transform.setOrigin( new Ammo.btVector3( this.initialStoredPosition.x, this.initialStoredPosition.y, this.initialStoredPosition.z ) );
			this.currentPosition.copy(this.initialStoredPosition);
		}
		else
		{
			transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
			this.currentPosition.copy(pos);
		}
		transform.setRotation( new Ammo.btQuaternion( this.initialStoredQuaternion.x, this.initialStoredQuaternion.y, this.initialStoredQuaternion.z, this.initialStoredQuaternion.w ) );
		this.currentQuaternion.copy(this.initialStoredQuaternion);
		this.currentEuler.setFromQuaternion(this.currentQuaternion)
		this.currentEuler.toVector3(this.currentRotation);
		this.physicsObject.setWorldTransform(transform);
		this.physicsObject.getMotionState().setWorldTransform(transform);
		
		this.contactListMap.clear();
		
		break;
	case PhysicsTypeEnum.CONSTRAINT_HINGE:
		
		this.targetJointAngle = this.startJointAngle;
		this.physicsObject.setMotorTarget(THREE.Math.degToRad(this.targetJointAngle), 0);
		this.targetJointVelocity = 0;
		break;
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:
	case PhysicsTypeEnum.CONSTRAINT_FIXED:
		
		break;
	}

	//g_physicsWorld.clearForces();
}

ARPhysicsObject.prototype.addPhysicsObject = function(){

	//this.isEnabled = this.storedInitialEnabledState;
	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (!this.inPhysicsWorld)
		{
			if (this.physicsObject != null)
			{

				g_physicsWorld.addRigidBody( this.physicsObject );
				this.inPhysicsWorld = true;
			}
		}
		break;
	case PhysicsTypeEnum.SOFTBODY_ROPE:
	case PhysicsTypeEnum.SOFTBODY_CLOTH:
		if (!this.inPhysicsWorld)
		{
			if (this.physicsObject != null)
			{
				g_physicsWorld.addSoftBody( this.physicsObject, 1, - 1 );	
				this.inPhysicsWorld = true;
			}
		}
		break;
	case PhysicsTypeEnum.CONSTRAINT_HINGE:
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:
	case PhysicsTypeEnum.CONSTRAINT_FIXED:
	case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
		if (!this.inPhysicsWorld)
		{
			
			if (this.physicsObject != null)
			{
				g_physicsWorld.addConstraint( this.physicsObject , true);
				this.inPhysicsWorld = true;
				this.isEnabled = true;
				//this.physicsObject.enableAngularMotor( true, 0, 50 );
			}
		}
		break;

	}
}

ARPhysicsObject.prototype.addPhysicsLocalObject = function(){
	
	if ((this.parentObject.getType() == ObjectTypeEnum.GROUP) || (this.parentObject.getType() == ObjectTypeEnum.MODEL))
	{
		this.initialStoredPosition.copy(this.parentObject.getObject3D().position);
		this.initialStoredQuaternion.copy(this.parentObject.getObject3D().quaternion);
		if ((this.isKinematic) && (this.isCubeControlled) && (this.parentSide.getCubeControlEnabled()) && (this.parentCube.getCubeState() == CubeStateEnum.ACTIVE) && (this.parentCube.getCubeControlActive()))
		{
			this.initialStoredQuaternion.multiply( this.parentCube.getMedianCubeRotation());
		}	
	}
	this.initialisePhysicsObject();
	this.addPhysicsObject();
	
	
}


ARPhysicsObject.prototype.addInitialisedPhysicsObject = function(pos = null){
	
	console.log("addInitialisedPhysicsObject " + pos);  
	this.initialisePhysicsObject(pos);
	this.addPhysicsObject();
}

ARPhysicsObject.prototype.addPhysicsConstraint = function(){
	
	this.initialisePhysicsObject();
	this.addPhysicsObject();
	
}


ARPhysicsObject.prototype.removePhysicsObject = function(){
	

	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (this.inPhysicsWorld)
		{
			g_physicsWorld.removeRigidBody( this.physicsObject );
			this.inPhysicsWorld = false;
		}
		break;
	case PhysicsTypeEnum.SOFTBODY_ROPE:
	case PhysicsTypeEnum.SOFTBODY_CLOTH:
		if (this.inPhysicsWorld)
		{
			g_physicsWorld.removeSoftBody( this.physicsObject);	
			this.inPhysicsWorld = false;
		}
		break;	
	case PhysicsTypeEnum.CONSTRAINT_HINGE:
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:
	case PhysicsTypeEnum.CONSTRAINT_FIXED:
	case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
		if (this.inPhysicsWorld)
		{
			g_physicsWorld.removeConstraint( this.physicsObject);
			this.inPhysicsWorld = false;
		}
		break;
		
	}
}

ARPhysicsObject.prototype.checkContactPair = function(object){	
	
	if ((this.physicsType != PhysicsTypeEnum.CONSTRAINT_HINGE) && (this.physicsType !=  PhysicsTypeEnum.CONSTRAINT_PT2PT) && (this.physicsType != PhysicsTypeEnum.CONSTRAINT_FIXED) &&
		(object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_HINGE) && (object.getPhysicsType() !=  PhysicsTypeEnum.CONSTRAINT_PT2PT) && (object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_FIXED) && (object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_CONETWIST))
	{		
		this.contactPairResult.hasContact = false;

		g_physicsWorld.contactPairTest(this.physicsObject, object.getPhysicsObject(), this.contactPairResult);
		return this.contactPairResult.hasContact;
	}
	else
	{
		return false;
	}		
}


ARPhysicsObject.prototype.checkFirstContactPair = function(object, continous = true){	
	
	if ((this.physicsType != PhysicsTypeEnum.CONSTRAINT_HINGE) && (this.physicsType !=  PhysicsTypeEnum.CONSTRAINT_PT2PT) && (this.physicsType != PhysicsTypeEnum.CONSTRAINT_FIXED) &&
		(object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_HINGE) && (object.getPhysicsType() !=  PhysicsTypeEnum.CONSTRAINT_PT2PT) && (object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_FIXED)  && (object.getPhysicsType() != PhysicsTypeEnum.CONSTRAINT_CONETWIST))
	{
		
		this.contactPairResult.hasContact = false;
		g_physicsWorld.contactPairTest(this.physicsObject, object.getPhysicsObject(), this.contactPairResult);
		let uid = object.getUID();
		if (this.contactPairResult.hasContact)
		{
			
			let contactentry = this.contactListMap.get(uid);
			if (contactentry == undefined)
			{
				this.contactListMap.set(uid, PhysicsContactTypeEnum.CONTACT);
				return true;
			}
			else
			{
				
				if (contactentry.value == PhysicsContactTypeEnum.CONTACT)
				{
					return false;
				}
				else
				{
					this.contactListMap.set(uid, PhysicsContactTypeEnum.CONTACT);
					if (continous)
					{
						return false;
					}
					return true;
					
				}
			}
		}
		else
		{
			let contactentry = this.contactListMap.get(uid);
			if (contactentry != undefined)
			{
				this.contactListMap.set(uid, PhysicsContactTypeEnum.NONE);
			}
		}

	}
	return false;
}

ARPhysicsObject.prototype.getType = function(){	
	return this.objectType;
}

ARPhysicsObject.prototype.getParentObject = function(){
	return this.parentObject;

}

ARPhysicsObject.prototype.getPhysicsType = function(){	
	return this.physicsType;
}

ARPhysicsObject.prototype.getPhysicsObject = function(){	
	return this.physicsObject;
}

ARPhysicsObject.prototype.isModelRequired = function(){
	return this.modelRequired;
}

ARPhysicsObject.prototype.setupModel = function(model){

	this.setupCollisionModelMesh(model);
	
}

ARPhysicsObject.prototype.getUID = function(){	
	return this.UID;
}

ARPhysicsObject.prototype.getUserData = function(){	
	return this.userData
}

ARPhysicsObject.prototype.getCurrentQuaternion = function(){
	
	return this.currentQuaternion;
}

ARPhysicsObject.prototype.getCurrentPosition = function(){
	
	return this.currentPosition;
}

ARPhysicsObject.prototype.getCurrentPositionX = function(){
	return this.currentPosition.x;
}

ARPhysicsObject.prototype.getCurrentPositionY = function(){
	return this.currentPosition.y;
}

ARPhysicsObject.prototype.getUpVector = function(){

	this.upVector.set(0, 1, 0);
	this.upVector.applyQuaternion(this.currentQuaternion);
	return this.upVector;
}

ARPhysicsObject.prototype.getForwardVector = function(){

	this.forwardVector.set(0, 0, 1);
	this.forwardVector.applyQuaternion(this.currentQuaternion);
	return this.forwardVector;
}

ARPhysicsObject.prototype.getCurrentPositionZ = function(){
	return this.currentPosition.z;
}

ARPhysicsObject.prototype.getCurrentRotationAngleX = function(){	
	return THREE.Math.radToDeg(this.currentRotation.x);
}

ARPhysicsObject.prototype.getCurrentRotationAngleY = function(){	
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

ARPhysicsObject.prototype.getCurrentRotationAngleZ = function(){	
	return THREE.Math.radToDeg(this.currentRotation.z);
}


ARPhysicsObject.prototype.setCurrentRotationAngleX = function(value, fromPhysics = false){
	if (this.isKinematic)
	{	
		this.currentRotation.x = THREE.Math.degToRad(value);
		this.currentEuler.setFromVector3( this.currentRotation );
		this.pendingNewQuaternion.setFromEuler(this.currentEuler);
		this.isNewRotationPending = true;		
	}
}

ARPhysicsObject.prototype.setCurrentRotationAngleY = function(value, fromPhysics = false){	
	if (this.isKinematic)
	{
		this.currentRotation.y = THREE.Math.degToRad(value);
		this.currentEuler.setFromVector3( this.currentRotation );
		this.pendingNewQuaternion.setFromEuler(this.currentEuler);
		this.isNewRotationPending = true;		
	}
}

ARPhysicsObject.prototype.setCurrentRotationAngleZ = function(value, fromPhysics = false){	
	if (this.isKinematic)
	{	
		this.currentRotation.z = THREE.Math.degToRad(value);
		this.currentEuler.setFromVector3( this.currentRotation );
		this.pendingNewQuaternion.setFromEuler(this.currentEuler);
		this.isNewRotationPending = true;		
	}
}

ARPhysicsObject.prototype.setCurrentRotation = function(value, fromPhysics = false){	
	if (this.isKinematic)
	{
		this.currentRotation.copy(value);
		this.currentEuler.setFromVector3( this.currentRotation );
		this.pendingNewQuaternion.setFromEuler(this.currentEuler);
		this.isNewRotationPending = true;
	}
}

ARPhysicsObject.prototype.setCurrentQuaternion = function(value, fromPhysics = false){	
	if (this.isKinematic)
	{
		this.pendingNewQuaternion.set( value.x(), value.y(), value.z(), value.w() );
		this.isNewRotationPending = true;
	}
}

ARPhysicsObject.prototype.getCurrentRotation = function(){	
	return this.currentRotation;
}

ARPhysicsObject.prototype.setPhysicsMass = function(value){

	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (this.mass != value)
		{
			console.log("change mass " + value);
			if (this.inPhysicsWorld)
			{
				console.log("remove rigidbody");
				g_physicsWorld.removeRigidBody( this.physicsObject );
			}
			this.mass = value;
			this.localInertia.setValue( 0, 0, 0 );
			this.physicsObject.getCollisionShape().calculateLocalInertia(this.mass, this.localInertia );
			this.physicsObject.setMassProps(this.mass, this.localInertia);
			g_physicsWorld.addRigidBody( this.physicsObject );
			this.inPhysicsWorld = true;
			this.isEnabled = true;
			let ms = this.physicsObject.getMotionState();
			if ( ms ) {
				console.log("motionstate");
				ms.getWorldTransform( this.physicsTransform );
				let p = this.physicsTransform.getOrigin();
				let q = this.physicsTransform.getRotation();
				if (this.parentObject != null)
				{
					if ((this.parentObject.getType() == ObjectTypeEnum.MODEL) || (this.parentObject.getType() == ObjectTypeEnum.GROUP))
					{
						this.parentObject.setCurrentPositionXYZ(p.x(), p.y(), p.z(), true );
						this.parentObject.setCurrentQuaternion(q, true);
					}
				}
				this.currentPosition.set(p.x(), p.y(), p.z());
				this.currentQuaternion.set(q.x(), q.y(), q.z(), q.w());
				this.currentEuler.setFromQuaternion(this.currentQuaternion)
				this.currentEuler.toVector3(this.currentRotation);
			}
		}
		break;
	}
}

ARPhysicsObject.prototype.isKinematic = function(){
	
	return this.isKinematic;
}

ARPhysicsObject.prototype.applyLinearVelocity = function(direction, scale){
	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if ((this.inPhysicsWorld) && (this.isEnabled))
		{
			direction.multiplyScalar( scale );
			this.physicsObject.setLinearVelocity( new Ammo.btVector3( direction.x, direction.y, direction.z ) );
		}
		break;
	}
}

ARPhysicsObject.prototype.setCurrentPositionXYZ = function(valuex, valuey, valuez){	
	
	if (this.isKinematic)
	{
		if (valuex != null)
		{
			this.isNewPositionPending = true;
			this.pendingNewPosition.x = valuex;
		}
		else
		{
			this.pendingNewPosition.x = this.currentPosition.x;
		}
		if (valuey != null)
		{
			this.isNewPositionPending = true;
			this.pendingNewPosition.y = valuey;
		}
		else
		{
			this.pendingNewPosition.y = this.currentPosition.y;
		}
		if (valuez != null)
		{
			this.isNewPositionPending = true;
			this.pendingNewPosition.z = valuez;
		}
		else
		{
			this.pendingNewPosition.z = this.currentPosition.z;
		}
		this.isTargetPositionPending = false;		
	}
}

ARPhysicsObject.prototype.getEnabled = function(){
	return this.isEnabled;
}

ARPhysicsObject.prototype.setEnabled = function(value){
	
	if (this.isEnabled != value)
	{
		this.isEnabled = value; 

	}
}


ARPhysicsObject.prototype.cancelTranslation = function(){
	this.isTargetPositionPending = false;
	
}

ARPhysicsObject.prototype.translateObject = function(value, speed = null){

	if (this.isKinematic)
	{
		if ((speed != null) && (this.moveSpeed != speed))
		{
			this.moveSpeed = speed;
		}
		if (!this.isTargetPositionPending)
		{
			this.targetPosition.copy(this.currentPosition);
			this.moveClock.start();
		}
		this.targetPosition.add(value);
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
		this.isTargetPositionPending = true;
		this.isNewPositionPending = false;
		
	}
	else
	{
		this.pendingTranslation.add(value);
	}
	
}


ARPhysicsObject.prototype.update = function(){
	var _this = this;
	
	if (this.isEnabled)
	{
		if ((this.mass > 0) || (this.isKinematic))
		{

			switch (this.physicsType) {
			case PhysicsTypeEnum.RIGIDBODY_BOX:
			case PhysicsTypeEnum.RIGIDBODY_SPHERE:
			case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
			case PhysicsTypeEnum.RIGIDBODY_CONE:
			case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
			case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
			case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
				if ((this.isKinematic) && (this.isCubeControlled) && (this.parentSide.getCubeControlEnabled()) && (this.parentCube.getCubeState() == CubeStateEnum.ACTIVE) && (this.parentCube.getCubeControlActive()))
				{
					if (this.isNewRotationPending)
					{
						this.pendingNewQuaternion.multiply( this.parentCube.getMedianCubeRotation());
						//this.pendingNewQuaternion.multiply( this.parentCube.getCubeRotation() );
					}
					else
					{
						this.pendingNewQuaternion.copy( this.parentCube.getMedianCubeRotation() );
						//this.pendingNewQuaternion.copy( this.parentCube.getCubeRotation() );
						this.isNewRotationPending = true;
					}
				}	
				if (!((this.pendingTranslation.x == 0) && (this.pendingTranslation.y == 0) && (this.pendingTranslation.z == 0))) 
				{
					moveRigidBody();
				}
				if ((this.isKinematic) && (this.isTargetPositionPending))
				{
					moveRigidBody();
				}
				if ((this.isNewPositionPending) || (this.isNewRotationPending))
				{
					setPositionOrientationRigidBody();
					this.isNewPositionPending = false;
					this.isNewRotationPending = false;
				}
								
				let ms = this.physicsObject.getMotionState();
				if ( ms ) {

					ms.getWorldTransform( this.physicsTransform );
					let p = this.physicsTransform.getOrigin();
					let q = this.physicsTransform.getRotation();
					//this.parentObject.getModelObject().position.set( p.x(), p.y(), p.z() );
					//this.parentObject.getModelObject().quaternion.set( q.x(), q.y(), q.z(), q.w() );
					if (this.parentObject != null)
					{
						if ((this.parentObject.getType() == ObjectTypeEnum.MODEL) || (this.parentObject.getType() == ObjectTypeEnum.GROUP))
						{
							this.parentObject.setCurrentPositionXYZ(p.x(), p.y(), p.z(), true );
							this.parentObject.setCurrentQuaternion(q, true);
						}
					}
					this.currentPosition.set(p.x(), p.y(), p.z());
					this.currentQuaternion.set(q.x(), q.y(), q.z(), q.w());
					this.currentEuler.setFromQuaternion(this.currentQuaternion)
					this.currentEuler.toVector3(this.currentRotation);
				}
				break;
			case PhysicsTypeEnum.SOFTBODY_ROPE:
				if (this.parentObject != null)
				{
					if (this.parentObject.getType() == ObjectTypeEnum.MODEL)
					{
						const rope = this.parentObject.getObject3D();
						const ropePositions = rope.geometry.attributes.position.array;
						const numVerts = ropePositions.length / 3;
						const nodes = this.physicsObject.get_m_nodes();
						let indexFloat = 0;

						for ( let i = 0; i < numVerts; i ++ ) {

							const node = nodes.at( i );
							const nodePos = node.get_m_x();
							ropePositions[ indexFloat ++ ] = nodePos.x();
							ropePositions[ indexFloat ++ ] = nodePos.y();
							ropePositions[ indexFloat ++ ] = nodePos.z();
							if (i == 0)
							{
								this.currentPosition.set(nodePos.x(), nodePos.y(), nodePos.z());
							}
						}

						rope.geometry.attributes.position.needsUpdate = true;
					}
				}
				break;
			case PhysicsTypeEnum.SOFTBODY_CLOTH:
				if (this.parentObject != null)
				{
					if (this.parentObject.getType() == ObjectTypeEnum.MODEL)
					{
						const cloth = this.parentObject.getObject3D();
						const clothPositions = cloth.geometry.attributes.position.array;
						const numVerts = clothPositions.length / 3;
						const nodes = this.physicsObject.get_m_nodes();
						let indexFloat = 0;

						for ( let i = 0; i < numVerts; i ++ ) {

							const node = nodes.at( i );
							const nodePos = node.get_m_x();
							clothPositions[ indexFloat ++ ] = nodePos.x();
							clothPositions[ indexFloat ++ ] = nodePos.y();
							clothPositions[ indexFloat ++ ] = nodePos.z();

						}

						cloth.geometry.computeVertexNormals();
						cloth.geometry.attributes.position.needsUpdate = true;
						cloth.geometry.attributes.normal.needsUpdate = true;
					}

				}					
			}
		}
	}
	
	function setPositionOrientationRigidBody()
	{
		
		if (_this.isKinematic)
		{
			let ms = _this.physicsObject.getMotionState();
			if ( ms ) {
				ms.getWorldTransform( _this.physicsTransform );
				let p = _this.physicsTransform.getOrigin();
				let q = _this.physicsTransform.getRotation();
				if (_this.isNewPositionPending)
				{
					_this.ammoTempPos.setValue(_this.pendingNewPosition.x, _this.pendingNewPosition.y, _this.pendingNewPosition.z);
				}
				else
				{
					_this.ammoTempPos.setValue(p.x(), p.y(), p.z());
				}
				if (_this.isNewRotationPending)
				{
					_this.ammoTempQuat.setValue(_this.pendingNewQuaternion.x, _this.pendingNewQuaternion.y, _this.pendingNewQuaternion.z, _this.pendingNewQuaternion.w);
				}
				else
				{
					_this.ammoTempQuat.setValue(q.x(), q.y(), q.z(), q.w());
				}
				_this.ammoTempTrans.setIdentity();
				_this.ammoTempTrans.setOrigin( _this.ammoTempPos ); 
				_this.ammoTempTrans.setRotation( _this.ammoTempQuat ); 
				ms.setWorldTransform(_this.ammoTempTrans);
			}
		}
		
	}
	
	
	function moveRigidBody()
	{
		
		if (_this.isKinematic)
		{
			let delta = _this.moveClock.getDelta();
			let ms = _this.physicsObject.getMotionState();
			if ( ms ) {
				var pendingx = true;
				var pendingy = true;
				var pendingz = true;
				ms.getWorldTransform( _this.physicsTransform );
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
				let q = _this.physicsTransform.getRotation();
				_this.ammoTempPos.setValue(_this.pendingTranslation.x, _this.pendingTranslation.y, _this.pendingTranslation.z);
				_this.ammoTempQuat.setValue(q.x(), q.y(), q.z(), q.w());
				_this.ammoTempTrans.setIdentity();
				_this.ammoTempTrans.setOrigin( _this.ammoTempPos ); 
				_this.ammoTempTrans.setRotation( _this.ammoTempQuat ); 
				ms.setWorldTransform(_this.ammoTempTrans);
				//Math.round((num + Number.EPSILON) * 100) / 100
				//Math.abs(_this.targetPosition.x - _this.currentPosition.x)
				//let distance = _this.currentPosition.distanceTo(_this.targetPosition);
/* 				console.log("distance " + distance);
				if (distance > 0.00001)
				{
					_this.pendingTranslation.x = Math.min((_this.targetPosition.x - _this.currentPosition.x), (((_this.targetPosition.x - _this.currentPosition.x) / distance) * (_this.moveSpeed * delta)));
					_this.pendingTranslation.y = Math.min((_this.targetPosition.y - _this.currentPosition.y), (((_this.targetPosition.y - _this.currentPosition.y) / distance) * (_this.moveSpeed * delta)));
					_this.pendingTranslation.z = Math.min((_this.targetPosition.z - _this.currentPosition.z), (((_this.targetPosition.z - _this.currentPosition.z) / distance) * (_this.moveSpeed * delta)));
					_this.pendingTranslation.add(_this.currentPosition);
					let q = _this.physicsTransform.getRotation();
					_this.ammoTempPos.setValue(_this.pendingTranslation.x, _this.pendingTranslation.y, _this.pendingTranslation.z);
					_this.ammoTempQuat.setValue(q.x(), q.y(), q.z(), q.w());
					_this.ammoTempTrans.setIdentity();
					_this.ammoTempTrans.setOrigin( _this.ammoTempPos ); 
					_this.ammoTempTrans.setRotation( _this.ammoTempQuat ); 
					ms.setWorldTransform(_this.ammoTempTrans);
				}
				else
				{
					_this.isTargetPositionPending = false;
					_this.moveClock.stop();
				} */
			}
		}
		else
		{
			let resultantImpulse = new Ammo.btVector3( _this.pendingTranslation.x, _this.pendingTranslation.y, _this.pendingTranslation.z )
			//resultantImpulse.op_mul(scaledFactor);
			_this.physicsObject.setLinearVelocity( resultantImpulse );
			Ammo.destroy(resultantImpulse);
			
		} 
		_this.pendingTranslation.set(0, 0, 0);
	}	

}

ARPhysicsObject.prototype.dispose = function(){
	this.UID = null;
	this.userData = null;
	this.isEnabled = null;
	if (this.moveClock.running)
	{
		this.moveClock.stop();
	}
	this.moveClock = null;
	this.initialStoredQuaternion = null;
	this.storedInitialEnabledState = null;
	this.currentQuaternion = null;
	switch (this.physicsType) {
	case PhysicsTypeEnum.RIGIDBODY_BOX:
	case PhysicsTypeEnum.RIGIDBODY_SPHERE:
	case PhysicsTypeEnum.RIGIDBODY_CYLINDER:
	case PhysicsTypeEnum.RIGIDBODY_CONE:
	case PhysicsTypeEnum.RIGIDBODY_CONVEXHULL:
	case PhysicsTypeEnum.RIGIDBODY_BVHTRIANGLEMESH:
	case PhysicsTypeEnum.RIGIDBODY_COMPOUNDSHAPE:
		if (this.inPhysicsWorld)
		{
			g_physicsWorld.removeRigidBody( this.physicsObject );
			Ammo.destroy(this.physicsObject);
			this.physicsObject = null;
			this.inPhysicsWorld = false;
		}
		break;
	case PhysicsTypeEnum.SOFTBODY_ROPE:
	case PhysicsTypeEnum.SOFTBODY_CLOTH:
		if (this.inPhysicsWorld)
		{
			g_physicsWorld.removeSoftBody( this.physicsObject );
			Ammo.destroy(this.physicsObject);
			this.physicsObject = null;
			this.inPhysicsWorld = false;
		}
		break;
	case PhysicsTypeEnum.CONSTRAINT_HINGE:
	case PhysicsTypeEnum.CONSTRAINT_PT2PT:
	case PhysicsTypeEnum.CONSTRAINT_FIXED:
	case PhysicsTypeEnum.CONSTRAINT_CONETWIST:
		if (!this.inPhysicsWorld)
		{
			g_physicsWorld.removeConstraint( this.physicsObject);
			Ammo.destroy(this.physicsObject);
			this.physicsObject = null;
			this.inPhysicsWorld = false;
		}
		break;		
	}
	if (this.contactListMap != null)
	{
		this.contactListMap.clear();
		this.contactListMap = null;
	}
}