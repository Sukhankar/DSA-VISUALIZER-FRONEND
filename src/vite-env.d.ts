/// <reference types="vite/client" />

declare module '@tailwindcss/vite' {
  const plugin: any;
  export default plugin;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
