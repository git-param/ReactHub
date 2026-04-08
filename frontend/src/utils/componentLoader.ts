import type { ComponentType } from "react"
import type { Component } from "../types/component"

/* type definitions for modules */
type PreviewModule = {
  default: ComponentType
}

type CodeModule = {
  code?: string
  cssCode?: string
  usageCode?: string
}

/* load all preview components */
const componentModules = import.meta.glob<PreviewModule>(
  "../componentCode/**/Component.tsx",
  { eager: true }
)

/* load all code files */
const codeModules = import.meta.glob<CodeModule>(
  "../componentCode/**/code.ts",
  { eager: true }
)

function getLookupKeys(component: Pick<Component, "id" | "slug" | "componentPath">) {
  const keys = new Set<string>([component.id])

  if (component.slug) {
    keys.add(component.slug)
  }

  component.componentPath
    ?.split("/")
    .filter(Boolean)
    .forEach((part) => keys.add(part))

  return Array.from(keys)
}

export function getPreviewComponent(component: Pick<Component, "id" | "slug" | "componentPath">): ComponentType | null {
  const lookupKeys = getLookupKeys(component)

  const entry = Object.entries(componentModules).find(([path]) =>
    lookupKeys.some((key) => path.split("/").includes(key))
  )

  return entry ? entry[1].default : null
}

export function getComponentSource(component: Pick<Component, "id" | "slug" | "componentPath">): CodeModule | null {
  const lookupKeys = getLookupKeys(component)

  const entry = Object.entries(codeModules).find(([path]) =>
    lookupKeys.some((key) => path.split("/").includes(key))
  )

  return entry ? entry[1] : null
}

export function getComponentCode(component: Pick<Component, "id" | "slug" | "componentPath">): string | null {
  return getComponentSource(component)?.code ?? null
}
