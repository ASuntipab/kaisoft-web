/**
 * KAI SOFT — Full-Page 3D Cosmic Marble Universe Engine
 * Powered by Three.js & GSAP
 * 
 * Features:
 * - Entire website is a continuous living 3D Cosmic Universe
 * - All 5 Mascots positioned in 3D space overseeing their respective sections:
 *     Section 0 (Hero): Cosmic Nexus Overview
 *     Section 1 (Case Studies): 🔥 Fenik the Phoenix (Brain & Quest Intellect)
 *     Section 2 (Flagship & Pipeline): 🪐 Celestial Bridge & 5 Crystalline Relic Orbs
 *     Section 3 (Services & ROI): 🐷 Moni the Piggy (Financial AI & Business Scaling)
 *     Section 4 (Architecture & Security): 📦 Stash the Vault & 🐢 Teta the Turtle
 *     Section 5 (Insights & Resources): 🦉 Ollie the Wise Owl (Wisdom & Narrative)
 *     Section 6 (Estimation & Contact): ✨ Grand Cosmic Beacon
 * - Smooth Scroll-Driven 3D Camera Flight Path (Spline Glide)
 * - Mouse & Gyroscope 3D Parallax Tilt
 * - Floating Physical Glass Marbles drifting throughout space
 * - Web Audio Synthetic Crystal Chime FX
 * - Performance optimized for 60 FPS across Mobile (iOS/Android) and Desktop
 */

