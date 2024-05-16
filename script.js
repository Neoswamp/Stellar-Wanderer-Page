window.closePlanetInfo = function () {
    const planetInfo = document.querySelector('.planet-info');
    if (planetInfo) {
        planetInfo.remove();
        window.location.hash = 'planet-scene';
    }
};

// THREE Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(document.getElementById('planet-scene').offsetWidth, document.getElementById('planet-scene').offsetHeight);
document.getElementById('planet-scene').appendChild(renderer.domElement);

// Fuente de luz (simula un sol)
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load('assets/textures/texturep1.jpg');
const texture2 = textureLoader.load('assets/textures/texturep2.png');
const texture3 = textureLoader.load('assets/textures/texturep3.png');

const geometry1 = new THREE.SphereGeometry(1, 32, 32);
const material1 = new THREE.MeshPhongMaterial({ map: texture1 });
const sphere1 = new THREE.Mesh(geometry1, material1);
sphere1.name = 'Planeta 1';
scene.add(sphere1);
sphere1.position.x = -3;
sphere1.position.y = 1;

const geometry2 = new THREE.SphereGeometry(1, 32, 32);
const material2 = new THREE.MeshPhongMaterial({ map: texture2 });
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.name = 'Planeta 2';
scene.add(sphere2);
sphere2.position.y = 1;

const geometry3 = new THREE.SphereGeometry(1, 32, 32);
const material3 = new THREE.MeshPhongMaterial({ map: texture3 });
const sphere3 = new THREE.Mesh(geometry3, material3);
sphere3.name = 'Planeta 3';
scene.add(sphere3);
sphere3.position.x = 3;
sphere3.position.y = 1;

camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const aspectRatio = width / height;
    if (aspectRatio < 1) {
        sphere1.position.y = 5;
        sphere1.position.x = 0;

        sphere2.position.y = 0;
        sphere2.position.x = 0;

        sphere3.position.y = -5;
        sphere3.position.x = 0;

        camera.position.z = 15;
    } else {
        sphere1.position.y = 1;
        sphere1.position.x = -3;

        sphere2.position.y = 1;
        sphere2.position.x = 0;

        sphere3.position.y = 1;
        sphere3.position.x = 3;

        // Ajustar el zoom de la cámara para asegurarse de que todos los planetas sean visibles
        const maxPlanetPositionX = Math.max(Math.abs(sphere1.position.x), Math.abs(sphere2.position.x), Math.abs(sphere3.position.x));
        camera.position.z = maxPlanetPositionX / Math.tan(camera.fov * 0.5 * Math.PI / 180) + 1;
    }
}

// Controlador de eventos para el redimensionamiento de la ventana
window.addEventListener('resize', onResize);

// Llamar a la función de redimensionamiento cuando la página se carga
onResize();


// Función para mostrar la información del planeta
function showPlanetInfo(planetName) {
    // Obtener el contenedor del mensaje
    const planetInfoContainer = document.getElementById('planet-info-container');

    planetInfoContainer.innerHTML = '';

    if (planetName === 'Planeta 1') {
        const planetInfo = document.createElement('div');
        planetInfo.className = 'planet-info';
        planetInfo.innerHTML = `
            <button class="close-button" onclick="closePlanetInfo()">X</button>
            <h3>Sylvaris-3</h3>
            <p>Sylvaris-3 es un mundo desértico ubicado en el borde exterior de la galaxia. Su superficie está dominada por vastos desiertos de arena dorada, interrumpidos por cañones escarpados y mesetas rocosas. El planeta es conocido por sus extremas condiciones climáticas y su paisaje desolado.</p>
            <img src="assets/imgs/desert-planet.jpg" alt="Planeta 1" class="planet-info-img">
        `;
        planetInfoContainer.appendChild(planetInfo);
    }
    if (planetName === 'Planeta 2') {
        const planetInfo = document.createElement('div');
        planetInfo.className = 'planet-info';
        planetInfo.innerHTML = `
            <button class="close-button" onclick="closePlanetInfo()">X</button>
            <h3>Thalassia</h3>
            <p>Un mundo acuático habitado por una sociedad pacífica y avanzada de seres anfibios. Thalassia es conocida por su belleza submarina y su sabiduría ancestral.</p>
            <img src="assets/imgs/water-planet.jpg" alt="Planeta 2" class="planet-info-img">
        `;
        planetInfoContainer.appendChild(planetInfo);
    }
    if (planetName === 'Planeta 3') {
        const planetInfo = document.createElement('div');
        planetInfo.className = 'planet-info';
        planetInfo.innerHTML = `
            <button class="close-button" onclick="closePlanetInfo()">X</button>
            <h3>Aetheria</h3>
            <p>Aetheria es un mundo misterioso ubicado en los confines de la galaxia. Conocido por sus vastos paisajes salvajes y su atmósfera etérea, Aetheria está envuelto en leyendas y mitos antiguos. Se dice que es el hogar de antiguas ruinas y tecnologías perdidas.</p>
            <img src="assets/imgs/ruins-planet.jpg" alt="Planeta 3" class="planet-info-img">
        `;
        planetInfoContainer.appendChild(planetInfo);
    }

    // Redirigir al usuario al elemento #planet-info
    window.location.hash = 'planet-scene';
}



// Controlador de eventos para el movimiento del ratón
window.addEventListener('mousemove', function (event) {
    // Obtener las coordenadas del área del lienzo de renderizado
    const canvasBounds = renderer.domElement.getBoundingClientRect();

    // Calcular las coordenadas del mouse relativas al área del lienzo
    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    // Actualizar las coordenadas del mouse
    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

    // Actualizar la posición de las esferas en el espacio mundial
    sphere1.updateMatrixWorld();
    sphere2.updateMatrixWorld();
    sphere3.updateMatrixWorld();

    // Obtenemos todos los objetos intersectados por el rayo del ratón
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    if (intersects.length > 0) {
        // Si hay al menos un objeto intersectado (un planeta), cambiamos el cursor a un puntero
        renderer.domElement.style.cursor = 'pointer';
    } else {
        // Si no hay objetos intersectados, cambiamos el cursor a su estado predeterminado
        renderer.domElement.style.cursor = 'default';
    }
});

// Controlador de eventos para el clic en la ventana
window.addEventListener('click', function (event) {
    // Obtener las coordenadas del área del lienzo de renderizado
    const canvasBounds = renderer.domElement.getBoundingClientRect();

    // Calcular las coordenadas del mouse relativas al área del lienzo
    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    // Actualizar las coordenadas del mouse
    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

    // Actualizar la posición de las esferas en el espacio mundial
    sphere1.updateMatrixWorld();
    sphere2.updateMatrixWorld();
    sphere3.updateMatrixWorld();

    // Obtenemos todos los objetos intersectados por el rayo del ratón
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    if (intersects.length > 0) {
        // Si hay al menos un objeto intersectado (un planeta), mostramos su información
        const planetName = intersects[0].object.name;
        showPlanetInfo(planetName);
    }
});

// Animación de la escena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere1.rotation.y += 0.01;
    sphere2.rotation.y += 0.01;
    sphere3.rotation.y += 0.01;
}
animate();
