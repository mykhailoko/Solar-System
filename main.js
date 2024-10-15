import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;

const scene = new THREE.Scene();
let planet;
const loader = new GLTFLoader();
let modelPath = "./models/mercury.glb";
loader.load(
  modelPath,
  function (gltf) {
    planet = gltf.scene;
    planet.scale.set(0.1, 0.1, 0.1);
    scene.add(planet);

    modelMove();
  },
  function (xhr) {},
  function (error) {}
)
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1.3);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
}
reRender3D();

let arrPositionModel = [
  {
    id: 'mercury',
    model: './models/mercury.glb',
    position: {x: 15, y: -2, z: 0}
  },
  {
    id: 'venus',
    model: './models/venus.glb',
    position: {x: -15, y: 0, z: 0}
  },
  {
    id: 'earth',
    model: './models/earth.glb',
    position: {x: 15, y: 0, z: 0}
  },
  {
    id: 'mars',
    model: './models/mars.glb',
    position: {x: -15, y: 0, z: 0}
  },
  {
    id: 'jupiter',
    model: './models/jupiter.glb',
    position: {x: 15, y: 0, z: 0}
  },
  {
    id: 'saturn',
    model: './models/saturn.glb',
    position: {x: -15, y: 0, z: 0}
  },
  {
    id: 'uranus',
    model: './models/uranus.glb',
    position: {x: 15, y: 0, z: 0}
  },
  {
    id: 'neptune',
    model: './models/neptune.glb',
    position: {x: -15, y: 0, z: 0}
  }
]

const modelMove = () => {
  const sections = document.querySelectorAll('.section');
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(planet.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      easy: "power1.out"
    })
    let newModelPath = new_coordinates.model;
    
    if (modelPath !== newModelPath) {
      modelPath = newModelPath;
      
      loader.load(
        modelPath,
        function (gltf) {
          scene.remove(planet);
          
          planet = gltf.scene;
          planet.scale.set(0.1, 0.1, 0.1);
          scene.add(planet);
        },
        function (xhr) {},
        function (error) {}
      );
    }
  }
}

window.addEventListener('scroll', () => {
  if (planet) {
    modelMove();
  }
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})




let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

let isTouching = false;
let previousTouchPosition = { x: 0, y: 0 };
let rotationSpeed = 0.005;

renderer.domElement.addEventListener('mousedown', function (event) {
  isDragging = true;
});
renderer.domElement.addEventListener('mousemove', function (event) {
  if (isDragging && planet) {
    const deltaMove = {
      x: event.offsetX - previousMousePosition.x,
      y: event.offsetY - previousMousePosition.y
    };

    planet.rotation.y += deltaMove.x * rotationSpeed;
    planet.rotation.x += deltaMove.y * rotationSpeed;
  }

  previousMousePosition = {
    x: event.offsetX,
    y: event.offsetY
  };
});
renderer.domElement.addEventListener('mouseup', function () {
  isDragging = false;
});
renderer.domElement.addEventListener('mouseleave', function () {
  isDragging = false;
});

renderer.domElement.addEventListener('touchstart', function (event) {
  isTouching = true;
  previousTouchPosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
});

renderer.domElement.addEventListener('touchmove', function (event) {
  if (isTouching && planet) {
    const deltaMove = {
      x: event.touches[0].clientX - previousTouchPosition.x,
      y: event.touches[0].clientY - previousTouchPosition.y
    };

    planet.rotation.y += deltaMove.x * rotationSpeed;
    planet.rotation.x += deltaMove.y * rotationSpeed;

    previousTouchPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
});

renderer.domElement.addEventListener('touchend', function () {
  isTouching = false;
});