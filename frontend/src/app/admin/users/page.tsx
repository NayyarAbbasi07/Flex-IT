"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader, Input, Select } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () =>
    adminJson<User[]>("/api/users").then(({ json }) => setUsers(json.data || []));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { res, json } = await adminJson("/api/users", {
      method: "POST",
      body: JSON.stringify({ email, password, name: name || undefined, role }),
    });
    if (!res.ok) {
      setError(json.error || "Failed to create user");
      return;
    }
    setSuccess("User created");
    setEmail("");
    setPassword("");
    setName("");
    setRole("ADMIN");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setError("");
    setSuccess("");
    const { res, json } = await adminJson(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(json.error || "Failed to delete user");
      return;
    }
    load();
  };

  return (
    <>
      <PageHeader title="Users" description="Manage admin and customer accounts." />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mb-3 text-sm text-green-700">{success}</p> : null}

      <form
        onSubmit={onSubmit}
        className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="ADMIN">ADMIN</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </Select>
        <Button type="submit">Add user</Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{u.email}</td>
                <td className="px-4 py-3">{u.name || "—"}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-danger" onClick={() => remove(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
