import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  interactive?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / (currentMount.clientHeight || 1),
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight || 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group to hold all 3D elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Core Polyhedron (3D Crystal Mesh)
    const icoGeometry = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    mainGroup.add(icoMesh);

    // 2. Inner Glowing Core Sphere
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 3. Orbiting Particle Cloud (User Vibe Nodes)
    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const cyan = new THREE.Color(0x06b6d4);
    const violet = new THREE.Color(0x8b5cf6);
    const pink = new THREE.Color(0xec4899);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 3 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);

      const colorMix = Math.random();
      let chosenColor = cyan;
      if (colorMix > 0.6) chosenColor = violet;
      else if (colorMix > 0.3) chosenColor = pink;

      colorsArray[i] = chosenColor.r;
      colorsArray[i + 1] = chosenColor.g;
      colorsArray[i + 2] = chosenColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    mainGroup.add(particlesMesh);

    // 4. Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    // 5. Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Mouse interactive movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        // Rotation animations
        icoMesh.rotation.y = elapsedTime * 0.25;
        icoMesh.rotation.x = elapsedTime * 0.15;

        coreMesh.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.08);

        particlesMesh.rotation.y = -elapsedTime * 0.08;
        particlesMesh.rotation.x = elapsedTime * 0.05;

        ring1.rotation.z = elapsedTime * 0.2;
        ring2.rotation.z = -elapsedTime * 0.15;
      }

      // Mouse inertia dampening
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = targetX * 0.5;
      mainGroup.rotation.x = -targetY * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Use ResizeObserver for accurate container resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(currentMount);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      icoGeometry.dispose();
      icoMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: interactive ? 'auto' : 'none',
        touchAction: 'pan-y',
      }}
    />
  );
};
