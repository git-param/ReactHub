import type { Component } from "../types/component"
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

export async function getComponents() {
  const res = await fetch(`${BASE_URL}/components`)
  return res.json()
}

export async function getComponent(id: string) {
  const res = await fetch(`${BASE_URL}/components/${id}`)
  return res.json()
}

export async function updateComponent(id: string,data: Partial<Component>) 
{
  await fetch(`${BASE_URL}/components/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}