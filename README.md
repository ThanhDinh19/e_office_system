# E-Office

## 1. Database Setup

### 1.1 Tạo database

Đăng nhập MySQL và chạy:
```sql
CREATE DATABASE eoffice
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eoffice;
```
>  Bắt buộc phải tạo database trước khi restore dữ liệu.
---

### 1.2 Restore database
Thư mục backup:
```
DatabaseBackup/
```
Restore các file `.sql` vào database `eoffice`.
---

##  2. Backend Setup
```bash
cd backend
npm install
```
### 2.1 Environment Variables
Tạo file `.env` trong thư mục `backend`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
PORT=5000
DB_NAME=eoffice
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=eoffice_secret
DB_DIALECT=mysql
DB_LOGGING=false
```
---
### 2.2 Run Backend
```bash
node src/server.js
```
Backend mặc định chạy tại:
```
http://localhost:5000
```
---
## 🖥️ 3. Frontend Setup
Mở **terminal mới**:
```bash
cd frontend
npm install
npm start
```
Frontend chạy tại:
```
http://localhost:3000
```
(Port có thể thay đổi tùy cấu hình)
---
## 🔗 4. Project Structure
```
E-Office/
├── backend/        # Node.js backend
│   ├── src/
│   └── package.json
├── frontend/       # React frontend
│   ├── src/
│   └── package.json
├── DatabaseBackup/ # MySQL backup files
└── README.md
```
---

## 5. Verify
* Backend kết nối MySQL không báo lỗi
* Frontend load được giao diện
* API hoạt động (login, project, members...)
---

## Troubleshooting

| Issue                        | Possible Cause                     |
| ---------------------------- | ---------------------------------- |
| `Unknown database 'eoffice'` | Database chưa được tạo             |
| `Access denied for user`     | Sai user / password MySQL          |
| API không gọi được           | Backend chưa chạy hoặc sai port    |
| Frontend trắng               | Backend chưa chạy hoặc sai API URL |
---

##  Tech Stack
* **Backend:** Node.js, Express
* **Frontend:** React, npm
* **Database:** MySQL 
---

  
  
