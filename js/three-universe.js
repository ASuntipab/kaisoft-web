/**
 * KAI SOFT — Full-Page 3D Cosmic Marble Universe Engine
 * Powered by Three.js & GSAP
 * 
 * Features:
 * - Vibrant, Rich Natural Colors for All 5 Mascots (No White Bleaching or Overexposure)
 * - 3D Planet Marbles with Deep Element-Tinted Crystal Shells & Glowing Relics
 * - Balanced Atmospheric 3-Point Lighting with Deep Contrast & Shadows
 * - 5 Realm Guardians overseeing their respective sections:
 *     Section 0 (Hero): Cosmic Nexus Overview
 *     Section 1 (Case Studies): 🔥 Fenik the Phoenix (The Fire & Intellect Guardian)
 *     Section 2 (Pipeline & Flow Link): 🪐 Celestial Bridge & 5 Crystalline Relic Orbs
 *     Section 3 (Services & ROI): 🐷 Moni the Piggy (The Fortune & Growth Guardian)
 *     Section 4 (Architecture & Security): 📦 Stash the Vault & 🐢 Teta the Turtle
 *     Section 5 (Insights & Resources): 🦉 Ollie the Wise Owl (The Wisdom Guardian)
 *     Section 6 (Estimation & Contact): ✨ Grand Cosmic Beacon
 * - Smooth Scroll-Driven 3D Camera Flight Path (Spline Interpolation)
 * - Mouse & Gyroscope 3D Parallax Depth
 * - Web Audio Synthetic Crystal Chimes
 */

