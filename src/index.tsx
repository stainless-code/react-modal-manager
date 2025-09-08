"use client";

import { nanoid } from "nanoid";
import { useEffect } from "react";
import { create } from "zustand";

export type ModalComponent<TProps = Record<string, unknown>> =
  React.ComponentType<ModalProps & TProps>;

/**
 * Modal props injected into components
 */
export interface ModalProps {
  /** Modal identifier */
  id: string;
  /** Close the modal */
  close: () => void;
}

/**
 * Conditional type for open method - requires props only if TProps has required properties
 */
export type OpenMethod<TProps> =
  Record<string, never> extends TProps
    ? () => string
    : (props: TProps) => string;

/**
 * Enhanced modal component with attached methods
 */
export interface CreatedModal<TProps = Record<string, unknown>> {
  /**
   * Open the modal programmatically
   *
   * @param props - The props to pass to the modal component
   * @returns The id of the modal
   */
  open: OpenMethod<TProps>;
  /**
   * Close the modal programmatically
   */
  close: () => void;
}

/**
 * Modal store interface
 */
export interface ModalStore {
  /**
   * Currently open modals
   */
  modals: Map<string, ModalState>;
  /**
   * Open a modal with props
   *
   * @param id - The id of the modal
   * @param component - The component to render
   * @param props - The props to pass to the modal component
   */
  openModal: (
    /**
     * The id of the modal
     */
    id: string,
    /**
     * The component to render
     */
    component: ModalComponent,
    /**
     * The props to pass to the modal component
     */
    props?: Record<string, unknown>,
  ) => void;
  /**
   * Close a modal and remove it from store
   *
   * @param id - The id of the modal
   */
  closeModal: (
    /**
     * The id of the modal
     */
    id: string,
  ) => void;
}

/**
 * Modal state interface
 */
export interface ModalState {
  /**
   * Unique modal identifier
   */
  id: string;
  /**
   * Component ID reference to cached component
   */
  componentId: string;
  /**
   * Props passed to the modal component
   */
  props?: Record<string, unknown>;
}

/**
 * Component registry for caching modal components
 */
const componentRegistry = new WeakMap<ModalComponent, string>();

/**
 * Reverse lookup for component registry
 */
const componentIdMap = new Map<string, ModalComponent>();

/**
 * Global modal store using Zustand with Map for better performance
 */
export const useModalStore = create<ModalStore>()((set) => ({
  modals: new Map(),
  openModal(id, component, props) {
    const componentId = registerComponent(component);

    set((state) => {
      const newModals = new Map(state.modals);

      newModals.set(id, {
        id,
        componentId,
        props,
      });

      return {
        ...state,
        modals: newModals,
      };
    });
  },
  closeModal(id) {
    set((state) => {
      const newModals = new Map(state.modals);

      newModals.delete(id);

      return {
        ...state,
        modals: newModals,
      };
    });
  },
}));

/**
 * Register a component in the cache and return its ID
 */
function registerComponent(component: ModalComponent): string {
  // Check if component is already registered
  let componentId = componentRegistry.get(component);

  if (!componentId) {
    // Generate new ID and register component
    componentId = nanoid();
    componentRegistry.set(component, componentId);
    componentIdMap.set(componentId, component);
  }

  return componentId;
}

/**
 * Create a modal component with attached methods
 *
 * @param component - The modal component function that receives (props)
 * @returns Enhanced modal object with open/close methods
 */
export function createModal<TProps = Record<string, unknown>>(
  component: ModalComponent<TProps>,
): CreatedModal<TProps> {
  const ids: string[] = [];

  return {
    open(props?: TProps) {
      const id = nanoid();

      ids.push(id);
      useModalStore
        .getState()
        .openModal(
          id,
          component as ModalComponent,
          props as Record<string, unknown>,
        );

      return id;
    },
    close() {
      const id = ids.pop();

      if (id) {
        useModalStore.getState().closeModal(id);
      }
    },
  };
}

/**
 * Modal renderer component
 */
function ModalRenderer() {
  const modals = useModalStore((state) => state.modals);

  return Array.from(modals.values()).map((modal) => {
    const Component = componentIdMap.get(modal.componentId);

    if (!Component) {
      console.warn(`Modal component with ID ${modal.componentId} not found`);
      return null;
    }

    return (
      <Component
        key={modal.id}
        id={modal.id}
        close={() => useModalStore.getState().closeModal(modal.id)}
        {...modal.props}
      />
    );
  });
}

/**
 * Modal Provider component
 */
export function ModalProvider({ children }: React.PropsWithChildren) {
  // Clear modals when the component unmounts
  useEffect(() => () => useModalStore.setState({ modals: new Map() }), []);

  return (
    <>
      {children}
      <ModalRenderer />
    </>
  );
}
