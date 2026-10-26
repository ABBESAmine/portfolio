# Animation d'ouverture — « L'anamorphose du moucharabieh »

Brief de conception validé, à utiliser comme référence pour l'implémentation. Aucun code n'est encore écrit.

---

## 1. Concept

Une sculpture en treillis 3D flotte dans le noir, éclairée par une seule source de lumière. Ses fragments paraissent dispersés au hasard, et leur ombre n'est qu'un chaos de lignes. Quand la rotation s'arrête à un angle précis, l'ombre forme d'un coup le prénom **AMINE** en coufique carré.

**L'idée derrière :** des pièces qui paraissent éparses forment un tout quand on les regarde sous le bon angle. L'intro parle de **qui je suis** (zellige, moucharabieh, géométrie). Le titre « Développeur Full-Stack » dit ensuite **ce que je fais**.

**Ce qui est exclu :** le son, et le simple tracé SVG animé (pas assez spectaculaire).

---

## 2. Direction artistique

| Élément | Choix |
|---|---|
| **Lettrage** | « AMINE » en **coufique carré** adapté au latin : chaque lettre est construite sur une grille de carrés, et chaque carré correspond à un fragment de la sculpture. |
| **Matière** | Mélange de **bois de cèdre sombre** et de **laiton**. Les reflets du laiton reprennent `--accent` (`#C6A75E`). |
| **Lumière** | Une source unique **chaude et orange** (`--primary`, `#E96A00`), comme un soleil bas, avec un fin halo de poussière dans le faisceau. |
| **Fond** | Noir au départ. |

---

## 3. Déroulé (environ 3,5 s)

| Temps | Ce qu'on voit |
|---|---|
| **0–0,4 s** | Écran noir. Le faisceau de lumière s'allume. |
| **0,4–1,6 s** | Des dizaines de fragments flottent à des profondeurs différentes et tournent lentement. L'ombre projetée n'est qu'un chaos de lignes. |
| **1,6–2,4 s** | La rotation ralentit, puis s'arrête net. Les fragments s'alignent et l'ombre forme **AMINE**. Un temps de pause pour le moment de surprise. |
| **2,4–3,0 s** | La lumière s'intensifie. Le fond passe du noir au thème actif (voir §4). Les fragments s'éloignent et se dissolvent. |
| **3,0–3,5 s** | Les lignes de l'ombre glissent vers la bordure à motif (`pattern-border-bottom`) et le losange en haut à droite. « Développeur Full-Stack » apparaît avec l'animation d'entrée actuelle du Hero, et la scène 3D habituelle (`Hero3D`) prend le relais. |

L'intro ne doit pas « disparaître » comme un écran de chargement : elle doit **devenir** le décor du site.

---

## 4. Thème clair / sombre

- **Mode clair :** le fond passe du noir au sable (`--background`), comme un lever de soleil.
- **Mode sombre :** le fond **reste sombre** et se fond dans le `--background` du mode dark. *(Décision provisoire, à revoir après un premier essai.)*

---

## 5. Garde-fous (non négociables)

- **Une fois par session.** Les visites suivantes arrivent directement sur le Hero, par exemple grâce à un drapeau en `sessionStorage`.
- **Un bouton « Passer »** discret. Un clic ou un défilement n'importe où accélère la fin de l'intro au lieu de la couper sèchement.
- **Sur mobile modeste ou avec la préférence « réduire les animations »** (`prefersReducedMotion()` dans `src/lib/useReducedMotion.ts`) : on affiche directement l'ombre finale « AMINE » en image fixe, avec un fondu vers le Hero.
- **Le contenu du Hero est présent dans le HTML dès le départ**, caché sous l'intro. Le `h1` reste indexable et l'intro ne doit pas dégrader le LCP.
- **Accessibilité :** le canvas de l'intro est décoratif (`aria-hidden`). Aucun piège de focus, et le bouton « Passer » reste accessible au clavier.

---

## 6. Pistes techniques

- **Principe de l'anamorphose.** On part d'une grille 2D qui dessine « AMINE ». On place chaque fragment **sur le rayon** qui va de la lumière à « sa » case d'ombre, à une profondeur aléatoire. Avec une lumière ponctuelle ou un spot, on corrige l'échelle de chaque fragment selon sa distance à la lumière pour que son ombre garde la taille de la case. À l'angle de référence, les ombres s'alignent ; dès qu'on tourne le groupe, elles se brouillent.
- **Rendu.** Three.js est déjà dans le projet via React Three Fiber (voir `docs/THREEJS.md`). On utilise un spot avec `castShadow` et un plan récepteur d'ombre. Les fragments passent par un `InstancedMesh` pour limiter les appels de rendu. La taille de la shadow map est à calibrer pour que les lettres restent nettes sans exploser le coût GPU.
- **Orchestration.** Une timeline GSAP pilote les phases du §3. La séquence d'entrée actuelle du Hero (`src/components/Hero.tsx`) ne démarre qu'à la fin de l'intro, ou tout de suite si l'intro est sautée ou désactivée.
- **Valeurs de motion.** Les durées et les courbes doivent être ajoutées à `src/lib/motion.ts` (source unique), pas codées en dur dans le composant.
- **Chargement.** L'intro est chargée en `dynamic(..., { ssr: false })` comme `Hero3D`. L'image de repli s'affiche tant que la scène n'est pas prête.

---

## 7. Reste à faire avant l'implémentation

- [ ] Dessiner « AMINE » en coufique carré sur une grille : définir la taille de la grille et vérifier la lisibilité de chaque lettre.
- [ ] Définir les critères de « mobile modeste » qui déclenchent le repli (largeur d'écran, `hardwareConcurrency`, support WebGL…).
- [ ] Après un premier prototype : revoir la fin en mode sombre (rester sombre ou passer par la lumière).
