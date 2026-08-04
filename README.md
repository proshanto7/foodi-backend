# 🍔 Foodi Backend — Postman Testing Guide

এই README টা তৈরি হয়েছে **Postman দিয়ে Foodi Backend API test করার জন্য**। এখানে চারটা module আছে: **Banner, Category, Dish, Service** — প্রতিটার endpoint, request format, sample response সব দেওয়া আছে।

---

## ⚙️ 1. প্রজেক্ট সেটআপ (আগে করে নাও)

### `.env` ফাইল

`.env.sample` কপি করে `.env` বানাও, তারপর মান বসাও:

```env
PORT = 3000
BASE_URL = /api/v1
DB_HOST = your_mongodb_connection_string
AUTH_EMAIL = your_email@example.com
AUTH_PASSWORD = your_email_app_password
PRIVATE_KEY = your_jwt_secret_key
UPLOADS_BASE_URL = localhost:3000/uploads
```

### Install ও Run

```bash
npm install
npm start
```

Server চালু হলে টার্মিনালে দেখবে:
```
database connected
Example app listening on port 3000
```

### 🌐 Base URL

```
http://localhost:3000/api/v1
```

> `.env` এ `PORT` বা `BASE_URL` পাল্টালে এই base URL ও সেই অনুযায়ী পাল্টে যাবে।

---

## 🖼️ Uploaded ছবি দেখার নিয়ম

সব uploaded ইমেজ static সার্ভ হয় এই path থেকে:

```
http://localhost:3000/uploads/<filename>
```

---

## 🔐 Auth নিয়ে নোট

`middleware/authorize.js` ও `authorizeRole.js` ফাইল প্রজেক্টে আছে, কিন্তু **কোনো route এ এখনো লাগানো হয়নি** — তাই নিচের সব endpoint বর্তমানে **public**, Postman এ কোনো token/header ছাড়াই কল করা যাবে। পরে auth যোগ হলে `Authorization: Bearer <token>` header লাগবে (অথবা `accessToken` কুকি)।

---

## 1️⃣ Banner API

Base path: `/api/v1/banner`

| # | Method | Endpoint | কাজ |
|---|--------|----------|-----|
| 1 | POST   | `/banner`      | নতুন banner তৈরি |
| 2 | GET    | `/banner`      | সব banner লিস্ট |
| 3 | GET    | `/banner/:id`  | একটা banner |
| 4 | PATCH  | `/banner/:id`  | banner আপডেট |
| 5 | DELETE | `/banner/:id`  | banner ডিলিট |

### POST `/banner` — Create
**Body → form-data**

| Key | Type | Required | Note |
|---|---|---|---|
| `banner-image` | File | ✅ | jpg/jpeg/png/webp, max 2MB |
| `title` | Text | ✅ | — |
| `highlightedWord` | Text | ❌ | — |
| `description` | Text | ✅ | — |
| `isActive` | Text | ❌ | `true` / `false` |

**Response `200`**
```json
{
  "success": true,
  "message": "banner added successfully",
  "data": null
}
```

**Missing field → `400`**
```json
{
  "success": false,
  "message": "title and banner image are required"
}
```

### GET `/banner`
```json
{
  "success": true,
  "message": "banner fetched successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "bannerImage": "localhost:3000/uploads/banner-image-...png",
      "title": "Dive into Delights Of Delectable Food",
      "highlightedWord": "Food",
      "description": "Where Each Plate Weaves a Story...",
      "isActive": true
    }
  ]
}
```

### PATCH `/banner/:id` — Update
Body: form-data, একই fields, সব optional (যেগুলো পাঠাবে সেগুলোই আপডেট হবে)। নতুন `banner-image` দিলে পুরনোটা auto-delete হয়ে যাবে।

### DELETE `/banner/:id`
Banner ও তার সাথে থাকা image ফাইল দুটোই মুছে যাবে।

---

## 2️⃣ Category API

Base path: `/api/v1/category`

| # | Method | Endpoint | কাজ |
|---|--------|----------|-----|
| 1 | POST   | `/category`      | নতুন category তৈরি |
| 2 | GET    | `/category`      | সব category (sortOrder অনুযায়ী) |
| 3 | GET    | `/category/:id`  | একটা category |
| 4 | PATCH  | `/category/:id`  | category আপডেট |
| 5 | DELETE | `/category/:id`  | category ডিলিট |

### POST `/category` — Create
**Body → form-data**

