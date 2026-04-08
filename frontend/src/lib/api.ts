import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor: attach JWT ─────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 + refresh ──────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Service ────────────────────────────────────
export const authService = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    role?: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  getMe: () => api.get("/auth/me"),

  refresh: (refresh_token: string) =>
    api.post("/auth/refresh", { refresh_token }),
};

// ─── User Service ────────────────────────────────────
export const userService = {
  getProfile: () => api.get("/users/profile"),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }) => api.put("/users/profile", data),

  getDashboardStats: () => api.get("/users/dashboard/stats"),

  listUsers: () => api.get("/users/"),
};

// ─── Course Service ──────────────────────────────────
export const courseService = {
  listCourses: (status?: string) =>
    api.get("/courses/", { params: status ? { status_filter: status } : {} }),

  getCourse: (id: number) => api.get(`/courses/${id}`),

  createCourse: (data: {
    title: string;
    description?: string;
    short_description?: string;
    duration_weeks?: number;
    difficulty_level?: string;
  }) => api.post("/courses/", data),

  updateCourse: (id: number, data: Record<string, unknown>) =>
    api.put(`/courses/${id}`, data),

  deleteCourse: (id: number) => api.delete(`/courses/${id}`),

  // Chapters
  createChapter: (courseId: number, data: { title: string; order?: number }) =>
    api.post(`/courses/${courseId}/chapters`, data),

  // Lessons
  createLesson: (
    courseId: number,
    chapterId: number,
    data: { title: string; content_type?: string; order?: number }
  ) => api.post(`/courses/${courseId}/chapters/${chapterId}/lessons`, data),

  // Enrollment
  enroll: (courseId: number) => api.post("/courses/enroll", { course_id: courseId }),

  myEnrollments: () => api.get("/courses/my/enrollments"),
};

export default api;
