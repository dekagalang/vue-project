# Admin Dashboard - Employee / Product Management System

Aplikasi Admin Dashboard lengkap untuk mengelola data User, Product, dan Category dengan fitur authentication, form kompleks, table, chart, dan state management.

## 📊 Demo Credentials

```
Email: admin@example.com
Password: password123
```

## 🎯 Tech Stack

### Frontend Framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next generation frontend tooling

### UI Framework
- **Vuetify** - Material Design component library for Vue
  - Responsive grid system
  - Pre-built components (v-card, v-form, v-data-table, v-dialog, v-snackbar)
  - Material Design icons (MDI)

### State Management
- **Pinia** - Intuitive, type-safe state management
  - Used for: Authentication, UI state (sidebar, theme), Global user info
  
### Server State Management
- **Vue Query (TanStack Query for Vue)** - Powerful data synchronization library
  - Used for: API calls, caching, loading states, error handling
  - Automatic refetching and stale state management
  
### Form & Validation
- **Zod** - TypeScript-first schema validation
  - Schema-based validation with clear error messages
  - Type inference from schemas

### Data Visualization
- **Chart.js** - Simple yet flexible JavaScript charting
- **vue-chartjs** - Vue wrapper for Chart.js

### Routing
- **Vue Router** - Official router for Vue.js
  - Protected routes with navigation guards
  - Automatic route generation from file structure

## 📁 Project Structure

```
src/
├── api/
│   └── mock.ts              # Mock API dengan dummy data
├── components/
│   ├── AppFooter.vue
│   └── HelloWorld.vue
├── composables/
│   └── useApi.ts            # Vue Query composables
├── layouts/
│   ├── default.vue          # Layout utama dengan navbar & sidebar
│   └── blank.vue            # Layout untuk login page
├── pages/
│   ├── login.vue            # Authentication page
│   ├── dashboard.vue        # KPI & Charts
│   ├── users.vue            # User CRUD
│   ├── products.vue         # Product CRUD
│   └── categories.vue       # Category CRUD dengan tree data
├── router/
│   └── index.ts             # Router configuration dengan guards
├── stores/
│   ├── app.ts               # App state
│   └── auth.ts              # Authentication state
├── styles/
│   └── settings.scss        # Global styles
├── App.vue                  # Root component
└── main.ts                  # Entry point
```

## 🚀 Features

### ✅ Authentication & Authorization
- Login page dengan email & password validation
- Token-based authentication (simpan ke localStorage)
- Protected routes - redirect ke login jika belum authenticated
- Auto-logout functionality
- User profile di navbar

### ✅ User Management (CRUD)
- **Create**: Form dengan validasi Zod
- **Read**: Data table dengan filtering & sorting
- **Update**: Edit user data di modal dialog
- **Delete**: Confirmation dialog sebelum delete
- **Advanced Features**:
  - Dynamic phone numbers (add/remove multiple phones)
  - Responsive form layout (3 col desktop, 2 col tablet, 1 col mobile)
  - User role selection (admin, manager, user)

### ✅ Product Management (CRUD)
- **Create**: Form dengan kategori selection
- **Read**: Data table dengan harga & stock display
- **Update**: Edit product details
- **Delete**: Safe delete dengan confirmation
- **Features**:
  - Currency formatting (Indonesian Rupiah)
  - Stock status indicator (color-coded chips)
  - Product description
  - Category relationship

### ✅ Category Management (CRUD)
- **Tree Data Structure**: Category dengan Subcategory
- **Expand/Collapse**: Toggle subcategories
- **Hierarchical Display**: Parent-child relationship visualization
- **Full CRUD**: Create, Read, Update, Delete dengan tree support

### ✅ Dashboard & Analytics
- **KPI Cards**: Total Users, Products, Categories, Stock Value
- **User Distribution Chart**: Doughnut chart (User count per role)
- **Product Category Chart**: Bar chart (Products per category)
- **Monthly Sales Trend**: Line chart dengan dummy data
- **Recent Activity**: Latest users list
- **Low Stock Alert**: Products dengan stock < 50

### ✅ Form Validation
- Zod schema-based validation
- Real-time field validation
- Error message display
- Required field indicators

### ✅ UI Components (Vuetify)
- `v-card` - Card containers
- `v-form` - Form wrapper
- `v-text-field` - Input fields
- `v-textarea` - Multi-line input
- `v-select` - Dropdown selection
- `v-btn` - Buttons
- `v-data-table` - Data tables
- `v-dialog` - Modal dialogs
- `v-snackbar` - Toast notifications
- `v-alert` - Alert messages
- `v-chip` - Badge/chips
- `v-navigation-drawer` - Sidebar
- `v-app-bar` - Top navigation bar
- `v-list` - Menu lists

### ✅ Responsive Design
```vue
<v-row>
  <v-col cols="12" md="6" lg="4">
    <!-- Forms adjust: 1 col mobile, 2 col tablet, 3 col desktop -->
  </v-col>
</v-row>
```