| Key | Type | Required | Note |
|---|---|---|---|
| `category-image` | File | ✅ | jpg/jpeg/png/webp, max 2MB |
| `name` | Text | ✅ | e.g. `Main Dish` |
| `itemCount` | Text | ❌ | সংখ্যা, e.g. `86` |
| `sortOrder` | Text | ❌ | সংখ্যা, card এর ক্রম |
| `isActive` | Text | ❌ | `true` / `false` |

**Response `200`**
```json
{
  "success": true,
  "message": "category added successfully",
  "data": null
}
```

### GET `/category`
`sortOrder` অনুযায়ী (ছোট → বড়), তারপর নতুন থেকে পুরাতন সাজানো থাকে।

```json
{
  "success": true,
  "message": "category fetched successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0e",
      "categoryImage": "localhost:3000/uploads/category-image-...webp",
      "name": "Main Dish",
      "itemCount": 86,
      "sortOrder": 1,
      "isActive": true
    }
  ]
}
```

### PATCH `/category/:id` ও DELETE `/category/:id`
Banner এর মতোই pattern — partial update, এবং delete করলে image ফাইলও মুছে যায়।

---

## 3️⃣ Dish API

Base path: `/api/v1/dish`

| # | Method | Endpoint | কাজ |
|---|--------|----------|-----|
| 1 | POST   | `/dish`             | নতুন dish তৈরি |
| 2 | GET    | `/dish`             | সব active dish (category filter সহ) |
| 3 | GET    | `/dish/:id`         | একটা dish (category populated) |
| 4 | PATCH  | `/dish/:id`         | dish আপডেট |
| 5 | DELETE | `/dish/:id`         | dish ডিলিট |
| 6 | PATCH  | `/dish/:id/favorite`| ❤️ favorite toggle |

### POST `/dish` — Create
**Body → form-data**

| Key | Type | Required | Note |
|---|---|---|---|
| `dish-image` | File | ✅ | jpg/jpeg/png/webp, max 2MB |
| `name` | Text | ✅ | e.g. `Fattoush salad` |
| `description` | Text | ❌ | e.g. `Description of the item` |
| `price` | Text | ✅ | সংখ্যা, e.g. `24` |
| `rating` | Text | ❌ | 0–5, e.g. `4.9` |
| `category` | Text | ✅ | **Category এর `_id`** (আগে একটা category বানিয়ে সেই `_id` বসাও) |
| `isFavorite` | Text | ❌ | `true` / `false` |
| `sortOrder` | Text | ❌ | সংখ্যা |
| `isActive` | Text | ❌ | `true` / `false` |

> ⚠️ **আগে category তৈরি করে নাও**, কারণ `category` field এ valid `ObjectId` লাগবে। Category API দিয়ে একটা বানিয়ে GET `/category` করে `_id` কপি করো।

**Response `201`**
```json
{
  "success": true,
  "message": "dish added successfully",
  "data": null
}
```

**Missing field → `400`**
```json
{
  "success": false,
  "message": "name, price, category and dish image are required"
}
```

### GET `/dish` — সব dish
শুধু `isActive: true` থাকা dish গুলো আসবে, `category` name সহ populate করা থাকে।

Optional query filter:
```
GET /dish?category=<categoryId>
```

**Response**
```json
{
  "success": true,
  "message": "dishes fetched successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0f",
      "dishImage": "localhost:3000/uploads/dish-image-...png",
      "name": "Fattoush salad",
      "description": "Description of the item",
      "price": 24,
      "rating": 4.9,
      "isFavorite": false,
      "sortOrder": 1,
      "category": { "_id": "665f1a2b3c4d5e6f7a8b9c0e", "name": "Main Dish" }
    }
  ]
}
```

### GET `/dish/:id`
Single dish, category populated সহ।

### PATCH `/dish/:id` — Update
Body form-data, সব field optional, একই key গুলো addDish এর মতো। নতুন `dish-image` দিলে পুরনোটা মুছে যায়।

### DELETE `/dish/:id`
Dish ও তার image ফাইল ডিলিট হয়ে যাবে।

### PATCH `/dish/:id/favorite` — ❤️ Favorite Toggle
Body কিছু লাগবে না — কল করলেই `isFavorite` true ↔ false টগল হবে (কার্ডের হার্ট আইকনের জন্য বানানো)।

**Response `200`**
```json
{
  "success": true,
  "message": "favorite status updated",
  "data": { "isFavorite": true }
}
```

---

## 4️⃣ Service API

Base path: `/api/v1/service`

