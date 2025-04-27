"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FlowerObject() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a simple 3D flower-like object
    const geometry = new THREE.Group();
    
    // Create petals
    const petalGeometry = new THREE.CylinderGeometry(0, 1.5, 4, 4, 1);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xa0e0ff, transparent: true, opacity: 0.7 }),
      new THREE.MeshBasicMaterial({ color: 0xe0a0ff, transparent: true, opacity: 0.7 }),
      new THREE.MeshBasicMaterial({ color: 0xffa0e0, transparent: true, opacity: 0.7 }),
      new THREE.MeshBasicMaterial({ color: 0xe0ffa0, transparent: true, opacity: 0.7 }),
    ];
    
    // Create multiple petals
    for (let i = 0; i < 7; i++) {
      const petal = new THREE.Mesh(petalGeometry, materials[i % materials.length]);
      petal.position.z = 0;
      petal.rotation.x = Math.PI / 2;
      petal.rotation.z = (i * Math.PI) / 3.5;
      geometry.add(petal);
    }
    
    // Add center of flower
    const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    geometry.add(center);
    
    scene.add(geometry);
    camera.position.z = 10;
    
    // Rotation animation
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      geometry.rotation.y += 0.005;
      geometry.rotation.z += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const size = mountRef.current.clientWidth;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Clean up
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ maxWidth: '600px', maxHeight: '600px', margin: '0 auto' }}
    />
  );
}