# 🏨 Diyafa — Système de Gestion Hôtelière et Immobilière (PMS)

Plateforme complète de **gestion hôtelière et immobilière**, réalisée dans le cadre d'un projet de fin d'études (PFE) de licence à l'Université Abdelhamid Mehri – Constantine 2. Elle associe une **application mobile Flutter** destinée aux clients et un **tableau de bord web React** destiné au personnel de l'hôtel, le tout reposant sur une **API REST Node.js / Express** et une base de données **MySQL**.

Le système automatise les réservations, la gestion des chambres, la planification des employés, le suivi des salaires, le signalement des problèmes de maintenance et le suivi du budget au sein d'une interface unique. Il est conçu pour les petits et moyens hôtels et gestionnaires de biens en Algérie.

---

## 📱 Fonctionnalités

### 👤 Client (Application mobile — Flutter)
- 🔐 **Authentification** — Inscription / connexion par email et mot de passe, code de vérification par email, réinitialisation du mot de passe
- 🛏️ **Consultation des chambres** — Liste des chambres par catégorie (Standard, Luxe, Familiale…), chambres les mieux notées, avis
- 📄 **Détails d'une chambre** — Photos, description, capacité, prix par nuit, statut de disponibilité
- 📅 **Réservations** — Réservation par choix des dates d'arrivée et de départ, consultation de « Mes réservations »
- 👤 **Profil** — Consultation et modification des informations personnelles et de la photo de profil
- ⚠️ **Signaler un problème** — Envoi d'un problème directement à la direction
- 🔔 **Notifications** — Mises à jour des réservations et messages du système

### 🛠️ Administrateur (Tableau de bord web)
- 📊 **Tableau de bord** — Nombre total de chambres, chambres disponibles, réservations en cours, taux d'occupation, revenu mensuel
- 👥 **Gestion des utilisateurs** — Ajout, modification, suppression de comptes et gestion des rôles
- 🏠 **Gestion des chambres** — Ajout, modification, suppression (nom, numéro, type, capacité, prix, statut, image, description)
- 🧰 **Suivi des problèmes** — Consultation et gestion des problèmes signalés par les utilisateurs

### 💼 Gestionnaire de propriété (Tableau de bord web)
- 🧑‍🤝‍🧑 **Gestion des employés** — Ajout, modification, suppression d'employés et configuration des salaires
- 🗓️ **Planification** — Calendrier hebdomadaire / mensuel / journalier avec filtre par rôle
- 💰 **Aperçu du budget** — Total dépensé, total des salaires, total des revenus, bénéfice

