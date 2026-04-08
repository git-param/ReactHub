// import { useEffect, useMemo } from "react";
// import TrendingComponentCard from "./TrendingComponentCard";
// import { Link } from "react-router-dom";
// import { useComponentStore } from "../../store/componentStore";
// import type { Component } from "../../types/component";

// function TrendingComponent() 
// {
//     const { components, fetchComponents } = useComponentStore();

//     useEffect(() => {
//         if (components.length === 0) fetchComponents();
//       }, [components.length, fetchComponents]);
//       const trending = useMemo(() => 
//     {
//       const topByCategory: Record<string, Component> = {};
//       components.forEach((comp) => 
//       {
//         const existing = topByCategory[comp.category];

//         if (
//           !existing ||
//           (comp.votes?.length ?? 0) > (existing.votes?.length ?? 0)
//         ) 
//         {
//           topByCategory[comp.category] = comp;
//         };
//         return Object.values(topByCategory);
//       }, [components]);
//     }
//     )
  

//   return (

//     <section className="mx-auto px-20 py-20">
//       <div className="flex justify-between items-center mb-12">
//         <div>
//           <h2 className="text-2xl font-bold">Trending Components</h2>
//           <p className="text-gray-100 dark:text-gray-400 mt-2">Most liked component from each category</p>
//         </div>

//         <Link to="/components">
//           <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
//             View All →
//           </button>
//         </Link>
//       </div>

//       {trending.length === 0 ? (
//         <p className="text-gray-500 dark:text-gray-400">
//           No trending components yet.
//         </p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

//             {trending.map((comp) => (
//               <TrendingComponentCard
//                 key={comp.id}
//                 title={comp.name ?? comp.title ?? ''}
//                 description={comp.description}
//                 category={comp.category}
//                 likes={comp.votes?.length ?? 0}
//                 comments={comp.comments?.length ?? 0}
//               />
//             ))}

//           </div>
//         )
//         }

//     </section>
//   )
// }
      
// export default TrendingComponent;


import { useEffect, useMemo } from "react";
import TrendingComponentCard from "./TrendingComponentCard";
import { Link } from "react-router-dom";
import { useComponentStore } from "../../store/componentStore";
import type { Component } from "../../types/component";
import styles from "../../css/Landing/TrendingComponent.module.css";

function TrendingComponent() {
  const { components, fetchComponents } = useComponentStore();

  useEffect(() => {
    if (components.length === 0) fetchComponents();
  }, [components.length, fetchComponents]);

  const trending = useMemo(() => {
    const topByCategory: Record<string, Component> = {};
    let count = 0;

    components.forEach((comp) => {
      const existing = topByCategory[comp.category];
      const voteCount = comp.votes?.length ?? 0;
      const existingVoteCount = existing?.votes?.length ?? 0;

      if ((!existing || voteCount > existingVoteCount) && count < 6) {
        if (voteCount > 0) {
          topByCategory[comp.category] = comp;
          count++;
        }
      }
    });

    return Object.values(topByCategory);
  }, [components]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Trending Components</h2>
          <p className={styles.subtitle}>
            Most liked component from each category
          </p>
        </div>

        <Link to="/components">
          <button className={styles.viewAllButton}>
            View All →
          </button>
        </Link>
      </div>

      {trending.length === 0  ? (
        <p className={styles.emptyText}>
          No trending components yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {trending.map((comp) => (
            <Link key={comp.id} to={`/components/${comp.id}`}>
              <TrendingComponentCard
                title={comp.name ?? comp.title ?? ""}
                description={comp.description}
                category={comp.category}
                likes={comp.votes?.length ?? 0}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default TrendingComponent;
