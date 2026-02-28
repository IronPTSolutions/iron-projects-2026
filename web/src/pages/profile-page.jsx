import { useState } from "react";
import { useForm } from "react-hook-form";
import ProfileProjects from "../components/profile-projects";
import { useAuth } from "../contexts/auth-context";
import { updateAvatar, updateProfile } from "../services/api-service";

/**
 * Página de Perfil del usuario autenticado.
 *
 * Permite:
 * - Cambiar el avatar (subida a Cloudinary vía Multer).
 * - Editar nombre, bio, ubicación, GitHub, LinkedIn e idiomas.
 * - Ver y eliminar los proyectos propios organizados por módulo.
 *
 * Utiliza react-hook-form para la validación del formulario y
 * el contexto de autenticación para obtener y actualizar los datos del usuario.
 */
export default function ProfilePage() {
  // Datos del usuario autenticado y función para actualizar el estado global
  const { user, reloadUser } = useAuth();

  const [uploadingAvatar, setUploadingAvatar] = useState(false); // Indica si se está subiendo un avatar
  const [serverError, setServerError] = useState(null); // Error devuelto por el servidor

  // Configura react-hook-form con los valores actuales del usuario como defaults
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      githubUrl: user?.githubUrl || "",
      linkedinUrl: user?.linkedinUrl || "",
      location: user?.location || "",
      languages: user?.languages?.join(", ") || "",
    },
  });

  /**
   * Handler para el cambio de avatar.
   * Sube la imagen al servidor (Multer + Cloudinary) y actualiza el estado del usuario.
   */
  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const updated = await updateAvatar(file);
      reloadUser({ ...user, ...updated });
    } catch {
      setServerError("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  }

  /**
   * Handler del formulario de perfil.
   * Convierte el campo "languages" (string separado por comas) a un array
   * antes de enviarlo al servidor.
   */
  async function onSubmit(data) {
    try {
      setServerError(null);

      const payload = {
        ...data,
        languages: data.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
      };

      const updated = await updateProfile(payload);
      reloadUser({ ...user, ...updated });
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update profile");
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Profile Card ──────────────────────────────────────── */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
        {/* Server Error */}
        {serverError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {serverError}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="w-32 h-32 rounded-2xl object-cover border-2 border-slate-700/50 shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  document.getElementById("input-avatar").click();
                }}
                disabled={uploadingAvatar}
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                {uploadingAvatar ? (
                  <svg
                    className="h-6 w-6 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                    />
                  </svg>
                )}
              </button>
              <input
                id="input-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Click to change photo</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-5">
            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg
                    className="h-5 w-5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/30 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className={`block w-full rounded-xl border bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 ${
                      errors.name
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-300"
                >
                  Location
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="location"
                    type="text"
                    placeholder="City, Country"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20"
                    {...register("location")}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-slate-300"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell us about yourself…"
                className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none"
                {...register("bio")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* GitHub URL */}
              <div className="space-y-2">
                <label
                  htmlFor="githubUrl"
                  className="block text-sm font-medium text-slate-300"
                >
                  GitHub URL
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/username"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20"
                    {...register("githubUrl")}
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label
                  htmlFor="linkedinUrl"
                  className="block text-sm font-medium text-slate-300"
                >
                  LinkedIn URL
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20"
                    {...register("linkedinUrl")}
                  />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <label
                htmlFor="languages"
                className="block text-sm font-medium text-slate-300"
              >
                Languages
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg
                    className="h-5 w-5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                </div>
                <input
                  id="languages"
                  type="text"
                  placeholder="JavaScript, Python, Swift…"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20"
                  {...register("languages")}
                />
              </div>
              <p className="text-xs text-slate-500">Separate with commas</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save changes"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Projects by Module ────────────────────────────────── */}
      <ProfileProjects projects={user.projects} />
    </div>
  );
}
