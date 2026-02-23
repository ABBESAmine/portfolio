# Three.js dans le projet — guide détaillé

Ce document explique **en détail** comment la 3D est utilisée dans le portfolio, en partant des bases pour quelqu’un qui ne connaît pas Three.js. **Chaque notion est accompagnée de la syntaxe en code** telle qu’elle est utilisée dans le projet.

---

## 1. C’est quoi la 3D dans un navigateur ?

Sur une page web, on affiche surtout du **texte et des images en 2D**. Pour afficher des **objets 3D** (formes qui ont de la profondeur, qui tournent, etc.), le navigateur utilise une technologie appelée **WebGL** : elle permet de dessiner des triangles en 3D très rapidement, en s’appuyant sur la carte graphique.

**Three.js** est une bibliothèque JavaScript qui s’appuie sur WebGL. Au lieu d’écrire du WebGL à la main (très technique), on utilise des notions plus simples : *scène*, *caméra*, *objets*, *lumières*. Three.js se charge de traduire tout ça en instructions WebGL.

En résumé : **WebGL = moteur bas niveau**, **Three.js = outil pour décrire une scène 3D en JavaScript**.

**Dans le projet**, on n’écrit pas Three.js « pur » : on utilise **React Three Fiber**, qui permet d’écrire la scène en JSX. Les imports de base sont :

```tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
```

---

## 2. Les trois piliers d’une scène 3D

Pour afficher quelque chose en 3D, on a besoin de trois choses :

| Élément | Rôle (en bref) |
|--------|------------------|
| **Scène** | Un « monde » vide dans lequel on place tous les objets (formes, lumières). |
| **Caméra** | Le point de vue : où on « regarde » la scène. C’est ce qui définit ce qu’on voit à l’écran. |
| **Rendu** | Le moteur qui dessine la scène telle que la caméra la voit, frame par frame (comme un film). |

Sans scène, rien à afficher. Sans caméra, on ne sait pas depuis où regarder. Sans rendu, rien ne s’affiche dans la page.

**En code** : avec React Three Fiber, tout est créé par le composant **`<Canvas>`**. On ne crée pas la scène ou le rendu à la main ; on les configure via le `Canvas` et ses enfants.

```tsx
import { Canvas } from "@react-three/fiber";

// Le Canvas crée automatiquement : scène + caméra + renderer WebGL
<Canvas
  camera={{ position: [0, 0, 4], fov: 50 }}
  gl={{ alpha: true, antialias: true }}
>
  {/* Tout ce qui est ici est ajouté à la scène */}
</Canvas>
```

- **`camera`** : configuration de la caméra (position et angle de vue).
- **`gl`** : options du contexte WebGL (transparence, antialiasing).
- Les **enfants** du `Canvas` (lumières, meshes, etc.) sont ajoutés à la scène automatiquement.

---

## 3. Objets 3D : géométrie + matériau = mesh

Chaque « forme » visible en 3D (une sphère, un cube, etc.) est un **mesh** (maillage). Un mesh est composé de deux choses :

### La géométrie

La **géométrie** décrit **la forme** : l’ensemble des points (sommets) et des triangles qui relient ces points. Three.js fournit des géométries toutes faites ; en R3F on les écrit en JSX avec **`args`** pour passer les paramètres (équivalent des arguments du constructeur Three.js).

### Le matériau

Le **matériau** décrit **l’apparence** : couleur, brillance, transparence, réaction à la lumière.

- **meshBasicMaterial** : couleur plate, pas d’effet de lumière (simple et léger).
- **meshStandardMaterial** : réagit aux lumières, peut être émissif (qui « brille » un peu).

**Syntaxe en code** : un mesh = un `<mesh>` qui contient **exactement une géométrie** et **un matériau** (ou un composant qui en produit un).

```tsx
// Exemple : un cube (box) avec un matériau simple
<mesh position={[0, 0, -1]}>
  <boxGeometry args={[0.35, 0.35, 0.35]} />
  <meshStandardMaterial
    color="#e06bcf"
    wireframe
    transparent
    opacity={0.45}
  />
</mesh>
```

