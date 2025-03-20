
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // Fixed import with .js extension

const ThreeJsAmbulance = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(5, 2, 5);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Orbit controls for interactive rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Create a simple ambulance model
    const ambulanceGroup = new THREE.Group();
    
    // Base of the ambulance (body)
    const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 1.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    body.receiveShadow = true;
    ambulanceGroup.add(body);
    
    // Cabin of the ambulance
    const cabinGeometry = new THREE.BoxGeometry(1, 0.8, 1.5);
    const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-1, 1.2, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    ambulanceGroup.add(cabin);
    
    // Windows (black)
    const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.5, 1.2);
    const glassMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      transparent: true,
      opacity: 0.7
    });
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(-1.45, 1.2, 0);
    ambulanceGroup.add(windshield);
    
    // Side windows
    const sideWindowGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.1);
    const sideWindowL = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowL.position.set(-1, 1.2, 0.75);
    ambulanceGroup.add(sideWindowL);
    
    const sideWindowR = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowR.position.set(-1, 1.2, -0.75);
    ambulanceGroup.add(sideWindowR);
    
    // Red cross on sides
    const crossMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    
    // Vertical part of cross
    const verticalGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.2);
    const verticalL = new THREE.Mesh(verticalGeometry, crossMaterial);
    verticalL.position.set(0.5, 1, 0.76);
    ambulanceGroup.add(verticalL);
    
    const verticalR = new THREE.Mesh(verticalGeometry, crossMaterial);
    verticalR.position.set(0.5, 1, -0.76);
    ambulanceGroup.add(verticalR);
    
    // Horizontal part of cross
    const horizontalGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.6);
    const horizontalL = new THREE.Mesh(horizontalGeometry, crossMaterial);
    horizontalL.position.set(0.5, 1, 0.76);
    ambulanceGroup.add(horizontalL);
    
    const horizontalR = new THREE.Mesh(horizontalGeometry, crossMaterial);
    horizontalR.position.set(0.5, 1, -0.76);
    ambulanceGroup.add(horizontalR);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 24);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const wheelPositions = [
      { x: -0.8, y: 0.3, z: 0.8 },  // Front left
      { x: -0.8, y: 0.3, z: -0.8 }, // Front right
      { x: 0.8, y: 0.3, z: 0.8 },   // Rear left
      { x: 0.8, y: 0.3, z: -0.8 },  // Rear right
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      ambulanceGroup.add(wheel);
    });
    
    // Emergency lights
    const lightGeometry = new THREE.BoxGeometry(0.3, 0.1, 1);
    const redLightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const blueLightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0000ff,
      emissive: 0x0000ff,
      emissiveIntensity: 0.5
    });
    
    const emergencyLights = new THREE.Mesh(lightGeometry, redLightMaterial);
    emergencyLights.position.set(0, 1.7, 0);
    ambulanceGroup.add(emergencyLights);
    
    // Add the ambulance to the scene
    scene.add(ambulanceGroup);
    
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf1f5f9,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Animation for the emergency lights
    const animateEmergencyLights = () => {
      let isRed = true;
      
      setInterval(() => {
        emergencyLights.material = isRed ? blueLightMaterial : redLightMaterial;
        isRed = !isRed;
      }, 500);
    };
    
    animateEmergencyLights();
    
    // Floating animation for the ambulance
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      ambulanceGroup.position.y = Math.sin(time) * 0.1;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      controls.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeJsAmbulance;
