# Instructions de Déploiement (Architecture Cloudflare + Netlify)

Ce document décrit comment déployer ton projet de façon à utiliser Cloudflare comme bouclier et moteur de tracking gratuit, et Netlify comme hébergeur de l'interface (front-end).

## 1. Déploiement du Code (Front-end) sur Netlify
1. Connecte-toi sur [Netlify](https://www.netlify.com/).
2. Clique sur **"Add new site"** > **"Import an existing project"** et connecte ton dépôt GitHub (`kimchloe-links`).
3. Dans les paramètres de build :
   - Build command: `npm run build`
   - Publish directory: `.next` (ou laisse Netlify détecter automatiquement l'App Router).
4. Ajoute tes variables d'environnement dans Netlify :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déploie. Netlify te donnera une URL par défaut (ex: `https://ton-site.netlify.app`). 
> **Important** : Ne lie PAS ton nom de domaine `kimchloe.site` sur Netlify !

## 2. Déploiement du Moteur (Back-end) sur Cloudflare Workers
1. Sur le tableau de bord Cloudflare, va dans **"Workers & Pages"** > **"Create"** > **"Create Worker"**.
2. Nomme-le (ex: `biolink-engine`) et clique sur Deploy.
3. Clique sur **"Edit code"** et copie/colle l'intégralité du code du fichier `cloudflare-worker.js` (qui se trouve à la racine de ce dossier). 
   - ⚠️ *Attention : Ligne 91 et 97, remplace `https://ton-site-netlify.netlify.app` par la vraie URL que Netlify t'a donnée.*
4. Clique sur **Deploy**.

## 3. Configuration des Variables du Worker
1. Retourne sur la page de gestion de ton Worker `biolink-engine`.
2. Va dans **Settings** > **Variables** > **Environment Variables**.
3. Ajoute `SUPABASE_URL` et `SUPABASE_ANON_KEY` (les mêmes que d'habitude). Sauvegarde.

## 4. Lier ton nom de domaine au Worker (La magie opère ici)
1. Va dans ton domaine `kimchloe.site` sur Cloudflare.
2. Va dans la section **"Workers Routes"** (ou "Triggers" dans le menu de gauche).
3. Ajoute une route (Add route) :
   - Route : `*kimchloe.site/*`
   - Worker : Choisis `biolink-engine`.
4. Sauvegarde.

C'est fini ! Quand quelqu'un tape `kimchloe.site`, Cloudflare intercepte, gère l'analytique et redirige (ou sert la page Netlify) instantanément.
