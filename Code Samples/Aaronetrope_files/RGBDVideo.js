/**
 * @author mrdoob / http://mrdoob.com
 */

( function () {

	var video = document.createElement( 'video' );
	// video.muted = true;

	var precision = 3;

	var linesGeometry = new THREE.Geometry();

	for ( var y = 240; y > - 240; y -= precision ) {

		for ( var x = - 320, x2 = - 320 + precision; x < 320; x += precision, x2 += precision ) {

			linesGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
			linesGeometry.vertices.push( new THREE.Vector3( x2, y, 0 ) );

		}

	}

	var pointsGeometry = new THREE.Geometry();

	for ( var y = 240; y > - 240; y -= precision ) {

		for ( var x = - 320; x < 320; x += precision ) {

			pointsGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );

		}

	}

	RGBDVideo = function ( id ) {

		THREE.Object3D.call( this );

		var isPlaying = false;

		var imageTexture = THREE.ImageUtils.loadTexture( 'files/' + ( id + 1 ) + '.jpg' );

		var videoTexture = new THREE.Texture( video );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		var linesMaterial = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { type: "t", value: imageTexture },
				"opacity": { type: "f", value: 0.25 }

			},
			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			wireframe: true,
			transparent: true

		} );

		linesMaterial.linewidth = 1;

		this.add( new THREE.Line( linesGeometry, linesMaterial, THREE.LinePieces ) );

		var pointsMaterial = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { type: "t", value: imageTexture },
				"opacity": { type: "f", value: 0.25 }

			},
			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true

		} );

		this.add( new THREE.ParticleSystem( pointsGeometry, pointsMaterial ) );

		// progress bar

		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3() );
		geometry.vertices.push( new THREE.Vector3( 1, 0, 0 ) );

		var progress = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 1, opacity: 0.75 } ) );
		progress.position.x = - 100;
		progress.position.y = - 325;
		progress.visible = false;
		this.add( progress );

		var background = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 1, opacity: 0.25 } ) );
		background.position.x = - 100;
		background.position.y = - 330;
		background.scale.x = 200;
		background.visible = false;
		this.add( background );

		// title

		var string = [
			'THE SHEEP MARKET',
			'TEN THOUSAND CENTS',
			'COMMUNICATION',
			'EXCHANGE OF IDEAS',
			'MEDIUM',
			'CROWDSOURCING',
			'STORIES',
			'PROGRAMMING',
			'TECHNOLOGY',
			'FUTURE'
		][ id ];

		var geometry = new Text( string );
		var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.25, transparent: true } );
		var title = new THREE.Line( geometry, material, THREE.LinePieces );
		title.position.x = - ( string.length * 3 * 4 ) / 2; 
		title.position.y = - 330;
		title.position.z = - 40;
		title.scale.set( 4, 4, 4 );
		this.add( title );


		// public

		var interval;

		this.rollover = function () {

			title.material.opacity = 0.75;

			linesMaterial.uniforms.opacity.value = 0.75;
			pointsMaterial.uniforms.opacity.value = 0.75;

		};

		this.rollout = function () {

			if ( isPlaying === true ) return;

			title.material.opacity = 0.25;

			linesMaterial.uniforms.opacity.value = 0.25;
			pointsMaterial.uniforms.opacity.value = 0.25;

		};

		this.play = function () {

			if ( isPlaying === true ) return;

			progress.visible = true;
			background.visible = true;

			title.material.opacity = 0.75;

			linesMaterial.uniforms.opacity.value = 0.75;
			pointsMaterial.uniforms.opacity.value = 0.75;

			video.src = 'files/' + ( id + 1 ) + '.webm';
			video.play();

			interval = setInterval( function () {

				if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

					linesMaterial.uniforms.map.value = videoTexture;
					pointsMaterial.uniforms.map.value = videoTexture;

					progress.scale.x = ( video.currentTime / video.duration ) * 200;
					videoTexture.needsUpdate = true;

				}

			}, 1000 / 25 );

			isPlaying = true;

		};

		this.pause = function () {

			if ( isPlaying === false ) return;

			progress.visible = false;
			background.visible = false;

			title.material.opacity = 0.25;

			linesMaterial.uniforms.opacity.value = 0.25;
			pointsMaterial.uniforms.opacity.value = 0.25;

			video.pause();

			clearInterval( interval );

			isPlaying = false;

		};

		this.isPlaying = function () {

			return isPlaying;

		};

	};

	RGBDVideo.prototype = Object.create( THREE.Object3D.prototype );

} )();
