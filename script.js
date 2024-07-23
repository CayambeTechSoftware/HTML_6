// Crear la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022); // Fondo de noche

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Posicionar la cámara para ver las esferas

// Crear el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 0.5;
controls.maxDistance = 50;

// Crear esferas
let spheres = [];
const starNames = [
    "Sol", "Proxima Centauri", "Alpha Centauri", "Sirius", "Vega", "Betelgeuse",
    "Rigel", "Polaris", "Altair", "Aldebaran", "Antares", "Spica", "Deneb", "Canopus"
];

createSphere(0, 0, 0, starNames[0]);

function createSphere(x, y, z, name) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere.userData = { name: name };
    
    scene.add(sphere);
    spheres.push(sphere);
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    spheres.forEach(sphere => {
        sphere.rotation.y += 0.01;
    });
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador cuando la ventana cambia de tamaño
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Doble clic para acercar y explorar el interior de la esfera
document.getElementById('container').addEventListener('dblclick', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres);

    if (intersects.length > 0) {
        const currentZoom = camera.position.z;
        camera.position.z = Math.max(currentZoom * 0.5, 1); // Asegurarse de que no se acerque demasiado
        controls.update();
    }
});

// Botón para duplicar esferas
document.getElementById('duplicateButton').addEventListener('click', () => {
    const currentCount = spheres.length;
    const newCount = currentCount * 2;
    const gap = 4; // Espacio entre esferas
    const gridSize = Math.ceil(Math.sqrt(newCount)); // Tamaño de la cuadrícula

    // Eliminar esferas existentes
    spheres.forEach(sphere => scene.remove(sphere));
    spheres = [];

    // Crear nuevas esferas en una cuadrícula
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (spheres.length >= newCount) break;
            const starIndex = spheres.length % starNames.length;
            createSphere(i * gap - (gridSize * gap) / 2, j * gap - (gridSize * gap) / 2, 0, starNames[starIndex]);
        }
    }

    alert(`Se han creado ${newCount} esferas.`);
});

// Botón para volver a una esfera
document.getElementById('resetButton').addEventListener('click', () => {
    // Eliminar esferas existentes
    spheres.forEach(sphere => scene.remove(sphere));
    spheres = [];
    
    // Crear una sola esfera
    createSphere(0, 0, 0, starNames[0]);
    
    alert('Se ha vuelto a una sola esfera.');
});
