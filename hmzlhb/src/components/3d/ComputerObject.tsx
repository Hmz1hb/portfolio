"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ComputerObject() {
  // Ref for the container element where the Three.js canvas will be mounted
  const mountRef = useRef<HTMLDivElement>(null);
  // Ref to store key information (original position, material) for animation
  const keyDataRef = useRef<{ [uuid: string]: { originalY: number, originalMaterial: THREE.Material } }>({});
  // Ref to store the currently pressed key and its press time
  const pressedKeyRef = useRef<{ uuid: string | null, pressEndTime: number | null }>({ uuid: null, pressEndTime: null });

  useEffect(() => {
    // Ensure the mount point exists
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 6;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true, // Enable transparency
      antialias: true // Enable anti-aliasing
    });
    renderer.setSize(500, 500); // Initial size
    mountRef.current.appendChild(renderer.domElement);

    // --- Colors ---
    const primaryColor = new THREE.Color(0x6366f1); // Indigo
    const secondaryColor = new THREE.Color(0xec4899); // Pink
    const accentColor = new THREE.Color(0x10b981); // Emerald
    const neutralColor = new THREE.Color(0x9ca3af); // Gray
    const keyColor = new THREE.Color(0x4b5563); // Darker gray for keys
    const keyPressedColor = new THREE.Color(0x374151); // Even darker for pressed state
    const screenGlowColor = new THREE.Color(0x3b82f6); // Blue

    // --- Materials ---
    const neutralMaterial = new THREE.MeshStandardMaterial({
        color: neutralColor, roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0.9
    });
    const keyMaterial = new THREE.MeshStandardMaterial({
        color: keyColor, roughness: 0.7, metalness: 0.2, transparent: true, opacity: 0.95
    });
    // Material for when a key is pressed
    const keyPressedMaterial = new THREE.MeshStandardMaterial({
        color: keyPressedColor, roughness: 0.7, metalness: 0.2, transparent: true, opacity: 1.0, // Slightly less transparent when pressed
        emissive: keyPressedColor, // Add a slight emissive effect when pressed
        emissiveIntensity: 0.3
    });
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505, emissive: screenGlowColor, emissiveIntensity: 0.2,
        roughness: 0.9, metalness: 0.1, transparent: true, opacity: 0.9
    });
    const primaryMaterial = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.5, metalness: 0.1 });
    const secondaryMaterial = new THREE.MeshStandardMaterial({ color: secondaryColor, roughness: 0.5, metalness: 0.1 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5, metalness: 0.1 });

    // --- Computer Model Group ---
    const computerGroup = new THREE.Group();
    scene.add(computerGroup);

    // --- Monitor ---
    const monitorStand = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), neutralMaterial);
    monitorStand.position.y = -0.85;
    const monitorNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.6, 16), neutralMaterial);
    monitorNeck.position.y = -0.55;
    const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 0.2), neutralMaterial);
    monitorFrame.position.y = 0.1;

    // --- Screen ---
    const screenGeometry = new THREE.PlaneGeometry(3.8, 2.3);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.11;
    screen.position.y = monitorFrame.position.y;

    // --- Screen Content (Code, AI, Art Representations) ---
    // Code representation
    const codeGroup = new THREE.Group();
    const cubeSize = 0.07;
    const gridSize = 10;
    const spacing = 0.11;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (Math.random() > 0.65) {
          const cubeMaterial = Math.random() > 0.5 ? primaryMaterial : secondaryMaterial;
          const cube = new THREE.Mesh(
            new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
            cubeMaterial.clone()
          );
          cube.material.transparent = true;
          cube.position.set(-1.7 + x * spacing, 0.8 - y * spacing, 0.15);
          codeGroup.add(cube);
        }
      }
    }
    codeGroup.position.y = monitorFrame.position.y;

    // AI representation
    const aiGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMaterial = accentMaterial.clone();
    nodeMaterial.emissive = accentColor;
    nodeMaterial.emissiveIntensity = 0.4;
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const x = 0.8 + (Math.random() - 0.5) * 1.5;
      const y = 0 + (Math.random() - 0.5) * 1.5;
      const z = 0.15;
      node.position.set(x, y, z);
      aiGroup.add(node);
      nodes.push(node);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: accentColor, transparent: true, opacity: 0.4, linewidth: 1
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 0.6) {
          const geometry = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          const line = new THREE.Line(geometry, edgeMaterial);
          aiGroup.add(line);
        }
      }
    }
    aiGroup.position.y = monitorFrame.position.y;

    // Art representation
    const artGroup = new THREE.Group();
    const artShapeMaterial = primaryMaterial.clone();
    artShapeMaterial.side = THREE.DoubleSide;
    artShapeMaterial.transparent = true;
    artShapeMaterial.opacity = 0.8;
    const artShape1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.2, 0.05, 100, 16), artShapeMaterial);
    artShape1.position.set(-0.8, -0.5, 0.15);
    artGroup.add(artShape1);
    artGroup.position.y = monitorFrame.position.y;

    // --- Keyboard ---
    const keyboardGroup = new THREE.Group();
    const keyboardBase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 1.4), neutralMaterial.clone());
    keyboardBase.material.opacity = 0.95;
    keyboardGroup.add(keyboardBase);

    // Keys Group
    const keysGroup = new THREE.Group();
    const keySize = 0.18;
    const keyHeight = 0.08;
    const keySpacing = 0.21;
    const keyRows = 4;
    const keyCols = 14;
    const keyboardWidth = (keyCols - 1) * keySpacing;
    const keyboardDepth = (keyRows - 1) * keySpacing;
    const keyPressDepth = 0.04; // How far down the key moves when pressed

    // Clear previous key data before creating new keys
    keyDataRef.current = {};

    for (let row = 0; row < keyRows; row++) {
      for (let col = 0; col < keyCols; col++) {
        let currentKeySize = keySize;
        let skip = false;
        let isSpacebar = false;

        // Spacebar Logic
        if (row === keyRows - 1 && col > 3 && col < keyCols - 4) {
          if (col === 4) { // Only create one spacebar mesh at the starting column
            // Calculate the total width the spacebar occupies
            const spacebarKeyCount = keyCols - 8; // Number of standard keys the spacebar replaces
            currentKeySize = keySize * spacebarKeyCount + keySpacing * (spacebarKeyCount - 1);
            isSpacebar = true;
          } else {
            skip = true; // Skip creating individual keys covered by the spacebar
          }
        }

        if (!skip) {
          const keyGeometry = new THREE.BoxGeometry(currentKeySize, keyHeight, keySize);
          keyGeometry.translate(0, keyHeight / 2, 0); // Move origin to bottom

          const key = new THREE.Mesh(keyGeometry, keyMaterial.clone()); // Clone material for each key

          // Calculate position
          let keyX;
          if (isSpacebar) {
              // Position the spacebar correctly
              // Start X is the left edge of the 4th column's key slot
              const startX = -keyboardWidth / 2 + 4 * keySpacing;
              // Center X is the start X plus half the spacebar's width
              keyX = startX + currentKeySize / 3;
          } else {
              // Position regular keys
              keyX = -keyboardWidth / 2 + col * keySpacing;
          }
          const keyY = 0.075; // Position keys slightly above the base
          const keyZ = -keyboardDepth / 2 + row * keySpacing;

          key.position.set(keyX, keyY, keyZ);
          keysGroup.add(key);

          // Store original Y position and material for animation
          keyDataRef.current[key.uuid] = {
              originalY: keyY,
              originalMaterial: key.material as THREE.Material // Store the cloned material instance
          };
        }
      }
    }
    keyboardGroup.add(keysGroup);
    keyboardGroup.position.set(0, -1.6, 1);
    keyboardGroup.rotation.x = Math.PI / 20; // Tilt keyboard forward

    // --- Assemble Computer ---
    computerGroup.add(monitorStand);
    computerGroup.add(monitorNeck);
    computerGroup.add(monitorFrame);
    computerGroup.add(screen);
    computerGroup.add(codeGroup);
    computerGroup.add(aiGroup);
    computerGroup.add(artGroup);
    computerGroup.add(keyboardGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // --- Animation Loop ---
    let frameId: number;
    const clock = new THREE.Clock();
    const keyPressDuration = 0.15; // Seconds key stays pressed
    const keyPressCooldown = 0.05; // Minimum time between presses
    let lastKeyPressTime = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta(); // Time since last frame

      // --- Reset previously pressed key ---
      if (pressedKeyRef.current.uuid && pressedKeyRef.current.pressEndTime && elapsedTime >= pressedKeyRef.current.pressEndTime) {
          const key = keysGroup.getObjectByProperty('uuid', pressedKeyRef.current.uuid) as THREE.Mesh | undefined;
          const keyData = keyDataRef.current[pressedKeyRef.current.uuid];
          if (key && keyData) {
              key.position.y = keyData.originalY;
              // Restore original material only if it's different
              if (key.material !== keyData.originalMaterial) {
                  key.material = keyData.originalMaterial;
              }
          }
          pressedKeyRef.current = { uuid: null, pressEndTime: null }; // Clear pressed key info
      }

      // --- Trigger new random key press ---
      // Check cooldown and if no key is currently pressed
      if (!pressedKeyRef.current.uuid && elapsedTime > lastKeyPressTime + keyPressCooldown && Math.random() < 0.1) { // Adjust probability (0.1 = 10% chance per frame approx)
          const keys = keysGroup.children.filter(k => k instanceof THREE.Mesh) as THREE.Mesh[];
          if (keys.length > 0) {
              const randomIndex = Math.floor(Math.random() * keys.length);
              const keyToPress = keys[randomIndex];
              const keyData = keyDataRef.current[keyToPress.uuid];

              if (keyToPress && keyData) {
                  // Apply pressed state
                  keyToPress.position.y = keyData.originalY - keyPressDepth;
                  keyToPress.material = keyPressedMaterial; // Assign the pressed material

                  // Store pressed key info
                  pressedKeyRef.current = {
                      uuid: keyToPress.uuid,
                      pressEndTime: elapsedTime + keyPressDuration
                  };
                  lastKeyPressTime = elapsedTime; // Update last press time
              }
          }
      }


      // --- Other Animations ---
      // Subtle computer rotation
      computerGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.15;

      // AI nodes pulsing effect
      nodes.forEach((node, index) => {
        const scaleFactor = 1 + Math.sin(elapsedTime * 1.5 + index * 0.5) * 0.2;
        node.scale.setScalar(scaleFactor);
      });

      // Art element rotation
      artShape1.rotation.x = elapsedTime * 0.3;
      artShape1.rotation.y = elapsedTime * 0.2;

      // Code elements animation (opacity fade)
      codeGroup.children.forEach((cube, index) => {
        if (cube instanceof THREE.Mesh && cube.material instanceof THREE.Material) {
          cube.material.opacity = 0.5 + Math.sin(elapsedTime * 2 + index * 0.3) * 0.4;
        }
      });

      // Keyboard keys subtle bobbing (apply only if NOT pressed)
      // keysGroup.children.forEach((key) => {
      //     if (key instanceof THREE.Mesh && key.uuid !== pressedKeyRef.current.uuid) {
      //         const keyData = keyDataRef.current[key.uuid];
      //         if(keyData) {
      //             // Apply bobbing relative to original Y
      //             key.position.y = keyData.originalY + Math.sin(elapsedTime * 3 + key.id * 0.5) * 0.005;
      //         }
      //     }
      // });


      // Render the scene
      renderer.render(scene, camera);
    };

    animate(); // Start the animation loop

    // --- Resize Handling ---
    const handleResize = () => {
        if (!mountRef.current) return;
        const parent = mountRef.current.parentElement;
        let width = 500;
        let height = 500;
        if (parent) {
            width = Math.min(parent.clientWidth * 0.9, 600);
            height = Math.min(parent.clientHeight * 0.9, 600);
            const size = Math.min(width, height);
            width = size;
            height = size;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
          try {
              mountRef.current.removeChild(renderer.domElement);
          } catch (error) {
              console.warn("Could not remove renderer DOM element:", error);
          }
      }

      // Dispose Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        } else if (object instanceof THREE.Line) {
            object.geometry?.dispose();
            if (object.material instanceof THREE.Material) {
                object.material.dispose();
            }
        }
      });
      // Dispose specific materials created outside the loop
      neutralMaterial.dispose();
      keyMaterial.dispose();
      keyPressedMaterial.dispose();
      screenMaterial.dispose();
      primaryMaterial.dispose();
      secondaryMaterial.dispose();
      accentMaterial.dispose();
      edgeMaterial.dispose();
      nodeMaterial.dispose();
      artShapeMaterial.dispose();

      renderer.dispose();
      // Clear refs
      keyDataRef.current = {};
      pressedKeyRef.current = { uuid: null, pressEndTime: null };
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // The div element that will contain the Three.js canvas
  return (
    <div
      ref={mountRef}
      className="w-full h-full flex items-center justify-center" // Center the canvas
      style={{ minHeight: '300px' }} // Ensure minimum size
    />
  );
}