| # | Method | Endpoint | কাজ |
|---|--------|----------|-----|
| 1 | POST   | `/service`      | নতুন service তৈরি |
| 2 | GET    | `/service`      | সব active service |
| 3 | GET    | `/service/:id`  | একটা service |
| 4 | PATCH  | `/service/:id`  | service আপডেট |
| 5 | DELETE | `/service/:id`  | service ডিলিট |

### POST `/service` — Create
**Body → form-data**

| Key | Type | Required | Note |
|---|---|---|---|
| `service-icon` | File | ✅ | jpg/jpeg/png/webp/svg, **max 1MB** (icon বলে ছোট রাখা) |
| `title` | Text | ✅ | — |
| `description` | Text | ✅ | — |
| `sortOrder` | Text | ❌ | সংখ্যা |
| `isActive` | Text | ❌ | `true` / `false` |

**Response `201`**
```json
{
  "success": true,
  "message": "service added successfully",
  "data": null
}
```

### GET `/service`
শুধু active service গুলো, sortOrder অনুযায়ী সাজানো।

### PATCH `/service/:id` ও DELETE `/service/:id`
বাকি module গুলোর মতোই — partial update, delete এ icon ফাইলও মুছে যায়।

---

## 🧪 Postman এ Testing Flow (Recommended Order)

1. **Category তৈরি করো** → `POST /category` → response থেকে `_id` কপি রাখো
2. **Service তৈরি করো** → `POST /service` (independent, category লাগে না)
3. **Banner তৈরি করো** → `POST /banner` (independent)
4. **Dish তৈরি করো** → `POST /dish`, `category` field এ ধাপ ১ এর `_id` বসাও
5. প্রতিটার **GET (all)** ও **GET (:id)** কল করে ডেটা যাচাই করো
6. **PATCH** দিয়ে দুই-একটা field আপডেট করে দেখো (partial update কাজ করছে কিনা)
7. Dish এর ক্ষেত্রে `PATCH /dish/:id/favorite` আলাদাভাবে টেস্ট করো
8. শেষে **DELETE** করে দেখো uploads folder থেকে ফাইলও মুছে যাচ্ছে কিনা

---

## 📌 File Upload করার নিয়ম (Postman)

সব উপরের POST/PATCH endpoint এ:

1. Body ট্যাব → **form-data** সিলেক্ট করো (raw/JSON না)
2. Image/icon field এর Key বসিয়ে ডানপাশের dropdown থেকে Type **"File"** সিলেক্ট করো
3. "Select Files" এ ক্লিক করে file বেছে নাও
4. বাকি fields Text type এই থাকবে
5. `Content-Type` header ম্যানুয়ালি সেট করবে না — Postman নিজেই boundary সহ multipart header বসিয়ে দেয়

**⚠️ Field name ভুল হলে চলবে না, exact match লাগবে:**
- Banner → `banner-image`
- Category → `category-image`
- Dish → `dish-image`
- Service → `service-icon`

---

## 🗂️ Project Structure

```
├── config/
│   └── db.js                  # MongoDB connection
├── controller/
│   ├── banner.controller.js
│   ├── category.controller.js
│   ├── dish.controller.js
│   └── service.controller.js
├── model/
│   ├── banner.model.js
│   ├── category.model.js
│   ├── dish.model.js
│   └── service.model.js
├── route/
│   ├── index.js                # mounts BASE_URL -> /api
│   └── api/
│       ├── index.js            # mounts /banner /category /dish /service
│       ├── banner.js
│       ├── category.js
│       ├── dish.js
│       └── service.js
├── helpers/
│   ├── uploadsFile.js          # multer config
│   ├── deleteHelper.js         # delete uploaded file
│   ├── fileUpdateHelper.js     # replace old file with new one
│   ├── otpGenerate.js          # (auth feature, not wired yet)
│   └── sendEmail.js            # (auth feature, not wired yet)
├── middleware/
│   ├── authorize.js            # JWT check (not attached to routes yet)
│   └── authorizeRole.js        # role check (not attached to routes yet)
├── utils/
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   ├── createSlug.js
│   └── globalErrorHandler.js
├── uploads/                    # uploaded files served at /uploads
└── index.js                    # app entry point
```

---

## ⚠️ বর্তমান Status

- 🔓 সব ৪টা module এখন **public** (কোনো auth middleware attach করা নেই)
- 🔒 Auth সিস্টেম (register/login/OTP) এখনো তৈরি হয়নি — শুধু middleware ফাইল আছে, ভবিষ্যতে সেগুলো `authorize` / `authorizeRole` দিয়ে protect করা হবে
- 📦 প্রতিটা module একই pattern অনুসরণ করে: create (multipart), find all, find single, update (partial), delete (with file cleanup)