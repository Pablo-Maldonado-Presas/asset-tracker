# 📦 Asset Tracker - Prototipo Funcional y Diagramas UML

Este repositorio contiene el desarrollo del **prototipo funcional** de la plataforma web "Asset Tracker" y los **diagramas UML** que modelan su arquitectura y diseño de base de datos.  

---

## 📌 Contenido del Repositorio  

### 🔹 Diagramas UML  
Los diagramas han sido diseñados en **PlantUML** y se organizan en dos enfoques:  

#### 1️⃣ Solución con Base de Datos Relacional  
- **Diagrama de Componentes**  
- **Diagrama Físico**  
- **Diagrama Entidad-Relación**  

#### 2️⃣ Solución Híbrida (Base Relacional + NoSQL)  
- **Diagrama de Componentes**  
- **Diagrama Entidad-Relación** (para la base de datos documental)  

### 🔹 Prototipo Funcional (Next.js)  
El prototipo es una simulación de la plataforma web, desarrollado en **Next.js** con **React.js** y **Material UI**, pero **sin conexión a base de datos**. Se han simulado tiempos de carga para cada vista.  

#### 📁 Vistas Implementadas  
1. **Login y recuperación de cuenta**  
2. **Dashboard**  
3. **Administración**  
   - Pallets  
   - Etiquetas  
   - Sensores  
   - Antenas  
4. **Trazabilidad**  
5. **Gestión de usuarios**  
6. **Historial de transacciones**  
7. **Ayuda**  
   - Manual  
   - Soporte *(no disponible)*  
   - FAQ *(no disponible)*  

---

## 🚀 Instalación del Prototipo  

### 1️⃣ **Instalar Node.js**  
Descargar e instalar desde [nodejs.org](https://nodejs.org/).  

### 2️⃣ **Configuración en Windows** *(Opcional, si hay restricciones de ejecución)*  
Abrir **PowerShell** en modo administrador y ejecutar:  
```powershell
Set-ExecutionPolicy Unrestricted
```

### 3️⃣ **Ingresar a la carpeta del prototipo**
```cli
cd prototipo
```

### 4️⃣ **Instalar dependencias**
```cli
npm install
```

### 5️⃣ **Ejecutar el servidor de desarrollo**
```cli
npm run dev
```

### 6️⃣ **Acceder a la aplicación**
Abrir un navegador y entrar a:
http://localhost:3000

### **LOGIN**
Acceder a la plataforma con la siguiente credencial:
- Usuario: admin
- Contraseña: admin

---
🛠️ **Tecnologías Utilizadas**
- Next.js (React.js)
- Material UI
- PlantUML (para diagramas)
