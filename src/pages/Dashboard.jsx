import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx"
import { AppContext } from "../context/AppContext.jsx";  
import { useContext } from "react";


const Dashboard = ({children , activeMenu}) => {
  const {user} = useContext(AppContext);
  

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

        
        { user && (
      
          <div className="flex">
                 <div className="max-[1080px]:hidden">
                    <Sidebar activeMenu={activeMenu} />
                 </div>

                 <div className="grow mx-5">{children}</div>
        </div>
       
        )}
    </div>
   
  )
}

export default Dashboard;
