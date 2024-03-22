import { Sheet, Table } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/users";
function Index() {
  const { data } = useQuery("users", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
  });

  const users = data.data?.users as User[];

  return (
    <Sheet>
      <h1>Users</h1>
      <Sheet>
        <Table
          borderAxis="xBetween"
          size="md"
          stickyFooter={false}
          stickyHeader={false}
          variant="plain"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Correo</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users?.map((user: User) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toISOString()}</td>
                  <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Total: {data?.length}</td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </Sheet>
  );
}

export default Index;