- **`<mesh>`** : le conteneur de l’objet 3D. Les props comme **`position={[x, y, z]}`** placent l’objet dans la scène.
- **`<boxGeometry args={[largeur, hauteur, profondeur]} />`** : géométrie d’un parallélépipède. Les valeurs sont en « unités » Three.js (sans unité physique).
- **`<meshStandardMaterial ... />`** : matériau qui réagit à la lumière. **`wireframe`** affiche seulement les arêtes (effet fil de fer). **`transparent`** + **`opacity`** pour la transparence.

**Autres géométries utilisées dans le projet** (toujours avec `args` comme dans la doc Three.js) :

```tsx
<boxGeometry args={[0.35, 0.35, 0.35]} />           // cube : largeur, hauteur, profondeur
<icosahedronGeometry args={[0.5, 1]} />             // icosaèdre : rayon, détail (0 = basique)
<dodecahedronGeometry args={[0.35, 0]} />          // dodécaèdre : rayon, détail
<octahedronGeometry args={[0.4, 0]} />             // octaèdre : rayon, détail
<tetrahedronGeometry args={[0.3, 0]} />           // tétraèdre : rayon, détail
```

---

## 4. Les lumières

En 3D, si on ne met **aucune lumière**, les objets avec un matériau « standard » restent noirs. Il faut ajouter des **lumières** dans la scène.

**Syntaxe en code** pour chaque type de lumière utilisée dans le projet :

```tsx
// Lumière ambiante : éclaire tout uniformément (pas de position)
<ambientLight intensity={0.4} />

// Lumière directionnelle : comme le soleil, direction fixe
<directionalLight position={[5, 5, 5]} intensity={1} />

// Lumière ponctuelle : comme une ampoule, avec position et couleur
<pointLight position={[-3, 2, 2]} intensity={0.6} color="#b84ef0" />
<pointLight position={[3, -1, 1]} intensity={0.4} color="#e06bcf" />
```

- **`intensity`** : puissance (nombre, souvent entre 0 et 1 ou un peu plus).
- **`position`** : `[x, y, z]` pour les lumières qui ont une position (directional, point).
- **`color`** : couleur en hexadécimal (pour `pointLight`).

On place ces balises **à l’intérieur du Canvas** (souvent dans un composant `Scene` ou équivalent), au même niveau que les `<mesh>`.

---

## 5. Le système de coordonnées (X, Y, Z)

En 3D, chaque position est donnée par trois nombres : **x**, **y**, **z**.

- **X** : gauche / droite (positif = souvent à droite).
- **Y** : haut / bas (positif = souvent en haut).
- **Z** : profondeur (positif = vers la caméra, négatif = vers le fond).

**En code**, on passe toujours un tableau de trois nombres :

```tsx
position={[0, 0, -1]}   // centre en x et y, un peu en arrière en z
position={[1.8, 0.6, -2]}  // à droite, un peu en haut, plus en arrière
position={[-1.5, -0.4, -1.5]}  // à gauche, en bas
```

Pour la **caméra** (qui regarde la scène), on la place en z positif pour « regarder vers » les objets en z négatif :

```tsx
camera={{ position: [0, 0, 4], fov: 50 }}
```

---

## 6. React Three Fiber (R3F) — Three.js en React

React Three Fiber permet d’écrire une scène Three.js **en JSX** : chaque élément Three (mesh, lumière, etc.) devient un composant ou une balise.

**Syntaxe minimale d’une scène** :

```tsx
"use client";

import { Canvas } from "@react-three/fiber";

export function MaScene3D() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
}
```

- **`<Canvas>`** : obligatoire ; tout le 3D doit être dedans.
- Les noms des balises (**mesh**, **boxGeometry**, **meshStandardMaterial**, **ambientLight**) correspondent aux objets Three.js ; R3F les instancie et les ajoute à la scène.
- Les **props** (position, args, color, intensity, etc.) sont passées telles quelles à Three.js.

---

## 7. Drei — des composants tout prêts

**Drei** fournit des composants qui étendent R3F. Dans le projet on utilise surtout **`Float`** pour faire flotter un objet.

**Syntaxe en code** :

```tsx
import { Float } from "@react-three/drei";

<Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
  <mesh position={[0, 0, -1]}>
    <icosahedronGeometry args={[0.5, 1]} />
    <meshStandardMaterial color="#e06bcf" wireframe />
  </mesh>
</Float>
```

- **`speed`** : vitesse du cycle d’animation (nombre).
- **`rotationIntensity`** : amplitude de la rotation ajoutée (0 = pas de rotation en plus).
- **`floatIntensity`** : amplitude du mouvement de flottement (haut/bas, etc.).

