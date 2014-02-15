var camera, cameraTarget, cameraDummy;
var scene, scene2;
var renderer;

var angle = ( Math.PI * 2 ) / 10;
var rotation = 0, rotationTarget = 0;

var ray, projector, mouse;
var videos, objects;

var MOUSEOVERED = null, CLICKED = null;

var init = function () {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );

	cameraTarget = new THREE.Vector3( 0, 0, - 1500 );

	cameraDummy = new THREE.Object3D();
	cameraDummy.add( camera );

	scene = new THREE.Scene();
	scene.add( cameraDummy );

	ray = new THREE.Ray();
	projector = new THREE.Projector();
	mouse = new THREE.Vector2();

	scene2 = new THREE.Scene();

	//

	var geometry = new THREE.Geometry();

	for ( var i = 0; i < 50000; i ++ ) {

		var vector = new THREE.Vector3();
		vector.x = Math.random() - 0.5;
		vector.y = Math.random() - 0.5;
		vector.z = Math.random() - 0.5;
		vector.normalize();
		vector.multiplyScalar( Math.random() * 800 + 400 );

		geometry.vertices.push( vector );

	}

	var material = new THREE.ParticleBasicMaterial( {
		size: 4,
		opacity: 0.1,
		depthTest: false,
		blending: THREE.AdditiveBlending,
		transparent: true
	} );

	var particles = new THREE.ParticleSystem( geometry, material );
	scene.add( particles );

	//

	videos = [];
	objects = [];

	var geometry = new THREE.IcosahedronGeometry( 400, 0 );

	for ( var i = 0; i < 10; i ++ ) {

		var video = new RGBDVideo( i );
		video.position.x = Math.sin( i * angle ) * 800;
		video.position.z = Math.cos( i * angle ) * 800;
		video.rotation.y = i * angle;
		scene.add( video );

		videos.push( video );

		// if ( i === 0 ) video.play();

		var sphere = new THREE.Mesh( geometry );
		sphere.position.x = Math.sin( i * angle ) * 500;
		sphere.position.y = - 100;
		sphere.position.z = Math.cos( i * angle ) * 500;
		sphere.updateMatrix();
		sphere.updateMatrixWorld();
		// scene.add( sphere );

		objects.push( sphere );

		sphere.material.opacity = 0.5;

	}

	var ratio = window.devicePixelRatio || 1;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth * ratio, window.innerHeight * ratio );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';
	document.body.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = 0;
	// document.body.appendChild( stats.domElement );

	//

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'click', onDocumentClick, false );

	//

	cameraDummy.position.set( Math.sin( 0 ) * 1500, 2000, 0 );

	new TWEEN.Tween( cameraDummy.position )
		.to( { z: Math.cos( 0 ) * 1500 }, 3000 )
		.easing( TWEEN.Easing.Exponential.Out )
		.start();

	new TWEEN.Tween( cameraDummy.position )
		.to( { y: - 30 }, 5000 )
		.easing( TWEEN.Easing.Exponential.Out )
		.start();

	window.addEventListener( 'resize', onWindowResize, false );

};

var onDocumentMouseDownX = 0;

var onDocumentMouseDown = function ( event ) {

	onDocumentMouseDownX = event.clientX;

	var onDocumentMouseMove = function ( event ) {

		document.body.style.cursor = 'move';

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

		rotationTarget -= movementX * 0.005;

	};

	var onDocumentMouseUp = function ( event ) {

		document.body.style.cursor = 'pointer';

		document.removeEventListener( 'mousemove', onDocumentMouseMove );
		document.removeEventListener( 'mouseup', onDocumentMouseUp );

	};

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );

};

var onDocumentMouseMove = function ( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

};

var onDocumentClick = function ( event ) {

	if ( Math.abs( event.clientX - onDocumentMouseDownX ) > 2 ) return;

	if ( MOUSEOVERED === null ) return;
	if ( videos[ MOUSEOVERED ].isPlaying() === true ) return;

	if ( CLICKED !== null ) {

		var video = videos[ CLICKED ];
		video.pause();

	}

	TWEEN.removeAll();

	var start = rotation; // CLICKED || 0;
	var end = MOUSEOVERED;

	// fix 360

	if ( end - start >= 5 ) end -= 10;
	// if ( end - start <= -5 ) start -= 10;

	rotationTarget = end;

	/*
	new TWEEN.Tween( { id: start } )
		.to( { id: end }, 1500 )
		.onUpdate( function () {

			setCameraRotation( this.id );

		} )
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();
	*/

	CLICKED = MOUSEOVERED;

	var video = videos[ CLICKED ];
	video.play();

};

var onWindowResize = function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

};

var animate = function () {

	requestAnimationFrame( animate );

	TWEEN.update();

	stats.begin();

	var x = mouse.x * 100.0;
	var y = mouse.y * 100.0;

	camera.position.x += ( x - camera.position.x ) * 0.1;
	camera.position.y += ( y - camera.position.y ) * 0.1;

	/*
	cameraTarget.x += ( x - cameraTarget.x ) * 0.1;
	cameraTarget.y += ( y - cameraTarget.y ) * 0.1;
	*/

	camera.lookAt( cameraTarget );

	//

	rotation += ( rotationTarget - rotation ) * 0.1;

	cameraDummy.position.x = Math.sin( rotation * angle ) * 1500;
	cameraDummy.position.z = Math.cos( rotation * angle ) * 1500;
	cameraDummy.rotation.y = rotation * angle;

	//

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	ray.origin.copy( cameraDummy.position );
	ray.direction.copy( vector.subSelf( cameraDummy.position ).normalize() );

	var intersections = ray.intersectObjects( objects );

	if ( intersections.length > 0 ) {

		var object = objects.indexOf( intersections[ 0 ].object );

		if ( MOUSEOVERED !== object ) {

			document.body.style.cursor = 'pointer';

			if ( MOUSEOVERED !== null ) videos[ MOUSEOVERED ].rollout();

			MOUSEOVERED = object;

			videos[ MOUSEOVERED ].rollover();

		}

	} else {

		document.body.style.cursor = '';

		if ( MOUSEOVERED !== null ) videos[ MOUSEOVERED ].rollout();

		MOUSEOVERED = null;

	}

	renderer.render( scene, camera );

	stats.end();

};

if ( System.support.webgl === true ) {

	init();
	animate();

} else {

	var message = document.createElement( 'div' );
	message.id = 'message';
	message.innerHTML = 'Either your graphics card or your browser does not support WebGL. Try <a href="http://www.google.com/chrome/">Google Chrome</a><br />or <a href="http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation">view a list</a> of WebGL compatible browsers.';
	document.body.appendChild( message );

}

