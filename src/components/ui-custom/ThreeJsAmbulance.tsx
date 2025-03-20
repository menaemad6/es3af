
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
    
    // Enhanced scene setup with better lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Improved camera setup for better perspective
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      100
    );
    camera.position.set(4, 2, 4);
    
    // High-quality renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
      precision: "highp"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.current.appendChild(renderer.domElement);
    
    // Smoother orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Enhanced lighting for better realism
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.normalBias = 0.05;
    scene.add(directionalLight);
    
    // Add a fill light for better details
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);
    
    // Create improved ambulance with more realistic details
    const ambulanceGroup = new THREE.Group();
    
    // Enhanced materials with better properties
    const whiteMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3
    });
    
    const blackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.2
    });
    
    const redMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    
    const blueMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x0000ff,
      emissiveIntensity: 0.5
    });
    
    const glassMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x333333,
      roughness: 0,
      metalness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.1,
      metalness: 1.0
    });
    
    // Improved body shape with better proportions
    const bodyGeometry = new THREE.BoxGeometry(3.2, 1.4, 1.7);
    const body = new THREE.Mesh(bodyGeometry, whiteMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    ambulanceGroup.add(body);
    
    // More detailed cabin with better shape
    const cabinGeometry = new THREE.BoxGeometry(1.1, 0.9, 1.7);
    const cabin = new THREE.Mesh(cabinGeometry, whiteMaterial);
    cabin.position.set(-1.1, 1.3, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    ambulanceGroup.add(cabin);
    
    // Add bumpers
    const frontBumperGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.8);
    const frontBumper = new THREE.Mesh(frontBumperGeometry, chromeMaterial);
    frontBumper.position.set(-1.7, 0.4, 0);
    frontBumper.castShadow = true;
    frontBumper.receiveShadow = true;
    ambulanceGroup.add(frontBumper);
    
    const rearBumperGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.8);
    const rearBumper = new THREE.Mesh(rearBumperGeometry, chromeMaterial);
    rearBumper.position.set(1.7, 0.4, 0);
    rearBumper.castShadow = true;
    rearBumper.receiveShadow = true;
    ambulanceGroup.add(rearBumper);
    
    // Better windows with improved transparency
    // Windshield
    const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.7, 1.5);
    const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
    windshield.position.set(-1.65, 1.3, 0);
    windshield.castShadow = false;
    ambulanceGroup.add(windshield);
    
    // Side windows
    const sideWindowGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const sideWindowL = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowL.position.set(-1.1, 1.3, 0.85);
    ambulanceGroup.add(sideWindowL);
    
    const sideWindowR = new THREE.Mesh(sideWindowGeometry, glassMaterial);
    sideWindowR.position.set(-1.1, 1.3, -0.85);
    ambulanceGroup.add(sideWindowR);
    
    // Rear windows
    const rearDoorsGeometry = new THREE.BoxGeometry(0.1, 1, 1.4);
    const rearDoors = new THREE.Mesh(rearDoorsGeometry, whiteMaterial);
    rearDoors.position.set(1.65, 1.1, 0);
    rearDoors.castShadow = true;
    rearDoors.receiveShadow = true;
    ambulanceGroup.add(rearDoors);
    
    const rearWindowsGeometry = new THREE.BoxGeometry(0.05, 0.6, 1.2);
    const rearWindows = new THREE.Mesh(rearWindowsGeometry, glassMaterial);
    rearWindows.position.set(1.68, 1.3, 0);
    ambulanceGroup.add(rearWindows);
    
    // Improved red cross details
    // Make crosses on both sides
    const makeCross = (posZ) => {
      const verticalGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.2);
      const verticalCross = new THREE.Mesh(verticalGeometry, redMaterial);
      verticalCross.position.set(0.6, 1.2, posZ);
      ambulanceGroup.add(verticalCross);
      
      const horizontalGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.7);
      const horizontalCross = new THREE.Mesh(horizontalGeometry, redMaterial);
      horizontalCross.position.set(0.6, 1.2, posZ);
      ambulanceGroup.add(horizontalCross);
    };
    
    makeCross(0.85);
    makeCross(-0.85);
    
    // Add "AMBULANCE" text (simulated with small boxes)
    const textHeight = 0.05;
    const textWidth = 0.6;
    const textDepth = 0.05;
    const textGeometry = new THREE.BoxGeometry(textWidth, textHeight, textDepth);
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    
    // Front text (mirrored for correct reading)
    const frontText = new THREE.Mesh(textGeometry, textMaterial);
    frontText.position.set(-1.65, 1.7, 0);
    frontText.rotation.y = Math.PI;
    ambulanceGroup.add(frontText);
    
    // Rear text
    const rearText = new THREE.Mesh(textGeometry, textMaterial);
    rearText.position.set(1.65, 1.7, 0);
    ambulanceGroup.add(rearText);
    
    // Better wheels with more detail
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.2
    });
    
    const hubcapGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 16);
    const hubcapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.8 
    });
    
    const wheelPositions = [
      { x: -1.2, y: 0.4, z: 0.9 },  // Front left
      { x: -1.2, y: 0.4, z: -0.9 }, // Front right
      { x: 1.2, y: 0.4, z: 0.9 },   // Rear left
      { x: 1.2, y: 0.4, z: -0.9 },  // Rear right
    ];
    
    wheelPositions.forEach(pos => {
      const wheelGroup = new THREE.Group();
      
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      wheelGroup.add(wheel);
      
      const hubcap = new THREE.Mesh(hubcapGeometry, hubcapMaterial);
      hubcap.rotation.z = Math.PI / 2;
      wheelGroup.add(hubcap);
      
      wheelGroup.position.set(pos.x, pos.y, pos.z);
      ambulanceGroup.add(wheelGroup);
    });
    
    // Better emergency lights with improved structure
    const lightBarBaseGeometry = new THREE.BoxGeometry(1.8, 0.15, 1.2);
    const lightBarBase = new THREE.Mesh(lightBarBaseGeometry, blackMaterial);
    lightBarBase.position.set(0, 1.9, 0);
    ambulanceGroup.add(lightBarBase);
    
    // Red and blue light domes
    const lightDomeGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI);
    
    // Create multiple light domes
    const createLightRow = (isRed, offsetZ) => {
      const material = isRed ? redMaterial : blueMaterial;
      const row = new THREE.Group();
      
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue; // Skip middle
        
        const dome = new THREE.Mesh(lightDomeGeometry, material);
        dome.rotation.x = Math.PI / 2;
        dome.position.x = i * 0.3;
        dome.userData = { isRed };
        row.add(dome);
      }
      
      row.position.set(0, 2, offsetZ);
      return row;
    };
    
    const frontLights = createLightRow(true, -0.3);
    const rearLights = createLightRow(false, 0.3);
    ambulanceGroup.add(frontLights);
    ambulanceGroup.add(rearLights);
    
    // Add headlights
    const headlightGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffcc,
      emissive: 0xffffcc,
      emissiveIntensity: 0.5
    });
    
    const headlightPositions = [
      { x: -1.65, y: 0.8, z: 0.6 },  // Front left
      { x: -1.65, y: 0.8, z: -0.6 }, // Front right
    ];
    
    headlightPositions.forEach(pos => {
      const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight.rotation.z = Math.PI / 2;
      headlight.position.set(pos.x, pos.y, pos.z);
      ambulanceGroup.add(headlight);
      
      // Add actual light source
      const spotlight = new THREE.SpotLight(0xffffcc, 0.5);
      spotlight.position.set(pos.x, pos.y, pos.z);
      spotlight.target.position.set(pos.x - 1, pos.y, pos.z);
      spotlight.angle = Math.PI / 8;
      spotlight.penumbra = 0.2;
      spotlight.castShadow = true;
      ambulanceGroup.add(spotlight);
      ambulanceGroup.add(spotlight.target);
    });
    
    // Taillights
    const taillightGeometry = new THREE.BoxGeometry(0.05, 0.1, 0.2);
    const taillightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5 
    });
    
    const taillightPositions = [
      { x: 1.65, y: 0.7, z: 0.6 },  // Rear left
      { x: 1.65, y: 0.7, z: -0.6 }, // Rear right
    ];
    
    taillightPositions.forEach(pos => {
      const taillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
      taillight.position.set(pos.x, pos.y, pos.z);
      ambulanceGroup.add(taillight);
    });
    
    // Add the ambulance to the scene
    scene.add(ambulanceGroup);
    
    // Improved ground with texture
    const groundGeometry = new THREE.CircleGeometry(10, 36);
    groundGeometry.rotateX(-Math.PI / 2);
    
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf1f5f9,
      roughness: 0.8,
      metalness: 0.2,
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add shadow-catching plane below
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = -0.051;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);
    
    // Enhanced animation for the emergency lights
    let currentLightColor = "red";
    let lightTimer: number;
    
    const toggleEmergencyLights = () => {
      // Find all light domes
      ambulanceGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && 
            child.geometry instanceof THREE.SphereGeometry &&
            child.userData && 
            (child.userData.isRed !== undefined)) {
          
          // Toggle lights based on type
          if (currentLightColor === "red") {
            if (child.userData.isRed) {
              child.material = redMaterial;
            } else {
              // Turn off blue lights
              child.material = new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                roughness: 0.2,
                metalness: 0.3,
                emissive: 0x000000
              });
            }
          } else {
            if (!child.userData.isRed) {
              child.material = blueMaterial;
            } else {
              // Turn off red lights
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0.2,
                metalness: 0.3,
                emissive: 0x000000
              });
            }
          }
        }
      });
      
      currentLightColor = currentLightColor === "red" ? "blue" : "red";
    };
    
    lightTimer = window.setInterval(toggleEmergencyLights, 500);
    
    // Improved animation loop with smoother movements
    let time = 0;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (!isVisible) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Update time at a reasonable rate
      time += deltaTime * 0.001;
      
      // Smoother floating animation with subtle rotation
      ambulanceGroup.position.y = Math.sin(time * 1.5) * 0.07 + 0.07;
      ambulanceGroup.rotation.y = Math.sin(time * 0.5) * 0.03;
      
      // Subtle wheel rotation
      ambulanceGroup.children.forEach(child => {
        if (child instanceof THREE.Group && child.children[0] instanceof THREE.Mesh &&
            child.children[0].geometry instanceof THREE.CylinderGeometry) {
          child.children.forEach(wheel => {
            wheel.rotation.x += 0.01;
          });
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
      
      frameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate(0);
    setIsLoaded(true);
    
    // Optimized window resize handler
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
      
      // Dispose of all materials and geometries
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
      if (controls) controls.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
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
