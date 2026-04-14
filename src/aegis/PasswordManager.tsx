import { useState } from "react"
import Sidebar from "./Sidebar"
import PasswordList from "./PasswordList"
import DetailPanel from "./DetailPanel"

// Sample data — replace with your actual state/API
const SAMPLE_ENTRIES = [
  {
    id: "1",
    name: "Facebook",
    url: "https://facebook.com",
    username: "sankar.boro@yahoo.com",
    password: "EXXZj7BZd32DSUl7U+7lCvwHkygOTyu50sxz5hbJX616B6e=",
    strength: "strong",
    updatedAt: "2d ago",
  },
  {
    id: "2",
    name: "Google",
    url: "https://google.com",
    username: "sankar.boro@gmail.com",
    password: "Sup3rS3cur3G00gl3!",
    strength: "strong",
    updatedAt: "5d ago",
  },
  {
    id: "3",
    name: "GitHub",
    url: "https://github.com",
    username: "sankar_dev",
    password: "gh_pat_abc123xyz",
    strength: "medium",
    updatedAt: "12d ago",
  },
  {
    id: "4",
    name: "Netflix",
    url: "https://netflix.com",
    username: "sankar.boro@yahoo.com",
    password: "netflix123",
    strength: "weak",
    updatedAt: "1mo ago",
  },
  {
    id: "5",
    name: "Twitter / X",
    url: "https://x.com",
    username: "@sankar_boro",
    password: "Tw1tt3r!Secur3#2024",
    strength: "strong",
    updatedAt: "3mo ago",
  },
]

export default function PasswordManager() {
  const [entries] = useState(SAMPLE_ENTRIES)
  const [selectedEntry, setSelectedEntry] = useState(SAMPLE_ENTRIES[0])

  function handleEdit(entry) {
    // TODO: open edit modal / form
    console.log("Edit", entry)
  }

  function handleDelete(entry) {
    // TODO: confirm + delete
    console.log("Delete", entry)
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden">
      <Sidebar activeId="all" onAddNew={() => console.log("Add new")} />

      <PasswordList
        entries={entries}
        selectedId={selectedEntry?.id}
        onSelect={setSelectedEntry}
      />

      <DetailPanel
        entry={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
