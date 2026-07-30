# 🎯 Banner API

Homepage hero/banner section manage করার জন্য একটি simple REST API — banner তৈরি, দেখা, আপডেট ও ডিলিট করা যায়, সাথে image upload সাপোর্টসহ।

---

## 📁 Base URL

```
/api/banner
```

> রাউটার ফাইলে `/` path গুলো ব্যবহার করা হয়েছে, তাই `app.js` / `server.js` এ mount করার সময় prefix (যেমন `/api/banner`) নিজেদের মতো সেট করে নিতে হবে:
>
> ```javascript
> app.use("/api/banner", bannerRoute);
> ```

---

## 📦 Data Model

| Field             | Type    | Description                                    |
|--------------------|---------|-------------------------------------------------|
| `title`            | String  | ব্যানারের মূল heading (**required**)            |
| `highlightedWord`  | String  | Heading এর মধ্যে যে word আলাদা রঙে দেখাবে        |
| `description`      | String  | ব্যানারের নিচের description text (**required**) |
| `bannerImage`      | String  | Uploaded ছবির URL (**required**)                 |
| `isActive`         | Boolean | ব্যানারটি active কিনা                            |
| `createdAt`        | Date    | Auto generated                                   |
| `updatedAt`        | Date    | Auto generated                                   |

---

## 🚀 Endpoints

### 1. Create Banner
নতুন banner তৈরি করে, সাথে একটি image upload করতে হবে।

```
POST /api/banner/
```

**Content-Type:** `multipart/form-data`

| Key                | Type | Required | Note                                 |
|--------------------|------|----------|----------------------------------------|
| `banner-image`     | File | ✅        | jpg / jpeg / png / webp, সর্বোচ্চ 2MB |
| `title`            | Text | ✅        | —                                       |
| `highlightedWord`  | Text | ❌        | —                                       |
| `description`      | Text | ✅        | —                                       |
| `isActive`         | Text | ❌        | `true` / `false`                        |

**Success Response — `200`**
```json
{
  "success": true,
  "message": "banner added successfully"
}
```

**Error Response — `400`**
```json
{
  "success": false,
  "message": "title and banner image are required"
}
```

---

### 2. Get All Banners
```
GET /api/banner/
```

সব banner গুলো newest → oldest order এ রিটার্ন করে।

**Success Response — `200`**
```json
{
  "success": true,
  "message": "banner fetched successfully",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "title": "Dive into Delights Of Delectable Food",
      "highlightedWord": "Food",
      "description": "Where Each Plate Weaves a Story...",
      "bannerImage": "https://example.com/uploads/banner.jpg",
      "isActive": true
    }
  ]
}
```

---

### 3. Get Single Banner
```
GET /api/banner/:id
```

**Success Response — `200`**
```json
{
  "success": true,
  "message": "banner fetched successfully",
  "data": { "...": "banner object" }
}
```

**Error Response — `404`**
```json
{
  "success": false,
  "message": "banner not found"
}
```

---

### 4. Update Banner
```
PATCH /api/banner/:id
```

**Content-Type:** `multipart/form-data`

সব field optional — শুধু যেই field গুলো পাঠাবে, সেগুলোই update হবে। নতুন `banner-image` পাঠালে পুরনো ছবি অটোমেটিক uploads folder থেকে ডিলিট হয়ে নতুনটা সেভ হবে।

**Success Response — `200`**
```json
{
  "success": true,
  "message": "banner updated successfully"
}
```

**Error Response — `404`**
```json
{
  "success": false,
  "message": "banner not found"
}
```

---

### 5. Delete Banner
```
DELETE /api/banner/:id
```

Banner ডিলিট হওয়ার সাথে সাথে uploads folder থেকে সংশ্লিষ্ট image ফাইলটিও ডিলিট হয়ে যাবে।

**Success Response — `200`**
```json
{
  "success": true,
  "message": "banner deleted successfully"
}
```

**Error Response — `404`**
```json
{
  "success": false,
  "message": "banner not found"
}
```

---

## 🖼️ Image Upload নিয়ম

- Allowed extensions: `jpg`, `jpeg`, `png`, `webp`
- Max size: **2MB**
- Field name অবশ্যই হতে হবে: **`banner-image`**
- Postman এ পাঠানোর সময় `Body → form-data` সিলেক্ট করতে হবে, এবং `banner-image` key এর Type `File` করতে হবে

---

## ⚠️ বর্তমান Status

- 🔓 বর্তমানে সব route **public** (কোনো auth middleware নেই)
- 🔒 Auth সিস্টেম রেডি হলে `add`, `update`, `delete` route গুলোতে `authorize` ও `authorizeRole` middleware পুনরায় যোগ করা প্রয়োজন হবে

---

## 🗂️ Project Structure Reference

```
├── controller/
│   └── banner.controller.js
├── model/
│   └── banner.model.js
├── routes/
│   └── banner.route.js
├── helpers/
│   ├── uploadsFile.js
│   ├── deleteHelper.js
│   └── fileUpdateHelper.js
└── utils/
    ├── apiResponse.js
    └── asyncHandler.js
```
