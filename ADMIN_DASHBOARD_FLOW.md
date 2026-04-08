# Admin Dashboard Flow and Overview

## Purpose
This document explains the recent Admin Dashboard refactor so you can understand:
- what changed,
- how data flows,
- how actions work,
- what to test when you run the app.

---

## What Changed (High Level)
The admin area is now split into clear layers:

- Page structure and tab layout: `src/pages/AdminPanel.tsx`
- Modular admin tables and actions: `src/components/admin/AdminTables.tsx`
- Overview widgets: `src/components/admin/DashboardStats.tsx`, `src/components/admin/ActivityInsights.tsx`
- Data + API orchestration (single source of truth): `src/store/componentStore.ts`

Main improvement: instead of one global loading/error state, each section now has independent status.

---

## State Model (Store)
In `componentStore.ts`, the store now tracks:

### Section state (for table/widget data)
- `sectionLoading`: loading per section (`components`, `users`, `requests`, `logs`)
- `sectionError`: error per section

This means one failing API does not block the full dashboard.

### Mutation state (for actions)
- `mutationLoading`: loading per action (`addComponent`, `submitRequest`, `updateRequestStatus`, `deleteComponent`)
- `mutationError`: error per action

This keeps action feedback clear and avoids duplicated local state logic in components.

---

## Initial Load Flow
When Admin panel opens:

1. `AdminPanel` calls `fetchData()` once.
2. `fetchData()` runs these in parallel:
   - `fetchComponents()`
   - `fetchUsers()`
   - `fetchRequests()`
   - `fetchLogs()`
3. Each fetch updates its own `sectionLoading` and `sectionError`.
4. UI sections render based on their own state:
   - Loading row/message
   - Error row/message
   - Empty row/message
   - Actual data table/cards

Result: partial dashboard still works even if one endpoint fails.

---

## Requests Section Flow
File: `src/components/admin/AdminTables.tsx`

### Table columns now include:
- Title
- Description preview (truncated)
- Requested by
- Date submitted
- Status
- Actions

### View Details
- Click "View Details"
- Opens modal with full request description
- Shows requester context

### Approve / Reject
- Available only for pending requests
- Calls `updateRequestStatus(id, status)` from store

#### Approve path does:
1. Update request status to approved
2. Add activity log (`REQUEST_APPROVED`)
3. Create a component from request data
4. Add activity log for component creation
5. Refresh requests and components

#### Reject path does:
1. Update request status to rejected
2. Add activity log (`REQUEST_REJECTED`)
3. Refresh requests

---

## Components Section Flow
File: `src/components/admin/AdminTables.tsx`

### Delete Component
- Click Delete button in a row
- Confirmation dialog appears
- Confirm triggers `deleteComponent(id)` in store

### Delete action does:
1. Delete component from JSON server
2. Add delete activity log (`DELETE_COMPONENT`)
3. Refresh components list

This prevents accidental deletion and guarantees post-action table refresh.

---

## Overview Widgets Behavior
Files:
- `src/components/admin/DashboardStats.tsx`
- `src/components/admin/ActivityInsights.tsx`

Widgets now respond to section states:
- show loading text while data is loading
- show fallback error text if that section failed
- show empty text if no data exists

This matches production dashboard behavior and improves resilience.

---

## AdminPanel Behavior
File: `src/pages/AdminPanel.tsx`

- Tabs are still: overview, components, users, requests, settings
- Add Component modal still works, but submit button now respects mutation loading state
- Store-level error is shown as a non-blocking banner instead of replacing all content

---

## How to Run and Verify
From project root (`ReactHub`):

1. Start API:
   - `npm run server`
2. Start app:
   - `npm run dev`
3. Open Admin panel and verify:
   - requests table shows all new columns
   - View Details modal opens and shows full description
   - Approve and Reject work and update status
   - Delete component requires confirmation and refreshes list
   - Overview cards and activity areas show proper loading/empty/error behavior

---

## Why This Structure Is Better
- Clear separation: page layout vs table UI vs store logic
- Single source of truth in Zustand store
- No duplicate async state logic in every component
- Easier to scale with new admin features (new sections/actions can reuse same pattern)

---

## Suggested Next Improvements (Optional)
- Per-row loading indicators for request actions (only clicked row disabled)
- Toast notifications for action success/failure
- Shared modal component for better reuse across admin features
- Request filters (pending/approved/rejected) if data grows
