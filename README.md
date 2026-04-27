# 🚀 RamBD - E-Commerce Solution

### **"A High-Performance, Enterprise-Grade Next.js E-Commerce Platform"**

<div align="center">
  <img src="https://i.ibb.co/ynXWk5S/bonik-intro-sale.gif" alt="RamBD Banner" width="100%" />
  <br />
  <p align="center">
    <b>Crafted by <a href="https://github.com/official-noman">Abdullah Al Noman</a></b>
    <br />
    <i>The ultimate foundation for modern, scalable, and SEO-optimized e-commerce platforms.</i>
    <br /><br />
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</div>

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/official-noman/RamBD)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)](https://github.com/official-noman/RamBD/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](http://makeapullrequest.com)

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#-usage)
  - [Development](#development)
  - [Build & Deployment](#build--deployment)
- [Configuration](#-configuration)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 📖 Project Overview

**RamBD** is a premium, multi-purpose eCommerce solution engineered with **Next.js 15**, **TypeScript**, and **Styled Components**. This project is a demonstration of modern web engineering principles, focusing on high performance, maintainability, and user experience.

Developed by **Abdullah Al Noman**, RamBD provides a robust, scalable architecture for diverse retail needs—ranging from global superstores to niche market applications.

> **Technical Vision:**
> To provide a lightning-fast, fully responsive, and SEO-ready foundation that empowers businesses to scale without technical debt.

---

## ✨ Key Features

- 🛍️ **4+ Unique Shop Variations**: Superstore, Grocery, Niche Market (V1 & V2), and more.
- 🏢 **Multi-Vendor Support**: Advanced dashboard and workflows for multiple sellers.
- 👤 **Comprehensive User Accounts**: Robust user profiles, order tracking, and wishlists.
- ⚡ **Next.js 15 App Router**: Utilizing the latest in server-side rendering and streaming.
- 🎨 **Custom Component Library**: Built with Styled Components for maximum performance and design flexibility.
- 🔍 **SEO & Performance Optimized**: High Lighthouse scores and structured data support.
- 📊 **Dynamic Dashboards**: Interactive charts and data visualization for vendors and admins.
- 🚀 **Automated cPanel Deployment**: Specialized scripts for easy hosting on shared or dedicated environments.
- 📱 **Fully Responsive**: Mobile-first approach ensuring a seamless experience across all devices.

---

## 🏗️ Architecture / Tech Stack

RamBD follows a modern, modular architecture that prioritizes developer experience and maintainability.

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Styled Components](https://styled-components.com/) & [Styled System](https://styled-system.com/)
- **Forms & Validation**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **State Management**: React Context API
- **Data Fetching**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [React Chartjs 2](https://react-chartjs-2.js.org/)
- **Animations**: [Slick Carousel](https://kenwheeler.github.io/slick/) & [NProgress](https://ricostacruz.com/nprogress/)

---

## 🏁 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/official-noman/RamBD.git
   cd RamBD
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory.
   ```bash
   cp .env.example .env
   ```

---

## 🚀 Usage

### Development
To start the development server with hot-reloading:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Build & Deployment
To create an optimized production build:
```bash
npm run build
```

#### Automated cPanel Deployment
RamBD includes a specialized pipeline for cPanel:
```bash
npm run package-deploy
```
This script will:
1. Generate a production build.
2. Bundle all necessary files into a `dist-cpanel` folder.
3. Create a `deploy.zip` file ready for upload.

---

## ⚙️ Configuration

The system can be configured via `general_settings.json` and `.env` files. 

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for your API endpoints | `http://localhost:3000/api` |
| `SITE_NAME` | The name of your eCommerce store | `RamBD` |
| `CURRENCY` | Default currency code | `USD` |

---

## 🗺️ Roadmap

- [ ] Multi-language support (i18n)
- [ ] Dark Mode support
- [ ] Integration with Stripe/PayPal payment gateways
- [ ] Mobile App (React Native) synchronization
- [ ] Advanced AI-driven product recommendations

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📞 Contact / Support

**Developer:** **Abdullah Al Noman**  
**GitHub:** [@official-noman](https://github.com/official-noman)  
**Email:** [official.aanoman@gmail.com] 

**Support the Project:** Give a ⭐ on GitHub!

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/official-noman">Abdullah Al Noman</a>
</p>
