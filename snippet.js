<!-- Shaders -->
<script src="lib/shaders/CopyShader.js"></script>
<script src="lib/shaders/DotScreenShader.js"></script>
<script src="lib/shaders/RGBShiftShader.js"></script>
<!-- Post Processing -->
<script src="lib/postprocessing/EffectComposer.js"></script>
<script src="lib/postprocessing/RenderPass.js"></script>
<script src="lib/postprocessing/MaskPass.js"></script>
<script src="lib/postprocessing/ShaderPass.js"></script>


composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

effect = new THREE.ShaderPass( THREE.DotScreenShader );
effect.uniforms[ 'scale' ].value = 4;
composer.addPass( effect );

effect = new THREE.ShaderPass( THREE.RGBShiftShader );
effect.uniforms[ 'amount' ].value = 0.15;
effect.renderToScreen = true;
composer.addPass( effect );


//Add the lines below to animate
//object.rotation.x += 0.005;
cubes.rotation.y -= 0.001;

//Instead of using the default renderer, render the composer
//  composer.render();
