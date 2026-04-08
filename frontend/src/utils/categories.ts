import type { ComponentMeta } from "../types/component";

export const DEFAULT_COMPONENT_CATEGORIES = [
    "Animations",
    "Buttons",
    "Cards",
    "Charts",
    "Components",
    "Data Visualization",
    "Forms",
    "Inputs",
    "Layouts",
    "Loaders",
    "Media",
    "Menus",
    "Navigation",
    "Notifications",
    "Other",
    "Overlays",
    "Tables",
    "UI Elements",
] as const;

const CATEGORY_ALIASES: Record<string, string> = {
    animations: "Animations",
    buttons: "Buttons",
    cards: "Cards",
    charts: "Charts",
    components: "Components",
    dataviz: "Data Visualization",
    "data visualization": "Data Visualization",
    feedback: "Feedback",
    forms: "Forms",
    inputs: "Inputs",
    layout: "Layouts",
    layouts: "Layouts",
    loaders: "Loaders",
    media: "Media",
    menus: "Menus",
    navigation: "Navigation",
    notifications: "Notifications",
    other: "Other",
    overlays: "Overlays",
    tables: "Tables",
    "ui elements": "UI Elements",
};

export const normalizeCategory = (value?: string | null) => {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
        return "Components";
    }

    return CATEGORY_ALIASES[normalizedValue.toLowerCase()] ?? normalizedValue;
};

export const getCategoryOptions = (components: Pick<ComponentMeta, "category">[] = []) => {
    const merged = new Set<string>(DEFAULT_COMPONENT_CATEGORIES);

    components.forEach((component) => {
        merged.add(normalizeCategory(component.category));
    });

    return Array.from(merged).sort((left, right) => left.localeCompare(right));
};
