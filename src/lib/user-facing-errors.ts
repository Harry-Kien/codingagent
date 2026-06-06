export type UserFacingErrorCode =
  | "invalid_request"
  | "invalid_api_key"
  | "provider_timeout"
  | "quota_exceeded"
  | "invalid_model"
  | "provider_unreachable"
  | "rate_limited"
  | "supabase_not_configured"
  | "unauthorized"
  | "provider_not_configured"
  | "generation_failed";

export type UserFacingError = {
  code: UserFacingErrorCode;
  title: string;
  message: string;
  nextStep: string;
};

const errorMap: Record<UserFacingErrorCode, Omit<UserFacingError, "code">> = {
  invalid_request: {
    title: "Invalid request",
    message: "VibeForge could not understand this request.",
    nextStep: "Refresh the page and try again with the current form values.",
  },
  invalid_api_key: {
    title: "Invalid API key",
    message: "The provider rejected the API key or permissions.",
    nextStep: "Create a new provider key, update Settings, then test the connection again.",
  },
  provider_timeout: {
    title: "Provider timeout",
    message: "The provider took too long to respond.",
    nextStep: "Use Fast mode, lower the token limit, or try a faster model.",
  },
  quota_exceeded: {
    title: "Quota or credit limit reached",
    message: "The provider reported a rate, quota, billing, or credit limit.",
    nextStep: "Check provider credits and rate limits, then retry later.",
  },
  invalid_model: {
    title: "Invalid model",
    message: "The selected model was not found or is unavailable for this key.",
    nextStep: "Use the exact model ID from your provider dashboard.",
  },
  provider_unreachable: {
    title: "Provider unreachable",
    message: "VibeForge could not reach the provider endpoint.",
    nextStep: "Check the base URL, network access, and provider status.",
  },
  rate_limited: {
    title: "Too many requests",
    message: "This browser or IP has made too many generation requests in a short time.",
    nextStep: "Wait briefly, then try again.",
  },
  supabase_not_configured: {
    title: "Supabase not configured",
    message: "The server provider vault needs Supabase server variables before it can be used.",
    nextStep: "Set Supabase URL, service role key, and provider key secret on the server.",
  },
  unauthorized: {
    title: "Sign in required",
    message: "Saved provider profiles can only be used by the signed-in owner.",
    nextStep: "Sign in again, then retry the provider request.",
  },
  provider_not_configured: {
    title: "Provider not configured",
    message: "No usable provider key or saved provider profile is available.",
    nextStep: "Use demo mode or add and test a provider in Settings.",
  },
  generation_failed: {
    title: "Generation failed",
    message: "The generation request failed before a usable kit was returned.",
    nextStep: "Try demo mode first, then re-test provider settings.",
  },
};

export function userFacingError(code: UserFacingErrorCode, override?: Partial<UserFacingError>): UserFacingError {
  return {
    code,
    ...errorMap[code],
    ...override,
  };
}

export function classifyUserFacingError(message?: string | null): UserFacingError {
  const value = (message ?? "").toLowerCase();
  if (value.includes("api key") || value.includes("permissions") || value.includes("rejected") || value.includes("401") || value.includes("403")) {
    return userFacingError("invalid_api_key");
  }
  if (value.includes("timed out") || value.includes("timeout") || value.includes("504") || value.includes("408")) {
    return userFacingError("provider_timeout");
  }
  if (value.includes("quota") || value.includes("credit") || value.includes("billing") || value.includes("rate limit") || value.includes("429")) {
    return userFacingError("quota_exceeded");
  }
  if (value.includes("model") || value.includes("invalid_model") || value.includes("model_not_found") || value.includes("404")) {
    return userFacingError("invalid_model");
  }
  if (value.includes("supabase") || value.includes("vault is not configured")) {
    return userFacingError("supabase_not_configured");
  }
  if (value.includes("sign in") || value.includes("signed-in")) return userFacingError("unauthorized");
  if (value.includes("missing") || value.includes("not configured")) return userFacingError("provider_not_configured");
  if (
    value.includes("unreachable") ||
    value.includes("fetch failed") ||
    value.includes("service is unavailable") ||
    value.includes("blocked") ||
    value.includes("network") ||
    value.includes("econnrefused") ||
    value.includes("dns") ||
    value.includes("failed to fetch")
  ) {
    return userFacingError("provider_unreachable");
  }
  return userFacingError("generation_failed", message ? { message } : undefined);
}
