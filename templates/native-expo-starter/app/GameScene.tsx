import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, AppStateStatus, AppState } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Physics } from 'cannon-es';

export default function GameScene() {
  const appState = useRef<AppStateStatus>('active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      appState.current = next;
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

function onContextCreate(gl: ExpoGL.WebGLRenderingContext) {
  // Build renderer + scene once.
  const renderer = new Renderer({ gl });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0f0f0f');

  const camera = new THREE.PerspectiveCamera(
    70,
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Lighting
  const ambient = new THREE.AmbientLight('#ffffff', 0.6);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight('#ffffff', 0.9);
  directional.position.set(5, 5, 5);
  scene.add(directional);

  // Ground
  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Physics world
  const world = new Physics();
  world.gravity.set(0, -9.81, 0);

  // Spawn physics-enabled cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#5d9eff', roughness: 0.2, metalness: 0.3 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 3, 0);
  scene.add(cube);

  // Start animation loop
  const raf = requestAnimationFrame(function render() {
    if (appState.current !== 'active') {
      raf = requestAnimationFrame(render);
      return;
    }

    world.step(1 / 60);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.015;

    renderer.render(scene, camera);
    gl.endFrameEXP();
    raf = requestAnimationFrame(render);
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  gl: { flex: 1 },
});
