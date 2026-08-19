/**
 * KAI SOFT — 3D Cosmic Marble Universe & 5 Mascots Engine
 * Powered by Three.js & GSAP
 * 
 * Features:
 * - 5 Procedural 3D Mascots (Phoenix, Piggy, Turtle, Treasure Vault, Wise Owl)
 * - 5 Crystal Glass Physical Orbs with floating 3D relics inside
 * - Cosmic Starfield & Nebula Particle Cloud
 * - Hologram Projector Beam & Interactive 3D Orbiting
 * - Full Touch & Mouse 360° Drag & Smooth Transitions
 * - Web Audio API Synthetic Chime FX
 * - Performance-aware IntersectionObserver lifecycle
 */

(function () {
    'use strict';

    // Mascot & Realm Data (Bilingual TH / EN)
    const REALMS_DATA = {
        nexus: {
            id: 'nexus',
            nameTh: 'จักรวาลรวม 5 สัตว์ศักดิ์สิทธิ์',
            nameEn: 'Five Realms Cosmic Nexus',
            titleTh: 'ศูนย์กลางจักรวาลแห่งความจำอัจฉริยะ',
            titleEn: 'The Center of AI Memory Ecosystem',
            tagTh: 'All-in-One AI Suite',
            tagEn: 'All-in-One AI Suite',
            color: 0x6366F1,
            colorHex: '#6366f1',
            descTh: 'ระบบนิเวศผู้ช่วยอัจฉริยะที่เชื่อมโยง 5 มิติของชีวิต (สมอง, เงิน, บ้าน, คลัง, เรื่องเล่า) เข้าด้วยกันอย่างสมบูรณ์แบบ ขับเคลื่อนด้วย AI, Flutter, React และ Cloud Security',
            descEn: 'A unified AI companion ecosystem connecting 5 core dimensions of life (Brain, Money, Home, Vault, Story) powered by cutting-edge AI, Flutter, React & secure cloud architecture.',
            featuresTh: [
                'เชื่อมต่อข้อมูลไร้รอยต่อระหว่าง 5 แอปพลิเคชัน',
                'สถาปัตยกรรมระดับองค์กร รองรับ Cross-platform (iOS/Android/Web)',
                'ระบบความปลอดภัยและการเข้ารหัสความทรงจำแบบ End-to-End',
                'AI Agent อัจฉริยะเข้าใจภาษาธรรมชาติและภาพถ่าย 100%'
            ],
            featuresEn: [
                'Seamless data interconnectivity across all 5 applications',
                'Enterprise-grade cross-platform architecture (iOS / Android / Web)',
                'End-to-End encrypted personal memory security',
                'Multi-modal AI Agent with 100% natural language & vision comprehension'
            ],
            tech: ['Flutter', 'React', 'Three.js', 'Supabase', 'AI Engine', 'Cloud Run']
        },
        phoenix: {
            id: 'phoenix',
            nameTh: '🔥 Fenik the Phoenix (สมอง & เควสต์)',
            nameEn: '🔥 Fenik the Phoenix (Brain & Quest)',
            titleTh: 'Buddy Brain — สมองกลส่วนเสริม & ผู้จัดการชีวิต',
            titleEn: 'Buddy Brain — External Mind & Life Organizer',
            tagTh: 'AI Brain & Task Intelligence',
            tagEn: 'AI Brain & Task Intelligence',
            color: 0xF97316,
            colorHex: '#f97316',
            descTh: 'ดักจับทุกความคิดที่กระจัดกระจาย เพียงอัดเสียงพูดระบายไอเดียยาวๆ AI จะถอดความ สรุปย่อ ดึงงานสำคัญเข้าปฏิทิน และบันทึกข้อเท็จจริงสำคัญเพื่อเรียกคืนด้วยภาษาธรรมชาติ',
            descEn: 'Capture scattered thoughts effortlessly. Simply ramble your ideas out loud; AI summarizes, extracts calendar milestones, and archives vital life facts for natural retrieval.',
            featuresTh: [
                'Voice-to-Action: พูดบ่นระบาย AI จัดตารางงานให้ทันที',
                'Smart Auto-Summary: ถอดบทเรียนและสาระสำคัญจากเสียงยาวๆ',
                'Natural Language Query: ค้นหาความทรงจำและรหัสผ่านด้วยคำพูดสบายๆ',
                'Mascot Evolution: สัตว์เลี้ยงพัฒนาตามระดับความโปรดักทีฟ'
            ],
            featuresEn: [
                'Voice-to-Action: Speak your mind; AI organizes your agenda automatically',
                'Smart Auto-Summary: Distills lengthy voice notes into actionable highlights',
                'Natural Language Query: Retrieve past memories & details via natural speech',
                'Mascot Evolution: Mascot evolves based on your productivity achievements'
            ],
            tech: ['Speech AI', 'NLP Pipeline', 'Flutter', 'Cloud Firestore', 'AES-256']
        },
        piggy: {
            id: 'piggy',
            nameTh: '🐷 Moni the Piggy (การเงิน & สแกนสลิป)',
            nameEn: '🐷 Moni the Piggy (Money & OCR)',
            titleTh: 'Buddy Money — บันทึกบัญชีอัตโนมัติด้วย AI OCR',
            titleEn: 'Buddy Money — Zero-Friction AI Financial AI',
            tagTh: 'Smart Finance & OCR Engine',
            tagEn: 'Smart Finance & OCR Engine',
            color: 0xEC4899,
            colorHex: '#ec4899',
            descTh: 'ปฏิวัติการจดบัญชีที่น่าเบื่อ เพียงส่งรูปสลิปโอนเงินหรือพูดสั้นๆ AI OCR และ NLP จะตรวจจับตัวเลข แยกหมวดหมู่ และบันทึกลงระบบทันที พร้อมบุคลิกโต้ตอบหลากหลาย',
            descEn: 'Revolutionizing personal bookkeeping. Drop bank transfer receipts or speak your spending; AI OCR instantly extracts amount, categorizes transactions, and provides lively companion interactions.',
            featuresTh: [
                'Zero-Friction Slip OCR: อ่านสลิปธนาคารไทยแม่นยำ 99% ภายใน 1 วินาที',
                'Voice Expense Logging: "กินข้าวไป 120 บาท" ลงบัญชีให้เสร็จสรรพ',
                '3D Financial Hologram Charts: วิเคราะห์รายจ่ายแบบ 3 มิติหมุนดูได้รอบทิศ',
                'Customizable Persona: เลือกบุคลิกทั้งสุภาพ เป็นกันเอง หรือ Roast Mode!'
            ],
            featuresEn: [
                'Zero-Friction Slip OCR: 99% bank slip extraction accuracy under 1 second',
                'Voice Expense Logging: Just say what you spent and AI books it instantly',
                '3D Financial Hologram Charts: Interactive 3D rotatable cash flow analytics',
                'Customizable Persona: Choose between polite, buddy, or hilarious Roast Mode!'
            ],
            tech: ['Vision OCR', 'Prompt Engineering', 'Flutter', 'Supabase', '3D Charts']
        },
        turtle: {
            id: 'turtle',
            nameTh: '🐢 Teta the Turtle (บ้าน & สุขภาพ)',
            nameEn: '🐢 Teta the Turtle (Home & Health)',
            titleTh: 'Buddy Home — ผู้ดูแลบ้าน ของใช้ & สุขภาพครอบครัว',
            titleEn: 'Buddy Home — Smart Home & Life Ecosystem',
            tagTh: 'Home & Life AI Care',
            tagEn: 'Home & Life AI Care',
            color: 0x10B981,
            colorHex: '#10b981',
            descTh: 'ระบบจัดการสิ่งของในบ้าน ถ่ายรูปตู้เย็น ชั้นวางของ หรือใบเสร็จซูเปอร์มาร์เก็ตยาวเหยียด AI จะจัดหมวดหมู่ คำนวณวันหมดอายุ เตือนรอบประกัน และดูแลอุปกรณ์ในบ้านอย่างแม่นยำ',
            descEn: 'Intelligent household pantry & warranty tracker. Snap photos of your fridge or long supermarket bills; AI auto-categorizes supplies, predicts expiry dates, and alerts maintenance cycles.',
            featuresTh: [
                'Receipt-to-Pantry: ถ่ายใบเสร็จซูเปอร์ฯ แยกสินค้าเข้าสต๊อกบ้านอัตโนมัติ',
                'Expiry & Warranty Radar: แจ้งเตือนของหมดอายุและรอบบำรุงรักษาล่วงหน้า',
                'Family Shared Space: แชร์ข้อมูลของในบ้านและรายการซื้อร่วมกับคนในครอบครัว',
                'Living Diamond House: สภาพบ้าน 3 มิติบนหลังเต่าแปรผันตามสุขภาวะของบ้าน'
            ],
            featuresEn: [
                'Receipt-to-Pantry: Scan supermarket slips into pantry inventory instantly',
                'Expiry & Warranty Radar: Proactive alerts for expiring food & warranty renewals',
                'Family Shared Space: Real-time collaborative inventory for family members',
                'Living Diamond House: 3D crystal house evolves with home health & balance'
            ],
            tech: ['Multi-modal Vision', 'Capacitor', 'React', 'Firebase Sync', 'Three.js']
        },
        vault: {
            id: 'vault',
            nameTh: '📦 Stash the Vault (คลังความทรงจำ & ตู้เซฟ)',
            nameEn: '📦 Stash the Vault (Encrypted Storage)',
            titleTh: 'Buddy Stash — ตู้เซฟความจำ & คลังของสะสมส่วนตัว',
            titleEn: 'Buddy Stash — Encrypted Relic & Memory Vault',
            tagTh: 'Encrypted Memory Vault',
            tagEn: 'Encrypted Memory Vault',
            color: 0xF59E0B,
            colorHex: '#f59e0b',
            descTh: 'คลังเก็บความลับ ข้อมูลส่วนตัว รหัส Wi-Fi ขนาดเสื้อผ้า เอกสารสำคัญ และของสะสมทรงคุณค่า ด้วยสถาปัตยกรรมเข้ารหัสระดับธนาคาร ค้นหาได้รวดเร็วทันใจผ่าน AI',
            descEn: 'Bank-grade encrypted private vault for Wi-Fi codes, personal sizing, passports, credentials, and valuable collectibles. Search and recall securely in milliseconds.',
            featuresTh: [
                'Zero-Knowledge Encryption: ข้อมูลของคุณถูกเข้ารหัสอย่างแน่นหนา',
                'Smart Stash Tagging: จัดหมวดหมู่ของสะสม เอกสาร และของมีค่าด้วย AI',
                'Instant Natural Retrieval: "รหัสกระเป๋าเดินทางเบอร์อะไร" AI ตอบได้ทันที',
                'Mystic Vault 3D: หีบสมบัติ 3 มิติเรืองแสงตอบสนองต่อการสัมผัส'
            ],
            featuresEn: [
                'Zero-Knowledge Encryption: Data is safely encrypted with zero unauthorized access',
                'Smart Stash Tagging: AI auto-tags collectibles, certificates, and credentials',
                'Instant Natural Retrieval: Ask "What was my luggage lock code?" and get answers',
                'Mystic Vault 3D: Responsive 3D glowing relic chest reacting to gestures'
            ],
            tech: ['Zero-Knowledge AES', 'WebCrypto', 'Flutter', 'Supabase Secure DB']
        },
        owl: {
            id: 'owl',
            nameTh: '🦉 Ollie the Owl (ปัญญา & นิทาน)',
            nameEn: '🦉 Ollie the Owl (Wisdom & Story)',
            titleTh: 'Buddy Story — นักเล่าเรื่อง & สมุดบันทึกบทเรียนชีวิต',
            titleEn: 'Buddy Story — Life Narrative & Wisdom Archive',
            tagTh: 'Narrative & Knowledge AI',
            tagEn: 'Narrative & Knowledge AI',
            color: 0x8B5CF6,
            colorHex: '#8b5cf6',
            descTh: 'เปลี่ยนบันทึกชีวิตประจำวัน ภาพถ่ายการเดินทาง และช่วงเวลาสำคัญให้กลายเป็นเรื่องเล่าและนิทานสุดประทับใจ พร้อมสรุปข้อคิดและบทเรียนชีวิตประจำสัปดาห์อย่างอบอุ่น',
            descEn: 'Transform daily journal logs, travel snapshots, and precious life milestones into beautifully woven narratives and family bedtime stories with thoughtful weekly insights.',
            featuresTh: [
                'AI Storyteller: ร้อยเรียงภาพถ่ายและบันทึกสั้นๆ ให้เป็นนิทานแสนอบอุ่น',
                'Life Lessons Extractor: สรุปข้อคิดและมุมมองเชิงบวกจากชีวิตประจำวัน',
                'Chronicle Book 3D: พลิกอ่านสมุดความทรงจำ 3 มิติเสมือนจริง',
                'Generative Illustrations: สร้างภาพประกอบนิทานสไตล์ภาพวาดระบายสี'
            ],
            featuresEn: [
                'AI Storyteller: Weaves daily snapshots and thoughts into touching stories',
                'Life Lessons Extractor: Distills weekly life insights and growth reflections',
                'Chronicle Book 3D: Interactive 3D page-flipping memory tome',
                'Generative Illustrations: Generates storybook illustrations with artistic flair'
            ],
            tech: ['LLM Creative Agent', 'Diffusion AI', 'Flutter', 'Edge TTS', 'Vector DB']
        }
    };

    class CosmicUniverse {
        constructor() {
            this.container = document.getElementById('universe-canvas-container');
            if (!this.container) return;

            this.currentRealm = 'nexus';
            this.isDragging = false;
            this.prevMousePos = { x: 0, y: 0 };
            this.targetRotation = { x: 0.15, y: 0 };
            this.currentRotation = { x: 0.15, y: 0 };
            this.cameraPos = { x: 0, y: 1.5, z: 22 };
            this.targetCameraPos = { x: 0, y: 1.5, z: 22 };
            this.targetLookAt = { x: 0, y: 0, z: 0 };
            this.currentLookAt = { x: 0, y: 0, z: 0 };
            this.mascots = {};
            this.orbs = [];
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2(-999, -999);
            this.hoveredObject = null;
            this.audioCtx = null;
            this.soundEnabled = true;
            this.clock = new THREE.Clock();
            this.isVisible = true;

            this.init();
        }

        init() {
            // 1. Scene, Camera, Renderer
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x060814, 0.022);

            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || 650;

            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.15;
            this.container.appendChild(this.renderer.domElement);

            // 2. Lights
            this.initLights();

            // 3. Universe Environment (Starfield, Nebula, Orbit Rings)
            this.initCosmicEnvironment();

            // 4. Mascots Group & Builders
            this.initMascots();

            // 5. Crystal Glass Orbs
            this.initCrystalOrbs();

            // 6. Hologram Projector Beam
            this.initHologramBeam();

            // 7. Event Listeners & UI Binding
            this.bindEvents();

            // 8. Render Loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);

            // 9. Initial HUD Setup
            this.updateHUD('nexus');
        }

        initLights() {
            const ambient = new THREE.AmbientLight(0xdce7ff, 1.4);
            this.scene.add(ambient);

            const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
            dirLight.position.set(12, 20, 15);
            this.scene.add(dirLight);

            const dirLightBlue = new THREE.DirectionalLight(0x38bdf8, 1.2);
            dirLightBlue.position.set(-15, -10, -10);
            this.scene.add(dirLightBlue);

            const centerGlow = new THREE.PointLight(0x818cf8, 3.5, 30);
            centerGlow.position.set(0, 0, 0);
            this.scene.add(centerGlow);
        }

        initCosmicEnvironment() {
            this.envGroup = new THREE.Group();

            // Starfield Particles
            const starCount = 1200;
            const starGeo = new THREE.BufferGeometry();
            const starPositions = new Float32Array(starCount * 3);
            const starColors = new Float32Array(starCount * 3);

            const palette = [
                new THREE.Color(0xffffff),
                new THREE.Color(0x93c5fd),
                new THREE.Color(0xa78bfa),
                new THREE.Color(0xfcd34d),
                new THREE.Color(0x6ee7b7)
            ];

            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;
                const radius = 25 + Math.random() * 45;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);

                starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                starPositions[i3 + 2] = radius * Math.cos(phi);

                const c = palette[Math.floor(Math.random() * palette.length)];
                starColors[i3] = c.r;
                starColors[i3 + 1] = c.g;
                starColors[i3 + 2] = c.b;
            }

            starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

            const starMat = new THREE.PointsMaterial({
                size: 0.22,
                vertexColors: true,
                transparent: true,
                opacity: 0.85
            });

            this.starfield = new THREE.Points(starGeo, starMat);
            this.envGroup.add(this.starfield);

            // Planetary Orbit Rings
            const ringRadii = [6.5, 9.2, 12.0];
            ringRadii.forEach((r, idx) => {
                const ringGeo = new THREE.RingGeometry(r - 0.03, r + 0.03, 128);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: idx === 0 ? 0x60a5fa : (idx === 1 ? 0xa855f7 : 0x34d399),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.25 - idx * 0.05
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2 + (idx * 0.08);
                ring.rotation.y = (idx * 0.05);
                this.envGroup.add(ring);
            });

            // Cosmic Core Glow
            const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
            const coreMat = new THREE.MeshPhysicalMaterial({
                color: 0x818cf8,
                emissive: 0x6366f1,
                emissiveIntensity: 1.5,
                roughness: 0.1,
                metalness: 0.2,
                clearcoat: 1.0,
                transmission: 0.6,
                transparent: true,
                opacity: 0.95
            });
            this.coreOrb = new THREE.Mesh(coreGeo, coreMat);
            this.envGroup.add(this.coreOrb);

            this.scene.add(this.envGroup);
        }

        initMascots() {
            this.mascotsGroup = new THREE.Group();
            const radius = 7.5;

            // 5 Mascot positions around center
            const angles = [0, 1.256, 2.513, 3.769, 5.026]; // 0, 72, 144, 216, 288 deg

            // 1. 🔥 Phoenix (Quest)
            const phoenixPos = { x: Math.cos(angles[0]) * radius, y: 0.5, z: Math.sin(angles[0]) * radius };
            this.mascots.phoenix = this.createPhoenixMesh();
            this.mascots.phoenix.position.set(phoenixPos.x, phoenixPos.y, phoenixPos.z);
            this.mascots.phoenix.userData = { id: 'phoenix', name: 'Fenik the Phoenix', basePos: phoenixPos };
            this.mascotsGroup.add(this.mascots.phoenix);

            // 2. 🐷 Piggy (Money)
            const piggyPos = { x: Math.cos(angles[1]) * radius, y: -0.2, z: Math.sin(angles[1]) * radius };
            this.mascots.piggy = this.createPiggyMesh();
            this.mascots.piggy.position.set(piggyPos.x, piggyPos.y, piggyPos.z);
            this.mascots.piggy.userData = { id: 'piggy', name: 'Moni the Piggy', basePos: piggyPos };
            this.mascotsGroup.add(this.mascots.piggy);

            // 3. 🐢 Turtle (Home)
            const turtlePos = { x: Math.cos(angles[2]) * radius, y: 0.2, z: Math.sin(angles[2]) * radius };
            this.mascots.turtle = this.createTurtleMesh();
            this.mascots.turtle.position.set(turtlePos.x, turtlePos.y, turtlePos.z);
            this.mascots.turtle.userData = { id: 'turtle', name: 'Teta the Turtle', basePos: turtlePos };
            this.mascotsGroup.add(this.mascots.turtle);

            // 4. 📦 Vault (Stash)
            const vaultPos = { x: Math.cos(angles[3]) * radius, y: -0.1, z: Math.sin(angles[3]) * radius };
            this.mascots.vault = this.createVaultMesh();
            this.mascots.vault.position.set(vaultPos.x, vaultPos.y, vaultPos.z);
            this.mascots.vault.userData = { id: 'vault', name: 'Stash the Vault', basePos: vaultPos };
            this.mascotsGroup.add(this.mascots.vault);

            // 5. 🦉 Owl (Story)
            const owlPos = { x: Math.cos(angles[4]) * radius, y: 0.4, z: Math.sin(angles[4]) * radius };
            this.mascots.owl = this.createOwlMesh();
            this.mascots.owl.position.set(owlPos.x, owlPos.y, owlPos.z);
            this.mascots.owl.userData = { id: 'owl', name: 'Ollie the Owl', basePos: owlPos };
            this.mascotsGroup.add(this.mascots.owl);

            this.scene.add(this.mascotsGroup);
        }

        createPhoenixMesh() {
            const group = new THREE.Group();

            // Golden Amber Flame Body
            const bodyMat = new THREE.MeshPhysicalMaterial({
                color: 0xF97316,
                emissive: 0xEA580C,
                emissiveIntensity: 0.4,
                roughness: 0.15,
                metalness: 0.1,
                clearcoat: 1.0,
                transmission: 0.3
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), bodyMat);
            group.add(body);

            // Cute Claymorphic Wings
            const wingGeo = new THREE.ConeGeometry(0.55, 1.4, 16);
            wingGeo.rotateZ(Math.PI / 3);
            const wingL = new THREE.Mesh(wingGeo, bodyMat);
            wingL.position.set(-1.1, 0.1, 0);
            const wingR = new THREE.Mesh(wingGeo, bodyMat);
            wingR.position.set(1.1, 0.1, 0);
            wingR.scale.set(-1, 1, 1);
            group.add(wingL, wingR);
            group.userData.wingL = wingL;
            group.userData.wingR = wingR;

            // Golden Beak
            const beakMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, roughness: 0.2, clearcoat: 0.8 });
            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.55, 16), beakMat);
            beak.rotation.x = Math.PI / 2;
            beak.position.set(0, 0.05, 1.25);
            group.add(beak);

            // Expressive Eyes
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
            const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), eyeMat);
            eyeL.scale.set(1, 1.2, 0.4);
            eyeL.position.set(-0.45, 0.35, 1.08);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.45;
            group.add(eyeL, eyeR);

            // Blush Cheeks
            const cheekMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 });
            const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), cheekMat);
            cheekL.position.set(-0.72, 0.05, 0.98);
            const cheekR = cheekL.clone();
            cheekR.position.x = 0.72;
            group.add(cheekL, cheekR);

            // Fire Constellation Ring
            const ringGeo = new THREE.RingGeometry(1.8, 2.0, 48);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2.3;
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
                emissiveIntensity: 0.3,
                roughness: 0.2,
                metalness: 0.25,
                clearcoat: 0.9
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), bodyMat);
            group.add(body);

            // Cute Ears
            const earGeo = new THREE.ConeGeometry(0.38, 0.75, 16);
            const earL = new THREE.Mesh(earGeo, bodyMat);
            earL.position.set(-0.75, 1.05, 0.1);
            earL.rotation.z = Math.PI / 5;
            const earR = new THREE.Mesh(earGeo, bodyMat);
            earR.position.set(0.75, 1.05, 0.1);
            earR.rotation.z = -Math.PI / 5;
            group.add(earL, earR);
            group.userData.earL = earL;
            group.userData.earR = earR;

            // Pig Snout & Nostrils
            const snoutMat = new THREE.MeshPhysicalMaterial({ color: 0xFDF2F8, roughness: 0.3, emissive: 0xFDF2F8, emissiveIntensity: 0.2 });
            const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.28, 24), snoutMat);
            snout.rotation.x = Math.PI / 2;
            snout.position.set(0, -0.05, 1.25);
            group.add(snout);

            const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x3f3f46 });
            const nL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), nostrilMat);
            nL.position.set(-0.16, -0.05, 1.38);
            const nR = nL.clone();
            nR.position.x = 0.16;
            group.add(nL, nR);

            // Eyes
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
            const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.1), eyeMat);
            eyeL.position.set(-0.45, 0.42, 1.15);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.45;
            group.add(eyeL, eyeR);

            // Coin Slot & Floating Gold Coin
            const coinSlot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.2), eyeMat);
            coinSlot.position.set(0, 1.23, 0);
            group.add(coinSlot);

            const coinMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.15, clearcoat: 1.0 });
            const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24), coinMat);
            coin.position.set(0, 1.7, 0);
            coin.rotation.x = Math.PI / 3;
            group.add(coin);
            group.userData.coin = coin;

            // Golden Collar
            const collarMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, metalness: 0.8, roughness: 0.2 });
            const collar = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, 16, 32), collarMat);
            collar.rotation.x = Math.PI / 2;
            collar.position.set(0, -0.85, 0);
            group.add(collar);

            return group;
        }

        createTurtleMesh() {
            const group = new THREE.Group();

            // Mint Green Body
            const skinMat = new THREE.MeshPhysicalMaterial({
                color: 0x62BE96,
                emissive: 0x34D399,
                emissiveIntensity: 0.3,
                roughness: 0.25,
                clearcoat: 0.8
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 24), skinMat);
            body.scale.set(1.15, 0.65, 1.25);
            group.add(body);

            // Cute Head & Eyes
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), skinMat);
            head.position.set(0, 0.2, 1.35);
            head.scale.set(1, 0.9, 1.1);
            group.add(head);

            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
            const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat);
            eyeL.position.set(-0.25, 0.32, 1.6);
            const eyeR = eyeL.clone();
            eyeR.position.x = 0.25;
            group.add(eyeL, eyeR);

            // 4 Flippers / Legs
            const legGeo = new THREE.SphereGeometry(0.28, 16, 16);
            legGeo.scale(1.5, 0.45, 0.85);
            const flipperFL = new THREE.Mesh(legGeo, skinMat);
            flipperFL.position.set(-1.1, -0.15, 0.8);
            flipperFL.rotation.y = Math.PI / 4;
            const flipperFR = new THREE.Mesh(legGeo, skinMat);
            flipperFR.position.set(1.1, -0.15, 0.8);
            flipperFR.rotation.y = -Math.PI / 4;
            const flipperBL = new THREE.Mesh(legGeo, skinMat);
            flipperBL.position.set(-0.95, -0.15, -0.75);
            flipperBL.rotation.y = -Math.PI / 6;
            const flipperBR = new THREE.Mesh(legGeo, skinMat);
            flipperBR.position.set(0.95, -0.15, -0.75);
            flipperBR.rotation.y = Math.PI / 6;
            group.add(flipperFL, flipperFR, flipperBL, flipperBR);
            group.userData.flippers = [flipperFL, flipperFR, flipperBL, flipperBR];

            // Crystal Emerald Diamond Shell & House on back
            const shellMat = new THREE.MeshPhysicalMaterial({
                color: 0x10B981,
                emissive: 0x059669,
                emissiveIntensity: 0.35,
                transmission: 0.75,
                roughness: 0.1,
                ior: 1.55,
                clearcoat: 1.0
            });
            const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), shellMat);
            shell.position.set(0, 0.45, -0.05);
            shell.scale.set(1.1, 0.75, 1.2);
            group.add(shell);

            // Tiny Glowing House on top of shell
            const houseMat = new THREE.MeshPhysicalMaterial({ color: 0xFDE047, emissive: 0xF59E0B, emissiveIntensity: 0.6 });
            const houseBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), houseMat);
            houseBase.position.set(0, 1.05, -0.05);
            const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.28, 4), houseMat);
            houseRoof.position.set(0, 1.3, -0.05);
            houseRoof.rotation.y = Math.PI / 4;
            group.add(houseBase, houseRoof);

            return group;
        }

        createVaultMesh() {
            const group = new THREE.Group();

            // Rich Gilded Vault Chest
            const chestMat = new THREE.MeshPhysicalMaterial({
                color: 0x78350F,
                roughness: 0.35,
                metalness: 0.4,
                clearcoat: 0.6
            });
            const goldTrimMat = new THREE.MeshPhysicalMaterial({
                color: 0xFBBF24,
                metalness: 0.9,
                roughness: 0.15,
                clearcoat: 1.0
            });
            const runeGlowMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });

            // Chest Base
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.1), chestMat);
            base.position.y = -0.2;
            group.add(base);

            // Gold Trims
            const trimBottom = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 1.15), goldTrimMat);
            trimBottom.position.y = -0.55;
            const trimMid = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.15), goldTrimMat);
            trimMid.position.y = 0.18;
            group.add(trimBottom, trimMid);

            // Curved Chest Lid
            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 24, 1, false, 0, Math.PI), chestMat);
            lid.rotation.z = Math.PI / 2;
            lid.rotation.y = Math.PI;
            lid.position.set(0, 0.22, 0);
            group.add(lid);

            // Glowing Crystal Lock Keyhole
            const lockGeo = new THREE.OctahedronGeometry(0.22, 0);
            const lock = new THREE.Mesh(lockGeo, runeGlowMat);
            lock.position.set(0, 0.1, 0.62);
            group.add(lock);
            group.userData.lock = lock;

            // Floating Magic Runes
            const runeGeo = new THREE.TetrahedronGeometry(0.12, 0);
            for (let i = 0; i < 4; i++) {
                const rune = new THREE.Mesh(runeGeo, runeGlowMat);
                rune.position.set(Math.cos(i * 1.57) * 1.2, 0.4 + Math.sin(i) * 0.3, Math.sin(i * 1.57) * 1.0);
                group.add(rune);
            }

            return group;
        }

        createOwlMesh() {
            const group = new THREE.Group();

            // Cosmic Violet Plumage Body
            const featherMat = new THREE.MeshPhysicalMaterial({
                color: 0x7C3AED,
                emissive: 0x5B21B6,
                emissiveIntensity: 0.35,
                roughness: 0.2,
                clearcoat: 0.8
            });
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 32), featherMat);
            group.add(body);

            // Breast Feather Cream
            const breastMat = new THREE.MeshPhysicalMaterial({ color: 0xEDE9FE, roughness: 0.4 });
            const breast = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), breastMat);
            breast.position.set(0, -0.25, 0.55);
            breast.scale.set(0.9, 1.1, 0.65);
            group.add(breast);

            // Wings
            const wingGeo = new THREE.ConeGeometry(0.5, 1.5, 16);
            wingGeo.rotateZ(Math.PI / 4);
            const wingL = new THREE.Mesh(wingGeo, featherMat);
            wingL.position.set(-1.05, 0, 0);
            const wingR = new THREE.Mesh(wingGeo, featherMat);
            wingR.position.set(1.05, 0, 0);
            wingR.scale.set(-1, 1, 1);
            group.add(wingL, wingR);
            group.userData.wingL = wingL;
            group.userData.wingR = wingR;

            // Large Glowing Wise Owl Eyes
            const eyeFrameMat = new THREE.MeshPhysicalMaterial({ color: 0xFBBF24, roughness: 0.2, clearcoat: 1.0 });
            const eyeFrameL = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.08, 16, 24), eyeFrameMat);
            eyeFrameL.position.set(-0.45, 0.45, 0.95);
            const eyeFrameR = eyeFrameL.clone();
            eyeFrameR.position.x = 0.45;
            group.add(eyeFrameL, eyeFrameR);

            const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
            const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), eyePupilMat);
            pupilL.position.set(-0.45, 0.45, 0.98);
            pupilL.scale.set(1, 1, 0.3);
            const pupilR = pupilL.clone();
            pupilR.position.x = 0.45;
            group.add(pupilL, pupilR);

            // Golden Beak
            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 16), eyeFrameMat);
            beak.rotation.x = Math.PI / 1.7;
            beak.position.set(0, 0.15, 1.18);
            group.add(beak);

            // Ear Feather Tufts
            const tuftGeo = new THREE.ConeGeometry(0.22, 0.6, 12);
            const tuftL = new THREE.Mesh(tuftGeo, featherMat);
            tuftL.position.set(-0.65, 1.25, 0.2);
            tuftL.rotation.z = Math.PI / 5;
            const tuftR = new THREE.Mesh(tuftGeo, featherMat);
            tuftR.position.set(0.65, 1.25, 0.2);
            tuftR.rotation.z = -Math.PI / 5;
            group.add(tuftL, tuftR);

            // Magical Floating Knowledge Tome (Book Perch)
            const bookMat = new THREE.MeshPhysicalMaterial({ color: 0x1E1B4B, roughness: 0.3 });
            const bookGold = new THREE.MeshPhysicalMaterial({ color: 0xF59E0B, metalness: 0.9, roughness: 0.15 });
            const book = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 1.2), bookMat);
            book.position.set(0, -1.2, 0);
            const bookPages = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 1.1), new THREE.MeshBasicMaterial({ color: 0xFEF3C7 }));
            bookPages.position.set(0.05, -1.2, 0);
            const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.6, 16), bookGold);
            spine.rotation.z = Math.PI / 2;
            spine.position.set(-0.75, -1.2, 0);
            group.add(book, bookPages, spine);

            return group;
        }

        initCrystalOrbs() {
            this.orbsGroup = new THREE.Group();
            const orbConfigs = [
                { id: 'phoenix', angle: 0.4, dist: 5.2, color: 0xF97316, relic: 'star' },
                { id: 'piggy', angle: 1.65, dist: 5.4, color: 0xEC4899, relic: 'coin' },
                { id: 'turtle', angle: 2.9, dist: 5.0, color: 0x10B981, relic: 'gem' },
                { id: 'vault', angle: 4.15, dist: 5.5, color: 0xF59E0B, relic: 'cube' },
                { id: 'owl', angle: 5.4, dist: 5.2, color: 0x8B5CF6, relic: 'octa' }
            ];

            orbConfigs.forEach((cfg) => {
                const orbGroup = new THREE.Group();

                // 1. Crystal Glass Shell with Transmission
                const glassMat = new THREE.MeshPhysicalMaterial({
                    color: cfg.color,
                    transmission: 0.92,
                    opacity: 1.0,
                    transparent: true,
                    roughness: 0.05,
                    ior: 1.52,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    emissive: cfg.color,
                    emissiveIntensity: 0.2
                });
                const shell = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), glassMat);
                orbGroup.add(shell);

                // 2. Glowing Inner Relic
                let relicGeo;
                if (cfg.relic === 'star') relicGeo = new THREE.IcosahedronGeometry(0.35, 0);
                else if (cfg.relic === 'coin') relicGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
                else if (cfg.relic === 'gem') relicGeo = new THREE.OctahedronGeometry(0.35, 0);
                else if (cfg.relic === 'cube') relicGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
                else relicGeo = new THREE.DodecahedronGeometry(0.35, 0);

                const relicMat = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: cfg.color,
                    emissiveIntensity: 1.2,
                    metalness: 0.8,
                    roughness: 0.1
                });
                const relicMesh = new THREE.Mesh(relicGeo, relicMat);
                orbGroup.add(relicMesh);
                orbGroup.userData.relic = relicMesh;

                // 3. Orbit Positioning
                const x = Math.cos(cfg.angle) * cfg.dist;
                const z = Math.sin(cfg.angle) * cfg.dist;
                const y = Math.sin(cfg.angle * 2) * 0.6;
                orbGroup.position.set(x, y, z);
                orbGroup.userData.baseAngle = cfg.angle;
                orbGroup.userData.dist = cfg.dist;
                orbGroup.userData.realmId = cfg.id;

                this.orbs.push(orbGroup);
                this.orbsGroup.add(orbGroup);
            });

            this.scene.add(this.orbsGroup);
        }

        initHologramBeam() {
            const beamGeo = new THREE.CylinderGeometry(3.2, 0.1, 1, 32, 16, true);
            beamGeo.rotateX(Math.PI / 2);
            beamGeo.translate(0, 0, 0.5);

            const beamMat = new THREE.MeshBasicMaterial({
                color: 0x6366F1,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            this.holoBeam = new THREE.Mesh(beamGeo, beamMat);
            this.holoBeam.visible = false;
            this.scene.add(this.holoBeam);
        }

        // Web Audio synthetic crystal chime
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
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.3);

                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.55);
            } catch (e) {
                // Audio context suppressed
            }
        }

        switchRealm(realmId) {
            if (!REALMS_DATA[realmId]) return;
            this.currentRealm = realmId;
            this.playChime(realmId === 'nexus' ? 659 : 880);

            // Update UI Tab active states
            document.querySelectorAll('.realm-nav-btn').forEach(btn => {
                const isActive = btn.getAttribute('data-realm') === realmId;
                btn.classList.toggle('active', isActive);
                if (isActive) {
                    btn.classList.add('bg-white/20', 'text-white', 'shadow-lg');
                    btn.classList.remove('text-slate-300', 'hover:bg-white/10');
                } else {
                    btn.classList.remove('bg-white/20', 'text-white', 'shadow-lg');
                    btn.classList.add('text-slate-300', 'hover:bg-white/10');
                }
            });

            // Camera & Target Position Animation via GSAP
            if (realmId === 'nexus') {
                gsap.to(this.targetCameraPos, { x: 0, y: 2.0, z: 22, duration: 1.6, ease: 'power2.inOut' });
                gsap.to(this.targetLookAt, { x: 0, y: 0, z: 0, duration: 1.6, ease: 'power2.inOut' });
                this.hideHoloBeam();
            } else {
                const mascot = this.mascots[realmId];
                if (mascot) {
                    const pos = mascot.userData.basePos;
                    // Position camera in front of the selected mascot
                    const dir = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
                    const camX = pos.x + dir.x * 6.5;
                    const camY = pos.y + 1.2;
                    const camZ = pos.z + dir.z * 6.5;

                    gsap.to(this.targetCameraPos, { x: camX, y: camY, z: camZ, duration: 1.4, ease: 'power2.inOut' });
                    gsap.to(this.targetLookAt, { x: pos.x, y: pos.y, z: pos.z, duration: 1.4, ease: 'power2.inOut' });

                    this.showHoloBeam(mascot.position, REALMS_DATA[realmId].color);
                }
            }

            this.updateHUD(realmId);
        }

        showHoloBeam(sourcePos, colorHex) {
            if (!this.holoBeam) return;
            this.holoBeam.visible = true;
            this.holoBeam.material.color.setHex(colorHex);
            this.holoBeam.position.copy(sourcePos);
            
            // Aim beam upward towards camera/HUD
            const targetPos = new THREE.Vector3().copy(this.camera.position).add(new THREE.Vector3(0, -1, -3));
            this.holoBeam.lookAt(targetPos);
            const dist = sourcePos.distanceTo(targetPos);
            this.holoBeam.scale.set(1, 1, dist);

            gsap.to(this.holoBeam.material, { opacity: 0.45, duration: 0.5 });
        }

        hideHoloBeam() {
            if (!this.holoBeam) return;
            gsap.to(this.holoBeam.material, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    this.holoBeam.visible = false;
                }
            });
        }

        updateHUD(realmId) {
            const data = REALMS_DATA[realmId];
            if (!data) return;

            const lang = document.documentElement.getAttribute('lang') || 'th';
            const nameEl = document.getElementById('universe-hud-name');
            const titleEl = document.getElementById('universe-hud-title');
            const tagEl = document.getElementById('universe-hud-tag');
            const descEl = document.getElementById('universe-hud-desc');
            const featuresEl = document.getElementById('universe-hud-features');
            const techEl = document.getElementById('universe-hud-tech');

            if (nameEl) nameEl.textContent = lang === 'th' ? data.nameTh : data.nameEn;
            if (titleEl) titleEl.textContent = lang === 'th' ? data.titleTh : data.titleEn;
            if (tagEl) {
                tagEl.textContent = lang === 'th' ? data.tagTh : data.tagEn;
                tagEl.style.borderColor = data.colorHex + '66';
                tagEl.style.backgroundColor = data.colorHex + '22';
                tagEl.style.color = data.colorHex;
            }
            if (descEl) descEl.textContent = lang === 'th' ? data.descTh : data.descEn;

            if (featuresEl) {
                const feats = lang === 'th' ? data.featuresTh : data.featuresEn;
                featuresEl.innerHTML = feats.map(f => `
                    <div class="flex items-start space-x-2 text-xs text-slate-200">
                        <i class="fa-solid fa-sparkles text-xs mt-0.5" style="color: ${data.colorHex};"></i>
                        <span>${f}</span>
                    </div>
                `).join('');
            }

            if (techEl) {
                techEl.innerHTML = data.tech.map(t => `
                    <span class="text-[10px] bg-white/10 border border-white/15 text-slate-200 px-2.5 py-0.5 rounded-full font-mono font-medium">${t}</span>
                `).join('');
            }
        }

        bindEvents() {
            // Drag & Orbit Control
            const onDown = (clientX, clientY) => {
                this.isDragging = true;
                this.prevMousePos = { x: clientX, y: clientY };
            };

            const onMove = (clientX, clientY) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

                if (this.isDragging) {
                    const dx = clientX - this.prevMousePos.x;
                    const dy = clientY - this.prevMousePos.y;

                    this.targetRotation.y += dx * 0.005;
                    this.targetRotation.x = Math.max(-0.6, Math.min(0.6, this.targetRotation.x + dy * 0.004));

                    this.prevMousePos = { x: clientX, y: clientY };
                }
            };

            const onUp = () => {
                this.isDragging = false;
            };

            // Mouse Events
            this.container.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', onUp);

            // Touch Events (Mobile Support)
            this.container.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    onDown(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    onMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchend', onUp);

            // Click / Tap Raycaster to select Mascot or Orb
            this.container.addEventListener('click', () => {
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const interactables = [];
                Object.values(this.mascots).forEach(m => interactables.push(m));
                this.orbs.forEach(o => interactables.push(o));

                const intersects = this.raycaster.intersectObjects(interactables, true);
                if (intersects.length > 0) {
                    let root = intersects[0].object;
                    while (root.parent && root.parent !== this.mascotsGroup && root.parent !== this.orbsGroup) {
                        root = root.parent;
                    }
                    const realmId = root.userData.id || root.userData.realmId;
                    if (realmId) {
                        this.switchRealm(realmId);
                    }
                }
            });

            // UI Tab Buttons
            document.querySelectorAll('.realm-nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const realmId = btn.getAttribute('data-realm');
                    if (realmId) this.switchRealm(realmId);
                });
            });

            // Sound Toggle
            const soundBtn = document.getElementById('universe-sound-toggle');
            if (soundBtn) {
                soundBtn.addEventListener('click', () => {
                    this.soundEnabled = !this.soundEnabled;
                    soundBtn.innerHTML = this.soundEnabled ?
                        '<i class="fa-solid fa-volume-high"></i>' :
                        '<i class="fa-solid fa-volume-xmark opacity-50"></i>';
                    if (this.soundEnabled) this.playChime(1046);
                });
            }

            // Window Resize
            window.addEventListener('resize', () => {
                if (!this.container) return;
                const w = this.container.clientWidth;
                const h = this.container.clientHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });

            // IntersectionObserver: Pause loop when scrolled offscreen
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        this.isVisible = entry.isIntersecting;
                    });
                }, { threshold: 0.05 });
                observer.observe(this.container);
            }

            // Language observer to update HUD text
            const langObserver = new MutationObserver(() => {
                this.updateHUD(this.currentRealm);
            });
            langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        }

        animate() {
            requestAnimationFrame(this.animate);
            if (!this.isVisible) return;

            const delta = this.clock.getDelta();
            const time = this.clock.getElapsedTime();

            // Smooth Camera Interpolation
            this.cameraPos.x += (this.targetCameraPos.x - this.cameraPos.x) * 0.06;
            this.cameraPos.y += (this.targetCameraPos.y - this.cameraPos.y) * 0.06;
            this.cameraPos.z += (this.targetCameraPos.z - this.cameraPos.z) * 0.06;
            this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);

            this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * 0.06;
            this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * 0.06;
            this.currentLookAt.z += (this.targetLookAt.z - this.currentLookAt.z) * 0.06;
            this.camera.lookAt(this.currentLookAt.x, this.currentLookAt.y, this.currentLookAt.z);

            // Universe Rotation (Idle + Drag)
            if (!this.isDragging && this.currentRealm === 'nexus') {
                this.targetRotation.y += 0.0015;
            }
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

            this.mascotsGroup.rotation.y = this.currentRotation.y;
            this.mascotsGroup.rotation.x = this.currentRotation.x;
            this.orbsGroup.rotation.y = this.currentRotation.y * 1.3;
            this.orbsGroup.rotation.x = this.currentRotation.x * 0.5;

            // Starfield idle rotation
            if (this.starfield) this.starfield.rotation.y = time * 0.015;

            // Core Orb pulsing
            if (this.coreOrb) {
                const scale = 1.0 + Math.sin(time * 2.5) * 0.06;
                this.coreOrb.scale.set(scale, scale, scale);
            }

            // Mascots subtle bobbing & animations
            if (this.mascots.phoenix) {
                this.mascots.phoenix.position.y = this.mascots.phoenix.userData.basePos.y + Math.sin(time * 3.0) * 0.2;
                if (this.mascots.phoenix.userData.ring) this.mascots.phoenix.userData.ring.rotation.z += 0.02;
            }
            if (this.mascots.piggy) {
                this.mascots.piggy.position.y = this.mascots.piggy.userData.basePos.y + Math.sin(time * 2.5 + 1) * 0.15;
                if (this.mascots.piggy.userData.coin) this.mascots.piggy.userData.coin.rotation.y += 0.03;
            }
            if (this.mascots.turtle) {
                this.mascots.turtle.position.y = this.mascots.turtle.userData.basePos.y + Math.sin(time * 1.8 + 2) * 0.18;
                this.mascots.turtle.rotation.z = Math.sin(time * 1.8) * 0.08;
            }
            if (this.mascots.vault) {
                this.mascots.vault.position.y = this.mascots.vault.userData.basePos.y + Math.sin(time * 2.0 + 3) * 0.12;
                if (this.mascots.vault.userData.lock) this.mascots.vault.userData.lock.rotation.y += 0.04;
            }
            if (this.mascots.owl) {
                this.mascots.owl.position.y = this.mascots.owl.userData.basePos.y + Math.sin(time * 2.2 + 4) * 0.16;
            }

            // Orbs Relic rotation & floating
            this.orbs.forEach((orb, i) => {
                if (orb.userData.relic) {
                    orb.userData.relic.rotation.x += 0.02;
                    orb.userData.relic.rotation.y += 0.03;
                }
            });

            this.renderer.render(this.scene, this.camera);
        }
    }

    // Expose jumpToRealm global for external card clicks
    window.jumpToUniverseRealm = function (realmId) {
        const universeSection = document.getElementById('cosmic-universe');
        if (universeSection) {
            universeSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (window._kaiUniverse) {
            window._kaiUniverse.switchRealm(realmId);
        }
    };

    // Auto-init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Load Three.js & GSAP if not already present
        const loadDependencies = () => {
            if (window.THREE && window.gsap) {
                window._kaiUniverse = new CosmicUniverse();
            } else {
                setTimeout(loadDependencies, 100);
            }
        };
        loadDependencies();
    });
})();
