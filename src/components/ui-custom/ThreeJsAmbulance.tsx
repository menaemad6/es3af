
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeJsAmbulance = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Performance optimization
    let frameId: number;
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    visibilityObserver.observe(containerRef.current);
    
    // Scene setup with better performance settings
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Camera setup with optimized field of view
    const camera = new THREE.PerspectiveCamera(
      40, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      100
    );
    camera.position.set(5, 2, 5);
    
    // Renderer setup with optimized parameters
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
      precision: "mediump"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Better looking shadows
    containerRef.current.appendChild(renderer.domElement);
    
    // Orbit controls with optimized settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Optimized lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512; // Reduced for performance
    directionalLight.shadow.mapSize.height = 512;
    scene.add(directionalLight);
    
    // Create ambulance with optimized geometries
    const ambulanceGroup = new THREE.Group();
    
    // Materials to be reused
    const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const redMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const blueMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0000ff,
      emissive: 0x0000ff,
      emissiveIntensity: 0.5
    });
    const glassMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      transparent: true,
      opacity: 0.7
    });
    
    // Base of the ambulance (body) - optimized geometry
    const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 1.5);
    const body = new THREE.Mesh(bodyGeometry, whiteMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    body.receiveShadow = true;
    ambulanceGroup.add(body);
    
    // Cabin of the ambulance
    const cabinGeometry = new THREE.BoxGeometry(1, 0.8, 1.5);
    const cabin = new THREE.Mesh(cabinGeometry, whiteMaterial);
    cabin.position.set(-1, 1.2, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    ambulanceGroup.add(cabin);
    
    // Windows
    const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.5, 1.2);
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(-1.45, 1.2, 0);
    ambulanceGroup.add(windshield);
    
    // Side windows - reuse geometry
    const sideWindowGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.1);
    const sideWindowL = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowL.position.set(-1, 1.2, 0.75);
    ambulanceGroup.add(sideWindowL);
    
    const sideWindowR = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowR.position.set(-1, 1.2, -0.75);
    ambulanceGroup.add(sideWindowR);
    
    // Red cross on sides - reuse geometries
    const verticalGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.2);
    const verticalL = new THREE.Mesh(verticalGeometry, redMaterial);
    verticalL.position.set(0.5, 1, 0.76);
    ambulanceGroup.add(verticalL);
    
    const verticalR = new THREE.Mesh(verticalGeometry, redMaterial);
    verticalR.position.set(0.5, 1, -0.76);
    ambulanceGroup.add(verticalR);
    
    // Horizontal part of cross
    const horizontalGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.6);
    const horizontalL = new THREE.Mesh(horizontalGeometry, redMaterial);
    horizontalL.position.set(0.5, 1, 0.76);
    ambulanceGroup.add(horizontalL);
    
    const horizontalR = new THREE.Mesh(horizontalGeometry, redMaterial);
    horizontalR.position.set(0.5, 1, -0.76);
    ambulanceGroup.add(horizontalR);
    
    // Wheels - use instancing for better performance
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16); // Reduced segments
    
    const wheelPositions = [
      { x: -0.8, y: 0.3, z: 0.8 },  // Front left
      { x: -0.8, y: 0.3, z: -0.8 }, // Front right
      { x: 0.8, y: 0.3, z: 0.8 },   // Rear left
      { x: 0.8, y: 0.3, z: -0.8 },  // Rear right
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, blackMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      ambulanceGroup.add(wheel);
    });
    
    // Emergency lights
    const lightGeometry = new THREE.BoxGeometry(0.3, 0.1, 1);
    const emergencyLights = new THREE.Mesh(lightGeometry, redMaterial);
    emergencyLights.position.set(0, 1.7, 0);
    ambulanceGroup.add(emergencyLights);
    
    // Add the ambulance to the scene
    scene.add(ambulanceGroup);
    
    // Ground plane - optimized
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
    
    // Animation for the emergency lights - optimized to use less resources
    let currentLightColor = "red";
    let lightTimer: number;
    
    const toggleEmergencyLights = () => {
      if (currentLightColor === "red") {
        emergencyLights.material = blueMaterial;
        currentLightColor = "blue";
      } else {
        emergencyLights.material = redMaterial;
        currentLightColor = "red";
      }
    };
    
    lightTimer = window.setInterval(toggleEmergencyLights, 500);
    
    // Optimized animation loop with time-based animation
    let time = 0;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (!isVisible) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Only update time at a reasonable rate
      time += deltaTime * 0.001;
      
      // Smoother floating animation
      ambulanceGroup.position.y = Math.sin(time) * 0.1;
      
      controls.update();
      renderer.render(scene, camera);
      
      frameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate(0);
    setIsLoaded(true);
    
    // Handle window resize - optimized with debounce
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!containerRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(lightTimer);
      cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      
      // Dispose of geometries and materials to prevent memory leaks
      [bodyGeometry, cabinGeometry, windshieldGeometry, sideWindowGeometry, 
       verticalGeometry, horizontalGeometry, wheelGeometry, lightGeometry, groundGeometry].forEach(geometry => {
        geometry.dispose();
      });
      
      [whiteMaterial, blackMaterial, redMaterial, blueMaterial, glassMaterial, groundMaterial].forEach(material => {
        material.dispose();
      });
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default ThreeJsAmbulance;
