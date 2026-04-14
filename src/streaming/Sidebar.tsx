import { useState } from "react"
import {
  ShieldCheck,
  LayoutList,
  Star,
  Globe,
  Briefcase,
  CreditCard,
  UserCircle,
  Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Bubble Sort", icon: LayoutList, id: "bubble" },
  { label: "Selection Sort", icon: Star, id: "selection" },
  { label: "Merge Sort", icon: Star, id: "merge" },
]

const CATEGORIES = [
  { label: "Social", icon: Globe, id: "social" },
  { label: "Work", icon: Briefcase, id: "work" },
  { label: "Finance", icon: CreditCard, id: "finance" },
]

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 group ${
        active
          ? "bg-violet-100 text-violet-700 font-medium dark:bg-violet-900/40 dark:text-violet-300"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      }`}
    >
      <item.icon
        size={15}
        className={active ? "text-violet-600 dark:text-violet-400" : ""}
      />
      <span className="flex-1 text-left">{item.label}</span>
      {/* <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-violet-200 text-violet-700 dark:bg-violet-800 dark:text-violet-300"
            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
        }`}
      >
        {item.count}
      </span> */}
    </button>
  )
}

export default function Aside({ setSortingName }) {
  const [selected, setSelected] = useState(1)

  function handleSelect(id) {
    setSelected(id)
    setSortingName(id)
  }

  return (
    <aside className="w-80 shrink-0 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
            Algorithms
          </span>
        </div>
      </div>

      {/* Add New Button */}
      {/* <div className="px-3 mb-4">
          <button
            // onClick={onAddNew}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-medium transition-all duration-150"
          >
            <Plus size={14} />
            Add new
          </button>
        </div> */}

      {/* Library */}
      <div className="px-3 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-2 mb-1">
          Templates
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={selected === item.id}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-2 mb-1">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={selected === item.id}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-3 pb-4 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <div className="flex flex-col gap-0.5">
          {[
            { label: "Account", icon: UserCircle },
            { label: "Settings", icon: Settings },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-all duration-150"
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
