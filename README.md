### 🚀 Lumos: Blockchain-Based Space Traffic Management System

Lumos is a decentralized application designed to streamline and secure space mission planning. It utilizes **Ethereum smart contracts**, **MetaMask authentication**, and **MongoDB for persistent storage**, enabling various stakeholders to submit and review **launch** and **maneuver** requests transparently and securely.

---

## 🧠 Features

- ✅ **MetaMask Wallet Authentication**
- ✅ **Role-Based Access Control** (Admin, Regulatory Body, General User)
- ✅ **Launch Request Submission**
- ✅ **Maneuver Request Submission with Collision Detection**
- ✅ **Request Review by Regulatory Bodies**
- ✅ **MongoDB Persistence for Users and Requests**
- ✅ **Space-Themed Dashboards with Interactive UI**
- ✅ **Smart Contract Events for Transparency**
- ✅ **Dynamic Admin Analytics Panel**

---

## 🏗️ Tech Stack

| Layer           | Technologies Used |
|----------------|-------------------|
| Smart Contracts | Solidity, Hardhat |
| Frontend        | Next.js, React, Tailwind CSS |
| Wallet          | MetaMask + ethers.js |
| Backend API     | Express.js + Node.js |
| Database        | MongoDB + Mongoose |
| Blockchain      | Local Hardhat Node (Ethereum) |

---

## 🛠️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lumos-space-traffic.git
cd lumos-space-traffic
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set Up MongoDB

- Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- Create a database named `lumosDB`
- Add collections:
  - `users`
  - `launchrequests`
  - `maneuverrequests`

> 🔐 Store MongoDB connection string in a `.env` file inside `/backend`:

```
MONGODB_URI=mongodb://localhost:27017/lumosDB
```

### 4. Run Hardhat Node and Deploy Contracts

```bash
cd backend
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start Backend

```bash
npm run dev
```

### 6. Start Frontend

```bash
cd ../frontend
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
lumos-space-traffic/
├── backend/
│   ├── contracts/            # Solidity smart contracts
│   ├── api/                  # Express API routes
│   ├── models/               # MongoDB schemas
│   ├── utils/                # Contract loader, user store, etc.
│   ├── scripts/              # Hardhat deployment script
│   └── .env
├── frontend/
│   ├── app/                  # Next.js pages and routes
│   ├── components/           # UI components (dashboards, forms)
│   └── lib/contract.js       # ethers.js contract connection
```

---

## 🔐 Roles & Permissions

| Role             | Permissions |
|------------------|-------------|
| Admin            | View analytics, all requests, all users |
| Regulatory Body  | Review launch & maneuver requests |
| General User     | Submit launch & maneuver requests |

---

## 🛰️ Smart Contract Summary

- Written in Solidity
- Stores requests with status
- Uses `keccak256` hashing to **detect collisions**
- Emits events on:
  - Role assignment
  - Request submission
  - Request review

---

## 🧪 Example Accounts (Localhost)

Use these with MetaMask (from Hardhat):

```
Private Key 1: 0x...
Private Key 2: 0x...
...
```

Assign roles using the registration form on the frontend.

---

## ✅ Future Improvements

- Use IPFS to store payload documents
- Deploy to Ethereum testnet (e.g., Sepolia)
- Role-based dashboards using JWT instead of session storage
- Integrate email notifications on request updates