(function () {
    'use strict';

    // ── Helper: Soft Circular Glow Sprite Texture ──
    function makeSoftGlowTexture() {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(165, 180, 252, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    // ── Relic Geometry Factories (Faceted Gemstones from App Spec) ──
    function makeStarSparkGeometry(radius) {
        const rings = [
            { y: 1.0, r: 0.0 },
            { y: 0.0, r: 0.65 },
            { y: -1.0, r: 0.0 }
        ];
        return latheFacetGeometry(rings, 4, radius);
    }

    function latheFacetGeometry(rings, sides, radius) {
        const pos = [];
        const push = (a, b, c) => { pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); };
        const vert = (ring, i) => {
            const ang = (i / sides) * Math.PI * 2;
            return [Math.cos(ang) * ring.r, ring.y, Math.sin(ang) * ring.r];
        };

        if (rings[0].r > 0) {
            const center = [0, rings[0].y, 0];
            for (let i = 0; i < sides; i++) {
                push(center, vert(rings[0], (i + 1) % sides), vert(rings[0], i));
            }
        }

        for (let s = 0; s < rings.length - 1; s++) {
            for (let i = 0; i < sides; i++) {
                const j = (i + 1) % sides;
                const a = vert(rings[s], i), b = vert(rings[s], j);
                const c = vert(rings[s + 1], i), d = vert(rings[s + 1], j);
                if (rings[s].r === 0) push(a, d, c);
                else if (rings[s + 1].r === 0) push(a, b, c);
                else { push(a, b, c); push(b, d, c); }
            }
        }

        const maxR = Math.max(...rings.map(r => Math.hypot(r.r, r.y)));
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.computeVertexNormals();
        geo.scale(radius / maxR, radius / maxR, radius / maxR);
        geo.computeBoundingSphere();
        return geo;
    }

    function makeHexGemGeometry(radius) {
        const s = radius / Math.hypot(0.7, 0.7);
        const geo = new THREE.CylinderGeometry(0.4 * s, 0.7 * s, 1.4 * s, 6).toNonIndexed();
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        return geo;
    }

    function makeCoinGeometry(radius) {
        const geo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, radius * 0.22, 24, 1);
        geo.rotateX(Math.PI / 2);
        return geo;
    }

    function makeCoinFaceRingGeometry(radius) {
        const front = new THREE.RingGeometry(radius * 0.5, radius * 0.62, 24).toNonIndexed();
        const back = front.clone();
        front.translate(0, 0, radius * 0.115);
        back.translate(0, 0, -radius * 0.115);

        const merged = new THREE.BufferGeometry();
        for (const name of ['position', 'normal', 'uv']) {
            const a = front.getAttribute(name), b = back.getAttribute(name);
            if (!a || !b) continue;
            const arr = new Float32Array(a.array.length + b.array.length);
            arr.set(a.array, 0);
            arr.set(b.array, a.array.length);
            merged.setAttribute(name, new THREE.BufferAttribute(arr, a.itemSize));
        }
        merged.computeBoundingSphere();
        return merged;
    }

    class CosmicFullPageUniverse {
        constructor() {
            this.canvas = document.getElementById('cosmic-canvas');
            if (!this.canvas) return;

            this.scrollProgress = 0;
            this.targetScrollProgress = 0;
            this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.clock = new THREE.Clock();
            this.mascots = {};
            this.floatingMarbles = [];
            this.pointLights = [];
            this.soundEnabled = true;
            this.audioCtx = null;

            // Camera Waypoints along the scroll journey [scrollProgress 0.0 -> 1.0]
            this.cameraWaypoints = [
                // 0. Hero (Scroll 0.00) - Wide Panoramic Nexus
                { progress: 0.00, cam: new THREE.Vector3(0, 3.8, 17.5), lookAt: new THREE.Vector3(0, 0.8, 0) },
                // 1. Case Studies (Scroll 0.18) - Phoenix Realm (Right side focus)
                { progress: 0.18, cam: new THREE.Vector3(1.6, -6.0, 7.2), lookAt: new THREE.Vector3(4.0, -7.5, -3.5) },
                // 2. Product Pipeline / Flow Link (Scroll 0.36) - Celestial Bridge & 5 Relic Orbs (Left side focus)
                { progress: 0.36, cam: new THREE.Vector3(-1.4, -14.2, 7.8), lookAt: new THREE.Vector3(-4.2, -15.8, -3.2) },
                // 3. Services & ROI (Scroll 0.54) - Piggy Bank Realm (Right side focus)
                { progress: 0.54, cam: new THREE.Vector3(1.8, -22.8, 7.2), lookAt: new THREE.Vector3(4.2, -24.5, -3.5) },
                // 4. Cloud Architecture & Security (Scroll 0.72) - Stash & Turtle (Left side focus)
                { progress: 0.72, cam: new THREE.Vector3(-1.6, -31.2, 7.8), lookAt: new THREE.Vector3(-4.4, -32.8, -3.5) },
                // 5. Tech Insights & Resources (Scroll 0.88) - Owl Realm (Right side focus)
                { progress: 0.88, cam: new THREE.Vector3(1.5, -39.8, 7.5), lookAt: new THREE.Vector3(4.0, -41.5, -3.0) },
                // 6. Estimation & Contact (Scroll 1.00) - Grand Cosmic Beacon (Center focus)
                { progress: 1.00, cam: new THREE.Vector3(0, -47.0, 8.8), lookAt: new THREE.Vector3(0, -49.8, -4.2) }
            ];

            this.currentCamPos = new THREE.Vector3().copy(this.cameraWaypoints[0].cam);
            this.currentLookAt = new THREE.Vector3().copy(this.cameraWaypoints[0].lookAt);

            this.init();
        }

        init() {
            // 1. Scene, Camera, Renderer
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x030712, 0.015);

            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            this.camera.position.copy(this.currentCamPos);

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.0; // Clean natural contrast (no white clipping)

            // 2. Balanced Cosmic Studio Lighting (Clean contrast, no overexposure)
            this.initLighting();

            // 3. Starfield & Cosmic Dust Clouds
            this.initCosmicEnvironment();

            // 4. Build Mascots with Rich Clay/Standard Materials
            this.buildMascots();

            // 5. Build High-Dimensional Floating Physical Crystal Marbles
            this.buildFloatingMarbles();

            // 6. Build Celestial Highway & Orbit Pathways
            this.buildCosmicHighways();

            // 7. Bind Scroll & Interaction Events
            this.bindEvents();

            // 8. Animation Loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        initLighting() {
            // Deep space ambient fill for deep shadows
            const ambient = new THREE.AmbientLight(0x0f172a, 0.5);
            this.scene.add(ambient);

            // Primary Sun/Nebula Directional Light (Crisp Key Light)
            const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
            sunLight.position.set(15, 25, 20);
            this.scene.add(sunLight);

            // Cyan Secondary Rim Light (Edges & Silhouettes)
            const cyanRim = new THREE.DirectionalLight(0x38bdf8, 0.7);
            cyanRim.position.set(-20, -10, -15);
            this.scene.add(cyanRim);

            // Purple Deep Space Fill Light
            const purpleFill = new THREE.DirectionalLight(0xa855f7, 0.5);
            purpleFill.position.set(12, -35, 12);
            this.scene.add(purpleFill);

            // Warm Amber Under-Light
            const amberUnder = new THREE.DirectionalLight(0xf59e0b, 0.4);
            amberUnder.position.set(-10, -50, 10);
            this.scene.add(amberUnder);

            // Local Point Lights on Key Mascots (Gentle localized aura)
            const addPointLight = (color, intensity, x, y, z, dist = 12) => {
                const pl = new THREE.PointLight(color, intensity, dist, 1.8);
                pl.position.set(x, y, z);
                this.scene.add(pl);
                this.pointLights.push(pl);
            };

            addPointLight(0xF97316, 0.6, 4.2, -7.5, -2.5);   // Phoenix Flame
            addPointLight(0xFB7185, 0.5, 4.5, -24.5, -2.5);  // Piggy Gold/Pink
            addPointLight(0x10B981, 0.5, -3.6, -32.5, -2.5); // Turtle Emerald
            addPointLight(0x8B5CF6, 0.6, 4.0, -41.5, -2.0);  // Owl Amethyst
            addPointLight(0x6366F1, 1.2, 0, -50.0, -3.0, 16); // Beacon Core
        }

        initCosmicEnvironment() {
            const glowTex = makeSoftGlowTexture();

            // Starfield (2,600 Multi-hued stars spanning full scroll depth)
            const starCount = 2600;
            const starGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(starCount * 3);
            const colors = new Float32Array(starCount * 3);

            const palette = [
                new THREE.Color(0xffffff),
                new THREE.Color(0x93c5fd),
                new THREE.Color(0x67e8f9),
                new THREE.Color(0xc084fc),
                new THREE.Color(0xfde047),
                new THREE.Color(0x6ee7b7)
            ];

            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;
                const radius = 12 + Math.random() * 55;
                const theta = Math.random() * Math.PI * 2;
                positions[i3] = radius * Math.cos(theta);
                positions[i3 + 1] = 14 - (Math.random() * 85);
                positions[i3 + 2] = radius * Math.sin(theta);

                const c = palette[Math.floor(Math.random() * palette.length)];
                const brightness = 0.6 + Math.random() * 0.4;
                colors[i3] = c.r * brightness;
                colors[i3 + 1] = c.g * brightness;
                colors[i3 + 2] = c.b * brightness;
            }

            starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const starMat = new THREE.PointsMaterial({
                size: 0.32,
                map: glowTex,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            this.starfield = new THREE.Points(starGeo, starMat);
            this.scene.add(this.starfield);

            // Glowing Cosmic Nebula Dust Particles
            const nebulaCount = 220;
            const nebulaGeo = new THREE.BufferGeometry();
            const nebulaPos = new Float32Array(nebulaCount * 3);
            const nebulaColors = new Float32Array(nebulaCount * 3);

            for (let i = 0; i < nebulaCount; i++) {
                const i3 = i * 3;
                nebulaPos[i3] = (Math.random() - 0.5) * 36;
                nebulaPos[i3 + 1] = 12 - (Math.random() * 75);
                nebulaPos[i3 + 2] = (Math.random() - 0.5) * 32;

                const c = palette[i % palette.length];
                nebulaColors[i3] = c.r;
                nebulaColors[i3 + 1] = c.g;
                nebulaColors[i3 + 2] = c.b;
            }

            nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
            nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

            const nebulaMat = new THREE.PointsMaterial({
                size: 1.4,
                map: glowTex,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            this.nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
            this.scene.add(this.nebulaPoints);
        }

        buildMascots() {
            // 1. 🔥 Fenik the Phoenix (Section 1: Case Studies - Y: -7.5)
            this.mascots.phoenix = this.createPhoenixMesh();
            this.mascots.phoenix.position.set(4.2, -7.5, -3.8);
            this.mascots.phoenix.userData = { basePos: new THREE.Vector3(4.2, -7.5, -3.8), realm: 'phoenix' };
            this.scene.add(this.mascots.phoenix);

            // 2. 🐷 Moni the Piggy (Section 3: Services & ROI - Y: -24.5)
            this.mascots.piggy = this.createPiggyMesh();
            this.mascots.piggy.position.set(4.5, -24.5, -3.8);
            this.mascots.piggy.userData = { basePos: new THREE.Vector3(4.5, -24.5, -3.8), realm: 'piggy' };
            this.scene.add(this.mascots.piggy);

            // 3. 🐢 Teta the Turtle & 📦 Stash the Vault (Section 4: Cloud Architecture - Y: -33.0)
            const archGroup = new THREE.Group();
            this.mascots.turtle = this.createTurtleMesh();
            this.mascots.turtle.position.set(-3.6, -32.5, -3.6);
            this.mascots.turtle.userData = { basePos: new THREE.Vector3(-3.6, -32.5, -3.6), realm: 'turtle' };
            archGroup.add(this.mascots.turtle);

            this.mascots.vault = this.createVaultMesh();
            this.mascots.vault.position.set(-5.5, -33.8, -4.0);
            this.mascots.vault.userData = { basePos: new THREE.Vector3(-5.5, -33.8, -4.0), realm: 'vault' };
            archGroup.add(this.mascots.vault);
            this.scene.add(archGroup);

            // 4. 🦉 Ollie the Wise Owl (Section 5: Resources & Wisdom - Y: -41.5)
            this.mascots.owl = this.createOwlMesh();
            this.mascots.owl.position.set(4.0, -41.5, -3.2);
            this.mascots.owl.userData = { basePos: new THREE.Vector3(4.0, -41.5, -3.2), realm: 'owl' };
            this.scene.add(this.mascots.owl);

            // 5. ✨ Grand Cosmic Beacon (Section 6: Estimation & Contact - Y: -50.0)
            this.mascots.beacon = this.createCosmicBeaconMesh();
            this.mascots.beacon.position.set(0, -50.0, -4.5);
            this.scene.add(this.mascots.beacon);
        }

        createPhoenixMesh() {
            const group = new THREE.Group();

            // Vibrant Amber Orange Flame Body (Solid Saturated Clay)
            const bodyMat = new THREE.MeshStandardMaterial({
                color: 0xF97316,
                emissive: 0xEA580C,
                emissiveIntensity: 0.25,
                roughness: 0.3,
                metalness: 0.05
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.35, 32, 32), bodyMat);
            group.add(body);

            // Flapping Wings
            const wingGeo = new THREE.ConeGeometry(0.6, 1.5, 16);
            wingGeo.rotateZ(Math.PI / 3);
            const wingL = new THREE.Mesh(wingGeo, bodyMat);
            wingL.position.set(-1.2, 0.1, 0);
            const wingR = new THREE.Mesh(wingGeo, bodyMat);
            wingR.position.set(1.2, 0.1, 0);
            wingR.scale.set(-1, 1, 1);
            group.add(wingL, wingR);
            group.userData.wingL = wingL;
            group.userData.wingR = wingR;

            // Golden Beak
            const beakMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.25, metalness: 0.1 });
            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.6, 16), beakMat);
            beak.rotation.x = Math.PI / 2;
            beak.position.set(0, 0.05, 1.4);
            group.add(beak);

            // Cute Eyes
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
            const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), eyeMat);
            eyeL.scale.set(1, 1.25, 0.4);
            eyeL.position.set(-0.5, 0.38, 1.2);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.5;
            group.add(eyeL, eyeR);

            // Blush Cheeks
            const cheekMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.4 });
            const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), cheekMat);
            cheekL.position.set(-0.8, 0.05, 1.1);
            const cheekR = cheekL.clone();
            cheekR.position.x = 0.8;
            group.add(cheekL, cheekR);

            // Double Constellation Orbit Rings
            const ringGeo1 = new THREE.RingGeometry(2.1, 2.35, 64);
            const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xFBBF24, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
            const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
            ring1.rotation.x = Math.PI / 2.2;
            group.add(ring1);

            const ringGeo2 = new THREE.RingGeometry(2.6, 2.75, 64);
            const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xFB923C, side: THREE.DoubleSide, transparent: true, opacity: 0.22 });
            const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
            ring2.rotation.y = Math.PI / 3;
            group.add(ring2);
            group.userData.ring = ring1;
            group.userData.ring2 = ring2;

            return group;
        }

        createPiggyMesh() {
            const group = new THREE.Group();

            // Rich Cute Rose-Pink Claymorphic Body (Vibrant Saturated Color)
            const bodyMat = new THREE.MeshStandardMaterial({
                color: 0xFB7185,
                emissive: 0xDB2777,
                emissiveIntensity: 0.22,
                roughness: 0.35,
                metalness: 0.05
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), bodyMat);
            group.add(body);

            // Ears
            const earGeo = new THREE.ConeGeometry(0.42, 0.85, 16);
            const earL = new THREE.Mesh(earGeo, bodyMat);
            earL.position.set(-0.85, 1.15, 0.1);
            earL.rotation.z = Math.PI / 5;
            const earR = new THREE.Mesh(earGeo, bodyMat);
            earR.position.set(0.85, 1.15, 0.1);
            earR.rotation.z = -Math.PI / 5;
            group.add(earL, earR);
            group.userData.earL = earL;
            group.userData.earR = earR;

            // Sweet Baby-Pink Snout (NOT WHITE!)
            const snoutMat = new THREE.MeshStandardMaterial({
                color: 0xFCE7F3,
                emissive: 0xFBCFE8,
                emissiveIntensity: 0.18,
                roughness: 0.38,
                metalness: 0.05
            });
            const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24), snoutMat);
            snout.rotation.x = Math.PI / 2;
            snout.position.set(0, -0.05, 1.4);
            group.add(snout);

            const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x3f3f46 });
            const nL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), nostrilMat);
            nL.position.set(-0.18, -0.05, 1.55);
            const nR = nL.clone();
            nR.position.x = 0.18;
            group.add(nL, nR);

            // Cute Eyes
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
            const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.09, 0.1), eyeMat);
            eyeL.position.set(-0.5, 0.48, 1.3);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.5;
            group.add(eyeL, eyeR);

            // Orbiting Rich Metallic Gold Coins with Inlay Rings
            const coinMat = new THREE.MeshStandardMaterial({
                color: 0xFBBF24,
                metalness: 0.7,
                roughness: 0.2,
                emissive: 0xD97706,
                emissiveIntensity: 0.25
            });
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A, side: THREE.DoubleSide });

            const coinsGroup = new THREE.Group();
            for (let i = 0; i < 4; i++) {
                const singleCoinGroup = new THREE.Group();
                const coin = new THREE.Mesh(makeCoinGeometry(0.45), coinMat);
                const coinRing = new THREE.Mesh(makeCoinFaceRingGeometry(0.45), ringMat);
                singleCoinGroup.add(coin, coinRing);

                const angle = i * (Math.PI / 2);
                singleCoinGroup.position.set(Math.cos(angle) * 2.3, 0.5 + Math.sin(i) * 0.4, Math.sin(angle) * 2.3);
                singleCoinGroup.rotation.x = Math.PI / 3;
                coinsGroup.add(singleCoinGroup);
            }
            group.add(coinsGroup);
            group.userData.coinsGroup = coinsGroup;

            return group;
        }

        createTurtleMesh() {
            const group = new THREE.Group();

            // Saturated Mint Green Body
            const skinMat = new THREE.MeshStandardMaterial({
                color: 0x34D399,
                emissive: 0x059669,
                emissiveIntensity: 0.2,
                roughness: 0.35,
                metalness: 0.05
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 24), skinMat);
            body.scale.set(1.15, 0.65, 1.25);
            group.add(body);

            // Head & Eyes
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), skinMat);
            head.position.set(0, 0.2, 1.45);
            head.scale.set(1, 0.9, 1.1);
            group.add(head);

            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
            const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), eyeMat);
            eyeL.position.set(-0.28, 0.35, 1.72);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.28;
            group.add(eyeL, eyeR);

            // 4 Flippers
            const legGeo = new THREE.SphereGeometry(0.32, 16, 16);
            legGeo.scale(1.5, 0.45, 0.85);
            const flipperFL = new THREE.Mesh(legGeo, skinMat);
            flipperFL.position.set(-1.25, -0.15, 0.9);
            flipperFL.rotation.y = Math.PI / 4;
            const flipperFR = new THREE.Mesh(legGeo, skinMat);
            flipperFR.position.set(1.25, -0.15, 0.9);
            flipperFR.rotation.y = -Math.PI / 4;
            group.add(flipperFL, flipperFR);

            // Deep Glowing Emerald Crystal Shell
            const shellMat = new THREE.MeshPhysicalMaterial({
                color: 0x047857,
                emissive: 0x065F46,
                emissiveIntensity: 0.35,
                transmission: 0.35,
                roughness: 0.15,
                metalness: 0.1,
                clearcoat: 0.9
            });
            const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), shellMat);
            shell.position.set(0, 0.5, -0.05);
            shell.scale.set(1.1, 0.75, 1.2);
            group.add(shell);

            // Glowing Amber Hearth
            const houseMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, emissive: 0xF59E0B, emissiveIntensity: 0.4, roughness: 0.2 });
            const houseBase = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), houseMat);
            houseBase.position.set(0, 1.15, -0.05);
            const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.32, 4), houseMat);
            houseRoof.position.set(0, 1.45, -0.05);
            houseRoof.rotation.y = Math.PI / 4;
            group.add(houseBase, houseRoof);

            return group;
        }

        createVaultMesh() {
            const group = new THREE.Group();

            const chestMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.45, metalness: 0.2, emissive: 0x451A03, emissiveIntensity: 0.15 });
            const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.8, roughness: 0.2, emissive: 0xB45309, emissiveIntensity: 0.2 });
            const runeGlowMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });

            const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.85, 1.15), chestMat);
            base.position.y = -0.2;
            group.add(base);

            const trimBottom = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.12, 1.2), goldTrimMat);
            trimBottom.position.y = -0.58;
            group.add(trimBottom);

            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1.7, 24, 1, false, 0, Math.PI), chestMat);
            lid.rotation.z = Math.PI / 2;
            lid.rotation.y = Math.PI;
            lid.position.set(0, 0.23, 0);
            group.add(lid);

            const lock = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), runeGlowMat);
            lock.position.set(0, 0.1, 0.65);
            group.add(lock);
            group.userData.lock = lock;

            return group;
        }

        createOwlMesh() {
            const group = new THREE.Group();

            // Rich Royal Purple Body
            const featherMat = new THREE.MeshStandardMaterial({
                color: 0x7C3AED,
                emissive: 0x5B21B6,
                emissiveIntensity: 0.2,
                roughness: 0.4,
                metalness: 0.05
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), featherMat);
            group.add(body);

            // Lilac Breast
            const breastMat = new THREE.MeshStandardMaterial({ color: 0xDDD6FE, roughness: 0.45, emissive: 0xC4B5FD, emissiveIntensity: 0.15 });
            const breast = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), breastMat);
            breast.position.set(0, -0.25, 0.6);
            breast.scale.set(0.9, 1.1, 0.65);
            group.add(breast);

            // Large Glowing Wise Eyes
            const eyeFrameMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.2, metalness: 0.5 });
            const eyeFrameL = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 16, 24), eyeFrameMat);
            eyeFrameL.position.set(-0.48, 0.48, 1.02);
            const eyeFrameR = eyeFrameL.clone();
            eyeFrameR.position.x = 0.48;
            group.add(eyeFrameL, eyeFrameR);

            const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
            const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), pupilMat);
            pupilL.position.set(-0.48, 0.48, 1.05);
            pupilL.scale.set(1, 1, 0.3);
            const pupilR = pupilL.clone();
            pupilR.position.x = 0.48;
            group.add(pupilL, pupilR);

            // Golden Beak
            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.48, 16), eyeFrameMat);
            beak.rotation.x = Math.PI / 1.7;
            beak.position.set(0, 0.16, 1.25);
            group.add(beak);

            // Perch Book
            const bookMat = new THREE.MeshStandardMaterial({ color: 0x1E1B4B, roughness: 0.4 });
            const book = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.26, 1.3), bookMat);
            book.position.set(0, -1.3, 0);
            const bookPages = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xFEF3C7 }));
            bookPages.position.set(0.05, -1.3, 0);
            group.add(book, bookPages);

            return group;
        }

        createCosmicBeaconMesh() {
            const group = new THREE.Group();

            // Core Pulsing Indigo Energy Sphere
            const coreMat = new THREE.MeshPhysicalMaterial({
                color: 0x6366F1,
                emissive: 0x4F46E5,
                emissiveIntensity: 0.8,
                roughness: 0.15,
                metalness: 0.1,
                transmission: 0.35,
                clearcoat: 1.0
            });
            const core = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), coreMat);
            group.add(core);
            group.userData.core = core;

            // Cosmic Upward Light Beam
            const beamGeo = new THREE.CylinderGeometry(0.1, 4.5, 40, 32, 1, true);
            const beamMat = new THREE.MeshBasicMaterial({
                color: 0x6366F1,
                transparent: true,
                opacity: 0.24,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.y = 20;
            group.add(beam);

            // Surrounding Tri-Rings
            for (let i = 0; i < 3; i++) {
                const ringGeo = new THREE.RingGeometry(2.4 + i * 0.6, 2.55 + i * 0.6, 64);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: i === 0 ? 0x60a5fa : (i === 1 ? 0xc084fc : 0x34d399),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.35
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2 + (i * 0.15);
                ring.rotation.y = (i * 0.2);
                group.add(ring);
            }

            return group;
        }

        // ── 💎 4-Layer High-Dimensional Physical Crystal Planet Marbles ──
        buildFloatingMarbles() {
            const marbleConfigs = [
                // 1. Hero Nexus Marbles
                { pos: new THREE.Vector3(-4.6, 2.6, 4), color: 0xF97316, relic: 'star', scale: 0.9 },
                { pos: new THREE.Vector3(5.2, 1.9, 3), color: 0xFB7185, relic: 'coin', scale: 0.95 },
                { pos: new THREE.Vector3(-3.8, -1.5, 5), color: 0x10B981, relic: 'hexGem', scale: 0.85 },
                { pos: new THREE.Vector3(4.4, -3.2, 4), color: 0x8B5CF6, relic: 'icosa', scale: 0.88 },
                // 2. Section 2 Pipeline (5 Sacred Celestial Orbs - Y: -15.8)
                { pos: new THREE.Vector3(-5.8, -14.2, -2.5), color: 0xF97316, relic: 'star', scale: 1.05 },
                { pos: new THREE.Vector3(-3.4, -15.0, -1.8), color: 0xFB7185, relic: 'coin', scale: 1.0 },
                { pos: new THREE.Vector3(-6.4, -16.2, -2.2), color: 0x10B981, relic: 'hexGem', scale: 1.1 },
                { pos: new THREE.Vector3(-4.0, -17.2, -3.0), color: 0xF59E0B, relic: 'icosa', scale: 1.0 },
                { pos: new THREE.Vector3(-5.9, -18.0, -1.5), color: 0x8B5CF6, relic: 'star', scale: 1.05 },
                // 3. Deep Path Marbles
                { pos: new THREE.Vector3(5.2, -30.0, 1.0), color: 0x06B6D4, relic: 'hexGem', scale: 0.85 },
                { pos: new THREE.Vector3(-4.8, -44.0, 1.5), color: 0xA855F7, relic: 'icosa', scale: 0.9 }
            ];

            marbleConfigs.forEach(cfg => {
                const group = new THREE.Group();

                // Layer 1: Outer Crystal Glass Shell with Rich Color & Gemstone Tint
                const glassMat = new THREE.MeshPhysicalMaterial({
                    color: cfg.color,
                    emissive: cfg.color,
                    emissiveIntensity: 0.2,
                    transmission: 0.35,
                    opacity: 0.85,
                    transparent: true,
                    roughness: 0.12,
                    metalness: 0.05,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.08
                });
                const shell = new THREE.Mesh(new THREE.SphereGeometry(cfg.scale, 36, 36), glassMat);
                group.add(shell);

                // Layer 2: Outer Atmospheric Corona Ring
                const ringGeo = new THREE.RingGeometry(cfg.scale * 1.18, cfg.scale * 1.35, 48);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: cfg.color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5,
                    blending: THREE.AdditiveBlending
                });
                const atmosphereRing = new THREE.Mesh(ringGeo, ringMat);
                atmosphereRing.rotation.x = Math.PI / 2.3;
                group.add(atmosphereRing);

                // Layer 3: Inner Faceted 3D Relic Jewel (Rich Saturated Gem Color)
                let relicGeo;
                if (cfg.relic === 'star') relicGeo = makeStarSparkGeometry(cfg.scale * 0.48);
                else if (cfg.relic === 'coin') relicGeo = makeCoinGeometry(cfg.scale * 0.46);
                else if (cfg.relic === 'hexGem') relicGeo = makeHexGemGeometry(cfg.scale * 0.48);
                else relicGeo = new THREE.IcosahedronGeometry(cfg.scale * 0.46, 0);

                const relicMat = new THREE.MeshStandardMaterial({
                    color: cfg.color,
                    emissive: cfg.color,
                    emissiveIntensity: 0.7,
                    metalness: 0.3,
                    roughness: 0.2
                });
                const relic = new THREE.Mesh(relicGeo, relicMat);
                group.add(relic);
                group.userData.relic = relic;

                // Layer 4: Inner Core Glow Sparkle (Matching Element Color)
                const innerCoreGeo = new THREE.SphereGeometry(cfg.scale * 0.18, 16, 16);
                const innerCoreMat = new THREE.MeshBasicMaterial({
                    color: cfg.color,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending
                });
                const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
                group.add(innerCore);

                group.position.copy(cfg.pos);
                group.userData.basePos = new THREE.Vector3().copy(cfg.pos);
                group.userData.ring = atmosphereRing;

                this.floatingMarbles.push(group);
                this.scene.add(group);
            });
        }

        buildCosmicHighways() {
            // Spiral Cosmic Track / Highway linking the realms down the page
            const curvePoints = [];
            for (let i = 0; i <= 24; i++) {
                const t = i / 24;
                const angle = t * Math.PI * 4;
                const radius = 6.8 + Math.sin(t * Math.PI * 3) * 1.5;
                const x = Math.sin(angle) * radius;
                const y = 5 - (t * 58);
                const z = Math.cos(angle) * radius;
                curvePoints.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.07, 8, false);
            const tubeMat = new THREE.MeshBasicMaterial({
                color: 0x6366F1,
                transparent: true,
                opacity: 0.24
            });
            const highway = new THREE.Mesh(tubeGeo, tubeMat);
            this.scene.add(highway);
        }

        playChime(freq = 880) {
            if (!this.soundEnabled) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!this.audioCtx) this.audioCtx = new AudioContext();
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.25);

                gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.45);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.5);
            } catch (e) {}
        }

        bindEvents() {
            // Scroll Handler: Calculate continuous scroll progress [0.0 -> 1.0]
            const updateScroll = () => {
                const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
                if (totalScrollable > 0) {
                    this.targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / totalScrollable));
                }
            };
            window.addEventListener('scroll', updateScroll, { passive: true });
            updateScroll();

            // Mouse / Gyroscope Parallax
            window.addEventListener('mousemove', (e) => {
                this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
                this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            }, { passive: true });

            // Window Resize
            window.addEventListener('resize', () => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });
        }

        interpolateCamera(progress) {
            const waypoints = this.cameraWaypoints;
            let i = 0;
            while (i < waypoints.length - 1 && waypoints[i + 1].progress < progress) {
                i++;
            }

            const p0 = waypoints[i];
            const p1 = waypoints[Math.min(i + 1, waypoints.length - 1)];

            const segmentProgress = (p1.progress === p0.progress) ? 0 : (progress - p0.progress) / (p1.progress - p0.progress);
            const easeProgress = 0.5 - 0.5 * Math.cos(segmentProgress * Math.PI);

            const targetCam = new THREE.Vector3().lerpVectors(p0.cam, p1.cam, easeProgress);
            const targetLook = new THREE.Vector3().lerpVectors(p0.lookAt, p1.lookAt, easeProgress);

            targetCam.x += this.mouse.x * 0.85;
            targetCam.y += -this.mouse.y * 0.55;

            this.currentCamPos.lerp(targetCam, 0.08);
            this.currentLookAt.lerp(targetLook, 0.08);

            this.camera.position.copy(this.currentCamPos);
            this.camera.lookAt(this.currentLookAt);
        }

        animate() {
            requestAnimationFrame(this.animate);

            const delta = this.clock.getDelta();
            const time = this.clock.getElapsedTime();

            // Smooth Scroll Progress & Mouse Parallax Interpolation
            this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.07;
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

            this.interpolateCamera(this.scrollProgress);

            // Mascots Idle Animations
            if (this.mascots.phoenix) {
                const base = this.mascots.phoenix.userData.basePos;
                this.mascots.phoenix.position.y = base.y + Math.sin(time * 2.8) * 0.2;
                this.mascots.phoenix.rotation.y = Math.sin(time * 1.2) * 0.25;
                if (this.mascots.phoenix.userData.ring) this.mascots.phoenix.userData.ring.rotation.z += 0.02;
                if (this.mascots.phoenix.userData.ring2) this.mascots.phoenix.userData.ring2.rotation.z -= 0.015;
            }

            if (this.mascots.piggy) {
                const base = this.mascots.piggy.userData.basePos;
                this.mascots.piggy.position.y = base.y + Math.sin(time * 2.2 + 1) * 0.15;
                this.mascots.piggy.rotation.y = Math.sin(time * 1.0) * 0.2;
                if (this.mascots.piggy.userData.coinsGroup) {
                    this.mascots.piggy.userData.coinsGroup.rotation.y += 0.025;
                }
            }

            if (this.mascots.turtle) {
                const base = this.mascots.turtle.userData.basePos;
                this.mascots.turtle.position.y = base.y + Math.sin(time * 1.6 + 2) * 0.18;
                this.mascots.turtle.rotation.z = Math.sin(time * 1.6) * 0.08;
            }

            if (this.mascots.vault && this.mascots.vault.userData.lock) {
                this.mascots.vault.userData.lock.rotation.y += 0.035;
            }

            if (this.mascots.owl) {
                const base = this.mascots.owl.userData.basePos;
                this.mascots.owl.position.y = base.y + Math.sin(time * 2.0 + 3) * 0.15;
                this.mascots.owl.rotation.y = Math.sin(time * 1.1) * 0.25;
            }

            if (this.mascots.beacon && this.mascots.beacon.userData.core) {
                const s = 1.0 + Math.sin(time * 3.0) * 0.08;
                this.mascots.beacon.userData.core.scale.set(s, s, s);
            }

            // 💎 Floating Marbles Multi-Layer Animation (Bobbing, Relic Spin, Atmosphere Rings)
            this.floatingMarbles.forEach((marble, idx) => {
                const base = marble.userData.basePos;
                marble.position.y = base.y + Math.sin(time * 1.8 + idx) * 0.25;
                if (marble.userData.relic) {
                    marble.userData.relic.rotation.x += 0.02;
                    marble.userData.relic.rotation.y += 0.028;
                }
                if (marble.userData.ring) {
                    marble.userData.ring.rotation.z += 0.012;
                }
            });

            // Starfield Slow Ambient Rotation
            if (this.starfield) this.starfield.rotation.y = time * 0.012;

            this.renderer.render(this.scene, this.camera);
        }
    }

    // Initialize once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const checkReady = () => {
            if (window.THREE) {
                window._fullPageUniverse = new CosmicFullPageUniverse();
            } else {
                setTimeout(checkReady, 100);
            }
        };
        checkReady();
    });
})();
