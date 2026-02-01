# 🚀 Production Deployment Guide: VPS Dashboard

คู่มือการ Deploy โปรเจค VPS Dashboard ขึ้น VPS เครื่องเดียวกันกับ AI Content Creator

---

## 🏗️ โครงสร้างการรันพอร์ต

| Project | Port (Internal) | Port (External) |
|---------|-----------------|-----------------|
| **AI Content Creator** | 3000 | 3000 |
| **VPS Dashboard** | 3000 | **3001** |

---

## 1. การตั้งค่าก่อน Deploy ครั้งแรก

### 1.1 SSH เข้า VPS
```bash
ssh -p 2222 acuser01@203.151.166.65
```

### 1.2 สร้าง Directory
```bash
sudo mkdir -p /opt/app/vps-dashboard-nextjs
sudo chown -R $USER:$USER /opt/app/vps-dashboard-nextjs
```

---

## 2. การตั้งค่า GitHub Secrets

ตรวจสอบว่าใน GitHub Repository มี Secrets เหล่านี้ครบถ้วน:

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | `203.151.166.65` |
| `VPS_PORT` | `2222` |
| `VPS_USERNAME` | `acuser01` |
| `VPS_PASSWORD` | (SSH Password สำหรับ Deploy) |
| `VPS_SSH_HOST` | `203.151.166.65` |
| `VPS_SSH_PORT` | `2222` |
| `VPS_SSH_USER` | `acuser01` |
| `VPS_SSH_PASS` | (SSH Password สำหรับดึงข้อมูล Stats) |

---

## 3. วิธี Deploy

เพียงแค่ Push code ไปยัง branch `release`:

```bash
git checkout -b release
git add .
git commit -m "🚀 Initial production release"
git push origin release
```

ระบบจะทำการ Build และ Deploy ไปยังพอร์ต **3001** ให้โดยอัตโนมัติครับ

---

## 4. การจัดการ Services

### ดู Logs
```bash
cd /opt/app/vps-dashboard-nextjs
docker compose -f docker-compose.production.yml logs -f
```

### Restart
```bash
docker compose -f docker-compose.production.yml restart
```

### Stop
```bash
docker compose -f docker-compose.production.yml down
```