## 🔄 State Management Architecture

### Pinia (Client State)
```typescript
// auth.ts - Authentication state
- user: User info
- token: JWT token
- isAuthenticated(): boolean
- login(email, password)
- logout()
```

### Vue Query (Server State)
```typescript
// useApi.ts - API data fetching
- useUsers() // GET
- useCreateUser() // POST
- useUpdateUser() // PUT
- useDeleteUser() // DELETE
- useProducts() // Similar pattern
- useCategories() // Similar pattern
```

**Key Difference:**
- **Pinia** → Client state (auth, UI preferences)
- **Vue Query** → Server state (users, products, categories)

## 🔐 Authentication Flow

1. User navigates ke `/login`
2. Input email & password
3. Validasi dengan Zod schema
4. Submit ke mock API
5. API returns token & user data
6. Store token ke localStorage & Pinia
7. Router guard check `isAuthenticated()`
8. Redirect ke dashboard jika berhasil
9. Protected routes block access jika tidak authenticated

## 🎨 Styling

- **Vuetify Material Design** - Built-in theme system
- **Gradient Background** - Login & app bar
- **Responsive Grid** - Vuetify flex grid system
- **Custom SCSS** - `/src/styles/settings.scss`
- **Scoped Styles** - Component-level styling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm run dev
```

Server berjalan di `http://localhost:5173`

### Build for Production
```bash
pnpm run build
```

### Type Check
```bash
pnpm run type-check
```

### Lint & Format
```bash
pnpm run lint
```

## 📚 API Mock Data

Mock API tersedia di `/src/api/mock.ts` dengan:
- **Users**: 3 dummy users dengan berbagai role
- **Products**: 4 dummy products
- **Categories**: 5 categories (parent & subcategories)

Setiap API call diberi artificial delay (500ms) untuk simulate real API behavior.

## 🎯 Learning Points

### Vue 3 Composition API
- `ref` & `reactive` untuk state
- `computed` untuk derived state
- `watch` untuk watchers
- Lifecycle hooks (`onMounted`, etc)

### Vuetify
- Grid system & responsive design
- Component composition
- Theme customization
- Icon usage (MDI)

### Pinia
- Store definition dengan `defineStore`
- State, getters, actions
- Async actions
- localStorage persistence

### Vue Query
- `useQuery` untuk data fetching
- `useMutation` untuk mutations
- Query invalidation & refetching
- Loading & error states

### Form Validation (Zod)
- Schema definition
- Type inference
- Custom error messages
- Async validation support

### TypeScript
- Type safety dalam Vue components
- Interface definition
- Generic types
- Type guards

## 🚦 Next Steps (Enhancement Ideas)

1. **Real API Integration**
   - Replace mock API dengan actual backend
   - Add JWT token refresh mechanism
   - Error handling & retry logic

2. **Advanced Features**
   - Search & filtering
   - Pagination
   - Export to CSV/Excel
   - Bulk operations
   - User permissions/roles

3. **Performance**
   - Code splitting
   - Lazy loading routes
   - Image optimization
   - Caching strategies

4. **Testing**
   - Unit tests (Vitest)
   - Component tests (Vitest + Vue Test Utils)
   - E2E tests (Cypress/Playwright)

5. **DevOps**
   - GitHub Actions CI/CD
   - Docker containerization
   - Environment configuration

## 📖 Resources

- [Vue 3 Documentation](https://vuejs.org)
- [Vuetify Components](https://vuetifyjs.com)
- [Pinia Store](https://pinia.vuejs.org)
- [Vue Query](https://tanstack.com/query/latest/docs/vue/overview)
- [Zod Validation](https://zod.dev)
- [Vue Router](https://router.vuejs.org)

## 📄 License

MIT

---

**Happy Coding! 🎉**

Untuk pertanyaan atau kontribusi, buat issue atau PR di repository ini.

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production

To build your project for production, use:

```bash
yarn build
```

(Repeat for npm, pnpm, and bun with respective commands.)

Once the build process is completed, your application will be ready for deployment in a production environment.

## 💪 Support Vuetify Development

This project is built with [Vuetify](https://vuetifyjs.com/en/), a UI Library with a comprehensive collection of Vue components. Vuetify is an MIT licensed Open Source project that has been made possible due to the generous contributions by our [sponsors and backers](https://vuetifyjs.com/introduction/sponsors-and-backers/). If you are interested in supporting this project, please consider:

- [Requesting Enterprise Support](https://support.vuetifyjs.com/)
- [Sponsoring John on Github](https://github.com/users/johnleider/sponsorship)
- [Sponsoring Kael on Github](https://github.com/users/kaelwd/sponsorship)
- [Supporting the team on Open Collective](https://opencollective.com/vuetify)
- [Becoming a sponsor on Patreon](https://www.patreon.com/vuetify)
- [Becoming a subscriber on Tidelift](https://tidelift.com/subscription/npm/vuetify)
- [Making a one-time donation with Paypal](https://paypal.me/vuetify)

## 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Vuetify, LLC
