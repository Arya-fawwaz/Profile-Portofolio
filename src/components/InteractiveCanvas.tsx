"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeContext";

function makeGlow(size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.1, "rgba(255,255,255,0.9)");
    g.addColorStop(0.3, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(c);
}

export default function InteractiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "light") return;
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // ─── SCENE ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const texGlow = makeGlow(64);
    const texSmall = makeGlow(32);

    // ─── BACKGROUND STARS ───────────────────────────────────
    const BG = 800;
    const bgGeo = new THREE.BufferGeometry();
    const bgP = new Float32Array(BG * 3);
    const bgSz = new Float32Array(BG);
    const bgPh = new Float32Array(BG);
    const bgSp = new Float32Array(BG);
    for (let i = 0; i < BG; i++) {
      const r = 15 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85);
      bgP[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgP[i * 3 + 1] = r * Math.cos(phi) - 5;
      bgP[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 10;
      bgSz[i] = 0.05 + Math.random() * 0.15;
      bgPh[i] = Math.random() * Math.PI * 2;
      bgSp[i] = 0.1 + Math.random() * 0.4;
    }
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgP, 3));
    bgGeo.setAttribute("size", new THREE.BufferAttribute(bgSz, 1));

    const bgMat = new THREE.PointsMaterial({
      size: 0.08,
      map: texSmall,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color("#b8ccff"),
      sizeAttenuation: true,
      opacity: 0.7,
    });
    const bgMesh = new THREE.Points(bgGeo, bgMat);
    scene.add(bgMesh);

    // ─── METEORS ────────────────────────────────────────────
    const MAX = 12; // Fewer but higher quality
    const TRAIL = 100;
    const SPARKS = 40; // Sparks per meteor

    // Shared Trail Geometry
    const totalTrailVerts = MAX * TRAIL;
    const tPos = new Float32Array(totalTrailVerts * 3);
    const tCol = new Float32Array(totalTrailVerts * 3);
    const tSize = new Float32Array(totalTrailVerts);
    const tOpac = new Float32Array(totalTrailVerts);

    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    tGeo.setAttribute("color", new THREE.BufferAttribute(tCol, 3));
    tGeo.setAttribute("size", new THREE.BufferAttribute(tSize, 1));
    tGeo.setAttribute("opacity", new THREE.BufferAttribute(tOpac, 1));

    // Advanced Plasma Shader
    const tMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texGlow }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * vOpacity, vOpacity) * tex;
        }
      `
    });

    const tMesh = new THREE.Points(tGeo, tMat);
    scene.add(tMesh);

    // Sparks Geometry (Small debris breaking off)
    const totalSparks = MAX * SPARKS;
    const sPos = new Float32Array(totalSparks * 3);
    const sCol = new Float32Array(totalSparks * 3);
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));

    const sMat = new THREE.PointsMaterial({
      size: 0.15,
      map: texSmall,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true
    });
    const sMesh = new THREE.Points(sGeo, sMat);
    scene.add(sMesh);

    // ─── METEOR STATE ──────────────────────────────────────
    interface Spark {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      life: number;
    }

    interface Meteor {
      active: boolean;
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      trailIdx: number;
      sparkIdx: number;
      hue: number;
      brightness: number;
      phase: number;
      wobble: number;
      fadeOut: number;      // 0 = normal, 1 = fully dissolved
      deathTimer: number;   // countdown for fade animation
      sparks: Spark[];
    }

    const meteors: Meteor[] = [];

    function spawn(idx: number): Meteor {
      const side = Math.random() > 0.5 ? 1 : -1;
      // Start much higher and further for a long, elegant entry
      const x = side * (25 + Math.random() * 15);
      const y = 20 + Math.random() * 10;
      const z = (Math.random() - 0.5) * 20;

      const speed = 40 + Math.random() * 30;
      // Initial velocity points toward the center-bottom
      const vx = -side * speed * (0.8 + Math.random() * 0.2);
      const vy = -speed * (0.5 + Math.random() * 0.3);
      const vz = (Math.random() - 0.5) * 10;

      const hues = [190, 210, 40, 15];
      const hue = hues[Math.floor(Math.random() * hues.length)];

      const m: Meteor = {
        active: true, x, y, z, vx, vy, vz,
        trailIdx: idx * TRAIL,
        sparkIdx: idx * SPARKS,
        hue,
        brightness: 1,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.2 + Math.random() * 0.5,
        fadeOut: 0,
        deathTimer: 0,
        sparks: Array.from({ length: SPARKS }, () => ({
          x: 0, y: -100, z: 0, vx: 0, vy: 0, vz: 0, life: 0
        }))
      };

      for (let j = 0; j < TRAIL; j++) {
        const pi = (idx * TRAIL + j) * 3;
        tPos[pi] = x; tPos[pi+1] = y; tPos[pi+2] = z;
        tSize[idx * TRAIL + j] = 0;
      }

      meteors[idx] = m;
      return m;
    }

    for (let i = 0; i < MAX; i++) {
      meteors.push({
        active: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
        trailIdx: i * TRAIL, sparkIdx: i * SPARKS, hue: 0, brightness: 0,
        phase: 0, wobble: 0, fadeOut: 0, deathTimer: 0, sparks: []
      });
    }

    let spawnTimer = 0;
    let spawnDelay = 0.5;

    // ─── MOUSE & RESIZE ────────────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // ─── ANIMATION ─────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();
    
    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.02;
      mouse.y += (mouse.ty - mouse.y) * 0.02;
      camera.position.x = mouse.x * 2.5;
      camera.position.y = mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      // BG Stars update
      const bgPositions = bgGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < BG; i++) {
        bgPositions[i * 3 + 1] -= dt * 0.6;
        if (bgPositions[i * 3 + 1] < -60) bgPositions[i * 3 + 1] = 60;
        const tw = 0.4 + 0.6 * Math.pow(Math.sin(elapsed * bgSp[i] + bgPh[i]), 2);
        bgGeo.attributes.size.array[i] = 0.12 * tw;
      }
      bgGeo.attributes.position.needsUpdate = true;
      bgGeo.attributes.size.needsUpdate = true;

      // Spawn logic
      spawnTimer += dt;
      if (spawnTimer >= spawnDelay) {
        spawnTimer = 0;
        spawnDelay = 1.0 + Math.random() * 3.0;
        const free = meteors.findIndex(m => !m.active);
        if (free >= 0) spawn(free);
      }

      // Update Meteors
      for (let i = 0; i < MAX; i++) {
        const m = meteors[i];
        if (!m.active) continue;

        // Elegant physics: Curved trajectory + slight drag
        m.phase += dt * 5;
        const sway = Math.sin(m.phase) * m.wobble;
        
        m.x += (m.vx + sway) * dt;
        m.y += m.vy * dt;
        m.z += (m.vz + Math.cos(m.phase) * m.wobble) * dt;

        // Slight gravity bend
        m.vy -= dt * 15;
        
        // Intensity flicker
        m.brightness = 0.85 + 0.3 * Math.sin(elapsed * 25 + i * 10);

        // Check if meteor should start fading out
        if (m.y < -30 || Math.abs(m.x) > 50) {
          if (m.deathTimer === 0) {
            m.deathTimer = 0.6; // Start 0.6s fade-out
          }
        }

        // Update fade-out animation
        if (m.deathTimer > 0) {
          m.deathTimer -= dt;
          m.fadeOut = Math.min(1, 1 - (m.deathTimer / 0.6));
          
          if (m.deathTimer <= 0) {
            m.active = false;
            continue;
          }
        }

        // Shift Trail
        for (let j = TRAIL - 1; j > 0; j--) {
          const pi = (m.trailIdx + j) * 3;
          const pj = (m.trailIdx + j - 1) * 3;
          tPos[pi] = tPos[pj];
          tPos[pi+1] = tPos[pj+1];
          tPos[pi+2] = tPos[pj+2];
        }
        tPos[m.trailIdx * 3] = m.x;
        tPos[m.trailIdx * 3 + 1] = m.y;
        tPos[m.trailIdx * 3 + 2] = m.z;

        const baseCol = new THREE.Color().setHSL(m.hue / 360, 0.9, 0.6);
        const fadeMult = 1 - m.fadeOut; // Apply fade-out to entire trail
        
        for (let j = 0; j < TRAIL; j++) {
          const pct = 1 - j / TRAIL;
          const tidx = m.trailIdx + j;
          const pi = tidx * 3;
          
          // Turbulence effect on trail size
          const turb = 1.0 + 0.15 * Math.sin(elapsed * 20 - j * 0.2);
          tSize[tidx] = (j === 0 ? 1.8 : 1.0) * Math.pow(pct, 1.5) * m.brightness * turb * fadeMult;
          
          // Progressive dissolve: back of trail fades first
          const dissolvePct = Math.max(0, 1 - m.fadeOut * (1 + j / TRAIL));
          tOpac[tidx] = Math.pow(pct, 1.1) * dissolvePct;

          // Color shift: Hot center -> Cooling tail
          const heat = Math.pow(pct, 2.5);
          tCol[pi] = (1.0 * heat + baseCol.r * (1 - heat));
          tCol[pi+1] = (1.0 * heat + baseCol.g * (1 - heat));
          tCol[pi+2] = (1.0 * heat + baseCol.b * (1 - heat));
        }

        // Update Sparks
        const sparkFade = 1 - m.fadeOut * 0.7; // Sparks fade slower than trail
        for (let j = 0; j < SPARKS; j++) {
          const s = m.sparks[j];
          if (s.life <= 0) {
            if (Math.random() > 0.85 && m.fadeOut < 0.5) { // Stop spawning during fade-out
              s.life = 0.4 + Math.random() * 0.4;
              s.x = m.x; s.y = m.y; s.z = m.z;
              s.vx = m.vx * 0.4 + (Math.random() - 0.5) * 15;
              s.vy = m.vy * 0.4 + (Math.random() - 0.5) * 15;
              s.vz = (Math.random() - 0.5) * 10;
            }
          } else {
            s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
            s.vx *= 0.94; s.vy *= 0.94; s.vz *= 0.94;
            s.life -= dt;
          }
          const si = (m.sparkIdx + j) * 3;
          sPos[si] = s.x; sPos[si+1] = s.y; sPos[si+2] = s.z;
          const slife = Math.max(0, s.life) * sparkFade;
          sCol[si] = (baseCol.r + 0.5) * slife;
          sCol[si+1] = (baseCol.g + 0.2) * slife;
          sCol[si+2] = baseCol.b * slife;
        }
      }

      tGeo.attributes.position.needsUpdate = true;
      tGeo.attributes.color.needsUpdate = true;
      tGeo.attributes.size.needsUpdate = true;
      tGeo.attributes.opacity.needsUpdate = true;
      sGeo.attributes.position.needsUpdate = true;
      sGeo.attributes.color.needsUpdate = true;

      tMat.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      bgGeo.dispose(); bgMat.dispose();
      tGeo.dispose(); tMat.dispose();
      sGeo.dispose(); sMat.dispose();
      texGlow.dispose(); texSmall.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
      style={{ opacity: theme === "light" ? 0 : 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
