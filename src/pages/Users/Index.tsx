import { useEffect } from "react";
import { Table, Sheet, IconButton, Box } from "@mui/joy";
import PageWrapper from "../../components/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/users";
import { getUsers } from "../../api/users";
import { useNotification } from "../../context/NotificationContext";
import TableSkeleton from "../../components/TableSkeleton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function Index() {
  const { setNotification } = useNotification();
  const {
    data: { data: usersQuery } = {},
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = usersQuery?.data?.users as User[];

  const exportCSV = () => {
    setNotification({
      message: "Hola Joshua, esto aun no funciona, pero pronto lo hará! 😎",
      type: "primary",
    });
  };

  useEffect(() => {
    if (isError) {
      setNotification({
        message: error?.message || "An error occurred",
        type: "danger",
      });
    }
  }, [isError, error, setNotification]);

  return (
    <>
      <PageWrapper
        title="Users"
        button={{
          label: "Export CSV",
          color: "primary",
          onClick: exportCSV,
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Sheet
            sx={{
              width: "100%",
              boxShadow: "sm",
              borderRadius: "sm",
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "auto",
              "--TableCell-height": "40px",
              // the number is the amount of the header rows.
              "--TableHeader-height": "calc(1 * var(--TableCell-height))",
              "--Table-firstColumnWidth": "80px",
              "--Table-lastColumnWidth": "144px",
              // background needs to have transparency to show the scrolling shadows
              "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
              "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            }}
          >
            {!users && <TableSkeleton />}
            {users && (
              <Table
                borderAxis="xBetween"
                size="md"
                stickyFooter={false}
                stickyHeader={false}
                variant="plain"
                sx={{
                  borderRadius: "md",
                  "& tr > *:last-child": {
                    position: "sticky",
                    right: 0,
                    bgcolor: "var(--TableCell-headBackground)",
                  },
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "30%" }}>Name</th>
                    <th style={{ width: "40%" }}>Email</th>
                    <th style={{ width: "20%" }}>Created At</th>
                    <th style={{ textAlign: "center", width: "75px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {(user.createdAt &&
                          new Date(user.createdAt).toLocaleDateString()) ||
                          "unknown"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <IconButton color="primary" size="sm" variant="soft">
                          <MoreHorizIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}>Total: {users?.length}</td>
                  </tr>
                </tfoot>
              </Table>
            )}
          </Sheet>
        </Box>
      </PageWrapper>
    </>
  );
}

export default Index;
