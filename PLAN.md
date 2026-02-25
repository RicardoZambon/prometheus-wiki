# Implementation Plan: Advanced WYSIWYG Text Editor

## Goal
Replace the current EasyMDE markdown editor with a Confluence/Notion-like WYSIWYG editor where users edit formatted content directly (no raw markdown visible), while still saving content as markdown in the database.

---

## Editor Research Summary

Six editors were evaluated for Angular 19 compatibility, markdown serialization, licensing, and UX quality:

| Editor | Angular 19 | Markdown Native | License | Confluence/Notion Feel | Verdict |
|--------|-----------|----------------|---------|----------------------|---------|
| **TipTap** | Yes (ngx-tiptap v14) | Yes (@tiptap/markdown) | MIT (free) | Yes (with toolbar/extensions) | Strong candidate |
| **Milkdown** | Yes (ng-milkdown-crepe) | Yes (core design) | MIT (free) | Yes (Crepe preset) | Top pick |
| BlockNote | No wrapper | N/A | MPL 2.0 | N/A | Eliminated (React-only) |
| CKEditor 5 | Yes (official) | Yes (plugin) | GPL or $144+/mo | Yes | Too expensive for commercial |
| TinyMCE | Yes (official) | Premium only ($) | GPL or $25+/mo | Yes | MD is paywalled |
| Plate/Slate | Uncertain | No (needs library) | MIT | Must build yourself | Too low-level |

### Recommendation: TipTap (via ngx-tiptap)

**Why TipTap over Milkdown:**
- Largest ecosystem (37k+ GitHub stars, 100+ extensions)
- `ngx-tiptap` v14 explicitly built for Angular 19+ with standalone components
- Official `@tiptap/markdown` extension provides clean bidirectional markdown serialization
- More mature table, image, and code block extensions
- Better long-term support and documentation
- Massive community means more examples, plugins, and troubleshooting resources

**Key packages:**
- `@tiptap/core`, `@tiptap/starter-kit` — core editor + essential extensions
- `@tiptap/markdown` — bidirectional markdown serialization (built on MarkedJS)
- `@tiptap/extension-table`, `@tiptap/extension-image`, `@tiptap/extension-code-block-lowlight` — additional features
- `ngx-tiptap` v14 — Angular 19 bindings (standalone directives)

---

## Current State: Where Markdown is Used

| Component | File | Current Editor | Current Renderer | Purpose |
|-----------|------|---------------|-----------------|---------|
| Wiki Editor | `wiki-editor.component.ts` | **EasyMDE** | N/A | Create/edit wiki pages |
| Wiki Page | `wiki-page.component.ts` | N/A | **marked.parse()** | Display wiki pages |
| Create Topic | `create-topic-modal.component.ts` | **Plain textarea** | N/A | Create Q&A topics |
| Topic Detail | `topic-detail.component.ts` | **Plain textarea** (answers) | **marked.parse()** | Display topics + submit answers |

All content is stored as markdown strings in the database and rendered to HTML via `marked.parse()` + `DomSanitizer`.

---

## Implementation Plan

### Phase 1: Install Dependencies & Create Shared Editor Component

**1.1 Install TipTap packages**
```
npm install @tiptap/core @tiptap/starter-kit @tiptap/markdown @tiptap/pm
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
npm install @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-underline
npm install @tiptap/extension-code-block-lowlight
npm install ngx-tiptap
npm install lowlight
```

**1.2 Create shared `RichEditorComponent`** (`shared/components/rich-editor.component.ts`)
- Standalone Angular component wrapping TipTap
- **Inputs**: `content` (markdown string), `placeholder`, `minHeight`, `editable`
- **Outputs**: `contentChange` (emits markdown string on every change)
- Supports `[(ngModel)]` via `ControlValueAccessor` for form integration
- Configures extensions: StarterKit, Markdown, Table, Image, Placeholder, Underline, CodeBlockLowlight
- Builds a custom toolbar with Tailwind-styled buttons matching the app's dark mode theme

