import type { ModalProps } from "./index";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createModal, ModalProvider, useModalStore } from "./index";

// Test modal components
const SimpleModal = ({ id, close }: ModalProps) => (
  <div data-testid={`modal-${id}`}>
    <h2>Simple Modal</h2>
    <button type="button" onClick={close} data-testid="close-button">
      Close
    </button>
  </div>
);

interface TestModalProps {
  title: string;
  message: string;
}

const TestModal = ({
  id,
  close,
  title,
  message,
}: ModalProps & TestModalProps) => (
  <div data-testid={`modal-${id}`}>
    <h2>{title}</h2>
    <p>{message}</p>
    <button type="button" onClick={close} data-testid="close-button">
      Close
    </button>
  </div>
);

describe("modal Management System", () => {
  afterEach(() => {
    // Clear all modals and cleanup DOM after each test
    act(() => {
      useModalStore.setState({ modals: new Map() });
    });
    cleanup();
  });

  describe("modalProvider", () => {
    it("should render children and modal renderer", () => {
      render(
        <ModalProvider>
          <div data-testid="child">Test Child</div>
        </ModalProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should clear modals on unmount", () => {
      const { result } = renderHook(() => useModalStore());

      // Add a modal to the store
      act(() => {
        result.current.openModal("test-id", SimpleModal);
      });

      expect(result.current.modals.size).toBe(1);

      const { unmount } = render(
        <ModalProvider>
          <div>Test</div>
        </ModalProvider>,
      );

      unmount();

      // Check that modals are cleared
      expect(result.current.modals.size).toBe(0);
    });
  });

  describe("createModal", () => {
    it("should create a modal with open and close methods", () => {
      const modal = createModal(SimpleModal);

      expect(modal).toHaveProperty("open");
      expect(modal).toHaveProperty("close");
      expect(typeof modal.open).toBe("function");
      expect(typeof modal.close).toBe("function");
    });

    it("should open a modal and return an ID", () => {
      render(<ModalProvider />);
      const modal = createModal(SimpleModal);

      const modalId = modal.open();

      expect(typeof modalId).toBe("string");
      expect(modalId).toMatch(/^[\w-]+$/); // nanoid format
    });

    it("should open a modal with props", () => {
      const modal = createModal<TestModalProps>(TestModal);

      render(<ModalProvider />);

      let modalId: string;
      act(() => {
        modalId = modal.open({
          title: "Test Title",
          message: "Test Message",
        });
      });

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Message")).toBeInTheDocument();
      expect(screen.getByTestId(`modal-${modalId!}`)).toBeInTheDocument();
    });

    it("should close the most recently opened modal", () => {
      const modal = createModal(SimpleModal);

      render(<ModalProvider />);

      let modalId1: string, modalId2: string;
      act(() => {
        modalId1 = modal.open();
        modalId2 = modal.open();
      });

      expect(screen.getByTestId(`modal-${modalId1!}`)).toBeInTheDocument();
      expect(screen.getByTestId(`modal-${modalId2!}`)).toBeInTheDocument();

      act(() => {
        modal.close();
      });

      expect(screen.getByTestId(`modal-${modalId1!}`)).toBeInTheDocument();
      expect(
        screen.queryByTestId(`modal-${modalId2!}`),
      ).not.toBeInTheDocument();
    });

    it("should handle closing when no modals are open", () => {
      const modal = createModal(SimpleModal);

      // Should not throw an error
      expect(() => modal.close()).not.toThrow();
    });
  });

  describe("modal rendering", () => {
    it("should render modal with correct props", () => {
      const modal = createModal<TestModalProps>(TestModal);

      render(<ModalProvider />);

      let modalId: string;
      act(() => {
        modalId = modal.open({
          title: "Custom Title",
          message: "Custom Message",
        });
      });

      const modalElement = screen.getByTestId(`modal-${modalId!}`);
      expect(modalElement).toBeInTheDocument();
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Message")).toBeInTheDocument();
    });

    it("should render multiple modals simultaneously", () => {
      const modal1 = createModal<TestModalProps>(TestModal);
      const modal2 = createModal(SimpleModal);

      render(<ModalProvider />);

      let modalId1: string, modalId2: string;
      act(() => {
        modalId1 = modal1.open({
          title: "Modal 1",
          message: "First modal",
        });
        modalId2 = modal2.open();
      });

      expect(screen.getByTestId(`modal-${modalId1!}`)).toBeInTheDocument();
      expect(screen.getByTestId(`modal-${modalId2!}`)).toBeInTheDocument();
      expect(screen.getByText("Modal 1")).toBeInTheDocument();
      expect(screen.getByText("Simple Modal")).toBeInTheDocument();
    });

    it("should handle modal close through injected close function", () => {
      const modal = createModal(SimpleModal);

      render(<ModalProvider />);

      let modalId: string;
      act(() => {
        modalId = modal.open();
      });

      const modalElement = screen.getByTestId(`modal-${modalId!}`);
      const closeButton = screen.getByTestId("close-button");

      expect(modalElement).toBeInTheDocument();

      fireEvent.click(closeButton);

      expect(screen.queryByTestId(`modal-${modalId!}`)).not.toBeInTheDocument();
    });
  });

  describe("useModalStore", () => {
    it("should provide access to modal store", () => {
      const { result } = renderHook(() => useModalStore());

      expect(result.current).toHaveProperty("modals");
      expect(result.current).toHaveProperty("openModal");
      expect(result.current).toHaveProperty("closeModal");
      expect(result.current.modals).toBeInstanceOf(Map);
    });

    it("should update modals when opening", () => {
      const { result } = renderHook(() => useModalStore());

      expect(result.current.modals.size).toBe(0);

      act(() => {
        result.current.openModal("test-id", SimpleModal, {});
      });

      expect(result.current.modals.size).toBe(1);
      expect(result.current.modals.has("test-id")).toBe(true);
    });

    it("should update modals when closing", () => {
      const { result } = renderHook(() => useModalStore());

      act(() => {
        result.current.openModal("test-id", SimpleModal, {});
      });

      expect(result.current.modals.size).toBe(1);

      act(() => {
        result.current.closeModal("test-id");
      });

      expect(result.current.modals.size).toBe(0);
    });
  });

  describe("component registration", () => {
    it("should handle same component used multiple times", () => {
      const modal1 = createModal(SimpleModal);
      const modal2 = createModal(SimpleModal);

      render(<ModalProvider />);

      let modalId1: string, modalId2: string;
      act(() => {
        modalId1 = modal1.open();
        modalId2 = modal2.open();
      });

      expect(screen.getByTestId(`modal-${modalId1!}`)).toBeInTheDocument();
      expect(screen.getByTestId(`modal-${modalId2!}`)).toBeInTheDocument();
    });

    it("should warn when component is not found", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<ModalProvider />);

      act(() => {
        // Manually add a modal with invalid component ID to trigger warning
        useModalStore.setState({
          modals: new Map([
            [
              "invalid-modal",
              {
                id: "invalid-modal",
                componentId: "non-existent-component",
                props: {},
              },
            ],
          ]),
        });
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Modal component with ID non-existent-component not found",
      );

      consoleSpy.mockRestore();
    });
  });

  describe("typeScript integration", () => {
    it("should work with typed props", () => {
      const typedModal = createModal<{ value: number }>(
        ({ id, close, value }) => (
          <div data-testid={`modal-${id}`}>
            <span data-testid="value">{value}</span>
            <button type="button" onClick={close}>
              Close
            </button>
          </div>
        ),
      );

      render(<ModalProvider />);

      act(() => {
        typedModal.open({ value: 42 });
      });

      expect(screen.getByTestId("value")).toHaveTextContent("42");
    });
  });
});
