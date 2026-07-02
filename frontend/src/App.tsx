import { useState } from "react";
import {Login} from "./components/Login";

// Componente temporal para el Feed de Publicaciones
function Feed() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800">📋 Feed de Publicaciones</h2>
      <p className="text-slate-500 mt-1">Próximamente conectaremos tus filtros de materias aquí...</p>
    </div>
  );
}

// Componente temporal para el Panel Administrativo
function AdminPanel() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800">🛡️ Panel de Administración</h2>
      <p className="text-slate-500 mt-1">Próximamente conectaremos la tabla de usuarios aquí...</p>
    </div>
  );
}

export default function App() {
  // Estado dinámico para manejar las pantallas de forma simple en 24 horas
  const [screen, setScreen] = useState<'login' | 'feed' | 'admin'>('login');

  const handleLogout = () => {
    localStorage.removeItem("token");
    setScreen('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Barra de Navegación superior (Oculta en el Login) */}
      {screen !== 'login' && (
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-blue-600">🎓 UTN Portal</span>
            <div className="flex gap-4">
              <button 
                onClick={() => setScreen('feed')} 
                className={`text-sm font-medium transition ${screen === 'feed' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Ver Feed
              </button>
              <button 
                onClick={() => setScreen('admin')} 
                className={`text-sm font-medium transition ${screen === 'admin' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Panel Admin
              </button>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </nav>
      )}

      {/* Renderizado Condicional de las Pantallas */}
      <main>
        {screen === 'login' && (
          <Login onLoginSuccess={(role) => setScreen(role === 'ADMIN' ? 'admin' : 'feed')} />
        )}
        {screen === 'feed' && <Feed />}
        {screen === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}
