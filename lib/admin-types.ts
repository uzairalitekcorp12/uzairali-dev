export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};

export type AdminNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminReminder = {
  id: string;
  title: string;
  dueAt: string;
  done: boolean;
  createdAt: string;
};

export type AdminData = {
  submissions: ContactSubmission[];
  notes: AdminNote[];
  reminders: AdminReminder[];
};
