export interface Task {
  id: string;
  name: string;
  href: string;
  status: "Pending" | "Completed";
  category: "School" | "Personal";
  dueDate: string;
}