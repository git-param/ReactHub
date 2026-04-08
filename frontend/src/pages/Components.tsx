import { useEffect, useState } from "react"
import { useComponentStore } from '../store/componentStore'
import { ComponentGrid } from "../components/ComponentsPage/ComponentGrid"
import { Sidebar } from "../components/ComponentsPage/Sidebar"
import { Search } from "lucide-react"
import styles from "../css/pages/Components.module.css"

const ComponentPage: React.FC = () => {
    // const isLoading = false;
    const { components, sectionLoading, fetchComponents } = useComponentStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Casting JSON to Component[] type for TypeScript
    // const mockComponents = mockComponentsData.components as Component[];

    // Fetch components from API on component mount
    useEffect(()=> {
        fetchComponents();
    }, [fetchComponents]);

    const isLoading = sectionLoading.components;

    // Only show published components on the browse page
    const publishedComponents = components.filter((c) => c.status === 'published');

    // Filtering published components based on search query and active category
    const filteredComponents = publishedComponents.filter((component) => {
        const displayName = component.name ?? component.title ?? '';
        const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || component.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
    return (
        <div className={styles.pageWrapper}>

            {/* Main Layout */}
            <div className={styles.container}>
                <div className={styles.mainGrid}>

                    {/* Left-Sidebar */}
                    <aside className={styles.leftSidebar}>
                        <Sidebar 
                            components={publishedComponents}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                         />
                    </aside>

                    {/* Center-Main Content */}
                    <main className={styles.mainContent}>
                        {/* Search Bar */}
                        <div className={styles.searchBar}>
                            {/* Right-Search bar */}
                            <div className={styles.searchWrapper}>
                                <Search className={styles.searchIcon} />
                                <input
                                    type="text"
                                    value={searchQuery }
                                    onChange={(e)=> setSearchQuery(e.target.value)}
                                    placeholder="Search components..."
                                    className={styles.searchInput}
                                />
                                
                            </div>
                        </div>
                        
                        <ComponentGrid 
                            components={filteredComponents} 
                            isLoading={isLoading}
                        />
                    </main>

                    {/* Right sidebar */}
                    <aside className={styles.rightSidebar}>
                        <div className={styles.rightSidebarSticky}>
                            <div className={styles.placeholderCard}>
                                <p className={styles.placeholderText}>Reserved for future content</p>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    )
}

export default ComponentPage