**1.3 Toolbar features:**
- Text formatting: Bold, Italic, Underline, Strikethrough
- Headings: H1, H2, H3 dropdown
- Lists: Bullet list, Ordered list
- Block elements: Blockquote, Code block, Horizontal rule
- Inserts: Link, Image (URL input), Table (insert 3x3)
- Utilities: Undo, Redo

**1.4 Markdown round-trip:**
- On init: `editor.commands.setContent(markdownString, { contentType: 'markdown' })`
- On change: `editor.getMarkdown()` → emits to parent
- Database storage remains unchanged (markdown strings)
- Existing `marked.parse()` rendering in read-only views remains unchanged

### Phase 2: Replace Wiki Editor

**2.1 Update `wiki-editor.component.ts`:**
- Remove EasyMDE import and initialization
- Replace `<textarea #editorTextarea>` with `<app-rich-editor [(ngModel)]="content">`
- Remove EasyMDE-specific lifecycle code (`ngAfterViewInit`, `ngOnDestroy`)
- Keep existing save/create logic — just change where content comes from

### Phase 3: Upgrade Topic Creation

**3.1 Update `create-topic-modal.component.ts`:**
- Replace the plain `<textarea [(ngModel)]="content">` with `<app-rich-editor [(ngModel)]="content" placeholder="Describe your question in detail...">`
- This gives topic creators a proper WYSIWYG experience instead of raw markdown

### Phase 4: Upgrade Topic Answers

**4.1 Update `topic-detail.component.ts`:**
- Replace the answer `<textarea [(ngModel)]="newAnswerContent">` with `<app-rich-editor [(ngModel)]="newAnswerContent" placeholder="Write your answer..." [minHeight]="'150px'">`
- Keep existing `renderMarkdown()` for displaying answers (read-only rendering stays as `marked.parse()`)

### Phase 5: Clean Up

**5.1 Remove EasyMDE:**
```
npm uninstall easymde
```

**5.2 Update `styles.css`:**
- Remove `@import "easymde/dist/easymde.min.css"`
- Remove all `.dark .EasyMDEContainer` CSS overrides (lines ~92-122)
- Keep `.prose` styles (needed for `marked.parse()` read-only rendering)
- Add TipTap editor styling (toolbar, editor area, dark mode)

**5.3 Remove unused dependency:**
- `ngx-markdown` is installed but never used — remove it too

**5.4 Keep `marked` package:**
- Still needed for read-only rendering in `wiki-page.component.ts` and `topic-detail.component.ts`
- TipTap's `@tiptap/markdown` handles editing; `marked` handles display — no conflict

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Edit | Add TipTap packages, remove easymde + ngx-markdown |
| `rich-editor.component.ts` | **New** | Shared WYSIWYG editor with toolbar + markdown I/O |
| `wiki-editor.component.ts` | Edit | Replace EasyMDE with RichEditorComponent |
| `create-topic-modal.component.ts` | Edit | Replace textarea with RichEditorComponent |
| `topic-detail.component.ts` | Edit | Replace answer textarea with RichEditorComponent |
| `styles.css` | Edit | Remove EasyMDE CSS, add TipTap editor styles |

## What Stays Unchanged

- **Database schema** — content remains markdown strings
- **Backend API** — no changes needed
- **Read-only rendering** — `marked.parse()` + `.prose` CSS stays for wiki pages and topic display
- **All existing content** — markdown stored in DB renders the same

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| TipTap markdown serialization lossy for complex content | Test with existing wiki content; TipTap's `@tiptap/markdown` uses MarkedJS under the hood (same as current renderer) |
| Dark mode styling | Build toolbar and editor styles with Tailwind's dark: variants to match existing theme |
| Image handling | Start with URL-based image insertion; file upload can be added later if needed |
| Table editing complexity | TipTap's table extension is mature; provides add/remove rows/cols, merge cells |
