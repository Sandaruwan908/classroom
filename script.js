/* ==========================================================================
   NEXORA | UNOVA COLLABORATION ROOM - ADVANCED ANIMATED JS ENGINE
   ========================================================================== */

// Sample Data Structures
const sampleRooms = [
  { id: 1, name: "Moratuwa AI Vision Studio", category: "Research", topic: "Deep Learning for Agricultural Drones", uni: "Univ of Moratuwa & Colombo", users: 6, max: 8, status: "Open", privacy: "Public" },
  { id: 2, name: "Peradeniya Bio-Energy Lab", category: "Thesis", topic: "Biomass Gasification Optimization", uni: "Univ of Peradeniya", users: 4, max: 6, status: "Open", privacy: "Public" },
  { id: 3, name: "Jaffna Cyber Security Hub", category: "Project", topic: "Zero-Trust Mesh Network Protocol", uni: "Univ of Jaffna & Ruhuna", users: 8, max: 8, status: "Full", privacy: "Private" },
  { id: 4, name: "SLIIT & NUS Software Hub", category: "Assignment", topic: "Distributed Microservices Architecture", uni: "SLIIT & NUS Singapore", users: 3, max: 10, status: "Open", privacy: "Public" },
  { id: 5, name: "Colombo Quantum Physics Hub", category: "Presentation", topic: "Photonic Qubit Logic Gates", uni: "University of Colombo", users: 5, max: 6, status: "Open", privacy: "Public" }
];

const sampleStudents = [
  { name: "Kavinda Fernando", uni: "University of Moratuwa", dept: "Computer Science & Eng", badge: "AI Researcher", projects: 12 },
  { name: "Dilini Senanayake", uni: "University of Colombo", dept: "Physics & Data Science", badge: "Quantum Fellow", projects: 9 },
  { name: "Tharindu Perera", uni: "University of Peradeniya", dept: "Electrical & Electronic Eng", badge: "Robotics Lead", projects: 15 },
  { name: "Nirmala Jayawardena", uni: "University of Jaffna", dept: "Information Technology", badge: "Cyber Sec Specialist", projects: 7 }
];

document.addEventListener("DOMContentLoaded", () => {
  init3DGlobalBackground();
  init3DLobbyAvatar();
  init3DMeetingStudio();
  initRouter();
  initCounterAnimations();
  renderRooms(sampleRooms);
  renderStudents(sampleStudents);
  initForms();
  initChatAndTabs();
});

/* ==========================================================================
   1. GLOBAL THREE.JS 3D BACKGROUND ENGINE
   ========================================================================== */
let globalScene, globalCamera, globalRenderer, particlesMesh, floatingGroup;