### 🛎️ Réceptionniste (Tableau de bord web)
- ➕ **Nouvelle réservation** — Choix de la chambre et des dates, calcul automatique du prix total
- 📋 **Liste des réservations** — Consultation, modification, annulation et confirmation des réservations (y compris celles faites depuis l'application mobile)
- 🕒 **Planning du personnel** — Consultation du programme des employés

---

## 👥 Acteurs et rôles

| Acteur | Plateforme | Responsabilités principales |
|---|---|---|
| **Client** | Mobile (Flutter) | Rechercher des chambres, réserver, annuler, gérer son profil, signaler un problème |
| **Administrateur** | Web (React) | Utilisateurs, rôles, chambres, statistiques, problèmes |
| **Gestionnaire de propriété** | Web (React) | Employés, salaires, plannings, maintenance, budget |
| **Réceptionniste** | Web (React) | Réservations, arrivées / départs, consultation du planning |

---

## 🏗️ Architecture

Le projet suit une **architecture client-serveur** avec une couche API RESTful.

```
┌──────────────────┐     ┌──────────────────┐
│  Mobile Flutter  │     │   Application    │
│     (Client)     │     │    Web React     │
│                  │     │ (Admin/Gestion./ │
│                  │     │  Réceptionniste) │
└────────┬─────────┘     └────────┬─────────┘
         │      HTTP / REST (JSON)│
         └───────────┬────────────┘
                     ▼
          ┌──────────────────────┐
          │  Node.js + Express   │
          │  (API REST, JWT)     │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │        MySQL         │
          └──────────────────────┘
```

---

## 🛠️ Technologies utilisées

### Mobile (Client)
| Technologie | Rôle |
|---|---|
| Flutter 3.19.6 | Framework mobile multiplateforme |
| Dart 3.3.4 | Langage de programmation |

### Web (Tableaux de bord du personnel)
| Technologie | Rôle |
|---|---|
| React.js 18.x | Bibliothèque d'interface utilisateur |
| Tailwind CSS | Stylisation |
| Next.js 14.x | Framework React |

### Backend
| Technologie | Rôle |
|---|---|
| Node.js v20.13.1 | Environnement d'exécution JavaScript |
| Express | Framework d'API REST |
| MySQL 8.0 | Base de données relationnelle |
| JWT | Authentification par jeton |

### Outils
VS Code · Postman 10.x · MySQL Workbench 8.0 · StarUML 5.0

---

## 🗄️ Schéma de la base de données

```
User             → Authentification et profil (username, email, password, phone, avatar, is_verified…)
Client           → Comptes clients (lié à User)
Receptionist     → Personnel de réception (lié à User)
PropertyManager  → Gestionnaires (lié à User)
Admin            → Administrateurs (lié à User)
Employees        → Personnel de l'hôtel (nom, rôle, salaire, statut, date d'embauche)
Chambre          → Chambres (nom, étage, capacité, prix, disponibilité)
Reservations     → Réservations (chambre, client, date de début, date de fin)
Payment          → Paiements (montant, méthode, date, réservation liée)
Problems         → Problèmes signalés (type, statut, message, chambre, gestionnaire, date)
Schedule         → Plannings des employés (employé, rôle, début, fin, gestionnaire)
```

---

## 🚀 Prérequis

- Node.js v20+
- Flutter SDK 3.19+ (Dart 3.3+)
- MySQL 8.0
- Git

---

## 📡 Points d'accès de l'API

> Liste indicative — à adapter aux routes réelles de votre backend.

### Authentification
```
POST   /auth/register            → Inscription d'un nouveau client
POST   /auth/login               → Connexion et obtention du jeton JWT
POST   /auth/forgot-password     → Envoi d'un code de vérification à 6 chiffres par email
POST   /auth/verify-code         → Vérification du code
POST   /auth/reset-password      → Définition d'un nouveau mot de passe
GET    /auth/me                  → Utilisateur connecté
```

### Chambres
```
GET    /chambres                 → Liste des chambres (filtre par type, prix, disponibilité)
GET    /chambres/:id             → Détails d'une chambre
POST   /chambres                 → Ajouter une chambre          (Admin)
PUT    /chambres/:id             → Modifier une chambre         (Admin)
DELETE /chambres/:id             → Supprimer une chambre        (Admin)
```

### Réservations
```
GET    /reservations             → Liste des réservations
GET    /reservations/me          → Réservations du client connecté
POST   /reservations             → Créer une réservation
PUT    /reservations/:id         → Modifier une réservation
DELETE /reservations/:id         → Annuler une réservation
```

### Utilisateurs
```
GET    /users                    → Liste des utilisateurs       (Admin)
POST   /users                    → Ajouter un utilisateur       (Admin)
PUT    /users/:id                → Modifier un utilisateur
DELETE /users/:id                → Supprimer un utilisateur     (Admin)
```

### Employés, planning et budget
```
GET    /employees                → Liste des employés           (Gestionnaire)
POST   /employees                → Ajouter un employé
PUT    /employees/:id            → Modifier un employé / son salaire
DELETE /employees/:id            → Supprimer un employé
GET    /schedule                 → Consulter le planning
POST   /schedule                 → Créer un créneau de travail
GET    /budget                   → Aperçu du budget (dépenses, salaires, revenus, bénéfice)
```

### Problèmes
```
GET    /problems                 → Liste des problèmes signalés
POST   /problems                 → Signaler un problème
DELETE /problems/:id             → Supprimer un problème
```

---

## 📁 Structure du projet

```
PMS/
├── pms-mobile/                 ← Application mobile Flutter (Client)
│   ├── lib/
│   │   ├── core/
│   │   ├── data/
│   │   └── presentation/
│   └── pubspec.yaml
├── pms-web/                    ← Tableaux de bord web React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── manager/
│   │   │   └── receptionist/
│   │   └── services/
│   └── package.json
├── pms-backend/                ← API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── .env
│   └── package.json
└── database/
    └── schema.sql
```

---

## 🖥️ Écrans de l'application

### Mobile (Client)
| Écran | Description |
|---|---|
| Connexion | Authentification par email / mot de passe |
| Inscription | Création de compte (nom, prénom, email, téléphone, mot de passe) |
| Découvrir | Catégories de chambres et chambres les mieux notées |
| Détails de la chambre | Photos, description, prix, capacité, bouton de réservation |
| Mes réservations | Liste des réservations du client |
| Profil | Informations personnelles et actions |
| Modifier mon profil | Mise à jour du nom, de l'email, du téléphone et de la photo |

### Web (Personnel)
| Écran | Rôle | Description |
|---|---|---|
| Connexion du personnel | Tout le personnel | Authentification par email / mot de passe |
| Vérification du code | Tout le personnel | Code à 6 chiffres reçu par email |
| Nouveau mot de passe | Tout le personnel | Réinitialisation du mot de passe |
| Tableau de bord administrateur | Admin | Chambres, réservations, occupation, revenus |
| Gestion des utilisateurs | Admin | Tableau des utilisateurs avec modification / suppression |
| Liste des chambres / Ajouter une chambre | Admin | CRUD complet des chambres |
| Problèmes | Admin | Problèmes signalés |
| Employés | Gestionnaire | Employés et salaires |
| Planning | Gestionnaire | Planification sous forme de calendrier |
| Budget | Gestionnaire | Synthèse financière |
| Ajouter une réservation | Réceptionniste | Formulaire de réservation avec calcul du prix |
| Liste des réservations | Réceptionniste | Consultation / modification / annulation |
| Programme des employés | Réceptionniste | Horaires du personnel |

---

## 🔮 Perspectives

- Intégration avec des services externes (calendriers, messageries)
- Analyses et rapports avancés
- Système d'avis et de retours clients
- Intégration d'une passerelle de paiement en ligne
- Prise en charge multilingue (arabe / français / anglais)

---

## 📄 Licence

Ce projet a été développé à des fins académiques.