Tout ce qui est **enfant** de `<Float>` est animé avec ce mouvement. On peut envelopper un seul `<mesh>` ou un groupe.

---

## 8. Où tout ça est utilisé dans le projet

- **Fichier principal 3D** : `src/components/Hero3D.tsx`
- **Intégration** : chargement dynamique dans `src/components/Hero.tsx`

La scène 3D sert de **fond décoratif** derrière le titre et les boutons du Hero.

---

## 9. Pourquoi charger la 3D « en dynamique » (dynamic import) ?

Three.js et WebGL ne tournent que dans le **navigateur**. Il ne faut pas les exécuter côté serveur (SSR). D’où l’utilisation de **`next/dynamic`**.

**Code exact dans `Hero.tsx`** :

```tsx
"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-background/80" />,
});

// Dans le JSX du Hero :
<Suspense fallback={<div className="absolute inset-0 z-0 bg-background/80" />}>
  <Hero3D />
</Suspense>
```

- **`dynamic(() => import("./Hero3D").then((m) => m.Hero3D))`** : charge le fichier `Hero3D.tsx` uniquement quand le composant est rendu (côté client).
- **`ssr: false`** : le module n’est jamais exécuté lors du rendu serveur.
- **`loading`** : composant affiché pendant le téléchargement du chunk.
- **`<Suspense>`** : permet à React d’afficher le `fallback` si le chargement est lent.

---

## 10. Configuration Next.js (transpilePackages)

**Fichier** : `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
```

Cela force Next.js à transpiler le code de ces packages pour le build. Sans ça, certains imports ou syntaxes peuvent poser problème.

---

## 11. Structure détaillée de Hero3D

### Imports nécessaires

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
```

### Conteneur, Canvas, caméra et options WebGL

**Code complet du composant exporté** :

```tsx
export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        className="!absolute inset-0"
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-background/70 pointer-events-none" />
    </div>
  );
}
```

- **Premier `div`** : `absolute inset-0 z-0` pour que le Canvas occupe tout l’espace du Hero et reste derrière le contenu.
- **`Canvas`** :
  - **`camera={{ position: [0, 0, 4], fov: 50 }}`** : caméra à 4 unités en z, champ de vue 50°.
  - **`gl={{ alpha: true, antialias: true }}`** : fond transparent + antialiasing.
  - **`className="!absolute inset-0"`** : le Canvas remplit le conteneur.
- **Deuxième `div`** : overlay semi-transparente (`bg-background/70`) pour garder le texte lisible ; **`pointer-events-none`** pour pouvoir cliquer à travers (boutons, liens).

---

## 12. La scène : lumières et formes (syntaxe complète)

### Lumières — code à mettre dans la scène

```tsx
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#b84ef0" />
      <pointLight position={[3, -1, 1]} intensity={0.4} color="#e06bcf" />
      {/* meshes ici */}
    </>
  );
}
```

### Un mesh complet (ex. Sphere) — géométrie + matériau + Float + useFrame

```tsx
function Sphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 0, -1]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#e06bcf"
          wireframe
          transparent
          opacity={0.6}
          emissive="#e06bcf"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}
```

- **`ref={ref}`** sur le `<mesh>` : pour pouvoir modifier `rotation` (ou position) dans **useFrame**.
- **`useFrame((_, delta) => { ... })`** : appelé à chaque frame ; **delta** = temps en secondes depuis la dernière frame.
- **`emissive`** et **`emissiveIntensity`** : donnent une légère « lueur » au matériau (sans lumière directe il reste visible).

### Autres formes (extraits de syntaxe)

**Dodécaèdre (wireframe + meshBasicMaterial)** :

```tsx
<mesh ref={ref} position={[1.8, 0.6, -2]}>
  <dodecahedronGeometry args={[0.35, 0]} />
  <meshBasicMaterial
    color="#b84ef0"
    wireframe
    transparent
    opacity={0.5}
  />
</mesh>
```

**Cube (box)** :

```tsx
<mesh ref={ref} position={[1.4, -0.5, -2.2]}>
  <boxGeometry args={[0.35, 0.35, 0.35]} />
  <meshStandardMaterial color="#e06bcf" wireframe transparent opacity={0.45} />
