export const DEFAULT_TEMPLATE = `Hi [[{"value":"NAME"}]],
We are pleased to offer you the [[{"value":"ROLE"}]] role.
Your CTC is Rs [[{"value":"CTC_IN_LAKHS"}]] per year.`

export const API_URL = import.meta.env.VITE_API ?? "";

export const VARIABLES_FROM_TEMPLATE_RE = /\[\[\s*{"value"\s*:\s*"([^"]+)"\s*}\s*\]\]/g;