(function () {
    'use strict';

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
            this.soundEnabled = true;
            this.audioCtx = null;

            // Camera Waypoints along the scroll journey [scrollProgress 0.0 -> 1.0]
            this.cameraWaypoints = [
                // 0. Hero (Scroll 0.00) - Wide Nexus View
                { progress: 0.00, cam: new THREE.Vector3(0, 3.5, 18), lookAt: new THREE.Vector3(0, 0.5, 0) },
                // 1. Case Studies (Scroll 0.18) - Phoenix Realm (Right side focus)
                { progress: 0.18, cam: new THREE.Vector3(1.5, -6.0, 7.5), lookAt: new THREE.Vector3(3.8, -7.5, -3.5) },
                // 2. Product Pipeline / Flow Link (Scroll 0.36) - Celestial Bridge & Orbs (Left side focus)
                { progress: 0.36, cam: new THREE.Vector3(-1.2, -14.5, 8.0), lookAt: new THREE.Vector3(-4.0, -16.0, -3.5) },
                // 3. Services & ROI (Scroll 0.54) - Piggy Bank Realm (Right side focus)
                { progress: 0.54, cam: new THREE.Vector3(1.6, -23.0, 7.5), lookAt: new THREE.Vector3(4.0, -24.5, -3.5) },
                // 4. Cloud Architecture & Security (Scroll 0.72) - Stash & Turtle (Left side focus)
                { progress: 0.72, cam: new THREE.Vector3(-1.5, -31.5, 8.0), lookAt: new THREE.Vector3(-4.2, -33.0, -3.5) },
                // 5. Tech Insights & Resources (Scroll 0.88) - Owl Realm (Right side focus)
                { progress: 0.88, cam: new THREE.Vector3(1.4, -40.0, 7.8), lookAt: new THREE.Vector3(3.8, -41.5, -3.0) },
                // 6. Estimation & Contact (Scroll 1.00) - Grand Cosmic Beacon (Center focus)
                { progress: 1.00, cam: new THREE.Vector3(0, -47.5, 9.0), lookAt: new THREE.Vector3(0, -50.0, -4.5) }
            ];

            this.currentCamPos = new THREE.Vector3().copy(this.cameraWaypoints[0].cam);
            this.currentLookAt = new THREE.Vector3().copy(this.cameraWaypoints[0].lookAt);

            this.init();
        }

        init() {
            // 1. Scene, Camera, Renderer
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x030712, 0.018);

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
            this.renderer.toneMappingExposure = 1.2;

            // 2. Dynamic Cosmic Lighting
            this.initLighting();

            // 3. Starfield & Cosmic Dust Clouds
            this.initCosmicEnvironment();

            // 4. Build Mascots along the spatial path
            this.buildMascots();

            // 5. Build Floating Physical Crystal Marbles
            this.buildFloatingMarbles();

            // 6. Build Celestial Bridge & Orbit Pathways
            this.buildCosmicHighways();

            // 7. Bind Scroll & Interaction Events
            this.bindEvents();

            // 8. Animation Loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        initLighting() {
            // Ambient light for soft depth
            const ambient = new THREE.AmbientLight(0xdbeafe, 1.3);
            this.scene.add(ambient);

            // Primary Sun/Nebula Light
            const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
            mainLight.position.set(15, 25, 20);
            this.scene.add(mainLight);

            // Cyan Secondary Rim Light
            const cyanLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
            cyanLight.position.set(-20, -10, -15);
            this.scene.add(cyanLight);

            // Purple Deep Space Fill
            const purpleLight = new THREE.DirectionalLight(0xa855f7, 1.2);
            purpleLight.position.set(10, -35, 15);
            this.scene.add(purpleLight);

            // Golden Warm Beacon Light
            const goldLight = new THREE.DirectionalLight(0xf59e0b, 1.3);
            goldLight.position.set(-10, -50, 10);
            this.scene.add(goldLight);
        }

        initCosmicEnvironment() {
            // Starfield (2,500 Multi-hued stars spanning full scroll depth)
            const starCount = 2500;
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
                // Distribute stars in a tall cylinder around our scroll journey (y from 10 to -70)
                const radius = 12 + Math.random() * 50;
                const theta = Math.random() * Math.PI * 2;
                positions[i3] = radius * Math.cos(theta);
                positions[i3 + 1] = 12 - (Math.random() * 80); // Y axis span
                positions[i3 + 2] = radius * Math.sin(theta);

                const c = palette[Math.floor(Math.random() * palette.length)];
                colors[i3] = c.r;
                colors[i3 + 1] = c.g;
                colors[i3 + 2] = c.b;
            }

            starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const starMat = new THREE.PointsMaterial({
                size: 0.24,
                vertexColors: true,
                transparent: true,
                opacity: 0.85
            });

            this.starfield = new THREE.Points(starGeo, starMat);
            this.scene.add(this.starfield);

            // Glowing Cosmic Nebula Dust Particles
            const nebulaCount = 180;
            const nebulaGeo = new THREE.BufferGeometry();
            const nebulaPos = new Float32Array(nebulaCount * 3);
            const nebulaColors = new Float32Array(nebulaCount * 3);

            for (let i = 0; i < nebulaCount; i++) {
                const i3 = i * 3;
                nebulaPos[i3] = (Math.random() - 0.5) * 35;
                nebulaPos[i3 + 1] = 10 - (Math.random() * 70);
                nebulaPos[i3 + 2] = (Math.random() - 0.5) * 30;

                const c = palette[i % palette.length];
                nebulaColors[i3] = c.r;
                nebulaColors[i3 + 1] = c.g;
                nebulaColors[i3 + 2] = c.b;
            }

            nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
            nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

            const nebulaMat = new THREE.PointsMaterial({
                size: 0.9,
                vertexColors: true,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending
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

            // Golden Amber Flame Body
            const bodyMat = new THREE.MeshPhysicalMaterial({
                color: 0xF97316,
                emissive: 0xEA580C,
                emissiveIntensity: 0.45,
                roughness: 0.15,
                metalness: 0.1,
                clearcoat: 1.0,
                transmission: 0.25
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
            const beakMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, roughness: 0.2, clearcoat: 0.9 });
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
            const cheekMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 });
            const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), cheekMat);
            cheekL.position.set(-0.8, 0.05, 1.1);
            const cheekR = cheekL.clone();
            cheekR.position.x = 0.8;
            group.add(cheekL, cheekR);

            // Constellation Orbit Ring
            const ringGeo = new THREE.RingGeometry(2.1, 2.35, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2.2;
            group.add(ring);
            group.userData.ring = ring;

            return group;
        }

        createPiggyMesh() {
            const group = new THREE.Group();

            // Glossy Pinkish-Gold Body
            const bodyMat = new THREE.MeshPhysicalMaterial({
                color: 0xF472B6,
                emissive: 0xDB2777,
                emissiveIntensity: 0.35,
                roughness: 0.2,
                metalness: 0.25,
                clearcoat: 0.95
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

            // Snout
            const snoutMat = new THREE.MeshPhysicalMaterial({ color: 0xFDF2F8, roughness: 0.3, emissive: 0xFDF2F8, emissiveIntensity: 0.25 });
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

            // Eyes
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
            const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.09, 0.1), eyeMat);
            eyeL.position.set(-0.5, 0.48, 1.3);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.5;
            group.add(eyeL, eyeR);

            // Floating Golden Coins Orbiting
            const coinMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.15, clearcoat: 1.0 });
            const coinsGroup = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24), coinMat);
                coin.position.set(Math.cos(i * 2.09) * 2.2, 0.6 + Math.sin(i) * 0.4, Math.sin(i * 2.09) * 2.2);
                coin.rotation.x = Math.PI / 3;
                coinsGroup.add(coin);
            }
            group.add(coinsGroup);
            group.userData.coinsGroup = coinsGroup;

            return group;
        }

        createTurtleMesh() {
            const group = new THREE.Group();

            // Mint Green Body
            const skinMat = new THREE.MeshPhysicalMaterial({
                color: 0x62BE96,
                emissive: 0x34D399,
                emissiveIntensity: 0.35,
                roughness: 0.25,
                clearcoat: 0.85
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

            // Crystal Emerald Diamond Shell & House
            const shellMat = new THREE.MeshPhysicalMaterial({
                color: 0x10B981,
                emissive: 0x059669,
                emissiveIntensity: 0.4,
                transmission: 0.8,
                roughness: 0.08,
                ior: 1.55,
                clearcoat: 1.0
            });
            const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), shellMat);
            shell.position.set(0, 0.5, -0.05);
            shell.scale.set(1.1, 0.75, 1.2);
            group.add(shell);

            // Glowing Diamond Hearth
            const houseMat = new THREE.MeshPhysicalMaterial({ color: 0xFDE047, emissive: 0xF59E0B, emissiveIntensity: 0.7 });
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

            const chestMat = new THREE.MeshPhysicalMaterial({ color: 0x78350F, roughness: 0.35, metalness: 0.4, clearcoat: 0.7 });
            const goldTrimMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.15, clearcoat: 1.0 });
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

            const featherMat = new THREE.MeshPhysicalMaterial({
                color: 0x7C3AED,
                emissive: 0x5B21B6,
                emissiveIntensity: 0.4,
                roughness: 0.2,
                clearcoat: 0.85
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), featherMat);
            group.add(body);

            // Breast
            const breastMat = new THREE.MeshPhysicalMaterial({ color: 0xEDE9FE, roughness: 0.4 });
            const breast = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), breastMat);
            breast.position.set(0, -0.25, 0.6);
            breast.scale.set(0.9, 1.1, 0.65);
            group.add(breast);

            // Large Glowing Wise Eyes
            const eyeFrameMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, roughness: 0.2, clearcoat: 1.0 });
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
            const bookMat = new THREE.MeshPhysicalMaterial({ color: 0x1E1B4B, roughness: 0.3 });
            const book = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.26, 1.3), bookMat);
            book.position.set(0, -1.3, 0);
            const bookPages = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xFEF3C7 }));
            bookPages.position.set(0.05, -1.3, 0);
            group.add(book, bookPages);

            return group;
        }

        createCosmicBeaconMesh() {
            const group = new THREE.Group();

            // Core Pulsing Energy Sphere
            const coreMat = new THREE.MeshPhysicalMaterial({
                color: 0x818cf8,
                emissive: 0x6366f1,
                emissiveIntensity: 2.0,
                roughness: 0.1,
                metalness: 0.2,
                transmission: 0.7,
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
                opacity: 0.25,
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
                    opacity: 0.4
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2 + (i * 0.15);
                ring.rotation.y = (i * 0.2);
                group.add(ring);
            }

            return group;
        }

        buildFloatingMarbles() {
            const marbleConfigs = [
                // Hero Nexus Marbles
                { pos: new THREE.Vector3(-4.5, 2.5, 4), color: 0xF97316, relic: 'star', scale: 0.75 },
                { pos: new THREE.Vector3(5.0, 1.8, 3), color: 0xEC4899, relic: 'coin', scale: 0.8 },
                { pos: new THREE.Vector3(-3.8, -1.5, 5), color: 0x10B981, relic: 'gem', scale: 0.65 },
                { pos: new THREE.Vector3(4.2, -3.2, 4), color: 0x8B5CF6, relic: 'octa', scale: 0.7 },
                // Pipeline Celestial Marbles (Section 2 - Y: -16.0)
                { pos: new THREE.Vector3(-5.5, -14.5, -2.5), color: 0xF97316, relic: 'star', scale: 0.9 },
                { pos: new THREE.Vector3(-3.2, -15.2, -1.8), color: 0xEC4899, relic: 'coin', scale: 0.85 },
                { pos: new THREE.Vector3(-6.2, -16.8, -2.2), color: 0x10B981, relic: 'gem', scale: 0.95 },
                { pos: new THREE.Vector3(-4.0, -17.5, -3.0), color: 0xF59E0B, relic: 'cube', scale: 0.85 },
                { pos: new THREE.Vector3(-5.8, -18.2, -1.5), color: 0x8B5CF6, relic: 'octa', scale: 0.9 },
                // Deep Path Marbles
                { pos: new THREE.Vector3(5.2, -30.0, 1.0), color: 0x38BDF8, relic: 'gem', scale: 0.7 },
                { pos: new THREE.Vector3(-4.8, -44.0, 1.5), color: 0xA855F7, relic: 'star', scale: 0.75 }
            ];

            marbleConfigs.forEach(cfg => {
                const group = new THREE.Group();

                // 1. Crystal Glass Shell with Transmission
                const glassMat = new THREE.MeshPhysicalMaterial({
                    color: cfg.color,
                    transmission: 0.94,
                    opacity: 1.0,
                    transparent: true,
                    roughness: 0.04,
                    ior: 1.52,
                    clearcoat: 1.0,
                    emissive: cfg.color,
                    emissiveIntensity: 0.22
                });
                const shell = new THREE.Mesh(new THREE.SphereGeometry(cfg.scale, 32, 32), glassMat);
                group.add(shell);

                // 2. Inner Floating Relic
                let relicGeo;
                if (cfg.relic === 'star') relicGeo = new THREE.IcosahedronGeometry(cfg.scale * 0.42, 0);
                else if (cfg.relic === 'coin') relicGeo = new THREE.CylinderGeometry(cfg.scale * 0.42, cfg.scale * 0.42, 0.08, 16);
                else if (cfg.relic === 'gem') relicGeo = new THREE.OctahedronGeometry(cfg.scale * 0.45, 0);
                else if (cfg.relic === 'cube') relicGeo = new THREE.BoxGeometry(cfg.scale * 0.45, cfg.scale * 0.45, cfg.scale * 0.45);
                else relicGeo = new THREE.DodecahedronGeometry(cfg.scale * 0.42, 0);

                const relicMat = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: cfg.color,
                    emissiveIntensity: 1.4,
                    metalness: 0.8,
                    roughness: 0.1
                });
                const relic = new THREE.Mesh(relicGeo, relicMat);
                group.add(relic);
                group.userData.relic = relic;

                group.position.copy(cfg.pos);
                group.userData.basePos = new THREE.Vector3().copy(cfg.pos);

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
                const radius = 6.5 + Math.sin(t * Math.PI * 3) * 1.5;
                const x = Math.sin(angle) * radius;
                const y = 5 - (t * 58);
                const z = Math.cos(angle) * radius;
                curvePoints.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.06, 8, false);
            const tubeMat = new THREE.MeshBasicMaterial({
                color: 0x6366F1,
                transparent: true,
                opacity: 0.22
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
            // Find current waypoint segment
            const waypoints = this.cameraWaypoints;
            let i = 0;
            while (i < waypoints.length - 1 && waypoints[i + 1].progress < progress) {
                i++;
            }

            const p0 = waypoints[i];
            const p1 = waypoints[Math.min(i + 1, waypoints.length - 1)];

            const segmentProgress = (p1.progress === p0.progress) ? 0 : (progress - p0.progress) / (p1.progress - p0.progress);
            const easeProgress = 0.5 - 0.5 * Math.cos(segmentProgress * Math.PI); // Smooth cosine ease

            const targetCam = new THREE.Vector3().lerpVectors(p0.cam, p1.cam, easeProgress);
            const targetLook = new THREE.Vector3().lerpVectors(p0.lookAt, p1.lookAt, easeProgress);

            // Apply Mouse Parallax offset
            targetCam.x += this.mouse.x * 0.8;
            targetCam.y += -this.mouse.y * 0.5;

            // Smoothly interpolate current camera position and lookAt
            this.currentCamPos.lerp(targetCam, 0.08);
            this.currentLookAt.lerp(targetLook, 0.08);

            this.camera.position.copy(this.currentCamPos);
            this.camera.lookAt(this.currentLookAt);
        }

        animate() {
            requestAnimationFrame(this.animate);

            const delta = this.clock.getDelta();
            const time = this.clock.getElapsedTime();

            // Smooth Scroll Progress Interpolation
            this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.07;
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

            // Update Camera Position along Spline
            this.interpolateCamera(this.scrollProgress);

            // Mascots Idle Animations
            if (this.mascots.phoenix) {
                const base = this.mascots.phoenix.userData.basePos;
                this.mascots.phoenix.position.y = base.y + Math.sin(time * 2.8) * 0.2;
                this.mascots.phoenix.rotation.y = Math.sin(time * 1.2) * 0.25;
                if (this.mascots.phoenix.userData.ring) this.mascots.phoenix.userData.ring.rotation.z += 0.02;
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

            // Floating Marbles Bobbing & Relic Spin
            this.floatingMarbles.forEach((marble, idx) => {
                const base = marble.userData.basePos;
                marble.position.y = base.y + Math.sin(time * 1.8 + idx) * 0.25;
                if (marble.userData.relic) {
                    marble.userData.relic.rotation.x += 0.02;
                    marble.userData.relic.rotation.y += 0.025;
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
