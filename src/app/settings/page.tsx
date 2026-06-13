import { ProviderSettingsForm } from "@/components/settings/ProviderSettingsForm";
import { McpConnectionCard } from "@/components/settings/McpConnectionCard";
import { ProductionReadinessPanel } from "@/components/settings/ProductionReadinessPanel";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Settings</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Configure local provider profiles, cost routing defaults, and MCP/external connection plans.
        </p>
      </div>
      <ProductionReadinessPanel />
      <ProviderSettingsForm />
      <McpConnectionCard />
    </div>
  );
}
