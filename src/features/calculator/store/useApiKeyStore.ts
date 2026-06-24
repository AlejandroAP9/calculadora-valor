import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store BYOK: guarda la API key de OpenRouter del usuario SÓLO en el localStorage
 * de su propio navegador (clave `cv-openrouter-key`). Nunca viaja a nuestra BD;
 * sólo se manda al endpoint en el momento de calcular. Cada quien paga su consumo.
 */
interface ApiKeyState {
  apiKey: string
  setApiKey: (apiKey: string) => void
  clearApiKey: () => void
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (apiKey) => set({ apiKey: apiKey.trim() }),
      clearApiKey: () => set({ apiKey: '' }),
    }),
    { name: 'cv-openrouter-key' },
  ),
)
