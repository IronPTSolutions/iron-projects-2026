import { useEffect, useState } from "react";
import { getUser } from "../services/api-service";
import { useParams } from "react-router-dom";

export default function useUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetch() {
      const project = await getUser(id);
      setUser(project);
    }

    fetch();
  }, [id]);

  return { user, loading: user === null };
}
