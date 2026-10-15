# Portfolio — Saad Benhaimer

Site portfolio one-page statique. **Zéro dépendance, zéro build, zéro serveur.**
Implémentation fidèle du design *« V2 — humanisée (éditoriale) »*.

## Structure

```
.
├── index.html                      # toute la page
├── assets/
│   ├── css/styles.css              # tokens + styles (light & dark)
│   ├── js/main.js                  # thème, FR/EN, nav, horloge, formulaire
│   ├── img/saad.jpg                # ← METTRE TA PHOTO ICI (voir ci-dessous)
│   ├── img/favicon.svg
│   └── cv/Saad_Benhaimer_CV.pdf    # CV téléchargé par le bouton du header
├── vercel.json                     # cache + en-têtes de sécurité
├── robots.txt / sitemap.xml
└── 404.html
```

## Déploiement sur Vercel

Aucune configuration : c'est un site statique.

```bash
npx vercel --prod
```

Ou via l'interface : *Add New → Project*, importer le dépôt Git,
**Framework Preset = Other**, laisser *Build Command* et *Output Directory* vides.

Pensez ensuite à remplacer `https://saad-benhaimer.vercel.app/` par l'URL
réelle dans `index.html` (`canonical`, `og:url`), `robots.txt` et `sitemap.xml`.

## Aperçu en local

```bash
python -m http.server 5173
```

Puis ouvrir http://localhost:5173 (ouvrir le fichier en `file://` fonctionne
aussi, mais un serveur reflète mieux le comportement final).

## À personnaliser

| Quoi | Où |
|---|---|
| **Photo de profil** | déposer `assets/img/saad.jpg` (format portrait 4:5, ~760×950 px). Sans ce fichier, le placeholder « SB » du design s'affiche automatiquement. |
| **CV** | remplacer `assets/cv/Saad_Benhaimer_CV.pdf` |
| **Liens des projets** | cartes `.card-main` / `.card-ghost` dans `index.html` — ils pointent pour l'instant vers le profil GitHub, à remplacer par l'URL du dépôt (et par une vraie démo, sinon supprimer le lien « Démo ») |
| **URL du site** | `https://saad-benhaimer.vercel.app/` est une supposition : à confirmer après le premier déploiement dans `index.html` (`canonical`, `og:url`), `robots.txt` et `sitemap.xml` |
| **Les 2 cartes « Projet à venir »** | `index.html`, blocs `.card-ghost` |
| **Textes anglais** | attribut `data-en="…"` sur chaque élément traduit |

## Choix techniques

- **Thème appliqué avant le premier paint** — un petit script inline dans
  `<head>` lit `localStorage` puis `prefers-color-scheme` et pose
  `data-theme` sur `<html>`. Aucun flash de thème au chargement, aucun
  décalage de mise en page.
- **Tout est instantané au clic.** Le thème et la langue basculent par
  variables CSS et échange de texte, sans requête ni re-render. La
  navigation surligne la section visée *avant* le défilement, puis un
  verrou de 700 ms empêche l'`IntersectionObserver` de contredire le clic.
- **Aucune animation d'apparition.** Le contenu est visible immédiatement,
  y compris sans JavaScript : le site reste entièrement lisible si le JS
  échoue (seuls le switch de thème/langue, l'horloge et la copie d'email
  en dépendent).
- **Formulaire sans backend** — il valide les champs puis ouvre la
  messagerie de la personne avec un message prérempli (`mailto:`). Pour un
  envoi en arrière-plan, brancher Formspree ou une Vercel Function.
- **Accessibilité** — HTML sémantique, lien d'évitement, `aria-label` sur
  les contrôles, focus visible, cibles tactiles ≥ 40 px,
  `prefers-reduced-motion` respecté (défilement et rotations neutralisés).
- **Performance** — une feuille CSS, un script `defer`, polices Google
  préconnectées en `display=swap`, assets en cache immuable un an.
  Pas de framework : la page pèse quelques dizaines de ko.
