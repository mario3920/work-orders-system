export type LoginUser =
  | {
      id: number;
      email: string;
      role: 'CLIENT';
      clientId: number;
    }
  | {
      id: number;
      email: string;
      role: 'EMPLOYEE';
      employeeId: number;
    }
  | {
      id: number;
      email: string;
      role: 'ADMIN';
    };

export type AuthTokenPayload =
  | {
      sub: string;
      role: 'CLIENT';
      clientId: number;
    }
  | {
      sub: string;
      role: 'EMPLOYEE';
      employeeId: number;
    }
  | {
      sub: string;
      role: 'ADMIN';
    };
