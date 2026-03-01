// import 

import LandingPage from "./pages/Landing";
import Navbar from "./components/Navbar";

function App() 
{
  return (
    <>
      <Navbar/>
      {/* <h1 className="text-4xl font-bold text-blue-500">
        Tailwind v4 Working 🚀
      </h1> */}
        
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
  DARK MODE TEST
</div>
      <LandingPage/>
    </>
  );
}
export default App;