function init3DGlobalBackground() {
  const canvas = document.getElementById("bg-3d-canvas");
  if (!canvas) return;

  globalScene = new THREE.Scene();
  globalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  globalCamera.position.z = 350;

  globalRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  globalRenderer.setSize(window.innerWidth, window.innerHeight);
  globalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Moving 3D Particle Starfield
  const particleCount = 850;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const c1 = new THREE.Color("#00f0ff");
  const c2 = new THREE.Color("#8a2be2");

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1100;
    positions[i + 1] = (Math.random() - 0.5) * 1100;
    positions[i + 2] = (Math.random() - 0.5) * 1100;

    const mixed = c1.clone().lerp(c2, Math.random());
    colors[i] = mixed.r;
    colors[i + 1] = mixed.g;
    colors[i + 2] = mixed.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMaterial = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });

  particlesMesh = new THREE.Points(geometry, pMaterial);
  globalScene.add(particlesMesh);

  // 2. Floating 3D Geometric Objects (Wireframe Icosahedrons & Torus Rings)
  floatingGroup = new THREE.Group();

  const shapeGeo1 = new THREE.IcosahedronGeometry(25, 1);
  const shapeMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.25 });
  const mesh1 = new THREE.Mesh(shapeGeo1, shapeMat1);
  mesh1.position.set(-220, 120, -100);
  floatingGroup.add(mesh1);

  const shapeGeo2 = new THREE.TorusGeometry(35, 2, 16, 100);
  const shapeMat2 = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true, transparent: true, opacity: 0.3 });
  const mesh2 = new THREE.Mesh(shapeGeo2, shapeMat2);
  mesh2.position.set(240, -100, -80);
  floatingGroup.add(mesh2);

  globalScene.add(floatingGroup);

  // Mouse Move Smooth Parallax
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.0006;
    particlesMesh.rotation.x += 0.0003;

    mesh1.rotation.x += 0.005;
    mesh1.rotation.y += 0.008;

    mesh2.rotation.x -= 0.004;
    mesh2.rotation.z += 0.006;

    // Smooth Camera Lerp Parallax
    globalCamera.position.x += (mouseX - globalCamera.position.x) * 0.03;
    globalCamera.position.y += (-mouseY - globalCamera.position.y) * 0.03;

    globalRenderer.render(globalScene, globalCamera);
  }
  animate();

  window.addEventListener('resize', () => {
    globalCamera.aspect = window.innerWidth / window.innerHeight;
    globalCamera.updateProjectionMatrix();
    globalRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   2. THREE.JS 3D AVATAR PREVIEW ENGINE (LOBBY)
   ========================================================================== */
let avatarScene, avatarCamera, avatarRenderer, avatarMesh, ringMesh;

function init3DLobbyAvatar() {
  const canvas = document.getElementById("avatar-3d-canvas");
  if (!canvas) return;

  const rect = canvas.parentElement.getBoundingClientRect();

  avatarScene = new THREE.Scene();
  avatarCamera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
  avatarCamera.position.set(0, 0, 5);

  avatarRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  avatarRenderer.setSize(rect.width, rect.height);

  // 3D Holographic Avatar Geometry (Core Head + Outer Cyber Ring)
  const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    wireframe: true,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.4
  });
  avatarMesh = new THREE.Mesh(headGeo, headMat);
  avatarScene.add(avatarMesh);

  const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
  ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  avatarScene.add(ringMesh);

  // Light
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  avatarScene.add(light);

  function animateAvatar() {
    requestAnimationFrame(animateAvatar);
    avatarMesh.rotation.y += 0.01;
    ringMesh.rotation.z += 0.015;
    avatarRenderer.render(avatarScene, avatarCamera);
  }
  animateAvatar();

  document.getElementById("btn-rotate-avatar")?.addEventListener("click", () => {
    avatarMesh.rotation.y += Math.PI / 2;
  });

  document.getElementById("btn-color-avatar")?.addEventListener("click", () => {
    const colors = [0x00f0ff, 0x8a2be2, 0xff007f, 0x3a86ff];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    avatarMesh.material.color.setHex(randColor);
    avatarMesh.material.emissive.setHex(randColor);
  });
}

/* ==========================================================================
   3. THREE.JS 3D INTERACTIVE MEETING STUDIO
   ========================================================================== */
function init3DMeetingStudio() {
  const container = document.getElementById("stage-3d-view");
  if (!container) return;

  const meetingScene = new THREE.Scene();
  const meetingCamera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  meetingCamera.position.set(0, 6, 11);
  meetingCamera.lookAt(0, 0, 0);

  const meetingRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  meetingRenderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(meetingRenderer.domElement);

  // Central Holographic Table
  const tableGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.3, 32);
  const tableMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
  const tableMesh = new THREE.Mesh(tableGeo, tableMat);
  meetingScene.add(tableMesh);

  // Floating Central Hologram Object
  const holoGeo = new THREE.DodecahedronGeometry(1.2, 0);
  const holoMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true });
  const holoMesh = new THREE.Mesh(holoGeo, holoMat);
  holoMesh.position.y = 2;
  meetingScene.add(holoMesh);

  // Seated Student Avatars Around Table
  const avatarGroup = new THREE.Group();
  const avatarCount = 5;

  for (let i = 0; i < avatarCount; i++) {
    const angle = (i / avatarCount) * Math.PI * 2;
    const x = Math.cos(angle) * 5.2;
    const z = Math.sin(angle) * 5.2;

    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x8a2be2 : 0x00f0ff });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(x, 1.2, z);
    avatarGroup.add(headMesh);
  }

  meetingScene.add(avatarGroup);

  // Mouse Drag Camera Interaction
  let isDragging = false;
  let previousMouseX = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    meetingScene.rotation.y += deltaX * 0.005;
    previousMouseX = e.clientX;
  });

  function renderMeeting() {
    requestAnimationFrame(renderMeeting);
    tableMesh.rotation.y += 0.002;
    holoMesh.rotation.x += 0.01;
    holoMesh.rotation.y += 0.01;
    avatarGroup.rotation.y += 0.0005;
    meetingRenderer.render(meetingScene, meetingCamera);
  }
  renderMeeting();
}

