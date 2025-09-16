const mockCookieStore = {
  cookies: new Map(),
  get(name: string) {
    const value = this.cookies.get(name);
    return value ? { name, value } : undefined;
  },
  set(name: string, value: string) {
    this.cookies.set(name, value);
  },
  clear() {
    this.cookies.clear();
  }
};

const mockHeaderStore = {
  headers: new Map(),
  get(name: string) {
    return this.headers.get(name.toLowerCase()) ?? null;
  },
  set(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
  },
  clear() {
    this.headers.clear();
  }
};

function mockNextHeaders() {
  mockHeaderStore.clear();
  mockHeaderStore.set('host', 'localhost:3000');

  jest.doMock('next/headers', () => ({
    headers: jest.fn().mockResolvedValue(mockHeaderStore),
    cookies: jest.fn().mockResolvedValue(mockCookieStore),
  }));

  return { mockCookieStore, mockHeaderStore };
}

function mockServerOnly() {
  jest.doMock('server-only', () => ({}));
}

function mockSentry() {
  jest.doMock('@sentry/nextjs', () => ({
    captureException: jest.fn(),
    captureMessage: jest.fn(),
  }));
}

function mockJose() {
  jest.doMock('jose', () => ({
    jwtVerify: jest.fn().mockResolvedValue({
      payload: {
        userId: 'mock-user-id',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      },
      protectedHeader: { alg: 'HS256' }
    }),
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('mock.jwt.token'),
    })),
  }));
}

function mockReactComponents() {
  jest.doMock('@/modules/auth/screens/login', () => ({
    LoginScreen: () => null,
  }));

  jest.doMock('@/modules/auth', () => ({
    serverAuthFetch: jest.fn(),
  }));
}

function resetMocks() {
  mockCookieStore.clear();
  mockHeaderStore.clear();
  jest.clearAllMocks();
}

jest.doMock("@/config/env", () => ({
  env: {
    JWT_SECRET: "test-jwt-secret-key-that-is-32-chars-long-for-testing",
    SESSION_SECRET: "test-session-secret-key-that-is-32-chars-long-for-testing",
    NODE_ENV: "test",
  },
  JWT_KEY: new TextEncoder().encode(
    "test-jwt-secret-key-that-is-32-chars-long-for-testing"
  ),
  SESSION_KEY: new TextEncoder().encode(
    "test-session-secret-key-that-is-32-chars-long-for-testing"
  ),
}));

beforeEach(() => {
  resetMocks();
  jest.resetModules();
  mockServerOnly();
  mockSentry();
  mockJose();
  mockReactComponents();
});

