import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirige automáticamente a la vista de mobiliario
  redirect("/admin/mobiliario");
}
