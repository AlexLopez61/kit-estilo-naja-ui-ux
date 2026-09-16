// Tipos globales del kit. Next declara '*.module.css' pero no el import
// de efecto ('./globals.css'); TypeScript 6 lo exige (TS2882).
declare module '*.css';
