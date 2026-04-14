import { useState } from "react"
import Sidebar from "./Sidebar"
import PasswordList from "./PasswordList"
import DetailPanel from "./DetailPanel"
import { useCallback, useContext, useEffect } from "react"
import { getAllCredentialsApi, addOneCredentialApi } from "../api/index"
import { AuthContext } from "../context/AuthContext"
import AddPasswordModal from "./AddPasswordModal"

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
  const { user } = useContext(AuthContext)
  const [entries, setState] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getAllCredentialsApi(user?.uid).then(({ data }) => {
        setState(data)
        setSelectedEntry(data[0])
      })
    }
  }, [user, setState])

  const encryptOne = useCallback(() => {
    setState((prevState: any) => ({
      ...prevState,
      activeTab: 2,
    }))
  }, [setState])

  const decryptItem = (e: any, item: any) => {
    e.preventDefault()
    setState((prevState: any) => ({
      ...prevState,
      activeTab: 3,
      activeCredential: item,
    }))
  }

  function handleEdit(entry) {
    // TODO: open edit modal / form
    console.log("Edit", entry)
  }

  function handleDelete(entry) {
    // TODO: confirm + delete
    console.log("Delete", entry)
  }

  const addOne = (entry: any) => {
    addOneCredentialApi({
      ...entry,
      master_password: entry.mpassword,
      user_id: user?.uid,
      inputs: {},
    })
      .then(({ data }) => {
        setState([...entries, data])
        // setEntries((prev) => [...prev, data])
        setModalOpen(false)
      })
      .then(() => {
        // setFormData(createNewFormData())
      })
      .then(() => {
        // goHome()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden">
      <Sidebar activeId="all" onAddNew={() => setModalOpen(true)} />

      <PasswordList
        entries={entries}
        selectedId={selectedEntry?.id}
        onSelect={setSelectedEntry}
      />

      {selectedEntry && (
        <DetailPanel
          entry={selectedEntry}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddPasswordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(entry) => {
          addOne(entry)
        }}
      />
    </div>
  )
}