/* ==========================================================================
   4. SPA ROUTER & ANIMATED COUNTERS
   ========================================================================== */
function initRouter() {
  const navItems = document.querySelectorAll("[data-page]");
  const actionRoutes = document.querySelectorAll(".action-route");

  function switchPage(targetPageId) {
    document.querySelectorAll(".page-view").forEach(page => page.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

    const targetView = document.getElementById(targetPageId);
    if (targetView) targetView.classList.add("active");

    const activeNav = document.querySelector(`.nav-item[data-page="${targetPageId}"]`);
    if (activeNav) activeNav.classList.add("active");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage(item.getAttribute("data-page"));
    });
  });

  actionRoutes.forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.getAttribute("data-target")));
  });
}

function initCounterAnimations() {
  const statElements = document.querySelectorAll(".stat-num");
  statElements.forEach(el => {
    const target = parseInt(el.getAttribute("data-count"));
    let count = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        el.innerText = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.innerText = count.toLocaleString();
      }
    }, 30);
  });
}

/* ==========================================================================
   5. ROOM RENDERING, FORMS & CHAT
   ========================================================================== */
function renderRooms(rooms) {
  const container = document.getElementById("rooms-cards-container");
  const featuredContainer = document.getElementById("featured-rooms-container");
  const portalsContainer = document.getElementById("lobby-portals-list");

  if (container) {
    container.innerHTML = rooms.map(r => `
      <div class="glass-card room-card">
        <div class="room-card-head">
          <span class="badge-tag">${r.category}</span>
          <span class="status-badge ${r.status === 'Full' ? 'full' : ''}">${r.status} (${r.users}/${r.max})</span>
        </div>
        <h3>${r.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin: 8px 0;">${r.topic}</p>
        <div style="font-size: 0.8rem; color: var(--cyan); margin-bottom: 16px;"><i class="fa-solid fa-graduation-cap"></i> ${r.uni}</div>
        <button class="btn-primary btn-block action-route" onclick="enterRoom('${r.name}', '${r.topic}')"><i class="fa-solid fa-right-to-bracket"></i> Join Room</button>
      </div>
    `).join('');
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = rooms.slice(0, 3).map(r => `
      <div class="glass-card portal-card" onclick="enterRoom('${r.name}', '${r.topic}')">
        <span class="badge-tag">${r.category}</span>
        <h4 style="margin-top: 8px;">${r.name}</h4>
        <small style="color: var(--cyan);">${r.uni}</small>
      </div>
    `).join('');
  }

  if (portalsContainer) {
    portalsContainer.innerHTML = rooms.map(r => `
      <div class="portal-card float-slow" onclick="enterRoom('${r.name}', '${r.topic}')">
        <h4>${r.name}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">${r.topic}</p>
        <small style="color: var(--cyan);"><i class="fa-solid fa-users"></i> ${r.users}/${r.max} Online</small>
      </div>
    `).join('');
  }

  // Search and Category Filter Handler
  const filterBtns = document.querySelectorAll(".cat-btn");
  const searchInput = document.getElementById("room-search-input");

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const activeCatBtn = document.querySelector(".cat-btn.active");
    const activeCat = activeCatBtn ? activeCatBtn.getAttribute("data-cat") : "all";

    const filtered = sampleRooms.filter(r => {
      const matchCat = activeCat === "all" || r.category === activeCat;
      const matchQuery = r.name.toLowerCase().includes(query) || r.topic.toLowerCase().includes(query) || r.uni.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    renderRoomsListOnly(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
}

function renderRoomsListOnly(rooms) {
  const container = document.getElementById("rooms-cards-container");
  if (!container) return;
  container.innerHTML = rooms.map(r => `
    <div class="glass-card room-card">
      <div class="room-card-head">
        <span class="badge-tag">${r.category}</span>
        <span class="status-badge ${r.status === 'Full' ? 'full' : ''}">${r.status} (${r.users}/${r.max})</span>
      </div>
      <h3>${r.name}</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin: 8px 0;">${r.topic}</p>
      <div style="font-size: 0.8rem; color: var(--cyan); margin-bottom: 16px;"><i class="fa-solid fa-graduation-cap"></i> ${r.uni}</div>
      <button class="btn-primary btn-block action-route" onclick="enterRoom('${r.name}', '${r.topic}')"><i class="fa-solid fa-right-to-bracket"></i> Join Room</button>
    </div>
  `).join('');
}

function enterRoom(name, topic) {
  document.getElementById("current-room-title").innerText = name;
  document.getElementById("current-room-topic").innerText = "Topic: " + topic;
  
  document.querySelectorAll(".page-view").forEach(p => p.classList.remove("active"));
  document.getElementById("page-meeting").classList.add("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStudents(students) {
  const container = document.getElementById("students-cards-container");
  const rosterContainer = document.getElementById("meeting-roster-list");

  if (container) {
    container.innerHTML = students.map(s => `
      <div class="glass-card student-card float-slow">
        <div class="student-avatar-circle"><i class="fa-solid fa-user-graduate"></i></div>
        <h3>${s.name}</h3>
        <span class="uni-badge">${s.uni}</span>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${s.dept}</p>
        <div style="margin-top: 12px;"><span class="badge-tag">${s.badge}</span></div>
      </div>
    `).join('');
  }

  if (rosterContainer) {
    rosterContainer.innerHTML = students.map(s => `
      <li class="roster-item">
        <i class="fa-solid fa-circle pulse-dot" style="font-size: 0.6rem;"></i>
        <div>
          <strong style="font-size: 0.85rem;">${s.name}</strong>
          <small style="display:block; color: var(--text-muted); font-size: 0.75rem;">${s.uni}</small>
        </div>
      </li>
    `).join('');
  }
}

function initForms() {
  const form = document.getElementById("create-room-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("room-name").value;
    const topic = document.getElementById("room-topic").value;
    
    form.classList.add("hidden");
    document.getElementById("create-success-panel").classList.remove("hidden");
    
    sampleRooms.unshift({ id: Date.now(), name, topic, category: "Project", uni: "Univ of Moratuwa & Colombo", users: 1, max: 8, status: "Open", privacy: "Public" });
    renderRooms(sampleRooms);
  });

  document.getElementById("btn-copy-code")?.addEventListener("click", () => {
    const code = document.getElementById("created-invite-code").innerText;
    navigator.clipboard.writeText(code);
    alert("Invitation Code copied to clipboard: " + code);
  });
}

function initChatAndTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");
    });
  });

  const btn = document.getElementById("btn-send-chat");
  const input = document.getElementById("chat-input");
  const msgBox = document.getElementById("chat-messages-box");

  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const msgEl = document.createElement("div");
    msgEl.className = "msg";
    msgEl.innerHTML = `<strong>You (Avatar):</strong> ${text}`;
    msgBox.appendChild(msgEl);
    input.value = "";
    msgBox.scrollTop = msgBox.scrollHeight;
  });
}
