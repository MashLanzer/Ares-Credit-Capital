// Configuración de Firebase (la misma que en tu script.js )
const firebaseConfig = {
  apiKey: "AIzaSyA81sLNp_2zdFtENWnVnKlyJxmQsuktKOY",
  authDomain: "ares-credit-capital.firebaseapp.com",
  projectId: "ares-credit-capital",
  storageBucket: "ares-credit-capital.firebasestorage.app",
  messagingSenderId: "994953754017",
  appId: "1:994953754017:web:c258cbded1145ae116c7e0",
  measurementId: "G-XHT7XVHJXR"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const remoteConfig = firebase.remoteConfig();

// Vistas del DOM
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const submissionsBody = document.getElementById('submissions-body');

// --- LÓGICA PRINCIPAL ---

// 1. Configurar Remote Config
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // Cache de 1 hora
remoteConfig.defaultConfig = {
    'admin_emails': '{"emails":[]}' // Valor por defecto seguro
};

// 2. Escuchar cambios de autenticación
auth.onAuthStateChanged(async user => {
    if (user) {
        // Usuario ha iniciado sesión
        await checkAdminStatus(user);
    } else {
        // Usuario no ha iniciado sesión
        showLoginView();
    }
});

// 3. Event Listeners para los botones
loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error("Error durante el inicio de sesión:", error);
        alert("No se pudo iniciar sesión. Por favor, intenta de nuevo.");
    });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// --- FUNCIONES AUXILIARES ---

async function checkAdminStatus(user) {
    try {
        await remoteConfig.fetchAndActivate();
        const adminEmailsConfig = remoteConfig.getString('admin_emails');
        const adminEmails = JSON.parse(adminEmailsConfig).emails;

        if (adminEmails.includes(user.email)) {
            // ¡Es un administrador!
            showDashboardView();
            loadSubmissions();
        } else {
            // No es un administrador
            alert("Acceso denegado. Esta cuenta no tiene permisos de administrador.");
            auth.signOut();
        }
    } catch (error) {
        console.error("Error al verificar el estado de administrador:", error);
        alert("No se pudo verificar los permisos. Intenta de nuevo.");
        auth.signOut();
    }
}

function loadSubmissions() {
    db.collection('submissions').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'N/A';
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${escapeHtml(data.name)}</td>
                    <td>${escapeHtml(data.email)}</td>
                    <td>${escapeHtml(data.phone || '-')}</td>
                    <td>${escapeHtml(data.service)}</td>
                    <td>${escapeHtml(data.message || '-')}</td>
                </tr>
            `;
        });
        submissionsBody.innerHTML = html;
    }, error => {
        console.error("Error al cargar los envíos:", error);
        submissionsBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos.</td></tr>';
    });
}

function showLoginView() {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
}

function showDashboardView() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
}

// Función para prevenir ataques XSS
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
