# হিসাব প্রো (Hisab Pro)

**Dark Premium Green Glassmorphism** থিমের একটি সম্পূর্ণ প্রোডাকশন-রেডি Expense Tracker।
React 19 + Firebase v11 (Authentication + Firestore) + PWA + Capacitor Android।

---

## ✨ ফিচার

- **Google Sign-In** — Firebase Authentication দিয়ে নিরাপদ লগইন
- **Persistent Login** — একবার লগইন করলে ব্রাউজার বন্ধ করলেও সেশন থাকে
- **Multi-device Sync** — যেকোনো ডিভাইস থেকে একই Google অ্যাকাউন্ট দিয়ে লগইন করলে আগের সব লেনদেন স্বয়ংক্রিয়ভাবে লোড হয়
- **প্রতি ইউজারের প্রাইভেট ডেটাবেস** — Firestore Security Rules দিয়ে সুরক্ষিত (`users/{uid}`)
- **ড্যাশবোর্ড** — আজকের ব্যালেন্স, আয়, ব্যয়, সেভিংস + কুইক পাই চার্ট
- **লেনদেন ম্যানেজমেন্ট** — Add / Edit / Delete / Search / Filter (Type + Date Range)
- **আইকনসহ ক্যাটাগরি** — খাবার, বাজার, বিল, মেডিসিন, যাতায়াত, শিক্ষা, শপিং, বেতন, ফ্রিল্যান্স ইত্যাদি
- **পরিসংখ্যান** — Pie Chart, Bar Chart, Monthly Trend (গত ১২ মাস), Daily/Weekly/Monthly/Yearly/Custom Range
- **এক্সপোর্ট** — PDF, Excel (.xlsx), CSV
- **ব্যাকআপ ও রিস্টোর** — JSON ফরম্যাটে সম্পূর্ণ ডেটা ব্যাকআপ/রিস্টোর
- **সেটিংস** — Dark/Light Mode, Profile, Currency (BDT/USD/EUR/GBP/INR), Delete Account
- **PWA** — ইনস্টলযোগ্য, অফলাইন ক্যাশিং সাপোর্ট
- **Capacitor Android** — একই কোডবেস থেকে Android APK বানানো যায়

---

## 🗂️ ফোল্ডার স্ট্রাকচার

```
src/
  firebase/         # Firebase config, auth service, firestore service
  context/          # AuthContext, AppContext (global state)
  hooks/            # useTransactions (real-time sync hook)
  utils/            # formatters, dateRange, categories, exportUtils
  components/       # পুনঃব্যবহারযোগ্য UI কম্পোনেন্ট
  pages/            # Dashboard, Transactions, Statistics, Settings
  App.js            # রাউটিং + প্রোভাইডার সেটআপ
  App.css           # গ্লোবাল থিম (আপনার অরিজিনাল ডিজাইন অক্ষুণ্ণ রাখা হয়েছে)
```

---

## 🔥 Firestore ডেটা স্ট্রাকচার

```
users/{uid}
  name, email, photo, createdAt, currency, theme

users/{uid}/transactions/{transactionId}
  type       -> "income" | "expense"
  amount     -> number
  category   -> string (যেমন: "বেতন", "বাজার")
  note       -> string (ঐচ্ছিক)
  date       -> ISO string
  createdAt  -> serverTimestamp
```

---

## 🚀 সেটআপ গাইড

### ১. Firebase প্রজেক্ট তৈরি করুন
1. [Firebase Console](https://console.firebase.google.com) এ যান → নতুন প্রজেক্ট বানান
2. **Authentication** → Sign-in method → **Google** চালু করুন
3. **Firestore Database** তৈরি করুন (Production mode)
4. Project Settings → General → "Your apps" → Web App যোগ করুন → SDK config কপি করুন

### ২. এনভায়রনমেন্ট ভ্যারিয়েবল সেট করুন
`.env.example` কে `.env` নামে কপি করে Firebase config বসান:

```bash
cp .env.example .env
```

### ৩. ডিপেন্ডেন্সি ইনস্টল করুন

```bash
npm install
```

### ৪. Firestore Security Rules ডিপ্লয় করুন

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # আপনার প্রজেক্ট আইডি সিলেক্ট করুন
firebase deploy --only firestore:rules
```

### ৫. লোকালি রান করুন

```bash
npm start
```

### ৬. প্রোডাকশন বিল্ড ও Firebase Hosting-এ ডিপ্লয়

```bash
npm run build
firebase deploy --only hosting
```

---

## 📱 Capacitor Android (APK)

```bash
npm run build
npx cap add android      # প্রথমবার
npm run cap:sync
npm run cap:open         # Android Studio খুলবে
```

`capacitor.config.ts`-এ App ID এবং নাম দরকার হলে পরিবর্তন করুন।

---

## 🔒 Firebase Security Rules সারাংশ

`firestore.rules` ফাইলে নিশ্চিত করা হয়েছে:
- প্রতিটি ইউজার শুধুমাত্র নিজের `users/{uid}` ডকুমেন্ট এবং তার ভেতরের `transactions` সাব-কালেকশন read/write করতে পারবে
- `request.auth.uid == userId` চেক ছাড়া কোনো ডেটা অ্যাক্সেসযোগ্য নয়
- অন্য কোনো path-এ ডিফল্টভাবে সব অ্যাক্সেস বন্ধ (`allow read, write: if false`)

---

## 🛠️ টেকনোলজি স্ট্যাক

| স্তর | প্রযুক্তি |
|---|---|
| Frontend | React 19, React Router v6 |
| Charts | Recharts 3 |
| Backend | Firebase Authentication + Cloud Firestore |
| Export | jsPDF, jsPDF-AutoTable, SheetJS (xlsx) |
| Mobile | Capacitor 8 (Android) |
| Hosting | Firebase Hosting |
| PWA | Service Worker + Web App Manifest |

---

## 📄 লাইসেন্স

এই প্রজেক্ট ব্যক্তিগত ব্যবহারের জন্য তৈরি। প্রয়োজন অনুযায়ী পরিবর্তন করে ব্যবহার করুন।
