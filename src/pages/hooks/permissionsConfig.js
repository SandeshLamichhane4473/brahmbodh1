// hooks/usePermission.js
 
import { useAuth } from '../../context/AuthContext';
 

const usePermission = (action) => {
  const { user} = useAuth(); // assumes user object is available
  if (!user || !user.role) return false;

  const userRole =  user.role;
  if(action==='blog'){
     if(userRole!=="admin" ){
        return false
     }
     else{

     return true;
     }

  }


};

export default usePermission;
