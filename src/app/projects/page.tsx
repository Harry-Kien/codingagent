import { ProjectHistoryList } from "@/components/history/ProjectHistoryList";

export default function ProjectsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Project History</h1>
        <p className="mt-2 text-sm text-zinc-600">Open, duplicate, delete, and export locally saved project kits.</p>
      </div>
      <ProjectHistoryList />
    </div>
  );
}
