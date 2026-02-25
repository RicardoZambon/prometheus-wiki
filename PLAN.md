# Implementation Plan: Categories, User Management & Markdown Editor Fix

## Current State Analysis

- **Backend**: ASP.NET Core API with EF Core (MySQL), JWT auth, 3 roles: User/WikiEditor/Admin
- **Frontend**: Angular 19 + Tailwind CSS 4 + EasyMDE + FontAwesome
- **Categories**: Backend CRUD exists (`CategoriesController`) but no admin UI to create/manage them
- **User Management**: Admin-only user listing + role toggling exists, but no way to **create** users from admin, and no granular permission for user management
- **Markdown Editor**: EasyMDE is installed (`easymde` in package.json) but its CSS is **not imported** — the editor renders without styles

---

## Feature 1: Category Management (Admin)

The `CategoriesController` already has POST/PUT endpoints restricted to Admin. We need the frontend admin UI.

### Backend Changes
- **Add DELETE endpoint** to `CategoriesController` — admin-only, with check that category has no topics before allowing delete

### Frontend Changes
- **Create `category-list.component.ts`** in `features/admin/components/` — CRUD table with:
  - List of categories showing name, description, topic count, creation date
  - Inline "Add Category" form (name + description fields)
  - Edit button that toggles inline editing
  - Delete button with confirmation
- **Add category service methods** to `AdminService`:
  - `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()`
- **Add route** in `admin.routes.ts`: `{ path: 'categories', ... canActivate: [authGuard, roleGuard('Admin')] }`
- **Add sidebar link**: "Categories" under Admin section in `sidebar.component.ts`

---

## Feature 2: User Management (with roles)

### Concept
- Add a new role: **UserManager** (id: 4)
- Admins can do everything (create users, assign any role including Admin)
- UserManagers can create users and assign non-Admin roles
- The "Users" admin page becomes accessible to both Admin and UserManager roles

### Backend Changes

1. **Add `UserManager` role** to `RoleConfiguration.cs` seed data (id: 4, name: "UserManager")
2. **New migration** for the added role
3. **Create `UsersController`** (separate from `AdminController`) or add endpoints to `AdminController`:
   - `POST /api/admin/users` — create a new user (Admin or UserManager)
   - Request DTO: `CreateUserRequest` with username, email, password, languagePreference, roleIds
   - Validation: if caller is UserManager (not Admin), reject if roleIds contains Admin role (id=3)
4. **Update `AdminController` authorization**:
   - Change user-related endpoints from `[Authorize(Roles = "Admin")]` to `[Authorize(Roles = "Admin,UserManager")]`
   - Keep settings endpoints Admin-only
   - Add role-assignment validation: UserManagers cannot assign/remove the Admin role

### Frontend Changes

1. **Update `admin.routes.ts`**: Change users route guard from `roleGuard('Admin')` to `roleGuard('Admin', 'UserManager')`
2. **Update `sidebar.component.ts`**: Show Users link for both Admin and UserManager roles
3. **Update `user-list.component.ts`**:
   - Add "Create User" button that opens a modal/form
   - The form has: username, email, password, language preference, role checkboxes
   - If current user is UserManager (not Admin), hide the "Admin" role checkbox
   - Add to `allRoles` array the new UserManager role (id: 4)
   - Restrict role toggle: UserManagers cannot toggle Admin role
4. **Update `AdminService`**:
   - Add `createUser()` method
5. **Update `admin.model.ts`**: Add `CreateUserRequest` interface

---

## Feature 3: Fix Markdown Editor

### Root Cause
EasyMDE's CSS (`easymde/dist/easymde.min.css`) is **not included** in the build. The `angular.json` styles array only has `src/styles.css`, and `styles.css` does not import the EasyMDE CSS. The dark-mode overrides in `styles.css` exist but the base styles are missing.

### Fix
- **Add EasyMDE CSS import** to `styles.css`: `@import "easymde/dist/easymde.min.css";` before the dark mode overrides
- This is the simplest fix — alternatively it could be added to `angular.json` styles array, but since we already have EasyMDE-related CSS in `styles.css`, keeping it together is cleaner

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `styles.css` | Edit | Add EasyMDE CSS import |
| `CategoriesController.cs` | Edit | Add DELETE endpoint |
| `RoleConfiguration.cs` | Edit | Add UserManager seed |
| `AdminController.cs` | Edit | Split auth, add create user, role validation |
| `DTOs/Requests/CreateUserRequest.cs` | New | Create user DTO |
| `admin.service.ts` | Edit | Add category + user methods |
| `admin.model.ts` | Edit | Add interfaces |
| `category-list.component.ts` | New | Category CRUD admin page |
| `admin.routes.ts` | Edit | Add category route, update user guard |
| `sidebar.component.ts` | Edit | Add categories link, update user visibility |
| `user-list.component.ts` | Edit | Add create user modal, UserManager role, restrictions |
| New EF migration | New | For UserManager role |

## Order of Implementation
1. Fix markdown editor (quick win)
2. Category management admin UI
3. User management enhancements (new role, create user, permissions)
4. EF Core migration
5. Commit and push