</mesh>
```

**Tétraèdre** :

```tsx
<mesh ref={ref} position={[-1.2, 0.8, -2]}>
  <tetrahedronGeometry args={[0.3, 0]} />
  <meshBasicMaterial color="#b84ef0" transparent opacity={0.5} wireframe />
</mesh>
```

---

## 13. L’animation frame par frame : useFrame

**useFrame** est un hook fourni par **@react-three/fiber**. Il est appelé **à chaque image** par le moteur de rendu.

**Signature et utilisation** :

```tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function MonObjet() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // state : infos sur le rendu (caméra, etc.)
    // delta : temps en secondes depuis la dernière frame
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;  // rotation autour de l’axe Y
      // ref.current.rotation.x += delta * 0.1;  // ex. rotation X
      // ref.current.position.y += delta * 0.5;  // ex. déplacer vers le haut
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

- **`ref`** : doit pointer vers le `<mesh>` (ou un `group`) dont on modifie les propriétés.
- **`delta`** : permet des animations **indépendantes du framerate** en multipliant par une vitesse (ex. `0.12` rad/s).
- On peut modifier **rotation** (x, y, z), **position**, **scale**, etc. sur `ref.current`.

---

## 14. Float (Drei) — flottement sans coder useFrame

**Import** :

```tsx
import { Float } from "@react-three/drei";
```

**Syntaxe** : on enveloppe un ou plusieurs enfants (souvent un `<mesh>`).

```tsx
<Float
  speed={1.5}           // vitesse du cycle (nombre)
  rotationIntensity={0.2}   // amplitude rotation
  floatIntensity={0.5}      // amplitude mouvement vertical / flottement
>
  <mesh position={[0, 0, -1]}>
    <icosahedronGeometry args={[0.5, 1]} />
    <meshStandardMaterial color="#e06bcf" wireframe />
  </mesh>
</Float>
```

On peut combiner **Float** (pour le flottement) et **useFrame** (pour une rotation personnalisée) sur le même mesh en mettant le **ref** sur le `<mesh>` et en utilisant **useFrame** à l’intérieur du même composant.

---

## 15. Résumé du flux, de l’ouverture de la page à l’affichage 3D

1. L’utilisateur ouvre la page ; le Hero s’affiche avec le texte et un fallback (fond).
2. Le navigateur charge le chunk contenant `Hero3D`, Three.js, R3F et Drei (dynamic import).
3. Quand le chunk est prêt, **Hero3D** est rendu : **Canvas** crée le contexte WebGL, la scène, la caméra, les lumières et les meshes.
4. La boucle de rendu tourne : à chaque frame, **useFrame** met à jour les rotations et **Float** met à jour le flottement.
5. L’overlay semi-transparente reste au-dessus pour la lisibilité du texte.

Tout se passe **côté client** ; le serveur ne fait aucun rendu 3D.

---

## 16. Modifier la scène — où coder quoi

| Objectif | Fichier | À coder |
|----------|---------|--------|
| Formes, positions, couleurs, lumières | `src/components/Hero3D.tsx` | Géométries, matériaux, positions, `<Float>`, `useFrame`. |
| Chargement et intégration dans la page | `src/components/Hero.tsx` | `dynamic`, `Suspense`, fallback. |
| Build Next.js | `next.config.mjs` | `transpilePackages`. |

### Exemple : ajouter une nouvelle forme (sphère pleine, sans wireframe)

1. Créer un composant dans `Hero3D.tsx` :

```tsx
function MaNouvelleSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1;
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={[0, 1.2, -1.5]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#b84ef0"
          transparent
          opacity={0.8}
          emissive="#b84ef0"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}
```

2. L’ajouter dans **Scene** :

```tsx
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#b84ef0" />
      <pointLight position={[3, -1, 1]} intensity={0.4} color="#e06bcf" />
      <Sphere />
      <Dodecahedron />
      <Octahedron />
      <Tetrahedron />
      <Box />
      <MaNouvelleSphere />
    </>
  );
}
```

- **`<sphereGeometry args={[rayon, segmentsWidth, segmentsHeight]} />`** : sphère lisse (pas en fil de fer). Plus les segments sont élevés, plus la sphère est ronde (et coûteuse en triangles).

Avec ces exemples de code, tu peux reproduire chaque élément (Canvas, lumières, meshes, useFrame, Float) directement dans le projet ou dans une nouvelle scène.
