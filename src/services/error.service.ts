type ErrorListener = (error: Error) => void;

export class ErrorService {
  private listeners: ErrorListener[] = [];

  addListener(listener: ErrorListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  handleError(error: Error): void {
    console.error('Application error:', error);
    this.notifyListeners(error);
  }

  private notifyListeners(error: Error): void {
    this.listeners.forEach((listener) => listener(error));
  }
}

export const createErrorService = () => {
  return new ErrorService();
};
