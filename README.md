# @stainless-code/react-modal-manager

A powerful, type-safe modal management system for React applications. This library provides utilities to create, manage, and render modals programmatically with full TypeScript support.

**A simpler and improved version of [eBay's nice-modal-react](https://github.com/eBay/nice-modal-react)** - designed with modern React patterns and enhanced developer experience.

## Features

- **Type-safe**: Full TypeScript support with intelligent type inference
- **Programmatic control**: Open and close modals from anywhere in your app
- **Performance optimized**: Uses Zustand for efficient state management
- **Component caching**: Efficient component registration system
- **Simple API**: Intuitive methods for modal management
- **Modern React**: Built with modern React patterns and hooks
- **Lightweight**: Minimal dependencies (nanoid + zustand)

## Installation

### npm

```bash
npm install @stainless-code/react-modal-manager
```

### yarn

```bash
yarn add @stainless-code/react-modal-manager
```

### pnpm

```bash
pnpm add @stainless-code/react-modal-manager
```

### bun

```bash
bun add @stainless-code/react-modal-manager
```

## Usage

### 1. Setup Provider

First, wrap your app with the `ModalProvider`:

```tsx
import { ModalProvider } from "@stainless-code/react-modal-manager";

function App() {
  return (
    <ModalProvider>
      {/* Your app components */}
      <YourAppContent />
    </ModalProvider>
  );
}
```

### 2. Create and Use Modal

```tsx
import { createModal } from "@stainless-code/react-modal-manager";

// Create modal
export const myModal = createModal<{
  title: string;
  message: string;
}>(({ id, close, title, message }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={close}>Close</button>
    </div>
  </div>
));

// Usage in a component
function MyComponent() {
  const handleOpenModal = () => {
    // Open modal with props
    const modalId = myModal.open({
      title: "Hello World",
      message: "This is a modal message!",
    });

    console.log("Modal opened with ID:", modalId);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <button onClick={myModal.close}>Close Last Modal</button>
    </div>
  );
}
```

### 3. Advanced Usage with TypeScript

```tsx
import { createModal } from "@stainless-code/react-modal-manager";
import { useState } from "react";

// Create a more complex modal
export const userModal = createModal<{
  user: {
    id: number;
    name: string;
    email: string;
  };
  onSave: (user: any) => void;
}>(({ id, close, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);

  function handleSave() {
    onSave(editedUser);
    close(); // Close modal after saving
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User</h2>
        <input
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
});

// Usage - TypeScript will require the correct props
userModal.open({
  user: {
    id: 1,
    name: "John",
    email: "john@example.com",
  },
  onSave: (user) => console.log("User saved:", user),
});
```

### 4. Simple Modal Without Props

```tsx
// Modal that doesn't require any props
export const confirmModal = createModal(({ close }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Are you sure?</h2>
      <p>This action cannot be undone.</p>
      <button onClick={close}>Cancel</button>
      <button
        onClick={() => {
          console.log("Confirmed!");
          close();
        }}
      >
        Confirm
      </button>
    </div>
  </div>
));

// Usage - no props needed
confirmModal.open();
```

## Type Safety

The library provides full TypeScript support with intelligent type inference:

```tsx
// Define modal with typed props
const myModal = createModal<{
  name: string;
  age: number;
}>(({ close, name, age }) => (
  <div>
    <p>
      Hello {name}, you are {age} years old!
    </p>
    <button onClick={close}>Close</button>
  </div>
));

// ✅ Correct usage - TypeScript enforces required props
myModal.open({ name: "John", age: 30 });

// ❌ TypeScript error - missing required props
myModal.open({ name: "John" }); // Error: Property 'age' is missing

// ❌ TypeScript error - wrong prop types
myModal.open({ name: "John", age: "30" }); // Error: Type 'string' is not assignable to type 'number'

// For modals without props, no type parameter needed
const simpleModal = createModal(({ close }) => (
  <div>
    <p>Simple modal content</p>
    <button onClick={close}>Close</button>
  </div>
));
simpleModal.open(); // ✅ Correct - no props needed
```

## API

### `ModalProvider`

Provider component that manages modal state and rendering. Must wrap your application.

```tsx
function ModalProvider({ children }: React.PropsWithChildren): JSX.Element;
```

### `createModal<TProps>()`

Creates a modal instance with open/close methods.

```tsx
function createModal<TProps = Record<string, unknown>>(
  component: ModalComponent<TProps>,
): CreatedModal<TProps>;
```

| Parameter   | Type                     | Description                       |
| ----------- | ------------------------ | --------------------------------- |
| `component` | `ModalComponent<TProps>` | The modal component to be managed |

#### Returns

`CreatedModal<TProps>` object with:

- `open(props?: TProps): string` - Opens the modal and returns its ID
- `close(): void` - Closes the most recently opened modal of this type

### `ModalProps`

Props automatically injected into your modal components:

```tsx
interface ModalProps {
  id: string; // Unique modal identifier
  close: () => void; // Function to close this specific modal
}
```

### `ModalComponent<TProps>`

Type definition for modal components:

```tsx
type ModalComponent<TProps = Record<string, unknown>> = React.ComponentType<
  ModalProps & TProps
>;
```

Your modal components should accept `ModalProps` combined with your custom props.

### `useModalStore`

Direct access to the modal store (advanced usage):

```tsx
const { modals, openModal, closeModal } = useModalStore();
```

## Contributing

Feel free to submit issues or pull requests to improve the library. Every bit of help is appreciated. 💖

[Read the contribution guidelines](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
