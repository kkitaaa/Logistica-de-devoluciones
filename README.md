INSTRUCCIONES DE EJECUCIÓN
1. Base de datos (MySQL)

Primero asegurarse de que MySQL esté corriendo (XAMPP o servicio activo).

Ejecutar el script que está en bd.txt

2. Backend (Node + Express)

Entrar a la carpeta:

cd backend

Instalar dependencias:

npm install

Levantar el servidor:

npm run dev

Backend debería quedar corriendo en:
http://localhost:3000

3. Frontend (React + Vite)

Entrar a frontend:

cd frontend/PMN

Instalar dependencias:

npm install

Levantar React:

npm run dev

Frontend queda en:
http://localhost:5173

6. Orden correcto de ejecución (IMPORTANTE)

Siempre así:

MySQL / XAMPP
Backend (npm run dev)
Frontend (npm run dev)
