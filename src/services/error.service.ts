interface ErrorLog {
  timestamp: number;
  type: string;
  message: string;
  details?: any;
}

class ErrorService {
  private static instance: ErrorService;
  private logs: ErrorLog[] = [];
  private maxLogs: number;
  private listeners: ((logs: ErrorLog[]) => void)[] = [];

  private constructor(maxLogs: number = 100) {
    this.maxLogs = maxLogs;
    this.loadFromStorage();
  }

  public static getInstance(maxLogs?: number): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService(maxLogs);
    }
    return ErrorService.instance;
  }

  public logError(type: string, message: string, details?: any): void {
    const error: ErrorLog = {
      timestamp: Date.now(),
      type,
      message,
      details,
    };

    this.logs.unshift(error);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  public addListener(listener: (logs: ErrorLog[]) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (logs: ErrorLog[]) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getLogs()));
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('error_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving error logs:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('error_logs');
      if (data) {
        this.logs = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading error logs:', error);
    }
  }
}

export const createErrorService = (maxLogs?: number) =>
  ErrorService.getInstance(maxLogs);
export type { ErrorLog };
