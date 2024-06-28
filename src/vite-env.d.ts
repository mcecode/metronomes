/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_BPM: string;
  readonly VITE_DEFAULT_FREQUENCY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
