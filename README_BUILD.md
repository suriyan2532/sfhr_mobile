# วิธีการ Build และทดสอบ Mobile App (sfhr_mobile) บนเครื่องจริง

มี 2 วิธีหลักในการทดสอบแอปพลิเคชันบนเครื่องจริง:

## 1. ทดสอบผ่าน Expo Go (แนะนำสำหรับ Dev)
วิธีนี้ง่ายและเร็วที่สุด *ไม่ต้องรอ Build นาน*

### สิ่งที่ต้องเตรียม:
1.  ติดตั้งแอป **Expo Go** บนมือถือของคุณ (จาก Play Store หรือ App Store)
2.  มือถือและเครื่องคอมพิวเตอร์ต้องเชื่อมต่อ **Wi-Fi วงเดียวกัน**

### ขั้นตอน:
1.  รันคำสั่งใน Terminal ของโปรเจกต์ `sfhr_mobile`:
    ```bash
    npx expo start
    ```
2.  **Android**: เปิดแอป Expo Go แล้วสแกน QR Code ที่แสดงใน Terminal
3.  **iOS**: เปิดแอป Camera สแกน QR Code แล้วกดเปิดใน Expo Go

> **ข้อควรระวัง:** ใน `App.js` ต้องแก้ IP Address (`FRONTEND_URL`) ให้ตรงกับ IP เครื่องคอมพิวเตอร์ของคุณ

---

## 2. สร้างไฟล์ติดตั้ง (APK สำหรับ Android)
วิธีนี้จะได้ไฟล์ `.apk` ไปติดตั้งบนเครื่อง Android ได้เลย โดยไม่ต้องใช้ Expo Go

### สิ่งที่ต้องเตรียม:
1.  ต้องมีบัญชี [Expo.dev](https://expo.dev/) (สมัครฟรี)
2.  ติดตั้ง EAS CLI:
    ```bash
    npm install -g eas-cli
    ```
3.  Login เข้า Expo:
    ```bash
    eas login
    ```

### ขั้นตอนการ Build APK (Android):
1.  ตั้งค่า Build (ทำครั้งแรก):
    ```bash
    eas build:configure
    ```
    *   เลือก `Android`
    *   เลือก `Y` เพื่อสร้าง `eas.json`

2.  แก้ไขไฟล์ `eas.json` เพื่อเพิ่ม Profile สำหรับ APK:
    ```json
    {
      "build": {
        "preview": {
          "android": {
            "buildType": "apk"
          }
        },
        "production": {}
      }
    }
    ```

3.  สั่ง Build:
    ```bash
    eas build -p android --profile preview
    ```
    *   รอจนเสร็จ (อาจใช้เวลา 10-20 นาที)
    *   เมื่อเสร็จ จะได้ลิ้งค์สำหรับดาวน์โหลดไฟล์ `.apk` ให้ส่งลิ้งค์เข้ามือถือ download ไปติดตั้งได้เลย

---

## 3. สร้างไฟล์ติดตั้ง (iOS)
**หมายเหตุ:** การ Build ลง iPhone เครื่องจริง จำเป็นต้องมี **Apple Developer Account ($99/ปี)** หากไม่มี แนะนำให้ใช้ **Expo Go** ตามข้อ 1

หากมี Account:
1.  สั่ง Build (Adhoc สำหรับเครื่องที่ลงทะเบียน UDID ไว):
    ```bash
    eas build -p ios --profile preview
    ```
2.  ทำตามขั้นตอน Login Apple ID บน Terminal เพื่อสร้าง Certificate/Provisioning Profile