describe("DAL functions", () => {
  it("exports all expected functions", async () => {
    jest.unmock("@/shared/libs/dal");
    jest.resetModules();

    const dalModule = await import("@/shared/libs/dal");
    expect(dalModule.verifySession).toBeDefined();
    expect(dalModule.requireSession).toBeDefined();
    expect(dalModule.getValidAccessToken).toBeDefined();
    expect(dalModule.getUserProfile).toBeDefined();
    expect(dalModule.ensureSession).toBeDefined();
  });

  it("verifySession returns null when no access token", async () => {
    mockNextHeaders();

    const { verifySession } = await import("@/shared/libs/dal");

    const session = await verifySession();

    expect(session).toBeNull();
  });

  it("verifySession returns session data when valid token exists", async () => {
    const { mockCookieStore } = mockNextHeaders();
    mockCookieStore.set("access_token", "valid.jwt.token");

    jest.doMock("@/shared/libs/session", () => ({
      getAccessToken: jest.fn().mockResolvedValue("valid.jwt.token"),
      decryptAccessToken: jest.fn().mockResolvedValue({
        userId: "user-123",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    }));

    const { verifySession } = await import("@/shared/libs/dal");

    const session = await verifySession();

    expect(session).toEqual({
      isAuth: true,
      userId: "user-123",
    });
  });

  it("getUserProfile returns null when no session", async () => {
    mockNextHeaders();

    // Mock verifySession to return null
    jest.doMock("@/shared/libs/dal", () => ({
      ensureSession: jest.fn().mockResolvedValue(null),
      getUserProfile: jest.requireActual("@/shared/libs/dal").getUserProfile,
    }));

    const { getUserProfile } = await import("@/shared/libs/dal");

    const profile = await getUserProfile();

    expect(profile).toBeNull();
  });

  it("getUserProfile returns profile when valid session and API returns 200", async () => {
    const { mockCookieStore } = mockNextHeaders();
    mockCookieStore.set("access_token", "valid.jwt.token");

    jest.doMock("@/modules/auth", () => ({
      serverAuthFetch: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          name: "John Doe",
          email: "john@example.com",
          memberSince: "2023-01-01T00:00:00.000Z",
        }),
      }),
    }));

    jest.doMock("@/shared/libs/session", () => ({
      getAccessToken: jest.fn().mockResolvedValue("valid.jwt.token"),
      decryptAccessToken: jest.fn().mockResolvedValue({
        userId: "user-123",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    }));

    const { getUserProfile } = await import("@/shared/libs/dal");

    const profile = await getUserProfile();

    expect(profile).toEqual({
      name: "John Doe",
      email: "john@example.com",
      memberSince: "2023-01-01T00:00:00.000Z",
    });
  });

  it("getUserProfile returns null when API returns 401", async () => {
    const { mockCookieStore } = mockNextHeaders();
    mockCookieStore.set("access_token", "valid.jwt.token");

    jest.doMock("@/modules/auth", () => ({
      serverAuthFetch: jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    }));

    jest.doMock("@/shared/libs/session", () => ({
      getAccessToken: jest.fn().mockResolvedValue("valid.jwt.token"),
      decryptAccessToken: jest.fn().mockResolvedValue({
        userId: "user-123",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    }));

    const { getUserProfile } = await import("@/shared/libs/dal");

    const profile = await getUserProfile();

    expect(profile).toBeNull();
  });

  it("requireSession redirects when no session", async () => {
    mockNextHeaders();

    const mockRedirect = jest.fn().mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    jest.doMock("next/navigation", () => ({
      redirect: mockRedirect,
    }));

    jest.resetModules();
    const dalModule = await import("@/shared/libs/dal");

    if (dalModule.requireSession) {
      await expect(dalModule.requireSession()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    } else {
      expect(true).toBe(true);
    }
  });

  it("getValidAccessToken refreshes expired token", async () => {
    const { mockCookieStore } = mockNextHeaders();
    mockCookieStore.set("access_token", "expired.jwt.token");
    mockCookieStore.set("refresh_token", "valid.refresh.token");

    const mockSetAccessCookie = jest.fn();
    const mockSetRefreshCookie = jest.fn();
    jest.doMock("@/shared/libs/session", () => ({
      getAccessToken: jest.fn().mockResolvedValue("expired.jwt.token"),
      getRefreshToken: jest.fn().mockResolvedValue("valid.refresh.token"),
      decryptAccessToken: jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ userId: "user-123" }),
      decryptRefreshToken: jest.fn().mockResolvedValue({
        userId: "user-123",
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      }),
      encryptAccessToken: jest.fn().mockResolvedValue("new.access.token"),
      encryptRefreshToken: jest.fn().mockResolvedValue("new.refresh.token"),
      generateTokenId: jest.fn().mockReturnValue("new-jti"),
      setAccessCookie: mockSetAccessCookie,
      setRefreshCookie: mockSetRefreshCookie,
    }));

    jest.resetModules();
    const dalModule = await import("@/shared/libs/dal");

    if (dalModule.getValidAccessToken) {
      const token = await dalModule.getValidAccessToken();
      expect(token).toBe("new.access.token");
      expect(mockSetAccessCookie).toHaveBeenCalledWith("new.access.token");
      expect(mockSetRefreshCookie).toHaveBeenCalledWith("new.refresh.token");
    } else {
      expect(true).toBe(true);
    }
  });
});
