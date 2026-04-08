# ReactHub — Dynamic Component System: Architecture & Flow

> How the Admin Panel, Zustand Store, JSON Server, and Gallery all connect together.

---

## 🧱 Tech Stack (New Additions)

| Package | Role |
|---------|------|
| `zustand` | Global state manager — holds the components list in memory |
| `axios` | Makes HTTP requests (GET/POST) to JSON Server |
| `json-server` | Fake REST API that reads/writes `db.json` |
| `localStorage` | Offline cache — works even when JSON Server is stopped |

---

## 📁 Key Files

```
ReactHub/
├── db.json                          ← your database (JSON file)
├── src/
│   ├── types/
│   │   └── component.ts             ← ComponentMeta interface (the shape of data)
│   ├── store/
│   │   └── componentStore.ts        ← Zustand store (global state + API calls)
│   └── pages/
│       ├── AdminPanel.tsx           ← Add new components via form
│       ├── GalleryPage.tsx          ← Shows all components fetched from store
│       └── ComponentDetailPage.tsx  ← Shows one component by ID
```

---

## 🔄 Complete Data Flow

### 1. START — Boot up both servers

```bash
# Terminal 1
npm run server
# → Starts JSON Server on http://localhost:5000
# → Watches db.json for changes

# Terminal 2
npm run dev
# → Starts Vite on http://localhost:5173
```

---

### 2. GALLERY — How the list loads

**URL:** `http://localhost:5173/gallery`

```
User visits /gallery
      │
      ▼
GalleryPage.tsx mounts
      │
      │  useEffect(() => { fetchComponents() }, [])
      ▼
componentStore.ts → fetchComponents()
      │
      │  axios.GET http://localhost:5000/components
      ▼
JSON Server reads db.json
      │
      │  returns array of components
      ▼
componentStore.ts
      │  set({ components: data })       ← Zustand state updated
      │  saveToStorage(data)             ← also saved to localStorage
      ▼
GalleryPage.tsx re-renders
      │
      │  components.map(comp => <ComponentCard />)
      ▼
User sees cards on screen ✅
```

**If JSON Server is OFF:**
- The catch block fires
- LocalStorage cache is loaded instead
- Gallery still works with last known data

---

### 3. ADMIN PANEL — How a new component is added

**URL:** `http://localhost:5173/admin`

```
User fills the form fields:
  id, title, category, description,
  componentCode, usageCode, cssCode (optional)
      │
      │  clicks "Add Component"
      ▼
AdminPanel.tsx → validates form
      │  • All required fields filled?
      │  • Is the id unique? (checks current components[])
      ▼
AdminPanel.tsx → calls addComponent(form)
      │
      ▼
componentStore.ts → addComponent()
      │
      │  axios.POST http://localhost:5000/components
      │  body: { id, title, category, ... }
      ▼
JSON Server writes new entry to db.json
      │
      │  responds with the saved object
      ▼
componentStore.ts → calls fetchComponents() again
      │  (re-fetches the full list to stay in sync)
      ▼
Zustand state updated: components[] now includes new item
      ▼
AdminPanel.tsx:
  ✓ shows success banner
  ✓ clears the form

User navigates to /gallery → new card appears instantly ✅
```

---

### 4. DETAIL PAGE — How a single component loads

**URL:** `http://localhost:5173/component/:id`  
e.g. `http://localhost:5173/component/animated-list`

```
User clicks a card (or navigates directly)
      │
      ▼
ComponentDetailPage.tsx mounts
      │
      │  const { id } = useParams()   ← reads "animated-list" from URL
      │
      │  if (components.length === 0) fetchComponents()
      │  (only fetches if store is empty, e.g. direct URL visit)
      ▼
const component = components.find(c => c.id === id)
      │
      ├── found  → renders title, description, code, install block
      └── not found → shows "Component not found" + back button
```

---

## 🗄️ Data Shape — `ComponentMeta`

Defined in `src/types/component.ts`:

```ts
interface ComponentMeta {
  id: string;           // unique slug, e.g. "animated-list"
  title: string;        // display name, e.g. "Animated List"
  category: string;     // e.g. "Components", "Animated"
  description: string;  // one-line summary
  componentCode: string;// full source code of the component
  usageCode: string;    // usage / example snippet
  cssCode?: string;     // optional CSS styles
  installCmd?: {        // optional install commands
    npm?: string;
    pnpm?: string;
    yarn?: string;
    bun?: string;
  };
}
```

---

## 🏪 Zustand Store — `componentStore.ts`

The store is the **single source of truth** for all component data.

```
useComponentStore() exposes:
  ├── components[]    ← the list (read by Gallery + Detail pages)
  ├── loading         ← true while fetching (shows spinner)
  ├── error           ← non-null when server is unreachable
  ├── fetchComponents()  ← GET all from JSON Server
  └── addComponent()     ← POST new one, then refetch
```

Any page that calls `useComponentStore()` shares the **same state**.  
When `components[]` updates → all subscribed components re-render automatically.

---

## 🔌 JSON Server Endpoints

| Method | URL | Action |
|--------|-----|--------|
| `GET` | `http://localhost:5000/components` | Return all components |
| `GET` | `http://localhost:5000/components/:id` | Return one component |
| `POST` | `http://localhost:5000/components` | Add a new component |
| `PUT` | `http://localhost:5000/components/:id` | Replace a component |
| `PATCH` | `http://localhost:5000/components/:id` | Update a field |
| `DELETE` | `http://localhost:5000/components/:id` | Remove a component |

All data is persisted in `db.json` automatically.

---

## 🛣️ Routes Summary (`App.tsx`)

| Path | Page | Description |
|------|------|-------------|
| `/` | `LandingPage` | Home / hero |
| `/gallery` | `GalleryPage` | Browse all components |
| `/component/:id` | `ComponentDetailPage` | Single component detail |
| `/admin` | `AdminPanel` | Add new components |
| `/components` | `ComponentPage` | Static components page |
| `/request` | `RequestPage` | Request a component |
| `/feedback` | `FeedbackPage` | Submit feedback |
| `/login` | `LoginPage` | Login |
| `/signup` | `Signup` | Register |

---

## ✅ Quick Start Checklist

```bash
# 1. Install dependencies (already done)
npm install

# 2. Start JSON Server (keep this terminal open)
npm run server

# 3. Start the React app (new terminal)
npm run dev

# 4. Open the app
# http://localhost:5173/gallery  → browse components
# http://localhost:5173/admin    → add a new component
```
