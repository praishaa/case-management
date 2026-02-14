import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const roleData = userDoc.exists() ? userDoc.data().role : null;

          setCurrentUser(user);
          setRole(roleData);

          // 🔥 Send to Redux
          dispatch(setUser({ user, role: roleData }));
        } catch (error) {
          console.error(error);
        }
      } else {
        setCurrentUser(null);
        setRole(null);

        dispatch(clearUser());
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  const value = {
    currentUser,
    role,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
