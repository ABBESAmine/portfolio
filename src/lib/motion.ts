/**
 * Source unique des valeurs de motion du site.
 *
 * Rien d'autre ne définit de durée ni de courbe : `tailwind.config.ts` importe
 * ce fichier pour émettre les variables CSS (`--duration-*`, `--ease-*`) et les
 * utilitaires Tailwind correspondants, et les composants qui pilotent GSAP ou
 * des styles inline importent les mêmes constantes. Changer une valeur ici la
 * change partout, CSS comprise.
 */

/**
 * Durées en millisecondes.
 *
 * Les quatre premières couvrent les interactions répétées et restent sous
 * 300 ms. `reveal` et `entrance` les dépassent volontairement : ce sont des
 * apparitions vues une fois par section (scroll) ou une fois par visite
 * (séquence d'ouverture du Hero), pas des gestes que l'utilisateur répète.
 */
export const duration = {
  /** Feedback de press (`active:scale`). */
  press: 120,
  /** Hover, changement de couleur, crossfade d'icône. */
  fast: 150,
  /** Panneaux, overlays, entrée du tilt. */
  base: 200,
  /** Retour au repos d'un élément manipulé (sortie de tilt). */
  slow: 250,
  /** Apparition au scroll — hors interaction répétée. */
  reveal: 450,
  /** Séquence d'entrée du Hero — vue une fois par visite. */
  entrance: 600,
} as const;

/**
 * Courbes d'easing. Les défauts CSS (`ease-out`, `ease`) sont trop mous pour
 * de l'UI : ils manquent le coup de fouet initial qui rend une animation
 * intentionnelle.
 */
export const ease = {
  /** Entrées, sorties, hover — démarre vite, donc répond vite. */
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  /** Déplacement d'un élément déjà à l'écran. */
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
} as const;

/** Équivalent GSAP de `ease.out`. GSAP n'accepte pas les cubic-bezier CSS. */
export const gsapEase = {
  out: "expo.out",
} as const;

/** Décalages de stagger, en secondes (unité GSAP). */
export const stagger = {
  /** Grille dense : badges de compétences. */
  tight: 0.04,
  /** Liste courte : liens de nav, cartes. */
  loose: 0.06,
} as const;

/**
 * Facteur de lissage des suivis de souris (0 = figé, 1 = collé au curseur).
 * Un suivi non lissé paraît artificiel : le mouvement n'a aucune inertie.
 */
export const LERP = 0.12;

/** Millisecondes → secondes, pour GSAP qui raisonne en secondes. */
export const sec = (ms: number) => ms / 1000;

/** Millisecondes → chaîne CSS, pour les styles inline. */
export const msValue = (ms: number) => `${ms}ms`;

type Offset = { x?: number; y?: number };

/**
 * État de départ d'une apparition au scroll.
 *
 * En motion réduit on retire le déplacement mais on garde le fondu : « reduced »
 * veut dire moins de mouvement, pas plus d'animation du tout — le fondu aide
 * encore à comprendre qu'un bloc vient d'arriver.
 *
 * À passer à `gsap.fromTo` : les propriétés absentes du `from` ne sont pas
 * animées, donc GSAP n'écrit aucun `transform` quand `reduced` est vrai.
 */
export function revealFrom(offset: Offset, reduced: boolean) {
  return reduced ? { opacity: 0 } : { opacity: 0, ...offset };
}
